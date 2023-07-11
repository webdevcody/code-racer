"use client";

import * as React from "react";
import type { Result, User } from "@prisma/client";

import { type ColumnDef } from "unstyled-table";
import Image from "next/image";
import Link from "next/link";
import { DataTable } from "./data-table";

type ResultWithUser = Result & { user: User };

interface ResultsTableProps {
  data: ResultWithUser[];
  pageCount: number;
}

export function ResultsTable({ data, pageCount }: ResultsTableProps) {
  // define columns for our table
  const columns = React.useMemo<ColumnDef<Result, unknown>[]>(
    () => [
      {
        // the key of a row object (data.user)
        accessorKey: "user",
        header: "User",
        // in here we get our accessorKey (data.user)
        // and defined custom look for each row of the column
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
        // get the data.takenTime  value
        accessorKey: "takenTime",
        header: "Taken time",
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      defaultSorting={{
        prop: "takenTime", // property of the data that will be sorted by default
        val: "asc", // you get it
      }}
    />
  );
}
