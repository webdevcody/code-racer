import { Heading } from "@/components/ui/heading";
import { getCurrentUser } from "@/lib/session.js";
import { User } from "@prisma/client";
import {
  getAllUsersWithResults,
  getTotalUsers,
  getUsersWithResultCounts,
  isFieldInUser,
} from "./loaders";
import { UserRankings } from "./user-rankings";
import { UsersTable } from "./users-table";
import { sortFilters } from "./sort-filters";
import { UserWithResults } from "./types";

function setUsersRankByValue({
  fieldName,
  values,
  userRanks,
}: {
  fieldName: string;
  values: { id: string; value: number }[];
  userRanks: {
    [key: string]: { [key: string]: { [key: string]: number | boolean } };
  };
}) {
  let currentRank = 1;

  values
    .sort((a, b) => b.value - a.value)
    .forEach((current, i, arr) => {
      const next = arr[i + 1];
      const prev = arr[i - 1];

      if (userRanks[current.id] && userRanks[current.id][fieldName]) {
        return;
      }

      if (!userRanks[current.id]) userRanks[current.id] = {};

      userRanks[current.id][fieldName] = { rank: currentRank };

      if (next && current.value == next.value) {
        userRanks[current.id][fieldName]["shared"] = true;
      }

      if (prev && current.value == prev.value) {
        userRanks[current.id][fieldName]["shared"] = true;
      }

      if (next === undefined || current.value === next.value) {
        return;
      }

      currentRank++;
    });
}

function calculateUsersRank(allUsers: UserWithResults[]) {
  // userRanks stores rank of all users in all category (avgCPM, avgAcc, totalRaces)
  /* { 
        _userID_ : { 
          avgCPM : { 
            rank: 2,
            shared: true,
          }, 
          avgAcc : { 
            rank: 5,
            shared: false,
          },
          totalRaces : { 
            rank: 1,
            shared: false,
          },
        }
      }
  */
  const userRanks: {
    [key: string]: {
      [key: string]: {
        [key: string]: number | boolean;
      };
    };
  } = {};

  // Set user ranks based on different fields:
  // Based on Race Played:
  setUsersRankByValue({
    fieldName: sortFilters.RacePlayed,
    values: allUsers.map((u) => ({ id: u.id, value: u.results })),
    userRanks,
  });

  // Based on Average CPM:
  setUsersRankByValue({
    fieldName: sortFilters.AverageCPM,
    values: allUsers.map((u) => ({ id: u.id, value: Number(u.averageCpm) })),
    userRanks,
  });

  // Based on Average Accuracy:
  setUsersRankByValue({
    fieldName: sortFilters.AverageAccuracy,
    values: allUsers.map((u) => ({
      id: u.id,
      value: Number(u.averageAccuracy),
    })),
    userRanks,
  });

  return userRanks;
}

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}) {
  const { page, per_page, sort } = searchParams;

  // Number of records to show per page
  const take = typeof per_page === "string" ? parseInt(per_page) : 5;

  // Number of records to skip
  const skip = typeof page === "string" ? (parseInt(page) - 1) * take : 0;

  // Column and order to sort by
  const [column, order] =
    typeof sort === "string"
      ? (sort.split(".") as [
          keyof User | sortFilters.RacePlayed | undefined,
          "asc" | "desc" | undefined
        ])
      : [];

  const sortBy =
    column === sortFilters.RacePlayed
      ? sortFilters.RacePlayed
      : column && isFieldInUser(column)
      ? column
      : sortFilters.AverageCPM;

  const users = await getUsersWithResultCounts({
    take,
    skip,
    sortBy,
    order: order ? order : "desc",
  });

  const totalUsers = await getTotalUsers();
  const pageCount = totalUsers === 0 ? 1 : Math.ceil(totalUsers / take);

  const user = await getCurrentUser();
  const allUsers = await getAllUsersWithResults();
  const currUserIsRanked =
    user !== undefined && allUsers.some((u) => u.id === user.id);

  const userRanks = calculateUsersRank(allUsers);

  return (
    <div className="pt-12">
      <Heading title="Leaderboard" description="Find your competition" />
      {currUserIsRanked ? (
        <UserRankings currentUserRankDetail={userRanks[user.id]} />
      ) : null}
      <UsersTable
        data={users}
        pageCount={pageCount}
        ranks={userRanks}
        field={sortBy}
      />
    </div>
  );
}
