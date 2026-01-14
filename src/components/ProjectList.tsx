import githubRepos from "@/data/github.json";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";

export const ProjectList = () => {
    return (
        <div className="flex flex-col h-full">
            {/* Compact Repo List */}
            <div className="flex flex-col gap-2 flex-grow">
                {githubRepos.map((repo) => (
                    <Link
                        key={repo.name}
                        href={repo.url}
                        target="_blank"
                        className="group flex items-center gap-3 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                        {/* Language indicator */}
                        <span 
                            className="w-2 h-2 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: repo.languageColor || '#6b7280' }}
                        />
                        
                        {/* Repo name */}
                        <span className="font-medium text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                            {repo.name}
                        </span>

                        {/* Stars */}
                        <span className="ml-auto text-xs text-neutral-500 flex items-center gap-1 flex-shrink-0">
                            ★ {repo.stars}
                        </span>

                        <ArrowUpRight className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition flex-shrink-0" />
                    </Link>
                ))}
            </div>

            {/* View All Link */}
            <Link
                href="https://github.com/JValdivia23?tab=repositories"
                target="_blank"
                className="flex items-center justify-center gap-2 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 transition mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800"
            >
                <Github className="w-3 h-3" />
                View all repositories →
            </Link>
        </div>
    );
};
