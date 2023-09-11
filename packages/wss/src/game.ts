import type { Server, Socket } from "socket.io";
import type {
	Game,
	GameMemoryStoreInterface,
	MiddlewareAuth,
	Room,
	RunningGameInformation,
} from "./store/types";
import type {
	ChangeGameStatusOfRoomPayload,
	ClientToServerEvents,
	CreateRoomPayload,
	SendUserHasFinishedPayload,
	UpdateProgressPayload,
	UpdateTimeStampPayload,
} from "./events/client-to-server";
import type { ServerToClientEvents } from "./events/server-to-client";

import { getRandomSnippet } from "@code-racer/app/src/app/race/(play)/loaders";
import { v4 as uuidv4 } from "uuid";

import { GameMemoryStore } from "./store/memory";

import { GAME_CONFIG, IS_IN_DEVELOPMENT, RACE_STATUS } from "./consts";
import UserSessionMemoryStore from "./store/user-session";
import ParticipantMemoryStore from "./store/participant";

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
	private readonly MAXIMUM_ROOMS_IN_MEMORY: number;

	public memory: GameMemoryStoreInterface;
	public server: Server<ClientToServerEvents, ServerToClientEvents>;

	constructor(server: Server<ClientToServerEvents, ServerToClientEvents>) {
		this.server = server;
		this.memory = new GameMemoryStore();
		this.MAXIMUM_PLAYER_COUNT = GAME_CONFIG.MAX_PARTICIPANTS_PER_RACE;
		this.MAXIMUM_ROOMS_IN_MEMORY = GAME_CONFIG.MAX_NUMBER_OF_ROOMS;
	}

	initializeGame(): void {
		this.middleware();

		this.server.on("connection", (socket) => {
			this.connectUser(socket);
			if (IS_IN_DEVELOPMENT) {
				console.log("A user has connected.");
			}

			socket.on("disconnect", (reason) =>
				this.handleDisconnect(socket, reason),
			);
			socket.on("CreateRoom", ({ userID, language }) =>
				this.handleRoomCreation(socket, { userID, language }),
			);

			socket.on("CheckIfRoomIDExists", (roomID) =>
				this.handleCheckIfRoomIDExists(socket, roomID),
			);
			socket.on("CheckGameStatusOfRoom", (roomID) =>
				this.handleCheckGameStatusOfRoom(roomID),
			);

			socket.on("ChangeGameStatusOfRoom", ({ roomID, raceStatus }) =>
				this.handleChangeGameStatusOfRoom(socket, { roomID, raceStatus }),
			);

			socket.on("RequestRoomSnippet", (roomID) =>
				this.handleRequestRoomSnippet(socket, roomID),
			);
			socket.on("RequestRunningGameInformation", (roomID) =>
				this.handleRequestRunningGameInformation(socket, roomID),
			);
			socket.on("RequestAllPlayersProgress", (roomID) =>
				this.handleRequestAllPlayersProgress(roomID),
			);
			socket.on("RequestFinishedGame", (roomID) =>
				this.handleRequestFinishedGame(roomID),
			);

			/** Leave it as an arrow function since this.memory will be
			 *  undefined if we just place the function as the 2nd parameter.
			 */
			socket.on("SendUserProgress", ({ userID, roomID, progress }) =>
				this.handleSendUserProgress({ userID, roomID, progress }),
			);
			socket.on(
				"SendUserTimeStamp",
				({ userID, roomID, accuracy, cpm, totalErrors }) =>
					this.handleSendUserTimeStamp({
						userID,
						roomID,
						accuracy,
						cpm,
						totalErrors,
					}),
			);
			socket.on("SendUserHasFinished", ({ userID, roomID, timeTaken }) =>
				this.handleSendUserHasFinished({ userID, roomID, timeTaken }),
			);
		});
	}

	private handleRequestFinishedGame(roomID: string): void {
		const foundRunningRoom = this.memory.findRunningGame(roomID);

		if (!foundRunningRoom) {
			console.warn(
				"Could not find a running room! Trying to get a running game that just finished on a room that does not exist.",
			);
			return;
		}

		if (!foundRunningRoom.startedAt) {
			console.warn(
				"Error! A room's key of 'startedAt' does not have a value even though it has finished.",
			);
		}

		if (!foundRunningRoom.endedAt) {
			console.warn(
				"Error! A room's key of 'endedAt' does not have a value even though it has finished.",
			);
		}

		this.server.to(roomID).emit("GameFinished", {
			endedAt: foundRunningRoom.endedAt ?? new Date(),
			startedAt: foundRunningRoom.startedAt as Date,
			roomID: roomID,
			participants: foundRunningRoom.participants.getAllParticipants(),
		});
	}

	/** ON PAGE LOAD (we load all the progress trackers) */
	private handleRequestAllPlayersProgress(roomID: string): void {
		const foundRunningRoom = this.memory.findRunningGame(roomID);

		if (!foundRunningRoom) {
			console.warn(
				"Could not find a running room! Trying to get all players' progress on a room that does not exist.",
			);
			return;
		}

		this.server
			.to(roomID)
			.emit(
				"SendAllPlayersProgress",
				foundRunningRoom.participants.getAllParticipantsProgress(),
			);
	}

	/** Also responsible for checking if teh game is considered finish or not */
	private handleSendUserHasFinished({
		timeTaken,
		userID,
		roomID,
	}: SendUserHasFinishedPayload): void {
		const foundRunningRoom = this.memory.findRunningGame(roomID);

		if (!foundRunningRoom) {
			console.warn(
				"Could not find a running room! Trying to update a user's finish state on a room that does not exist.",
			);
			return;
		}

		foundRunningRoom.participants.updateTimeTaken(userID, timeTaken);

		const RACE_FINISHED =
			foundRunningRoom.participants.checkIfAllParticipantsHaveFinished();

		if (RACE_FINISHED) {
			const foundRoom = this.memory.findRoomByRoomID(roomID);

			if (!foundRoom) {
				console.warn(
					"A running game exists but a room for that game does not exist! Memory handling error.",
				);
				return;
			}

			if (!foundRunningRoom.startedAt) {
				console.warn(
					"Error! A room's key of 'startedAt' does not have a value even though it has finished.",
				);
			}

			foundRunningRoom.endedAt = new Date();
			foundRoom.gameStatus = RACE_STATUS.FINISHED;
			this.server.to(roomID).emit("SendGameStatusOfRoom", foundRoom.gameStatus);
		}
	}

	private handleSendUserTimeStamp({
		userID,
		roomID,
		cpm,
		accuracy,
		totalErrors,
	}: UpdateTimeStampPayload): void {
		const foundRunningRoom = this.memory.findRunningGame(roomID);

		if (!foundRunningRoom) {
			console.warn(
				"Could not find a running room! Trying to update a user timestamp on a room that does not exist.",
			);
			return;
		}

		foundRunningRoom.participants.updateTimeStamp(userID, {
			cpm,
			accuracy,
			errors: totalErrors,
		});
		this.server.to(roomID).emit("SendRunningGameInformation", {
			roomID: roomID,
			participants: foundRunningRoom.participants.getAllParticipants(),
		});
	}

	private handleSendUserProgress({
		userID,
		progress,
		roomID,
	}: UpdateProgressPayload): void {
		const foundRunningRoom = this.memory.findRunningGame(roomID);
		console.log("USERID",userID);
		if (!foundRunningRoom) {
			console.warn(
				"Could not find a running room! Trying to update a user progress on a room that does not exist.",
			);
			return;
		}

		foundRunningRoom.participants.updateProgress(userID, progress);
		this.server
			.to(roomID)
			.emit(
				"SendAllPlayersProgress",
				foundRunningRoom.participants.getAllParticipantsProgress(),
			);
	}

	/** Skip over to the socket that requested this
	 *
	 *  The client will emit this per GAME_INTERVAL (100ms right now)
	 *  and we send updated information in here (we can separate it, but
	 *  let's have it like this for now).
	 */
	private handleRequestRunningGameInformation(
		socket: Socket<ClientToServerEvents, ServerToClientEvents>,
		roomID: string,
	): void {
		const foundRunningRoom = this.memory.findRunningGame(roomID);

		if (!foundRunningRoom) {
			console.warn(
				"Could not find room! This should exist when requesting for its infomartion in-game (during a typing race).",
			);
			return;
		}

		this.server.to(roomID).emit("SendRunningGameInformation", {
			roomID: roomID,
			participants: foundRunningRoom.participants.getAllParticipants(),
		});
	}

	/* emit the snippet of the room to the socket that requested it */
	private handleRequestRoomSnippet(
		socket: Socket<ClientToServerEvents, ServerToClientEvents>,
		roomID: string,
	): void {
		const foundRoom = this.memory.findRoomByRoomID(roomID);
		if (!foundRoom) {
			console.warn(
				"Room not found while requesting for a room's snippet! This room should exist.",
			);
			return;
		}
		this.server.to(roomID).emit("SendRoomSnippet", foundRoom.snippet);
	}

	private handleChangeGameStatusOfRoom(
		socket: Socket<ClientToServerEvents, ServerToClientEvents>,
		{ roomID, raceStatus }: ChangeGameStatusOfRoomPayload,
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

		const RESETTING_GAME =
			foundRoom.gameStatus !== RACE_STATUS.WAITING &&
			raceStatus === RACE_STATUS.WAITING;

		if (RESETTING_GAME) {
			if (foundRoom.gameStatus === RACE_STATUS.RUNNING || foundRoom.gameStatus === RACE_STATUS.FINISHED) {
				console.log("--- BEFORE REMOVING RUNNING GAME ---");
				console.log(this.memory);
				const foundRunningRoom = this.memory.removeRunningGame(
					foundRoom.roomID,
				);

				console.log("--- AFTER REMOVING RUNNING GAME ---");
				console.log(this.memory);
				if (!foundRunningRoom) {
					console.warn(
						"Failed to remove a running game when resetting a room's state! Memory handling error.",
					);
				}
			}

			if (foundRoom.participants.length <= 1) {
				this.server.to(roomID).emit("SendNotification", {
					title: "Resetting Game",
					description: "Resetting the game since you are the only player left.",
				});
			} else {
				this.server.to(roomID).emit("SendNotification", {
					title: "Resetting Game",
					description: "Let the games begin once again!",
				});
			}
		}

		const GAME_STARTS = raceStatus === "running";
		if (GAME_STARTS) {
			const foundExistingRunningGame = this.memory.findRunningGame(roomID);

			if (!foundExistingRunningGame) {
				const players = foundRoom.participants.getAllUsers();
				console.log("STARTING_GAME", players);

				const runningGameParticipants = new ParticipantMemoryStore();

				for (let idx = 0; idx < players.length; ++idx) {
					runningGameParticipants.append({
						userID: players[idx].userID,
						displayImage: players[idx].displayImage,
						displayName: players[idx].displayName,
						progress: 0,
						isFinished: false,
						timeStamp: [],
						timeTaken: 0,
					});
				}

				const activeRoom = {
					roomID: foundRoom.roomID,
					participants: runningGameParticipants,
					startedAt: new Date(),
					endedAt: null,
				} satisfies RunningGameInformation;

				this.memory.addRunningGame(activeRoom);
			}
		}

		foundRoom.gameStatus = raceStatus;
		this.server.to(roomID).emit("SendGameStatusOfRoom", foundRoom.gameStatus);
	}

	private handleCheckGameStatusOfRoom(roomID: string): void {
		const foundRoom = this.memory.findRoomByRoomID(roomID);

		if (!foundRoom) {
			if (IS_IN_DEVELOPMENT) {
				console.warn(
					"The room ID provided by CheckGameStatusOfRoom does not exist. This is a memory handling error since the room should exist.",
				);
			}
			return;
		}

		this.server.to(roomID).emit("SendGameStatusOfRoom", foundRoom.gameStatus);
	}

	private handleCheckIfRoomIDExists(
		socket: Socket<ClientToServerEvents, ServerToClientEvents>,
		roomID: string,
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

		if (foundRoom.gameStatus === RACE_STATUS.FINISHED) {
			socket.emit("SendNotification", {
				title: "Room Is Not Accepting Players!",
				description:
					"The race for this room has just finished. Please wait for the owner to change the room's state to waiting again.",
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
		const USER_JOINED_THE_ROOM_ALREADY = foundRoom.participants.findUserByID(
			socket.userID,
		);

		if (USER_JOINED_THE_ROOM_ALREADY) {
			socket.emit("SendRoomID", {
				roomID,
				roomOwnerID: foundRoom.roomOwnerID,
			});
			this.server
				.to(roomID)
				.emit("PlayerJoinedOrLeftRoom", foundRoom.participants.getAllUsers());
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
			title: socket.displayName + " has joined the room.",
		});
	}

	private async handleRoomCreation(
		socket: Socket<ClientToServerEvents, ServerToClientEvents>,
		{ userID, language }: CreateRoomPayload,
	): Promise<void> {
		if (!userID) {
			console.warn(
				"userID is not provided! Please provide it to create a room.",
			);
			const error = new Error("Something went wrong.");
			socket.emit("SendError", error);
			return;
		}

		const amountOfRoomsInMemory = this.memory.getLengthOfRooms();

		if (amountOfRoomsInMemory >= this.MAXIMUM_ROOMS_IN_MEMORY) {
			socket.emit("SendNotification", {
				title: "Server Full!",
				description:
					"The server is full of rooms right now. Please try again later.",
				variant: "destructive"
			});
			return;
		}

		socket.emit("SendNotification", {
			title: "Creating Room",
			description: "Your room is being created...",
		});

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
			createdAt: new Date(),
			roomOwnerID: userSession.userID,
			roomID,
			participants: UserSessioMemoryForRoom,
			gameStatus: RACE_STATUS.WAITING,
		} satisfies Room;

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

	private handleDisconnect(
		socket: Socket<ClientToServerEvents, ServerToClientEvents>,
		_reason: string,
	): void {
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

			const ROOM_EXISTS = this.memory.removeUserSessionFromRoom(
				roomID,
				socket.userID,
			);

			if (ROOM_EXISTS) {
				const firstPlayer = ROOM_EXISTS.participants.getItemAt(0);
				if (firstPlayer) {
					ROOM_EXISTS.roomOwnerID = firstPlayer.value.userID;
					this.server
						.to(roomID)
						.emit(
							"PlayerJoinedOrLeftRoom",
							ROOM_EXISTS.participants.getAllUsers(),
						);
					this.server
						.to(roomID)
						.emit("SendRoomOwnerID", ROOM_EXISTS.roomOwnerID);
				}

				socket.to(roomID).emit("SendNotification", {
					title: socket.displayName + " has left the room.",
				});
			}
		});

		this.memory.removeUserByID(socket.userID);
	}

	private connectUser(
		socket: Socket<ClientToServerEvents, ServerToClientEvents>,
	): void {
		this.memory.addUser({
			userID: socket.userID,
			displayImage: socket.displayImage,
			displayName: socket.displayName,
			roomIDs: new Array<string>(1).fill(socket.id),
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
						new Error(
							"Your account is already connected to the server. Please disconnect and try again.",
						),
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
