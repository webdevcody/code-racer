import React from "react";

import { prisma } from "@/lib/prisma";
import { UsersTable } from "./users-table";
import { Result } from "@prisma/client";
import { Heading } from "@/components/ui/heading";

interface LeaderboardPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

function calculateUsersAvarage(array: any[], key: string) {
  const overall = array.reduce((acc, obj) => {
    return Number(obj[key]) + acc;
  }, 0);
  return (overall / array.length).toFixed(2);
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
  const [] =
    typeof sort === "string"
      ? (sort.split(".") as [
          keyof Result | undefined,
          "asc" | "desc" | undefined,
        ])
      : [];

  const { usersWithAvg: users, totalUsers } = await prisma.$transaction(
    async () => {
      const users = await prisma.user.findMany({
        take,
        skip,
        // orderBy: {
        //   [column ?? ""]: order,
        // },
        include: {
          results: true,
        },
      });

      const totalUsers = await prisma.user.count();


      const usersWithAvg = users.map((user) => ({
        ...user,
        avarageCpm: calculateUsersAvarage(user.results, "cpm"),
        avarageAccuracy: calculateUsersAvarage(user.results, "accuracy"),
      }));

      return {
        usersWithAvg,
        totalUsers,
      };
    },
  );

  const pageCount = totalUsers === 0 ? 1 : Math.ceil(totalUsers / take);

  return (
    <div>
      {/* <h1 className="my-4 text-3xl text-foreground">Leaderboard.</h1> */}
      <Heading title="Leaderboard" description="Find your competition" />
      <UsersTable data={users} pageCount={pageCount} />
    </div>
  );
}
