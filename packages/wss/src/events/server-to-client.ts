import { Prisma, Race, RaceParticipant } from "@code-racer/app/src/lib/prisma";
import { UserRacePresencePayload } from "./common";

type Timestamp = number;

type Participant = {
  id: string;
  socketId: string;
  position: number;
  finishedAt: Timestamp | null;
};

export type GameStateUpdatePayload = {
  raceState: {
    id: string;
    status: "waiting" | "countdown" | "running" | "finished";
    participants: Participant[];
    countdown?: number;
  };
};

export type UserRaceResponsePayload = {
  race: Race;
  raceParticipantId: RaceParticipant["id"];
};

export type RoomJoinedResponsePayload = {
  userId: string;
  roomId: string;
  participants: Participant[];
};

export type UpdateParticipantsPayload = {
  participants: Participant[];
};

export interface ServerToClientEvents {
  GameStateUpdate: (payload: GameStateUpdatePayload) => void;
  UserRaceEnter: (payload: UserRacePresencePayload) => void;
  UserRaceLeave: (payload: UserRacePresencePayload) => void;
  UserRaceResponse: (payload: UserRaceResponsePayload) => void;
  UserEnterFullRace: () => void;
  RoomJoined: (payload: RoomJoinedResponsePayload) => void;
  UpdateParticipants: (payload: UpdateParticipantsPayload) => void;
  SendNotification: (payload: { title: string; message: string }) => void;
  UserRoomRaceResponse: (payload: { race: Race }) => void;
}
