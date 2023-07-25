"use client";

import * as React from "react";
import type { Snippet } from "@prisma/client";

import { type ColumnDef } from "unstyled-table";
import { DataTable } from "@/components/data-table/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { catchError } from "@/lib/utils";
import { snippetLanguages } from "@/config/languages";
import { deleteSnippetAction } from "@/app/review/actions";

export function SnippetsTable({
  data,
  pageCount,
}: {
  data: Snippet[];
  pageCount: number;
}) {
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([]);

  const columns = React.useMemo<ColumnDef<Snippet, unknown>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
              setSelectedRowIds((prev) =>
                prev.length === data.length ? [] : data.map((row) => row.id),
              );
            }}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
              setSelectedRowIds((prev) =>
                value
                  ? [...prev, row.original.id]
                  : prev.filter((id) => id !== row.original.id),
              );
            }}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "code",
        header: "Snippet",
        enableSorting: false,
        cell: ({ cell }) => {
          const code = cell.getValue() as string;
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge>
                    <Icons.eye className="mr-2 w-4 h-4" />
                    See
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <code>
                    <pre>{code}</pre>
                  </code>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ cell }) => {
          const rating = cell.getValue() as number;

          if (rating >= 5) {
            return <span className="text-success-foreground">{rating}</span>;
          } else if (rating >= 0) {
            return <span className="text-muted-foreground">{rating}</span>;
          } else if (rating >= -5) {
            return <span className="text-warning">{rating}</span>;
          } else {
            return <span className="text-destructive">{rating}</span>;
          }
        },
      },
      {
        accessorKey: "language",
        header: "Language",
        enableSorting: false,
        filterFn: (row, columnId, filterValue) => {
          const value = row.getValue(columnId) as Snippet["language"];

          return filterValue.includes(value);
        },
      },
    ],
    [],
  );

  async function deleteSelectedRows() {
    try {
      await Promise.all(
        selectedRowIds.map((id) =>
          deleteSnippetAction({
            id,
            path: "/dashboard/snippets",
          }),
        ),
      );
    } catch (err) {
      catchError(err);
    }
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      defaultSorting={{
        prop: "rating",
        val: "desc",
      }}
      filterableColumns={[
        {
          id: "language",
          title: "Language",
          //@ts-expect-error it's ok
          options: snippetLanguages,
        },
      ]}
      newRowLink="/add-snippet"
      deleteRowsAction={() => void deleteSelectedRows()}
    />
  );
}
