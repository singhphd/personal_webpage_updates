import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const FeaturedVisual = () => {
    return (
        <div className="relative h-full w-full min-h-[200px] flex flex-col justify-end overflow-hidden rounded-xl bg-neutral-900 group">
             {/* Abstract Radar Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#3b82f6_0%,_transparent_50%)] opacity-20 transition-opacity duration-500 group-hover:opacity-30" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            
            {/* Content */}
            <div className="relative z-10 p-6">
                <div className="mb-2 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20">
                        Active Research
                    </span>
                    <span className="text-xs text-gray-400">Cloud Microphysics</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                    3D Tracking of Cloud Top Generating Cells
                </h3>
                <p className="text-sm text-gray-300 max-w-2xl mb-4">
                    Multi-frequency radar observations of a single Cloud Top Generating Cell (CTGC) observed during the Wintre-MIX field campaign are used to study the microphysical evolution of these convective features in 3D.
                </p>
                <a 
                    href="/personal_webpage/projects/3D_CTGC_web/index.html" 
                    target="_blank"
                    className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                    Launch Visualization <ArrowRight className="ml-1 h-4 w-4" />
                </a>
            </div>
        </div>
    );
};
