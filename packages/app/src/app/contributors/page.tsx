import { Heading } from "@/components/ui/heading";
import Contributor from "./_components/contributor";
import AdditionsDeletions from "./_components/additions-deletions";
import ProportionBarChart from "./_components/proportion-bar-chart";
import Time from "@/components/ui/time";
import CountingAnimation from "./_components/counting-animation";
import PaginationBar from "./_components/pagination-bar";
import { z } from "zod";

import {
  getContributors,
  getContributorCodeChanges,
  getRepoWeeklyCodeChanges,
} from "./_helpers/utils";
import { redirect } from "next/navigation";

const PER_PAGE_MAX = 15; // Limit to only 15 per page to avoid hitting rate limit

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce
    .number()
    .transform((v) => {
      if (v) {
        return v > PER_PAGE_MAX ? PER_PAGE_MAX : v;
      } else return PER_PAGE_MAX;
    })
    .default(PER_PAGE_MAX),
});

export default async function ContributorsPage({
  searchParams,
}: {
  searchParams: {
    page: string;
    per_page: string;
  };
}) {
  let parsedSearchParams;
  try {
    parsedSearchParams = searchParamsSchema.parse(searchParams);
  } catch (err) {
    redirect(`/contributors?page=1&per_page=${PER_PAGE_MAX}`);
  }
  const { page, per_page } = parsedSearchParams;
  const sliceStartIndex = (page - 1) * per_page;
  const sliceEndIndex = sliceStartIndex + per_page;
  const contributors = await getContributors();
  const totalPage = Math.ceil(contributors.length / per_page);
  const contributorCommitActivities = await getContributorCodeChanges(
    contributors,
  );
  const repoCommitActivity = await getRepoWeeklyCodeChanges();
  const [since, additions, deletions] =
    repoCommitActivity.length > 0
      ? repoCommitActivity[repoCommitActivity.length - 1]
      : [0, 0, 0];
  const sinceDate = new Date(since * 1000); // `since` is in Unix time (second)
  return (
    <div className="pt-12 pb-12">
      <Heading
        title="Contributors!"
        description="All the project contributors"
      />
      <br />
      <div className="flex flex-col items-center justify-start gap-3">
        <div className="w-[80vw] md:w-[70vw] lg:w-[50vw] xl:w-[600px] flex flex-col gap-4 justify-start items-center">
          <div className="flex flex-col items-center justify- gap-3">
            <CountingAnimation
              targetNumber={contributors.length}
              className="text-7xl text-primary font-extrabold"
            />
            <p className="text-2xl font-bold text-secondary-foreground">
              Contributors and counting!
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <p className="text-xl font-semibold text-center text-secondary-foreground">
              Since <Time date={sinceDate} />
            </p>
            <AdditionsDeletions
              verbose
              additions={additions}
              deletions={deletions}
              className="w-full"
            />
            <ProportionBarChart
              a={additions}
              b={deletions}
              className="w-full h-4"
            />
          </div>
          <PaginationBar
            className="mt-3"
            nextURL={`/contributors?page=${Math.min(
              page + 1,
              totalPage,
            )}&per_page=${per_page}`}
            prevURL={`/contributors?page=${Math.max(
              page - 1,
              1,
            )}&per_page=${per_page}`}
          />
        </div>
      </div>
      <ul className="grid gap-8 mt-8 list-none md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {contributors
          .slice(sliceStartIndex, sliceEndIndex)
          .map((contributor) => (
            <Contributor
              key={contributor.id}
              contributor={contributor}
              contributorsCodeChanges={
                contributorCommitActivities.find(
                  (e) => e.login === contributor.login,
                ) ?? { additions: 0, deletions: 0, login: contributor.login }
              }
            />
          ))}
      </ul>

      <PaginationBar
        className="flex justify-center mt-6 w-full"
        nextURL={`/contributors?page=${Math.min(
          page + 1,
          totalPage,
        )}&per_page=${per_page}`}
        prevURL={`/contributors?page=${Math.max(
          page - 1,
          1,
        )}&per_page=${per_page}`}
      />
    </div>
  );
}
