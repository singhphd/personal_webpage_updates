import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
    // Defines the base URL for the site
    const baseUrl = 'https://JValdivia23.github.io/personal_webpage';

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        // Add more routes here if the site expands (e.g., /blog, /projects)
    ];
}