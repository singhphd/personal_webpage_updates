import publications from "@/data/publications.json";
import highlights from "@/data/highlights.json";
import stats from "@/data/stats.json";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const PublicationList = () => {
    // Find the most-cited publication
    const mostCited = publications.reduce((max, pub) => 
        (pub.citationCount > max.citationCount) ? pub : max
    , publications[0]);

    // Find the recommended publication from highlights config
    const recommendedTitle = highlights.recommended?.title?.toLowerCase().trim() || "";
    const recommended = publications.find(
        pub => pub.title.toLowerCase().trim() === recommendedTitle
    );

    // Get IDs to exclude (both featured papers)
    const excludeIds = new Set([mostCited.paperId]);
    if (recommended && recommended.paperId !== mostCited.paperId) {
        excludeIds.add(recommended.paperId);
    }

    // Get remaining publications, excluding featured ones
    const remainingPubs = publications
        .filter(pub => !excludeIds.has(pub.paperId))
        .sort((a, b) => {
            if (b.year !== a.year) return (b.year || 0) - (a.year || 0);
            return (b.citationCount || 0) - (a.citationCount || 0);
        })
        .slice(0, 6);

    return (
        <div className="flex flex-col h-full">
            {/* Publications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-grow">
                {remainingPubs.map((pub) => (
                    <Link
                        key={pub.paperId}
                        href={pub.url}
                        target="_blank"
                        className="group block p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/50 transition-all duration-200"
                    >
                        <div className="flex justify-between items-start gap-2">
                            <h4 className="text-sm font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                                {pub.title}
                            </h4>
                            <ArrowUpRight className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition flex-shrink-0 mt-0.5" />
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500">
                            <span className="font-medium">{pub.year}</span>
                            {pub.venue && (
                                <span className="truncate max-w-[120px]" title={pub.venue}>
                                    {pub.venue}
                                </span>
                            )}
                            {pub.citationCount > 0 && (
                                <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                    pub.citationCount >= 10 
                                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' 
                                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                                }`}>
                                    {pub.citationCount} cited
                                </span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {/* View All Link */}
            <Link
                href={stats.googleScholar.profileUrl}
                target="_blank"
                className="text-xs text-center text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 transition mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800"
            >
                View all {publications.length} publications →
            </Link>
        </div>
    );
};
