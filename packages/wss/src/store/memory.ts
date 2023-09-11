import type {
	GameMemoryStoreInterface,
	Participant,
	ParticipantInformation,
	Room,
	RunningGameInformation,
	TimeStampType,
	UserSession,
} from "./types";

import RoomMemoryStore from "./room";
import UserSessionMemoryStore from "./user-session";
import RunningTypingGameMemoryStore from "./running-race";

/** Handles all the state within a game. For example,
 *  adding a new room, removing a room, adding
 *  players to a room, etc.
 */
export class GameMemoryStore implements GameMemoryStoreInterface {
	private rooms: RoomMemoryStore;
	private players: UserSessionMemoryStore;
	private running_rooms: RunningTypingGameMemoryStore;

	constructor() {
		this.rooms = new RoomMemoryStore();
		this.players = new UserSessionMemoryStore();
		this.running_rooms = new RunningTypingGameMemoryStore();
	}

	getLengthOfRooms(): number {
		return this.rooms.length;
	}

	getLengthOfUserSessions(): number {
		return this.players.length;
	}

	getLengthOfActiveRooms(): number {
		return this.running_rooms.length;
	}

	addRunningGame(room: RunningGameInformation): void {
		this.running_rooms.addRunningGame(room);
	}

	removeRunningGame(roomID: string): RunningGameInformation | undefined {
		return this.running_rooms.removeRunningGame(roomID);
	}

	findRunningGame(roomID: string): RunningGameInformation | undefined {
		return this.running_rooms.getRunningGame(roomID);
	}

	addParticipantToRunningRace(roomID: string, participant: Participant): void {
		this.running_rooms.addParticipant(roomID, participant);
	}

	updateProgressOfParticipant(
		roomID: string,
		userID: string,
		amount: number,
	): Participant | undefined {
		return this.running_rooms.updateProgressOfParticipant(
			roomID,
			userID,
			amount,
		);
	}

	updateTimeStampOfParticipant(roomID: string, userID: string, timeStamp: TimeStampType): Participant | undefined {
		return this.running_rooms.updateTimeStampOfParticipant(roomID, userID, timeStamp);
	}

	updateTimeTakenOfParticipant(
		roomID: string,
		userID: string,
		timeInSeconds: number,
	): Participant | undefined {
		return this.running_rooms.updateTimeTakenOfParticipant(
			roomID,
			userID,
			timeInSeconds,
		);
	}

	removeParticipantFromRunningRace(
		roomID: string,
		userID: string,
	): Participant | undefined {
		return this.running_rooms.removeParticipant(roomID, userID);
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

	addUserSessionToRoom(
		roomID: string,
		userSession: UserSession,
	): Room | undefined {
		return this.rooms.addUserSessionToRoom(roomID, userSession);
	}

	removeUserSessionFromRoom(
		roomID: string,
		userSessionOrUserID: string | UserSession,
	): Room | undefined {
		return this.rooms.removeUserSessionFromRoom(roomID, userSessionOrUserID);
	}
}
