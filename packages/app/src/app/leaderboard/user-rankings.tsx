import type { Result, User } from "@prisma/client";
import { User as NextUser } from "next-auth";

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

function getUserRankByValue({
  userId,
  values,
}: {
  userId: string;
  values: { id: string; value: number }[];
}) {
  const rankMap = new Map();
  let currentRank = 1;

  values
    .sort((a, b) => b.value - a.value)
    .forEach((current, i, arr) => {
      const next = arr[i + 1];

      if (rankMap.has(current.id)) {
        return;
      }

      rankMap.set(current.id, currentRank);

      if (next === undefined || current.value === next.value) {
        return;
      }

      currentRank++;
    });

  const userRank = rankMap.get(userId);
  const userRankOrdinal = convertNumberToOrdinal({ n: userRank });
  rankMap.delete(userId);

  const sharesRank = [...rankMap.values()].some((r) => r === userRank);

  if (sharesRank) {
    return `T-${userRankOrdinal}`;
  }

  return userRankOrdinal;
}

function Ranking({ label, rank }: { label: string; rank: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-xs md:text-sm text-center text-muted-foreground uppercase">
        {label}
      </div>
      <div className="text-2xl md:text-3xl">{rank}</div>
    </div>
  );
}

export async function UserRankings({
  currentUser,
  allUsers,
}: {
  currentUser: NextUser;
  allUsers: UserWithResults[];
}) {
  const userRankByGamesPlayed = getUserRankByValue({
    userId: currentUser.id,
    values: allUsers.map((u) => ({ id: u.id, value: u.results.length })),
  });

  const userRankByAverageCPM = getUserRankByValue({
    userId: currentUser.id,
    values: allUsers.map((u) => ({ id: u.id, value: Number(u.averageCpm) })),
  });

  const userRankByAverageAcc = getUserRankByValue({
    userId: currentUser.id,
    values: allUsers.map((u) => ({
      id: u.id,
      value: Number(u.averageAccuracy),
    })),
  });

  return (
    <div className="flex flex-col items-center gap-5 mt-2 p-2">
      <h1 className="text-1xl md:text-2xl font-special font-bold tracking-tight text-primary">
        Your Rankings
      </h1>
      <div className="w-full flex justify-evenly">
        <Ranking label="by average cpm" rank={userRankByAverageCPM} />
        <Ranking label="by average accuracy" rank={userRankByAverageAcc} />
        <Ranking label="by races played" rank={userRankByGamesPlayed} />
      </div>
    </div>
  );
}
