import { getAllReadingPosts } from "@/lib/markdown";
import { ExternalLink, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export const ReadingList = () => {
  const posts = getAllReadingPosts();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          Reading List
        </h2>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          News & Comments
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-zinc-900/50 transition-all hover:border-blue-200 dark:hover:border-blue-900/50"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <Calendar className="h-3 w-3" />
                  <time>{post.date}</time>
                </div>
                <div className="flex gap-2">
                    {post.tags.map((tag) => (
                    <span
                        key={tag}
                        className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                        {tag}
                    </span>
                    ))}
                </div>
              </div>
              
              <Link href={`/reading/${post.slug}`} className="group/title">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors">
                    {post.title}
                </h3>
              </Link>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-3">
                {post.summary}
            </p>

            <div className="flex items-center gap-4 pt-2">
                <Link 
                    href={`/reading/${post.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    Read Article <ArrowRight className="w-4 h-4" />
                </Link>
                {post.link && (
                  <Link
                    href={post.link}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                  >
                    Source <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
            </div>
          </article>
        ))}

        {posts.length === 0 && (
          <p className="text-center text-neutral-500 italic">No reading entries yet.</p>
        )}
      </div>
    </div>
  );
};
