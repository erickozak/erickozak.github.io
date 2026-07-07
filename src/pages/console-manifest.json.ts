import type { APIRoute } from 'astro';
import { getPosts, isoDate, coveredTechniques } from '../lib/posts';
import { SITE, PROMPT } from '../consts';
import { projects } from '../data/projects';
import { TECHNIQUES } from '../data/attack';
import { BUILD } from '../lib/build';
import signals from '../data/signals.json';

/**
 * /console-manifest.json — everything the drop-down console knows.
 * Generated at build time; the console fetches it once on first open.
 */
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const covered = [...coveredTechniques(posts).entries()].map(([id, v]) => ({
    id,
    name: TECHNIQUES.find((t) => t.id === id)?.name ?? id,
    count: v.count,
    slug: v.latest.id,
  }));

  const body = {
    prompt: PROMPT,
    site: {
      author: SITE.author,
      url: SITE.url,
      github: SITE.github,
      linkedin: SITE.linkedin,
    },
    build: BUILD,
    posts: posts.map((p) => ({
      slug: p.id,
      title: p.data.title,
      date: isoDate(p.data.pubDate),
      desc: p.data.description,
      techniques: p.data.techniques,
    })),
    projects: projects.map((p) => ({
      name: p.name,
      status: p.status,
      desc: p.description,
    })),
    signals,
    attack: covered,
  };

  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
