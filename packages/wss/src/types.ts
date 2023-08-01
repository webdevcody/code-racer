export const raceStatus = {
  WAITING: "waiting",
  COUNTDOWN: "countdown",
  RUNNING: "running",
  FINISHED: "finished",
} as const;

export type RaceStatus = (typeof raceStatus)[keyof typeof raceStatus];
