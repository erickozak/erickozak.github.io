import { execSync } from 'node:child_process';

/**
 * Build telemetry, resolved once at build time (this is a fully static site,
 * so module scope = build moment). In CI the checkout has .git, so the real
 * commit SHA lands in the footer; locally without a repo it says 'dev'.
 */
function gitSha(): string {
  try {
    return execSync('git rev-parse --short HEAD', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return 'dev';
  }
}

const now = new Date();

export const BUILD = {
  sha: gitSha(),
  /** 2026-07-06 */
  date: now.toISOString().slice(0, 10),
  /** Full ISO for the console/manifest. */
  time: now.toISOString(),
} as const;
