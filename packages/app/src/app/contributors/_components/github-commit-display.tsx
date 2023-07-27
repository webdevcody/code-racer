import { type GitHubUser, type GitHubCommit } from "../_helpers/types";
import { getContributorCommitList } from "../_helpers/utils";

interface GitHubCommitProps {
  contributor: GitHubUser;
  displayLast?: number;
}

const MAX_MESSAGE_SIZE = 30;

export default async function GitHubCommitDisplay({
  contributor,
  displayLast = 5,
}: GitHubCommitProps) {
  const commitList = await getContributorCommitList(contributor, displayLast);
  return (
    <>
      <p className="font-bold texxt-center p-2">Last {displayLast} commits</p>
      <ol className="flex-col justify-start items-stretch gap-2 w-full">
        {commitList.length > 0 &&
          commitList.map((c, index) => (
            <a key={index} href={c.html_url}>
              <li className="hover:bg-secondary rounded-lg p-2 cursor-pointer">
                <p className="text-md">
                  {c.commit.message.slice(0, MAX_MESSAGE_SIZE)}...
                </p>
              </li>
            </a>
          ))}
        {commitList.length < 1 && (
          <p className="font-bold texxt-center p-2">No Commits History</p>
        )}
      </ol>
    </>
  );
}
