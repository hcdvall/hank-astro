import { getCollection } from 'astro:content';

export function formatDate(date: Date, month: 'long' | 'short' = 'long') {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month,
    day: 'numeric',
    timeZone: 'UTC',
  });
}

// Drafts are visible in `astro dev` but left out of production builds.
const isPublished = ({ data }: { data: { draft: boolean } }) => !import.meta.env.PROD || !data.draft;

/** Blog posts, newest first. */
export async function getPosts() {
  const posts = await getCollection('blog', isPublished);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Projects, newest first. */
export async function getProjects() {
  const projects = await getCollection('projects', isPublished);
  return projects.sort((a, b) => b.data.startDate.valueOf() - a.data.startDate.valueOf());
}

export async function getHighlightedProjects(n: number) {
  return (await getProjects()).filter((p) => p.data.highlight).slice(0, n);
}
