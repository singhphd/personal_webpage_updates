import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content/research');

export interface ResearchPost {
  slug: string;
  title: string;
  summary: string;
  priority: number;
  tags: string[];
  image?: string;
  content: string;
  links?: {
    repo?: string;
    paper?: string;
    demo?: string;
  };
}

export function getAllResearchPosts(): ResearchPost[] {
  // Create directory if it doesn't exist
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(contentDirectory);
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title,
        summary: data.summary,
        priority: data.priority || 99,
        tags: data.tags || [],
        image: data.image,
        links: data.links,
        content,
      } as ResearchPost;
    });

  // Sort by priority (ascending: 1 is top)
  return allPosts.sort((a, b) => a.priority - b.priority);
}

export function getResearchPost(slug: string): ResearchPost | null {
  const fullPath = path.join(contentDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    summary: data.summary,
    priority: data.priority || 99,
    tags: data.tags || [],
    image: data.image,
    links: data.links,
    content,
  } as ResearchPost;
}
