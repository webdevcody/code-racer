import { Heading } from "@/components/ui/heading";
import Shell from "@/components/shell";
import React from "react";
import { Result } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { SnippetsTable } from "../components/snippetsTable";

export default async function SnippetsPage({
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

  const { snippets, totalSnippets } = await prisma.$transaction(async (tx) => {
    const snippets = await prisma.snippet.findMany({
      take,
      skip,
      where: {
        userId: user.id,
      },
      orderBy: {
        [column ?? "rating"]: order,
      },
    });

    const totalSnippets = await prisma.snippet.count({
      where: {
        userId: user.id,
      },
    });

    return { snippets, totalSnippets };
  });

  const userPageCount =
    totalSnippets === 0 ? 1 : Math.ceil(totalSnippets / take);
  return (
    <Shell layout="dashboard">
      <Heading title="Snippets" description="Manage your snippets." />
      <SnippetsTable
        data={snippets}
        pageCount={userPageCount}
        userId={user.id}
      />
    </Shell>
  );
}
