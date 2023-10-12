import type { Server } from "socket.io";
import type { ClientToServerEvents } from "../events/client-to-server";
import type { ServerToClientEvents } from "../events/server-to-client";
import type UserSessionMemoryStore from "./user-session";
import type ParticipantMemoryStore from "./participant";

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
	removeItemIfStringEqualToKeyValue(
		_item: string,
		_keyToMatchFor: K,
	): Node<T> | undefined;
	get(_item: T, _keyToMatchFor: K): Node<T> | undefined;
	getItemIfStringEqualToKeyValue(_item: string, _key: K): Node<T> | undefined;
	getItemAt(_idx: number): Node<T> | undefined;
}

export interface GameMemoryStoreInterface {
	getLengthOfRooms(): number;
	getLengthOfUserSessions(): number;
	getLengthOfActiveRooms(): number;

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
	addUserSessionToRoom(
		_roomID: string,
		_userSession: UserSession,
	): Room | undefined;
	removeUserSessionFromRoom(
		_roomID: string,
		_userSessionOrUserID: UserSession | string,
	): Room | undefined;

	addRunningGame(_room: RunningGameInformation): void;
	removeRunningGame(_roomID: string): RunningGameInformation | undefined;
	findRunningGame(_roomID: string): RunningGameInformation | undefined;

	addParticipantToRunningRace(_roomID: string, _participant: Participant): void;
	updateProgressOfParticipant(
		_roomID: string,
		_userID: string,
		_amount: number,
	): Participant | undefined;
	updateTimeTakenOfParticipant(
		_roomID: string,
		_userID: string,
		_timeInSeconds: number,
	): Participant | undefined;
	updateTimeStampOfParticipant(
		_roomID: string,
		_userID: string,
		_timeStamp: TimeStampType,
	): Participant | undefined;
	removeParticipantFromRunningRace(
		_roomID: string,
		_userID: string,
	): Participant | undefined;
}

export interface Game {
	memory: GameMemoryStoreInterface;
	server: Server<ClientToServerEvents, ServerToClientEvents>;
	initializeGame(): void;
	MAXIMUM_PLAYER_COUNT: number;
}

export interface Node<T> {
	value: T;
	next: Node<T> | undefined;
}

export type Participant = {
	userID: string;
	progress: number;
	displayImage: string;
	displayName: string;

	isFinished: boolean;
	timeStamp: TimeStampType[];

	/** Time taken in seconds */
	timeTaken: number;
};

export type RunningGameInformationPayload = {
	roomID: string;
	participants: Array<Participant>;
};

export type RunningGameInformation = {
	startedAt: Date | null;
	endedAt: Date | null;
	roomID: string;
	participants: ParticipantMemoryStore;
};

export type CustomSnippet = {
	id: string;
	name: string | null;
	code: string;
	language: Language;
};

export type Room = {
	participants: UserSessionMemoryStore;
	roomOwnerID: string;
	roomID: string;
	snippet: CustomSnippet;
	createdAt: Date | null;
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

/** Separate type for now because
 *  we don't have the keys,
 *  "word" and "time" yet
 */
export type TimeStampType = {
	cpm: number;
	accuracy: number;
	errors: number;
};
