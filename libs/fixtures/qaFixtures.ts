// libs/fixtures/qaFixtures.ts
// Shared test/expect wrapper for existing UI specs. Adds an automatic accessibility
// (axe-core) scan on every test that actually runs when A11Y_ARTIFACT_DIR is set — no
// new tests are created, existing tests just get an extra passive check hooked in.
// Which tests get scanned is controlled entirely by the invoking command's own
// --grep/tag selection, not by any tag check here.
import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'fs';
import * as path from 'path';

const A11Y_ARTIFACT_DIR = process.env.A11Y_ARTIFACT_DIR;

function slugify(name: string): string {
  return name
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 80);
}

export const test = base.extend<{ autoA11yScan: void }>({
  autoA11yScan: [
    async ({ page }, use, testInfo) => {
      await use();

      if (!A11Y_ARTIFACT_DIR) return;
      if (page.isClosed()) return;

      try {
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();

        fs.mkdirSync(A11Y_ARTIFACT_DIR, { recursive: true });
        const outFile = path.join(A11Y_ARTIFACT_DIR, `${slugify(testInfo.title)}.json`);
        fs.writeFileSync(
          outFile,
          JSON.stringify(
            {
              test: testInfo.title,
              specFile: testInfo.file,
              url: page.url(),
              tags: testInfo.tags,
              violations: results.violations,
            },
            null,
            2,
          ),
        );
      } catch (err) {
        console.warn(`[a11y] axe scan failed for "${testInfo.title}": ${(err as Error).message}`);
      }
    },
    { auto: true },
  ],
});

export { expect };
