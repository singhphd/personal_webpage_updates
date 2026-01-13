import { FileText, Star, GitFork } from "lucide-react";
import publications from "@/data/publications.json";
import githubRepos from "@/data/github.json";

export const StatsCard = () => {
    // Calculate stats
    const totalCitations = publications.reduce((acc, pub) => acc + (pub.citationCount || 0), 0);
    const totalPublications = publications.length;

    // Manual calculation for stars since we only have pinned repos in the json
    // Ideally we would fetch total stars in the script, but sum of pinned is a good proxy for "featured stars"
    const pinnedStars = githubRepos.reduce((acc, repo) => acc + (repo.stars || 0), 0);

    return (
        <div className="grid grid-cols-2 gap-4 h-full content-center">
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <FileText className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-2xl font-bold dark:text-white">{totalPublications}</span>
                <span className="text-xs text-neutral-500">Publications</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <GitFork className="w-6 h-6 text-green-500 mb-2" />
                <span className="text-2xl font-bold dark:text-white">{totalCitations}</span>
                <span className="text-xs text-neutral-500">Citations</span>
            </div>
            <div className="col-span-2 flex flex-col items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <Star className="w-6 h-6 text-yellow-500 mb-2" />
                <span className="text-2xl font-bold dark:text-white">{pinnedStars}+</span>
                <span className="text-xs text-neutral-500">Stars on Pinned Repos</span>
            </div>
        </div>
    );
};
