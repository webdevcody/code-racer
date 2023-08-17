"use client";

import * as React from "react";
import type { User } from "@prisma/client";
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
import { UserWithResults } from "./types";

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
        [key: string]: number | boolean;
      };
    };
  };
  field: string;
}) {
  const columns = React.useMemo<
    (ColumnDef<UserWithResults, unknown> & { headerClass?: string })[]
  >(
    () => [
      {
        accessorFn: (user) => {
          return user.id; // Display the "place" property in the table cell
        },
        header: "Rank", // Header title for the new column
        headerClass: "text-center",
        cell: ({ cell }) => {
          const userId = cell.getValue() as string;
          const crownColor: { [key: number]: string } = {
            1: "#FFD700",
            2: "#C0C0C0",
            3: "#CD7F32",
          };
          return (
            <div className="ml-1">
              {ranks[userId][field]["rank"] == 1 ||
              ranks[userId][field]["rank"] == 2 ||
              ranks[userId][field]["rank"] == 3 ? (
                <div className="relative flex justify-start items-center">
                  <div className="w-[20px] h-[20px] flex items-center justify-center absolute top-[2px] left-[6px] animate-star-scale delay-75">
                    <svg
                      width={
                        20 - 4 * ((ranks[userId][field]["rank"] as number) - 1)
                      }
                      height={
                        20 - 4 * ((ranks[userId][field]["rank"] as number) - 1)
                      }
                      viewBox="0 0 140 140"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="animate-star-rotate drop-shadow-md"
                      stroke="1"
                    >
                      <path
                        d="M65.1222 4.65384C66.294 -0.547791 73.706 -0.547802 74.8778 4.65383L85.3 50.921C85.7243 52.8047 87.1953 54.2757 89.079 54.7L135.346 65.1222C140.548 66.294 140.548 73.706 135.346 74.8778L89.079 85.3C87.1953 85.7243 85.7243 87.1953 85.3 89.079L74.8778 135.346C73.706 140.548 66.294 140.548 65.1222 135.346L54.7 89.079C54.2757 87.1953 52.8047 85.7243 50.921 85.3L4.65384 74.8778C-0.547791 73.706 -0.547802 66.294 4.65383 65.1222L50.921 54.7C52.8047 54.2757 54.2757 52.8047 54.7 50.921L65.1222 4.65384Z"
                        fill="white"
                      />
                    </svg>
                  </div>
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
          return user.id;
        },
        header: "User",
        cell: ({ cell }) => {
          const userInfo = cell.row.original;

          return (
            <Link href={`/users/${userInfo.id}`}>
              <div className="flex items-center gap-2">
                {userInfo.image && (
                  <Image
                    className="rounded-full"
                    src={userInfo.image ?? ""}
                    alt="user avatar"
                    height={30}
                    width={30}
                  />
                )}
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
          return results;
        },
        accessorKey: "racesPlayed",
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
        enableSorting: false,
      },
    ],
    [field]
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
