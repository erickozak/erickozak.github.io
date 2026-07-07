# Personal site

A static personal site built with [Astro](https://astro.build): a small SOC that monitors itself. Markdown publishing, an animated intrusion-detection hero, an ATT&CK coverage map driven by post frontmatter, a nightly self-updating threat-signals feed, real build telemetry, and a drop-down console (press `` ` ``). No third-party code, ever. Deploys to GitHub Pages via GitHub Actions; designed to be secure by construction and near-zero maintenance.

## Stack rationale

- **Astro** — articles are plain markdown files, but the design is fully custom HTML/CSS. No theme lock-in, no framework runtime shipped to visitors.
- **GitHub Pages + Actions** — push to `main`, site deploys. No server to patch, free TLS, and your Linode stays out of scope entirely.
- **Zero third-party code** — fonts self-hosted (IBM Plex Mono, OFL license in `public/fonts/`), one dependency-free script (`public/console.js`) served from this origin, no CDNs, no analytics, no cookies.

## First-time setup

1. **Personalize** — edit `src/consts.ts` (name, prompt handle, domain, GitHub/LinkedIn/email). Search the repo for `TODO` to find everything else worth touching: `astro.config.mjs` (`site`), `src/data/projects.ts`, `src/pages/about.astro`, and the starter post.
2. **Create the repo** — name it `<username>.github.io` so it serves at the root immediately (any repo name works once the custom domain is active, but this avoids broken paths in the meantime):
   ```bash
   git init && git add . && git commit -m "initial commit"
   git branch -M main
   git remote add origin git@github.com:<username>/<username>.github.io.git
   git push -u origin main
   ```
3. **Enable Pages** — repo **Settings → Pages → Source: GitHub Actions**. The included workflow (`.github/workflows/deploy.yml`) handles the rest. First deploy runs on that initial push.

## Publishing articles

```bash
npm install          # once
npm run new "My post title"   # scaffolds src/content/blog/my-post-title.md
npm run dev          # live preview at localhost:4321 (drafts visible)
```

Posts are markdown with this frontmatter:

```yaml
---
title: 'My post title'
description: 'One sentence for listings and RSS.'
pubDate: 2026-07-04
tags: ['detection', 'automation']
draft: true # visible in dev, excluded from production builds
---
```

Set `draft: false` (or delete the line), then commit and push. The Action builds and deploys — that's the whole pipeline. The filename becomes the URL: `my-post-title.md` → `/writing/my-post-title/`.

## Custom domain (Namecheap → GitHub Pages)

Records below are from [GitHub's official docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

1. **Verify the domain first** (prevents domain takeover if Pages is ever disabled): GitHub **profile Settings → Pages → Add a domain**, then add the TXT record GitHub gives you in Namecheap → Advanced DNS. Wait for verification.
2. **Namecheap → Domain List → Manage → Advanced DNS**, add:

   | Type  | Host | Value                     |
   | ----- | ---- | ------------------------- |
   | A     | @    | 185.199.108.153           |
   | A     | @    | 185.199.109.153           |
   | A     | @    | 185.199.110.153           |
   | A     | @    | 185.199.111.153           |
   | CNAME | www  | `<username>.github.io.`   |

   Optional IPv6 (AAAA, Host @): `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

   Remove any default parking records Namecheap added. **Do not** create wildcard (`*`) records — GitHub explicitly warns they enable subdomain takeover.

3. **Repo Settings → Pages → Custom domain** → enter `erickozak.io` → Save. Wait for the DNS check, then tick **Enforce HTTPS**. (A `public/CNAME` file is included and pre-set to `erickozak.io`, so the custom domain persists across Actions deploys — if you ever change domains, update that file too.)
4. **Sync the code**: set your domain in `astro.config.mjs` (`site:`) and `src/consts.ts` (`url:`) so canonicals, sitemap, robots.txt, and RSS all point at the real domain. Commit and push.

DNS can take up to 24h to propagate; verify with `dig yourdomain.com +noall +answer -t A`.

## The SOC modules

### The console

Press `` ` `` (backtick) anywhere — or tap `` `console `` in the header or footer — for a drop-down terminal. Any element with `data-console-toggle` becomes a trigger. `help` lists commands; `ls`, `cd`, `cat`, and `open` navigate the real site; `signals` and `attack` read the live data; `sudo`, `rm -rf /`, `nmap`, and `ps` do what you'd hope. Tab completes, arrows walk history, Esc closes. It's progressive enhancement: with JS blocked the site is fully usable. Extend it in `public/console.js` (the `COMMANDS` table at the bottom); its data comes from `/console-manifest.json`, generated at build time from posts, projects, signals, and the ATT&CK map.

### Threat signals (self-updating)

`.github/workflows/signals.yml` runs nightly: it fetches the newest [CISA KEV](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) entries via `scripts/update-signals.mjs` into `src/data/signals.json`, commits only when entries actually changed, and then explicitly dispatches the deploy workflow (pushes made with `GITHUB_TOKEN` deliberately don't trigger workflows — GitHub's recursion guard — so the dispatch is required, and needs the `actions: write` permission the workflow already has). Fetch failures keep the last committed data; a bad night can never break the site. Populate immediately with `node scripts/update-signals.mjs`.

### ATT&CK coverage map

Tag posts with technique IDs and the homepage matrix lights up:

```yaml
techniques: ['T1566', 'T1078.004'] # sub-techniques roll up to the parent cell
```

Lit cells link to the most recent post covering that technique; post pages get chips linking to attack.mitre.org. The reference data in `src/data/attack.ts` is a curated ~70-technique subset across all 14 Enterprise tactics — extend it as your writing does, and verify IDs against attack.mitre.org.

### Build telemetry

The footer statusline shows the real commit SHA and build date, resolved at build time in `src/lib/build.ts` (falls back to `dev` outside a git checkout). If the footer says a SHA, that exact commit is what you're reading.

## Security posture

- **Static output, one self-hosted script** — the only JavaScript is `public/console.js`: dependency-free, readable in one sitting, renders exclusively via `textContent` (no injection sink), and fetches only `/console-manifest.json` from this origin. The site works fully with it blocked.
- **No third-party code or requests** — every executable byte served from your origin. Nothing to supply-chain.
- **CSP via meta tag** (`src/layouts/Base.astro`), production builds only: `default-src 'none'` with narrow carve-outs: `script-src 'self'`, `connect-src 'self'`, self-hosted images/fonts, inlined styles. GitHub Pages can't set response headers, so meta-CSP is the ceiling there (no `frame-ancestors`/reporting). If you later want full headers (HSTS, X-Frame-Options, etc.), proxy through Cloudflare — point Namecheap's nameservers at a free Cloudflare zone and add the headers via a response-header transform rule. Optional; the static, no-third-party posture carries most of the weight.
- **CI hygiene** — deploy workflow runs with least-privilege permissions; Dependabot keeps the Actions and npm dependencies patched weekly (build-time deps only — visitors never execute them).
- **Account hygiene** (do these once): enforce 2FA on GitHub, verify the custom domain (step 1 above), and consider branch protection on `main`.

## Maintenance

Near-zero by design. Merge Dependabot PRs when they appear (the deploy re-runs automatically, so a bad upgrade shows up as a failed build, not a broken site). For major Astro versions: `npx @astrojs/upgrade`. There is no database, no server, and no plugin ecosystem to babysit.

## Structure

```
src/
  consts.ts            ← your name, domain, links (edit this first)
  content/blog/        ← posts (markdown; filename = URL slug)
  data/projects.ts     ← projects grid content
  data/attack.ts       ← ATT&CK tactics/techniques reference (curated)
  data/signals.json    ← newest KEV entries (synced nightly)
  pages/               ← routes: /, /writing/, /projects/, /about/, 404, rss, robots
  components/          ← header, footer, terminal session, post rows
  layouts/Base.astro   ← <head>, meta, CSP
  styles/global.css    ← the entire design system
public/console.js      ← the drop-down console (self-hosted, no deps)
public/fonts/          ← self-hosted IBM Plex Mono (+ OFL license)
.github/workflows/     ← deploy pipeline + nightly signals sync
scripts/new-post.mjs   ← `npm run new "title"`
scripts/update-signals.mjs ← KEV feed sync (CI + manual)
```
