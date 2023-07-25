import { z } from "zod";

export const RaceStatus = {
    WAITING: "waiting",
    COUNTDOWN: "countdown",
    RUNNING: "running",
    FINISHED: "finished",
} as const;

export type RaceStatusType = (typeof RaceStatus)[keyof typeof RaceStatus];
