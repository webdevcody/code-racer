import Contributor from "./contributor"
import { GitHubContributor, contributors } from "../_helpers/types"
interface contributerListProps {
  contributors: contributors;
  sliceStartIndex: number;
  sliceEndIndex: number;
  contributorCommitActivities: any; 
}
const Contributors = ({contributors,sliceStartIndex,sliceEndIndex,contributorCommitActivities}:contributerListProps) => {   
  return (
    <div>
         <ul className="grid gap-4 mt-8 list-none md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {contributors
          .slice(sliceStartIndex, sliceEndIndex)
          .map((contributor: GitHubContributor) => (
            <Contributor
              key={contributor.id}
              contributor={contributor}
              contributorsCodeChanges={
                contributorCommitActivities.find(
                  (e: { login: string }) => e.login === contributor.login,
                ) ?? { additions: 0, deletions: 0, login: contributor.login }
              }
            />
          ))}
      </ul>
    </div>
  )
}

export default Contributors