# Performance Scan Report (k6)

Profile: single-user smoke check — 1 VU, 5 iterations

Total requests: 20
Total iterations: 5
Failed request rate: 100.00%
Checks passed / failed: 20 / 25

## Response time (http_req_duration)

| Stat | Value |
|---|---|
| avg | 301.79 ms |
| min | 259.90 ms |
| med | 280.08 ms |
| max | 451.25 ms |
| p(90) | 356.94 ms |
| p(95) | 393.93 ms |

## Thresholds

See checks summary above.
- FAILED: http_req_failed: rate==0
