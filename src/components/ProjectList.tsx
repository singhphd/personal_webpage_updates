import githubRepos from "@/data/github.json";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const ProjectList = () => {
    return (
        <div className="flex flex-col space-y-4">
            {githubRepos.map((repo) => (
                <Link
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    className="group block p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
                >
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                            {repo.name}
                        </h3>
                        <ArrowUpRight className="w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">
                        {repo.description}
                    </p>
                    <div className="flex items-center mt-3 space-x-4 text-xs text-neutral-500">
                        <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: repo.languageColor || '#ccc' }}></span>
                            {repo.language}
                        </div>
                        <div className="flex items-center">
                            ★ {repo.stars}
                        </div>
                    </div>
                </Link>
            ))}
            <Link
                href="https://github.com/JValdivia23?tab=repositories"
                target="_blank"
                className="text-xs text-center text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 transition block mt-2"
            >
                View all repositories →
            </Link>
        </div>
    );
};
