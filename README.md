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

Given a Jira Epic/Story key (e.g. `PROJ-1234`), it runs seven **functional** steps in order (test plan through Jira bug drafts). Non-functional checks (accessibility/security/performance) are a distinct **step 8** — a separate command against separate artifacts, run on demand for any story, not folded into this functional sequence. See [Non-functional checks](#non-functional-checks-accessibility-security-performance) below.

1. **Test plan and test cases** — resolves which run folder this is (first run or a re-run, see Artifacts below), **always pulls fresh from Jira on every run — including re-runs of the same key** (never reuses a prior run's fetched data, since the whole point of a re-run is to catch ticket changes since last time), fetching the Epic and every linked Story, Task, and Sub-task, plus linked Figma frames; writes `test-plan.md` itself (including the test-pyramid mix), and delegates test case design to `qa-test-designer` (targeting that mix), folding its output into `test-cases.md`.
2. **Deployment gate + Figma parity check** — confirms the target environment is up and the Epic/Story's changes are actually deployed there; if Figma frames were linked, also compares the live app against them and logs discrepancies. If the env is down or changes are missing, it **stops and reports a blocker** instead of continuing.
3. **Seed data + network capture** — ensures API and UI seed data is scripted (not manual), extending existing seed scripts where possible; all seeding runs **headless**, for both API and UI — no visible browser. While seeding, captures every distinct network call the app makes into `network-capture.md`, then immediately cross-checks captured endpoints against `test-cases.md` and adds/converts `Type: API` test cases for anything a UI-only case could equally be verified through — this happens before moving on, not left as a note for later.
4. **Automation scripts** — delegates to `api-automation-architect` (using captured network shapes for API test cases, including endpoints not explicitly named in the ticket) and `ui-automation-architect` (see above) to create/update Playwright API and UI scripts, following this repo's existing conventions (or any `.cursor/rules` / Copilot instructions present, which take precedence) rather than inventing new patterns. Any `Type: API` case step 3 just added gets its script written in this same step — not deferred, and always via a real delegation to `api-automation-architect`, never authored directly. Every test is tagged `@smoke`/`@sanity`/`@regression` **plus `@module:<name>` and `@<JIRA-KEY>`** at this point, API and UI alike.
5. **Test execution** — runs **only** the tests impacted by the Epic/Story, as **two separate CLI invocations — one for API specs, one for UI specs, never mixed into a single command, no matter how many files are impacted on either side** — always **headless** (no `--headed`, for API and UI alike), **on Chrome only, fixed at 2 workers** (never other browser projects) — never the full suite or unrelated pre-existing specs. Uses the smoke/sanity/regression tags to scope runs (`--grep @smoke` as a fast-fail gate before the full run, `--grep @regression` for the full impacted set), plus the `@module:*`/`@<JIRA-KEY>` tags to scope by module or ticket, in addition to path-based impacted-scope filtering. On a re-run, the **full impacted scope is executed again from scratch**, not just what changed since last time. Failing tests get **at most one retry**; it does not loop trying fixes indefinitely — if a failure survives one retry and one considered fix attempt, it's carried into analysis as a possible genuine issue rather than debugged forever. Manual-only scenarios are walked live via MCP (also headless) where feasible and otherwise listed as requiring manual execution. If a failure looks like an expired login/session (redirect to login, 401/403, invalid `storageState`) rather than a test defect, it **reruns `auth-setup` to relogin and retries that test once** — at most one relogin per test, never looped.
6. **Report analysis** — parses automation results and evidence (screenshots/videos/traces), distinguishes automation defects from genuine behavior deviations from the Epic/Story spec, and folds in any Figma-vs-app discrepancies from step 2.
7. **Reporting** — writes both a detailed `report.md` and a short, high-level `execution-summary.md` into this run's folder, updates `latest.md`, and drafts Jira-formatted bug reports for genuine failures. **Functional results only** — accessibility/security/performance findings live in step 8's own report, never folded in here. Both report files are re-read from disk to confirm they were actually persisted before the run is declared complete — a chat summary alone doesn't count as this step being done. **It does not file real Jira tickets on its own** — it asks for confirmation first, and re-runs each confirmed draft's failing test once more to make sure it still reproduces before actually filing it.

**Step 8 — Non-functional checks (accessibility, security, performance), separate and on demand.** Not part of the seven steps above and never runs automatically alongside them. Invoke it separately, any time, for any story that already has `@smoke` coverage from a prior functional run: reuses those exact `@smoke` tests (no new test files), runs its own pair of API/UI commands, and writes to a completely separate `qa-artifacts/<KEY>/nonfunctional/run-<M>/` tree with its own `latest.md` and run numbering. See [Non-functional checks](#non-functional-checks-accessibility-security-performance) below for the full breakdown and how to invoke it.

## Setup

1. Copy the secrets template and fill in real values:
   ```bash
   cp .env.example .env
   ```
   Required variables: `JIRA_API_TOKEN`, `FIGMA_API_TOKEN`, `GIT_TOKEN`, `DEV_APP_CREDENTIALS`, `QA_APP_CREDENTIALS`. `.env` is git-ignored — never commit it.

   For the accessibility/security/performance checks (step 8, a separate on-demand command — see [below](#non-functional-checks-accessibility-security-performance)): `ZAP_API_URL`, `ZAP_PROXY_URL`, `ZAP_API_KEY` (OWASP ZAP daemon — leave `ZAP_API_KEY` blank since `npm run zap:start` disables the key requirement), `K6_DOCKER_IMAGE` (Docker fallback if the `k6` CLI isn't installed). These have working defaults out of the box (`ZAP_API_URL`/`ZAP_PROXY_URL` default to `http://127.0.0.1:8080`, matching `npm run zap:start`'s container) — run `npm run zap:start` and `npm run perf:pull-image` once (requires Docker Desktop running) so the checks actually execute instead of being skipped. If Docker genuinely isn't available, they still degrade gracefully: skipped and reported as such rather than faked.

2. Edit [config/qa-agent.config.json](config/qa-agent.config.json) with your actual settings:
   - `jira.baseUrl` / `jira.projectKey` — your Jira site and project
   - `figma.teamId` / `figma.defaultFileId` — if you want a default Figma file
   - `environments.<env>.appUrl` / `apiBaseUrl` — per-environment URLs used for the deployment gate and test runs
   - `artifacts.rootDir` — where generated artifacts are saved (default `qa-artifacts`)

3. Nothing else to install for Jira/Figma — the agent calls them directly over their REST APIs using the tokens above.

4. For UI work, the agent uses the **Playwright CLI** and the **Playwright MCP server** — make sure both are available:
   - Playwright CLI: already part of this repo's `devDependencies`; runs via `npx playwright ...`.
   - Playwright MCP server: must be connected in your agent runner — Claude Code (`claude mcp add playwright`), Cursor (Settings → MCP or `.cursor/mcp.json`), GitHub Copilot (already declared per-agent in `.github/agents/*.agent.md`), or Codex CLI (already declared in `.codex/config.toml`) — so browser navigate/snapshot/click tools are available to the agent. See [Platform support](#platform-support) for exact steps and restart requirements per platform.

5. **Infrastructure for the non-functional checks (step 8) — Docker, ZAP, k6.** These are real local services, not just config, and step 8 will report a skip if they're not actually running:
   - **Prerequisite: Docker Desktop must be installed and running.** Check with:
     ```bash
     docker info
     ```
     If it errors with something like `failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine` (Windows) or a similar socket-not-found error, Docker Desktop's engine isn't up yet — launch the Docker Desktop application and wait for it to finish starting (30-60s on first launch) before retrying.
   - **Start the local OWASP ZAP daemon** (used by the security check):
     ```bash
     npm run zap:start
     ```
     This runs `zaproxy/zap-stable` in a container on `:8080` with the API's address restriction relaxed (`api.addrs.addr.name=.*`/`api.addrs.addr.regex=true`) — **required**, not cosmetic: without those two flags ZAP rejects any API call that doesn't originate from `127.0.0.1`, which is exactly what happens when Playwright's own proxied traffic (or a containerized CI runner) queries it, so the security check would silently look "unreachable" even with ZAP running. ZAP's Java process takes ~20-40s to finish booting after the container starts — poll before assuming failure:
     ```bash
     npm run zap:status   # retry every few seconds until it prints {"version":"..."} instead of "ZAP not reachable"
     ```
     Stop it when you're done with `npm run zap:stop` (or leave it running between QA runs — the container is cheap to keep up).
   - **Pre-pull the k6 Docker image** (used by the performance check's fallback if the `k6` CLI isn't installed natively):
     ```bash
     npm run perf:pull-image
     ```
     This avoids a slow first-run image pull happening in the middle of a QA run's performance step. If you'd rather install the native `k6` CLI instead (skips Docker entirely for this check), see [k6's install docs](https://grafana.com/docs/k6/latest/set-up/install-k6/) — either path works, the agent auto-detects which one is available.
   - **Everything above is optional in the sense that the workflow degrades gracefully without it** — if Docker isn't installed/running at all, step 8's security portion (accessibility still runs) and performance portion are skipped and reported as such in its `report.md`, never faked. But do this setup once if you want actual non-functional coverage instead of skips.

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

Invoke it with an Epic or Story key, for the full functional workflow (steps 1-7):

> Run the qa-analyst agent for PROJ-1234

Or, in Claude Code, via the Agent tool with `subagent_type: qa-analyst`; in Cursor via `@qa-analyst`; in GitHub Copilot via the agent picker; in Codex CLI by selecting the `qa-analyst` agent. See [Platform support](#platform-support) above for the exact mechanics per platform.

If `.env` is missing or a required token is empty, the agent stops and reports that as a blocker before making any Jira/Figma calls — it will not fabricate data.

**Non-functional checks (step 8) are a separate, on-demand request to this same `qa-analyst` agent — not a different agent or a separate tool.** Same invocation mechanics per platform as above, just ask for step 8 by name instead of a plain functional run:

> Run the qa-analyst non-functional agent for PROJ-1234

(equally: "Run the non-functional checks for PROJ-1234" or "Check accessibility/security/performance for PROJ-1234" — all trigger the same step 8). The story must already have `@smoke`-tagged tests from a prior functional run (steps 1-5) — step 8 re-executes that existing coverage with accessibility/security/performance instrumentation attached, it doesn't author new tests. See [Non-functional checks](#non-functional-checks-accessibility-security-performance) for what it does and where it writes its results.

## Running tests directly (no agent involved)

Everything above describes what the `qa-analyst` agent does on your behalf. All five categories below can also be run straight from the terminal, no agent, no Jira key — useful for local debugging or CI. All are headless, Chrome-only, and respect `ENV`.

Recall the tagging scheme (Section: every automated test carries tier + module + Jira-key tags — `@smoke`/`@sanity`/`@regression`, `@module:<name>`, `@<JIRA-KEY>`). All five commands below can be scoped with `--grep` using any of these, alone or combined (Playwright's `--grep` takes a regex, so combine tags with `.*`, e.g. `"@smoke.*@KAN-4"` to require both).

**API tests only:**
```bash
npm run test:api                                    # everything under spec/api
npx playwright test spec/api --grep @smoke           # just the smoke tier
npx playwright test spec/api --grep @module:pim       # just one module
npx playwright test spec/api --grep @KAN-4            # just one story
npx playwright test spec/api --grep "@smoke.*@KAN-4"  # one story's smoke tests only
```

**UI tests only:**
```bash
npm run test:ui-specs                                # everything under spec/ui
npx playwright test spec/ui --grep @regression        # just the regression tier
npx playwright test spec/ui --grep @module:leave       # just one module
npx playwright test spec/ui --grep @KAN-13             # just one story
npx playwright test spec/ui --grep "@sanity.*@KAN-13"  # one story's sanity tests only
```
(Note: `npm run test:ui`, without `-specs`, is Playwright's own interactive UI mode — a different thing. Use `test:ui-specs`, or the `npx playwright test spec/ui ...` forms above, to run the UI spec files headlessly.)

**Accessibility only** (no external dependency — always works):
```bash
npm run test:a11y   # every @smoke UI test, writes to qa-artifacts/accessibility/latest/report.md

# scoped to one story instead of every @smoke test:
A11Y_ARTIFACT_DIR=qa-artifacts/KAN-4/nonfunctional/run-01/accessibility \
  npx playwright test --grep "@smoke.*@KAN-4" --project=pim-ui --project=leave-ui --project=admin-ui

# scoped to one module across every story:
A11Y_ARTIFACT_DIR=qa-artifacts/accessibility/pim-only \
  npx playwright test --grep "@smoke.*@module:pim" --project=pim-ui --project=leave-ui --project=admin-ui
```

**Security only** (needs a local OWASP ZAP daemon — see [Setup](#setup) step 5):
```bash
npm run zap:start      # once, if not already running — npm run zap:status to check
npm run test:security  # every @smoke test, API + UI, writes to qa-artifacts/security/latest/

# scoped to one story (run both commands, same SECURITY_ARTIFACT_DIR, so alerts accumulate):
RUN_SECURITY_SCAN=true SECURITY_ARTIFACT_DIR=qa-artifacts/KAN-4/nonfunctional/run-01/security \
  npx playwright test --grep "@smoke.*@KAN-4" --project=chromium

RUN_SECURITY_SCAN=true SECURITY_ARTIFACT_DIR=qa-artifacts/KAN-4/nonfunctional/run-01/security \
  npx playwright test --grep "@smoke.*@KAN-4" --project=pim-ui --project=leave-ui --project=admin-ui
```
`test:security` runs both the generic API command (proxied) and the UI command (proxied + accessibility) in sequence, same as the agent's step 8 does.

**Performance only** (needs the `k6` CLI, or Docker as a fallback — see [Setup](#setup) step 5):

Performance isn't tag-scoped the same way — it targets whichever `spec/performance/<module>.k6.js` script you point it at, so scoping is done by picking the script (one per module), not by `--grep`.

```bash
npm run perf:pull-image    # once, if using the Docker fallback

BASE_URL=https://opensource-demo.orangehrmlive.com \
AUTH_COOKIE=<value of the 'orangehrm' cookie from playwright/.auth/admin.json — capture it fresh, see note below> \
K6_SUMMARY_FILE=qa-artifacts/performance/summary.json \
  k6 run --vus 1 --iterations 5 spec/performance/<module>.k6.js

# then turn the summary into a readable report:
node scripts/generate-perf-report.js qa-artifacts/performance/summary.json qa-artifacts/performance 1 5
```
`<module>.k6.js` is one of the existing files under `spec/performance/` (e.g. `pim.k6.js`) — module-named, not tied to a Jira key; see [Non-functional checks](#non-functional-checks-accessibility-security-performance). **Capture `AUTH_COOKIE` immediately before running** — re-run `npx playwright test spec/ui/auth.setup.ts` first if there's any chance the session was invalidated by a later login on the shared demo. A stale cookie causing every request to fail identically is the most common false "performance failure," not a real regression.

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
    report.md            ← functional results only
    execution-summary.md ← functional results only
    jira-bug-drafts.md
  run-02/             ← a later re-run
    ...same files...
    delta.md          ← what changed vs. run-01, and why this run happened
  nonfunctional/      ← step 8: a separate, on-demand check — NOT part of run-01/run-02 above, own numbering
    latest.md          ← current nonfunctional run number + its own history table
    run-01/
      accessibility/      ← axe-core results for this story's @smoke UI tests
        *.json
        report.md
      security/           ← OWASP ZAP alerts for this story's @smoke API+UI traffic
        zap-alerts.json
        report.md
      performance/        ← k6 single-user smoke-check results
        summary.json
        report.md
      report.md            ← step 8's own combined summary, linking the three above
```

**The `nonfunctional/` tree is independent of the functional `run-N/` folders** — different numbering, different trigger, different report. A functional re-run never touches it, and running step 8 never creates a new `run-N/`.

| File | Produced in step | Contents |
|---|---|---|
| `latest.md` | — | Pointer to the current run + a history table (run #, date, trigger, go/no-go) |
| `test-plan.md` | 1 | Scope, environments, entry/exit criteria, risk areas, test-pyramid mix — authored by qa-analyst itself |
| `test-cases.md` | 1 | Per-issue test case tables (steps, expected result, automated Y/N, priority) — merged from qa-test-designer's `qa/test-cases.md`, plus Figma-derived UI notes |
| `test-cases.csv` | 1 | Same test cases as `test-cases.md`, flattened to CSV (`ID,Title,Preconditions,Steps,Expected Result,Type,Priority,AC Ref,Jira Key`) for bulk import into TestRail, Zephyr, Xray, qTest, or any other test-case repository |
| `delta.md` | 1 (re-runs only) | What changed in Jira/Figma/test-cases/scripts/results vs. the previous run, with a reference to that run's folder |
| `network-capture.md` | 3 | Distinct API endpoints observed during UI seeding/test execution (method, path, status, request/response shape) |
| `script-changes.md` | 4 | Every spec/wrapper/page-object/fixture file created or modified, with why |
| `report.md` | 7 | Detailed report — results, deviations, failure evidence, Figma parity findings (functional results only) |
| `execution-summary.md` | 7 | Short, high-level pass/fail + go/no-go summary, readable in under a minute (functional results only) |
| `jira-bug-drafts.md` | 7 | Draft Jira bug reports for genuine failures, pending your approval |

**`nonfunctional/run-M/` (step 8 — separate tree, own numbering):**

| File | Contents |
|---|---|
| `nonfunctional/latest.md` | Pointer to the current nonfunctional run + its own history table |
| `accessibility/*.json`, `accessibility/report.md` | Per-test axe-core scan results (raw JSON) and an aggregated report for this story's `@smoke` UI tests |
| `security/zap-alerts.json`, `security/report.md` | Raw OWASP ZAP alerts and an aggregated report for this story's `@smoke` API+UI proxied traffic |
| `performance/summary.json`, `performance/report.md` | Raw k6 `handleSummary()` output and an aggregated report for the single-user, 5-iteration smoke check |
| `report.md` | Step 8's own combined summary, linking the three reports above |
| `jira-bug-drafts.md` | Draft Jira bugs for genuine non-functional findings, pending your approval |

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

## Non-functional checks (accessibility, security, performance)

**This is step 8 — a separate command producing separate artifacts, invoked on demand for any story, not part of the seven-step functional run above.** Running steps 1-7 for an Epic/Story never triggers these checks; you ask for them explicitly ("Run the qa-analyst non-functional agent for KAN-13") whenever you want them, against any story that already has `@smoke`-tagged automated tests from a prior functional run. Step 8 doesn't create test coverage — it re-executes what already exists, filtered to that story's tests via its `@<KEY>` tag, and writes to its own `qa-artifacts/<KEY>/nonfunctional/run-<M>/` tree (see [Artifacts](#artifacts)) — numbered independently of the functional `run-N/` folders, so you can run it as often (or as rarely) as you like without disturbing functional run history.

All three checks reuse the existing `@smoke`-tagged functional tests — **none of them add a separate test file or test case.**

**Accessibility (axe-core).** [libs/fixtures/qaFixtures.ts](libs/fixtures/qaFixtures.ts) wraps Playwright's `test`/`expect` with an auto-fixture that scans every UI test's final page state with [`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm) when `A11Y_ARTIFACT_DIR` is set, writing one JSON file per test. The fixture itself has no `@smoke` (or any other) tag check — which tests are actually scanned is decided by whatever `--grep`/tag filter the invoking command used, since only the tests that command selects run at all. Every spec under `spec/ui/**` already imports `test`/`expect` from this fixture instead of `@playwright/test` directly, so any UI test the command runs is covered automatically. The aggregation in [libs/utils/a11yReport.ts](libs/utils/a11yReport.ts) runs in `global-teardown.ts` to produce `accessibility/report.md` (violation counts by impact, plus per-test detail). See [How the accessibility scan works, code-wise](#how-the-accessibility-scan-works-code-wise) below for the exact mechanics.

**Security (OWASP ZAP).** [playwright.config.ts](playwright.config.ts) routes traffic from all four projects — the API `chromium` project and the three UI projects — through a local [OWASP ZAP](https://www.zaproxy.org/) daemon when `RUN_SECURITY_SCAN=true` (Playwright's `use.proxy` option is honored by both the browser context and the `request`/`APIRequestContext` fixture, so this covers API and UI traffic alike). There's no tag check anywhere in this path — ZAP passively analyzes whatever traffic actually flows through the proxy, which is simply whatever tests the invoking command selected via `--grep` (e.g. `@smoke`) — no active/intrusive scanning against the shared demo environment. [libs/utils/zapScan.ts](libs/utils/zapScan.ts) + `global-teardown.ts` wait for ZAP's passive-scan queue to drain, pull alerts for the app's `baseURL` via the ZAP REST API, and write `security/zap-alerts.json` + `security/report.md`. **The agent starts ZAP itself if it isn't already running** (`npm run zap:start`) before concluding the check is unreachable — only genuinely skipping (and saying so plainly) if Docker itself isn't usable. See [How the security scan works, code-wise](#how-the-security-scan-works-code-wise) below for the exact mechanics.

**Performance (k6), single user / 5 iterations only.** [spec/performance/_template.k6.js](spec/performance/_template.k6.js) is the starting point for a k6 script, hard-set to `vus: 1, iterations: 5` — a latency/error-rate smoke check, not a load or stress test, and the agent never scales those numbers up for this workflow. Scripts are named after their **module**, never a Jira key — `spec/performance/<module>.k6.js` (e.g. `spec/performance/pim.k6.js`) — and are shared across every story touching that module: the agent checks for an existing script for the module first and extends it (new `check()` block, commented with the Jira key that added it) rather than generating a per-story duplicate; only copies the template if no script exists yet for that module. It points the script at the same endpoint(s) already covered by that story's `Type: API` `@smoke` cases — this is a manual/authoring-time correspondence, not a runtime `--grep`/tag filter, since k6 scripts never run through Playwright at all — resolves auth from a **freshly re-captured** session cookie in `playwright/.auth/admin.json` (re-running `auth.setup.ts` first if the session might have been invalidated by a later login on the shared demo — a stale cookie causing every request to fail identically is the most common false "performance failure"), and runs it with the `k6` CLI (or a Docker fallback using `K6_DOCKER_IMAGE` if `k6` isn't installed): `k6 run --vus 1 --iterations 5 spec/performance/<module>.k6.js`. If the endpoints also need a CSRF token, it's passed as `AUTH_CSRF_TOKEN` (extracted the same way as the session cookie, once confirmed necessary via `network-capture.md` — never guessed). [scripts/generate-perf-report.js](scripts/generate-perf-report.js) turns the resulting `summary.json` into `performance/report.md` (request count, response-time percentiles, failed-request rate, threshold pass/fail). See [How the performance scan works, code-wise](#how-the-performance-scan-works-code-wise) below for the exact mechanics.

**Invoking it:** ask for it by name against a story that already has functional coverage — e.g. "Run the qa-analyst non-functional agent for KAN-4" or "check accessibility/security/performance for KAN-13". The agent resolves `qa-artifacts/<KEY>/nonfunctional/latest.md` to figure out the next run number, executes the API and UI `@smoke` commands (scoped to that story via `@<KEY>`) with the accessibility/security env vars set, runs the k6 script, and writes a combined `nonfunctional/run-<M>/report.md` linking the three underlying reports — verified on disk before it's declared done, same discipline as step 7.

**Local setup for these two checks** (Docker + ZAP + k6) is covered in [Setup](#setup) step 5 — do that once per machine before expecting real (non-skipped) accessibility/security/performance results.

### How the accessibility scan works, code-wise

No separate a11y test suite exists — the scan is piggybacked onto the existing `@smoke` tests via an auto-fixture, not a dedicated command. Three files are responsible, in order of execution:

1. **[libs/fixtures/qaFixtures.ts](libs/fixtures/qaFixtures.ts)** — defines an `autoA11yScan` fixture registered with `{ auto: true }`, so it attaches to *every* test with no per-test opt-in required. Its body runs `await use()` first (letting the test execute), then after the test finishes it's a no-op unless both hold:
   - `A11Y_ARTIFACT_DIR` env var is set — this is the on/off switch for the whole scan
   - the page is still open (`!page.isClosed()`)

   There is **no tag check inside the fixture** — it does not care whether a test is tagged `@smoke`, `@sanity`, `@regression`, or nothing at all. Which tests get scanned is decided entirely by the invoking command's own `--grep`/tag selection: whatever subset of tests the command actually runs is the subset that gets scanned. Run with `--grep @smoke` and only `@smoke` tests are scanned; run with `--grep @KAN-4` and that story's tests are scanned instead, tag or no tag.

   When the two conditions hold, it runs `new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()` against the test's final page state and writes one JSON file per test — `{ test, specFile, url, tags, violations }` — into `A11Y_ARTIFACT_DIR`, named from a slugified test title. A scan failure is caught and only logged (`console.warn`); it never fails the underlying test.
2. **Every `spec/ui/**` spec file** (e.g. [spec/ui/pim/employee-list.spec.ts](spec/ui/pim/employee-list.spec.ts)) imports `test`/`expect` from `qaFixtures` instead of `@playwright/test` directly — that single import is what wires the fixture into every test in the file, so any test the command selects is scanned with zero test-level code.
3. **[libs/utils/a11yReport.ts](libs/utils/a11yReport.ts)**'s `generateA11yReport()` is called from `global-teardown.ts` once the entire Playwright run finishes. It reads back every per-test JSON file written in step 1, tallies violations by impact (critical/serious/moderate/minor), and writes the aggregated `accessibility/report.md`.

Which tests get scanned is therefore controlled entirely by the command line's own `--grep`/tag filter plus the `A11Y_ARTIFACT_DIR` env var — there's no tag hardcoded in the fixture and no separate scan-selection config.

### How the security scan works, code-wise

Like the accessibility scan, there's no separate security test suite and no tag check anywhere in the security code path — ZAP just watches whatever traffic the selected tests happen to generate. Three files are responsible:

1. **[playwright.config.ts:11-18](playwright.config.ts)** — builds a `zapProxy` object (`{ server: process.env.ZAP_PROXY_URL || 'http://127.0.0.1:8080' }`) only when `RUN_SECURITY_SCAN==='true'`; otherwise `undefined`. This is the on/off switch, same role as `A11Y_ARTIFACT_DIR` for accessibility.
2. **[playwright.config.ts:44-100](playwright.config.ts)** — every project (`chromium` for API, `pim-ui`/`leave-ui`/`admin-ui` for UI) sets `use.proxy: zapProxy` and `ignoreHTTPSErrors: process.env.RUN_SECURITY_SCAN === 'true'`. Playwright then transparently routes all `APIRequestContext` and browser-context traffic for that project through ZAP — no per-test or fixture code is involved at all, unlike accessibility's `autoA11yScan`. Whatever tests the invoking command's `--grep` selects (e.g. `--grep @smoke`) is simply the traffic ZAP ends up seeing; there's nothing in this project's code that filters by tag for security.
3. **[libs/utils/zapScan.ts](libs/utils/zapScan.ts)**, invoked from `global-teardown.ts` (lines 22-35) once the whole run finishes:
   - `isZapReachable()` — confirms the local ZAP daemon is up; if not, the check is skipped and reported as such (never faked).
   - `waitForPassiveScan()` — polls `/JSON/pscan/view/recordsToScan/` until ZAP's passive-scan queue drains (60s timeout).
   - `getAlerts(baseUrl)` — pulls `/JSON/core/view/alerts/` for the app's `baseURL`.
   - `writeSecurityArtifacts()` — groups alerts by risk (High/Medium/Low/Informational) and writes `security/zap-alerts.json` + `security/report.md`.

Which traffic gets analyzed is therefore controlled entirely by whichever tests the command's own `--grep`/tag filter actually ran, combined with the `RUN_SECURITY_SCAN` env var — there's no tag hardcoded anywhere in the security path, matching how accessibility scoping works.

### How the performance scan works, code-wise

Performance is fundamentally different from the two checks above: **k6 scripts never run through Playwright**, so there is no `--grep`/tag filter involved at runtime at all — `@smoke` only matters here as a manual, authoring-time correspondence, not a code mechanism.

1. **[spec/performance/_template.k6.js](spec/performance/_template.k6.js)** is the copy-from starting point for a new module's script; **[spec/performance/pim.k6.js](spec/performance/pim.k6.js)** is a real example. Both hardcode `export const options = { vus: 1, iterations: 5, thresholds: {...} }` directly in the file — this is a fixed constant in source, not a CLI flag applied at run time, and the workflow never overrides it upward.
2. **The endpoints hit are hardcoded `http.get()`/`check()` calls inside `export default function()`** — e.g. `pim.k6.js` calls `GET /api/v2/pim/employees`, `GET /api/v2/admin/jobTitles`, etc., each with a comment naming the Jira key that added it (`KAN-4: GET /api/v2/pim/employees`). There is no tag lookup, no `test-cases.md` parsing, no dynamic selection at runtime — whoever extends the script for a new story manually picks the endpoints that correspond to that module's `Type: API` `@smoke` test cases and writes a new `check()` block for them. "Smoke scope" for k6 is therefore enforced by convention at authoring time, not verified by any code.
3. **Auth** is passed in via `AUTH_COOKIE`/`AUTH_CSRF_TOKEN` environment variables read with `__ENV.AUTH_COOKIE` / `__ENV.AUTH_CSRF_TOKEN` — the only place this script touches the rest of the framework, since that cookie is captured from the same `playwright/.auth/admin.json` session file `auth-setup` writes for the tagged UI tests.
4. **`handleSummary(data)`** (in every `<module>.k6.js` file) writes k6's full metrics object as JSON to whatever path `K6_SUMMARY_FILE` points at.
5. **[scripts/generate-perf-report.js](scripts/generate-perf-report.js)** is run manually afterward (`node scripts/generate-perf-report.js <summary.json> <outDir> [vus] [iterations]`) — there's no `global-teardown.ts` hook for k6, since k6 runs as its own separate CLI process outside Playwright entirely. It parses `http_req_duration`/`http_req_failed`/`checks` out of the summary JSON and writes `performance/report.md`.

So unlike accessibility/security, performance scope isn't filtered by any tag-aware code — it's whatever endpoints a human (or the agent) chose to hardcode into that module's `.k6.js` file, based on which test cases were tagged `@smoke` when the script was last extended.

**Platform coverage:** wired into all four agent definitions — [.claude/agents/qa-analyst.md](.claude/agents/qa-analyst.md), [.codex/agents/qa-analyst.toml](.codex/agents/qa-analyst.toml), [.cursor/rules/qa-analyst.mdc](.cursor/rules/qa-analyst.mdc), and [.github/agents/qa-analyst.agent.md](.github/agents/qa-analyst.agent.md) all describe step 8 identically. The underlying mechanics (fixtures, config, scripts, templates) are platform-agnostic — driven by env vars and the Playwright/k6 CLIs.

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
