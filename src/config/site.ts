export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "CodeRacer",
  description: "Accelerating coding skills, competitive thrills!",
  mainNav: [
    {
      title: "Race",
      href: "/race",
    },
    {
      title: "Leaderboard",
      href: "/leaderboard",
    },
    // ...
  ],
  links: {
    github: "https://github.com/webdevcody/code-racer",
  },
}
