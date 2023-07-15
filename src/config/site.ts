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

    return items;
  },

  links: {
    github: "https://github.com/webdevcody/code-racer",
  },
};
