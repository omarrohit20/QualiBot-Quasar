// global-teardown.ts - Playwright global teardown configuration
//
// Turns the existing @smoke UI run into accessibility/security artifacts, without
// adding any separate tests:
// - If A11Y_ARTIFACT_DIR is set, libs/fixtures/qaFixtures.ts already scanned every
//   @smoke test with axe-core during the run; this just aggregates those per-test
//   JSON files into one report.
// - If RUN_SECURITY_SCAN=true, the UI projects proxied their traffic through ZAP
//   (see playwright.config.ts); this waits for ZAP's passive scan queue to drain
//   and pulls the resulting alerts for the app's baseURL into a security report.
import { FullConfig } from '@playwright/test';
import { generateA11yReport } from './libs/utils/a11yReport';
import { isZapReachable, waitForPassiveScan, getAlerts, writeSecurityArtifacts } from './libs/utils/zapScan';

async function globalTeardown(config: FullConfig) {
  const a11yDir = process.env.A11Y_ARTIFACT_DIR;
  if (a11yDir) {
    generateA11yReport(a11yDir);
    console.log(`[a11y] accessibility report written to ${a11yDir}/report.md`);
  }

  if (process.env.RUN_SECURITY_SCAN === 'true') {
    const securityDir = process.env.SECURITY_ARTIFACT_DIR || 'qa-artifacts/security/latest';
    const baseUrl = config.projects[0]?.use?.baseURL || 'https://opensource-demo.orangehrmlive.com';

    if (!(await isZapReachable())) {
      console.warn('[security] ZAP daemon not reachable — skipping security artifact generation.');
      return;
    }

    await waitForPassiveScan();
    const alerts = await getAlerts(baseUrl);
    writeSecurityArtifacts(securityDir, baseUrl, alerts);
    console.log(`[security] security report written to ${securityDir}/report.md`);
  }
}

export default globalTeardown;
