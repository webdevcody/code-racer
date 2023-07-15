"use server";

import { z } from "zod";
import { action } from "@/lib/actions";

/**
 * This should create a private room for the user
 * Not implemented. Need to decide on the multiplayer architecture
 **/
export const createPrivateRaceRoom = action(z.object({}), async () => {
  throw new Error("Not implemented");
});
