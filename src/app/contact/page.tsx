import Link from 'next/link';
import { Mail, Github, Linkedin, FileText, ExternalLink } from 'lucide-react';
import stats from '@/data/stats.json';

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        Get in Touch
      </h1>
      
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-zinc-900/50">
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
          I am always open to discussing collaboration opportunities, radar data analysis, or cloud microphysics research. Feel free to reach out via email or connect on social media.
        </p>

        <div className="space-y-6">
           <div className="flex items-center gap-4">
             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
               <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
             </div>
             <div>
               <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
               <a href="mailto:jairo.valdivia@colorado.edu" className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                 jairo.valdivia@colorado.edu
               </a>
             </div>
           </div>

           <div className="flex items-center gap-4">
             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
               <Github className="h-5 w-5 text-gray-700 dark:text-gray-300" />
             </div>
             <div>
               <p className="text-sm font-medium text-gray-500 dark:text-gray-400">GitHub</p>
               <a href="https://github.com/JValdivia23" target="_blank" className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                 JValdivia23
               </a>
             </div>
           </div>

           <div className="flex items-center gap-4">
             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
               <Linkedin className="h-5 w-5 text-blue-700 dark:text-blue-400" />
             </div>
             <div>
               <p className="text-sm font-medium text-gray-500 dark:text-gray-400">LinkedIn</p>
               <a href="https://linkedin.com/in/jairo-valdivia" target="_blank" className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                 jairo-valdivia
               </a>
             </div>
           </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
                <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Curriculum Vitae</p>
                <div className="flex gap-4 items-center">
                  <Link href="/cv" className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                    View Online
                  </Link>
                  <span className="text-gray-300 dark:text-gray-700">|</span>
                  <a href="/personal_webpage/cv.pdf" download className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                    Download PDF
                  </a>
                </div>
              </div>
            </div>
           
           <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20">
               <ExternalLink className="h-5 w-5 text-amber-600 dark:text-amber-400" />
             </div>
             <div>
               <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Google Scholar</p>
               <a href={stats.googleScholar.profileUrl} target="_blank" className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                 View Citations
               </a>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
