export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "CodeRacer",
  description: "Accelerating coding skills, competitive thrills!",
  getHeaderLinks: (isLoggedIn: boolean) => {
    const items = [
      {
        title: "Race",
        href: "/race",
      },
      {
        title: "Leaderboard",
        href: "/leaderboard",
      },
    ];

    if (isLoggedIn) {
      items.push({
        title: "Add Snippet",
        href: "/add-snippet",
      });
    }

    items.push({
      title: "Contributors",
      href: "/contributors",
    });

    return items;
  },

  links: {
    github: "https://github.com/webdevcody/code-racer",
    codyTwitter: "https://twitter.com/webdevcody",
    codyDiscord: "https://discord.gg/sduWx3kp",
  },
  api: {
    github: {
      accessToken: process.env.GITHUB_ACCESS_TOKEN,
      githubContributors:
        "https://api.github.com/repos/webdevcody/code-racer/contributors",
      githubStars: "https://api.github.com/repos/webdevcody/code-racer",
      githubWeeklyActivity:
        "https://api.github.com/repos/webdevcody/code-racer/stats/code_frequency",
      githubContributorActivity:
        "https://api.github.com/repos/webdevcody/code-racer/stats/contributors",
      githubListCommit:
        "https://api.github.com/repos/webdevcody/code-racer/commits",
      cacheRevalidationInterval: 60 * 60, // Changed again :)
    },
  },

  multiplayer: {
    maxParticipantsPerRace: 4,
  },
};

export function getGitHubAuthorizationToken() {
  return siteConfig.api.github.accessToken
    ? `Bearer ${siteConfig.api.github.accessToken}`
    : "";
}
