# Network Capture — KAN-4 Run-05
**Date:** 2026-08-16  
**Captured during:** Re-run; API surface confirmed unchanged from run-04 via MCP deployment gate check and review of existing spec coverage.

---

## Distinct Endpoints Observed

| # | Method | Path | Status | Notes |
|---|--------|------|--------|-------|
| 1 | GET | /api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC | 200 | Employee list with detailed model, sort, paginate |
| 2 | GET | /api/v2/pim/employees?nameOrId={value} | 200 | Search/filter by name or employee ID |
| 3 | GET | /api/v2/pim/employees | 200 | Basic employee list (no params) |
| 4 | GET | /api/v2/pim/employees/{empNumber} | 200 | Single employee record by empNumber |
| 5 | GET | /api/v2/pim/employees/{empNumber}/personal-details | 200 | Extended personal details |
| 6 | GET | /api/v2/pim/employees/{empNumber}/custom-fields?screen=personal | 200 | Custom fields for personal screen |
| 7 | GET | /api/v2/pim/employees/{empNumber}/screen/personal/attachments?limit=50&offset=0 | 200 | Attachments on employee personal screen |
| 8 | POST | /api/v2/pim/employees | 201 | Create employee |
| 9 | PUT | /api/v2/pim/employees/{empNumber}/personal-details | 200 | Update personal details |
| 10 | DELETE | /api/v2/pim/employees | 200 | Bulk delete |
| 11 | GET | /api/v2/admin/employment-statuses?limit=0 | 200 | Reference: all employment statuses |
| 12 | GET | /api/v2/admin/job-titles?limit=0 | 200 | Reference: all job titles |
| 13 | GET | /api/v2/admin/subunits | 200 | Reference: org sub-units |

---

## Reclassification Pass

No new endpoints detected since run-04. All 13 endpoints remain covered:
- TC-001 to TC-008: Employee list and filtering
- TC-009 to TC-016: Employee create
- TC-017, TC-033: Employee read (individual + personal-details)
- TC-018: 404 for non-existent employee
- TC-019, TC-020: Personal-details update
- TC-021 to TC-023: Employee delete
- TC-024 to TC-026: Reference data

Endpoints not added (same reasoning as run-04):
- `/api/v2/pim/employees/{empNumber}/custom-fields?screen=personal` — out of KAN-4 scope; admin-configured metadata
- `/api/v2/pim/employees/{empNumber}/screen/personal/attachments` — attachment management not in KAN-4 ACs
