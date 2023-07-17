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
import CpmChart from "./components/cpmChart";
import { getRecentGames } from "./loaders";
import AccuracyChart from "./components/accuracyChart";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/");

  const recentGames = await getRecentGames();

  const { totalUserGames, totalUserSnippets, userRank } =
    await prisma.$transaction(async () => {
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
    <Card className="flex flex-col mt-12 pt-8">
      <CardContent className="flex justify-center items-center">
        <ScrollArea className="flex flex-col md:h-fit justify-center items-center p-2 md:p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 justify-evenly items-center">
            <StackCard
              title="Rank"
              subtitle="Your rank"
              icon={<Crown />}
              size={80}
              value={userRank}
            />
            <StackCard
              title="Races"
              subtitle="Races participated"
              icon={<Swords />}
              size={80}
              value={totalUserGames}
            />
            <StackCard
              title="Snippets"
              subtitle="Snippets created"
              icon={<FileCode2 />}
              size={80}
              value={totalUserSnippets}
            />
          </div>
        </ScrollArea>
      </CardContent>
      <CardContent className="flex flex-col justify-start mt-3 w-full">
        <Tabs defaultValue="races" className="w-full">
          <TabsList className="flex w-fit">
            <TabsTrigger value="races">Races</TabsTrigger>
            <TabsTrigger value="cpm">CPM</TabsTrigger>
            <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
            <TabsTrigger value="snippets">Snippets Submitted</TabsTrigger>
          </TabsList>

          <TabsContent value="races">
            <RaceTableServerSide
              user={user}
              searchParams={searchParams}
              totalUserGames={totalUserGames}
            />
          </TabsContent>

          <TabsContent value="cpm">
            <CpmChart recentGames={recentGames} />
          </TabsContent>

          <TabsContent value="accuracy">
            <AccuracyChart recentGames={recentGames} />
          </TabsContent>

          <TabsContent value="snippets">
            <SnippetTableServerSide user={user} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
