import type { Server } from "socket.io";
import type { ClientToServerEvents } from "./events/client-to-server";
import type { ServerToClientEvents } from "./events/server-to-client";

import { v4 as uuidv4 } from "uuid";

import { Race, prisma } from "@code-racer/app/src/lib/prisma";
import { siteConfig } from "@code-racer/app/src/config/site";
import { getRandomSnippet } from "@code-racer/app/src/app/race/(play)/loaders";

import { GAME_CONFIG, RACE_STATUS } from "./consts";

import { MemoryStore } from "./store/memory";
import { RaceStore } from "./store/race";

export class Game {
	private readonly START_GAME_COUNTDOWN: number;
	private readonly MAX_PARTICIPANTS_PER_RACE: number;
	private readonly GAME_LOOP_INTERVAL: number;
	private readonly GAME_MAX_POSITION: number;

	private server: Server<ClientToServerEvents, ServerToClientEvents>;

	private MemoryStore: MemoryStore;
	private RaceStore: RaceStore;

	constructor(server: Server<ClientToServerEvents, ServerToClientEvents>) {
		this.server = server;

		this.MemoryStore = new MemoryStore();
		this.RaceStore = new RaceStore();

		this.START_GAME_COUNTDOWN = GAME_CONFIG.START_GAME_COUNTDOWN;
		this.MAX_PARTICIPANTS_PER_RACE =
			siteConfig.multiplayer.maxParticipantsPerRace;
		this.GAME_LOOP_INTERVAL = GAME_CONFIG.GAME_LOOP_INTERVAL;
		this.GAME_MAX_POSITION = GAME_CONFIG.GAME_MAX_POSITION;

		this.initializeGame();
	}

	private initializeGame() {
		this.server.on("connection", (socket) => {
			socket.on("UserCreateRoom", ({ language }) => {
				getRandomSnippet({ language })
					.then((snippet) => {
						if (!snippet) {
							socket.emit("SendNotification", {
								title: "Snippet not found",
								description: `There is no available snippet on ${language} yet. Try creating one`,
								variant: "destructive",
							});
							return;
						}

						const roomID = uuidv4();

						this.RaceStore.createRace(snippet, roomID)
							.then((createdRace) => {
								this.MemoryStore.saveRace(roomID, {
									race: createdRace,
									participants: new Array(),
									status: "waiting",
								});
								socket.emit("RoomCreated", { roomId: roomID });
							})
							.catch((_error) => {
								socket.emit("SendNotification", {
									title: "Race Creation Failed",
									description:
										"Something went wrong with creating a race. Please try again.",
									variant: "destructive",
								});
							});
					})
					.catch((_error) => {
						socket.emit("SendNotification", {
							title: "Error",
							description:
								"Something went wrong with creating a snippet. Please try refreshing the page",
							variant: "destructive",
						});
					});
			});

			socket.on("UserJoinRoom", ({ raceId: roomID, userId }) => {
				const race = this.MemoryStore.findRace(roomID);

				if (!race) {
					socket.emit("SendNotification", {
						title: "Room not found",
						description: `Room with id ${roomID} was not found.`,
					});
					return;
				}

				socket.join(this.AddPrefixToRoomID(roomID));

				const findRaceParticipantCondition = { id: socket.id };
				const updateRaceParticipantCondifion = { raceId: roomID, userId };
				const createRaceParticipantCondition = {
					id: socket.id,
					raceId: roomID,
					userId,
				};
				const includeRaceParticipantCondition = { participants: true };

				prisma.raceParticipant
					.upsert({
						where: findRaceParticipantCondition,
						update: updateRaceParticipantCondifion,
						create: createRaceParticipantCondition,
						include: {
							Race: { include: includeRaceParticipantCondition },
							user: {
								select: {
									name: true,
									image: true,
								},
							},
						},
					})
					.then((result) => {
						const ROOM_IS_FULL =
							race.participants.length >= this.MAX_PARTICIPANTS_PER_RACE;
						if (ROOM_IS_FULL) {
							this.server.sockets.sockets
								.get(socket.id)
								?.emit("UserEnterFullRace");
							return;
						}

						const RANDOM_NAME = "CuteKoala123";
						const FALLBACK_IMG_URL =
							"https://code-race-eight.vercel.app/static/placeholder-image.png";

						this.MemoryStore.addParticipantToRace(roomID, {
							id: userId ?? socket.id,
							position: 0,
							finishedAt: null,
							image: result.user?.image ?? FALLBACK_IMG_URL,
							name: result.user?.name ?? RANDOM_NAME,
						});

						socket.emit("RoomJoined", {
							race: result.Race,
							participants: race.participants,
							participantId: userId ?? socket.id,
							raceStatus: race.status,
						});

						socket
							.to(this.AddPrefixToRoomID(roomID))
							.emit("UpdateParticipants", { participants: race.participants });
					})
					.catch((error) => {
						console.error("Error in upsertion! ---" + error);
					});
			});

			/** START RACE COUNTDOWN */
			socket.on("StartRaceCountdown", ({ raceId: roomID }) => {
				const race = this.MemoryStore.findRace(roomID);

				if (!race) {
					socket.emit("SendNotification", {
						title: "Room does not exist",
						description: "Something went wrong. Please try again.",
						variant: "destructive",
					});
					return;
				}

				const ONE_SECOND = 1000;
				race.status = RACE_STATUS.COUNTDOWN;

				let countdown = this.START_GAME_COUNTDOWN;

				const countdownInterval = setInterval(() => {
					const raceState = {
						participants: race.participants,
						status: race.status,
						id: roomID,
						countdown,
					};
					this.server
						.to(this.AddPrefixToRoomID(roomID))
						.emit("GameStateUpdate", { raceState });

					countdown -= 1;

					if (countdown === 0) {
						this.server
							.to(this.AddPrefixToRoomID(roomID))
							.emit("GameStateUpdate", { raceState });

						this.StartRace(roomID);
						clearInterval(countdownInterval);
					}
				}, ONE_SECOND);
			});

			/** USER GETS RACE */
			socket.on("UserGetRace", ({ language, userId: userID }) => {
				this.RaceStore.raceMatchMaking(language, userID)
					.then(({ availableRace, raceParticipantID }) => {
						const roomID = availableRace.id;
						const storedRaceInMemory = this.MemoryStore.findRace(roomID);

						/** DEBUGGING PURPOSES */
						if (!storedRaceInMemory) {
							console.error("Race is not being stored in memory properly!");
							return;
						}
						/** DEBUGGING PURPOSES */

						socket.join(this.AddPrefixToRoomID(roomID));

						const raceState = {
							id: roomID,
							participants: storedRaceInMemory.participants,
							status: storedRaceInMemory.status,
							countdown: 0,
						};

						socket
							.to(this.AddPrefixToRoomID(roomID))
							.emit("GameStateUpdate", { raceState });

						this.server
							.to(this.AddPrefixToRoomID(roomID))
							.emit("UserRaceEnter", {
								raceParticipantId: raceParticipantID ?? socket.id,
								race: availableRace,
								socketId: socket.id,
							});
					})
					.catch((_error) => {
						socket.emit("SendNotification", {
							title: "Something went wrong",
							description: "Failed to gather information about race",
							variant: "destructive",
						});
					});
			});

			socket.on(
				"PositionUpdate",
				({ race, raceId: roomID, raceParticipantId, position }) => {
					const foundRace = this.MemoryStore.findRace(roomID);

					if (!foundRace) {
						console.warn("Updating a non-existing race. Memory handling error");
						return;
					}

					const participant =
						this.MemoryStore.findParticipant(raceParticipantId);

					if (!participant) {
						console.log(
							"Updating a non-existing participant. Memory handling error",
						);
						return;
					}

					participant.position = position;

					if (participant.position >= this.GAME_MAX_POSITION) {
						if (participant.finishedAt) {
							return;
						}
						participant.finishedAt = new Date().getTime();
					}

					const RACE_HAS_FINISHED = this.CheckIfRaceEnded(race);

					if (RACE_HAS_FINISHED) {
						void this.EndRace(roomID);
					}
				},
			);

			socket.on("disconnect", () => {
				const participant = this.MemoryStore.findParticipant(socket.id);
				if (!participant) {
					return;
				}

				const foundRace = this.MemoryStore.findRaceWhereParticipantIsIn(
					participant.id,
				);

				if (!foundRace) {
					console.error("Memory Error! Race not found when disconnecting");
					return;
				}

				const PARTICIPANT_LEFT_THE_RACE_EARLY =
					participant && !participant.finishedAt;
				if (PARTICIPANT_LEFT_THE_RACE_EARLY) {
					void this.MemoryStore.deleteRaceParticipant(
						participant.id,
						foundRace,
					);
				}

				const raceState = {
					id: foundRace.race.id,
					participants: foundRace.participants,
					status: foundRace.status,
				};
				this.server
					.to(this.AddPrefixToRoomID(foundRace.race.id))
					.emit("GameStateUpdate", { raceState });
			});
		});
	}

	private StartRace(roomID: string) {
		const interval = setInterval(() => {
			const race = this.MemoryStore.findRace(roomID);

			if (!race) {
				clearInterval(interval);
				return;
			}

			if (race.status !== RACE_STATUS.RUNNING) {
				race.status = RACE_STATUS.RUNNING;

				const findRaceCondition = { id: roomID };
				const updateRaceCondition = { startedAt: new Date() };

				void prisma.race
					.update({
						where: findRaceCondition,
						data: updateRaceCondition,
					})
					.catch((error) => {
						console.error(error);
					});

				const raceState = {
					id: roomID,
					status: race.status,
					participants: race.participants,
				};

				this.server
					.to(this.AddPrefixToRoomID(roomID))
					.emit("GameStateUpdate", { raceState });
			}
		}, this.GAME_LOOP_INTERVAL);
	}

	private EndRace(roomID: string) {
		const foundRace = this.MemoryStore.findRace(roomID);

		if (!foundRace) {
			console.warn("Ending a non-existent race. Memory error");
			return;
		}

		foundRace.status = RACE_STATUS.FINISHED;

		const raceState = {
			id: foundRace.race.id,
			status: foundRace.status,
			participants: foundRace.participants,
		};

		this.server
			.to(this.AddPrefixToRoomID(roomID))
			.emit("GameStateUpdate", { raceState });

		this.MemoryStore.deleteAllParticipantsFromRace(roomID);
		this.MemoryStore.removeRace(roomID);

		const findRaceCondition = { id: roomID };
		const updateRaceCondition = { endedAt: new Date() };
		prisma.race
			.update({
				where: findRaceCondition,
				data: updateRaceCondition,
			})
			.then(() => {});
	}

	private CheckIfRaceEnded(race: Race) {
		let finishedParticipants = 0;
		const participants = this.MemoryStore.findAllParticipants(race.id);

		if (!participants) {
			console.log(
				"No participants in a race we're checking at function CheckIfRaceEnded(). Please verify",
			);
			return true;
		}

		for (let idx = 0; idx < participants.length; ++idx) {
			if (participants[idx].finishedAt) {
				finishedParticipants += 1;
			}
		}

		return finishedParticipants >= participants.length;
	}

	private AddPrefixToRoomID(roomID: string) {
		return "Room_" + roomID;
	}
}
