import { snippetLanguages } from "@code-racer/app/src/config/languages";
import { UserRacePresencePayload } from "./common";

export type PositionUpdatePayload = UserRacePresencePayload & {
  raceId: string;
  position: number;
};

export type UserRaceRequestPayload = {
  language: string;
  userId?: string;
};

export interface ClientToServerEvents {
  PositionUpdate: (payload: PositionUpdatePayload) => void;
  UserRaceEnter: (payload: UserRacePresencePayload) => void;
  UserRaceLeave: (payload: UserRacePresencePayload) => void;
  UserRaceRequest: (payload: UserRaceRequestPayload) => void;
}
