import { z } from "zod";
import { UserRaceEnterEvent, UserRaceLeaveEvent, userRacePresenceEvent } from "./common";

export const positionUpdateEvent = userRacePresenceEvent.merge(
  z.object({
    raceId: z.string(),
    position: z.number(),
  }),
);

export type PositionUpdateEvent = z.infer<typeof positionUpdateEvent>;

export interface ClientToServerEvents {
  PositionUpdate: (payload: PositionUpdateEvent) => void;
  UserRaceEnter: (payload: UserRaceEnterEvent) => void;
  UserRaceLeave: (payload: UserRaceLeaveEvent) => void;
}
