import { siteConfig } from "@code-racer/app/src/config/site";

export const GAME_CONFIG = {
	START_GAME_COUNTDOWN: siteConfig.multiplayer.startGameCountdown,
	MAX_PARTICIPANTS_PER_RACE: siteConfig.multiplayer.maxParticipantsPerRace,
	GAME_LOOP_INTERVAL: 500,
	GAME_MAX_POSITION: 100,
} as const;

export const RACE_STATUS = {
	WAITING: "waiting",
	COUNTDOWN: "countdown",
	RUNNING: "running",
	FINISHED: "finished",
} as const;

export const ROOM_KEYS = {
	participants: "participants",
	roomOwnerID: "roomOwnerID",
	roomID: "roomID",
	snippet: "snippet",
	createdAt: "createdAt",
	startedAt: "startedAt",
	endedAt: "endedAt",
	gameStatus: "gameStatus"
} as const;

export const USER_SESSION_KEYS = {
	userID: "userID",
	displayName: "displayName",
	displayImage: "displayImage",
	roomIDs: "roomIDs",
} as const;

export const IS_IN_DEVELOPMENT = true;

export type RaceStatus = (typeof RACE_STATUS)[keyof typeof RACE_STATUS];
