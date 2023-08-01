import { Race, RaceParticipant } from "@code-racer/app/src/lib/prisma";
import { UserRacePresencePayload } from "./common";

type Timestamp = number;

export type GameStateUpdatePayload = {
  raceState: {
    id: string;
    status: "waiting" | "countdown" | "running" | "finished";
    participants: {
      id: string;
      socketId: string;
      position: number;
      finishedAt: Timestamp | null;
    }[];
    countdown?: number;
  };
};

export type UserRaceResponsePayload = {
  race: Race
  raceParticipantId: RaceParticipant["id"];
};

export interface ServerToClientEvents {
  GameStateUpdate: (payload: GameStateUpdatePayload) => void;
  UserRaceEnter: (payload: UserRacePresencePayload) => void;
  UserRaceLeave: (payload: UserRacePresencePayload) => void;
  UserRaceResponse: (payload: UserRaceResponsePayload) => void;
  UserEnterFullRace: () => void;
}
