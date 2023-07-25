import { z } from "zod";

export const participantRacePayloadSchema = z.object({
  participantId: z.string(),
  socketId: z.string(),
  raceId: z.string(),
});

export type ParticipantRacePayload = z.infer<
  typeof participantRacePayloadSchema
>;

export const raceParticipantNotificationSchema = z.object({
  participantId: z.string(),
  socketId: z.string(),
});

export type RaceParticipantNotification = z.infer<
  typeof raceParticipantNotificationSchema
>;

export const gameStateUpdatePayloadSchema = z.object({
  raceState: z.object({
    id: z.string(),
    status: z.enum(["waiting", "countdown", "running", "finished"]),
    participants: z.array(
      z.object({
        id: z.string(),
        socketId: z.string(),
        position: z.number(),
      }),
    ),
    countdown: z.number().int().optional(),
  }),
});

export type GameStateUpdatePayload = z.infer<
  typeof gameStateUpdatePayloadSchema
>;

export const raceParticipantPositionPayloadSchema =
  raceParticipantNotificationSchema.merge(
    z.object({
      raceId: z.string(),
      position: z.number(),
    }),
  );

export type RaceParticipantPositionPayload = z.infer<
  typeof raceParticipantPositionPayloadSchema
>;
