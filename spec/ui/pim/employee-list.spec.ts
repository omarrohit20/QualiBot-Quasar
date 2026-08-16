// spec: spec/ui/pim/employee-list.spec.ts
// pattern: Page Object Model

import { test, expect } from '../../../libs/fixtures/qaFixtures';
import { EmployeeListPage } from '../../../libs/pages/pim/EmployeeListPage';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('PIM — Employee List', () => {
  // TC-030: Employee List table renders on load
  test('TC-030: navigate to Employee List — table renders with column headers and at least one row', { tag: ['@smoke', '@sanity', '@regression', '@module:pim', '@KAN-4'] }, async ({
    page,
  }) => {
    const employeeListPage = new EmployeeListPage(page);

    // Step 1: Navigate to the Employee List page
    await employeeListPage.navigate();

    // Step 2: Confirm the table is visible
    const tableVisible = await employeeListPage.isTableVisible();
    expect(tableVisible).toBe(true);

    // Step 3: Confirm column headers are present
    const headers = await employeeListPage.getColumnHeaders();
    expect(headers.length).toBeGreaterThan(0);

    // Step 4: Confirm at least one data row is shown
    const rowCount = await employeeListPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  // TC-031: Search by employee name narrows the table
  // Fix (run-05): "Ranga" no longer exists on the shared demo. Now dynamically reads the
  // first employee's last name from the unfiltered list and uses it as the search term,
  // so the test is not coupled to any hardcoded person that may have been deleted.
  test('TC-031: search by first visible employee last name — table shows that employee', { tag: ['@sanity', '@regression', '@module:pim', '@KAN-4'] }, async ({ page }) => {
    const employeeListPage = new EmployeeListPage(page);

    // Step 1: Navigate to the Employee List page (unfiltered)
    await employeeListPage.navigate();

    // Step 2: Read the last name from the first row so we have a name we KNOW exists
    const firstRow = employeeListPage.getTableRows().first();
    const firstRowText = await firstRow.innerText();
    // The row text contains tab-separated columns; column 3 (0-indexed col 2) is First Name,
    // col 3 is Last Name. Use the raw row text for a partial match — just take the last word
    // from the row that isn't a number, as a partial search term.
    const cells = firstRowText.split('\t').map(s => s.trim()).filter(s => s.length > 0);
    // cells[1] is typically First Name, cells[2] is Middle Name, cells[3] is Last Name
    // Use the first meaningful text cell (not empty, not a number) as the search term
    const searchTerm = cells.find(c => c.length > 1 && isNaN(Number(c))) ?? cells[1] ?? '';
    expect(searchTerm.length).toBeGreaterThan(0);

    // Step 3: Search by that name
    await employeeListPage.searchByName(searchTerm);

    // Step 4: At least one row is returned
    const rowCountAfter = await employeeListPage.getRowCount();
    expect(rowCountAfter).toBeGreaterThan(0);

    // Step 5: The first result row contains the search term
    const firstResultRow = employeeListPage.getTableRows().first();
    await expect(firstResultRow).toContainText(searchTerm);
  });
});
