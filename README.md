# Decathlon India — Playwright TypeScript starter

This starter is for the first automation wave based on the manual test cases:

- HOME-001 — homepage loads
- SEARCH-001 — valid backpack search
- SEARCH-002 — no-results search
- PRODD-007 — open a product detail page from a listing

## 1. Install

```bash
npm install
npx playwright install chromium
```

## 2. Run tests

Run in headless mode:

```bash
npm test
```

Run with a visible browser:

```bash
npm run test:headed
```

Open Playwright's interactive test runner:

```bash
npm run test:ui
```

Open the HTML report after a test run:

```bash
npm run test:report
```

## 3. Project structure

```text
decathlon-playwright-starter/
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── README.md
└── tests/
    └── smoke.spec.ts
```

## Notes

- The target is the public Decathlon India storefront. Tests do not sign in, place orders, or submit payment.
- The current T-shirt listing URL and product page are live-site references, not guarantees that the catalog will never change.
- Product prices are deliberately not hard-coded because prices and availability can change.
- Run the suite headed the first time. If a locator fails, inspect the live page and update the locator rather than adding arbitrary waits.
- The selectors are based on accessible text/roles and the search placeholder exposed by the current public site. The live website may change its UI or accessible names.
