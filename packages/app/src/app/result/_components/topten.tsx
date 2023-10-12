"use client";

import React from "react";
import Link from "next/link";
import { Loader } from "lucide-react";

import { getTopTen } from "../actions";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { toast } from "@/components/ui/use-toast";

import { FALLBACK_IMG } from "@/config/consts";
import { cn } from "@/lib/utils";

type Props = {
  snippetID: string;
  sessionID?: string;
};

type TopTen = {
  id: string;
  accuracy: number;
  cpm: number;
  user: {
    id: string;
    name: string;
    averageAccuracy: number;
    averageCpm: number;
    image: string;
  };
}[];

const findUserInTopTen = (topTen: TopTen, sessionID: string) => {
  for (let idx = 0; idx < topTen.length; ++idx) {
    if (topTen[idx].user.id === sessionID) {
      return idx;
    }
  }
  return null;
};

const TopTenTable: React.FC<Props> = React.memo(({ snippetID, sessionID }) => {
  const [topTen, setTopTen] = React.useState<TopTen | undefined>();
  const [userPlacement, setUserPlacement] = React.useState<number | null>(null);
  const [transition, startTransition] = React.useTransition();

  React.useEffect(() => {
    startTransition(() => {
      getTopTen(snippetID)
        .then((topTen: TopTen) => {
          const sortedByCpm = topTen.sort((a, b) => {
            if (a.cpm < b.cpm) {
              return -1;
            }
            if (a.cpm > b.cpm) {
              return 1;
            }
            return 0;
          });
          setTopTen(sortedByCpm);
          if (sessionID) {
            setUserPlacement(findUserInTopTen(topTen, sessionID));
          }
        })
        .catch(() => {
          toast({
            title: "Something went wrong.",
            description:
              "An error occured in getting the top ten of users for this snippet.",
          });
        });
    });
  }, [sessionID, snippetID]);

  return (
    <React.Fragment>
      {transition && (
        <div className="flex flex-col items-center gap-2">
          <Loader className="animate-spin w-8 h-8" />
          Getting the top ten users...
        </div>
      )}
      {topTen && (
        <React.Fragment>
          {!sessionID && (
            <Heading
              typeOfHeading="h2"
              size="h2"
              title="Ranking"
              description="You must be logged in to be in the rankings."
            />
          )}

          {sessionID && (
            <Heading
              typeOfHeading="h2"
              size="h2"
              title="Ranking"
              description={
                userPlacement
                  ? "You are currently #" +
                    userPlacement +
                    " in the top ten for this snippet."
                  : "You are not placed in the rankings."
              }
            />
          )}

          <Table>
            <TableCaption>Top Ten Coders among this snippet.</TableCaption>
            <TableHeader>
              <TableHead></TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-center">Average CPM</TableHead>
              <TableHead className="text-center">Average Accuracy</TableHead>
            </TableHeader>
            <TableBody>
              {topTen.map((user, idx) => (
                <TableRow key={user.id}>
                  <TableCell className="text-yellow-500">{idx + 1}</TableCell>
                  <TableCell>
                    <Link href={`/users/${user.user.id}`}>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarFallback>
                            {user.user.name.charAt(0)}
                          </AvatarFallback>
                          <AvatarImage
                            src={user.user.image ?? FALLBACK_IMG}
                            alt={`${user.user.name}'s avatar`}
                            width={28}
                            height={28}
                          />
                        </Avatar>
                        <span>{user.user.name}</span>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">{user.cpm}</TableCell>
                  <TableCell
                    className={cn(
                      "text-center text-green-500",
                      { "text-yellow-500": user.accuracy > 75 },
                      { "text-red-500": user.accuracy > 50 }
                    )}
                  >
                    {user.accuracy}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </React.Fragment>
      )}
    </React.Fragment>
  );
});

TopTenTable.displayName = "TopTenTable";
export default TopTenTable;
