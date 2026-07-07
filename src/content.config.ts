import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Blog posts live in src/content/blog as markdown files.
 * The filename (minus extension) becomes the URL slug: /writing/<filename>/
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /**
     * MITRE ATT&CK technique IDs this post covers, e.g. ['T1566', 'T1078.004'].
     * These light up the map on the homepage. Sub-techniques roll up to
     * their parent cell.
     */
    techniques: z
      .array(
        z
          .string()
          .regex(/^T\d{4}(\.\d{3})?$/, "ATT&CK ID like 'T1078' or 'T1078.004'")
      )
      .default([]),
    /** Drafts render in `npm run dev` but are excluded from production builds. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
