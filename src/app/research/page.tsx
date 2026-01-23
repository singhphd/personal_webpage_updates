import { getAllResearchPosts } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Github, FileText, ExternalLink, ArrowRight, Play } from 'lucide-react';

export default function ResearchPage() {
  const posts = getAllResearchPosts();

  // Filter out the CTGC post from the standard list since we are featuring it
  const standardPosts = posts.filter(post => post.slug !== 'ctgc');

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Research & Projects
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Exploring the intersection of atmospheric science, radar meteorology, and machine learning.
        </p>
      </div>

      {/* Active Research Section */}
      <section className="mb-20">
        <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neutral-200 dark:to-neutral-800"></div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Active Research
            </h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neutral-200 dark:to-neutral-800"></div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white shadow-2xl transition-transform hover:scale-[1.01]">
            {/* Background Gradient/Image */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 mix-blend-overlay z-0"></div>
            <div className="absolute inset-0 bg-[url('/personal_webpage/projects/3D_CTGC_web/figures/figure03_3D_radars.png')] bg-cover bg-center opacity-30 z-0"></div>

            <div className="relative z-10 grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wide">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Featured Project
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                        Multi-Radar 3D Tracking of CTGCs
                    </h3>
                    
                    <p className="text-lg text-gray-300 leading-relaxed">
                        A novel approach to visualizing Cloud Top Generating Cells in 3D. 
                        We combine X, C, and S-band radar data to track the lifecycle of these elusive precipitation cells at the top of cloud.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <a 
                            href="/personal_webpage/projects/3D_CTGC_web/index.html" 
                            target="_blank"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-neutral-900 font-bold transition hover:bg-neutral-100 hover:scale-105 active:scale-95"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            Read More
                        </a>
                        {/* <Link 
                            href="#ctgc-details"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white font-medium transition hover:bg-white/20"
                        >
                            Read Summary
                        </Link> */}
                    </div>
                </div>

                {/* Visual Preview */}
                <div className="hidden md:block relative h-full min-h-[300px] rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black/40 backdrop-blur-sm group cursor-pointer">
                    <a href="/personal_webpage/projects/3D_CTGC_web/index.html" target="_blank" className="block h-full w-full">
                        <iframe 
                            src="/personal_webpage/projects/3D_CTGC_web/index.html" 
                            className="w-[200%] h-[200%] transform scale-50 origin-top-left pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"
                            title="Preview"
                        />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                                <ExternalLink className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
      </section>

      {/* Other Projects Grid */}
      <section>
         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
            Project Archive
         </h2>
         
         <div className="space-y-12">
            {standardPosts.map((post) => (
            <article 
                key={post.slug} 
                id={post.slug}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-zinc-900/50"
            >
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                            <Link href={`/research/${post.slug}`} className="group/title inline-block">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors">
                                    {post.title}
                                </h3>
                            </Link>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                    {tag}
                                </span>
                                ))}
                            </div>
                            
                            <p className="mt-4 text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                                {post.summary}
                            </p>
                            
                            <div className="mt-6 flex items-center gap-6">
                                <Link 
                                    href={`/research/${post.slug}`}
                                    className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                >
                                    Read Full Case Study <ArrowRight size={16} />
                                </Link>
                                
                                <div className="flex gap-3">
                                    {post.links?.repo && (
                                    <Link href={post.links.repo} target="_blank" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" title="View Code">
                                        <Github size={18} />
                                    </Link>
                                    )}
                                    {post.links?.paper && (
                                    <Link href={post.links.paper} target="_blank" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" title="Read Paper">
                                        <FileText size={18} />
                                    </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {post.image && (
                            <div className="hidden sm:block w-32 h-32 shrink-0 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                                <img 
                                    src={post.image.startsWith('/') && !post.image.startsWith('/personal_webpage') ? `/personal_webpage${post.image}` : post.image} 
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </article>
            ))}
            
            {/* Fallback CTGC summary card (hidden by default, linked from Active Research) */}
            <div id="ctgc-details" className="pt-8 opacity-50 hover:opacity-100 transition-opacity">
                 <p className="text-center text-sm text-gray-500 italic">
                    Looking for the technical details of the CTGC project? <br/>
                    <a href="/personal_webpage/projects/3D_CTGC_web/index.html" target="_blank" className="text-blue-600 hover:underline">View the full interactive visualization</a>
                 </p>
            </div>
         </div>
      </section>
    </div>
  );
}
