"use client"

import { Navigation, ChevronDown } from "lucide-react";
import React, { useState } from "react";

import { Card } from "@/components/ui/card";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface User {
    name: string;
    points: number;
    highestScore: number;
    totalMatchesPlayed?: number;
}

const leaderboardData: User[] = [
    {
        name: "Alice Smith",
        points: 75,
        highestScore: 90,
        totalMatchesPlayed: 8
    },
    {
        name: "Bob Johnson",
        points: 120,
        highestScore: 120,
        totalMatchesPlayed: 12
    },
    {
        name: "Emily Davis",
        points: 50,
        highestScore: 70,
        totalMatchesPlayed: 6
    },
    {
        name: "Michael Wilson",
        points: 200,
        highestScore: 200,
        totalMatchesPlayed: 15
    },
    {
        name: "Sophia Anderson",
        points: 85,
        highestScore: 95,
        totalMatchesPlayed: 9
    },
    {
        name: "David Thompson",
        points: 110,
        highestScore: 120,
        totalMatchesPlayed: 11
    },
    {
        name: "Olivia Martinez",
        points: 65,
        highestScore: 80,
        totalMatchesPlayed: 7
    },
    {
        name: "Jacob Rodriguez",
        points: 150,
        highestScore: 150,
        totalMatchesPlayed: 13
    },
    {
        name: "Emma Lee",
        points: 95,
        highestScore: 100,
        totalMatchesPlayed: 10
    },
    {
        name: "William Taylor",
        points: 80,
        highestScore: 90,
        totalMatchesPlayed: 9
    },
    {
        name: "Sophie Brown",
        points: 100,
        highestScore: 110,
        totalMatchesPlayed: 10
    },
    {
        name: "Oliver Davis",
        points: 90,
        highestScore: 95,
        totalMatchesPlayed: 8
    },
    {
        name: "Isabella Thompson",
        points: 70,
        highestScore: 85,
        totalMatchesPlayed: 7
    },
    {
        name: "Ethan Wilson",
        points: 115,
        highestScore: 130,
        totalMatchesPlayed: 11
    },
    {
        name: "Mia Garcia",
        points: 80,
        highestScore: 100,
        totalMatchesPlayed: 9
    },
    {
        name: "Liam Martinez",
        points: 150,
        highestScore: 160,
        totalMatchesPlayed: 15
    },
    {
        name: "Ava Davis",
        points: 95,
        highestScore: 105,
        totalMatchesPlayed: 10
    },
    {
        name: "Noah Johnson",
        points: 85,
        highestScore: 95,
        totalMatchesPlayed: 8
    },
    {
        name: "Sophia Taylor",
        points: 120,
        highestScore: 130,
        totalMatchesPlayed: 12
    },
    {
        name: "Jackson Anderson",
        points: 70,
        highestScore: 85,
        totalMatchesPlayed: 7
    }
];

const NavigationIcon = () => (
    <Navigation />
);

const UserCard = ({
    user
}: { user: User }) => {
    return (
        <Card className="p-2 flex flex-col sm:flex-row justify-between hover:bg-gray-200 hover:text-secondary">
            <div className="flex flex-col">
                <p className="text-lg">{user.name}</p>
                <p className="text-sm">Points: {user.points}</p>
                <HoverCard>
                    <HoverCardTrigger>More</HoverCardTrigger>
                    <HoverCardContent style={{ width: "300px" }}>
                        <Card className="p-2 bg-secondary flex flex-col">
                            <p className="text-lg">{user.name}</p>
                            <span>Points: {user.points}</span>
                            <span>HighestScore: {user.highestScore} wpm</span>
                            <span>TotalMatchesPlayed: {user.totalMatchesPlayed}</span>
                        </Card>
                    </HoverCardContent>
                </HoverCard>
            </div>
            <div className="hover:cursor-pointer">
                {/* Redirect to users page */}
                <NavigationIcon />
            </div>
        </Card>
    )
}

const TopUsers = () => {
    const [visibleRecords, setVisibleRecords] = useState(5);

    const handleShowMore = () => {
        setVisibleRecords(
            (prevVisibleRecords: number) => prevVisibleRecords + 5
        );
    };

    const topUsers = leaderboardData.sort((a, b) => b.points - a.points).slice(0, visibleRecords);

    return (
        <Card className="w-full md:w-96 p-4 bg-primary text-secondary">
            <h2 className="text-lg font-semibold mb-2">Top Users</h2>
            <ol className="list-decimal pl-6">
                {topUsers.slice(0, visibleRecords).map((user, index) => (
                    <li className="mb-2" key={index}>
                        <UserCard user={user} />
                    </li>
                ))}
            </ol>
            <div className="flex justify-center">
                {visibleRecords < leaderboardData.length && (
                    <ChevronDown
                        className="mt-4 bg-button text-button border-2 border-button hover:bg-gray-600"
                        onClick={handleShowMore}
                    >
                        Show More
                    </ChevronDown>
                )}
            </div>
        </Card>
    )
};

const FastestUsers = () => {
    const [visibleRecords, setVisibleRecords] = useState(5);

    const handleShowMore = () => {
        setVisibleRecords(
            (prevVisibleRecords: number) => prevVisibleRecords + 5
        );
    };

    const fastestUsers = leaderboardData.sort((a, b) => b.highestScore - a.highestScore).slice(0, visibleRecords);

    return (
        <Card className="w-full md:w-96 p-4 bg-primary text-secondary">
            <h2 className="text-lg font-semibold mb-2">Fastest Users</h2>
            <ol className="list-decimal pl-6">
                {fastestUsers.map((user, index) => (
                    <li className="mb-2" key={index}>
                        <UserCard user={user} />
                    </li>
                ))}
            </ol>
            <div className="flex justify-center">
                {visibleRecords < leaderboardData.length && (
                    <ChevronDown
                        className="mt-4 bg-button text-button border-2 border-button hover:bg-gray-600"
                        onClick={handleShowMore}
                    >
                        Show More
                    </ChevronDown>
                )}
            </div>
        </Card>
    );
};

export default function LeaderboardPage() {
    return (
        <div className="flex flex-col md:flex-row p-3 gap-5 justify-evenly">
            <TopUsers />
            <FastestUsers />
        </div>
    );
}