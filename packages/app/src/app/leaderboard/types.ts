import { User } from "@prisma/client";

export type UserWithResults = Pick<
  User,
  "id" | "name" | "topLanguages" | "image"
> & {
  results: number;
  averageAccuracy: number;
  averageCpm: number;
};
