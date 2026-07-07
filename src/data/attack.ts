/**
 * MITRE ATT&CK Enterprise reference for the coverage map.
 *
 * This is a deliberately curated subset (~70 well-known techniques across all
 * 14 tactics), not the full matrix — enough for a meaningful heatmap without
 * hauling a STIX bundle around. Extend freely: add entries here and they
 * appear as cells. Verify IDs/names against https://attack.mitre.org.
 *
 * Posts reference techniques in frontmatter: techniques: ['T1566', 'T1078'].
 */

export interface Tactic {
  id: string;
  short: string;
  name: string;
}

export interface Technique {
  id: string;
  name: string;
  tactic: string; // Tactic.id
}

export const TACTICS: Tactic[] = [
  { id: 'recon', short: 'recon', name: 'Reconnaissance' },
  { id: 'resdev', short: 'res-dev', name: 'Resource Development' },
  { id: 'initial', short: 'init', name: 'Initial Access' },
  { id: 'exec', short: 'exec', name: 'Execution' },
  { id: 'persist', short: 'persist', name: 'Persistence' },
  { id: 'privesc', short: 'privesc', name: 'Privilege Escalation' },
  { id: 'defevas', short: 'evasion', name: 'Defense Evasion' },
  { id: 'credaccess', short: 'creds', name: 'Credential Access' },
  { id: 'discovery', short: 'disco', name: 'Discovery' },
  { id: 'lateral', short: 'lateral', name: 'Lateral Movement' },
  { id: 'collect', short: 'collect', name: 'Collection' },
  { id: 'c2', short: 'c2', name: 'Command and Control' },
  { id: 'exfil', short: 'exfil', name: 'Exfiltration' },
  { id: 'impact', short: 'impact', name: 'Impact' },
];

export const TECHNIQUES: Technique[] = [
  // Reconnaissance
  { id: 'T1595', name: 'Active Scanning', tactic: 'recon' },
  { id: 'T1592', name: 'Gather Victim Host Information', tactic: 'recon' },
  { id: 'T1589', name: 'Gather Victim Identity Information', tactic: 'recon' },
  { id: 'T1590', name: 'Gather Victim Network Information', tactic: 'recon' },
  { id: 'T1598', name: 'Phishing for Information', tactic: 'recon' },
  { id: 'T1593', name: 'Search Open Websites/Domains', tactic: 'recon' },

  // Resource Development
  { id: 'T1583', name: 'Acquire Infrastructure', tactic: 'resdev' },
  { id: 'T1586', name: 'Compromise Accounts', tactic: 'resdev' },
  { id: 'T1587', name: 'Develop Capabilities', tactic: 'resdev' },
  { id: 'T1588', name: 'Obtain Capabilities', tactic: 'resdev' },
  { id: 'T1608', name: 'Stage Capabilities', tactic: 'resdev' },

  // Initial Access
  { id: 'T1566', name: 'Phishing', tactic: 'initial' },
  { id: 'T1190', name: 'Exploit Public-Facing Application', tactic: 'initial' },
  { id: 'T1133', name: 'External Remote Services', tactic: 'initial' },
  { id: 'T1078', name: 'Valid Accounts', tactic: 'initial' },
  { id: 'T1189', name: 'Drive-by Compromise', tactic: 'initial' },
  { id: 'T1195', name: 'Supply Chain Compromise', tactic: 'initial' },

  // Execution
  { id: 'T1059', name: 'Command and Scripting Interpreter', tactic: 'exec' },
  { id: 'T1204', name: 'User Execution', tactic: 'exec' },
  { id: 'T1053', name: 'Scheduled Task/Job', tactic: 'exec' },
  { id: 'T1047', name: 'Windows Management Instrumentation', tactic: 'exec' },
  { id: 'T1569', name: 'System Services', tactic: 'exec' },
  { id: 'T1203', name: 'Exploitation for Client Execution', tactic: 'exec' },

  // Persistence
  { id: 'T1547', name: 'Boot or Logon Autostart Execution', tactic: 'persist' },
  { id: 'T1136', name: 'Create Account', tactic: 'persist' },
  { id: 'T1098', name: 'Account Manipulation', tactic: 'persist' },
  { id: 'T1543', name: 'Create or Modify System Process', tactic: 'persist' },
  { id: 'T1574', name: 'Hijack Execution Flow', tactic: 'persist' },

  // Privilege Escalation
  { id: 'T1548', name: 'Abuse Elevation Control Mechanism', tactic: 'privesc' },
  { id: 'T1068', name: 'Exploitation for Privilege Escalation', tactic: 'privesc' },
  { id: 'T1134', name: 'Access Token Manipulation', tactic: 'privesc' },
  { id: 'T1055', name: 'Process Injection', tactic: 'privesc' },

  // Defense Evasion
  { id: 'T1027', name: 'Obfuscated Files or Information', tactic: 'defevas' },
  { id: 'T1070', name: 'Indicator Removal', tactic: 'defevas' },
  { id: 'T1036', name: 'Masquerading', tactic: 'defevas' },
  { id: 'T1112', name: 'Modify Registry', tactic: 'defevas' },
  { id: 'T1562', name: 'Impair Defenses', tactic: 'defevas' },
  { id: 'T1218', name: 'System Binary Proxy Execution', tactic: 'defevas' },

  // Credential Access
  { id: 'T1110', name: 'Brute Force', tactic: 'credaccess' },
  { id: 'T1003', name: 'OS Credential Dumping', tactic: 'credaccess' },
  { id: 'T1555', name: 'Credentials from Password Stores', tactic: 'credaccess' },
  { id: 'T1552', name: 'Unsecured Credentials', tactic: 'credaccess' },
  { id: 'T1558', name: 'Steal or Forge Kerberos Tickets', tactic: 'credaccess' },
  { id: 'T1539', name: 'Steal Web Session Cookie', tactic: 'credaccess' },

  // Discovery
  { id: 'T1082', name: 'System Information Discovery', tactic: 'discovery' },
  { id: 'T1057', name: 'Process Discovery', tactic: 'discovery' },
  { id: 'T1018', name: 'Remote System Discovery', tactic: 'discovery' },
  { id: 'T1087', name: 'Account Discovery', tactic: 'discovery' },
  { id: 'T1046', name: 'Network Service Discovery', tactic: 'discovery' },
  { id: 'T1049', name: 'System Network Connections Discovery', tactic: 'discovery' },

  // Lateral Movement
  { id: 'T1021', name: 'Remote Services', tactic: 'lateral' },
  { id: 'T1570', name: 'Lateral Tool Transfer', tactic: 'lateral' },
  { id: 'T1550', name: 'Use Alternate Authentication Material', tactic: 'lateral' },
  { id: 'T1534', name: 'Internal Spearphishing', tactic: 'lateral' },

  // Collection
  { id: 'T1005', name: 'Data from Local System', tactic: 'collect' },
  { id: 'T1560', name: 'Archive Collected Data', tactic: 'collect' },
  { id: 'T1114', name: 'Email Collection', tactic: 'collect' },
  { id: 'T1056', name: 'Input Capture', tactic: 'collect' },
  { id: 'T1113', name: 'Screen Capture', tactic: 'collect' },
  { id: 'T1039', name: 'Data from Network Shared Drive', tactic: 'collect' },

  // Command and Control
  { id: 'T1071', name: 'Application Layer Protocol', tactic: 'c2' },
  { id: 'T1105', name: 'Ingress Tool Transfer', tactic: 'c2' },
  { id: 'T1573', name: 'Encrypted Channel', tactic: 'c2' },
  { id: 'T1090', name: 'Proxy', tactic: 'c2' },
  { id: 'T1572', name: 'Protocol Tunneling', tactic: 'c2' },
  { id: 'T1219', name: 'Remote Access Software', tactic: 'c2' },

  // Exfiltration
  { id: 'T1041', name: 'Exfiltration Over C2 Channel', tactic: 'exfil' },
  { id: 'T1567', name: 'Exfiltration Over Web Service', tactic: 'exfil' },
  { id: 'T1048', name: 'Exfiltration Over Alternative Protocol', tactic: 'exfil' },
  { id: 'T1030', name: 'Data Transfer Size Limits', tactic: 'exfil' },

  // Impact
  { id: 'T1486', name: 'Data Encrypted for Impact', tactic: 'impact' },
  { id: 'T1490', name: 'Inhibit System Recovery', tactic: 'impact' },
  { id: 'T1489', name: 'Service Stop', tactic: 'impact' },
  { id: 'T1485', name: 'Data Destruction', tactic: 'impact' },
  { id: 'T1498', name: 'Network Denial of Service', tactic: 'impact' },
  { id: 'T1531', name: 'Account Access Removal', tactic: 'impact' },
];
