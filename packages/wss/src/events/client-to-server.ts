import type { Language } from "@code-racer/app/src/config/languages";
import type { UserRacePresencePayload } from "./common";
import type { Race, RaceParticipant } from "@code-racer/app/src/lib/prisma";

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
	language: Language;
	userId?: string;
};

export type UserCreateRoomPayload = {
	language: Language;
};

export type EnterRoomPayload = {
	userID: string;
	roomID: string;
};

export type CreateRoomPayload = {
	userID: string;
	language: Language;
};

export interface ClientToServerEvents {
	EnterRoom: (_payload: EnterRoomPayload) => void;

	CreateRoom: (_payload: CreateRoomPayload) => void;

	CheckIfRoomIDExists: (_payload: string) => void;
	
	// PositionUpdate: (_payload: PositionUpdatePayload) => void;
	
	// UserRaceLeave: (_payload: UserRacePresencePayload) => void;
	// UserCreateRequest: (_payload: UserCreateRequestPayload) => void;
	// UserGetRace: (_payload: UserGetRacePayload) => void;
	// UserRaceRequest: (_payload: UserRaceRequestPayload) => void;
	// UserCreateRoom: (_payload: UserCreateRoomPayload) => void;
	// UserJoinRoom: (_payload: { raceId: string; userId?: string }) => void;
	// StartRaceCountdown: (_payload: { raceId: string }) => void;
}
