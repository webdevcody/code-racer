import { Heading } from "@/components/ui/heading";
import { getCurrentUser } from "@/lib/session.js";
import { Result, User } from "@prisma/client";
import {
  getAllUsersWithResults,
  getTotalUsers,
  getUsersWithResultCounts,
  getUsersWithResults,
  isFieldInUser,
} from "./loaders";
import { UserRankings } from "./user-rankings";
import { UsersTable } from "./users-table";
import { sortFilters } from "./sort-filters";

type UserWithResults = User & { results: Result[] };

function getUserRankByValue({
  userId,
  fieldName,
  values,
  userRanks,
}: {
  userId: string | undefined;
  fieldName: string;
  values: { id: string; value: number }[];
  userRanks: {
    [key: string]: { [key: string]: { [key: string]: number | boolean } };
  };
}) {
  let currentRank = 1;
  let shared = false;

  values
    .sort((a, b) => b.value - a.value)
    .forEach((current, i, arr) => {
      const next = arr[i + 1];

      if (userRanks[current.id] && userRanks[current.id][fieldName]) {
        return;
      }

      if (!userRanks[current.id]) userRanks[current.id] = {};

      userRanks[current.id][fieldName] = { rank: currentRank };

      if (next === undefined || current.value === next.value) {
        return;
      }

      if (next.id == userId || current.id == userId) {
        if (current.value == next.value) shared = true;
      }

      currentRank++;
    });

  return shared;
}

function calculateUsersRank({
  currentUserId,
  allUsers,
}: {
  currentUserId: string | undefined;
  allUsers: UserWithResults[];
}) {
  // userRanks stores rank of all users in all category (avgCPM, avgAcc, totalRaces)
  /* { 
        _userID_ : { 
          avgCPM : { rank: 2 }, 
          avgAcc : { rank: 5 },
          totalRaces : { rank: 1 },
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

  const gamesPlayedRankShared = getUserRankByValue({
    userId: currentUserId,
    fieldName: sortFilters.RacePlayed,
    values: allUsers.map((u) => ({ id: u.id, value: u.results.length })),
    userRanks,
  });

  const averageCPMRankShared = getUserRankByValue({
    userId: currentUserId,
    fieldName: sortFilters.AverageCPM,
    values: allUsers.map((u) => ({ id: u.id, value: Number(u.averageCpm) })),
    userRanks,
  });

  const averageAccRankShared = getUserRankByValue({
    userId: currentUserId,
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
          "asc" | "desc" | undefined,
        ])
      : [];

  const sortBy =
    column === sortFilters.RacePlayed
      ? sortFilters.RacePlayed
      : column && isFieldInUser(column)
      ? column
      : sortFilters.AverageCPM;

  let users = [];

  if (column === sortFilters.RacePlayed) {
    users = await getUsersWithResultCounts({
      take,
      skip,
      order: order ? order : "desc",
    });
  } else {
    users = await getUsersWithResults({
      order: order ? order : "desc",
      skip,
      sortBy,
      take,
    });
  }

  const totalUsers = await getTotalUsers();
  const pageCount = totalUsers === 0 ? 1 : Math.ceil(totalUsers / take);

  const user = await getCurrentUser();
  const allUsers = await getAllUsersWithResults();
  const currUserIsRanked =
    user !== undefined && allUsers.some((u) => u.id === user.id);
  
  const userRanks = calculateUsersRank({
    currentUserId: user?.id,
    allUsers: allUsers,
  });

  return (
    <div className="pt-12">
      <Heading title="Leaderboard" description="Find your competition" />
      {currUserIsRanked ? (
        <UserRankings currentUser={user} allUsers={allUsers} />
      ) : null}
      <UsersTable data={users} pageCount={pageCount} ranks={userRanks} field={sortBy}/>
    </div>
  );
}
