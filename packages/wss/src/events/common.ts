import { z } from "zod";

export const userRacePresenceEvent = z.object({
    participantId: z.string(),
    socketId: z.string(),
    raceId: z.string(),
});

export type UserRaceEnterEvent = z.infer<typeof userRacePresenceEvent>;
export type UserRaceLeaveEvent = z.infer<typeof userRacePresenceEvent>;
