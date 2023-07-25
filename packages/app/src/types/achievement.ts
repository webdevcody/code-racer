import { AchievementType } from "@prisma/client";

export interface Achievement {
  type: AchievementType;
  name: string;
  description?: string;
  image: string;
}
