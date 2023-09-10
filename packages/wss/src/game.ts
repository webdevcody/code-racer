import type { Server, Socket } from "socket.io";
import type { Game, GameMemoryStoreInterface, MiddlewareAuth } from "./store/types";
import type { ChangeGameStatusOfRoomPayload, ClientToServerEvents, CreateRoomPayload } from "./events/client-to-server";
import type { ServerToClientEvents } from "./events/server-to-client";

import { getRandomSnippet } from "@code-racer/app/src/app/race/(play)/loaders";
import { v4 as uuidv4 } from "uuid";

import { GameMemoryStore } from "./store/memory";

import { GAME_CONFIG, IS_IN_DEVELOPMENT, RACE_STATUS } from "./consts";
import UserSessionMemoryStore from "./store/user-session";

declare module "socket.io" {
	interface Socket {
		userID: string;
		displayName: string;
		displayImage: string;
	}
}

/** Logic for the game:
 * 
 * 1. Middleware:
 * - Detect if a user is logged in on the client. To detect this, we check if a userID is provided in the auth handshake or not.
 *    
 * - If a logged in user connected to the server, prevent them from connecting on other clients (e.g. other tabs & browsers).
 *     This is necessary since we are using userIDs to check for uniqueness and this will be used to save a logged in user's data.
 *    
 * - If a user is not logged on the client, we use the generated id of the socket (socket.id).
 * 
 * 2. Connection to Socket:
 * - We add the userSession to the memory of UserSessionMemoryStore
 * 
 * 3. Disconnection to Socket:
 * - Find the user from the list of userSessions in the memory and get the roomIDs they joined in.
 * 
 * - Loop through each room.
 * 
 * - If the loop is at the room === to socket.id, skip to the next iteration.
 * 
 * - Remove the userSession of the user from the room stored in memory (room.participants).
 * 
 * - If the room still exists, then change the room owner === to the userSesssion at the head of the list of participants,
 *  pretty much the user that joined after the owner.
 * 
 * - Emit the room information to all sockets connected to update the roomOwner
 * 
 * - Remove the disconnected user from the memory.
 * 
 * 4. Room creation:
 * - If userID (can be a sessionID, or the socketID of the client) is not provided by the client, then we return an Error.
 * 
 * - Get a random snippet from the database based on the provided language.
 * 
 * - If no snippet was returned by the getRandomSnippet() function, then we return an Error (we assume that no snippet exists for that language.).
 * 
 * - We find the user in the memory based on their userID.
 * 
 * - If no user was found, then an error occured.
 * 
 * - Add the room to the Array<roomID> of the saved userSession and join the socket to the room
 * 
 * - Add the room to memory.
 * 
 * - Send the roomID to the client (a signal that confirms everything went smoothly).
 * 
 * - Send a notification
 */
class TypingGame implements Game {
	public readonly MAXIMUM_PLAYER_COUNT: number;

	public memory: GameMemoryStoreInterface;
	public server: Server<ClientToServerEvents, ServerToClientEvents>;

	constructor(
		server: Server<ClientToServerEvents, ServerToClientEvents>
	) {
		this.server = server;
		this.memory = new GameMemoryStore();
		this.MAXIMUM_PLAYER_COUNT = GAME_CONFIG.MAX_PARTICIPANTS_PER_RACE;
	}

	initializeGame(): void {
		this.middleware();

		this.server.on("connection", (socket) => {
			this.connectUser(socket);
			if (IS_IN_DEVELOPMENT) {
				console.log("A user has connected.");
			}

			socket.on("disconnect", (reason) => this.handleDisconnect(socket, reason));
			socket.on("CreateRoom", ({ userID, language }) => this.handleRoomCreation(socket, { userID, language }));
			socket.on("CheckIfRoomIDExists", (roomID) => this.handleCheckIfRoomIDExists(socket, roomID));
			socket.on("CheckGameStatusOfRoom", (roomID) => this.handleCheckGameStatusOfRoom(socket, roomID));
			socket.on("ChangeGameStatusOfRoom", ({ roomID, raceStatus }) => this.handleChangeGameStatusOfRoom(socket, { roomID, raceStatus }));
			socket.on("RequestRoomInformation", (roomID) => this.handleRequestRoomInformation(socket, roomID));

		});
	}

	private handleRequestRoomInformation(
		socket: Socket<ClientToServerEvents, ServerToClientEvents>,
		roomID: string
	): void {
		const foundRoom = this.memory.findRoomByRoomID(roomID);

		if (!foundRoom) {
			if (IS_IN_DEVELOPMENT) {
				console.warn(
					"Memory handling error. Requesting for room information which should be done when a game starts, but the room cannot be found. Perhaps the room ID was mistyped?",
				);
			}
			return;
		}

		this.server.to(roomID).emit("SendRoomInformation", {
			snippet: foundRoom.snippet,
			endedAt: foundRoom.endedAt,
			startedAt: foundRoom.startedAt,
			roomOwnerID: foundRoom.roomOwnerID,
		});
	}

	private handleChangeGameStatusOfRoom(
		socket: Socket<ClientToServerEvents, ServerToClientEvents>,
		{ roomID, raceStatus }: ChangeGameStatusOfRoomPayload
	): void {
		const foundRoom = this.memory.findRoomByRoomID(roomID);

		if (!foundRoom) {
			if (IS_IN_DEVELOPMENT) {
				console.warn(
					"Memory handling error. Trying to change the status of a room, but it does not exist in memory. Perhaps the roomID provided was wrong?",
				);
			}
			socket.emit(
				"SendError",
				new Error(
					"Failed to change the state of the room. Please try again or create a new room.",
				),
			);
			return;
		}

		const STARTING_GAME =
			foundRoom.gameStatus === RACE_STATUS.WAITING &&
			raceStatus === RACE_STATUS.RUNNING;

		if (STARTING_GAME && foundRoom.participants.length <= 1) {
			socket.emit(
				"SendError",
				new Error("Cannot start a multiplayer race with only one player."),
			);
			return;
		}

		const RESSETING_GAME =
			foundRoom.gameStatus !== RACE_STATUS.WAITING &&
			raceStatus === RACE_STATUS.WAITING;

		if (RESSETING_GAME) {
			this.server.to(roomID).emit("SendNotification", {
				title: "Resetting Game",
				description:
					"Resetting the game since you are the only player left.",
			});
		}

		foundRoom.gameStatus = raceStatus;

		this.server
			.to(roomID)
			.emit("SendGameStatusOfRoom", foundRoom.gameStatus);
	}

	private handleCheckGameStatusOfRoom(
		socket: Socket<ClientToServerEvents, ServerToClientEvents>,
		roomID: string
	): void {
		const foundRoom = this.memory.findRoomByRoomID(roomID);

		if (!foundRoom) {
			if (IS_IN_DEVELOPMENT) {
				console.warn(
					"The room ID provided by CheckGameStatusOfRoom does not exist. This is a memory handling error since the room should exist.",
				);
			}
			return;
		}

		this.server
			.to(roomID)
			.emit("SendGameStatusOfRoom", foundRoom.gameStatus);
	}

	private handleCheckIfRoomIDExists(
		socket: Socket<ClientToServerEvents, ServerToClientEvents>,
		roomID: string
	): void {
		const foundRoom = this.memory.findRoomByRoomID(roomID);
		if (!foundRoom) {
			socket.emit("SendNotification", {
				title: "Room Not Found",
				description:
					"The room ID does not exist. Perhaps it is yet to be created or it got deleted? Try creating a new one.",
				variant: "destructive",
			});
			return;
		}

		if (foundRoom.participants.length >= this.MAXIMUM_PLAYER_COUNT) {
			socket.emit("SendNotification", {
				title: "Room Full!",
				description: `This room is full of participants. The current maximum players is ${this.MAXIMUM_PLAYER_COUNT} Try creating a new one.`,
				variant: "destructive",
			});
			return;
		}

		if (foundRoom.gameStatus !== RACE_STATUS.WAITING) {
			socket.emit("SendNotification", {
				title: "Race Has Started!",
				description:
					"The race for this room has already started. Please try creating a new one.",
			});
			return;
		}

		/** This means that the user who's joining was the one
		*  that created the room.
		*/
		const USER_JOINED_THE_ROOM_ALREADY = foundRoom.participants.findUserByID(socket.userID);

		if (USER_JOINED_THE_ROOM_ALREADY) {
			socket.emit("SendRoomID", {
				roomID,
				roomOwnerID: foundRoom.roomOwnerID,
			});
			this.server
				.to(roomID)
				.emit(
					"PlayerJoinedOrLeftRoom",
					foundRoom.participants.getAllUsers(),
				);
			return;
		}

		const userSession = this.memory.findUserByID(socket.userID);
		if (!userSession) {
			if (IS_IN_DEVELOPMENT) {
				console.warn(
					"Memory handling error. User session is not in memory despite them connecting to the server.",
				);
			}
			return;
		}

		if (!socket.rooms.has(roomID)) {
			socket.join(roomID);
			userSession.roomIDs.push(roomID);
		}

		foundRoom.participants.addUser(userSession);
		this.server
			.to(roomID)
			.emit("PlayerJoinedOrLeftRoom", foundRoom.participants.getAllUsers());
		socket.emit("SendRoomID", {
			roomID,
			roomOwnerID: foundRoom.roomOwnerID,
		});
		socket.to(roomID).emit("SendNotification", {
			title: socket.displayName + " has joined the room."
		});
	}

	private async handleRoomCreation(
		socket: Socket<ClientToServerEvents, ServerToClientEvents>,
		{ userID, language }: CreateRoomPayload
	): Promise<void> {
		if (!userID) {
			console.warn(
				"userID is not provided! Please provide it to create a room.",
			);
			socket.emit("SendError", new Error("Something went wrong."));
			return;
		}

		const snippet = await getRandomSnippet({ language });

		if (!snippet) {
			socket.emit("SendNotification", {
				title: "Failed to create room",
				description:
					"There is no available snippet for the language you've chosen. Please try creating one.",
				variant: "destructive",
			});
			return;
		}

		const roomID = uuidv4();
		const userSession = this.memory.findUserByID(userID);
		if (!userSession) {
			if (IS_IN_DEVELOPMENT) {
				console.error(
					"Error in managing memory. User does not exist in memory.",
				);
			}
			socket.emit(
				"SendError",
				new Error(
					"Failed to create room. Please try again or submit an issue on GitHub.",
				),
			);
			return;
		}

		userSession.roomIDs.push(roomID);
		socket.join(roomID);

		const UserSessioMemoryForRoom = new UserSessionMemoryStore();

		const room = {
			snippet: {
				id: snippet.id,
				name: snippet.name,
				code: snippet.code,
				language,
			},
			startedAt: null,
			endedAt: null,
			createdAt: new Date(),
			roomOwnerID: userSession.userID,
			roomID,
			participants: UserSessioMemoryForRoom,
			gameStatus: RACE_STATUS.WAITING,
		};

		this.memory.addRoom(room);
		socket.emit("SendNotification", {
			title: "Room Created",
			description: "Success! Your room has been created.",
		});
		socket.emit("SendRoomID", {
			roomID,
			roomOwnerID: room.roomOwnerID,
		});
	}

	private handleDisconnect(socket: Socket<ClientToServerEvents, ServerToClientEvents>, _reason: string): void {
		const roomsUserIsIn = this.memory.findUserByID(socket.userID)?.roomIDs;

		if (!roomsUserIsIn || roomsUserIsIn.length === 0) {
			this.memory.removeUserByID(socket.userID);
			return;
		}

		roomsUserIsIn.forEach((roomID) => {
			/** Since socket.io automatically connects our socket
						 *  to a room === to socket.id (so, we added it when saving the userSession).
						 */
			if (roomID === socket.id) {
				return;
			}

			const ROOM_EXISTS = this.memory.removeUserSessionFromRoom(roomID, socket.userID);

			if (ROOM_EXISTS) {

				const firstPlayer = ROOM_EXISTS.participants.getItemAt(0);
				console.log(firstPlayer?.value);
				if (firstPlayer) {
					ROOM_EXISTS.roomOwnerID = firstPlayer.value.userID;
					this.server.to(roomID).emit("PlayerJoinedOrLeftRoom", ROOM_EXISTS.participants.getAllUsers());
					this.server.to(roomID).emit("SendRoomOwnerID", ROOM_EXISTS.roomOwnerID);
				}

				socket.to(roomID).emit("SendNotification", {
					title: socket.displayName + " has left the room."
				});
			}
		});

		this.memory.removeUserByID(socket.userID);
	}

	private connectUser(socket: Socket<ClientToServerEvents, ServerToClientEvents>): void {
		this.memory.addUser({
			userID: socket.userID,
			displayImage: socket.displayImage,
			displayName: socket.displayName,
			roomIDs: new Array<string>(1).fill(socket.id)
		});
	}

	private middleware(): void {
		this.server.use((socket, next) => {
			const auth = socket.handshake.auth as MiddlewareAuth;
			if (!auth.displayName) {
				return next(new Error("Please provide a display name."));
			}
			if (auth.userID) {
				const foundUser = this.memory.findUserByID(auth.userID);
				if (foundUser) {
					return next(
						new Error("Your account is already connected to the server. Please disconnect and try again.")
					);
				}
				socket.userID = auth.userID;
			} else {
				socket.userID = socket.id;
			}

			socket.displayName = auth.displayName;
			socket.displayImage = auth.displayImage;
			next();
		});
	}

}

export default TypingGame;