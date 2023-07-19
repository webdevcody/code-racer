import React from "react";

import { prisma } from "@/lib/prisma";
import { UsersTable } from "./users-table";
import { Prisma, User } from "@prisma/client";
import { Heading } from "@/components/ui/heading";

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}) {
  const { page, per_page, sort } = searchParams;

  // Number of records to show per page
  const take = typeof per_page === "string" ? parseInt(per_page) : 5;

  // Number of records to skip
  const skip = typeof page === "string" ? (parseInt(page) - 1) * take : 0;

  // Column and order to sort by
  const [column, order] =
    typeof sort === "string"
      ? (sort.split(".") as [
          keyof User | "Races played" | undefined,
          "asc" | "desc" | undefined,
        ])
      : [];

  const sortBy =
    column === "Races played"
      ? "Races played"
      : column && column in prisma.user.fields
      ? column
      : "averageCpm";

  const { users, totalUsers } = await prisma.$transaction(async (tx) => {
    let users;

    if (column === "Races played") {
      users = await tx.user.findMany({
        take,
        skip,
        orderBy: {
          results: {
            _count: order,
          },
        },
        include: {
          results: true,
        },
        where: {
          results: {
            some: {},
          },
        },
      });
    } else {
      users = await tx.user.findMany({
        take,
        skip,
        orderBy: {
          [sortBy]: order,
        },
        include: {
          results: true,
        },
        where: {
          results: {
            some: {},
          },
        },
      });
    }

    const totalUsers = await prisma.user.count({
      where: {
        results: {
          some: {},
        },
      },
    });

    return {
      users,
      totalUsers,
    };
  });

  const pageCount = totalUsers === 0 ? 1 : Math.ceil(totalUsers / take);

  return (
    <div className="pt-12">
      <Heading title="Leaderboard" description="Find your competition" />
      <UsersTable data={users} pageCount={pageCount} />
    </div>
  );
}
