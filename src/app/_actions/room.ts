"use server";

import { User } from "@prisma/client";
import { z } from "zod";
import { zact } from "zact/server";

/**
 * This should create a private room for the user
 * Not implemented. Need to decide on the multiplayer architecture
 **/
export const createPrivateRaceRoom = zact(z.object({ userId: z.string() }))(
  async (input) => {
    throw new Error("Not implemented");
  },
);
