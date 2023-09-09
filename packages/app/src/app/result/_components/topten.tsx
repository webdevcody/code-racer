
import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Heading } from "@/components/ui/heading";

import { getTopTen, getUserSnippetPlacement } from "../loaders";

export async function TopTable({ snippetId }: { snippetId?: string }) {
  const topten = await getTopTen(snippetId);
  const userPlacement = await getUserSnippetPlacement(snippetId);

  return (
    <>
      {userPlacement && (
        <Heading
          title="Ranking"
          description={`Your current placement among this snippet is #${userPlacement}.`}
        />
      )}
      <Table>
        <TableCaption>Top ten list for completed snippet.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>User</TableHead>
            <TableHead className="text-center">Average CPM</TableHead>
            <TableHead className="text-center">Average Accuracy</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topten.map((topten, i) => (
            <TableRow key={i + 1}>
              <TableCell className="text-yellow-500">{i + 1}</TableCell>
              <TableCell>
                <Link href={`/users/${topten.user.id}`}>
                  <div className="flex items-center gap-2">
                    <Image
                      className="rounded-full"
                      src={topten.user.image ?? ""}
                      alt="user avatar"
                      height={30}
                      width={30}
                    />
                    <span>{topten.user.name}</span>
                  </div>
                </Link>
              </TableCell>
              <TableCell className="text-center">{topten.cpm}</TableCell>
              <TableCell
                className={
                  topten.accuracy > 75
                    ? "text-center text-green-500"
                    : topten.accuracy > 50
                    ? "text-center text-yellow-500"
                    : "text-center text-red-500"
                }
              >
                {topten.accuracy}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
