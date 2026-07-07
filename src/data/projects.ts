/**
 * Projects shown on / and /projects/.
 * TODO: replace these placeholders with your real work. Add a `link:` field
 * to any project to make its title a link (e.g. link: 'https://github.com/erickozak/repo').
 * Delete or add entries freely — the grid adapts.
 */
export interface Project {
  name: string;
  path: string; // decorative "directory" label, e.g. detect/
  description: string;
  tags: string[];
  status: 'active' | 'wip' | 'archived';
  link?: string;
}

export const projects: Project[] = [
  {
    name: 'detection-notes',
    path: 'detect/',
    description:
      'Public detection engineering notes: rules and hunting queries mapped to ATT&CK, with the false-positive war stories included.',
    tags: ['detection', 'attack'],
    status: 'wip',
  },
  {
    name: 'cti-lab',
    path: 'intel/',
    description:
      'Self-hosted threat intelligence stack — OpenCTI, MISP, and the collection pipelines that feed them.',
    tags: ['cti', 'infrastructure'],
    status: 'active',
  },
  {
    name: 'glue',
    path: 'automate/',
    description:
      'Automation patterns for SOC workflows: enrichment, triage, and the boring plumbing that gives analysts their hours back.',
    tags: ['automation', 'soar'],
    status: 'active',
  },
];
