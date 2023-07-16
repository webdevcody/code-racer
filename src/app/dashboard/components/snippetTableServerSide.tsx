import React from "react"
import { prisma } from "@/lib/prisma";
import { RecentSnippetsTable } from "./recentSnippets";
import { Snippet } from "@prisma/client";
import { User } from "next-auth";

interface SnippetTableServerSideProps {
    user: User;
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
    totalUserSnippets: number;
}

export default async function SnippetTableServerSide({
    user,
    searchParams,
    totalUserSnippets,
}: SnippetTableServerSideProps) {

    const { page, per_page, sort } = searchParams;

    // Number of records to show per page
    const take = typeof per_page === "string" ? parseInt(per_page) : 5;

    // Number of records to skip
    const skip = typeof page === "string" ? (parseInt(page) - 1) * take : 0;

    // Column and order to sort by
    const [column, order] = (typeof sort === "string")
        ?
        (
            sort.split(".") as [keyof Snippet | undefined, "asc" | "desc" | undefined,]
        )
        :
        [];

    const recentSnippets = await prisma.snippet.findMany({
        take,
        skip,
        where: {
            userId: user.id,
        },
        orderBy: {
            [column ?? "id"]: order,
        },
    });

    const snippetPageCount = (totalUserSnippets === 0) ? 1 : Math.ceil(totalUserSnippets / take);

    return (
        <RecentSnippetsTable data={recentSnippets} pageCount={snippetPageCount} />
    )
}
