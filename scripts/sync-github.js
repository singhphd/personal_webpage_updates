const fs = require('fs');
const path = require('path');

const GITHUB_USERNAME = 'JValdivia23';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function fetchGitHubData() {
    console.log('Fetching pinned repositories from GitHub...');

    if (!GITHUB_TOKEN) {
        console.warn('GITHUB_TOKEN not found. Using public API (rate limits may apply).');
        // Note: Fetching pinned repos publicly via API is tricky without scraping or V4 API. 
        // We will use the GraphQL API which requires a token.
        // If no token, we might exit or use a fallback.
        // For now, let's error if no token is present, as it's required for GraphQL.
        console.error('Error: GITHUB_TOKEN is required for GraphQL API.');
        process.exit(1);
    }

    const query = `
    query {
      user(login: "${GITHUB_USERNAME}") {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              stargazerCount
              languages(first: 1, orderBy: {field: SIZE, direction: DESC}) {
                nodes {
                  name
                  color
                }
              }
            }
          }
        }
      }
    }
  `;

    try {
        constresponse = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();

        if (data.errors) {
            throw new Error(JSON.stringify(data.errors));
        }

        const pinnedRepos = data.data.user.pinnedItems.nodes.map(repo => ({
            name: repo.name,
            description: repo.description,
            url: repo.url,
            stars: repo.stargazerCount,
            language: repo.languages.nodes[0] ? repo.languages.nodes[0].name : 'Unknown',
            languageColor: repo.languages.nodes[0] ? repo.languages.nodes[0].color : '#ccc'
        }));

        const outputPath = path.join(__dirname, '../src/data/github.json');
        fs.writeFileSync(outputPath, JSON.stringify(pinnedRepos, null, 2));
        console.log(`Successfully saved ${pinnedRepos.length} pinned repositories to ${outputPath}`);

    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        process.exit(1);
    }
}

fetchGitHubData();
