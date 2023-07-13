import React from "react";

import { prisma } from "@/lib/prisma";
import { ResultsTable } from "./results-table";
import { Result } from "@prisma/client";
import { Heading } from "@/components/ui/heading";

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
          "asc" | "desc" | undefined,
        ])
      : [];

  const { results, totalResults } = await prisma.$transaction(async () => {
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

  const pageCount = totalResults === 0 ? 1 : Math.ceil(totalResults / take);

  return (
    <div>
      {/* <h1 className="my-4 text-3xl text-foreground">Leaderboard.</h1> */}
      <Heading title="Leaderboard" description="Find your competition" />
      <ResultsTable data={results} pageCount={pageCount} />
    </div>
  );
}
