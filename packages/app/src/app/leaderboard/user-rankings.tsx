import type { Result, User } from "@prisma/client";
import { User as NextUser } from "next-auth";
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

function getRank({
  rankDetail,
}: {
  rankDetail: {
    [key: string]: number | boolean;
  };
}) {
  if (rankDetail.shared) {
    return "T-" + convertNumberToOrdinal({ n: rankDetail["rank"] as number });
  } else {
    return convertNumberToOrdinal({ n: rankDetail["rank"] as number });
  }
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
  currentUserRankDetail,
}: {
  currentUserRankDetail: {
    [key: string]: {
      [key: string]: number | boolean;
    };
  };
}) {
  const userRankByGamesPlayed = getRank({
    rankDetail: currentUserRankDetail[sortFilters.RacePlayed],
  });

  const userRankByAverageCPM = getRank({
    rankDetail: currentUserRankDetail[sortFilters.AverageCPM],
  });

  const userRankByAverageAcc = getRank({
    rankDetail: currentUserRankDetail[sortFilters.AverageAccuracy],
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
