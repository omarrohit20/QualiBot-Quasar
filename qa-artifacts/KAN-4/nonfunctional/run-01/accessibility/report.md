# Accessibility Scan Report (axe-core)

Smoke tests scanned: 3

Total violations: 11

| Impact | Count |
|---|---|
| critical | 4 |
| serious | 7 |
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

- URL: https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/196
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

