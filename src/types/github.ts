interface User {
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
}

interface Person {
  name: string;
  email: string;
  date: string;
}

interface Tree {
  sha: string;
  url: string;
}

interface Verification {
  verified: boolean;
  reason: string;
  signature: null | string;
  payload: null | string;
}

interface Commit {
  author: Person;
  committer: Person;
  message: string;
  tree: Tree;
  url: string;
  comment_count: number;
  verification: Verification;
}

interface Parent {
  sha: string;
  url: string;
  html_url: string;
}

export interface CommitInterface {
  sha: string;
  node_id: string;
  commit: Commit;
  url: string;
  html_url: string;
  comments_url: string;
  author: User;
  committer: User;
  parents: Parent[];
}
