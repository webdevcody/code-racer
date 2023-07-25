import { z } from "zod";
import { Snippet } from "@code-racer/app/src/lib/prisma";
import { UserRaceEnterPayload, UserRaceLeavePayload } from "./common";

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

export type GameStateUpdatePayload = z.infer<typeof gameStateUpdateEvent>;

//This is the response to the UserRaceRequest event
export const userRaceResponseEvent = z.object({
  snippet: z.object({
    id: z.string(),
    code: z.string(),
    language: z.string(),
    userId: z.string().nullable(),
    onReview: z.boolean(),
    rating: z.number(),
  }),
  raceId: z.string(),
  raceParticipantId: z.string(),
});
export type UserRaceResponsePayload = z.infer<typeof userRaceResponseEvent>;

export interface ServerToClientEvents {
  GameStateUpdate: (payload: GameStateUpdatePayload) => void;
  UserRaceEnter: (payload: UserRaceEnterPayload) => void;
  UserRaceLeave: (payload: UserRaceLeavePayload) => void;
  UserRaceResponse: (payload: UserRaceResponsePayload) => void;
  UserEnterFullRace: () => void;
}
