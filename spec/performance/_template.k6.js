// spec/performance/_template.k6.js
//
// Template for per-Epic/Story k6 performance smoke scripts. Copy this file to
// spec/performance/<module>-<KEY>.k6.js and fill in the endpoint(s) under test —
// don't run the template itself. Targets the same API endpoints already covered
// by this Epic/Story's @smoke API tests (see qa-artifacts/<KEY>/run-N/test-cases.md
// and network-capture.md) so performance checks stay tied to real, already-verified
// functional coverage rather than inventing new scenarios.
//
// Run as a single-user smoke check (1 VU, 5 iterations — never more, per policy):
//   BASE_URL=... AUTH_COOKIE=... K6_SUMMARY_FILE=qa-artifacts/<KEY>/run-N/performance/summary.json \
//     k6 run --vus 1 --iterations 5 spec/performance/<module>-<KEY>.k6.js
//
// If the `k6` binary isn't installed, run it via Docker instead:
//   docker run --rm -i -e BASE_URL -e AUTH_COOKIE -e K6_SUMMARY_FILE \
//     -v "$PWD:/work" -w /work grafana/k6:latest run --vus 1 --iterations 5 \
//     spec/performance/<module>-<KEY>.k6.js

import http from 'k6/http';
import { check, sleep } from 'k6';

// Never override these from the CLI for this workflow — single-user smoke check only.
export const options = {
  vus: 1,
  iterations: 5,
  thresholds: {
    http_req_failed: ['rate==0'],
    http_req_duration: ['p(95)<2000'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://opensource-demo.orangehrmlive.com';

// OrangeHRM session cookie captured from playwright/.auth/admin.json (cookie name
// "orangehrm") — extract its value and pass it in as AUTH_COOKIE. Replace the
// endpoint path below with the Epic/Story's actual endpoint(s) under test.
export default function () {
  const res = http.get(`${BASE_URL}/web/index.php/api/v2/pim/employees`, {
    headers: {
      Cookie: `orangehrm=${__ENV.AUTH_COOKIE || ''}`,
    },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
  });

  sleep(1);
}

// Writes the full k6 summary as JSON to K6_SUMMARY_FILE so it can be turned into
// qa-artifacts/<KEY>/run-N/performance/report.md via scripts/generate-perf-report.js.
export function handleSummary(data) {
  const out = {};
  out[__ENV.K6_SUMMARY_FILE || 'summary.json'] = JSON.stringify(data, null, 2);
  return out;
}
