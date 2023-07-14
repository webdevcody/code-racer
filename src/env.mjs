import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION,
  client: {},
  // NOTE: specifying runtimeEnv is not necessary for Next,js >= 13.4.4
  // runtimeEnv: {},
  // you only need to destructure client variables:
  experimental__runtimeEnv: {},
});
