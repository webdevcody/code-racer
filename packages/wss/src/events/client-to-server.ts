import {
  Language,
  snippetLanguages,
} from "@code-racer/app/src/config/languages";
import { UserRacePresencePayload } from "./common";
import { Socket } from "socket.io";
import { RaceParticipant } from "@code-racer/app/src/lib/prisma";

export type PositionUpdatePayload = UserRacePresencePayload & {
  raceId: string;
  position: number;
};

export type UserCreateRequestPayload = {
  language: string;
  userId?: string;
};

export type UserRaceRequestPayload = {
  raceId: string;
  participantId: RaceParticipant["id"];
};

export type UserGetRacePayload = {
  language: string;
  userId?: string;
};

export type UserCreateRoomPayload = {
  roomId: string;
  language: Language;
};

export interface ClientToServerEvents {
  PositionUpdate: (payload: PositionUpdatePayload) => void;
  UserRaceEnter: (payload: UserRacePresencePayload) => void;
  UserRaceLeave: (payload: UserRacePresencePayload) => void;
  UserCreateRequest: (payload: UserCreateRequestPayload) => void;
  UserGetRace: (payload: UserGetRacePayload) => void;
  UserRaceRequest: (payload: UserRaceRequestPayload) => void;
  UserCreateRoom: (payload: UserCreateRoomPayload) => void;
  UserJoinRoom: (payload: { raceId: string; userId?: string }) => void;
  StartRaceCountdown: (payload: { raceId: string }) => void;
}
