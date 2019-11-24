const axios = require("axios");
const chalk = require("chalk");

module.exports = async function getContributors({
  githubApiToken,
  owner,
  repo,
  verbose
}) {
  const API_URI = `https://api.github.com/repos/${owner}/${repo}/contributors`;

  let contributors = [];
  for (let i = 1; ; i++) {
    const CURRENT_API_URI = `${API_URI}?page=${i}&per_page=100`;

    if (verbose)
      console.log(chalk.cyan(`Fetching ${CURRENT_API_URI} ... (${i})`));

    try {
      const { data } = await axios.get(CURRENT_API_URI, {
        headers: {
          Authorization: `token ${githubApiToken}`
        }
      });

      // reduce contributors
      contributors = [...contributors, ...data];

      // break when empty results
      if (data.length === 0) break;
    } catch (e) {
      console.error(e);
      const { response } = e;

      console.error(`${response.status} ${response.statusText}`);
      process.exit(0);
    }
  }
  return contributors;
};
