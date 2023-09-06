import { z } from "zod";
import { isValidUUID } from "@/lib/utils";

export const languageTypes = z.union([
  z.literal("c++"),
  z.literal("c#"),
  z.literal("go"),
  z.literal("html"),
  z.literal("java"),
  z.literal("javascript"),
  z.literal("php"),
  z.literal("python"),
  z.literal("ruby"),
  z.literal("swift"),
  z.literal("typescript"),
], { invalid_type_error: "Please choose an existing language." });

export const createRoomSchema = z.object({
  language: languageTypes
});

export const joinRoomSchema = z.object({
  roomId: z.string().refine((value) => isValidUUID(value), {
    message: "Invalid UUID format for roomId",
  }),
});

