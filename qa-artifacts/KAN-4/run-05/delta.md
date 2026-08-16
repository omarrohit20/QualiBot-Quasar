# Delta — KAN-4 run-05 vs run-04

**Previous run:** qa-artifacts/KAN-4/run-04/  
**This run:** qa-artifacts/KAN-4/run-05/  
**Date:** 2026-08-16  
**Trigger:** Full re-validation requested

---

## Jira / Figma Changes Since run-04

| Item | Change |
|------|--------|
| KAN-4 Epic | No change — same description, status "To Do", no new attachments or comments |
| KAN-5 (View Employee List) | No change — status "To Do" |
| KAN-6 (Search Employee) | No change — status "To Do" |
| KAN-7 (Add Employee) | No change — status "To Do" |
| KAN-8 (Update Employee Information) | No change — status "To Do" |
| KAN-9 (Delete Employee Record) | No change — status "To Do" |
| KAN-10 (Maintain Employee Documents) | No change — status "To Do" |
| KAN-11 (Create and Manage Custom Employee Fields) | No change — status "To Do" |
| Figma frames | None linked — parity check not applicable |

**Verdict:** No Jira or Figma changes detected since run-04. This run is a full re-validation of the same scope.

---

## test-cases.md Changes

No test case additions, removals, or modifications required — acceptance criteria unchanged.

---

## Script Changes

No script changes required — existing `spec/api/pim-employees.spec.ts` and `spec/ui/pim/*.spec.ts` cover the full scope and tags are correct from run-04.

---

## Comparison vs run-04 Results

| Category | run-04 | run-05 |
|----------|--------|--------|
| API tests | 22/22 passed | TBD — full re-run in progress |
| UI tests | 5/5 passed | TBD — full re-run in progress |
| Blockers | None | TBD |
| Go/No-Go | GO | TBD |

| API tests | 22/22 passed | 21/22 — TC-019 FAIL (PUT personal-details HTTP 500) |
| UI tests | 5/5 passed | 5/6 — TC-031 FAIL (autocomplete defect) |
| Script fixes | None | 2 targeted stale-fixture fixes (empNumber dynamic lookup; TC-031 search term) |
| Blockers | None | None |
| Go/No-Go | GO | CONDITIONAL GO |
