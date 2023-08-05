import { Prisma, RaceParticipant } from "@code-racer/app/src/lib/prisma";
import { UserRacePresencePayload } from "./common";
import { SocketId } from "../game";
import { RaceStatus } from "../types";

type NewType = {
  participants: SocketId[];
  status: RaceStatus;
};

type Race = NewType;

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
  race: Prisma.RaceGetPayload<Record<string, never>>;
  participants: Participant[];
  raceParticipantId: RaceParticipant["id"];
  raceStatus: RaceStatus;
};

export type RoomJoinedResponsePayload = {
  race: Prisma.RaceGetPayload<{ include: { participants: true } }>;
  participants: Participant[];
  raceStatus: RaceStatus;
  participantId: string;
};

export type UpdateParticipantsPayload = {
  participants: Participant[];
};

export type UserRoomRaceResponsePayload = {
  race: Race;
};

export type SendNotificationPayload = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "middle";
}

export interface ServerToClientEvents {
  GameStateUpdate: (payload: GameStateUpdatePayload) => void;
  UserRaceEnter: (payload: UserRacePresencePayload) => void;
  UserRaceLeave: (payload: UserRacePresencePayload) => void;
  UserRaceResponse: (payload: UserRaceResponsePayload) => void;
  UserEnterFullRace: () => void;
  RoomJoined: (payload: RoomJoinedResponsePayload) => void;
  RoomCreated: (payload: { roomId: string }) => void;
  UpdateParticipants: (payload: UpdateParticipantsPayload) => void;
  SendNotification: (payload: SendNotificationPayload) => void;
  UserRoomRaceResponse: (payload: UserRoomRaceResponsePayload) => void;
}
