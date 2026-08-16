# Script Changes — KAN-4 Run-05
**Date:** 2026-08-16  
**Run:** run-05

---

## Summary

No script changes required for this run. All automation scripts were created/validated in run-04 and remain correct for the current Epic scope (no Jira AC changes, no new endpoints discovered).

## Files Changed This Run (stale-fixture fixes, retry-policy exception)

| File | Change | Tags | Author | Notes |
|------|--------|------|--------|-------|
| spec/api/pim-employees.spec.ts | Added `seedEmpNumber` var + dynamic resolution in beforeAll; updated TC-017, TC-033, TC-019 to use dynamic empNumber instead of hardcoded `3` | @smoke, @sanity, @regression, @module:pim, @KAN-4 | qa-analyst (targeted stale-fixture fix) | empNumber=3 no longer exists on shared demo |
| spec/ui/pim/employee-list.spec.ts | Updated TC-031 search term from hardcoded "Ranga" to dynamically extracted first employee name from rendered table | @sanity, @regression, @module:pim, @KAN-4 | qa-analyst (targeted stale-fixture fix) | TC-031 still fails — underlying autocomplete automation defect in EmployeeListPage.searchByName |

## Files in Scope (unchanged)

| File | Status | Tags | Author | Notes |
|------|--------|------|--------|-------|
| spec/api/pim-employees.spec.ts | Unchanged | @smoke, @sanity, @regression, @module:pim, @KAN-4 | api-automation-architect (run-04) | 23 API test cases covering TC-001 to TC-033 |
| spec/ui/pim/add-employee.spec.ts | Unchanged | @smoke, @sanity, @regression, @module:pim, @KAN-4 | ui-automation-architect (run-04) | TC-027, TC-028, TC-029 |
| spec/ui/pim/employee-list.spec.ts | Unchanged | @smoke, @sanity, @regression, @module:pim, @KAN-4 | ui-automation-architect (run-04) | TC-030, TC-031 |
| libs/pim.ts | Unchanged | N/A | api-automation-architect (run-04) | PIM wrapper class |
| libs/utils/assertions.ts | Unchanged | N/A | api-automation-architect (run-04) | verifyResponseCode, verifyResponseTemplate |
