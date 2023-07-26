import { Heading } from "@/components/ui/heading";
import { getCurrentUser } from "@/lib/session.js";
import { User } from "@prisma/client";
import {
  getAllUsersWithResults,
  getTotalUsers,
  getUsersWithResultCounts,
  getUsersWithResults,
  isFieldInUser,
} from "./loaders";
import { UserRankings } from "./user-rankings";
import { UsersTable } from "./users-table";

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
          keyof User | "Races played" | undefined,
          "asc" | "desc" | undefined,
        ])
      : [];

  const sortBy =
    column === "Races played"
      ? "Races played"
      : column && isFieldInUser(column)
      ? column
      : "averageCpm";

  let users = [];

  if (column === "Races played") {
    users = await getUsersWithResultCounts({
      take,
      skip,
      order,
    });
  } else {
    users = await getUsersWithResults({
      order,
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

  return (
    <div className="pt-12">
      <Heading title="Leaderboard" description="Find your competition" />
      {currUserIsRanked ? (
        <UserRankings currentUser={user} allUsers={allUsers} />
      ) : null}
      <UsersTable data={users} pageCount={pageCount} />
    </div>
  );
}
