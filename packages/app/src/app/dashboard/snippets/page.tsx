import { Heading } from "@/components/ui/heading";
import Shell from "@/components/shell";
import React from "react";
import { Snippet } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { SnippetsTable } from "../_components/snippetsTable";
import { getSnippets, getTotalSnippets, isFieldInSnippet } from "./loaders";

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
          keyof Snippet | undefined,
          "asc" | "desc" | undefined
        ])
      : [];

  const sortBy = column && isFieldInSnippet(column) ? column : "rating";

  const [snippets, totalSnippets] = await Promise.all([
    getSnippets({
      order,
      skip,
      sortBy,
      take,
    }),
    getTotalSnippets(),
  ]);

  const userPageCount =
    totalSnippets === 0 ? 1 : Math.ceil(totalSnippets / take);
  return (
    <Shell layout="dashboard">
      <Heading title="Snippets" description="Manage your snippets" />
      <SnippetsTable data={snippets} pageCount={userPageCount} />
    </Shell>
  );
}
