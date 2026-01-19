const fs = require('fs');
const path = require('path');
require('dotenv').config();

const GITHUB_USERNAME = 'JValdivia23';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_PAT;
const GITHUB_FILE = path.join(__dirname, '../src/data/github.json');

// Load existing GitHub data to preserve on failure
function loadExistingData() {
    try {
        if (fs.existsSync(GITHUB_FILE)) {
            const content = fs.readFileSync(GITHUB_FILE, 'utf-8');
            const data = JSON.parse(content);
            if (Array.isArray(data) && data.length > 0) {
                return data;
            }
        }
    } catch (error) {
        console.warn('Warning: Could not load existing GitHub data:', error.message);
    }
    return null;
}

async function fetchGitHubData() {
    console.log('Fetching pinned repositories from GitHub...');
    
    // Load existing data first (for fallback)
    const existingData = loadExistingData();
    if (existingData) {
        console.log(`Loaded ${existingData.length} existing repositories as fallback.`);
    }

    if (!GITHUB_TOKEN) {
        console.warn('GITHUB_TOKEN not found. GraphQL API requires authentication.');
        console.warn('Set GITHUB_TOKEN or GH_PAT environment variable.');
        
        if (existingData) {
            console.log('Keeping existing GitHub data to prevent data loss.');
            return; // Exit without overwriting
        }
        
        console.error('Error: No existing data and no token available.');
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
        repositories(first: 6, privacy: PUBLIC, orderBy: {field: STARGAZERS, direction: DESC}) {
          nodes {
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
  `;

    try {
        const response = await fetch('https://api.github.com/graphql', {
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

        // Try pinned items first, fallback to top repositories
        let nodes = data.data.user.pinnedItems.nodes;
        if (nodes.length === 0) {
            nodes = data.data.user.repositories.nodes;
        }

        const pinnedRepos = nodes.map(repo => ({
            name: repo.name,
            description: repo.description,
            url: repo.url,
            stars: repo.stargazerCount,
            language: repo.languages.nodes[0] ? repo.languages.nodes[0].name : 'Unknown',
            languageColor: repo.languages.nodes[0] ? repo.languages.nodes[0].color : '#ccc'
        }));

        // SAFETY CHECK: Don't overwrite with empty data
        if (pinnedRepos.length === 0 && existingData) {
            console.warn('WARNING: API returned 0 repos but we have existing data.');
            console.warn('Keeping existing GitHub data to prevent data loss.');
            return;
        }

        fs.writeFileSync(GITHUB_FILE, JSON.stringify(pinnedRepos, null, 2));
        console.log(`Successfully saved ${pinnedRepos.length} pinned repositories.`);

    } catch (error) {
        console.error('Error fetching GitHub data:', error.message);
        
        if (existingData) {
            console.log('Keeping existing GitHub data due to fetch error.');
            return; // Don't exit with error code, just preserve existing
        }
        
        process.exit(1);
    }
}

fetchGitHubData();
