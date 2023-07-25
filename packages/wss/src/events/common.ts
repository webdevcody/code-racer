import { z } from "zod";

export const userRacePresenceEvent = z.object({
    raceParticipantId: z.string(),
    socketId: z.string(),
    raceId: z.string(),
});

export type UserRaceEnterPayload = z.infer<typeof userRacePresenceEvent>;
export type UserRaceLeavePayload = z.infer<typeof userRacePresenceEvent>;
