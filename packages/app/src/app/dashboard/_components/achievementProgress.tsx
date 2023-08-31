"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { BanIcon } from "lucide-react";
import { Achievement as PrsimaAchievement } from "@prisma/client";
import { Achievement } from "@/types/achievement";

interface Props {
  userAchievements: PrsimaAchievement[];
  allAchievements: Achievement[];
}

export default function AchievementProgress({
  userAchievements,
  allAchievements,
}: Props) {
  const updatedAllAch = [
    ...allAchievements,
    {
      type: "MORE_TO_COME",
      image: "/static/first.png",
      name: "More to come!",
    },
    {
      type: "MORE_TO_COME_2",
      image: "/static/first.png",
      name: "More to come!",
    },
  ];

  return (
    <ScrollArea className="rounded-md h-[300px] border-2 border-primary p-4 mt-10">
      <h3 className="text-primary font-special">Achievement Progress</h3>
      <div className="relative my-[20px] flex flex-col justify-center items-center">
        {updatedAllAch.map((achievement) => {
          const isUnlocked = userAchievements.some(
            (userAchievement) =>
              userAchievement.achievementType === achievement.type
          );

          const itemId = `achievement-${achievement.type}`;

          return (
            <div
              key={achievement.type}
              id={itemId}
              style={
                isUnlocked
                  ? {
                      backgroundImage: "var(--achievement-progress-gradient)",
                    }
                  : {}
              }
              className={`relative h-[62px] p-[3px] mb-[20px] rounded-sm  cursor-pointer w-1/2 lg:w-1/4  ${
                isUnlocked ? "animate-gradient bg-achievement" : "bg-red-500"
              }  shadow-lg shadow-accent even:ml-[50%] odd:mr-[50%]`}
            >
              <div className="flex items-center justify-center text-center w-full h-full bg-accent rounded-md">
                {isUnlocked ? (
                  <Avatar>
                    <AvatarImage src={achievement.image} />
                  </Avatar>
                ) : (
                  <BanIcon className="text-primary" />
                )}
                <p className="m-0 pl-[3px]">{achievement.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
