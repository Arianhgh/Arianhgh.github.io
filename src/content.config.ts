import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    date: z.coerce.date(),
    kind: z.enum(['note', 'essay']),
    summary: z.string().optional(),
    draft: z.boolean().default(true)
  })
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.string(),
    year: z.string(),
    summary: z.string(),
    contribution: z.string(),
    result: z.string(),
    sourceLabel: z.string(),
    sourceUrl: z.url(),
    order: z.number()
  })
});

export const collections = { posts, projects };
