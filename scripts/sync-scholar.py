#!/usr/bin/env python3
"""
Sync publications and stats from Google Scholar.
Uses free proxies. Falls back gracefully if blocked (exit code 1).
"""

import json
import sys
from pathlib import Path
from datetime import datetime

try:
    from scholarly import scholarly, ProxyGenerator
except ImportError:
    print("Error: scholarly not installed. Run: pip install scholarly")
    sys.exit(1)

# Configuration
SCHOLAR_ID = "eCZJkKcAAAAJ"
SCHOLAR_PROFILE_URL = f"https://scholar.google.com/citations?user={SCHOLAR_ID}"

# Paths
SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent / "src" / "data"
PUBLICATIONS_FILE = DATA_DIR / "publications.json"
STATS_FILE = DATA_DIR / "stats.json"
HIGHLIGHTS_FILE = DATA_DIR / "highlights.json"


def setup_free_proxy():
    """Try to set up a free proxy. Returns True if successful."""
    pg = ProxyGenerator()
    try:
        print("Setting up free proxy...")
        success = pg.FreeProxies()
        if success:
            scholarly.use_proxy(pg)
            print("Free proxy configured successfully")
            return True
    except Exception as e:
        print(f"Warning: Free proxy setup failed: {e}")
    
    print("Continuing without proxy (may get blocked)...")
    return False


def load_highlights():
    """Load user-defined highlights configuration."""
    if HIGHLIGHTS_FILE.exists():
        with open(HIGHLIGHTS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def normalize_title(title):
    """Normalize title for comparison."""
    return title.lower().strip()


def fetch_author_data():
    """Fetch author profile from Google Scholar."""
    print(f"Fetching author: {SCHOLAR_ID}")
    
    try:
        author = scholarly.search_author_id(SCHOLAR_ID)
        author = scholarly.fill(author, sections=["basics", "indices", "publications"])
        return author
    except Exception as e:
        print(f"Error fetching author data: {e}")
        return None


def process_publications(author, highlights):
    """Process publications and apply highlights."""
    publications = []
    
    # Get the recommended paper title (normalized)
    recommended_title = ""
    if highlights.get("recommended", {}).get("title"):
        recommended_title = normalize_title(highlights["recommended"]["title"])
    
    for pub in author.get("publications", []):
        bib = pub.get("bib", {})
        title = bib.get("title", "")
        if not title:
            continue
        
        # Try to get a proper URL (prefer pub_url, fallback to eprint)
        url = pub.get("pub_url", "") or pub.get("eprint_url", "")
        
        # Fallback: Construct Google Scholar URL if no direct link
        if not url:
            url = f"https://scholar.google.com/citations?view_op=view_citation&hl=en&user={SCHOLAR_ID}&citation_for_view={pub.get('author_pub_id')}"
        
        pub_data = {
            "paperId": pub.get("author_pub_id", ""),
            "url": url,
            "title": title,
            "venue": bib.get("venue", ""),
            "year": int(bib.get("pub_year", 0)) if bib.get("pub_year") else None,
            "citationCount": pub.get("num_citations", 0),
        }
        
        # Check if this is the highlighted paper
        if recommended_title and normalize_title(title) == recommended_title:
            pub_data["highlighted"] = True
            print(f"  -> Marked as highlighted: {title[:50]}...")
        
        publications.append(pub_data)
    
    # Sort by year desc, then citations desc
    publications.sort(key=lambda x: (-(x["year"] or 0), -(x["citationCount"] or 0)))
    
    return publications


def create_stats(author):
    """Create stats from author data."""
    return {
        "googleScholar": {
            "citations": author.get("citedby", 0),
            "citationsSince2021": author.get("citedby5y", 0),
            "hIndex": author.get("hindex", 0),
            "hIndex5y": author.get("hindex5y", 0),
            "i10Index": author.get("i10index", 0),
            "i10Index5y": author.get("i10index5y", 0),
            "profileUrl": SCHOLAR_PROFILE_URL,
            "lastUpdated": datetime.now().strftime("%Y-%m-%d"),
        }
    }


def main():
    print("=" * 60)
    print("Google Scholar Sync (Free Proxies)")
    print("=" * 60)
    
    # Try to set up proxy (optional, continue without if fails)
    setup_free_proxy()
    
    # Load highlights config
    highlights = load_highlights()
    if highlights.get("recommended"):
        print(f"Highlight config: {highlights['recommended'].get('title', 'N/A')[:50]}...")
    
    # Fetch author data
    author = fetch_author_data()
    
    if not author:
        print("FAILED: Could not fetch Google Scholar data")
        print("Falling back to Semantic Scholar...")
        sys.exit(1)  # Signal to workflow to use fallback
    
    print(f"Author: {author.get('name')}")
    print(f"Citations: {author.get('citedby', 0)}")
    print(f"h-index: {author.get('hindex', 0)}")
    print(f"Publications: {len(author.get('publications', []))}")
    
    # Process data
    publications = process_publications(author, highlights)
    stats = create_stats(author)
    
    # Write files
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    with open(PUBLICATIONS_FILE, "w", encoding="utf-8") as f:
        json.dump(publications, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(publications)} publications")
    
    with open(STATS_FILE, "w", encoding="utf-8") as f:
        json.dump(stats, f, indent=2)
    print(f"Wrote stats (citations: {stats['googleScholar']['citations']})")
    
    print("=" * 60)
    print("SUCCESS: Google Scholar sync complete")
    print("=" * 60)


if __name__ == "__main__":
    main()
