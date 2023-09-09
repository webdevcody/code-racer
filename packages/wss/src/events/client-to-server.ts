import { RaceStatus } from "@/consts";
import type { Language } from "@code-racer/app/src/config/languages";

export type CreateRoomPayload = {
	userID: string;
	language: Language;
};

export type ChangeGameStatusOfRoomPayload = {
	roomID: string;
	raceStatus: RaceStatus;
};

export interface ClientToServerEvents {
	CreateRoom: (_payload: CreateRoomPayload) => void;

	CheckIfRoomIDExists: (_roomID: string) => void;

	CheckGameStatusOfRoom: (_payload: string) => void;
	ChangeGameStatusOfRoom: (_payload: ChangeGameStatusOfRoomPayload) => void;

	RequestRoomInformation: (_roomID: string) => void;

	// PositionUpdate: (_payload: PositionUpdatePayload) => void;

	// UserRaceLeave: (_payload: UserRacePresencePayload) => void;
	// UserCreateRequest: (_payload: UserCreateRequestPayload) => void;
	// UserGetRace: (_payload: UserGetRacePayload) => void;
	// UserRaceRequest: (_payload: UserRaceRequestPayload) => void;
	// UserCreateRoom: (_payload: UserCreateRoomPayload) => void;
	// UserJoinRoom: (_payload: { raceId: string; userId?: string }) => void;
	// StartRaceCountdown: (_payload: { raceId: string }) => void;
}
