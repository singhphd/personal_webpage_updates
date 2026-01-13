const fs = require('fs');
const path = require('path');

const AUTHOR_ID = '1741000';
const API_URL = `https://api.semanticscholar.org/graph/v1/author/${AUTHOR_ID}/papers?fields=title,year,venue,citationCount,url,authors&limit=100`;

async function fetchPublications() {
    console.log('Fetching publications from Semantic Scholar...');
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        // Sort by year descending
        const papers = data.data.sort((a, b) => (b.year || 0) - (a.year || 0));

        const outputPath = path.join(__dirname, '../src/data/publications.json');
        fs.writeFileSync(outputPath, JSON.stringify(papers, null, 2));
        console.log(`Successfully saved ${papers.length} publications to ${outputPath}`);
    } catch (error) {
        console.error('Error fetching publications:', error);
        process.exit(1);
    }
}

fetchPublications();
