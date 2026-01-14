const fs = require('fs');
const path = require('path');

// Jairo M. Valdivia has publications split across multiple Semantic Scholar profiles
const AUTHOR_IDS = ['1411484198', '1380048475'];

async function fetchPublications() {
    console.log('Fetching publications from Semantic Scholar...');
    
    const allPapers = [];
    const seenTitles = new Set();
    
    for (const authorId of AUTHOR_IDS) {
        const API_URL = `https://api.semanticscholar.org/graph/v1/author/${authorId}/papers?fields=title,year,venue,citationCount,url,externalIds&limit=100`;
        
        try {
            console.log(`Fetching from author ID: ${authorId}`);
            const response = await fetch(API_URL);
            if (!response.ok) {
                console.warn(`Warning: Failed to fetch author ${authorId}: ${response.status}`);
                continue;
            }
            const data = await response.json();
            
            for (const paper of data.data) {
                // Deduplicate by normalized title
                const normalizedTitle = paper.title.toLowerCase().replace(/[^a-z0-9]/g, '');
                if (!seenTitles.has(normalizedTitle)) {
                    seenTitles.add(normalizedTitle);
                    
                    // Build URL from DOI if available, otherwise use Semantic Scholar URL
                    let url = paper.url;
                    if (paper.externalIds && paper.externalIds.DOI) {
                        url = `https://doi.org/${paper.externalIds.DOI}`;
                    }
                    
                    allPapers.push({
                        paperId: paper.paperId,
                        url: url,
                        title: paper.title,
                        venue: paper.venue || '',
                        year: paper.year,
                        citationCount: paper.citationCount || 0
                    });
                }
            }
        } catch (error) {
            console.error(`Error fetching author ${authorId}:`, error);
        }
    }
    
    // Sort by year descending
    allPapers.sort((a, b) => (b.year || 0) - (a.year || 0));

    const outputPath = path.join(__dirname, '../src/data/publications.json');
    fs.writeFileSync(outputPath, JSON.stringify(allPapers, null, 2));
    console.log(`Successfully saved ${allPapers.length} publications to ${outputPath}`);
}

fetchPublications();
