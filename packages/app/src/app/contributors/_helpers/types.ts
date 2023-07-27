interface ContributorCodeChanges {
  login: string; // github username
  additions: number;
  deletions: number;
}

interface GitHubCommit {
  commit: {
    message: string;
  };
  html_url: string;
  author: GitHubUser;
}

// GitHub API Response schemas ------------------------------------------

interface GitHubContributor {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  contributions: number;
}

type GitHubUser = Omit<GitHubContributor, "contributions">;

// GitHub API will response with data structure like this
// [
//     [<unix_timestamp>, <additions>, <deletions>],
//     [<unix_timestamp>, <additions>, <deletions>],
//     [<unix_timestamp>, <additions>, <deletions>],
//     ...
// ]
type GitHubRepoCommitCodeChanges = number[];

interface GitHubContributorCommitActivity {
  author: GitHubUser;
  total: number;
  weeks: {
    w: number;
    a: number;
    d: number;
    c: number;
  }[];
}

// GitHub API Response schemas ------------------------------------------

export {
  type GitHubContributorCommitActivity,
  type GitHubRepoCommitCodeChanges,
  type GitHubUser,
  type GitHubContributor,
  type GitHubCommit,
  type ContributorCodeChanges,
};
