# Test Plan — KAN-4: Employee Information Management
**Run:** run-05 | **Date:** 2026-08-16  
**Environment:** QA — https://opensource-demo.orangehrmlive.com/ (OrangeHRM OS 5.9)  
**Analyst:** qa-analyst agent  

---

## Scope

**Epic:** KAN-4 — Employee Information Management  
**Stories covered:**
- KAN-5: User Story 1 — View Employee List  
- KAN-6: User Story 2 — Search Employee  
- KAN-7: User Story 3 — Add Employee  
- KAN-8: User Story 4 — Update Employee Information  
- KAN-9: User Story 5 — Delete Employee Record  
- KAN-10: User Story 6 — Maintain Employee Documents (document upload/view) — currently "To Do"; UI upload/download tested manually only  
- KAN-11: User Story 7 — Create and Manage Custom Employee Fields — currently "To Do"; not yet implemented in live app; out of automated scope  

**In scope:**
- Employee list retrieval, pagination, and filtering (name/ID, employment status, job title, sub-unit)
- Employee create (required fields, optional fields, validation, boundaries, duplicates)
- Employee read by empNumber (positive and negative)
- Employee personal-details read and update (PUT)
- Employee delete (single and bulk)
- Reference data: job titles, employment statuses, sub-units
- UI: Add Employee form (render, validation, submit), Employee List table (render, search)

**Out of scope:**
- KAN-10 document upload automation (file upload dialog — manual only)
- KAN-11 custom fields (feature not yet deployed)
- Leave, admin user, booking modules (different Epic)
- Non-functional checks (accessibility, security, performance) — separate Step 8 run

---

## Environments

| Env | App URL | Credentials |
|-----|---------|-------------|
| QA | https://opensource-demo.orangehrmlive.com/ | Admin / admin123 |

---

## Entry Criteria

- OrangeHRM OS 5.9 accessible and PIM module rendering ✓
- Auth setup runs cleanly (playwright/.auth/admin.json) ✓
- All scripts compile with no TypeScript errors ✓

## Exit Criteria

- All 31 automated test cases pass (or failures are root-caused)
- 1 manual E2E test (TC-032) documented as "not automated by design"
- No P1/critical regression in core employee CRUD or search

---

## Risk Areas

1. Shared demo environment — other users may mutate employee data between test runs (mitigated: tests create/cleanup their own employees where possible, use well-known seed records for read-only tests)
2. OrangeHRM returns 422 (not 404) for non-existent records — spec accommodates both
3. employeeId field length limit (short alphanumeric IDs used to avoid 422s on create)

---

## Test Pyramid Mix

| Layer | Count | % |
|-------|-------|---|
| API   | 23    | 72% |
| UI    | 6     | 19% |
| Manual E2E | 1 | 3% |
| Reference-data API (UI-backed discovery) | 2 | 6% |
| **Total** | **32** | |

Target bands: 60-70% API / 20-30% UI / 5-10% Manual. API is 72% (slight overshoot acceptable — heavily API-driven CRUD domain with no Figma design constraints).

---

## Per-Story Summary

### KAN-5: View Employee List
Tests that the employee list API returns paginated results with correct structure, and the UI table renders with expected columns and data.

### KAN-6: Search Employee
Tests filtering by name/ID, employment status, job title, sub-unit, and zero-result case at the API layer; UI search form filter at the UI layer.

### KAN-7: Add Employee
Tests happy-path creation, optional fields, validation errors (missing required), boundary values (100-char firstName, 101-char), special characters, and duplicate employeeId at API; UI add-employee form render, validation, and successful submit.

### KAN-8: Update Employee Information
Tests PUT personal-details with update and verify-via-GET, and empty-firstName validation error at API.

### KAN-9: Delete Employee Record
Tests single delete + 404 verification, bulk delete, and non-existent ID error at API.

### KAN-10 / KAN-11 (deferred)
Not yet deployed or not automatable via headless browser; covered manually or excluded pending deployment.
