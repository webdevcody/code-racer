import { z } from "zod";

export const createRoomSchema = z.object({
  language: z.string(),
});
