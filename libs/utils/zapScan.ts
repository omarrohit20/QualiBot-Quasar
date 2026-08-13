// libs/utils/zapScan.ts
// Minimal client for a locally running OWASP ZAP daemon (ZAP Desktop/CLI with its API
// enabled, or `docker run -p 8080:8080 zaproxy/zap-stable zap.sh -daemon -port 8080`).
// Used by global-teardown.ts to turn the passive-scan alerts collected while existing
// smoke UI tests ran through the ZAP proxy into a security artifact — no separate
// security-only tests are created.
import * as fs from 'fs';
import * as path from 'path';

const ZAP_API_URL = process.env.ZAP_API_URL || 'http://127.0.0.1:8080';
const ZAP_API_KEY = process.env.ZAP_API_KEY || '';

function zapUrl(endpoint: string, params: Record<string, string> = {}): string {
  const url = new URL(`${ZAP_API_URL}${endpoint}`);
  if (ZAP_API_KEY) url.searchParams.set('apikey', ZAP_API_KEY);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return url.toString();
}

async function zapGet(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  const res = await fetch(zapUrl(endpoint, params));
  if (!res.ok) {
    throw new Error(`ZAP API ${endpoint} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function isZapReachable(): Promise<boolean> {
  try {
    await zapGet('/JSON/core/view/version/');
    return true;
  } catch {
    return false;
  }
}

/** Waits for ZAP's passive scanner to finish analyzing traffic already proxied through it. */
export async function waitForPassiveScan(timeoutMs = 60000): Promise<void> {
  const start = Date.now();
  let recordsToScan = '1';
  while (recordsToScan !== '0') {
    if (Date.now() - start > timeoutMs) {
      console.warn('[security] timed out waiting for ZAP passive scan queue to drain');
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const status = await zapGet('/JSON/pscan/view/recordsToScan/');
    recordsToScan = status.recordsToScan;
  }
}

export async function getAlerts(baseUrl: string): Promise<any[]> {
  const { alerts } = await zapGet('/JSON/core/view/alerts/', { baseurl: baseUrl });
  return alerts;
}

const RISK_ORDER = ['High', 'Medium', 'Low', 'Informational'];

export function writeSecurityArtifacts(artifactDir: string, baseUrl: string, alerts: any[]): void {
  fs.mkdirSync(artifactDir, { recursive: true });
  fs.writeFileSync(path.join(artifactDir, 'zap-alerts.json'), JSON.stringify(alerts, null, 2));

  const bySeverity: Record<string, any[]> = {};
  for (const alert of alerts) {
    const risk = alert.risk || 'Informational';
    bySeverity[risk] = bySeverity[risk] || [];
    bySeverity[risk].push(alert);
  }

  let md = `# Security Scan Report (OWASP ZAP)\n\n`;
  md += `Target: ${baseUrl}\n\n`;
  md += `Scan type: passive (traffic captured from the existing @smoke UI run proxied through ZAP)\n\n`;
  md += `Total alerts: ${alerts.length}\n\n`;
  md += `| Risk | Count |\n|---|---|\n`;
  for (const risk of RISK_ORDER) {
    md += `| ${risk} | ${(bySeverity[risk] || []).length} |\n`;
  }

  md += `\n## Issues\n\n`;
  if (alerts.length === 0) {
    md += `No issues detected.\n`;
  }
  for (const risk of RISK_ORDER) {
    for (const alert of bySeverity[risk] || []) {
      md += `### [${risk}] ${alert.alert}\n\n`;
      md += `- **URL:** ${alert.url}\n`;
      md += `- **Description:** ${alert.description}\n`;
      md += `- **Solution:** ${alert.solution}\n`;
      md += `- **CWE ID:** ${alert.cweid}\n`;
      md += `- **Confidence:** ${alert.confidence}\n\n`;
    }
  }

  fs.writeFileSync(path.join(artifactDir, 'report.md'), md);
}
