import { z } from "zod";
import { UserRaceEnterEvent, UserRaceLeaveEvent } from "./common";

export const gameStateUpdateEvent = z.object({
  raceState: z.object({
    id: z.string(),
    status: z.enum(["waiting", "countdown", "running", "finished"]),
    participants: z.array(
      z.object({
        id: z.string(),
        socketId: z.string(),
        position: z.number(),
        finishedAt: z.number().nullable(),
      }),
    ),
    countdown: z.number().int().optional(),
  }),
});

export type GameStateUpdateEvent = z.infer<typeof gameStateUpdateEvent>;

export interface ServerToClientEvents {
  GameStateUpdate: (payload: GameStateUpdateEvent) => void;
  UserRaceEnter: (payload: UserRaceEnterEvent) => void;
  UserRaceLeave: (payload: UserRaceLeaveEvent) => void;
  UserEnterFullRace: () => void;
}
