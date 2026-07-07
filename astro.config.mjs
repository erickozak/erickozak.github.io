// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Canonical origin. Must match SITE.url in src/consts.ts and public/CNAME.
  // Used to generate canonical URLs, the sitemap, robots.txt, and the RSS feed.
  site: 'https://erickozak.io',

  integrations: [sitemap()],

  markdown: {
    shikiConfig: {
      // Warm-toned dark theme that sits well with the amber palette.
      theme: 'vitesse-dark',
      wrap: true,
    },
  },

  build: {
    // Inline all CSS into each page: fewer requests, no render-blocking
    // stylesheet fetch, and pages remain fully self-contained.
    inlineStylesheets: 'always',
  },
});
