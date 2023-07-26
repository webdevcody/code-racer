import { ScrollArea } from "@/components/ui/scroll-area";
import { Achievement as PrsimaAchievement } from "@prisma/client";
import { Achievement } from "@/types/achievement";
import React from "react";
import { BanIcon } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface Props {
    userAchievements: PrsimaAchievement[];
    allAchievements: Achievement[];
}

export default function AchievementProgress({
    userAchievements,
    allAchievements,
}: Props) {
    return (
        <ScrollArea className="rounded-md h-max border-2 border-primary p-4">
            <h3 className="text-primary font-special">Achievement Progress</h3>
            <div className="flex flex-col gap-5 items-center justify-center">
                {allAchievements.map((achievement) => {
                    const isUnlocked = userAchievements.some(
                        (userAchievement) => userAchievement.achievementType === achievement.type
                    );

                    return (
                        <div
                            key={achievement.type}
                            className={`flex self-center ${isUnlocked ? "unlocked" : "locked"}`}
                        >
                            {isUnlocked ? (
                                <Avatar>
                                    <AvatarImage src={achievement.image} />
                                </Avatar>
                            ) : (
                                <BanIcon className="text-primary" />
                            )}
                            <p className="mt-2 self-center text-center">{achievement.name}</p>
                        </div>
                    );
                })}
            </div>
        </ScrollArea>
    );
}
