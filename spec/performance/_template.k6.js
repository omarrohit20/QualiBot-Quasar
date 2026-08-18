// spec/performance/_template.k6.js
//
// Template for a per-module k6 performance smoke script. Copy this file to
// spec/performance/<module>.k6.js — named after the domain/module it covers
// (e.g. `pim.k6.js`, `leave.k6.js`), never after a Jira key. A module's
// performance script is a durable, shared repo asset: every Epic/Story that
// touches that module's `Type: API` @smoke endpoints extends the SAME file
// (adding a new `check()` block, commented with which ticket added it) rather
// than each ticket generating its own script. Don't run the template itself.
//
// Before writing endpoints into this script, check whether spec/performance/
// already has a script for this module — reuse/extend it if so; only create a
// new file if no existing script covers this module at all.
//
// Run as a single-user smoke check (1 VU, 5 iterations — never more, per policy):
//   BASE_URL=... AUTH_COOKIE=... K6_SUMMARY_FILE=qa-artifacts/<KEY>/nonfunctional/run-M/performance/summary.json \
//     k6 run --vus 1 --iterations 5 spec/performance/<module>.k6.js
//
// If the `k6` binary isn't installed, run it via Docker instead:
//   docker run --rm -i -e BASE_URL -e AUTH_COOKIE -e K6_SUMMARY_FILE \
//     -v "$PWD:/work" -w /work grafana/k6:latest run --vus 1 --iterations 5 \
//     spec/performance/<module>.k6.js

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
// "orangehrm"). CAPTURE IT FRESH, IMMEDIATELY BEFORE running this script — re-run
// spec/ui/auth.setup.ts right beforehand if there's any chance the session has since
// been invalidated (e.g. a later Playwright run logged in again on this shared demo,
// which invalidates the previous session token). A stale cookie here is the most
// common cause of every request in the run failing identically — check that first
// before assuming an application defect.
const AUTH_COOKIE = __ENV.AUTH_COOKIE || '';

// Some OrangeHRM endpoints (state-changing ones especially) may require a CSRF/XSRF
// token in addition to the session cookie. If `npx playwright test --grep
// network-capture` or this Epic/Story's network-capture.md shows a request header
// like `X-CSRF-TOKEN` / `X-XSRF-TOKEN` on the endpoint(s) this script hits, extract
// the matching cookie/meta value the same way AUTH_COOKIE is captured and pass it as
// AUTH_CSRF_TOKEN — don't guess the header name or assume every endpoint needs it.
const AUTH_CSRF_TOKEN = __ENV.AUTH_CSRF_TOKEN || '';

function authHeaders() {
  const headers = {
    Cookie: `orangehrm=${AUTH_COOKIE}`,
    Accept: 'application/json',
  };
  if (AUTH_CSRF_TOKEN) {
    headers['X-CSRF-TOKEN'] = AUTH_CSRF_TOKEN;
  }
  return headers;
}

// Replace the endpoint path below with the module's actual endpoint(s) under test.
export default function () {
  const res = http.get(`${BASE_URL}/web/index.php/api/v2/pim/employees`, {
    headers: authHeaders(),
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
  });

  sleep(1);
}

// Writes the full k6 summary as JSON to K6_SUMMARY_FILE so it can be turned into
// qa-artifacts/<KEY>/nonfunctional/run-M/performance/report.md via scripts/generate-perf-report.js.
export function handleSummary(data) {
  const out = {};
  out[__ENV.K6_SUMMARY_FILE || 'summary.json'] = JSON.stringify(data, null, 2);
  return out;
}
