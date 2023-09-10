import { RaceStatus } from "../consts";
import type {
	CustomSnippet,
	ParticipantInformation,
	RunningGameInformationPayload,
} from "../store/types";

export type SendNotificationPayload = {
	title?: string;
	description?: string;
	variant?: "default" | "destructive" | "middle";
};

export type SendRoomIDPayload = {
	roomID: string;
	roomOwnerID: string;
};

export type GameFinishedPayload = {
	endedAt: Date;
	startedAt: Date;
} & RunningGameInformationPayload;

export type ParticipantsProgressPayload = {
	userID: string;
	displayImage: string;
	displayName: string;
	progress: number;
};

export interface ServerToClientEvents {
	SendError: (_payload: Error) => void;
	SendNotification: (_payload: SendNotificationPayload) => void;

	SendRoomID: (_payload: SendRoomIDPayload) => void;

	PlayerJoinedOrLeftRoom: (_payload: Array<ParticipantInformation>) => void;

	SendGameStatusOfRoom: (_payload: RaceStatus) => void;
	SendRoomOwnerID: (_payload: string) => void;

	SendRoomSnippet: (_snippet: CustomSnippet) => void;

	SendRunningGameInformation: (_payload: RunningGameInformationPayload) => void;

	GameFinished: (_payload: GameFinishedPayload) => void;

	SendAllPlayersProgress: (
		_payload: Array<ParticipantsProgressPayload>,
	) => void;
}
