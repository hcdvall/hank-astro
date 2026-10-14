import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      startDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.string().optional(),
      draft: z.boolean().default(false),
      cover: image().optional(),
      coverVideo: z.string().optional(),
      highlight: z.boolean().default(false),
      links: z
        .object({
          repo: z.string().url().optional(),
          itch: z.string().url().optional(),
          video: z.string().url().optional(),
        })
        .optional(),
    }),
});

export const collections = { blog, projects };
