import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import ProgressBar from "./components/progressBar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RaceTableServerSide from "./components/raceTableServerSide";
import SnippetTableServerSide from "./components/snippetTableServerSide";

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

  // List of recent games, total number of recent games, max cpm, max accuracy, avarage cpm, avarage accuracy
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
    <Card className="flex sm:flex-col md:flex-row">
      <CardContent className="flex justify-center">
        <div className="flex sm:flex-row md:flex-col gap-5 my-2 justify-evenly items-center rounded-full">
          <ProgressBar
            title="Rank"
            size={100}
            value={userRank}
            totalValue={totalUsers}
          />
          <ProgressBar
            title="Races"
            size={80}
            value={totalUserGames}
            totalValue={totalGames}
          />
          <ProgressBar
            title="Snippets"
            size={80}
            value={totalUserSnippets}
            totalValue={totalSnippets}
          />
          <ProgressBar
            title="Coming Soon!"
            size={80}
          />
        </div>
      </CardContent>
      <CardContent className="flex flex-col justify-start mt-3 w-full">
        <Tabs defaultValue="races" className="w-full">
          <TabsList className="grid w-[300px] grid-cols-2">
            <TabsTrigger value="races">Races</TabsTrigger>
            <TabsTrigger value="snippets">Snippets</TabsTrigger>
          </TabsList>
          <TabsContent value="races">
            <RaceTableServerSide user={user} searchParams={searchParams} totalUserGames={totalUserGames} />
          </TabsContent>
          <TabsContent value="snippets">
            <SnippetTableServerSide user={user} searchParams={searchParams} totalUserSnippets={totalUserSnippets} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}


// const maxCpm = (
    //   await prisma.result.findFirst({
    //     where: {
    //       userId: user.id,
    //     },
    //     orderBy: {
    //       cpm: "desc",
    //     },
    //   })
    // )?.cpm;

    // const maxAccuracy = (
    //   await prisma.result.findFirst({
    //     where: {
    //       userId: user.id,
    //     },
    //     orderBy: {
    //       accuracy: "desc",
    //     },
    //   })
    // )?.accuracy;

    // const aggregations = await prisma.result.aggregate({
    //   _avg: {
    //     accuracy: true,
    //     cpm: true,
    //   },
    //   where: {
    //     userId: user.id,
    //   },
    // });


{/* <div className="text-center ">
  <Heading title="Dashboard" description="Find your stats" />

  <div className="w-full mt-5">
    <PerformanceComparison recentGames={recentGames} />
  </div>
  <div className="grid grid-cols-1 pb-5 mt-5 md:grid-cols-2">
    <Card className="px-3 md:mr-4">
      <RecentRacesTable data={recentGames} pageCount={pageCount} />
    </Card>
  </div>
  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
    <AccuracyChart recentGames={recentGames} />
    <CpmChart recentGames={recentGames} />
  </div>
</div> */}