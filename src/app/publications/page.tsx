'use client';

import { useState } from 'react';
import publications from "@/data/publications.json";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Calendar, Award } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { GithubCard } from "@/components/GithubCard";
import { FeaturedPublication } from "@/components/FeaturedPublication";

import stats from "@/data/stats.json";

export default function PublicationsPage() {
    const [sortBy, setSortBy] = useState<'year' | 'citations'>('year');
    const [visibleCount, setVisibleCount] = useState(10);
    
    // Format last updated date
    const lastUpdated = new Date(stats.googleScholar.lastUpdated).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });


    // Sort publications based on selection
    const sortedPubs = [...publications].sort((a, b) => {
        if (sortBy === 'year') {
            const yearDiff = (b.year || 0) - (a.year || 0);
            if (yearDiff !== 0) return yearDiff;
            return (b.citationCount || 0) - (a.citationCount || 0);
        } else {
            const citeDiff = (b.citationCount || 0) - (a.citationCount || 0);
            if (citeDiff !== 0) return citeDiff;
            return (b.year || 0) - (a.year || 0);
        }
    });

    const visiblePubs = sortedPubs.slice(0, visibleCount);
    const hasMore = visibleCount < sortedPubs.length;

    return (
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    Publications
                </h1>
                
                {/* Sort Toggle */}
                <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-zinc-800 rounded-lg w-fit self-start md:self-auto">
                    <button
                        onClick={() => {
                            setSortBy('year');
                            setVisibleCount(10); // Reset count when sorting
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                            sortBy === 'year'
                                ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                    >
                        <Calendar className="w-4 h-4" />
                        Newest
                    </button>
                    <button
                        onClick={() => {
                            setSortBy('citations');
                            setVisibleCount(10); // Reset count when sorting
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                            sortBy === 'citations'
                                ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                    >
                        <Award className="w-4 h-4" />
                        Cited
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Main Content: Publication List */}
                <div className="md:col-span-2 space-y-6">
                    {/* Featured Publications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FeaturedPublication type="recommended" />
                        <FeaturedPublication type="most-cited" />
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {sortBy === 'year' ? 'All Publications' : 'Most Impactful'}
                        </h2>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {visiblePubs.length} of {sortedPubs.length}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {visiblePubs.map((pub) => (
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

                    {/* See More Button */}
                    {hasMore && (
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => setVisibleCount(prev => prev + 10)}
                                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 group"
                            >
                                <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                                See more publications
                            </button>
                        </div>
                    )}

                    {/* Disclaimer */}
                    <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                            Data automatically generated from Google Scholar. Duplicates may occur. 
                            Last updated: {lastUpdated}
                        </p>
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
