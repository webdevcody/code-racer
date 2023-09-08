import { RaceStatus } from "@/consts";
import type { Language } from "@code-racer/app/src/config/languages";

export type EnterRoomPayload = {
	userID: string;
	roomID: string;
};

export type CreateRoomPayload = {
	userID: string;
	language: Language;
};

export type ChangeGameStatusOfRoomPayload = {
	roomID: string;
	raceStatus: RaceStatus;
};

export interface ClientToServerEvents {
	EnterRoom: (_payload: EnterRoomPayload) => void;

	CreateRoom: (_payload: CreateRoomPayload) => void;

	CheckIfRoomIDExists: (_payload: string) => void;

	CheckGameStatusOfRoom: (_payload: string) => void;
	ChangeGameStatusOfRoom: (_payload: ChangeGameStatusOfRoomPayload) => void;

	// PositionUpdate: (_payload: PositionUpdatePayload) => void;

	// UserRaceLeave: (_payload: UserRacePresencePayload) => void;
	// UserCreateRequest: (_payload: UserCreateRequestPayload) => void;
	// UserGetRace: (_payload: UserGetRacePayload) => void;
	// UserRaceRequest: (_payload: UserRaceRequestPayload) => void;
	// UserCreateRoom: (_payload: UserCreateRoomPayload) => void;
	// UserJoinRoom: (_payload: { raceId: string; userId?: string }) => void;
	// StartRaceCountdown: (_payload: { raceId: string }) => void;
}
