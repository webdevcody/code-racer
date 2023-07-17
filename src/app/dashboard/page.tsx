import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import StackCard from "./components/stackbox";
import RaceTableServerSide from "./components/raceTableServerSide";
import SnippetTableServerSide from "./components/snippetTableServerSide";

import { Crown, FileCode2, Swords } from "lucide-react";
import { get } from "http";

interface DashboardPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const user = await getCurrentUser();

  if (!user) redirect("/");

  // List of all the data we need to fetch
  const {
    totalUsers,
    totalGames,
    totalSnippets,
    totalUserGames,
    totalUserSnippets,
    userRank,
  } = await prisma.$transaction(async () => {
    const totalUsers = await prisma.user.count();
    const totalGames = await prisma.result.count();
    const totalSnippets = await prisma.snippet.count();

    const totalUserGames = await prisma.result.count({
      where: {
        userId: user.id,
      },
    });

    const totalUserSnippets = await prisma.snippet.count({
      where: {
        userId: user.id,
      },
    });

    const userRank = 1;

    return {
      totalUsers,
      totalGames,
      totalSnippets,
      totalUserGames,
      totalUserSnippets,
      userRank,
    };
  });

  return (
    <Card className="flex flex-col">
      <CardContent className="flex justify-center items-center">
        <ScrollArea className="flex flex-col h-[150px] md:h-fit justify-center items-center bg-accent p-2 md:p-0">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 justify-evenly items-center">
            <StackCard
              title="Rank"
              subtitle="Your rank"
              icon={<Crown />}
              size={80}
              value={userRank}
              totalValue={totalUsers}
            />
            <StackCard
              title="Races"
              subtitle="Races participated"
              icon={<Swords />}
              size={80}
              value={totalUserGames}
              totalValue={totalGames}
            />
            <StackCard
              title="Snippets"
              subtitle="Snippets created"
              icon={<FileCode2 />}
              size={80}
              value={totalUserSnippets}
              totalValue={totalSnippets}
            />
            <StackCard title="Coming Soon!" subtitle="Coming Soon!" size={80} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardContent className="flex flex-col justify-start mt-3 w-full">
        <Tabs defaultValue="races" className="sm:w-fit md:w-full h-full">
          <TabsList className="grid sm:w-[150px] md:w-[300px] grid-cols-2">
            <TabsTrigger value="races">Races</TabsTrigger>
            <TabsTrigger value="snippets">Snippets</TabsTrigger>
          </TabsList>
          <TabsContent value="races">
            <RaceTableServerSide
              user={user}
              searchParams={searchParams}
              totalUserGames={totalUserGames}
            />
          </TabsContent>
          <TabsContent value="snippets">
            <SnippetTableServerSide user={user} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
