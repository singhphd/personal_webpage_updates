import publications from "@/data/publications.json";
import highlights from "@/data/highlights.json";
import Link from "next/link";
import { ArrowUpRight, Award, Star } from "lucide-react";

// Type for publication data
interface Publication {
    paperId: string;
    url: string;
    title: string;
    venue: string;
    year: number | null;
    citationCount: number;
    highlighted?: boolean;
}

// Type for highlights config with optional fallback
interface HighlightsConfig {
    recommended?: {
        title?: string;
        paperId?: string;
        reason?: string;
        fallback?: Omit<Publication, 'highlighted'>;
    };
}

interface FeaturedPublicationProps {
    type: "most-cited" | "recommended";
}

// Helper: Normalize title for comparison
const normalizeTitle = (title: string): string => 
    title.toLowerCase().replace(/[^a-z0-9]/g, '');

// Helper: Check if title contains key words from another title
const fuzzyTitleMatch = (pubTitle: string, searchTitle: string): boolean => {
    const pubNorm = normalizeTitle(pubTitle);
    const searchNorm = normalizeTitle(searchTitle);
    
    // Exact match
    if (pubNorm === searchNorm) return true;
    
    // Check if one contains the other
    if (pubNorm.includes(searchNorm) || searchNorm.includes(pubNorm)) return true;
    
    // Extract key words (4+ chars) and check overlap
    const getKeyWords = (s: string) => s.split(/\s+/).filter(w => w.length >= 4);
    const pubWords = new Set(getKeyWords(normalizeTitle(pubTitle)));
    const searchWords = getKeyWords(normalizeTitle(searchTitle));
    
    // If 60%+ of search words are in publication title, consider it a match
    const matchCount = searchWords.filter(w => pubWords.has(w)).length;
    return searchWords.length > 0 && matchCount / searchWords.length >= 0.6;
};

// Helper: Find publication with multiple matching strategies
const findPublication = (
    pubs: Publication[], 
    config: HighlightsConfig['recommended']
): Publication | null => {
    if (!config) return null;
    
    // Strategy 1: Match by paperId (most reliable)
    if (config.paperId) {
        const byId = pubs.find(p => p.paperId === config.paperId);
        if (byId) return byId;
    }
    
    // Strategy 2: Match by exact title
    if (config.title) {
        const exactMatch = pubs.find(
            p => normalizeTitle(p.title) === normalizeTitle(config.title!)
        );
        if (exactMatch) return exactMatch;
        
        // Strategy 3: Fuzzy title match
        const fuzzyMatch = pubs.find(p => fuzzyTitleMatch(p.title, config.title!));
        if (fuzzyMatch) return fuzzyMatch;
    }
    
    // Strategy 4: Use fallback data if provided
    if (config.fallback) {
        return {
            ...config.fallback,
            title: config.title || config.fallback.title,
        } as Publication;
    }
    
    // Log warning in development
    if (process.env.NODE_ENV === 'development') {
        console.warn(
            `[FeaturedPublication] Could not find recommended publication: "${config.title}". ` +
            `Consider adding a 'fallback' object to highlights.json.`
        );
    }
    
    return null;
};

export const FeaturedPublication = ({ type }: FeaturedPublicationProps) => {
    const typedPublications = publications as Publication[];
    const typedHighlights = highlights as HighlightsConfig;
    
    // Find the most-cited publication
    const mostCited = typedPublications.reduce((max, pub) => 
        (pub.citationCount > max.citationCount) ? pub : max
    , typedPublications[0]);

    // Find the recommended publication using flexible matching
    const recommended = findPublication(typedPublications, typedHighlights.recommended);

    // Select the publication based on type
    const featured = type === "recommended" && recommended ? recommended : mostCited;
    
    // Don't render if no publication found or if recommended is same as most-cited
    if (!featured) return null;
    if (type === "recommended" && recommended?.paperId === mostCited.paperId) return null;
    if (type === "recommended" && !recommended) return null;

    const isMostCited = type === "most-cited";
    const badgeLabel = isMostCited ? "Most Cited" : "Recommended";
    const BadgeIcon = isMostCited ? Award : Star;

    // Different gradient for recommended vs most-cited
    const gradientClass = isMostCited 
        ? "from-blue-50 via-slate-50 to-indigo-50 dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/30 border-blue-100 dark:border-blue-900/50 hover:border-blue-200 dark:hover:border-blue-800"
        : "from-emerald-50 via-slate-50 to-teal-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/30 border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-200 dark:hover:border-emerald-800";

    const badgeClass = isMostCited
        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
        : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300";

    const decorativeClass = isMostCited
        ? "from-blue-100/50 dark:from-blue-800/20"
        : "from-emerald-100/50 dark:from-emerald-800/20";

    const borderClass = isMostCited
        ? "border-blue-100 dark:border-blue-900/50"
        : "border-emerald-100 dark:border-emerald-900/50";

    return (
        <Link
            href={featured.url}
            target="_blank"
            className="group block h-full"
        >
            <div className={`relative h-full p-6 rounded-xl bg-gradient-to-br ${gradientClass} border transition-all duration-300 overflow-hidden`}>
                {/* Subtle decorative element */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${decorativeClass} to-transparent rounded-bl-full`} />
                
                <div className="relative z-10 flex flex-col h-full">
                    {/* Badge */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${badgeClass} text-xs font-medium rounded-full`}>
                            <BadgeIcon className="w-3 h-3" />
                            {badgeLabel}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {featured.year}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors leading-snug mb-2 flex-grow">
                        {featured.title}
                        <ArrowUpRight className="inline-block w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>

                    {/* Venue and Citations */}
                    <div className={`flex items-center justify-between mt-auto pt-3 border-t ${borderClass}`}>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400 truncate max-w-[60%]">
                            {featured.venue}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-sm font-semibold rounded">
                            {featured.citationCount} citations
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};
