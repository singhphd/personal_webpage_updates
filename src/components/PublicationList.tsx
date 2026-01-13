import publications from "@/data/publications.json";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const PublicationList = () => {
    // Show top 5 recent publications
    const recentPubs = publications.slice(0, 5);

    return (
        <div className="flex flex-col space-y-4">
            {recentPubs.map((pub) => (
                <Link
                    key={pub.paperId}
                    href={pub.url}
                    target="_blank"
                    className="group block"
                >
                    <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-neutral-800 dark:text-neutral-200 group-hover:underline decoration-neutral-400 underline-offset-4">
                            {pub.title}
                        </h4>
                        <ArrowUpRight className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition flex-shrink-0 ml-2" />
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                        <span>{pub.year}</span>
                        {pub.venue && <span> • {pub.venue}</span>}
                        {pub.citationCount > 0 && <span className="ml-2 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-[10px] text-neutral-600 dark:text-neutral-400">{pub.citationCount} citations</span>}
                    </div>
                </Link>
            ))}
            <Link
                href={`https://www.semanticscholar.org/author/1741000`}
                target="_blank"
                className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 transition block mt-2"
            >
                View all {publications.length} publications on Semantic Scholar →
            </Link>
        </div>
    );
};
