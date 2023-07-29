import { z } from "zod";
import { isValidUUID } from "@/lib/utils";


export const createRoomSchema = z.object({
  language: z.string(),
});

export const joinRoomSchema = z.object({
  roomId: z.string().refine((value) => isValidUUID(value), {
    message: "Invalid UUID format for roomId",
  }),
});

