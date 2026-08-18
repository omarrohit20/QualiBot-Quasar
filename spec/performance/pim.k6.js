// spec/performance/pim.k6.js
//
// PIM (Employee Management) module performance smoke check.
// Single-user, 5 iterations — shared across every Epic/Story that touches this
// module's `Type: API` @smoke endpoints; extend this file when a new story adds
// coverage rather than creating a per-story script. Endpoints added so far:
//   KAN-4: GET /api/v2/pim/employees (employee list, default params)
//   KAN-4: GET /api/v2/pim/employees/jobTitles (reference data — job titles)
//   KAN-4: GET /api/v2/pim/employees/empStatuses (reference data — employment statuses)
//   KAN-4: GET /api/v2/pim/subunit (reference data — subunits)
//
// Run via Docker (k6 binary not installed in this environment):
//   docker run --rm -i -e BASE_URL -e AUTH_COOKIE -e AUTH_CSRF_TOKEN -e K6_SUMMARY_FILE \
//     -v "$PWD:/work" -w /work grafana/k6:latest run --vus 1 --iterations 5 \
//     spec/performance/pim.k6.js

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  iterations: 5,
  thresholds: {
    http_req_failed: ['rate==0'],
    http_req_duration: ['p(95)<2000'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://opensource-demo.orangehrmlive.com';

// Capture AUTH_COOKIE fresh, immediately before running this script (re-run
// spec/ui/auth.setup.ts right beforehand) — a stale session cookie, invalidated by
// a later login on this shared demo, is the most common cause of every request in
// the run failing identically. If requests still fail after confirming the cookie
// is fresh, check network-capture.md for a required CSRF header (e.g. X-CSRF-TOKEN)
// on these endpoints and pass its value as AUTH_CSRF_TOKEN below before concluding
// it's an application defect.
const AUTH_COOKIE = __ENV.AUTH_COOKIE || '';
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

export default function () {
  const headers = authHeaders();

  // KAN-4: GET employee list
  const listRes = http.get(`${BASE_URL}/web/index.php/api/v2/pim/employees?limit=50&offset=0`, { headers });
  check(listRes, {
    'GET /pim/employees status 200': (r) => r.status === 200,
    'GET /pim/employees response < 2000ms': (r) => r.timings.duration < 2000,
    'GET /pim/employees has data': (r) => {
      try { return JSON.parse(r.body).data !== undefined; } catch { return false; }
    },
  });

  // KAN-4: GET job titles reference data
  const jobTitlesRes = http.get(`${BASE_URL}/web/index.php/api/v2/admin/jobTitles?limit=0`, { headers });
  check(jobTitlesRes, {
    'GET /jobTitles status 200': (r) => r.status === 200,
    'GET /jobTitles response < 2000ms': (r) => r.timings.duration < 2000,
  });

  // KAN-4: GET employment statuses reference data
  const empStatusesRes = http.get(`${BASE_URL}/web/index.php/api/v2/admin/employmentStatuses?limit=0`, { headers });
  check(empStatusesRes, {
    'GET /employmentStatuses status 200': (r) => r.status === 200,
    'GET /employmentStatuses response < 2000ms': (r) => r.timings.duration < 2000,
  });

  // KAN-4: GET subunits reference data
  const subunitsRes = http.get(`${BASE_URL}/web/index.php/api/v2/admin/subunits`, { headers });
  check(subunitsRes, {
    'GET /subunits status 200': (r) => r.status === 200,
    'GET /subunits response < 2000ms': (r) => r.timings.duration < 2000,
  });

  sleep(1);
}

export function handleSummary(data) {
  const out = {};
  out[__ENV.K6_SUMMARY_FILE || 'summary.json'] = JSON.stringify(data, null, 2);
  return out;
}
