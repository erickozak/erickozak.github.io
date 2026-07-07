---
title: 'hello, world'
description: 'Why this site exists, what I plan to write here, and how the whole thing ships.'
pubDate: 2026-07-04
tags: ['meta']
---

Every security engineer has a folder of notes that never leaves their machine — detection logic that finally stopped false-positiving, the incident writeup with the lesson buried in paragraph four, the automation that quietly saves ten hours a week. This site is me moving that folder into the open.

<!-- TODO: this whole post is a starting point. Rewrite it in your own words,
     or delete it and run `npm run new "your first post"` to start fresh. -->

## What to expect here

Three threads, because they're the three threads of my actual work:

- **Detection engineering** — building detections grounded in ATT&CK, and being honest about the gap between "we have coverage" and "we would have caught it."
- **Threat intelligence** — tracking adversary infrastructure and tradecraft, and making intel something operations can act on rather than something leadership scrolls past.
- **Automation** — I think we're at a real turning point in what a small defensive team can do. Most of what I'll write here is field notes from testing that belief against production.

## How this ships

The publishing pipeline is deliberately boring. Posts are markdown files in a git repo; pushing to `main` builds and deploys the site:

```bash
npm run new "post title"   # scaffold a new draft
# ...write...
git add . && git commit -m "post: title" && git push
```

Static files, no JavaScript, no trackers. The attack surface of this site is approximately the attack surface of a text file, which is how I like it.

More soon.
