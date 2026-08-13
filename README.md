# QualiBot-Quasar : QA Analyst and Architect Agent

An end-to-end QA analyst and Agent for this repo. Give it a Jira Epic or Story key and it plans, seeds, automates, executes, and reports on testing for that Epic/Story. The same workflow is defined **once per platform** so it works the same way regardless of which agent runner you use:

| Platform | Agent definitions |
|---|---|
| **Claude Code** | [.claude/agents/qa-analyst.md](.claude/agents/qa-analyst.md), [qa-test-designer.md](.claude/agents/qa-test-designer.md), [api-automation-architect.md](.claude/agents/api-automation-architect.md), [ui-automation-architect.md](.claude/agents/ui-automation-architect.md) |
| **Cursor** | [.cursor/rules/qa-analyst.mdc](.cursor/rules/qa-analyst.mdc), [qa-test-designer.mdc](.cursor/rules/qa-test-designer.mdc), [api-automation-architect.mdc](.cursor/rules/api-automation-architect.mdc), [ui-automation-architect.mdc](.cursor/rules/ui-automation-architect.mdc) |
| **GitHub Copilot** | [.github/agents/qa-analyst.agent.md](.github/agents/qa-analyst.agent.md), [qa-test-designer.agent.md](.github/agents/qa-test-designer.agent.md), [api-automation-architect.agent.md](.github/agents/api-automation-architect.agent.md), [ui-automation-architect.agent.md](.github/agents/ui-automation-architect.agent.md) |
| **Codex CLI** | [.codex/agents/qa-analyst.toml](.codex/agents/qa-analyst.toml), [qa-test-designer.toml](.codex/agents/qa-test-designer.toml), [api-automation-architect.toml](.codex/agents/api-automation-architect.toml), [ui-automation-architect.toml](.codex/agents/ui-automation-architect.toml) |

All four files per platform describe the same workflow — keep them in sync by hand if you edit one; there's no build step that generates one from another. See [Platform support](#platform-support) below for how each one is invoked and any platform-specific setup (including MCP server restarts).

It owns test-plan authoring, planning orchestration, the deployment gate, seeding, test execution, result analysis, and reporting itself, but **delegates test case design** (step 1) and **script authoring** (step 4) to specialized sibling agents rather than reimplementing their depth:

- **qa-test-designer** — QA test case design agent. Applies the full design-technique checklist (happy path, negative, boundary value, edge case, integration, non-functional) with AC-coverage traceability, and produces `qa/test-cases.md`.
- **api-automation-architect** — API wrapper-class + JSON-fixture + template-assertion pattern (`spec/api/`, `libs/`, `test_data/`).
- **ui-automation-architect** — Page Object Model, Data Factory, Builder, Facade, and Strategy patterns for browser-driven specs.

On Claude Code, qa-analyst invokes these via the Agent tool. Cursor and GitHub Copilot have no equivalent subagent-invocation tool, so their qa-analyst definitions delegate by handing off to the named sibling rule/agent directly (`@qa-test-designer`, `@api-automation-architect`, `@ui-automation-architect` in Cursor; the named agent in Copilot) — same division of responsibility, different mechanics. Either way, each pattern's/discipline's rules live in one place instead of being duplicated across agent definitions. For step 1, qa-analyst writes `test-plan.md` itself, pulls Figma frames itself (qa-test-designer doesn't), and folds qa-test-designer's `qa/test-cases.md` output into its own `qa-artifacts/<KEY>/test-cases.md`.

**There's no "gap-fill" exception to delegation.** qa-analyst never writes or edits files under `spec/api/`, `libs/`, `test_data/` (API) or `spec/ui/`, `libs/pages/`, `facades/`, `factories/`, `strategies/` (UI) itself — every new or changed test case in those paths goes through an actual Agent tool call to `api-automation-architect` or `ui-automation-architect`, even ones that look like a small follow-up to something already scaffolded. `script-changes.md`'s Author column should only ever say `qa-analyst` for a step 5 one-line fix to an existing automation defect — never for new test coverage. (This was previously a real gap: a run's log showed spec files authored directly by qa-analyst as a "gap-fill," which is exactly the pattern this rule now blocks.)

## Test pyramid

qa-analyst steers every Epic/Story's test-case mix toward **60-70% API, 20-30% UI, 5-10% manual-only E2E**. Backend-verifiable behavior goes to the API layer (including endpoints discovered only via network-call capture, see step 3), the UI layer is reserved for what can only be checked by rendering/interacting, and a small slice of high-value cross-system journeys stay manual by design — never automated. The achieved mix is reported in `test-plan.md` and the final report; if an Epic genuinely can't hit this ratio (e.g. UI-only, no API surface), the agent says so instead of forcing test cases into the wrong layer.

**Every automated test — API or UI — is tagged `@smoke`, `@sanity`, and/or `@regression`.** Tags are applied at authoring time (step 4) via Playwright's native tag syntax (`test('...', { tag: ['@smoke', '@regression'] }, ...)`) so runs can select by tier with `--grep`: `@smoke` is the minimal fast-fail set proving the build isn't broken, `@sanity` targets just this Epic/Story's changes, `@regression` is the full impacted set run every time. An automated test with no tag is treated as an incomplete delegation, same severity as a missing script — `script-changes.md`'s Tags column is checked for this on every run.

**Every automated test is also tagged with its module and its Jira key.** `@module:<module-name>` (e.g. `@module:leave`, derived from the spec's directory under `spec/api/`/`spec/ui/`) and `@<JIRA-KEY>` (e.g. `@KAN-13`) let you run a specific module or a specific ticket's tests in isolation later — `npx playwright test --grep @module:leave` or `--grep @KAN-13` — independent of the tier tags above. Example: `test('...', { tag: ['@smoke', '@regression', '@module:leave', '@KAN-13'] }, ...)`. Missing either tag is the same class of defect as a missing tier tag.

**Network-discovered API endpoints must be acted on the same run they're found, not deferred.** Test cases get typed in step 1, before network capture happens in step 3 — so step 3 includes a mandatory reclassification pass: any endpoint captured during seeding that verifies a currently UI-only test case gets a real `Type: API` test case added right then, and step 4 must actually produce its `api-automation-architect` script this run. "Documented for future API test expansion" is treated as a failed run, not a valid outcome — every skipped endpoint needs its own specific reason (e.g. unsafe to exercise against shared demo data), not a blanket deferral.

## What it does

Given a Jira Epic/Story key (e.g. `PROJ-1234`), it runs seven steps in order — plus two quality sub-steps (5b, 5c) folded in right after execution:

1. **Test plan and test cases** — resolves which run folder this is (first run or a re-run, see Artifacts below), **always pulls fresh from Jira on every run — including re-runs of the same key** (never reuses a prior run's fetched data, since the whole point of a re-run is to catch ticket changes since last time), fetching the Epic and every linked Story, Task, and Sub-task, plus linked Figma frames; writes `test-plan.md` itself (including the test-pyramid mix), and delegates test case design to `qa-test-designer` (targeting that mix), folding its output into `test-cases.md`.
2. **Deployment gate + Figma parity check** — confirms the target environment is up and the Epic/Story's changes are actually deployed there; if Figma frames were linked, also compares the live app against them and logs discrepancies. If the env is down or changes are missing, it **stops and reports a blocker** instead of continuing.
3. **Seed data + network capture** — ensures API and UI seed data is scripted (not manual), extending existing seed scripts where possible; all seeding runs **headless**, for both API and UI — no visible browser. While seeding, captures every distinct network call the app makes into `network-capture.md`, then immediately cross-checks captured endpoints against `test-cases.md` and adds/converts `Type: API` test cases for anything a UI-only case could equally be verified through — this happens before moving on, not left as a note for later.
4. **Automation scripts** — delegates to `api-automation-architect` (using captured network shapes for API test cases, including endpoints not explicitly named in the ticket) and `ui-automation-architect` (see above) to create/update Playwright API and UI scripts, following this repo's existing conventions (or any `.cursor/rules` / Copilot instructions present, which take precedence) rather than inventing new patterns. Any `Type: API` case step 3 just added gets its script written in this same step — not deferred, and always via a real delegation to `api-automation-architect`, never authored directly. Every test is tagged `@smoke`/`@sanity`/`@regression` **plus `@module:<name>` and `@<JIRA-KEY>`** at this point, API and UI alike.
5. **Test execution** — runs **only** the tests impacted by the Epic/Story, as **two separate CLI invocations — one for API specs, one for UI specs, never mixed into a single command, no matter how many files are impacted on either side** — always **headless** (no `--headed`, for API and UI alike), **on Chrome only, fixed at 2 workers** (never other browser projects) — never the full suite or unrelated pre-existing specs. Uses the smoke/sanity/regression tags to scope runs (`--grep @smoke` as a fast-fail gate before the full run, `--grep @regression` for the full impacted set), plus the `@module:*`/`@<JIRA-KEY>` tags to scope by module or ticket, in addition to path-based impacted-scope filtering. On a re-run, the **full impacted scope is executed again from scratch**, not just what changed since last time. Failing tests get **at most one retry**; it does not loop trying fixes indefinitely — if a failure survives one retry and one considered fix attempt, it's carried into analysis as a possible genuine issue rather than debugged forever. Manual-only scenarios are walked live via MCP (also headless) where feasible and otherwise listed as requiring manual execution. If a failure looks like an expired login/session (redirect to login, 401/403, invalid `storageState`) rather than a test defect, it **reruns `auth-setup` to relogin and retries that test once** — at most one relogin per test, never looped.
5b. **Accessibility (axe-core) and security (OWASP ZAP)** — reuses the exact same `@smoke` tests from step 5, both API and UI, rather than adding any new tests. Every `@smoke` UI test's final page state gets an axe-core scan automatically (via a shared test fixture); every `@smoke` test's traffic, API and UI alike, is optionally proxied through a local OWASP ZAP daemon so its passive scanner can analyze it. Produces its own `accessibility/report.md` and `security/report.md`, separate from the main report. See [Accessibility, security, and performance checks](#accessibility-security-and-performance-checks) below.
5c. **Performance smoke check (k6)** — generates (or reuses/updates) a k6 script targeting this Epic/Story's core API endpoint(s) — the same ones already covered by its `Type: API` `@smoke` test cases — and runs it as a **single-user, 5-iteration** smoke check, never a load or stress test. Produces `performance/report.md`.
6. **Report analysis** — parses automation results and evidence (screenshots/videos/traces), distinguishes automation defects from genuine behavior deviations from the Epic/Story spec, and folds in any Figma-vs-app discrepancies from step 2.
7. **Reporting** — writes both a detailed `report.md` and a short, high-level `execution-summary.md` into this run's folder, updates `latest.md`, and drafts Jira-formatted bug reports for genuine failures. `report.md` includes a short accessibility/security/performance summary linking the three dedicated reports above. Both report files are re-read from disk to confirm they were actually persisted before the run is declared complete — a chat summary alone doesn't count as this step being done. **It does not file real Jira tickets on its own** — it asks for confirmation first, and re-runs each confirmed draft's failing test once more to make sure it still reproduces before actually filing it.

## Setup

1. Copy the secrets template and fill in real values:
   ```bash
   cp .env.example .env
   ```
   Required variables: `JIRA_API_TOKEN`, `FIGMA_API_TOKEN`, `GIT_TOKEN`, `DEV_APP_CREDENTIALS`, `QA_APP_CREDENTIALS`. `.env` is git-ignored — never commit it.

   Optional, for the accessibility/security/performance checks (step 5b/5c — see [below](#accessibility-security-and-performance-checks)): `ZAP_API_URL`, `ZAP_PROXY_URL`, `ZAP_API_KEY` (OWASP ZAP daemon), `K6_DOCKER_IMAGE` (Docker fallback if the `k6` CLI isn't installed). All four are optional — if unset or unreachable, those checks are skipped and reported as such rather than faked.

2. Edit [config/qa-agent.config.json](config/qa-agent.config.json) with your actual settings:
   - `jira.baseUrl` / `jira.projectKey` — your Jira site and project
   - `figma.teamId` / `figma.defaultFileId` — if you want a default Figma file
   - `environments.<env>.appUrl` / `apiBaseUrl` — per-environment URLs used for the deployment gate and test runs
   - `artifacts.rootDir` — where generated artifacts are saved (default `qa-artifacts`)

3. Nothing else to install for Jira/Figma — the agent calls them directly over their REST APIs using the tokens above.

4. For UI work, the agent uses the **Playwright CLI** and the **Playwright MCP server** — make sure both are available:
   - Playwright CLI: already part of this repo's `devDependencies`; runs via `npx playwright ...`.
   - Playwright MCP server: must be connected in your agent runner — Claude Code (`claude mcp add playwright`), Cursor (Settings → MCP or `.cursor/mcp.json`), GitHub Copilot (already declared per-agent in `.github/agents/*.agent.md`), or Codex CLI (already declared in `.codex/config.toml`) — so browser navigate/snapshot/click tools are available to the agent. See [Platform support](#platform-support) for exact steps and restart requirements per platform.

## Platform support

The workflow, artifacts, and rules are identical across platforms — only how you invoke the agent and how the Playwright MCP server is wired up differs.

### Claude Code

- Definitions: `.claude/agents/*.md`, picked up automatically from the repo root.
- Invoke: `Run the qa-analyst agent for PROJ-1234`, or explicitly via the Agent tool with `subagent_type: qa-analyst`. qa-analyst delegates to `qa-test-designer`/`api-automation-architect`/`ui-automation-architect` through real Agent tool calls.
- MCP servers: configure the Playwright MCP server with `claude mcp add playwright -- npx -y @playwright/mcp@latest --headless` (and similarly for `filesystem` if used). Run `claude mcp list` to confirm it's connected.
- **After adding/editing an MCP server or an agent `.md` file**, restart the Claude Code session (exit and relaunch, or `/mcp` to reconnect servers without a full restart) — agent definitions and MCP server configs are loaded at session start and are not hot-reloaded mid-session.

### Cursor

- Definitions: `.cursor/rules/*.mdc`. Since these rules have no `globs` for `qa-analyst`/`qa-test-designer` (and are `alwaysApply: false`), they're **manually invoked**, not auto-attached — mention them explicitly in chat (`@qa-analyst`) to bring the rule into context, then give it the Epic/Story key.
- `ui-automation-architect`/`api-automation-architect` do declare `globs`, so Cursor may also auto-suggest them when you're editing matching files, in addition to manual `@`-mention.
- MCP servers: add the Playwright MCP server in Cursor's Settings → MCP (or `.cursor/mcp.json`), pointing at `npx -y @playwright/mcp@latest --headless`.
- **After adding/editing `.cursor/rules/*.mdc` or `.cursor/mcp.json`**, reload the Cursor window (`Developer: Reload Window` from the command palette, or fully restart Cursor) — rule and MCP changes are not picked up by an already-open chat session.

### GitHub Copilot

- Definitions: `.github/agents/*.agent.md` (VS Code Copilot custom agents).
- Invoke: select the `qa-analyst` custom agent from Copilot Chat's agent picker (or `@qa-analyst` if your Copilot version supports agent mentions), then give it the Epic/Story key.
- MCP servers: each `.agent.md` file already declares its own `playwright`/`filesystem` MCP servers under `mcp-servers:` in the frontmatter, so no separate global MCP config is required — Copilot starts them per-agent.
- **After editing a `.agent.md` file**, reload the VS Code window (`Developer: Reload Window`) or restart the Copilot Chat extension host — custom agent definitions are read once when the extension activates.

### Codex CLI

- Definitions: `.codex/agents/*.toml`; shared MCP servers (`filesystem`, `playwright`) are declared once in `.codex/config.toml`, not per-agent.
- Invoke: run Codex CLI and select/reference the `qa-analyst` agent, then give it the Epic/Story key.
- **After editing `.codex/config.toml` or any `.codex/agents/*.toml` file**, restart the Codex CLI process — both are read at startup.

## Usage

Invoke it with an Epic or Story key:

> Run the qa-analyst agent for PROJ-1234

Or, in Claude Code, via the Agent tool with `subagent_type: qa-analyst`; in Cursor via `@qa-analyst`; in GitHub Copilot via the agent picker; in Codex CLI by selecting the `qa-analyst` agent. See [Platform support](#platform-support) above for the exact mechanics per platform.

If `.env` is missing or a required token is empty, the agent stops and reports that as a blocker before making any Jira/Figma calls — it will not fabricate data.

## Artifacts

Everything the agent produces for Epic/Story `<KEY>` is saved under `qa-artifacts/<KEY>/` (checked into git so it's shareable), organized **per run** — every invocation against a key gets its own numbered, immutable folder:

```
qa-artifacts/<KEY>/
  latest.md          ← current run number + run-history table
  run-01/             ← first invocation
    test-plan.md
    test-cases.md
    test-cases.csv      ← same test cases in CSV, for import into TestRail/Zephyr/Xray/qTest/etc.
    network-capture.md
    script-changes.md
    report.md
    execution-summary.md
    jira-bug-drafts.md
    accessibility/      ← step 5b: axe-core results for the @smoke UI run
      *.json
      report.md
    security/           ← step 5b: OWASP ZAP alerts for the @smoke API+UI run
      zap-alerts.json
      report.md
    performance/        ← step 5c: k6 single-user smoke-check results
      summary.json
      report.md
  run-02/             ← a later re-run
    ...same files...
    delta.md          ← what changed vs. run-01, and why this run happened
```

| File | Produced in step | Contents |
|---|---|---|
| `latest.md` | — | Pointer to the current run + a history table (run #, date, trigger, go/no-go) |
| `test-plan.md` | 1 | Scope, environments, entry/exit criteria, risk areas, test-pyramid mix — authored by qa-analyst itself |
| `test-cases.md` | 1 | Per-issue test case tables (steps, expected result, automated Y/N, priority) — merged from qa-test-designer's `qa/test-cases.md`, plus Figma-derived UI notes |
| `test-cases.csv` | 1 | Same test cases as `test-cases.md`, flattened to CSV (`ID,Title,Preconditions,Steps,Expected Result,Type,Priority,AC Ref,Jira Key`) for bulk import into TestRail, Zephyr, Xray, qTest, or any other test-case repository |
| `delta.md` | 1 (re-runs only) | What changed in Jira/Figma/test-cases/scripts/results vs. the previous run, with a reference to that run's folder |
| `network-capture.md` | 3 | Distinct API endpoints observed during UI seeding/test execution (method, path, status, request/response shape) |
| `script-changes.md` | 4 | Every spec/wrapper/page-object/fixture file created or modified, with why |
| `accessibility/*.json`, `accessibility/report.md` | 5b | Per-test axe-core scan results (raw JSON) and an aggregated report for the `@smoke` UI run |
| `security/zap-alerts.json`, `security/report.md` | 5b | Raw OWASP ZAP alerts and an aggregated report for the `@smoke` API+UI run's proxied traffic |
| `performance/summary.json`, `performance/report.md` | 5c | Raw k6 `handleSummary()` output and an aggregated report for the single-user, 5-iteration smoke check |
| `report.md` | 7 | Detailed report — results, deviations, failure evidence, Figma parity findings, accessibility/security/performance summary |
| `execution-summary.md` | 7 | Short, high-level pass/fail + go/no-go summary, readable in under a minute |
| `jira-bug-drafts.md` | 7 | Draft Jira bug reports for genuine failures, pending your approval |

**Re-running the agent for the same key never overwrites a previous run.** It creates the next `run-N/` folder, writes `delta.md` comparing it to the prior run, and re-executes the **full impacted scope** for the Epic/Story from scratch — not just what changed. A run folder is only edited in place if you resume an interrupted invocation of that same run; a new invocation always gets a new folder.

## Filing Jira bugs

Step 7 only **drafts** bugs in `jira-bug-drafts.md`. The agent will show you the drafts and ask which ones to file. **Before actually filing a confirmed draft, it re-runs that test/scenario once more** to make sure the failure still reproduces right now — a single confirmation re-run, separate from step 5's retry policy, not another debug loop. If it now passes, the draft is marked as no-longer-reproducing instead of being filed. Only for drafts that still fail does it call the Jira REST API (`POST /rest/api/3/issue`) to create the real tickets, and it reports back the created issue keys/links.

## Playwright CLI and MCP server usage

The agent uses two distinct Playwright surfaces, deliberately kept separate:

- **Playwright CLI** (`npx playwright ...`, via Bash) — for anything script-authoring and test-execution related: `codegen` to derive selectors when scaffolding a new UI spec, `test --list` to confirm scope, `test`/`test --grep "..."` to run impacted specs headless, **as two separate invocations — `spec/api/...` and `spec/ui/...` are always run as distinct commands, never combined into one** — and `show-report`/`test-results` to analyze each run's results before merging them back into a single `report.md`/`execution-summary.md`.
- **Playwright MCP server** (`mcp__playwright__*` tools) — for live, interactive browser work: confirming the deployment gate actually rendered the new UI, comparing the live app against linked Figma frames, walking UI seed flows that have no API shortcut while capturing the network calls they trigger (`browser_network_requests`), inspecting live DOM/selectors before writing a spec, running feasible manual-only scenarios as observed (not automated) checks, and reproducing failures for root-cause analysis (`browser_snapshot`, `browser_console_messages`, `browser_network_requests`).

If the Playwright MCP server isn't connected in your agent runner, the agent will still complete Jira/Figma-based planning and CLI-driven test execution, but will flag any step that needed live browser interaction (deployment gate's UI check, UI seeding, live selector discovery, manual-scenario walkthroughs, failure repro) as blocked/skipped rather than fabricating the result.

### Always headless — no visible browser, for any test type

Seeding, automated execution, and manual/MCP-driven walkthroughs all run **headless**, for both API and UI. No step opens a visible browser window.

- Both API (`spec/api/...`) and UI (`spec/ui/...`) runs execute with no `--headed` flag.
- If a Playwright MCP server session launches its own browser for a manual/live walkthrough, it's started/connected in headless mode too.
- If `playwright.config.ts` defaults any project the agent touches to `headed`, that's flagged as inconsistent with this rule rather than relied on.

### Always separate API/UI commands, Chrome-only, fixed at 2 workers

Every automated run — API and UI, on every platform — executes on Chrome only, with API specs and UI specs run as two distinct Playwright CLI invocations. `npx playwright test spec/api/leave-list.spec.ts spec/api/leave-search.spec.ts spec/ui/leave/leave-list.spec.ts --workers=1` is exactly the pattern this rule forbids — mixing API and UI spec paths (and overriding the worker count) in one command. Instead: one command covering all impacted API specs, then a separate command covering all impacted UI specs. `playwright.config.ts` is configured with `fullyParallel: false` and `workers: 2`, and only the `chromium` project is defined (the earlier `firefox`/`webkit` API projects were removed). Chrome-only was a deliberate fix: running chromium/firefox/webkit concurrently against the shared OrangeHRM demo site caused each browser's login to invalidate the others' session, producing intermittent, environment-caused test failures that looked like application bugs. Never override `--workers` away from `2` or pass `--project=firefox`/`--project=webkit` when invoking the CLI.

## Accessibility, security, and performance checks

These three checks all reuse the existing `@smoke`-tagged functional tests — **none of them add a separate test file or test case.**

**Accessibility (axe-core).** [libs/fixtures/qaFixtures.ts](libs/fixtures/qaFixtures.ts) wraps Playwright's `test`/`expect` with an auto-fixture that scans every `@smoke`-tagged UI test's final page state with [`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm) when `A11Y_ARTIFACT_DIR` is set, writing one JSON file per test. Every spec under `spec/ui/**` already imports `test`/`expect` from this fixture instead of `@playwright/test` directly, so any new `@smoke` UI test is covered automatically. [scripts/generate-perf-report.js](scripts/generate-perf-report.js)'s accessibility counterpart — the aggregation in [libs/utils/a11yReport.ts](libs/utils/a11yReport.ts) — runs in `global-teardown.ts` to produce `accessibility/report.md` (violation counts by impact, plus per-test detail).

**Security (OWASP ZAP).** [playwright.config.ts](playwright.config.ts) routes traffic from all four projects — the API `chromium` project and the three UI projects — through a local [OWASP ZAP](https://www.zaproxy.org/) daemon when `RUN_SECURITY_SCAN=true` (Playwright's `use.proxy` option is honored by both the browser context and the `request`/`APIRequestContext` fixture, so this covers API and UI traffic alike). ZAP passively analyzes that traffic as the same `@smoke` tests run — no active/intrusive scanning against the shared demo environment. [libs/utils/zapScan.ts](libs/utils/zapScan.ts) + `global-teardown.ts` wait for ZAP's passive-scan queue to drain, pull alerts for the app's `baseURL` via the ZAP REST API, and write `security/zap-alerts.json` + `security/report.md`. If no ZAP daemon is reachable at `ZAP_API_URL`, this is skipped and reported as such — never faked.

**Performance (k6), single user / 5 iterations only.** [spec/performance/_template.k6.js](spec/performance/_template.k6.js) is the starting point for a per-Epic/Story k6 script, hard-set to `vus: 1, iterations: 5` — a latency/error-rate smoke check, not a load or stress test, and the agent never scales those numbers up for this workflow. The agent copies the template to `spec/performance/<module>-<KEY>.k6.js` and points it at the same endpoint(s) already covered by that run's `Type: API` `@smoke` cases, resolves auth from the session cookie in `playwright/.auth/admin.json`, and runs it with the `k6` CLI (or a Docker fallback using `K6_DOCKER_IMAGE` if `k6` isn't installed): `k6 run --vus 1 --iterations 5 spec/performance/<module>-<KEY>.k6.js`. [scripts/generate-perf-report.js](scripts/generate-perf-report.js) turns the resulting `summary.json` into `performance/report.md` (request count, response-time percentiles, failed-request rate, threshold pass/fail).

**Platform coverage:** this is currently wired into the Claude Code definition ([.claude/agents/qa-analyst.md](.claude/agents/qa-analyst.md), steps 5b/5c). The underlying mechanics (fixtures, config, scripts, templates) are platform-agnostic — driven by env vars and the Playwright/k6 CLIs — but the Cursor/Copilot/Codex agent definitions haven't been updated to describe these steps yet; port them by hand if you rely on this workflow from one of those runners (see [Platform support](#platform-support)).

## Notes

- The agent talks to Jira/Figma via their REST APIs directly using the tokens in `.env` — it does not rely on Jira/Figma MCP servers, since those may not be authorized in headless or non-interactive runs.
- It follows this repo's existing wrapper-class + JSON-fixture + template-assertion conventions for API tests (see the main [README.md](README.md) and [CLAUDE.md](CLAUDE.md)); it does not introduce a different pattern.
- **It only executes tests impacted by the Epic/Story — never the full suite and never other pre-existing, unrelated specs.**
- **Every re-run still executes the full impacted scope, not just a diff.** `delta.md` documents what changed since the last run, but execution itself always re-validates every Story/Task under the key.
- **Retry policy is strict:** a failing test gets at most one retry, plus at most one considered fix-and-retry if the cause looks like an obvious automation defect. Anything that still fails after that is treated as a possible genuine application issue for step 6, not looped on indefinitely — the assumption shifts from "my script is wrong" to "this might be the application."
- **API and UI tests always run as two separate commands, but the report is one merged document.** Step 5 never combines `spec/api/...` and `spec/ui/...` into a single `npx playwright test` invocation, but `report.md`/`execution-summary.md` still present one combined set of pass/fail totals with a `Layer` column distinguishing API vs UI — not two separate report files. This matches how earlier runs reported results, even though execution itself is kept separate.
- **Expired-login handling is equally strict:** if a failure looks like an expired session/token rather than a test defect, the agent reruns `auth-setup` to relogin and retries that one test — but **only once per test**. A test that still fails after its single relogin attempt is carried forward like any other unresolved failure, not relogin-looped indefinitely.
- API test coverage isn't limited to what the Jira ticket names explicitly — network calls captured during seeding surface real endpoints (including undocumented ones) that get turned into API tests, which is how the agent pushes toward the 60-70% API slice of the test pyramid.
- **A captured endpoint with no automation and no specific per-endpoint reason is a bug in the run, not an acceptable gap.** If you see `network-capture.md` describing discovered endpoints as "future work" instead of either a script or a stated reason it wasn't automated, the run didn't follow this rule correctly.
- **Check `script-changes.md`'s Author column when reviewing a run.** Every API/UI spec, wrapper, or page object should be authored by `api-automation-architect`/`ui-automation-architect`, not `qa-analyst` — `qa-analyst` as author is only valid for a step 5 one-line defect fix to a file that already existed. If new test coverage is attributed to `qa-analyst`, delegation was skipped and the run should be treated as incomplete for that test case.
- **Check `script-changes.md`'s Tags column too.** Every automated test, API or UI, should show at least one of `@smoke`/`@sanity`/`@regression`, **plus a `@module:<name>` tag and a `@<JIRA-KEY>` tag**. A blank or partial Tags entry means step 4 shipped a test without full tagging — treat that the same as a missing script for that test case. The module/ticket tags exist specifically so a single module (`--grep @module:leave`) or a single ticket's tests (`--grep @KAN-13`) can be run on their own.
- **API and UI tests are always run as two separate CLI commands — never mixed in one invocation, no matter how many spec files are impacted.** `playwright.config.ts` runs with `workers: 2` and `fullyParallel: false`, and only a Chrome-based project is defined — never override the worker count or target a non-Chrome `--project`. Chrome-only is what fixed the concurrent-session failures seen when chromium/firefox/webkit logins raced each other on the shared demo environment.
- **Jira is always re-fetched, every run, including re-runs.** The agent never reuses a previous run's cached Jira data — step 1 always pulls the Epic/Story fresh, since catching ticket changes since the last run is the entire point of re-running.
- When Figma frames are linked, the agent checks the live app against them during the deployment gate and folds discrepancies into the report — this is best-effort visual/structural comparison via the Playwright MCP server, not a pixel-perfect diff tool.
- **Runs are immutable history** — re-running an Epic/Story never edits a previous run's folder; it always creates the next `run-N/` and updates `latest.md`.
- **Accessibility, security, and performance checks never add new tests.** Accessibility (axe-core) and security (OWASP ZAP) both hook into the existing `@smoke` tests via a shared fixture and a proxied ZAP connection respectively; performance (k6) reuses the same endpoints already covered by `Type: API` `@smoke` cases in a generated script. See [Accessibility, security, and performance checks](#accessibility-security-and-performance-checks).
- **The k6 performance check is always single-user (`vus: 1`) and exactly 5 iterations** — a smoke-level latency/error-rate check, never a load or stress test. This is a hard rule for this workflow, not a default that gets tuned up.
