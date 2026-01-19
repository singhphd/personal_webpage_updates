import { Github, Star, ExternalLink, GitFork } from "lucide-react";
import Link from "next/link";
import githubRepos from "@/data/github.json";

// Type for repository data
interface GithubRepo {
    name: string;
    description: string;
    url: string;
    stars: number;
    language: string;
    languageColor: string;
}

export const GithubCard = () => {
    const repos = githubRepos as GithubRepo[];
    const hasRepos = repos.length > 0;

    return (
        <div className="flex flex-col h-full justify-center gap-4">
            {/* Title */}
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Open Source</h3>
                </div>
                <Link 
                    href="https://github.com/JValdivia23" 
                    target="_blank"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                    View All
                </Link>
            </div>

            {/* Empty State */}
            {!hasRepos && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Github className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mb-2" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                        Repositories loading...
                    </p>
                    <Link
                        href="https://github.com/JValdivia23"
                        target="_blank"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        <span>View GitHub Profile</span>
                        <ExternalLink className="w-3 h-3" />
                    </Link>
                </div>
            )}

            {/* Repos List */}
            {hasRepos && (
                <div className="flex flex-col gap-3">
                    {repos.map((repo) => (
                        <Link
                            key={repo.name}
                            href={repo.url}
                            target="_blank"
                            className="group flex flex-col gap-1 rounded-lg border border-transparent p-2 hover:bg-neutral-50 hover:border-neutral-200 dark:hover:bg-neutral-800 dark:hover:border-neutral-700 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                                    {repo.name}
                                </span>
                                {repo.stars > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-full">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span>{repo.stars}</span>
                                    </div>
                                )}
                            </div>
                            
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                                {repo.description}
                            </p>

                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                    <span 
                                        className="w-2 h-2 rounded-full" 
                                        style={{ backgroundColor: repo.languageColor || '#ccc' }}
                                    />
                                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                                        {repo.language}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};
