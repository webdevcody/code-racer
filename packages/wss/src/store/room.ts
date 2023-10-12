import type { UserSession, Room } from "./types";
import { ROOM_KEYS, USER_SESSION_KEYS } from "../consts";
import LinkedListMemory from "./data-structure";

/**
 *  Methods are provided to you already.
 *
 *  If this needs to be configured or if the keys of
 *
 *  the object interface named Room changes, then do refer
 *  to the constant enum, ROOM_KEYS.
 */
class RoomMemoryStore extends LinkedListMemory<Room, keyof Room> {
	constructor() {
		super();
	}

	addRoom(room: Room): void {
		this.append(room);
	}

	findRoom(room: Room): Room | undefined {
		return this.get(room, ROOM_KEYS.roomID)?.value;
	}

	findRoomByRoomID(roomID: string): Room | undefined {
		return this.getItemIfStringEqualToKeyValue(roomID, ROOM_KEYS.roomID)?.value;
	}

	removeRoom(room: Room): Room | undefined {
		return this.remove(room, ROOM_KEYS.roomID)?.value;
	}

	removeRoomByRoomID(roomID: string): Room | undefined {
		return this.removeItemIfStringEqualToKeyValue(roomID, ROOM_KEYS.roomID)
			?.value;
	}

	addUserSessionToRoom(
		roomID: string,
		userSessionOrUserID: UserSession,
	): Room | undefined {
		const room = this.findRoomByRoomID(roomID);
		room?.participants.append(userSessionOrUserID);
		return room;
	}

	removeUserSessionFromRoom(
		roomID: string,
		userSession: UserSession | string,
	): Room | undefined {
		const room = this.getItemIfStringEqualToKeyValue(roomID, ROOM_KEYS.roomID)
			?.value;
		if (room) {
			if (typeof userSession === "string") {
				room.participants.removeItemIfStringEqualToKeyValue(
					userSession,
					USER_SESSION_KEYS.userID,
				);
			} else {
				room.participants.remove(userSession, USER_SESSION_KEYS.userID);
			}
			const ROOM_IS_EMPTY = room.participants.length === 0;
			if (ROOM_IS_EMPTY) {
				this.removeRoomByRoomID(roomID);
			}
		}
		return room;
	}
}

export default RoomMemoryStore;
