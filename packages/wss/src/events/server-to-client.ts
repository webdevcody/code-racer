import { UserRacePresencePayload } from "./common";
import { Snippet } from "@code-racer/app/src/lib/prisma";

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
  snippet: Snippet;
  raceId: string;
  raceParticipantId: string;
};

export interface ServerToClientEvents {
  GameStateUpdate: (payload: GameStateUpdatePayload) => void;
  UserRaceEnter: (payload: UserRacePresencePayload) => void;
  UserRaceLeave: (payload: UserRacePresencePayload) => void;
  UserRaceResponse: (payload: UserRaceResponsePayload) => void;
  UserEnterFullRace: () => void;
}
