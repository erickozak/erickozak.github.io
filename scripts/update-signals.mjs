#!/usr/bin/env node
/**
 * Sync src/data/signals.json with the newest CISA KEV entries.
 *
 * Run locally:   node scripts/update-signals.mjs
 * Run in CI:     .github/workflows/signals.yml (nightly)
 *
 * Behavior:
 *  - fetch failure → warn and exit 0 (the committed data stays; build is safe)
 *  - identical newest entries → no write (avoids commit/deploy churn)
 *  - real changes → write file; CI commits and triggers a redeploy
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FEED =
  'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';
const OUT = new URL('../src/data/signals.json', import.meta.url);
const KEEP = 6;

let feed;
try {
  const res = await fetch(FEED, {
    headers: { 'user-agent': 'erickozak.io signals sync' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  feed = await res.json();
} catch (err) {
  console.warn(`warn: KEV fetch failed (${err.message}) — keeping existing data`);
  process.exit(0);
}

const vulns = Array.isArray(feed?.vulnerabilities) ? feed.vulnerabilities : [];
if (vulns.length === 0) {
  console.warn('warn: KEV feed returned no vulnerabilities — keeping existing data');
  process.exit(0);
}

const items = vulns
  .slice()
  .sort((a, b) => String(b.dateAdded).localeCompare(String(a.dateAdded)))
  .slice(0, KEEP)
  .map((v) => ({
    cve: v.cveID ?? '',
    name: v.vulnerabilityName ?? '',
    vendor: v.vendorProject ?? '',
    product: v.product ?? '',
    dateAdded: v.dateAdded ?? '',
    ransomware: v.knownRansomwareCampaignUse === 'Known',
  }));

let existing = null;
try {
  existing = JSON.parse(readFileSync(OUT, 'utf8'));
} catch {
  /* first run or unreadable — proceed to write */
}

if (existing && JSON.stringify(existing.items) === JSON.stringify(items)) {
  console.log('signals: no new KEV entries — nothing to do');
  process.exit(0);
}

const out = {
  updated: new Date().toISOString(),
  source: 'CISA Known Exploited Vulnerabilities catalog',
  catalogVersion: feed.catalogVersion ?? null,
  items,
};

writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(`signals: wrote ${items.length} entries (catalog ${out.catalogVersion})`);
