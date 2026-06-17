# NexusQA — AI-Powered QA Automation Portfolio

> **A production-grade test automation suite** built by Maya Erusalimsky to demonstrate real-world QA engineering skills: Playwright E2E testing, API test coverage, Page Object Model architecture, Claude AI integration, and a fully automated CI/CD pipeline.

[![CI](https://github.com/mayageva11/nexusqa/actions/workflows/ci.yml/badge.svg)](https://github.com/mayageva11/nexusqa/actions/workflows/ci.yml)
[![Playwright](https://img.shields.io/badge/Playwright-1.49.1-00D1FF?logo=playwright)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Claude API](https://img.shields.io/badge/Claude-Sonnet_4.6-BF5AF2)](https://anthropic.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## What This Project Is

NexusQA tests a real SaaS product — **Luminary Analytics**, a dashboard application with authentication, user management, analytics, and reports — across the full testing pyramid:

| Layer | What is tested | Tools |
|---|---|---|
| **E2E** | Login flows, dashboard, navigation, user CRUD, reports wizard | Playwright + POM |
| **API** | Auth endpoints, CRUD, error handling, token lifecycle | Playwright API fixtures |
| **Visual** | Responsive layouts at 1280px and 768px viewports | Playwright |
| **Security** | SQL injection inputs, auth bypass attempts | Custom assertions |

**The twist:** Claude AI is wired into the test infrastructure at runtime — generating edge-case test data, classifying failures, and producing test scenarios from plain English user stories.

---

## Live Links

| Resource | URL |
|---|---|
| Portfolio / CV | https://mayageva11.github.io/nexusqa |
| Test Reports | https://mayageva11.github.io/nexusqa/reports |
| GitHub Actions | https://github.com/mayageva11/nexusqa/actions |

---

## Project Structure

```
nexusqa/
│
├── app/                          # Luminary Analytics — the SaaS app under test
│   ├── api/
│   │   ├── server.ts             # Express + TypeScript API server
│   │   ├── store.ts              # In-memory data store with seed data
│   │   ├── routes/
│   │   │   ├── auth.ts           # POST /login, POST /logout, GET /me
│   │   │   ├── users.ts          # Full CRUD + search/sort/paginate
│   │   │   ├── metrics.ts        # Dashboard analytics data
│   │   │   └── reports.ts        # Report generation + CSV export
│   │   └── middleware/
│   │       ├── auth.middleware.ts # JWT verification
│   │       └── logger.middleware.ts
│   ├── login.html                # Auth page
│   ├── dashboard.html            # Metrics + charts
│   ├── analytics.html            # Time-series data explorer
│   ├── users.html                # User management table
│   └── reports.html              # Report wizard + export
│
├── tests/                        # The Playwright test suite
│   ├── playwright.config.ts      # 3-browser matrix, retries, artifacts
│   ├── global-setup.ts           # Pre-test auth state generation
│   ├── global-teardown.ts        # Cleanup
│   ├── fixtures/
│   │   ├── auth.fixture.ts       # adminPage / editorPage / viewerPage
│   │   └── api.fixture.ts        # adminApi / unauthApi
│   ├── helpers/
│   │   ├── page-objects/         # LoginPage, DashboardPage, UsersPage, ReportsPage
│   │   ├── assertions/           # Custom Playwright matchers
│   │   └── claude-generator.ts   # Claude API integration
│   ├── e2e/
│   │   ├── auth/                 # login, logout, session persistence
│   │   ├── dashboard/            # metrics, navigation, widgets
│   │   ├── users/                # CRUD, search, sort, permissions
│   │   └── reports/              # wizard flow, export, undo/redo
│   └── api/                      # auth.api, users.api, metrics.api
│
├── portfolio/
│   └── index.html                # CV / portfolio landing page
│
└── .github/workflows/
    ├── ci.yml                    # Full pipeline on push/PR
    ├── nightly.yml               # 02:00 UTC regression + Allure deploy
    └── pr-check.yml              # Smoke suite on every PR
```

---

## Test Coverage

```
234 tests  ·  3 browsers (Chromium, Firefox, WebKit)  ·  ~90 seconds total
```

### E2E Tests

**Authentication** (`tests/e2e/auth/`)
- Valid login redirects to dashboard; invalid credentials show inline error
- SQL injection in email field returns 401, not 500
- Very long inputs (1000+ chars) handled without crash
- Remember-me checkbox persists token across browser sessions
- Logout clears localStorage, invalidates server-side session, blocks re-entry to protected routes

**Dashboard** (`tests/e2e/dashboard/`)
- All 4 metric cards render with real numeric values (not placeholder dashes)
- Trend indicators (▲/▼) reflect actual data direction from the API
- Chart.js canvases have non-zero pixel dimensions (chart rendered, not empty)
- Sidebar navigation routes to correct pages with correct active state
- Activity feed shows timestamped items
- Layout is correct at both 1280px and 768px viewports

**User Management** (`tests/e2e/users/`)
- Table loads with paginated data (10 users per page)
- Search input filters rows in real time by name and email
- Sort by name toggles ascending/descending
- Add user: happy path creates record; empty form shows validation errors; invalid email format is rejected
- Delete: confirmation dialog required; cancelling preserves the record
- Role-based UI: viewer sees the table but not admin-only action buttons

**Reports** (`tests/e2e/reports/`)
- 3-step wizard: name input → config → confirm → generate
- Step 1 validation blocks progression when fields are empty
- Generated report appears in the list immediately after creation
- Delete shows undo toast; clicking undo restores the report
- CSV download button present on each report card

### API Tests

**Auth API** (`tests/api/auth.api.spec.ts`)

| Request | Expected |
|---|---|
| `POST /api/auth/login` valid credentials | 200 + JWT token |
| `POST /api/auth/login` wrong password | 401 |
| `POST /api/auth/login` missing email | 400 + message |
| `GET /api/auth/me` with valid token | 200 + user profile |
| Any protected endpoint, no token | 401 |
| Any protected endpoint, bad token | 403 |
| `POST /api/auth/logout` | 200, token invalidated |

**Metrics API** (`tests/api/metrics.api.spec.ts`)
- Response shape: `cards[]`, `series[]`, `trafficSources[]`, `topPages[]`
- Exactly 4 cards; each has `id`, `label`, `value` (string), `change` (number), `trend` (`up` or `down`)
- Series has exactly 30 entries with ISO date strings and positive session/revenue values

**Users API** (`tests/api/users.api.spec.ts`)
- GET returns paginated list with total count and page metadata
- Search query parameter filters correctly
- POST creates user and returns 201 with the new resource
- PUT updates role, response immediately reflects the change
- DELETE removes user; subsequent GET by ID returns 404
- POST with missing required fields returns 400 with field-level error messages

---

## Claude AI Integration

The file `tests/helpers/claude-generator.ts` connects to the Anthropic API and provides three functions used by tests at runtime.

### 1. `generateTestUsers(count)` — Smarter test data

Instead of hardcoded fixtures or generic faker data, Claude produces users that are realistic and full of the edge cases that often hide bugs:

```typescript
const users = await generateTestUsers(10);
// Example output:
// { name: "Ñoño García-López",  email: "user+tag@sub.domain.io",   role: "editor" }
// { name: "张伟",                email: "zhang.wei@company.co.uk",  role: "viewer" }
// { name: "O'Brien-Smith, Jr.", email: "long.email.address+test@subdomain.example.com", role: "admin" }
```

Unicode names, tagged emails, hyphenated surnames — real-world inputs that reveal encoding bugs, validation gaps, and display truncation issues.

### 2. `analyzeFailure(testName, errorMessage)` — Automatic failure triage

When a test fails in CI, Claude reads the error message and classifies it before it lands in the Allure report:

```typescript
const analysis = await analyzeFailure(
  'should load users table with data',
  'Timeout 5000ms exceeded waiting for [data-testid="users-table"]'
);
// Returns:
// {
//   rootCause: "element not visible within timeout — possible race condition on data fetch",
//   severity: "flaky",
//   suggestedFix: "increase timeout or add explicit wait for API response",
//   isFlaky: true
// }
```

This means the Allure report tells you *why* a test failed, not just *that* it failed.

### 3. `generateTestScenario(userStory)` — Spec-to-test in one call

Write a user story in plain English, get back a structured test plan:

```typescript
const scenario = await generateTestScenario(
  'As an admin, I want to filter users by role so I can find editors quickly'
);
// Returns:
// {
//   title: "Filter users table by role",
//   preconditions: ["logged in as admin", "users table has mixed roles"],
//   steps: ["navigate to /users", "select 'editor' from role dropdown", ...],
//   assertions: ["only editor rows visible", "row count matches total editors"],
//   edgeCases: ["filter with no matching users", "switch filter while search active"]
// }
```

---

## CI/CD Pipeline

### `ci.yml` — Every push and pull request

```
push / pull_request
        │
        ▼
  lint-and-typecheck ── tsc --noEmit (app/ and tests/)
        │
        ▼
    start-app ── PORT=3001, health-check retry loop
        │
   ┌────┴────┐
   ▼         ▼
e2e-tests  api-tests
(matrix)
┌──────────┐
│ chromium │
│ firefox  │  ← run in parallel
│ webkit   │
└──────────┘
        │
        ▼
  report-summary ── posts ✅/❌ comment on the PR with pass/fail counts
        │
        ▼ (main branch only)
  deploy-portfolio ── portfolio/index.html → GitHub Pages
```

Each browser uploads its own artifact. If Firefox fails but Chromium passes, the failure is isolated in the report.

### `pr-check.yml` — Smoke gate on every PR

Runs only the 13 tests tagged `@smoke`. Completes in under 60 seconds. Blocks merge if any smoke test fails. Fast feedback without waiting for the full matrix.

### `nightly.yml` — Full regression at 02:00 UTC

Runs all 234 tests on `main`. Generates an Allure report with history trends and deploys it to GitHub Pages at `/reports`. Catches regressions introduced across the day before anyone starts work in the morning.

---

## Running Locally

### Requirements
- Node.js 18+
- An Anthropic API key — only needed for the three Claude-powered tests in `claude-generator.ts`. All other 231 tests run without it.

### Step 1 — Install

```bash
# Install app dependencies
cd app && npm install

# Install test dependencies + browsers
cd ../tests && npm install
npx playwright install
```

### Step 2 — Configure

```bash
# From the project root
cp .env.example .env
```

Edit `.env`:
```
PORT=3001
JWT_SECRET=any-random-string-here
BASE_URL=http://localhost:3001
ANTHROPIC_API_KEY=sk-ant-...   # optional
```

### Step 3 — Start the app

```bash
cd app
npm start
# Luminary Analytics running on http://localhost:3001
```

Open `http://localhost:3001` and log in with any of these accounts:

| Email | Password | Role |
|---|---|---|
| `admin@luminary.io` | `Test1234!` | Admin — full access |
| `editor@luminary.io` | `Test1234!` | Editor — read + edit |
| `viewer@luminary.io` | `Test1234!` | Viewer — read only |

### Step 4 — Run tests

```bash
cd tests

# All 234 tests, all 3 browsers
npx playwright test

# Smoke suite only — 13 tests, ~60 seconds
npx playwright test --grep @smoke

# One browser
npx playwright test --project=chromium

# One file
npx playwright test e2e/auth/login.spec.ts

# Interactive UI mode
npx playwright test --ui

# Open the HTML report
npx playwright show-report
```

### With Docker

```bash
# From the project root
docker-compose up --build
# App starts, tests run, report is saved to playwright-report/
```

---

## Page Object Model

Every page interaction goes through a typed Page Object. Tests never contain raw selectors — they read like a specification:

```typescript
// tests/helpers/page-objects/DashboardPage.ts
export class DashboardPage {
  readonly metricsGrid: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.metricsGrid = page.getByTestId('metrics-grid');
    this.logoutButton = page.getByTestId('logout-btn');
  }

  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
    await this.page.waitForURL(/dashboard/);
    await expect(this.metricsGrid).toBeVisible({ timeout: 15000 });
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
    await this.page.waitForURL('**/login');
  }
}
```

```typescript
// tests/e2e/auth/logout.spec.ts — no selectors, reads like plain English
test('should log out and redirect to login', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.goto();
  await dashboard.logout();
  await expect(page).toHaveURL(/login/);
});
```

---

## Pre-Authenticated Fixtures

Tests that need a logged-in user get a ready-made browser context — no login flow in every test:

```typescript
// tests/fixtures/auth.fixture.ts
export const test = base.extend<{
  adminPage: Page;
  editorPage: Page;
  viewerPage: Page;
}>({
  adminPage: async ({ browser }, use) => {
    const ctx = await browser.newContext({
      storageState: path.join(__dirname, '../auth-state/admin.auth.json'),
    });
    const page = await ctx.newPage();
    await use(page);
    await ctx.close();
  },
});
```

`global-setup.ts` runs once before the suite, logs in as each user, and saves the storage state (localStorage JWT). Tests import `{ test }` from this fixture file and receive a pre-authenticated page in milliseconds.

---

## Tech Stack

| Category | Technology |
|---|---|
| Test framework | Playwright 1.49.1 |
| Language | TypeScript 5.x (strict mode) |
| AI integration | Anthropic Claude API (`claude-sonnet-4-6`) |
| App backend | Express 4 + ts-node |
| App frontend | Vanilla HTML/CSS/JS + Chart.js |
| Auth | JWT (jsonwebtoken) |
| CI/CD | GitHub Actions |
| Test reports | Playwright HTML + Allure |
| Containers | Docker + Docker Compose |

---

## About

**Maya Erusalimsky** — QA Automation Engineer

QA Automation Engineer with 1.5 years of production experience at Kissterra, and a B.Sc. in Computer Science from the College of Management Academic Studies. I write TypeScript and Python, work in Agile teams, and care about the full picture — from test architecture to CI/CD to deployment.

- **Email:** mayageva11@gmail.com
- **LinkedIn:** https://linkedin.com/in/maya-erusalimsky
- **GitHub:** https://github.com/mayageva11
- **Portfolio:** https://mayageva11.github.io/nexusqa
