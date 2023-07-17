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
  },
  api: {
    github: {
      accessToken: process.env.GITHUB_ACCESS_TOKEN,
      githubContributors: "https://api.github.com/repos/webdevcody/code-racer/contributors",
      githubStars: "https://api.github.com/repos/webdevcody/code-racer",
    }
  },
};
