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
    <span data-cy="github-commit-display">
      <p className="p-2 font-bold texxt-center">Last {displayLast} commits</p>
      <ol className="flex-col items-stretch justify-start w-full gap-2">
        {commitList.length > 0 &&
          commitList.map((c, index) => (
            <a
              key={index}
              href={c.html_url}
              target="_blank"
              data-cy="github-commit-link"
            >
              <li className="p-2 rounded-lg cursor-pointer hover:bg-secondary">
                <p className="text-md">
                  {c.commit.message.slice(0, MAX_MESSAGE_SIZE)}...
                </p>
              </li>
            </a>
          ))}
        {commitList.length < 1 && (
          <p className="p-2 font-bold texxt-center">No Commits History</p>
        )}
      </ol>
    </span>
  );
}
