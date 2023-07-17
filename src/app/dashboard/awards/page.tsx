import React from "react";
import StackCard from "../components/stackbox";
import { Crown, FileCode2, Swords } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import Shell from "@/components/shell";

export default async function AwardsPage({}) {
  const user = await getCurrentUser();

  if (!user) redirect("/auth");

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

  return (
    <Shell layout="dashboard">
      <Heading title="Awards" description="Your awards" />
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
    </Shell>
  );
}
