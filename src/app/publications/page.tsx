import publications from "@/data/publications.json";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { GithubCard } from "@/components/GithubCard";
import { FeaturedPublication } from "@/components/FeaturedPublication";

export default function PublicationsPage() {
    // Sort by year (descending), then citation count (descending)
    const sortedPubs = [...publications].sort((a, b) => {
        const yearDiff = (b.year || 0) - (a.year || 0);
        if (yearDiff !== 0) return yearDiff;
        return (b.citationCount || 0) - (a.citationCount || 0);
    });

    return (
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Publications
            </h1>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Main Content: Publication List */}
                <div className="md:col-span-2 space-y-6">
                    {/* Featured Publications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FeaturedPublication type="recommended" />
                        <FeaturedPublication type="most-cited" />
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Publications</h2>
                    <div className="space-y-4">
                        {sortedPubs.map((pub) => (
                            <Link
                                key={pub.paperId}
                                href={pub.url}
                                target="_blank"
                                className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-zinc-900/50 dark:hover:border-blue-900/50"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                            {pub.title}
                                        </h3>
                                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-medium text-gray-900 dark:text-gray-200">{pub.year}</span>
                                            {pub.venue && (
                                                <>
                                                    <span className="hidden h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600 sm:block" />
                                                    <span>{pub.venue}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex shrink-0 items-center gap-3">
                                        {pub.citationCount > 0 && (
                                            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                                                {pub.citationCount} citations
                                            </span>
                                        )}
                                        <ArrowUpRight className="h-5 w-5 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Sidebar: Stats & GitHub */}
                <div className="md:col-span-1">
                    <div className="sticky top-24 space-y-4">
                        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-zinc-900/50">
                            <StatsCard />
                        </div>
                        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-zinc-900/50">
                            <GithubCard />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
