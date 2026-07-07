import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/**
 * All publishable posts, newest first.
 * Drafts are visible in dev, excluded in production builds.
 */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true
  );
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

/** ISO-8601 date (2026-07-04) — the only date format a log file respects. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Rough reading time from raw markdown body. */
export function readingTime(body: string | undefined): number {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/**
 * Which ATT&CK techniques the writing covers.
 * Sub-techniques (T1078.004) roll up to their parent (T1078).
 * Expects posts sorted newest-first (as getPosts returns), so the first
 * post seen for a technique is its most recent.
 */
export function coveredTechniques(
  posts: Post[]
): Map<string, { count: number; latest: Post }> {
  const covered = new Map<string, { count: number; latest: Post }>();
  for (const post of posts) {
    for (const t of post.data.techniques) {
      const base = t.split('.')[0];
      const entry = covered.get(base);
      if (entry) {
        entry.count += 1;
      } else {
        covered.set(base, { count: 1, latest: post });
      }
    }
  }
  return covered;
}
