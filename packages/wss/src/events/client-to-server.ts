import { z } from "zod";
import { UserRaceEnterPayload, UserRaceLeavePayload, userRacePresenceEvent } from "./common";
import { snippetLanguages } from "@code-racer/app/src/config/languages";

export const positionUpdateEvent = userRacePresenceEvent.merge(
  z.object({
    raceId: z.string(),
    position: z.number(),
  }),
);
export type PositionUpdatePayload = z.infer<typeof positionUpdateEvent>;

export const userRaceRequestEvent = z.object({
    language: z.string().refine((value) => {
        return snippetLanguages.some((language) => language.value === value);
    }),
    userId: z.string().optional(),
})
export type UserRaceRequestPayload = z.infer<typeof userRaceRequestEvent>

export interface ClientToServerEvents {
  PositionUpdate: (payload: PositionUpdatePayload) => void;
  UserRaceEnter: (payload: UserRaceEnterPayload) => void;
  UserRaceLeave: (payload: UserRaceLeavePayload) => void;
  UserRaceRequest: (payload: UserRaceRequestPayload) => void;
}
