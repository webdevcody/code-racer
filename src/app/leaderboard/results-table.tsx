"use client";

import * as React from "react";
import type { Result, User } from "@prisma/client";

import { type ColumnDef } from "unstyled-table";
import Image from "next/image";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icons } from "@/components/icons";

type ResultWithUser = Result & { user: User };

interface ResultsTableProps {
  data: ResultWithUser[];
  pageCount: number;
}

export function ResultsTable({ data, pageCount }: ResultsTableProps) {
  const columns = React.useMemo<ColumnDef<Result, unknown>[]>(
    () => [
      {
        accessorKey: "user",
        header: "User",
        cell: ({ cell }) => {
          const user = cell.getValue() as User;

          return (
            <Link href={`${user.id}`}>
              <div className="flex items-center gap-2">
                <Image
                  className="rounded-full"
                  src={user.image ?? ""}
                  alt="user avatar"
                  height={30}
                  width={30}
                />
                <span>{user.name}</span>
              </div>
            </Link>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "takenTime",
        header: "Taken time",
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
        accessorKey: "errorCount",
        header: "Errors",
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
        prop: "takenTime",
        val: "asc",
      }}
    />
  );
}
