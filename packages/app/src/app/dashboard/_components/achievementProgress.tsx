"use client"

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

    const timelineRef = useRef<HTMLDivElement>(null);
    const [animatedItems, setAnimatedItems] = useState<string[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const inViewItems = entries
                    .filter((entry) => entry.isIntersecting)
                    .map((entry) => entry.target.id);

                setAnimatedItems((prevItems) => [...prevItems, ...inViewItems]);
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 0.5, // Adjust this threshold as per your needs
            }
        );

        const timelineItems = timelineRef.current?.querySelectorAll(".timeline-item");
        if (timelineItems) {
            timelineItems.forEach((item) => observer.observe(item));
        }

        return () => {
            if (timelineItems) {
                timelineItems.forEach((item) => observer.unobserve(item));
            }
        };
    }, []);


    return (
        <ScrollArea className="rounded-md h-[300px] border-2 border-primary p-4">
            <h3 className="text-primary font-special">Achievement Progress</h3>
            <div className="timeline" ref={timelineRef}>
                {updatedAllAch.map((achievement) => {
                    const isUnlocked = userAchievements.some(
                        (userAchievement) => userAchievement.achievementType === achievement.type
                    );

                    const itemId = `achievement-${achievement.type}`;

                    return (
                        <div
                            key={achievement.type}
                            id={itemId}
                            className={`timeline-item 
                                ${isUnlocked ? "unlocked" : "locked"
                                } shadow-lg shadow-accent opacity-100 
                                ${animatedItems.includes(itemId) ? "animate-fade" : ""} hover:animate-[bounce_1s] hover:cursor-pointer`}
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
