#!/usr/bin/env node

const argv = require("yargs")
  .usage(
    "Get all repositories informations from specific organization.\n\nUsage: get-repo-infos-from-org [options]"
  )
  .help("help")
  .alias("help", "h")
  .options({
    verbose: {
      boolean: true,
      description: "Run with verbose logs",
      required: false
    },
    org: {
      description: "Target repository owner orgs.",
      requiresArg: true,
      required: true
    }
  }).argv;

(async () => {
  const repos = await require("../getRepos")({
    githubApiToken: process.env.GITHUB_TOKEN,
    org: argv.org,
    verbose: argv.verbose
  });
  const REPOS_HEADERS = [
    "name",
    "html_url",
    "description",
    "language",
    "created_at",
    "pushed_at",
    "fork",
    "archived",
    "disabled",
    "contributors"
  ];
  for (const repo of repos) {
    repo.contributors = (
      await require("../getContributors")({
        githubApiToken: argv.githubApiToken,
        owner: argv.org,
        repo: repo.name,
        verbose: argv.verbose
      })
    )
      .sort((a, b) => b.contributions - a.contributions)
      .map(a => a.login);
  }
  console.log(
    [
      REPOS_HEADERS.join("\t"),
      ...repos.map(repo => REPOS_HEADERS.map(h => repo[h]).join("\t"))
    ].join("\n")
  );
})();
