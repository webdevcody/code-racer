import type { Language } from "@code-racer/app/src/config/languages";
import type { UserRacePresencePayload } from "./common";
import type { RaceParticipant } from "@code-racer/app/src/lib/prisma";

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

export interface ClientToServerEvents {
	PositionUpdate: (_payload: PositionUpdatePayload) => void;
	UserRaceEnter: (_payload: UserRacePresencePayload) => void;
	UserRaceLeave: (_payload: UserRacePresencePayload) => void;
	UserCreateRequest: (_payload: UserCreateRequestPayload) => void;
	UserGetRace: (_payload: UserGetRacePayload) => void;
	UserRaceRequest: (_payload: UserRaceRequestPayload) => void;
	UserCreateRoom: (_payload: UserCreateRoomPayload) => void;
	UserJoinRoom: (_payload: { raceId: string; userId?: string }) => void;
	StartRaceCountdown: (_payload: { raceId: string }) => void;
}
