const fs = require('fs');
const path = require('path');

// Jairo M. Valdivia has publications split across multiple Semantic Scholar profiles
const AUTHOR_IDS = ['1411484198', '1380048475'];
const MIN_EXPECTED_PUBLICATIONS = 10; // Safety threshold

const PUBLICATIONS_FILE = path.join(__dirname, '../src/data/publications.json');

// Load existing publications to preserve data
function loadExistingPublications() {
    try {
        if (fs.existsSync(PUBLICATIONS_FILE)) {
            const content = fs.readFileSync(PUBLICATIONS_FILE, 'utf-8');
            return JSON.parse(content);
        }
    } catch (error) {
        console.warn('Warning: Could not load existing publications:', error.message);
    }
    return [];
}

// Normalize title for deduplication
function normalizeTitle(title) {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function fetchPublications() {
    console.log('Fetching publications from Semantic Scholar...');
    console.log('This is a FALLBACK sync - will merge with existing data.');
    
    // Load existing publications first
    const existingPubs = loadExistingPublications();
    console.log(`Loaded ${existingPubs.length} existing publications.`);
    
    const fetchedPapers = [];
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
                const normalizedTitle = normalizeTitle(paper.title);
                if (!seenTitles.has(normalizedTitle)) {
                    seenTitles.add(normalizedTitle);
                    
                    // Build URL from DOI if available, otherwise use Semantic Scholar URL
                    let url = paper.url;
                    if (paper.externalIds && paper.externalIds.DOI) {
                        url = `https://doi.org/${paper.externalIds.DOI}`;
                    }
                    
                    fetchedPapers.push({
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
    
    console.log(`Fetched ${fetchedPapers.length} papers from Semantic Scholar.`);
    
    // SAFETY CHECK: If we fetched significantly fewer papers than existing, preserve existing
    if (fetchedPapers.length < MIN_EXPECTED_PUBLICATIONS && existingPubs.length >= MIN_EXPECTED_PUBLICATIONS) {
        console.warn(`WARNING: Fetched only ${fetchedPapers.length} papers but have ${existingPubs.length} existing.`);
        console.warn('Keeping existing publications to prevent data loss.');
        console.log('Semantic Scholar sync skipped - existing data preserved.');
        return;
    }
    
    // Merge: Start with existing publications, update/add from fetched
    const mergedPubs = new Map();
    
    // Add existing publications (preserve manually added ones)
    for (const pub of existingPubs) {
        const key = normalizeTitle(pub.title);
        mergedPubs.set(key, pub);
    }
    
    // Update with fetched publications (newer citation counts, etc.)
    for (const pub of fetchedPapers) {
        const key = normalizeTitle(pub.title);
        const existing = mergedPubs.get(key);
        
        if (existing) {
            // Update citation count if fetched has more recent data
            if (pub.citationCount > existing.citationCount) {
                existing.citationCount = pub.citationCount;
            }
            // Preserve highlighted flag and other manual fields
            mergedPubs.set(key, { ...pub, ...existing, citationCount: Math.max(pub.citationCount, existing.citationCount || 0) });
        } else {
            // New publication from API
            mergedPubs.set(key, pub);
        }
    }
    
    // Convert back to array and sort by year descending
    const allPapers = Array.from(mergedPubs.values());
    allPapers.sort((a, b) => (b.year || 0) - (a.year || 0));

    fs.writeFileSync(PUBLICATIONS_FILE, JSON.stringify(allPapers, null, 2));
    console.log(`Successfully saved ${allPapers.length} publications (merged from ${existingPubs.length} existing + ${fetchedPapers.length} fetched)`);
}

fetchPublications();
