"use client"

import { Crown, Navigation } from "lucide-react";
import React, { Suspense, useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

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

const UserCard = ({
    user
}: { user: User }) => {
    return (
        <Card className="p-2 flex flex-col sm:flex-row justify-between hover:bg-gray-200 hover:text-secondary">
            <div className="flex flex-col">
                <p className="text-lg">{user.name}</p>
                <p className="text-sm">Points: {user.points}</p>
                <div className="hidden sm:inline">
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
            </div>
            <div className="hover:cursor-pointer">
                {/* Redirect to users page */}
                <Navigation />
            </div>
        </Card>
    )
}

const DisplayUsers = ({
    users, title
}: { users: User[], title: string }) => {
    return (
        <Card className="w-full md:w-100 p-4 bg-accent text-primary">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <ol start={4} className="list-decimal pl-6">
                {users.map((user, index) => (
                    <li key={index} className="mb-2 w-full marker:">
                        <UserCard user={user} />
                    </li>
                ))}
            </ol>
        </Card>
    )
}

const WinnerCard = ({ user, rankColor }: { user: User, rankColor: string }) => {
    return (
        <Card className="p-10 flex justify-center">
            <div className="flex flex-col gap-2 p-2 justify-center text-center items-center">
                <Crown color={rankColor} />
                {/* <Image src={tmpImgSrc} width={64} height={64} alt="User Profile" className="rounded-full" /> */}
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-lg">{user.points}</p>
            </div>
        </Card>
    );
};

const Podium = ({ winners }: {
    winners: User[]
}) => {
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth
                && window.innerWidth < 768) {
                setIsSmallScreen(true);
            } else {
                setIsSmallScreen(false);
            }
        }

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);

    }, []);

    return (
        <Card className="p-5">
            <div className="flex flex-col md:flex-row justify-center md:items-end md:mb-4">
                <div className="w-full md:w-1/3 text-ce md:mb-0 md:mr-4">
                    <div className="relative z-10 bg-accent rounded-lg py-6 px-4">
                        {
                            isSmallScreen ?
                                <WinnerCard user={winners[0]} rankColor="gold" />
                                :
                                <WinnerCard user={winners[1]} rankColor="silver" />
                        }
                    </div>
                </div>
                <div className="w-full md:w-1/3 text-center mb-4 md:mb-0 md:mx-2">
                    <div className="relative z-10 bg-accent rounded-lg py-8 px-4">
                        {
                            isSmallScreen ?
                                <WinnerCard user={winners[1]} rankColor="silver" />
                                :
                                <WinnerCard user={winners[0]} rankColor="gold" />
                        }
                    </div>
                </div>
                <div className="w-full md:w-1/3 text-center">
                    <div className="relative z-10 bg-accent rounded-lg py-4 px-4">
                        <WinnerCard user={winners[2]} rankColor="brown" />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default function LeaderboardPage() {
    return (
        <Tabs className="flex flex-col items-center justify-center" defaultValue="Top">
            <TabsList className="p-2 w-1/2 grid grid-cols-2 text-primary rounded-md sticky">
                <TabsTrigger className="flex justify-center rounded-md border-2 hover:border-primary focus:bg-accent" value="Top">Top</TabsTrigger>
                <TabsTrigger className="flex justify-center rounded-md border-2 hover:border-primary focus:bg-accent" value="Fastest">Fastest</TabsTrigger>
            </TabsList>
            <Suspense fallback={<div>Loading...</div>}>
                <TabsContent className="w-full" value="Top">
                    <Podium winners={leaderboardData.sort((a, b) => b.points - a.points)} />
                </TabsContent>
                <TabsContent className="w-full" value="Fastest">
                    <Podium winners={leaderboardData.sort((a, b) => b.highestScore - a.highestScore)} />
                </TabsContent>
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
                <TabsContent className="w-full sm:w-2/3" value="Top">
                    <ScrollArea className="h-[490px] rounded-md border p-4">
                        <DisplayUsers users={leaderboardData.sort((a, b) => b.points - a.points).slice(3)} title="Top Users" />
                    </ScrollArea>
                </TabsContent>
                <TabsContent className="w-full sm:w-2/3" value="Fastest">
                    <ScrollArea className="h-[490px] rounded-md border p-4">
                        <DisplayUsers users={leaderboardData.sort((a, b) => b.highestScore - a.highestScore).slice(3)} title="Fastest Users" />
                    </ScrollArea>
                </TabsContent>
            </Suspense>
        </Tabs>
    );
}

// todo
// - refactor card
// - show scroll area from 4 onwards
// - add hero compo for 1 2 3 ranks refer to css battles