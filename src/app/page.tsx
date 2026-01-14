import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import { Hero } from "@/components/Hero";
import { StatsCard } from "@/components/StatsCard";
import { FeaturedPublication } from "@/components/FeaturedPublication";
import { FeaturedVisual } from "@/components/FeaturedVisual";
import { Download, CloudRain, Cpu, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black p-4 md:p-8 font-[family-name:var(--font-sans)]">
      <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[auto] gap-6">
        {/* Row 1: Hero + Stats */}
        <BentoGridItem
          title={null}
          description={null}
          header={<Hero />}
          className="md:col-span-2 bg-neutral-50 dark:bg-neutral-900 border-none justify-center min-h-[14rem]"
        />
        <BentoGridItem
          title={null}
          description={null}
          header={<StatsCard />}
          className="md:col-span-1 border-neutral-200 dark:border-neutral-800 min-h-[14rem]"
        />

        {/* Row 2: Featured Visual (CTGC) */}
        <BentoGridItem
          title={null}
          description={null}
          header={<FeaturedVisual />}
          className="md:col-span-3 p-0 border-none bg-transparent"
        />

        {/* Row 3: Research Focus Areas (Mini Cards) */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Card 1 */}
             <Link href="/research#radar-dct" className="group flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md dark:border-neutral-800 dark:bg-zinc-900/50 dark:hover:border-blue-900/50">
                <div>
                    <BarChart3 className="mb-3 h-8 w-8 text-blue-500" />
                    <h3 className="mb-2 font-bold text-neutral-800 dark:text-neutral-100">Signal Processing</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Advanced noise removal in Doppler spectra using Discrete Cosine Transform.
                    </p>
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </div>
             </Link>

             {/* Card 2 */}
             <Link href="/research#chess-bot" className="group flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md dark:border-neutral-800 dark:bg-zinc-900/50 dark:hover:border-blue-900/50">
                <div>
                    <Cpu className="mb-3 h-8 w-8 text-indigo-500" />
                    <h3 className="mb-2 font-bold text-neutral-800 dark:text-neutral-100">Machine Learning</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                         Reinforcement learning agents and neural networks for pattern recognition.
                    </p>
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </div>
             </Link>

             {/* Card 3 */}
             <Link href="/research" className="group flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md dark:border-neutral-800 dark:bg-zinc-900/50 dark:hover:border-blue-900/50">
                <div>
                    <CloudRain className="mb-3 h-8 w-8 text-teal-500" />
                    <h3 className="mb-2 font-bold text-neutral-800 dark:text-neutral-100">Climate Modeling</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Simulations of precipitation types in the Andes using CESM.
                    </p>
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </div>
             </Link>
        </div>

        {/* Row 4: Featured Publications */}
        <BentoGridItem
          title={null}
          description={null}
          header={<FeaturedPublication type="most-cited" />}
          className="md:col-span-3 p-0 border-none bg-transparent"
        />
        
        <BentoGridItem
          title={null}
          description={null}
          header={<FeaturedPublication type="recommended" />}
          className="md:col-span-3 p-0 border-none bg-transparent"
        />

        {/* Row 5: CV Download */}
        <BentoGridItem
          title={
            <a href="./cv.pdf" target="_blank" className="flex items-center gap-2 hover:underline">
              Download CV <Download className="w-4 h-4" />
            </a>
          }
          description="Get the full academic curriculum vitae (PDF)."
          className="md:col-span-3 h-28 bg-blue-50 dark:bg-slate-900/50 border-blue-100 dark:border-blue-900/50 content-center items-center justify-center text-center"
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
