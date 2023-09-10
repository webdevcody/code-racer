import type { Server } from "socket.io";
import type { ClientToServerEvents } from "@/events/client-to-server";
import type { ServerToClientEvents } from "@/events/server-to-client";
import type UserSessionMemoryStore from "./user-session";

/** T for the type of item,
 *  K for the item's key.
 *  Our use case is for userSession and
 *  rooms
 */
export interface LinkedListInterface<T, K extends keyof T> {
 length: number;
	append(_item: T): void;
	prepend(_item: T): void;
	remove(_item: T, _keyToMatchFor: K): Node<T> | undefined;
	removeItemIfStringEqualToKeyValue(_item: string, _keyToMatchFor: K): Node<T> | undefined;
	get(_item: T, _keyToMatchFor: K): Node<T> | undefined;
	getItemIfStringEqualToKeyValue(_item: string, _key: K): Node<T> | undefined;
	getItemAt(_idx: number): Node<T> | undefined;
}

export interface RoomMemoryStoreInterface extends LinkedListInterface<Room, keyof Room> {
	addRoom(_room: Room): void;
	findRoom(_room: Room): Room | undefined;
	findRoomByRoomID(_roomID: string): Room | undefined;
	removeRoom(_room: Room): Room | undefined;
	removeRoomByRoomID(_roomID: string): Room | undefined;
	addUserSessionToRoom(_roomID: string, _userSession: UserSession): Room | undefined;
	removeUserSessionFromRoom(_roomID: string, _userSessionOrUserID: UserSession | string): Room | undefined;
}

export interface UserSessionMemoryStoreInterface extends LinkedListInterface<UserSession, keyof UserSession> {
	addUser(_userSession: UserSession): void;
	findUser(_userSession: UserSession): UserSession | undefined;
	findUserByID(_userID: string): UserSession | undefined;
	removeUser(_userSession: UserSession): UserSession | undefined;
	removeUserByID(_userID: string): UserSession | undefined;
	getAllUsers(): Array<ParticipantInformation>;
}

/** I don't know how
 *  
 *  this interface can inherit both the methods of
 *  RoomMemoryStore and UserSessionMemoryStore, so here haha.
 */
export interface GameMemoryStoreInterface {
	addUser(_userSession: UserSession): void;
	findUser(_userSession: UserSession): UserSession | undefined;
	findUserByID(_userID: string): UserSession | undefined;
	removeUser(_userSession: UserSession): UserSession | undefined;
	removeUserByID(_userID: string): UserSession | undefined;
	getAllUsers(): Array<ParticipantInformation>;
	addRoom(_room: Room): void;
	findRoom(_room: Room): Room | undefined;
	findRoomByRoomID(_roomID: string): Room | undefined;
	removeRoom(_room: Room): Room | undefined;
	removeRoomByRoomID(_roomID: string): Room | undefined;
	addUserSessionToRoom(_roomID: string, _userSession: UserSession): Room | undefined;
	removeUserSessionFromRoom(_roomID: string, _userSessionOrUserID: UserSession | string): Room | undefined;
}

export interface Game {
	memory: GameMemoryStoreInterface;
	server: Server<ClientToServerEvents, ServerToClientEvents>;
	initializeGame(): void;
	MAXIMUM_PLAYER_COUNT: number;
}

export interface Node<T> {
  value: T,
  next: Node<T> | undefined;
}

export type Participant = {
	userID: string;
	progress: number;

	isFinished: boolean;

	/** Time taken in seconds */
	timeTaken: number;
};

export type CustomSnippet = {
	id: string;
	name: string | null;
	code: string;
	language: Language;
};

export type RoomInformation = {
	snippet: CustomSnippet;
	startedAt: Date | null;
	endedAt: Date | null;
	roomOwnerID: string;
};

export type Room = {
	participants: UserSessionMemoryStore;
	roomOwnerID: string;
	roomID: string;
	snippet: CustomSnippet;
	createdAt: Date | null;
	startedAt: Date | null;
	endedAt: Date | null;
	gameStatus: RaceStatus;
};

export type MiddlewareAuth = {
	userID?: string;
	displayName: string;
	displayImage: string;
};

export type UserSession = {
	userID: string;
	displayName: string;
	displayImage: string;
	roomIDs: Array<string>;
};

export type ParticipantInformation = {
	userID: string;
	displayName: string;
	displayImage: string;
};