import { RaceStatus } from "../consts";
import type { ParticipantInformation, RoomInformation } from "../store/types";

export type SendNotificationPayload = {
	title?: string;
	description?: string;
	variant?: "default" | "destructive" | "middle";
};

export type SendRoomIDPayload = {
	roomID: string;
	roomOwnerID: string;
};

export interface ServerToClientEvents {
	SendError: (_payload: Error) => void;
	SendNotification: (_payload: SendNotificationPayload) => void;

	SendRoomID: (_payload: SendRoomIDPayload) => void;

	PlayerJoinedOrLeftRoom: (_payload: Array<ParticipantInformation>) => void;

	SendGameStatusOfRoom: (_payload: RaceStatus) => void;
	SendRoomOwnerID: (_payload: string) => void;

	SendRoomInformation: (_payload: RoomInformation) => void;
	// GameStateUpdate: (_payload: GameStateUpdatePayload) => void;
	// UserRaceEnter: (_payload: UserRacePresencePayload) => void;
	// UserRaceLeave: (_payload: UserRacePresencePayload) => void;
	// UserRaceResponse: (_payload: UserRaceResponsePayload) => void;
	// UserEnterFullRace: () => void;
	// RoomJoined: (_payload: RoomJoinedResponsePayload) => void;
	// RoomCreated: (_payload: { roomId: string }) => void;
	// UpdateParticipants: (_payload: UpdateParticipantsPayload) => void;
	// SendNotification: (_payload: SendNotificationPayload) => void;
	// UserRoomRaceResponse: (_payload: UserRoomRaceResponsePayload) => void;
	// Error: (_payload: Error) => void;
}
