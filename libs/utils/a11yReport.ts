// libs/utils/a11yReport.ts
// Aggregates the per-test JSON files written by libs/fixtures/qaFixtures.ts's
// auto-scan fixture into one accessibility report for the run.
import * as fs from 'fs';
import * as path from 'path';

const IMPACTS = ['critical', 'serious', 'moderate', 'minor'];

export function generateA11yReport(artifactDir: string): void {
  const files = fs.existsSync(artifactDir)
    ? fs.readdirSync(artifactDir).filter((f) => f.endsWith('.json'))
    : [];

  const impactCounts: Record<string, number> = {};
  let totalViolations = 0;
  const sections: string[] = [];

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(artifactDir, file), 'utf-8'));
    totalViolations += data.violations.length;

    let section = `## ${data.test}\n\n- URL: ${data.url}\n- Violations: ${data.violations.length}\n\n`;
    for (const violation of data.violations) {
      impactCounts[violation.impact] = (impactCounts[violation.impact] || 0) + 1;
      section += `### [${violation.impact}] ${violation.id} — ${violation.help}\n\n`;
      section += `- **Description:** ${violation.description}\n`;
      section += `- **Help:** ${violation.helpUrl}\n`;
      section += `- **Affected nodes:** ${violation.nodes.length}\n`;
      for (const node of violation.nodes.slice(0, 5)) {
        section += `  - \`${node.target.join(' ')}\`\n`;
      }
      section += `\n`;
    }
    sections.push(section);
  }

  let md = `# Accessibility Scan Report (axe-core)\n\n`;
  md += `Smoke tests scanned: ${files.length}\n\n`;
  md += `Total violations: ${totalViolations}\n\n`;
  md += `| Impact | Count |\n|---|---|\n`;
  for (const impact of IMPACTS) {
    md += `| ${impact} | ${impactCounts[impact] || 0} |\n`;
  }
  md += `\n## Issues by test\n\n`;
  md += files.length === 0 ? 'No @smoke tests were scanned this run.\n' : sections.join('\n');

  fs.writeFileSync(path.join(artifactDir, 'report.md'), md);
}
