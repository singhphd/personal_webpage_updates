import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import { Hero } from "@/components/Hero";
import { StatsCard } from "@/components/StatsCard";
import { ProjectList } from "@/components/ProjectList";
import { PublicationList } from "@/components/PublicationList";
import { FolderGit2, BookOpen, Download } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black p-4 md:p-8 font-[family-name:var(--font-sans)]">
      <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[16rem]">
        {/* Row 1 */}
        <BentoGridItem
          title={null}
          description={null}
          header={<Hero />}
          className="md:col-span-2 md:row-span-1 bg-neutral-50 dark:bg-neutral-900 border-none justify-center"
        />
        <BentoGridItem
          title="Impact"
          description={<span className="text-sm">Research visibility and open source contributions.</span>}
          header={<StatsCard />}
          className="md:col-span-1 md:row-span-1 border-neutral-200 dark:border-neutral-800"
        />

        {/* Row 2 */}
        <BentoGridItem
          title="Featured Projects"
          description="Open source tools for radar meteorology and data analysis."
          header={<ProjectList />}
          icon={<FolderGit2 className="h-4 w-4 text-neutral-500" />}
          className="md:col-span-2 md:row-span-2 overflow-y-auto"
        />

        {/* Row 2/3 - Stacked on Mobile, Right col on Desktop */}
        <BentoGridItem
          title="Recent Publications"
          description="Selected research papers and conference proceedings."
          header={<PublicationList />}
          icon={<BookOpen className="h-4 w-4 text-neutral-500" />}
          className="md:col-span-1 md:row-span-2 overflow-y-auto"
        />

        {/* Row 4 - CV Download */}
        <BentoGridItem
          title={
            <a href="/cv.pdf" target="_blank" className="flex items-center gap-2 hover:underline">
              Download CV <Download className="w-4 h-4" />
            </a>
          }
          description="Get the full academic curriculum vitae (PDF)."
          className="md:col-span-3 md:row-span-1 h-32 bg-blue-50 dark:bg-slate-900/50 border-blue-100 dark:border-blue-900/50 content-center items-center justify-center text-center"
        />

      </BentoGrid>

      <footer className="mt-12 flex items-center justify-center gap-6 pb-8">
        <div className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Jairo M. Valdivia
        </div>
      </footer>
    </main>
  );
}
