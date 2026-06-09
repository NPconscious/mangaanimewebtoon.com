import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  author: z.string().default('Manga Anime Webtoon Team'),
  heroImage: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/news" }),
  schema: blogSchema,
});

const reviews = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/reviews" }),
  schema: blogSchema,
});

const webtoons = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/webtoons" }),
  schema: blogSchema,
});

const trending = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/trending" }),
  schema: blogSchema,
});

export const collections = { news, reviews, webtoons, trending };
