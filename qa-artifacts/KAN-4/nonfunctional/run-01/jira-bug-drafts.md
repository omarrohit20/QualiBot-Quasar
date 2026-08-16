# KAN-4 Non-Functional Jira Bug Drafts — run-01

These are draft bugs for non-functional findings from nonfunctional/run-01. DO NOT file without explicit confirmation. Before filing each confirmed draft, a single confirmation re-run will be performed to verify the finding still reproduces.

---

## BUG-NF-001 [Accessibility — critical] Buttons missing discernible text on PIM screens

**Summary:** PIM Add Employee and Employee List screens: navigation/icon buttons have no discernible text (axe-core: button-name)

**Environment:** https://opensource-demo.orangehrmlive.com — PIM module

**Steps to Reproduce:**
1. Log in as Admin.
2. Navigate to PIM > Add Employee or PIM > Employee List.
3. Run an axe-core accessibility audit on the page.

**Expected:** All buttons have discernible text or aria-label so screen readers can identify them.

**Actual:** axe-core reports `button-name` violation (critical) on `.oxd-main-menu-button` and `.oxd-icon-button--solid-main`. Affected nodes: 2+ per page.

**Severity:** Critical (WCAG 2.1 SC 4.1.2 — Name, Role, Value)

**Linked Epic/Story:** KAN-4

---

## BUG-NF-002 [Accessibility — critical] Form inputs missing labels on PIM screens

**Summary:** PIM Add Employee and Employee List screens: multiple form inputs (file input, text input, checkbox) lack programmatic labels (axe-core: label)

**Environment:** https://opensource-demo.orangehrmlive.com — PIM module

**Steps to Reproduce:**
1. Log in as Admin.
2. Navigate to PIM > Add Employee.
3. Run an axe-core accessibility audit on the page.

**Expected:** All form inputs have an associated label element or aria-label attribute.

**Actual:** axe-core reports `label` violation (critical) on file input, text input inside a grid item, and checkbox. Affected nodes: 3 per page.

**Severity:** Critical (WCAG 2.1 SC 1.3.1 — Info and Relationships; SC 4.1.2)

**Linked Epic/Story:** KAN-4

---

## BUG-NF-003 [Accessibility — serious] Insufficient color contrast on navigation items

**Summary:** PIM screens: multiple navigation tab items and glass buttons fail WCAG 2 AA minimum contrast ratio thresholds (axe-core: color-contrast)

**Environment:** https://opensource-demo.orangehrmlive.com — PIM module

**Steps to Reproduce:**
1. Log in as Admin.
2. Navigate to any PIM screen.
3. Run an axe-core accessibility audit.

**Expected:** All text elements meet WCAG 2 AA minimum contrast ratio (4.5:1 for normal text, 3:1 for large text).

**Actual:** axe-core reports `color-contrast` violation (serious) on `.oxd-glass-button` and multiple `.oxd-topbar-body-nav-tab-item` elements. Affected nodes: 7+ per page.

**Severity:** Serious (WCAG 2.1 SC 1.4.3 — Contrast Minimum)

**Linked Epic/Story:** KAN-4

---

## BUG-NF-004 [Accessibility — serious] HTML element missing lang attribute site-wide

**Summary:** All OrangeHRM pages: the html element is missing a lang attribute, preventing screen readers from using the correct language profile (axe-core: html-has-lang)

**Environment:** https://opensource-demo.orangehrmlive.com — all pages

**Steps to Reproduce:**
1. Navigate to any page on the application.
2. Inspect the html element or run an axe-core audit.

**Expected:** html element has a lang attribute (e.g. lang="en").

**Actual:** axe-core reports `html-has-lang` violation (serious) on the html element across all scanned pages.

**Severity:** Serious (WCAG 2.1 SC 3.1.1 — Language of Page)

**Linked Epic/Story:** KAN-4

---

## BUG-NF-005 [Security — High] Vulnerable JavaScript library in chunk-vendors.js

**Summary:** OrangeHRM front-end bundles a known-vulnerable JavaScript library in chunk-vendors.js

**Environment:** https://opensource-demo.orangehrmlive.com

**Steps to Reproduce:**
1. Load https://opensource-demo.orangehrmlive.com/web/dist/js/chunk-vendors.js
2. Run OWASP ZAP passive scan or inspect the bundle against known CVE databases.

**Expected:** All bundled JavaScript libraries are up-to-date with no known vulnerabilities.

**Actual:** ZAP passive scan identifies a vulnerable library with medium confidence (CWE-1395). The specific library version can be confirmed by examining the bundle.

**Severity:** High

**Linked Epic/Story:** KAN-4

---

## BUG-NF-006 [Security — Medium] Missing anti-clickjacking header on login page

**Summary:** The login page (and other authenticated pages) does not include Content-Security-Policy: frame-ancestors or X-Frame-Options, leaving the app vulnerable to clickjacking attacks.

**Environment:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/login

**Steps to Reproduce:**
1. Make a GET request to the login page.
2. Inspect response headers for X-Frame-Options or CSP frame-ancestors directive.

**Expected:** Response includes X-Frame-Options: DENY or SAMEORIGIN, or Content-Security-Policy: frame-ancestors 'none' / 'self'.

**Actual:** Neither header is present. ZAP reports Missing Anti-clickjacking Header (CWE-1021).

**Severity:** Medium

**Linked Epic/Story:** KAN-4

---

## BUG-NF-007 [Security — Medium] Weak Content Security Policy (wildcard directive, unsafe-inline)

**Summary:** OrangeHRM CSP allows wildcard sources, unsafe-inline for script-src and style-src, and fails to define directives with no fallback — significantly weakening XSS protection.

**Environment:** https://opensource-demo.orangehrmlive.com

**Steps to Reproduce:**
1. Make requests to the login and auth/validate pages.
2. Inspect the Content-Security-Policy response header.

**Expected:** CSP specifies explicit allowed sources with no wildcards, no unsafe-inline, and all directives with fallback defined.

**Actual:** ZAP reports CSP: Wildcard Directive, CSP: script-src unsafe-inline, CSP: style-src unsafe-inline, and CSP: Failure to Define Directive with No Fallback across multiple URLs (CWE-693).

**Severity:** Medium

**Linked Epic/Story:** KAN-4

---

## Performance threshold breach — NOT a bug

The k6 http_req_failed=100% threshold breach is a test-infrastructure issue (missing CSRF token in k6 HTTP client), not an application defect. No Jira bug is drafted for this finding.
