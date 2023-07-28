import { Language } from "@code-racer/app/src/config/languages";
import { siteConfig } from "@code-racer/app/src/config/site";
import type { RaceParticipant } from "@code-racer/app/src/lib/prisma";
import { prisma } from "@code-racer/app/src/lib/prisma";
import { type Server } from "socket.io";
import {
  PositionUpdatePayload,
  type ClientToServerEvents,
} from "./events/client-to-server";
import { UserRacePresencePayload } from "./events/common";
import { type ServerToClientEvents } from "./events/server-to-client";
import { raceMatchMaking } from "./match-making";
import { RaceStatus, raceStatus } from "./types";

type SocketId = string;
type RaceId = string;
type Timestamp = number;

type Participant = {
  id: RaceParticipant["id"];
  raceId: RaceId;
  position: number;
  finishedAt: Timestamp | null;
};

type Race = {
  participants: SocketId[];
  status: RaceStatus;
};

export class Game {
  private static readonly START_GAME_COUNTDOWN = 10;
  private static readonly MAX_PARTICIPANTS_PER_RACE =
    siteConfig.multiplayer.maxParticipantsPerRace;
  private static readonly GAME_LOOP_INTERVAL = 500;
  private static readonly GAME_MAX_POSITION = 100;

  /**
   * Race socket room name
   */
  private static Room(raceId: string) {
    return `RACE_${raceId}`;
  }

  private activeCountdowns = new Map<RaceId, Promise<void>>();

  private races = new Map<RaceId, Race>();

  private participants = new Map<SocketId, Participant>();

  constructor(
    private server: Server<ClientToServerEvents, ServerToClientEvents>
  ) {
    this.initialize();
  }

  private initialize() {
    this.server.on("connection", (socket) => {
      socket.on("UserRaceRequest", async (payload) => {
        const { race, raceParticipantId } = await raceMatchMaking(
          payload.language as Language,
          payload.userId
        );

        socket.join(Game.Room(race.id));

        this.handlePlayerEnterRace({
          raceId: race.id,
          raceParticipantId,
          socketId: socket.id,
        });

        socket.emit("UserRaceResponse", {
          race,
          raceParticipantId,
        });
      });

      socket.on("disconnect", () => {
        const participant = this.participants.get(socket.id);

        //this happens if the race ended successfully
        if (!participant) return;

        this.handlePlayerLeaveRace({
          raceId: participant.raceId,
          raceParticipantId: participant.id,
          socketId: socket.id,
        });
      });

      socket.on("PositionUpdate", (payload: PositionUpdatePayload) => {
        this.handleParticipantPositionPayload(payload);
      });
    });
  }

  private getRaceParticipants(
    race: Race
  ): (Participant & { socketId: string })[] {
    const participants: (Participant & { socketId: string })[] = [];
    //Leave this as a raw for loop, .map will create more memory and will have possibly undefined values that will need to be filtered out
    for (let i = 0; race.participants.length > i; i++) {
      const socketId = race.participants[i];
      const participant = this.participants.get(socketId);
      if (participant) {
        // TODO : make typescipt happy
        //@ts-expect-error oks
        participant.socketId = socketId;
        //@ts-expect-error oks
        participants.push(participant);
      }
    }

    return participants;
  }

  private createRaceWithParticipant(
    raceId: string,
    participant: { id: string; socketId: string }
  ) {
    this.participants.set(participant.socketId, {
      id: participant.id,
      raceId,
      position: 0,
      finishedAt: null,
    });
    return this.races.set(raceId, {
      status: raceStatus.WAITING,
      participants: [participant.socketId],
    });
  }

  private async deleteRaceParticipant(raceParticipantId: string) {
    return await prisma.raceParticipant.delete({
      where: {
        id: raceParticipantId,
      },
    });
  }

  private async handlePlayerEnterRace(payload: UserRacePresencePayload) {
    const race = this.races.get(payload.raceId);

    if (!race) {
      this.createRaceWithParticipant(payload.raceId, {
        id: payload.raceParticipantId,
        socketId: payload.socketId,
      });
    } else if (race.participants.length + 1 > Game.MAX_PARTICIPANTS_PER_RACE) {
      return this.handleParticipantJoinedFullRace(
        payload.socketId,
        payload.raceParticipantId
      );
    } else {
      this.participants.set(payload.socketId, {
        id: payload.raceParticipantId,
        raceId: payload.raceId,
        position: 0,
        finishedAt: null,
      });
      race.participants.push(payload.socketId);
      this.startRaceCountdown(payload.raceId);
    }

    // Emit to all players in the room that a new player has joined.
    this.server.to(Game.Room(payload.raceId)).emit("UserRaceEnter", payload);
  }

  private handleParticipantJoinedFullRace(
    socketId: string,
    raceParticipantId: string
  ) {
    this.server.sockets.sockets.get(socketId)?.emit("UserEnterFullRace");

    void this.deleteRaceParticipant(raceParticipantId);
  }

  private handlePlayerLeaveRace(payload: UserRacePresencePayload) {
    const race = this.races.get(payload.raceId);

    if (!race) {
      console.warn("Player left a race that doesn't exist.", {
        raceId: payload.raceId,
        participantId: payload.raceParticipantId,
        time: new Date(),
        level: "warn",
      });
      return;
    }

    const participant = this.participants.get(payload.socketId);

    //Participant left before completing the race
    if (participant && !participant.finishedAt) {
      void this.deleteRaceParticipant(payload.raceParticipantId);
    }

    this.participants.delete(payload.socketId);

    //Removes the race participant in place.
    //Array.filter could be used but that would create more memory
    for (let i = race.participants.length - 1; i >= 0; i--) {
      if (race.participants[i] === payload.socketId) {
        race.participants.splice(i, 1);
      }
    }

    this.server.to(Game.Room(payload.raceId)).emit("UserRaceLeave", payload);

    if (
      race.participants.length === 0 &&
      race.status === raceStatus.COUNTDOWN
    ) {
      this.activeCountdowns.delete(payload.raceId);
      return;
    }

    const isRaceEnded = this.isRaceEnded(race);
    if (isRaceEnded) {
      void this.endRace(payload.raceId);
    }
  }

  private startRace(raceId: string) {
    const interval = setInterval(() => {
      const race = this.races.get(raceId);
      //This means that the race is finished
      if (!race) {
        clearInterval(interval);
        return;
      }

      if (race.status !== raceStatus.RUNNING) {
        race.status = raceStatus.RUNNING;
        void prisma.race
          .update({
            where: {
              id: raceId,
            },
            data: {
              startedAt: new Date(),
            },
          })
          .then(() => { });
      }

      this.server.to(Game.Room(raceId)).emit("GameStateUpdate", {
        raceState: {
          id: raceId,
          status: race.status,
          participants: this.getRaceParticipants(race),
        },
      });
    }, Game.GAME_LOOP_INTERVAL);
  }

  private async endRace(raceId: string) {
    const race = this.races.get(raceId);

    if (!race) {
      console.warn("Trying to end a race that doesn't exist.", {
        raceId,
        time: new Date(),
        level: "warn",
      });
      return;
    }

    race.status = raceStatus.FINISHED;

    this.server.to(Game.Room(raceId)).emit("GameStateUpdate", {
      raceState: {
        id: raceId,
        status: race.status,
        participants: this.getRaceParticipants(race),
      },
    });

    for (const socketId of race.participants) {
      this.participants.delete(socketId);
    }

    this.races.delete(raceId);

    await prisma.race.update({
      where: {
        id: raceId,
      },
      data: {
        endedAt: new Date(),
      },
    });
  }

  private startRaceCountdown(raceId: string) {
    if (this.activeCountdowns.has(raceId)) {
      return;
    }

    const countdownPromise = new Promise<void>((resolve, reject) => {
      let countdown = Game.START_GAME_COUNTDOWN;
      const race = this.races.get(raceId);

      if (!race) {
        console.warn(
          "Trying to start a countdown for a race that doesn't exist.",
          {
            raceId,
            time: new Date(),
          }
        );
        return reject();
      }

      race.status = raceStatus.COUNTDOWN;

      const interval = setInterval(() => {
        this.server.to(Game.Room(raceId)).emit("GameStateUpdate", {
          raceState: {
            participants: this.getRaceParticipants(race),
            status: race.status,
            id: raceId,
            countdown,
          },
        });

        countdown--;

        if (countdown === 0) {
          this.server.to(Game.Room(raceId)).emit("GameStateUpdate", {
            raceState: {
              participants: this.getRaceParticipants(race),
              status: race.status,
              id: raceId,
              countdown,
            },
          });

          this.startRace(raceId);
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    }).finally(() => {
      this.activeCountdowns.delete(raceId);
    });

    this.activeCountdowns.set(raceId, countdownPromise);
  }

  private handleParticipantPositionPayload(payload: PositionUpdatePayload) {
    const race = this.races.get(payload.raceId);

    if (!race) {
      console.warn(
        "Trying to update a participant position on a race that doesn't exist.",
        {
          raceId: payload.raceId,
          participant: payload.raceParticipantId,
          time: new Date(),
        }
      );
      return;
    }

    const participant = this.participants.get(payload.socketId);

    if (!participant) {
      console.warn("Trying to update a participant that doesn't exist.", {
        raceId: payload.raceId,
        participant: payload.raceParticipantId,
        time: new Date(),
      });
      return;
    }

    participant.position = payload.position;

    if (participant.position >= Game.GAME_MAX_POSITION) {
      if (participant.finishedAt) return;
      participant.finishedAt = new Date().getTime();
    }

    const isRaceEnded = this.isRaceEnded(race);

    if (isRaceEnded) {
      void this.endRace(payload.raceId);
    }
  }

  // checks if every participant has finished the race
  private isRaceEnded(race: Race) {
    let finishedParticipants = 0;
    const participants = this.getRaceParticipants(race);
    for (let i = 0; i < participants.length; i++) {
      if (participants[i].finishedAt) {
        finishedParticipants++;
      }
    }

    return finishedParticipants >= race.participants.length;
  }
}
