#!/usr/bin/env node
/**
 * Scaffold a new draft post:
 *   npm run new "My post title"
 * Creates src/content/blog/my-post-title.md with today's date, draft: true.
 */
import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Usage: npm run new "Post title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/['"’]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const date = new Date().toISOString().slice(0, 10);
const path = join('src', 'content', 'blog', `${slug}.md`);

if (existsSync(path)) {
  console.error(`Refusing to overwrite existing file: ${path}`);
  process.exit(1);
}

const body = `---
title: '${title.replace(/'/g, "''")}'
description: 'TODO: one-sentence summary for listings and the RSS feed.'
pubDate: ${date}
tags: []
techniques: [] # ATT&CK IDs, e.g. ['T1566', 'T1078'] — these light the map
draft: true
---

Write here. Remove \`draft: true\` (or set it to false) when ready to publish.
`;

writeFileSync(path, body);
console.log(`Created ${path}`);
console.log('Preview with: npm run dev');
