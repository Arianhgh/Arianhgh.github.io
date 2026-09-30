import { getCollection } from 'astro:content';

export async function publishedPosts() {
  const posts = await getCollection('posts');
  const visible = posts.filter((post) => !post.data.draft && (import.meta.env.DEV || post.data.date <= new Date()));
  return visible.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function allVisiblePosts() {
  const posts = await getCollection('posts');
  return posts.filter((post) => import.meta.env.DEV || (!post.data.draft && post.data.date <= new Date()));
}

export async function featuredProjects() {
  const featuredSlugs = new Set(['mlforensics', 'leakproof', 'vizir']);
  return (await getCollection('projects'))
    .filter((project) => featuredSlugs.has(project.data.slug))
    .sort((a, b) => a.data.order - b.data.order);
}

export const dateLabel = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date);
