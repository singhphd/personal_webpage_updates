import { getAllReadingPosts, getReadingPost } from "@/lib/markdown";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, Tag, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ReadingPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllReadingPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function ReadingPostPage({ params }: ReadingPostPageProps) {
  const { slug } = await params;
  const post = getReadingPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-white dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <time>{post.date}</time>
            </div>
            {post.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
            {post.title}
          </h1>

          {post.link && (
            <Link 
              href={post.link}
              target="_blank"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              Original Source <ExternalLink className="w-4 h-4" />
            </Link>
          )}
        </header>

        <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown
             components={{
                img: ({node, ...props}) => {
                    // Prepend base path for local images if not already present
                    let src = props.src as string;
                    if (src && typeof src === 'string' && src.startsWith('/') && !src.startsWith('/personal_webpage')) {
                        src = `/personal_webpage${src}`;
                    }
                    
                    return (
                        <span className="block my-8">
                            <img {...props} src={src} className="rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800" />
                            {props.alt && (
                                <span className="block text-center text-sm text-neutral-500 mt-2 italic">
                                    {props.alt}
                                </span>
                            )}
                        </span>
                    );
                }
             }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
