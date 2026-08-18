# QualiBot-Quasar — Project Onboarding

This document is for someone who knows nothing about this repo yet. Read it top to bottom once and you should understand what the project is, how it's built, how to run it, and how to extend it.

---

## 1. What this project actually is

QualiBot-Quasar is **two things layered on top of each other**:

1. **A Playwright + TypeScript test automation framework** — real API and UI tests (spec files, page objects, wrapper classes, fixtures) that exercise a demo HR application ([OrangeHRM](https://opensource-demo.orangehrmlive.com/)) plus a couple of unrelated practice API targets (reqres.in, restful-booker, dotesthere).
2. **A set of AI agent definitions** ("qa-analyst" and its sibling agents) that *drive* that framework end-to-end: given nothing but a Jira Epic/Story key, they research the ticket, design test cases, write the Playwright code, run it, analyze results, and report back — across four different AI coding tools (Claude Code, Cursor, GitHub Copilot, Codex CLI), with the same behavior on all four.

If you're here to **write or debug tests by hand**, you mostly need Section 3 (architecture) and Section 5 (conventions).
If you're here to **use or extend the AI agents**, you need Section 4 (the agents) and Section 6 (workflow).
If you're here to **just get it running**, start at Section 2.

---

## 2. Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy the secrets template and fill in real values
cp .env.example .env
```

Fill in `.env`:
- `JIRA_API_TOKEN`, `FIGMA_API_TOKEN` — only needed if you're using the AI agents (Section 4). Not needed to just run existing tests.
- `DEV_APP_CREDENTIALS` / `QA_APP_CREDENTIALS` — OrangeHRM login, as JSON: `{"username":"Admin","password":"admin123"}` (already the working default credentials for the public demo site).
- `ZAP_API_URL` / `ZAP_PROXY_URL` / `K6_DOCKER_IMAGE` — only needed for non-functional checks (Section 4.6). Have working defaults already.

```bash
# 3. Run the existing tests
npm test                 # everything
npx playwright test spec/api/...   # API specs only
npx playwright test spec/ui/...    # UI specs only
npm run test:report      # open the HTML report after a run
```

See [README.md](README.md) for the full command/flag reference and [API_AUTOMATION.md](API_AUTOMATION.md) for the original API-framework write-up (older, narrower in scope than this document, but still accurate for the request-wrapper/assertion-template mechanics).

---

## 3. Architecture — what lives where

```
QualiBot-Quasar/
├── spec/
│   ├── api/                 ← API test specs (*.spec.ts)
│   ├── ui/                  ← UI test specs, one subfolder per app module
│   │   ├── auth.setup.ts    ← logs in once, saves session to playwright/.auth/admin.json
│   │   ├── pim/, leave/, admin/
│   └── performance/         ← k6 performance smoke scripts (one per module, NOT per ticket)
├── libs/
│   ├── <domain>.ts          ← one wrapper class per API domain (e.g. users.ts, pim.ts, leave.ts)
│   ├── pages/<module>/      ← Page Object Model classes for UI (e.g. pages/pim/EmployeeListPage.ts)
│   ├── fixtures/qaFixtures.ts ← shared test/expect wrapper (adds automatic accessibility scanning)
│   └── utils/               ← requests.ts, assertions.ts, common.ts, apiTracker.ts, a11yReport.ts, zapScan.ts
├── test_data/                ← JSON fixtures (request/response templates), organized by domain
├── config/
│   ├── hosts.json            ← base URLs per environment (dev/qa), keyed by API domain
│   └── qa-agent.config.json  ← settings for the AI agents (Jira/Figma config, artifact paths, quality-check config)
├── qa-artifacts/<KEY>/        ← everything the AI agents produce, per Jira key (see Section 4.4)
├── playwright.config.ts       ← THE central config: projects, workers, base URL, proxy wiring
├── global-setup.ts / global-teardown.ts
├── package.json               ← npm scripts, including the non-functional-check helpers
└── .claude/ .codex/ .cursor/ .github/   ← the four platform-specific agent definitions (Section 4)
```

### 3.1 The two test layers

- **API tests** (`spec/api/`) use Playwright's `APIRequestContext` directly — no browser. Each domain (Users, PIM/Employees, Leave, Admin/Users, Booking) has its own wrapper class in `libs/`.
- **UI tests** (`spec/ui/`) drive a real (headless) Chrome browser against the OrangeHRM demo site, using Page Object Model classes in `libs/pages/`.

### 3.2 Why only Chrome, and why 2 workers

`playwright.config.ts` defines exactly one browser project family (`chromium` for API, plus `pim-ui`/`leave-ui`/`admin-ui` UI projects, all Chrome-based) and is fixed at `workers: 2`, `fullyParallel: false`. This was a deliberate fix, not an oversight: OrangeHRM's shared public demo instance only tolerates one active Admin session at a time. Running multiple browsers (chromium/firefox/webkit) concurrently — or too many parallel workers — caused each login to invalidate the others' session, producing intermittent, environment-caused test failures that looked like application bugs. **Do not add other browser projects or raise the worker count** without understanding this history.

### 3.3 Auth flow

`spec/ui/auth.setup.ts` is a Playwright "setup" project: it logs into OrangeHRM once and saves the session (`playwright/.auth/admin.json`). The `pim-ui`/`leave-ui`/`admin-ui` projects declare `dependencies: ['auth-setup']` and reuse that saved session via `storageState`, so ordinary UI tests don't each pay the cost of a fresh login. **This is also the #1 cause of confusing failures**: if something else (another test run, a k6 script, a manual login) invalidates the session after `auth.setup.ts` ran, every UI test downstream fails identically and looks like an app bug. If you see a wall of unrelated UI failures, suspect a stale session first.

---

## 4. The AI agents — capabilities and how they fit together

Four cooperating agent roles, each defined identically across four platforms so the same request produces the same behavior everywhere:

| Platform | Where the definitions live |
|---|---|
| Claude Code | `.claude/agents/*.md` |
| Cursor | `.cursor/rules/*.mdc` |
| GitHub Copilot | `.github/agents/*.agent.md` |
| Codex CLI | `.codex/agents/*.toml` |

### 4.1 `qa-analyst` — the orchestrator

Given a Jira Epic/Story key (e.g. `KAN-4`), this is the agent you talk to. It **does not write test code itself** — it owns planning, gating, seeding, execution, analysis, and reporting, and **delegates** code-writing to the two specialist agents below. It runs a fixed **7-step functional workflow**, plus a separate, on-demand **step 8** for non-functional checks (Section 4.6).

### 4.2 `qa-test-designer` — test case design

Delegated to in step 1. Fetches ticket context (Jira/Azure DevOps), applies a full test-design checklist (happy path, negative, boundary value, edge case, integration, non-functional), and produces `qa/test-cases.md` plus `qa/test-cases.csv` (CSV for bulk import into TestRail/Zephyr/Xray/qTest). Targets a **60-70% API / 20-30% UI / 5-10% manual-E2E** test pyramid.

### 4.3 `api-automation-architect` / `ui-automation-architect` — code authors

Delegated to in step 4, for anything that touches `spec/api/`, `libs/`, `test_data/` (API) or `spec/ui/`, `libs/pages/`, `facades/`, `factories/`, `strategies/` (UI). `qa-analyst` **never writes these files itself** — every new/changed test case goes through a real delegation, so the code conventions (Section 5) stay in one place. The only exception: a single-line fix to an *existing* file during step 5's retry policy.

### 4.4 The 7-step functional workflow (what happens when you say "Run the qa-analyst agent for KAN-4")

1. **Test plan and test cases** — pulls the Epic/Story fresh from Jira **every time, including re-runs** (never reuses cached data), plus linked Figma frames; writes `test-plan.md`, delegates to `qa-test-designer`.
2. **Deployment gate + Figma parity check** — confirms the environment is up and the story's changes are actually deployed. Hard blocker if not — stops rather than fabricating results.
3. **Seed data + network capture** — scripted seeding (never manual), capturing every distinct network call made along the way into `network-capture.md`. Any endpoint discovered here that could verify a UI-only test case gets reclassified to `Type: API` immediately.
4. **Automation scripts** — delegates to the two architect agents (Section 4.3). Every test gets tagged `@smoke`/`@sanity`/`@regression` **plus `@module:<name>` and `@<JIRA-KEY>`** (so you can later run just one module's or one ticket's tests: `--grep @module:leave`, `--grep @KAN-13`).
5. **Test execution** — runs **only** impacted tests, **as two separate CLI commands** (API, then UI — never mixed in one invocation), headless, Chrome-only, 2 workers. One retry allowed on failure; a login/session-expiry failure gets one relogin-and-retry (separately from that budget). Re-runs always execute the **full impacted scope**, not a diff.
6. **Report analysis** — classifies each failure as an automation defect vs. a genuine application behavior deviation.
7. **Reporting** — writes `report.md` + `execution-summary.md` (functional results only — both re-read from disk to confirm they actually persisted before the run is declared done) and drafts Jira bugs for genuine failures **without filing them** — it asks for confirmation, re-confirms each one still reproduces, then files only approved ones.

### 4.5 Where it all gets written — `qa-artifacts/<KEY>/`

```
qa-artifacts/<KEY>/
  latest.md              ← pointer to current functional run + history table
  run-01/, run-02/, ...   ← one immutable folder per invocation (never overwritten)
    test-plan.md, test-cases.md, test-cases.csv
    network-capture.md, script-changes.md
    report.md, execution-summary.md, jira-bug-drafts.md
    delta.md              ← re-runs only: what changed vs. the previous run
  nonfunctional/          ← step 8's completely separate tree (Section 4.6)
```

**Runs are immutable** — a new invocation always creates the next `run-N/`, never edits a previous one.

### 4.6 Step 8 — non-functional checks (accessibility, security, performance)

This is **not part of the 7-step run** — it never triggers automatically. You ask for it explicitly, against a story that already has `@smoke` coverage from a prior functional run:

> Run the qa-analyst non-functional agent for KAN-4

It reuses the *existing* `@smoke` tests (filtered to that story via its `@<KEY>` tag) — no new test files — and writes to its own independently-numbered `qa-artifacts/<KEY>/nonfunctional/run-<M>/` tree:
- **Accessibility (axe-core)** — automatic scan on every UI test's final page state that the invoking command actually runs (scoped to `@smoke` by the command's own `--grep`, not by any tag check in the fixture — see 4.6.1).
- **Security (OWASP ZAP)** — passive scan of the same tests' proxied traffic (API and UI).
- **Performance (k6)** — single-user, 5-iteration smoke check (never a load test) against a **module-named** script (`spec/performance/<module>.k6.js` — e.g. `pim.k6.js`, never named after a Jira key; extended in place as more stories touch that module).

Local one-time setup required for this to actually run instead of skipping: Docker Desktop running, then `npm run zap:start` and `npm run perf:pull-image`. See README's [Setup](README.md#setup) step 5 for exact commands.

### 4.6.1 How the accessibility scan actually works, code-wise

No separate a11y test suite exists — the scan is piggybacked onto the existing `@smoke` tests via an auto-fixture. Three files are involved:

1. **[libs/fixtures/qaFixtures.ts](libs/fixtures/qaFixtures.ts)** — defines an `autoA11yScan` fixture with `{ auto: true }`, meaning it attaches to *every* test with no per-test opt-in. It runs its logic **after** the test body finishes, and is a no-op unless both are true:
   - `A11Y_ARTIFACT_DIR` env var is set (this is the on/off switch)
   - the page is still open
   Note there's **no `@smoke` (or any other) tag check inside the fixture itself**. It scans whatever test just ran, unconditionally. Tag-based scoping happens one layer up, at the command line: `npm run test:a11y` (and the agent's step 8) invoke Playwright with `--grep @smoke`, so only `@smoke`-tagged tests actually execute — and therefore only those get scanned. Point the same fixture at a different `--grep` (e.g. `--grep @KAN-4`) and it scans that selection instead, no code change required.
   When the fixture fires, it runs `new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()` and writes one JSON file per test (test name, spec file, URL, tags, violations) into `A11Y_ARTIFACT_DIR`. A scan failure is caught and logged, never fails the test itself.
2. **Spec files opt in just by their import** — every file under `spec/ui/**` (e.g. [spec/ui/pim/employee-list.spec.ts](spec/ui/pim/employee-list.spec.ts)) imports `test`/`expect` from `qaFixtures` instead of `@playwright/test` directly. That one import is what wires the fixture in; any test in that file that the invoking command actually runs is scanned automatically, with zero test-level code.
3. **[libs/utils/a11yReport.ts](libs/utils/a11yReport.ts)** — its `generateA11yReport()` function is called from `global-teardown.ts` once the whole Playwright run finishes. It reads back every per-test JSON file written in step 1, tallies violations by impact (critical/serious/moderate/minor), and writes the aggregated `accessibility/report.md`.

So which tests get scanned is controlled entirely by the command's own `--grep`/tag selection plus the `A11Y_ARTIFACT_DIR` env var — not by any tag hardcoded in the fixture.

---

## 5. Code conventions — follow these exactly, don't invent alternatives

### 5.1 API wrapper class (`libs/<domain>.ts`)

- One class per API domain. Constructor takes optional `APIRequestContext` + `baseUrl`; if no context given, lazily creates one (`this.contextReady = this.initContext()`).
- Every public method starts with `await this.ensureContext()`.
- Base URLs come from `config/hosts.json`, keyed by `process.env.ENV || 'dev'`.
- Uses `libs/utils/requests.ts` (`sendGetRequest`, `sendPostRequest`, etc.) rather than calling `context.fetch` directly.
- Fixtures (request/response JSON templates) live in `test_data/<domain>/`, loaded via `readTestDataJson()` from `libs/utils/common.ts`.
- Assertions go through `libs/utils/assertions.ts`'s template system (`verifyResponseTemplate`) — special template values like `"skip"`, `"should_not_be_null"`, `"only_chars"`, `"match_regex:/.../"` let you assert structure without hardcoding every field.

### 5.2 UI Page Object Model (`libs/pages/<module>/`)

- One class per file, one page per class, constructor takes `Page`.
- Methods are `async`, one action or one assertion each, named for user intent (`searchByName`, `verifyTableHeaders`) not for the locator used.
- Prefer `getByRole`/`getByLabel`/`data-testid` over brittle CSS/XPath.
- UI specs import `test`/`expect` from `libs/fixtures/qaFixtures` (not directly from `@playwright/test`) — that's what wires in the automatic accessibility scan.

### 5.3 Tagging (mandatory on every automated test)

Every `test(...)` needs at least one tier tag, plus a module tag and a Jira-key tag:

```ts
test('searches leave requests by date range',
  { tag: ['@smoke', '@regression', '@module:leave', '@KAN-13'] },
  async ({ page }) => { ... }
);
```

- `@smoke` — minimal fast-fail set (core CRUD/auth/critical-path only)
- `@sanity` — this story's specific changes
- `@regression` — full impacted set, run every time
- `@module:<name>` — lets you run one module's tests (`--grep @module:pim`)
- `@<JIRA-KEY>` — lets you run one story's tests (`--grep @KAN-4`)

### 5.4 Execution rules baked into the workflow (don't fight these)

- API and UI specs **always run as two separate `npx playwright test` commands** — never pass `spec/api/...` and `spec/ui/...` paths in the same invocation.
- Never override `--workers` above the config's `2`, never target a non-Chrome `--project`.
- Everything runs **headless** — never `--headed`.

---

## 5.5 Running any of the five checks directly, no agent involved

Everything in Section 4 describes what `qa-analyst` does for you. Every category it runs can also be invoked straight from the terminal — useful for local debugging or CI, no Jira key needed. All of them accept the same `--grep` tag scoping described in Section 5.3 (`@smoke`/`@sanity`/`@regression`, `@module:<name>`, `@<JIRA-KEY>` — combine with `.*` in the regex, e.g. `"@smoke.*@KAN-4"`):

| Check | Everything | Tag-scoped example |
|---|---|---|
| API tests | `npm run test:api` | `npx playwright test spec/api --grep "@smoke.*@KAN-4"` |
| UI tests | `npm run test:ui-specs` (**not** `npm run test:ui`, which is Playwright's own interactive UI mode) | `npx playwright test spec/ui --grep @module:leave` |
| Accessibility | `npm run test:a11y` — no setup needed, always works | `A11Y_ARTIFACT_DIR=... npx playwright test --grep "@smoke.*@KAN-4" --project=pim-ui --project=leave-ui --project=admin-ui` |
| Security | `npm run zap:start` once, then `npm run test:security` | same idea, with `RUN_SECURITY_SCAN=true SECURITY_ARTIFACT_DIR=...` and a `--grep` filter, run for API then UI |
| Performance | `npm run perf:pull-image` once, then `k6 run --vus 1 --iterations 5 spec/performance/<module>.k6.js` with `BASE_URL`/`AUTH_COOKIE`/`K6_SUMMARY_FILE` | not tag-scoped — pick the module's script instead (one script per module, not per tag) |

Full detail, exact commands/env vars, and output paths: see [README.md § Running tests directly](README.md#running-tests-directly-no-agent-involved).

---

## 6. Typical workflows — where to start for common tasks

| I want to... | Do this |
|---|---|
| Run existing tests | `npm test` (everything), or `npm run test:api` / `npm run test:ui-specs` (see Section 2 and 5.5) |
| Add a test to an existing domain by hand | Follow Section 5's conventions directly, or ask `api-automation-architect`/`ui-automation-architect` to do it |
| QA an entire Jira Epic/Story end-to-end, hands-off | Ask `qa-analyst`: "Run the qa-analyst agent for KAN-4" |
| Get non-functional coverage for a story already tested | "Run the qa-analyst non-functional agent for KAN-4" (needs Section 4.6's one-time Docker/ZAP/k6 setup) |
| Check what a prior run found | Read `qa-artifacts/<KEY>/latest.md` → linked `run-N/report.md` |
| Understand exact agent behavior/rules | Read `.claude/agents/qa-analyst.md` (all four platform files are kept identical) |
| Understand full setup/config options | [README.md](README.md) — the canonical reference for setup, platform invocation mechanics, and every artifact file's purpose |

---

## 7. Things that look like bugs but usually aren't

- **A wall of UI test failures, all at once, no clear pattern** → suspect a stale/invalidated session (Section 3.3), not an application regression.
- **A k6 performance check reports 100% request failure** → suspect a stale `AUTH_COOKIE` captured before a later login invalidated it, not a real performance regression. Re-capture the session immediately before running k6.
- **Accessibility/security/performance results are missing from a functional run's `report.md`** → that's correct, not a bug. Those live only in step 8's separate report (Section 4.6); the 7-step functional run never includes them.
- **A re-run's `run-N/` folder looks the same as the last one** → it shouldn't — every re-run gets the next unused `run-N/`, and prior folders are never edited. If you see this, something skipped the "resolve next run number" step and it's worth flagging.

---

## 8. Where to go deeper

- [README.md](README.md) — the complete, exhaustive reference (setup, every artifact file, platform-by-platform invocation, Jira bug filing, notes/gotchas list).
- [API_AUTOMATION.md](API_AUTOMATION.md) — narrower, older write-up of the original API framework mechanics (still accurate for request/assertion helpers).
- `.claude/agents/*.md` — the actual, authoritative agent behavior specs. When in doubt about what an agent will do, read these, not this document (this document is a map; those files are the territory).
