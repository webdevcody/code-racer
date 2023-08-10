/* eslint-disable */
/// <reference path="prettier-plugin.d.ts" />
/* eslint-enable */

// import { type Options as PrettierOptions } from "prettier";
import { type Language } from "./languages";
export type SiteConfig = typeof siteConfig;

// import * as prettierPluginJava from "prettier-plugin-java";
// import * as prettierPluginGo from "prettier-plugin-go-template";
// import * as prettierPluginRuby from "@prettier/plugin-ruby";

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

  snippet: {
    prettier: {
      options: {
        // tabWidth: 2,
        printWidth: 60,
        useTabs: false,
        semi: true,
        singleQuote: true,
        quoteProps: "consistent",
        jsxSingleQuote: false,
        trailingComma: "es5",
        bracketSpacing: true,
        bracketSameLine: false,
        arrowParens: "avoid",
        insertPragma: false,
        htmlWhitespaceSensitivity: "css",
        vueIndentScriptAndStyle: false,
        endOfLine: "lf",
        singleAttributePerLine: false,
        plugins: [
          "prettier-plugin-java",
          // "prettier-plugin-go-template",
          "@prettier/plugin-ruby",
        ],
      },
      parserMap: new Map<Language, string>([
        // ["go", "go-template"],
        ["java", "java"],
        ["html", "html"],
        ["javascript", "babel"],
        ["typescript", "babel-ts"],
        ["ruby", "ruby"],
      ]),
    },
  },
};

export function getGitHubAuthorizationToken() {
  return siteConfig.api.github.accessToken
    ? `Bearer ${siteConfig.api.github.accessToken}`
    : "";
}
