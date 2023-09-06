import type { Prisma, RaceParticipant } from "@code-racer/app/src/lib/prisma";
import type { UserRacePresencePayload } from "./common";
import type { RaceStatus } from "@/consts";
import type { Participant } from "@/store/memory";

type NewType = {
	participants: Array<string>;
	status: RaceStatus;
};

type Race = NewType;

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
};

export interface ServerToClientEvents {
	GameStateUpdate: (_payload: GameStateUpdatePayload) => void;
	UserRaceEnter: (_payload: UserRacePresencePayload) => void;
	UserRaceLeave: (_payload: UserRacePresencePayload) => void;
	UserRaceResponse: (_payload: UserRaceResponsePayload) => void;
	UserEnterFullRace: () => void;
	RoomJoined: (_payload: RoomJoinedResponsePayload) => void;
	RoomCreated: (_payload: { roomId: string }) => void;
	UpdateParticipants: (_payload: UpdateParticipantsPayload) => void;
	SendNotification: (_payload: SendNotificationPayload) => void;
	UserRoomRaceResponse: (_payload: UserRoomRaceResponsePayload) => void;
	Error: (_payload: Error) => void;
}
