import { Navigation, ChevronDown } from "lucide-react";
import React, { useState } from "react";

import { Card } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { prisma } from "@/lib/prisma";
import { ResultsTable } from "@/components/results-table";
import { Result } from "@prisma/client";

interface LeaderboardPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function LeaderboardPage({
  searchParams,
}: LeaderboardPageProps) {
  const { page, per_page, sort } = searchParams;

  // Number of records to show per page
  const take = typeof per_page === "string" ? parseInt(per_page) : 5;

  // Number of records to skip
  const skip = typeof page === "string" ? (parseInt(page) - 1) * take : 0;

  // Column and order to sort by
  const [column, order] =
    typeof sort === "string"
      ? (sort.split(".") as [
          keyof Result | undefined,
          "asc" | "desc" | undefined
        ])
      : [];

  const { results, totalResults } = await prisma.$transaction(async (tx) => {
    const results = await prisma.result.findMany({
      take,
      skip,
      orderBy: {
        [column ?? "takenTime"]: order,
      },
      include: {
        user: true,
      },
    });

    const totalResults = await prisma.result.count();

    return {
      results,
      totalResults,
    };
  });

  const pageCount = Math.ceil(totalResults / take);

  return (
    <div className="container md:min-h-[calc(100vh-12rem)] max-w-4xl">
      <h1 className="text-3xl text-foreground my-4">Leaderboard.</h1>
      <ResultsTable data={results} pageCount={pageCount} />
    </div>
  );
}
