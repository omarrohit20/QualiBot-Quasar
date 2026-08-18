# Accessibility Scan Report (axe-core)

Smoke tests scanned: 8

Total violations: 33

| Impact | Count |
|---|---|
| critical | 12 |
| serious | 21 |
| moderate | 0 |
| minor | 0 |

## Issues by test

## TC-027: navigate to Add Employee — form fields and Save button are visible

- URL: https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee
- Violations: 5

### [critical] button-name — Buttons must have discernible text

- **Description:** Ensure buttons have discernible text
- **Help:** https://dequeuniversity.com/rules/axe/4.13/button-name?application=playwright
- **Affected nodes:** 2
  - `.oxd-main-menu-button`
  - `.oxd-icon-button--solid-main`

### [serious] color-contrast — Elements must meet minimum color contrast ratio thresholds

- **Description:** Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
- **Help:** https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=playwright
- **Affected nodes:** 7
  - `.oxd-glass-button`
  - `.--parent > .oxd-topbar-body-nav-tab-item`
  - `.oxd-topbar-body-nav-tab[data-v-5327b38a=""]:nth-child(2) > .oxd-topbar-body-nav-tab-item[href="#"]`
  - `.--visited > .oxd-topbar-body-nav-tab-item[href="#"]`
  - `.oxd-topbar-body-nav-tab[data-v-5327b38a=""]:nth-child(4) > .oxd-topbar-body-nav-tab-item[href="#"]`

### [serious] html-has-lang — <html> element must have a lang attribute

- **Description:** Ensure every HTML document has a lang attribute
- **Help:** https://dequeuniversity.com/rules/axe/4.13/html-has-lang?application=playwright
- **Affected nodes:** 1
  - `html`

### [critical] label — Form elements must have labels

- **Description:** Ensure every form element has a label
- **Help:** https://dequeuniversity.com/rules/axe/4.13/label?application=playwright
- **Affected nodes:** 3
  - `.oxd-file-input`
  - `.oxd-grid-item.oxd-grid-item--gutters[data-v-c93bdbf3=""] > .oxd-input-field-bottom-space.oxd-input-group[data-v-957b4417=""] > div[data-v-957b4417=""]:nth-child(2) > .oxd-input.oxd-input--active[data-v-1f99f73c=""]`
  - `input[type="checkbox"]`

### [serious] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

- **Description:** Ensure that lists are structured correctly
- **Help:** https://dequeuniversity.com/rules/axe/4.13/list?application=playwright
- **Affected nodes:** 1
  - `.oxd-topbar-body-nav > ul`


## TC-029: fill First Name "UIAutoFN" and Last Name "UIAutoLN" — Save redirects to employee profile

- URL: https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/365
- Violations: 1

### [serious] html-has-lang — <html> element must have a lang attribute

- **Description:** Ensure every HTML document has a lang attribute
- **Help:** https://dequeuniversity.com/rules/axe/4.13/html-has-lang?application=playwright
- **Affected nodes:** 1
  - `html`


## TC-030: navigate to Employee List — table renders with column headers and at least one row

- URL: https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList
- Violations: 5

### [critical] button-name — Buttons must have discernible text

- **Description:** Ensure buttons have discernible text
- **Help:** https://dequeuniversity.com/rules/axe/4.13/button-name?application=playwright
- **Affected nodes:** 103
  - `.oxd-main-menu-button`
  - `.oxd-icon-button[data-v-b4b62742=""][type="button"]`
  - `.oxd-table-card[data-v-f2168256=""]:nth-child(1) > .oxd-table-row--clickable.oxd-table-row.oxd-table-row--with-border > .oxd-table-cell.oxd-padding-cell[role="cell"]:nth-child(9) > .oxd-table-cell-actions[data-v-c423d1fa=""] > .oxd-table-cell-action-space.oxd-icon-button[type="button"]:nth-child(1)`
  - `.oxd-table-card[data-v-f2168256=""]:nth-child(1) > .oxd-table-row--clickable.oxd-table-row.oxd-table-row--with-border > .oxd-table-cell.oxd-padding-cell[role="cell"]:nth-child(9) > .oxd-table-cell-actions[data-v-c423d1fa=""] > .oxd-table-cell-action-space.oxd-icon-button[type="button"]:nth-child(2)`
  - `.oxd-table-card[data-v-f2168256=""]:nth-child(2) > .oxd-table-row--clickable.oxd-table-row.oxd-table-row--with-border > .oxd-table-cell.oxd-padding-cell[role="cell"]:nth-child(9) > .oxd-table-cell-actions[data-v-c423d1fa=""] > .oxd-table-cell-action-space.oxd-icon-button[type="button"]:nth-child(1)`

### [serious] color-contrast — Elements must meet minimum color contrast ratio thresholds

- **Description:** Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
- **Help:** https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=playwright
- **Affected nodes:** 18
  - `.oxd-glass-button`
  - `.--parent > .oxd-topbar-body-nav-tab-item`
  - `.--visited > .oxd-topbar-body-nav-tab-item[href="#"]`
  - `.oxd-topbar-body-nav-tab[data-v-5327b38a=""]:nth-child(3) > .oxd-topbar-body-nav-tab-item[href="#"]`
  - `.oxd-topbar-body-nav-tab[data-v-5327b38a=""]:nth-child(4) > .oxd-topbar-body-nav-tab-item[href="#"]`

### [serious] html-has-lang — <html> element must have a lang attribute

- **Description:** Ensure every HTML document has a lang attribute
- **Help:** https://dequeuniversity.com/rules/axe/4.13/html-has-lang?application=playwright
- **Affected nodes:** 1
  - `html`

### [critical] label — Form elements must have labels

- **Description:** Ensure every form element has a label
- **Help:** https://dequeuniversity.com/rules/axe/4.13/label?application=playwright
- **Affected nodes:** 52
  - `div[data-v-957b4417=""]:nth-child(2) > .oxd-input.oxd-input--active[data-v-1f99f73c=""]`
  - `.oxd-checkbox-wrapper[data-v-2f1b665b=""][data-v-6179b72a=""] > label > input[type="checkbox"]`
  - `input[value="0"]`
  - `input[value="1"]`
  - `input[value="2"]`

### [serious] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

- **Description:** Ensure that lists are structured correctly
- **Help:** https://dequeuniversity.com/rules/axe/4.13/list?application=playwright
- **Affected nodes:** 1
  - `ul[data-v-5327b38a=""]`


## TC-KAN16-04: navigate to User Management Users page — all four AC column headers are visible

- URL: https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers
- Violations: 5

### [critical] button-name — Buttons must have discernible text

- **Description:** Ensure buttons have discernible text
- **Help:** https://dequeuniversity.com/rules/axe/4.13/button-name?application=playwright
- **Affected nodes:** 54
  - `.oxd-main-menu-button`
  - `.oxd-icon-button[data-v-b4b62742=""][type="button"]`
  - `.oxd-table-card[data-v-f2168256=""]:nth-child(1) > .oxd-table-row.oxd-table-row--with-border[data-v-0d5ef602=""] > .oxd-table-cell.oxd-padding-cell[role="cell"]:nth-child(6) > .oxd-table-cell-actions[data-v-c423d1fa=""] > .oxd-table-cell-action-space.oxd-icon-button[type="button"]:nth-child(1)`
  - `.oxd-table-card[data-v-f2168256=""]:nth-child(1) > .oxd-table-row.oxd-table-row--with-border[data-v-0d5ef602=""] > .oxd-table-cell.oxd-padding-cell[role="cell"]:nth-child(6) > .oxd-table-cell-actions[data-v-c423d1fa=""] > .oxd-table-cell-action-space.oxd-icon-button[type="button"]:nth-child(2)`
  - `.oxd-table-card[data-v-f2168256=""]:nth-child(2) > .oxd-table-row.oxd-table-row--with-border[data-v-0d5ef602=""] > .oxd-table-cell.oxd-padding-cell[role="cell"]:nth-child(6) > .oxd-table-cell-actions[data-v-c423d1fa=""] > .oxd-table-cell-action-space.oxd-icon-button[type="button"]:nth-child(1)`

### [serious] color-contrast — Elements must meet minimum color contrast ratio thresholds

- **Description:** Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
- **Help:** https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=playwright
- **Affected nodes:** 18
  - `.oxd-glass-button`
  - `.--visited > .oxd-topbar-body-nav-tab-item`
  - `.--parent.oxd-topbar-body-nav-tab[data-v-429cfcf3=""]:nth-child(2) > .oxd-topbar-body-nav-tab-item`
  - `.--parent.oxd-topbar-body-nav-tab[data-v-429cfcf3=""]:nth-child(3) > .oxd-topbar-body-nav-tab-item`
  - `.--parent.oxd-topbar-body-nav-tab[data-v-429cfcf3=""]:nth-child(4) > .oxd-topbar-body-nav-tab-item`

### [serious] html-has-lang — <html> element must have a lang attribute

- **Description:** Ensure every HTML document has a lang attribute
- **Help:** https://dequeuniversity.com/rules/axe/4.13/html-has-lang?application=playwright
- **Affected nodes:** 1
  - `html`

### [critical] label — Form elements must have labels

- **Description:** Ensure every form element has a label
- **Help:** https://dequeuniversity.com/rules/axe/4.13/label?application=playwright
- **Affected nodes:** 28
  - `div[data-v-957b4417=""]:nth-child(2) > .oxd-input.oxd-input--active[data-v-1f99f73c=""]`
  - `.oxd-checkbox-wrapper[data-v-2f1b665b=""][data-v-6179b72a=""] > label > input[type="checkbox"]`
  - `.oxd-table-card-cell-hidden > .oxd-checkbox-wrapper[data-v-6179b72a=""] > label > input[type="checkbox"]`
  - `input[value="1"]`
  - `input[value="2"]`

### [serious] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

- **Description:** Ensure that lists are structured correctly
- **Help:** https://dequeuniversity.com/rules/axe/4.13/list?application=playwright
- **Affected nodes:** 1
  - `.oxd-topbar-body-nav > ul`


## TC-KAN17-06: search by Username "Admin" — matching rows appear; search by Role "ESS" — ESS rows appear

- URL: https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers
- Violations: 5

### [critical] button-name — Buttons must have discernible text

- **Description:** Ensure buttons have discernible text
- **Help:** https://dequeuniversity.com/rules/axe/4.13/button-name?application=playwright
- **Affected nodes:** 36
  - `.oxd-main-menu-button`
  - `.oxd-icon-button[data-v-b4b62742=""][type="button"]`
  - `.oxd-table-card[data-v-f2168256=""]:nth-child(1) > .oxd-table-row.oxd-table-row--with-border[data-v-0d5ef602=""] > .oxd-table-cell.oxd-padding-cell[role="cell"]:nth-child(6) > .oxd-table-cell-actions[data-v-c423d1fa=""] > .oxd-table-cell-action-space.oxd-icon-button[type="button"]:nth-child(1)`
  - `.oxd-table-card[data-v-f2168256=""]:nth-child(1) > .oxd-table-row.oxd-table-row--with-border[data-v-0d5ef602=""] > .oxd-table-cell.oxd-padding-cell[role="cell"]:nth-child(6) > .oxd-table-cell-actions[data-v-c423d1fa=""] > .oxd-table-cell-action-space.oxd-icon-button[type="button"]:nth-child(2)`
  - `.oxd-table-card[data-v-f2168256=""]:nth-child(2) > .oxd-table-row.oxd-table-row--with-border[data-v-0d5ef602=""] > .oxd-table-cell.oxd-padding-cell[role="cell"]:nth-child(6) > .oxd-table-cell-actions[data-v-c423d1fa=""] > .oxd-table-cell-action-space.oxd-icon-button[type="button"]:nth-child(1)`

### [serious] color-contrast — Elements must meet minimum color contrast ratio thresholds

- **Description:** Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
- **Help:** https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=playwright
- **Affected nodes:** 18
  - `.oxd-glass-button`
  - `.--visited > .oxd-topbar-body-nav-tab-item`
  - `.--parent.oxd-topbar-body-nav-tab[data-v-429cfcf3=""]:nth-child(2) > .oxd-topbar-body-nav-tab-item`
  - `.--parent.oxd-topbar-body-nav-tab[data-v-429cfcf3=""]:nth-child(3) > .oxd-topbar-body-nav-tab-item`
  - `.--parent.oxd-topbar-body-nav-tab[data-v-429cfcf3=""]:nth-child(4) > .oxd-topbar-body-nav-tab-item`

### [serious] html-has-lang — <html> element must have a lang attribute

- **Description:** Ensure every HTML document has a lang attribute
- **Help:** https://dequeuniversity.com/rules/axe/4.13/html-has-lang?application=playwright
- **Affected nodes:** 1
  - `html`

### [critical] label — Form elements must have labels

- **Description:** Ensure every form element has a label
- **Help:** https://dequeuniversity.com/rules/axe/4.13/label?application=playwright
- **Affected nodes:** 19
  - `div[data-v-957b4417=""]:nth-child(2) > .oxd-input.oxd-input--active[data-v-1f99f73c=""]`
  - `.oxd-checkbox-wrapper[data-v-2f1b665b=""][data-v-6179b72a=""] > label > input[type="checkbox"]`
  - `input[value="0"]`
  - `input[value="1"]`
  - `input[value="2"]`

### [serious] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

- **Description:** Ensure that lists are structured correctly
- **Help:** https://dequeuniversity.com/rules/axe/4.13/list?application=playwright
- **Affected nodes:** 1
  - `.oxd-topbar-body-nav > ul`


## TC-KAN17-07: search with non-existent username — "No Records Found" message is displayed

- URL: https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers
- Violations: 5

### [critical] button-name — Buttons must have discernible text

- **Description:** Ensure buttons have discernible text
- **Help:** https://dequeuniversity.com/rules/axe/4.13/button-name?application=playwright
- **Affected nodes:** 2
  - `.oxd-main-menu-button`
  - `.--toggle[data-v-b4b62742=""]:nth-child(3) > .oxd-icon-button[type="button"]`

### [serious] color-contrast — Elements must meet minimum color contrast ratio thresholds

- **Description:** Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
- **Help:** https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=playwright
- **Affected nodes:** 20
  - `.oxd-glass-button`
  - `.--visited > .oxd-topbar-body-nav-tab-item`
  - `.--parent.oxd-topbar-body-nav-tab[data-v-429cfcf3=""]:nth-child(2) > .oxd-topbar-body-nav-tab-item`
  - `.--parent.oxd-topbar-body-nav-tab[data-v-429cfcf3=""]:nth-child(3) > .oxd-topbar-body-nav-tab-item`
  - `.--parent.oxd-topbar-body-nav-tab[data-v-429cfcf3=""]:nth-child(4) > .oxd-topbar-body-nav-tab-item`

### [serious] html-has-lang — <html> element must have a lang attribute

- **Description:** Ensure every HTML document has a lang attribute
- **Help:** https://dequeuniversity.com/rules/axe/4.13/html-has-lang?application=playwright
- **Affected nodes:** 1
  - `html`

### [critical] label — Form elements must have labels

- **Description:** Ensure every form element has a label
- **Help:** https://dequeuniversity.com/rules/axe/4.13/label?application=playwright
- **Affected nodes:** 2
  - `div[data-v-957b4417=""]:nth-child(2) > .oxd-input.oxd-input--active[data-v-1f99f73c=""]`
  - `input[type="checkbox"]`

### [serious] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

- **Description:** Ensure that lists are structured correctly
- **Help:** https://dequeuniversity.com/rules/axe/4.13/list?application=playwright
- **Affected nodes:** 1
  - `.oxd-topbar-body-nav > ul`


## TS-014: leave list table contains all AC-required column headers

- URL: https://opensource-demo.orangehrmlive.com/web/index.php/leave/viewLeaveList
- Violations: 5

### [critical] button-name — Buttons must have discernible text

- **Description:** Ensure buttons have discernible text
- **Help:** https://dequeuniversity.com/rules/axe/4.13/button-name?application=playwright
- **Affected nodes:** 2
  - `.oxd-main-menu-button`
  - `.--toggle[data-v-b4b62742=""]:nth-child(3) > .oxd-icon-button[type="button"]`

### [serious] color-contrast — Elements must meet minimum color contrast ratio thresholds

- **Description:** Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
- **Help:** https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=playwright
- **Affected nodes:** 20
  - `.oxd-glass-button`
  - `.oxd-topbar-body-nav-tab[data-v-5327b38a=""]:nth-child(1) > .oxd-topbar-body-nav-tab-item[href="#"]`
  - `.oxd-topbar-body-nav-tab[data-v-5327b38a=""]:nth-child(2) > .oxd-topbar-body-nav-tab-item[href="#"]`
  - `.--parent.oxd-topbar-body-nav-tab[data-v-429cfcf3=""]:nth-child(3) > .oxd-topbar-body-nav-tab-item`
  - `.--parent.oxd-topbar-body-nav-tab[data-v-429cfcf3=""]:nth-child(4) > .oxd-topbar-body-nav-tab-item`

### [serious] html-has-lang — <html> element must have a lang attribute

- **Description:** Ensure every HTML document has a lang attribute
- **Help:** https://dequeuniversity.com/rules/axe/4.13/html-has-lang?application=playwright
- **Affected nodes:** 1
  - `html`

### [critical] label — Form elements must have labels

- **Description:** Ensure every form element has a label
- **Help:** https://dequeuniversity.com/rules/axe/4.13/label?application=playwright
- **Affected nodes:** 2
  - `input[type="checkbox"][data-v-8e4757dc=""]`
  - `input[type="checkbox"][data-v-6179b72a=""]`

### [serious] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

- **Description:** Ensure that lists are structured correctly
- **Help:** https://dequeuniversity.com/rules/axe/4.13/list?application=playwright
- **Affected nodes:** 1
  - `.oxd-topbar-body-nav > ul`


## TS-019: unauthenticated navigation to leave list redirects to login page

- URL: about:blank
- Violations: 2

### [serious] document-title — Documents must have <title> element to aid in navigation

- **Description:** Ensure each HTML document contains a non-empty <title> element
- **Help:** https://dequeuniversity.com/rules/axe/4.13/document-title?application=playwright
- **Affected nodes:** 1
  - `html`

### [serious] html-has-lang — <html> element must have a lang attribute

- **Description:** Ensure every HTML document has a lang attribute
- **Help:** https://dequeuniversity.com/rules/axe/4.13/html-has-lang?application=playwright
- **Affected nodes:** 1
  - `html`

