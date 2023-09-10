import type { GameMemoryStoreInterface, ParticipantInformation, Room, UserSession } from "./types";

import RoomMemoryStore from "./room";
import UserSessionMemoryStore from "./user-session";

/** Handles all the state within a game. For example,
 *  adding a new room, removing a room, adding
 *  players to a room, etc.
 */
export class GameMemoryStore implements GameMemoryStoreInterface {
  private rooms: RoomMemoryStore;
  private players: UserSessionMemoryStore;
  constructor() {
    this.rooms = new RoomMemoryStore();
    this.players = new UserSessionMemoryStore();
  }

  addUser(userSession: UserSession): void {
    this.players.addUser(userSession);
  }

  findUser(userSession: UserSession): UserSession | undefined {
    return this.players.findUser(userSession);
  }
  findUserByID(userID: string): UserSession | undefined {
    return this.players.findUserByID(userID);
  }
  removeUser(userSession: UserSession): UserSession | undefined {
    return this.removeUser(userSession);
  }
  removeUserByID(userID: string): UserSession | undefined {
    return this.players.removeUserByID(userID);
  }
  
  getAllUsers(): ParticipantInformation[] {
    return this.players.getAllUsers();
  }

  addRoom(room: Room): void {
    this.rooms.addRoom(room);
  }

  findRoom(room: Room): Room | undefined {
    return this.rooms.findRoom(room);
  }

  findRoomByRoomID(roomID: string): Room | undefined {
    return this.rooms.findRoomByRoomID(roomID);
  }

  removeRoom(room: Room): Room | undefined {
    return this.rooms.removeRoom(room);
  }

  removeRoomByRoomID(roomID: string): Room | undefined {
    return this.rooms.removeRoomByRoomID(roomID);
  }

  addUserSessionToRoom(roomID: string, userSession: UserSession): Room | undefined {
    return this.rooms.addUserSessionToRoom(roomID, userSession);
  }

  removeUserSessionFromRoom(roomID: string, userSessionOrUserID: string | UserSession): Room | undefined {
    return this.rooms.removeUserSessionFromRoom(roomID, userSessionOrUserID);
  }
}