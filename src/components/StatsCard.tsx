import { FileText, Quote, ExternalLink } from "lucide-react";
import stats from "@/data/stats.json";
import publications from "@/data/publications.json";
import Link from "next/link";

export const StatsCard = () => {
    const gs = stats.googleScholar;
    const totalPublications = publications.length;

    return (
        <div className="flex flex-col h-full justify-center gap-3 p-2">
            {/* Title */}
            <div className="text-center">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Impact</h3>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2">
                {/* Publications */}
                <div className="flex flex-col items-center justify-center p-2.5 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                    <FileText className="w-4 h-4 text-blue-500 mb-1" />
                    <span className="text-xl font-bold dark:text-white">{totalPublications}</span>
                    <span className="text-[9px] text-neutral-500 uppercase tracking-wide">Papers</span>
                </div>
                
                {/* Citations - Highlighted */}
                <div className="flex flex-col items-center justify-center p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 rounded-lg border border-blue-100 dark:border-blue-900/50">
                    <Quote className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1" />
                    <span className="text-xl font-bold text-blue-700 dark:text-blue-300">{gs.citations}</span>
                    <span className="text-[9px] text-blue-600 dark:text-blue-400 uppercase tracking-wide font-medium">Citations</span>
                </div>
            </div>

            {/* h-index */}
            <div className="flex items-center justify-center gap-4 px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <div className="text-center">
                    <span className="text-lg font-bold dark:text-white">{gs.hIndex}</span>
                    <span className="text-[9px] text-neutral-500 ml-1">h-index</span>
                </div>
                <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700" />
                <div className="text-center">
                    <span className="text-lg font-bold dark:text-white">{gs.i10Index}</span>
                    <span className="text-[9px] text-neutral-500 ml-1">i10-index</span>
                </div>
            </div>

            {/* Google Scholar Link */}
            <Link
                href={gs.profileUrl}
                target="_blank"
                className="flex items-center justify-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
                <span>View Google Scholar</span>
                <ExternalLink className="w-3 h-3" />
            </Link>
        </div>
    );
};
