import { RaceStatus } from "../consts";
import type { Language } from "@code-racer/app/src/config/languages";

export type CreateRoomPayload = {
	userID: string;
	language: Language;
};

export type ChangeGameStatusOfRoomPayload = {
	roomID: string;
	raceStatus: RaceStatus;
};

/** POTENTIAL FEATURE:
 *  Add the word in the timestamp as well
 *  so we can have a videolike experience
 *  for the user wherein they see
 *  where their enemies are currently at.
 */
type UpdatePayload = {
	userID: string;
	roomID: string;
};

export type UpdateTimeStampPayload = {
	cpm: number;
	totalErrors: number;
	accuracy: number;
} & UpdatePayload;

export type UpdateProgressPayload = {
	progress: number;
} & UpdatePayload;

export type SendUserHasFinishedPayload = {
	timeTaken: number;
} & UpdatePayload;

export interface ClientToServerEvents {
	CreateRoom: (_payload: CreateRoomPayload) => void;

	CheckIfRoomIDExists: (_roomID: string) => void;

	CheckGameStatusOfRoom: (_payload: string) => void;
	ChangeGameStatusOfRoom: (_payload: ChangeGameStatusOfRoomPayload) => void;

	RequestRoomSnippet: (_roomID: string) => void;

	RequestRunningGameInformation: (_roomID: string) => void;

	SendUserTimeStamp: (_payload: UpdateTimeStampPayload) => void;
	SendUserProgress: (_payload: UpdateProgressPayload) => void;
	SendUserHasFinished: (_payload: SendUserHasFinishedPayload) => void;

	RequestAllPlayersProgress: (_roomID: string) => void;

	// PositionUpdate: (_payload: PositionUpdatePayload) => void;

	// UserRaceLeave: (_payload: UserRacePresencePayload) => void;
	// UserCreateRequest: (_payload: UserCreateRequestPayload) => void;
	// UserGetRace: (_payload: UserGetRacePayload) => void;
	// UserRaceRequest: (_payload: UserRaceRequestPayload) => void;
	// UserCreateRoom: (_payload: UserCreateRoomPayload) => void;
	// UserJoinRoom: (_payload: { raceId: string; userId?: string }) => void;
	// StartRaceCountdown: (_payload: { raceId: string }) => void;
}
