/**
 * Site-wide constants. This is the ONE file to edit to make the site yours.
 * Everything here flows into the header, hero, footer, meta tags, and RSS feed.
 */
export const SITE = {
  /** Your display name. Used in the header, titles, and feed. */
  author: 'Eric Kozak',

  /** The user half of the terminal prompt: eric@console:~$ */
  handle: 'eric',

  /** The host half of the terminal prompt. */
  host: 'console',

  /** Browser tab / OpenGraph title. */
  title: 'Eric Kozak — blue team, threat intel & security automation',

  /** Meta description + RSS feed description. */
  description:
    'Field notes on blue team engineering, cyber threat intelligence, and security automation.',

  /**
   * Canonical site URL. Keep this in sync with `site` in astro.config.mjs
   * and with public/CNAME.
   */
  url: 'https://erickozak.io',

  /** Social + contact links. Set any of these to '' to hide them. */
  github: 'https://github.com/erickozak',
  linkedin: 'https://www.linkedin.com/in/ekozak7/',
  email: '', // TODO: add your contact email to show the email link
} as const;

/** The rendered shell prompt, e.g. `eric@console:~$` */
export const PROMPT = `${SITE.handle}@${SITE.host}`;
