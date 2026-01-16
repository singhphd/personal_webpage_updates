import { ArrowLeft, Download, FileText } from "lucide-react";
import Link from "next/link";

export default function CVPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-neutral-50 dark:bg-zinc-950">
      {/* Viewer Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm z-10">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
        
        <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-sm md:text-base">
          <FileText className="w-4 h-4 text-blue-600 hidden xs:inline" />
          <span>Curriculum Vitae</span>
          <span className="hidden md:inline text-gray-400 font-normal">— Jairo M. Valdivia</span>
        </div>
        
        <a 
          href="/personal_webpage/cv.pdf" 
          download 
          className="flex items-center gap-2 rounded-full bg-blue-600 px-4 md:px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-md active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Download</span>
          <span className="sm:hidden">PDF</span>
        </a>
      </div>

      {/* PDF Container */}
      <div className="flex-grow w-full bg-neutral-100 dark:bg-zinc-900 p-2 md:p-4 overflow-hidden">
        <div className="w-full h-full max-w-5xl mx-auto rounded-xl border border-gray-200 dark:border-zinc-800 shadow-lg bg-white overflow-hidden">
            <iframe 
                src="/personal_webpage/cv.pdf" 
                className="w-full h-full"
                title="Jairo M. Valdivia CV"
            />
        </div>
      </div>
    </div>
  );
}
