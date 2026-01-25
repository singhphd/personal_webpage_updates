import { getAllResearchPosts, getResearchPost } from "@/lib/markdown";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Tag, ExternalLink, Github, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ResearchPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const posts = getAllResearchPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function ResearchPostPage({ params }: ResearchPostPageProps) {
    const { slug } = await params;
    const post = getResearchPost(slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-white dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/research"
                    className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Research
                </Link>

                <header className="mb-10">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                                    <Tag className="w-3 h-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap gap-4">
                        {post.links?.repo && (
                            <Link
                                href={post.links.repo}
                                target="_blank"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-sm font-medium"
                            >
                                <Github className="w-4 h-4" />
                                View Code
                            </Link>
                        )}
                        {post.links?.paper && (
                            <Link
                                href={post.links.paper}
                                target="_blank"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                            >
                                <FileText className="w-4 h-4" />
                                Read Paper
                            </Link>
                        )}
                        {post.links?.demo && (
                            <Link
                                href={post.links.demo}
                                target="_blank"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-sm font-medium"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Live Demo
                            </Link>
                        )}
                    </div>
                </header>

                <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
                    <ReactMarkdown
                        components={{
                            img: ({ node, ...props }) => {
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
