"use client";

import * as React from "react";
import type { Result } from "@prisma/client";

import { type ColumnDef } from "unstyled-table";
import Link from "next/link";
import { DataTable } from "@/components/data-table/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icons } from "@/components/icons";
import { cn, formatDate } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function RecentRacesTable({
  data,
  pageCount,
}: {
  data: Result[];
  pageCount: number;
}) {
  const columns = React.useMemo<ColumnDef<Result, unknown>[]>(
    () => [
      {
        accessorKey: "snippetId",
        header: "Race",
        enableSorting: false,
        cell: ({ cell }) => {
          const snippetId = cell.getValue() as string;
          return (
            <Link
              className={cn(buttonVariants(), "whitespace-nowrap")}
              href={`/race/practice?snippetId=${snippetId}`}
            >
              Practice
            </Link>
          );
        },
      },
      {
        accessorKey: "errorCount",
        header: "Errors",
      },
      {
        accessorKey: "accuracy",
        header: "Accuracy",
        cell: ({ cell }) => {
          const accuracy = cell.getValue() as number;

          if (accuracy > 0.8) {
            return <span className="text-green-600">{accuracy}</span>;
          } else if (accuracy > 0.5) {
            return <span className="text-orange-600">{accuracy}</span>;
          } else {
            return <span className="text-destructive">{accuracy}</span>;
          }
        },
      },
      {
        accessorKey: "cpm",
        header: () => {
          return (
            <div className="flex items-center gap-2">
              <span>Cpm</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Icons.info className="w-4 h-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Characters per minute</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ cell }) => {
          const date = cell.getValue() as Date;

          return <span> {formatDate(date)}</span>;
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
      defaultSorting={{
        prop: "createdAt",
        val: "asc",
      }}
    />
  );
}
