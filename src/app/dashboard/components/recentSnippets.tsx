"use client";

import * as React from "react";
import type { Snippet } from "@prisma/client";
import { type ColumnDef } from "unstyled-table";
import { DataTable } from "@/components/data-table";

interface RecentSnippetsTableProps {
    data: Snippet[];
    pageCount: number;
}

export function RecentSnippetsTable({ data, pageCount }: RecentSnippetsTableProps) {

    const columns = React.useMemo<ColumnDef<Snippet, unknown>[]>(() => [
        {
            accessorKey: "id",
            header: "Snippet Id",
            enableSorting: false,
            cell: ({ cell }) => {
                const id = cell.getValue() as string;
                return id.slice(0, 4) + "..." + id.slice(id.length - 4);
            },
        },
        {
            accessorKey: "language",
            header: "Language",
            cell: ({ cell }) => {
                const language = cell.getValue() as string;
                return <span>{language}</span>;
            },
        },
        {
            accessorKey: "rating",
            header: "Rating",
            cell: ({ cell }) => {
                const rating = cell.getValue() as number;
                return <span>{rating}</span>;
            },
        },
    ],
        [],
    );

    return (
        <DataTable
            columns={columns}
            data={data}
            pageCount={pageCount}
        />
    );
}
