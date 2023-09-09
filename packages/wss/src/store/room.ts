import type { UserSession, Room } from "./types";
import { ROOM_KEYS, USER_SESSION_KEYS } from "@/consts";
import LinkedListMemory from "./memory";

/**
 *  Methods are provided to you already.
 * 
 *  If this needs to be configured or if the keys of 
 * 
 *  the object interface named Room
 */
class RoomMemoryStore extends LinkedListMemory<Room, keyof Room> {
  constructor() {
    super();
  }

  addRoom(room: Room): void {
    this.append(room);
  }

  findRoom(roomOrRoomID: Room | string, whatKeyIsThisIn: keyof Room): Room | undefined {
    if (typeof roomOrRoomID === "string") {
      return this.getItemIfStringEqualToKeyValue(roomOrRoomID, whatKeyIsThisIn)?.value;
    } else {
      return this.get(roomOrRoomID, whatKeyIsThisIn)?.value;
    }
  }

  removeRoom(roomOrRoomID: Room | string, keyToMatchFor: keyof Room): Room | undefined {
    if (typeof roomOrRoomID === "string") {
      return this.removeItemIfStringEqualToKeyValue(roomOrRoomID, keyToMatchFor)?.value;
    } else {
      return this.remove(roomOrRoomID, keyToMatchFor)?.value;
    }
  }

  addUserSessionToRoom(
    roomID: string,
    userSession: UserSession
  ): Room | undefined {
    const room = this.findRoom(roomID, ROOM_KEYS.roomID);
    room?.participants.append(userSession);
    return room;
  }

  removeUserSessionFromRoom(
    roomID: string,
    userSession: UserSession | string
  ): Room | undefined {
    const room = this.getItemIfStringEqualToKeyValue(roomID, ROOM_KEYS.roomID)?.value;
    if (room) {
      if (typeof userSession === "string") {
        room.participants.removeItemIfStringEqualToKeyValue(userSession, USER_SESSION_KEYS.userID);
      } else {
        room.participants.remove(userSession, USER_SESSION_KEYS.userID);
      }
      const ROOM_IS_EMPTY = room.participants.length === 0;
      if (ROOM_IS_EMPTY) {
        this.removeRoom(roomID, ROOM_KEYS.roomID);
      }
    }
    return room;
  }
};

export default RoomMemoryStore;