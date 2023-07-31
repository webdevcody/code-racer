"use client";

import * as React from "react";
import type { Result, User } from "@prisma/client";

import { type ColumnDef } from "unstyled-table";
import Image from "next/image";
import Link from "next/link";
import { DataTable } from "@/components/data-table/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

type UserWithResults = User & { results: Result[]; place?: number }; // Adding "place" property to the type

export function UsersTable({
  data,
  pageCount,
}: {
  data: UserWithResults[];
  pageCount: number;
}) {
  // Calculates the "place" property for each user based on "averageCpm"
  const sortedData = [...data].sort(
    (a, b) => Number(b.averageCpm) - Number(a.averageCpm),
  );

  sortedData.forEach((user, index) => {
    user.place = index + 1;
  });

  const columns = React.useMemo<ColumnDef<UserWithResults, unknown>[]>(
    () => [
      {
        accessorFn: (user) => {
          return user.place; // Display the "place" property in the table cell
        },
        header: "Place", // Header title for the new column
        cell: ({ cell }) => {
          const racerPlace = cell.getValue() as number;
          return <span className="ml-2">{racerPlace}</span>;
        },
      },
      {
        accessorFn: (user) => {
          return {
            id: user.id,
            image: user.image ?? "",
            name: user.name,
          };
        },
        header: "User",
        cell: ({ cell }) => {
          const userInfo = cell.getValue() as User;

          return (
            <Link href={`/users/${userInfo.id}`}>
              <div className="flex items-center gap-2">
                <Image
                  className="rounded-full"
                  src={userInfo.image ?? ""}
                  alt="user avatar"
                  height={30}
                  width={30}
                />
                <span>{userInfo.name}</span>
              </div>
            </Link>
          );
        },
        enableSorting: false,
      },
      {
        accessorFn: (user) => {
          return user.averageCpm;
        },
        accessorKey: "averageCpm",
        header: () => {
          return (
            <div className="flex items-center gap-2">
              <span>Average cpm</span>
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
        cell: ({ cell }) => {
          const averageCpm = cell.getValue() as number;

          return <span>{averageCpm}</span>;
        },
      },
      {
        accessorFn: (user) => {
          return user.averageAccuracy;
        },
        accessorKey: "averageAccuracy",
        header: "Average accuracy",
        cell: ({ cell }) => {
          const avgAccuracy = cell.getValue() as number;

          return (
            <span
              className={cn("text-green-600", {
                "text-orange-600": avgAccuracy > 0.5 && avgAccuracy < 0.8,
                "text-destructive": avgAccuracy < 0.5,
              })}
            >
              {avgAccuracy}%
            </span>
          );
        },
      },
      {
        accessorFn: ({ results }) => {
          return results.length;
        },
        header: "Races played",
      },
      {
        accessorFn: (user) => {
          return user.topLanguages;
        },
        header: "Top languages",
        cell: ({ cell }) => {
          const topLanguages = cell.getValue() as string[];
          return (
            <div>
              {topLanguages.length > 0 ? (
                <span className="capitalize">{topLanguages.join(", ")}</span>
              ) : (
                <span className="capitalize text-gray-400">---</span>
              )}
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={sortedData}
        pageCount={pageCount}
        defaultSorting={{
          prop: "averageCpm",
          val: "desc",
        }}
      />
      <p className="text-sm md:text-base mt-1 text-muted-foreground">
        You must have completed 5 races to be placed in the leaderboards.
      </p>
    </>
  );
}
