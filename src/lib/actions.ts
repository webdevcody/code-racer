import { createSafeActionClient } from "next-safe-action";
import { getCurrentUser } from "./session";
import { prisma } from "./prisma";

export const action = createSafeActionClient({
  buildContext: async () => {
    return {
      user: await getCurrentUser(),
      prisma: prisma,
    };
  },
});
