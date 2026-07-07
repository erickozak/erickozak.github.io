---
title: 'Markdown reference (draft)'
description: 'A kitchen-sink post for checking how every markdown element renders. Stays a draft — visible in dev, never published.'
pubDate: 2026-07-01
tags: ['meta', 'reference']
techniques: ['T1566', 'T1078'] # demo: lights the map in dev; drafts never publish
draft: true
---

This post is `draft: true`, so it renders in `npm run dev` but is excluded from production builds. Keep it around as a styling reference, or delete it.

## Headings and text

Regular paragraph text with **bold**, *italic*, and `inline code`. Links look like [this one to the writing index](/writing/).

### A third-level heading

Body text continues at a comfortable measure — around 70 characters — because nobody wants to read a threat report the full width of an ultrawide.

## Lists

Unordered:

- Detections should be version controlled
- Alerts should carry their own context
- Runbooks should be executable, or they'll rot

Ordered:

1. Collect
2. Detect
3. Triage
4. Respond

## Code

```python
def enrich(indicator: str) -> dict:
    """Look up an indicator across intel sources."""
    results = {}
    for source in SOURCES:
        results[source.name] = source.lookup(indicator)
    return results
```

## Blockquote

> Amateurs talk detection coverage. Professionals talk detection *validation*.

## Table

| Technique | ATT&CK ID | Coverage |
| --------- | --------- | -------- |
| Valid Accounts | T1078 | partial |
| Phishing | T1566 | good |
| Exfil over C2 | T1041 | gap |

## Horizontal rule

---

That's the whole kit.
