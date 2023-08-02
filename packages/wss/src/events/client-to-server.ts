import {
  Language,
  snippetLanguages,
} from "@code-racer/app/src/config/languages";
import { UserRacePresencePayload } from "./common";
import { Socket } from "socket.io";

export type PositionUpdatePayload = UserRacePresencePayload & {
  raceId: string;
  position: number;
};

export type UserRaceRequestPayload = {
  language: string;
  userId?: string;
};

export type UserCreateRoomPayload = {
  roomId: string;
  language: Language;
  userId: string;
};


export interface ClientToServerEvents {
  PositionUpdate: (payload: PositionUpdatePayload) => void;
  UserRaceEnter: (payload: UserRacePresencePayload) => void;
  UserRaceLeave: (payload: UserRacePresencePayload) => void;
  UserRaceRequest: (payload: UserRaceRequestPayload) => void;
  UserCreateRoom: (payload: UserCreateRoomPayload) => void;
  UserJoinRoom: (payload: { raceId: string; userId: string }) => void;
  UserLeaveRoom: (payload: { raceId: string; userId: string }) => void;
  StartRaceCountdown: (payload: { raceId: string }) => void;
}
