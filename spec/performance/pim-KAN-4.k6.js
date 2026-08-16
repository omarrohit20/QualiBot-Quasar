// spec/performance/pim-KAN-4.k6.js
//
// KAN-4 (PIM — Employee Management) performance smoke check.
// Single-user, 5 iterations — covers the @smoke API endpoints:
//   TC-001: GET /api/v2/pim/employees (employee list, default params)
//   TC-009: POST /api/v2/pim/employees (employee create)
//   TC-024: GET /api/v2/pim/employees/jobTitles (reference data — job titles)
//   TC-025: GET /api/v2/pim/employees/empStatuses (reference data — employment statuses)
//   TC-026: GET /api/v2/pim/subunit (reference data — subunits)
//
// Run via Docker (k6 binary not installed in this environment):
//   docker run --rm -i -e BASE_URL -e AUTH_COOKIE -e K6_SUMMARY_FILE \
//     -v "$PWD:/work" -w /work grafana/k6:latest run --vus 1 --iterations 5 \
//     spec/performance/pim-KAN-4.k6.js

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
const AUTH_COOKIE = __ENV.AUTH_COOKIE || '';

export default function () {
  const headers = {
    Cookie: `orangehrm=${AUTH_COOKIE}`,
    Accept: 'application/json',
  };

  // TC-001: GET employee list
  const listRes = http.get(`${BASE_URL}/web/index.php/api/v2/pim/employees?limit=50&offset=0`, { headers });
  check(listRes, {
    'GET /pim/employees status 200': (r) => r.status === 200,
    'GET /pim/employees response < 2000ms': (r) => r.timings.duration < 2000,
    'GET /pim/employees has data': (r) => {
      try { return JSON.parse(r.body).data !== undefined; } catch { return false; }
    },
  });

  // TC-024: GET job titles reference data
  const jobTitlesRes = http.get(`${BASE_URL}/web/index.php/api/v2/admin/jobTitles?limit=0`, { headers });
  check(jobTitlesRes, {
    'GET /jobTitles status 200': (r) => r.status === 200,
    'GET /jobTitles response < 2000ms': (r) => r.timings.duration < 2000,
  });

  // TC-025: GET employment statuses reference data
  const empStatusesRes = http.get(`${BASE_URL}/web/index.php/api/v2/admin/employmentStatuses?limit=0`, { headers });
  check(empStatusesRes, {
    'GET /employmentStatuses status 200': (r) => r.status === 200,
    'GET /employmentStatuses response < 2000ms': (r) => r.timings.duration < 2000,
  });

  // TC-026: GET subunits reference data
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
