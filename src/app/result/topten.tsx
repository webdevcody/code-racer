import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getTopTen(snippet: string | undefined) {
  const result = await prisma.result.findMany({
    where: {
      snippetId: snippet,
    },
    orderBy: {
      cpm: "desc",
    },
    take: 10,
    distinct: ["userId"],
    include: {
      user: true,
    },
  });
  return result;
}

export async function TopTable({ snippet }: { snippet?: string }) {
  const topten = await getTopTen(snippet);

  return (
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
              <Link href={`/users/${topten.userId}`}>{topten.user.name}</Link>
            </TableCell>
            <TableCell className="text-center">{topten.cpm}</TableCell>
            <TableCell
              className={
                topten.accuracy.toNumber() > 75
                  ? "text-center text-green-500"
                  : topten.accuracy.toNumber() > 50
                  ? "text-center text-yellow-500"
                  : "text-center text-red-500"
              }
            >
              {topten.accuracy.toNumber()}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
