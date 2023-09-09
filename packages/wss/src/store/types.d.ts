/** T for the type of item,
 *  K if the item is an object
 *  and we need to match items based on a 
 *  specific key
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
	findRoom(_roomOrRoomID: Room | string, _whatKeyIsThisIn: keyof Room): Room | undefined;
	removeRoom(_roomOrRoomID: Room | string, _whatKeyIsThisIn: keyof Room): Room | undefined;
	addUserSessionToRoom(_roomID: string, _userSession: UserSession): Room | undefined;
}

export interface UserSessionMemoryStoreInterface extends LinkedListInterface<UserSession, keyof UserSession> {
	getAllUsers(): Array<ParticipantInformation>;
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
	participants: UserSessionMemoryStoreInterface;
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