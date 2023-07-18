import { Heading } from "@/components/ui/heading";
import Shell from "@/components/shell";
import React from "react";
import { Result } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { RecentRacesTable } from "../components/recentRaces";

export default async function RacesPage({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/auth");

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

  const { races, totalRaces } = await prisma.$transaction(async (tx) => {
    const races = await prisma.result.findMany({
      take,
      skip,
      where: {
        userId: user.id,
      },
      orderBy: {
        [column ?? "createdAt"]: order,
      },
    });

    const totalRaces = await prisma.result.count({
      where: {
        userId: user.id,
      },
    });

    return { races, totalRaces };
  });

  const userPageCount = totalRaces === 0 ? 1 : Math.ceil(totalRaces / take);
  return (
    <Shell layout="dashboard">
      <Heading title="Races" description="Checkout your previous races." />
      <RecentRacesTable data={races} pageCount={userPageCount} />
    </Shell>
  );
}
