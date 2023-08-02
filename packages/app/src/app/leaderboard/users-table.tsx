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
import { sortFilters } from "./sort-filters";

type UserWithResults = User & { results: Result[] };

function convertNumberToOrdinal({ n }: { n: number }) {
  // special case for 11, 12, 13
  if (n % 100 === 11 || n % 100 === 12 || n % 100 === 13) {
    return n + "th";
  }

  // standard ordinal rules
  switch (n % 10) {
    case 1:
      return n + "st";
    case 2:
      return n + "nd";
    case 3:
      return n + "rd";
    default:
      return n + "th";
  }
}

export function UsersTable({
  data,
  pageCount,
  ranks,
  field,
}: {
  data: UserWithResults[];
  pageCount: number;
  ranks: {
    [key: string]: { 
      [key: string]: { 
        [key: string]: number | boolean 
      }
    }
  };
  field: string;
}) {
  const columns = React.useMemo<(ColumnDef<UserWithResults, unknown>&{headerClass?: string})[]>(
    () => [
      {
        accessorFn: (user) => {
          return user.id; // Display the "place" property in the table cell
        },
        header: "Rank", // Header title for the new column
        headerClass: "text-center",
        cell: ({ cell }) => {
          const userId = cell.getValue() as string;
          const crownColor: {[key: number]: string} = {
            1: "#FFD700",
            2: "#C0C0C0",
            3: "#CD7F32",
          }
          return (
            <div className="ml-1">
              {ranks[userId][field]["rank"] == 1 ||
              ranks[userId][field]["rank"] == 2 ||
              ranks[userId][field]["rank"] == 3 ? (
                <div className="flex justify-start items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="25"
                          viewBox="0 0 512 512"
                          fill={
                            crownColor[ranks[userId][field]["rank"] as number]
                          }
                          >
                          <path d="M4.1 38.2C1.4 34.2 0 29.4 0 24.6C0 11 11 0 24.6 0H133.9c11.2 0 21.7 5.9 27.4 15.5l68.5 114.1c-48.2 6.1-91.3 28.6-123.4 61.9L4.1 38.2zm503.7 0L405.6 191.5c-32.1-33.3-75.2-55.8-123.4-61.9L350.7 15.5C356.5 5.9 366.9 0 378.1 0H487.4C501 0 512 11 512 24.6c0 4.8-1.4 9.6-4.1 13.6zM80 336a176 176 0 1 1 352 0A176 176 0 1 1 80 336zm184.4-94.9c-3.4-7-13.3-7-16.8 0l-22.4 45.4c-1.4 2.8-4 4.7-7 5.1L168 298.9c-7.7 1.1-10.7 10.5-5.2 16l36.3 35.4c2.2 2.2 3.2 5.2 2.7 8.3l-8.6 49.9c-1.3 7.6 6.7 13.5 13.6 9.9l44.8-23.6c2.7-1.4 6-1.4 8.7 0l44.8 23.6c6.9 3.6 14.9-2.2 13.6-9.9l-8.6-49.9c-.5-3 .5-6.1 2.7-8.3l36.3-35.4c5.6-5.4 2.5-14.8-5.2-16l-50.1-7.3c-3-.4-5.7-2.4-7-5.1l-22.4-45.4z" />
                        </svg>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {ranks[userId][field]["shared"] ? "T-" : ""}
                          {convertNumberToOrdinal({
                            n: ranks[userId][field]["rank"] as number,
                          })}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ) : (
                <span>
                  {ranks[userId][field]["shared"] ? "T-" : ""}
                  {convertNumberToOrdinal({
                    n: ranks[userId][field]["rank"] as number,
                  })}
                </span>
              )}
            </div>
          );
        },
        enableSorting: false,
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
    [field],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
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
