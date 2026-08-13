// scripts/generate-perf-report.js
//
// Converts a k6 handleSummary() JSON export into a markdown performance report.
// Usage: node scripts/generate-perf-report.js <summary.json> <outDir> [vus] [iterations]
const fs = require('fs');
const path = require('path');

function metric(data, name) {
  return data.metrics && data.metrics[name];
}

function fmtMs(value) {
  return typeof value === 'number' ? `${value.toFixed(2)} ms` : 'n/a';
}

function generate(summaryPath, outDir, vus, iterations) {
  const data = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));

  const duration = metric(data, 'http_req_duration');
  const failed = metric(data, 'http_req_failed');
  const reqs = metric(data, 'http_reqs');
  const iterationsMetric = metric(data, 'iterations');
  const checks = metric(data, 'checks');

  const totalRequests = reqs ? reqs.values.count : 0;
  const failedRate = failed ? (failed.values.rate * 100).toFixed(2) : '0.00';
  const checksPassed = checks ? checks.values.passes : 'n/a';
  const checksFailed = checks ? checks.values.fails : 'n/a';

  let md = `# Performance Scan Report (k6)\n\n`;
  md += `Profile: single-user smoke check — ${vus || 1} VU, ${iterations || 5} iterations\n\n`;
  md += `Total requests: ${totalRequests}\n`;
  md += `Total iterations: ${iterationsMetric ? iterationsMetric.values.count : 'n/a'}\n`;
  md += `Failed request rate: ${failedRate}%\n`;
  md += `Checks passed / failed: ${checksPassed} / ${checksFailed}\n\n`;

  md += `## Response time (http_req_duration)\n\n`;
  md += `| Stat | Value |\n|---|---|\n`;
  if (duration) {
    md += `| avg | ${fmtMs(duration.values.avg)} |\n`;
    md += `| min | ${fmtMs(duration.values.min)} |\n`;
    md += `| med | ${fmtMs(duration.values.med)} |\n`;
    md += `| max | ${fmtMs(duration.values.max)} |\n`;
    md += `| p(90) | ${fmtMs(duration.values['p(90)'])} |\n`;
    md += `| p(95) | ${fmtMs(duration.values['p(95)'])} |\n`;
  } else {
    md += `| n/a | n/a |\n`;
  }

  md += `\n## Thresholds\n\n`;
  if (data.root_group && data.root_group.checks) {
    md += `See checks summary above.\n`;
  }
  const thresholdFailures = [];
  for (const [name, m] of Object.entries(data.metrics || {})) {
    if (m.thresholds) {
      for (const [expr, result] of Object.entries(m.thresholds)) {
        if (result.ok === false) {
          thresholdFailures.push(`${name}: ${expr}`);
        }
      }
    }
  }
  md += thresholdFailures.length === 0
    ? 'All thresholds passed.\n'
    : thresholdFailures.map((t) => `- FAILED: ${t}`).join('\n') + '\n';

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'report.md'), md);
}

if (require.main === module) {
  const [summaryPath, outDir, vus, iterations] = process.argv.slice(2);
  if (!summaryPath || !outDir) {
    console.error('Usage: node scripts/generate-perf-report.js <summary.json> <outDir> [vus] [iterations]');
    process.exit(1);
  }
  generate(summaryPath, outDir, vus, iterations);
  console.log(`[performance] report written to ${path.join(outDir, 'report.md')}`);
}

module.exports = { generate };
