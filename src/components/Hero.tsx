import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const Hero = () => {
    return (
        <div className="flex flex-col h-full justify-center space-y-4">
            <div className="flex items-center space-x-4">
                {/* Placeholder for avatar - user can replace with avatar.jpg in public */}
                <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center overflow-hidden border border-neutral-300 dark:border-neutral-700">
                    <Image src="/avatar.png" alt="JValdivia23" width={64} height={64} className="object-cover" />
                    {/* Fallback if no image: <span className="text-2xl font-bold">JV</span> */}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                        Jairo M. Valdivia
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Ph.D. Student at CU Boulder (ATOC)
                    </p>
                </div>
            </div>

            <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                Radar Scientist specializing in cloud microphysics and precipitation studies in the Andes.
                Building tools for meteorological data analysis.
            </p>

            <div className="flex flex-wrap gap-3">
                <Link
                    href="https://github.com/JValdivia23"
                    target="_blank"
                    className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                    aria-label="GitHub"
                >
                    <Github className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                </Link>
                <Link
                    href="https://www.linkedin.com/in/jairo-valdivia-prado-07755b1a6/"
                    target="_blank"
                    className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                    aria-label="LinkedIn"
                >
                    <Linkedin className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                </Link>
                {/* Add Semantic Scholar or other icons if available in Lucide or custom SVG */}
                <a
                    href="mailto:jairo.valdivia@colorado.edu"
                    className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                    aria-label="Email"
                >
                    <Mail className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                </a>
            </div>
        </div>
    );
};
