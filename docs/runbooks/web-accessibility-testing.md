# Public Web Accessibility Testing

## Scope

The automated suite scans the current public routes in `apps/web` with axe
rules tagged for WCAG 2.0, 2.1, and 2.2 Level A/AA. It also confirms that an
unknown route returns HTTP 404 and provides a named recovery link.

Automated checks do not replace manual accessibility review.

## Prerequisites

Install workspace dependencies and the pinned Chromium browser:

```powershell
corepack pnpm install --ignore-scripts
corepack pnpm --filter @haitigov/web exec playwright install chromium
```

## CI and non-Windows execution

The Playwright configuration starts and stops the web development server:

```powershell
corepack pnpm --filter @haitigov/web run test:accessibility
```

## Windows local execution

If Playwright cannot stop the Next.js child process cleanly, run the server in
one terminal:

```powershell
corepack pnpm --filter @haitigov/web exec next dev --hostname 127.0.0.1 --port 3100
```

Then run the suite in a second terminal:

```powershell
$env:CI = "true"
$env:PLAYWRIGHT_REUSE_SERVER = "true"
corepack pnpm --filter @haitigov/web run test:accessibility
```

Stop the development server after the tests finish.

## Manual release review

Before completing the accessibility tracker item, test at minimum:

- complete keyboard operation and visible focus order;
- NVDA or another representative screen reader;
- browser zoom to 200% and text spacing overrides;
- 320 CSS-pixel reflow without two-dimensional scrolling except where allowed;
- reduced-motion and forced-colors behavior;
- Haitian Creole and French labels, errors, and recovery instructions;
- cognitive clarity of service steps and error messages.

Record the browser, assistive technology, version, reviewer, date, affected
routes, and any defects found. Do not mark the tracker item complete until
material defects are resolved or explicitly release-blocked.
