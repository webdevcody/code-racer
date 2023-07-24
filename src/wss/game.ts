import { RaceParticipant, type Race } from "@prisma/client";
import { prisma } from "@/lib/prisma";

import { SocketEvents, SocketPayload } from "./events";
import { RaceFullException } from "./exceptions";
import { raise } from "@/lib/utils";
import {
  GameStateUpdatePayload,
  ParticipantRacePayload,
  participantRacePayloadSchema,
  RaceParticipantNotification,
  RaceParticipantPositionPayload,
  raceParticipantPositionPayloadSchema,
} from "./schemas";
import { type Server } from "socket.io";
import { siteConfig } from "@/config/site";

type ParticipantsMap = Map<
  //this is the socketId
  string,
  { id: RaceParticipant["id"]; position: number }
>;

export class Game {
  private static readonly START_GAME_COUNTDOWN = 5;
  private static readonly MAX_PARTICIPANTS_PER_RACE =
    siteConfig.multiplayer.maxParticipantsPerRace;
  private static readonly GAME_LOOP_INTERVAL = 500;
  private static readonly GAME_MAX_POSITION = 100;
  private activeCountdowns = new Map<Race["id"], Promise<void>>();

  private races = new Map<
    Race["id"],
    {
      status: "waiting" | "countdown" | "running" | "finished";
      participants: ParticipantsMap;
    }
  >();

  constructor(private server: Server) {
    this.initialize();
  }

  private initialize() {
    this.server.on("connection", (socket) => {
      socket.on(SocketEvents.USER_RACE_ENTER, (payload) => {
        this.handlePlayerEnterRace(payload);
      });
      socket.on("disconnect", () => {
        for (const [raceId, race] of this.races.entries()) {
          const participant = race.participants.get(socket.id);
          if (participant) {
            this.handlePlayerLeaveRace({
              participantId: participant.id,
              raceId,
              socketId: socket.id,
            });
          }
        }
      });
      socket.on(
        SocketEvents.PARTICIPANT_POSITION_UPDATE,
        (payload: RaceParticipantPositionPayload) => {
          // console.log("Received payload: ", payload)
          const parsedPayload =
            raceParticipantPositionPayloadSchema.parse(payload);
          // console.log(
          // `Race participant position payload: ${parsedPayload}`,
          // )
          this.handleParticipantPositionPayload(parsedPayload);
        },
      );
    });
  }

  private serializeParticipants(
    participants: ParticipantsMap,
  ): { id: string; socketId: string; position: number }[] {
    return Array.from(participants.entries()).map(
      ([socketId, { id, position }]) => ({
        id,
        socketId,
        position,
      }),
    );
  }

  private async handlePlayerEnterRace(payload: ParticipantRacePayload) {
    const parsedPayload = participantRacePayloadSchema.parse(payload);

    // console.log("Player entering race:", payload)
    const race = this.races.get(parsedPayload.raceId);

    if (!race) {
      this.races.set(parsedPayload.raceId, {
        status: "waiting",
        participants: new Map().set(parsedPayload.socketId, {
          id: parsedPayload.participantId,
          position: 0,
        }),
      });
    } else if (race.participants.size + 1 > Game.MAX_PARTICIPANTS_PER_RACE) {
      //TODO: Handle this exception
      throw new RaceFullException();
    } else {
      race.participants.set(parsedPayload.socketId, {
        id: parsedPayload.participantId,
        position: 0,
      });
      this.startRaceCountdown(parsedPayload.raceId);
    }

    // console.log({ raceId: parsedPayload.raceId }, "\n")

    // console.log("Races: ", this.races)

    // Emit to all players in the room that a new player has joined.
    this.server.emit(`RACE_${parsedPayload.raceId}`, {
      type: "USER_RACE_ENTER",
      payload: {
        participantId: parsedPayload.participantId,
        socketId: parsedPayload.socketId,
      } satisfies RaceParticipantNotification,
    } satisfies SocketPayload);
  }

  private async handlePlayerLeaveRace(payload: ParticipantRacePayload) {
    const parsedPayload = participantRacePayloadSchema.parse(payload);
    // console.log("Player leaving race: ", parsedPayload)

    const race =
      this.races.get(parsedPayload.raceId) ??
      raise("Yippity iuppity this server is a pile of poopity");

    race.participants.delete(parsedPayload.socketId);

    this.server.emit(`RACE_${parsedPayload.raceId}`, {
      type: "USER_RACE_LEAVE",
      payload: {
        participantId: parsedPayload.participantId,
        socketId: parsedPayload.socketId,
      } satisfies RaceParticipantNotification,
    } satisfies SocketPayload);

    if (race.participants.size === 0) {
      await this.endRace(parsedPayload.raceId);
    }

    // console.log("Races: ", this.races)
  }

  private startRace(raceId: string) {
    const interval = setInterval(async () => {
      const race = this.races.get(raceId);
      if (race) {
        if (race.status !== "running") {
          race.status = "running";
          // console.log("Started race: ", raceId)
          await prisma.race.update({
            where: {
              id: raceId,
            },
            data: {
              startedAt: new Date(),
            },
          });
        }

        // console.log("Emitting game loop for race:", raceId)

        this.server.emit(`RACE_${raceId}`, {
          type: "GAME_STATE_UPDATE",
          payload: {
            raceState: {
              id: raceId,
              status: race.status,
              participants: this.serializeParticipants(race.participants),
            },
          } satisfies GameStateUpdatePayload,
        } satisfies SocketPayload);
      } else {
        clearInterval(interval);
      }
    }, Game.GAME_LOOP_INTERVAL);
  }

  private async endRace(raceId: string) {
    const race = this.races.get(raceId) ?? raise("Why tf would this happen?");

    race.status = "finished";

    this.server.emit(`RACE_${raceId}`, {
      type: "GAME_STATE_UPDATE",
      payload: {
        raceState: {
          id: raceId,
          status: race.status,
          participants: this.serializeParticipants(race.participants),
        },
      } satisfies GameStateUpdatePayload,
    } satisfies SocketPayload);

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

    const countdownPromise = new Promise<void>((resolve) => {
      let countdown = Game.START_GAME_COUNTDOWN;
      const race = this.races.get(raceId) ?? raise("Bruh ☠️");

      const interval = setInterval(() => {
        this.server.emit(`RACE_${raceId}`, {
          type: "GAME_STATE_UPDATE",
          payload: {
            raceState: {
              participants: this.serializeParticipants(race.participants),
              status: "countdown",
              id: raceId,
              countdown,
            },
          },
        } satisfies SocketPayload);

        // console.log(`Race: ${raceId} Countdown: ${countdown}`)

        countdown--;

        if (countdown === 0) {
          this.server.emit(`RACE_${raceId}`, {
            type: "GAME_STATE_UPDATE",
            payload: {
              raceState: {
                participants: this.serializeParticipants(race.participants),
                status: "countdown",
                id: raceId,
                countdown,
              },
            },
          } satisfies SocketPayload);

          this.startRace(raceId);
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    }).then(() => {
      this.activeCountdowns.delete(raceId);
    });

    this.activeCountdowns.set(raceId, countdownPromise);
  }

  private handleParticipantPositionPayload(
    payload: RaceParticipantPositionPayload,
  ) {
    const race = this.races.get(payload.raceId);

    //TODO: Log a warning or handle exception
    if (!race) return;

    const parsedPayload = raceParticipantPositionPayloadSchema.parse(payload);

    const participant = race.participants.get(parsedPayload.socketId);

    //TODO: Log a warning or handle exception
    if (!participant) return;

    participant.position = parsedPayload.position;

    if (parsedPayload.position >= Game.GAME_MAX_POSITION) {
      this.endRace(parsedPayload.raceId);
    }
  }
}
