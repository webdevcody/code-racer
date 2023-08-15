import { Result, User } from "@prisma/client";

export const sensitiveUserFields = [
  "email",
  "emailVerified",
  "role",
  "createdAt",
] as const;
export type SensitiveUserFields = (typeof sensitiveUserFields)[number];

export type UserWithResults = Omit<User, SensitiveUserFields> & {
  results: Result[];
};
