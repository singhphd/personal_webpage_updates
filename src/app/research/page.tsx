import { getAllResearchPosts } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Github, FileText, ExternalLink } from 'lucide-react';

export default function ResearchPage() {
  const posts = getAllResearchPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Research & Projects
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          A collection of my work in cloud microphysics, radar remote sensing, and applied machine learning.
        </p>
      </div>
      
      <div className="space-y-12">
        {posts.map((post) => (
          <article 
            key={post.slug} 
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-zinc-900/50"
            id={post.slug}
          >
             <div className="p-6 sm:p-8">
               <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                 <div>
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{post.title}</h2>
                   <div className="mt-2 flex flex-wrap gap-2">
                     {post.tags.map(tag => (
                       <span key={tag} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/30">
                         {tag}
                       </span>
                     ))}
                   </div>
                 </div>
                 
                 {/* Links */}
                 {post.links && (
                   <div className="flex gap-2">
                     {post.links.repo && (
                       <Link href={post.links.repo} target="_blank" className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" title="View Code">
                         <Github size={20} />
                       </Link>
                     )}
                     {post.links.paper && (
                       <Link href={post.links.paper} target="_blank" className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" title="Read Paper">
                         <FileText size={20} />
                       </Link>
                     )}
                     {post.links.demo && (
                       <Link href={post.links.demo} target="_blank" className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" title="View Demo">
                         <ExternalLink size={20} />
                       </Link>
                     )}
                   </div>
                 )}
               </div>

               <div className="prose prose-blue prose-lg dark:prose-invert mt-6 max-w-none">
                 <ReactMarkdown>{post.content}</ReactMarkdown>
               </div>
             </div>
          </article>
        ))}
      </div>
    </div>
  );
}
