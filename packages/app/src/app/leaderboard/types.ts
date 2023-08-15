import { Result, User } from "@prisma/client";

export type UserWithResults = Pick<
  User,
  "id" | "averageAccuracy" | "averageCpm" | "name" | "topLanguages" | "image"
> & {
  results: Result[];
};
