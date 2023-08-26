"use client";

import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { BanIcon } from "lucide-react";
import { Achievement as PrsimaAchievement } from "@prisma/client";
import { Achievement } from "@/types/achievement";
import "../timeline.css";

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
      <div className="timeline">
        {updatedAllAch.map((achievement) => {
          const timelineItemRef = useRef<HTMLDivElement>(null);

          const [isVisible, setIsVisible] = useState<boolean>(false);

          useEffect(() => {
            const observer = new IntersectionObserver(
              (entries) => {
                const [entry] = entries;
                setIsVisible(entry.isIntersecting);
              },
              {
                root: null,
                rootMargin: "-20px",
                threshold: 0.1, // Adjust this threshold as per your needs
              }
            );

            if (timelineItemRef.current) {
              observer.observe(timelineItemRef.current);
            }

            return () => {
              if (timelineItemRef.current) {
                observer.unobserve(timelineItemRef.current);
              }
            };
          }, [timelineItemRef]);

          const isUnlocked = userAchievements.some(
            (userAchievement) =>
              userAchievement.achievementType === achievement.type
          );

          const itemId = `achievement-${achievement.type}`;

          return (
            <div
              ref={timelineItemRef}
              key={achievement.type}
              id={itemId}
              className={`timeline-item ${isUnlocked ? "unlocked" : "locked"} ${
                isVisible && "animate-fade"
              } shadow-lg shadow-accent opacity-100 `}
            >
              <div className="timeline-content">
                {isUnlocked ? (
                  <Avatar>
                    <AvatarImage src={achievement.image} />
                  </Avatar>
                ) : (
                  <BanIcon className="text-primary" />
                )}
                <p>{achievement.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
