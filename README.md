# NexusQA — QA Automation Portfolio Project

**Built by Maya Erusalimsky** · QA Automation Engineer

[![CI](https://github.com/mayageva11/nexusqa/actions/workflows/ci.yml/badge.svg)](https://github.com/mayageva11/nexusqa/actions/workflows/ci.yml)
[![Nightly](https://github.com/mayageva11/nexusqa/actions/workflows/nightly.yml/badge.svg)](https://github.com/mayageva11/nexusqa/actions/workflows/nightly.yml)
[![Allure Report](https://img.shields.io/badge/Allure_Report-live-cyan)](https://mayageva11.github.io/nexusqa/reports)
[![Browsers](https://img.shields.io/badge/browsers-Chromium_%7C_Firefox_%7C_WebKit-blue)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6)](https://www.typescriptlang.org)

---

## What Is This?

This repository contains **two things** that belong together:

**1. A SaaS web application I built called Luminary Analytics**
A realistic analytics dashboard — login system, user management, charts, and reports. I built it from scratch specifically to have a production-like product to test. You can use it live right now.

**2. A complete automated test suite for that application**
234 tests written in Playwright and TypeScript. They run automatically on GitHub Actions across three browsers (Chromium, Firefox, WebKit) every time I push code. The results are published as a live Allure report.

The point of the project is to show what a professional QA automation setup looks like in practice — not a tutorial exercise, but a real test suite for a real running application.

---

## The Three Things to Look At

| | What it is | Link |
|---|---|---|
| 🖥️ **Live App** | Luminary Analytics — the SaaS app being tested | **https://luminary-analytics.onrender.com** |
| 📊 **Test Report** | Allure report — every test, pass/fail, with traces | **https://mayageva11.github.io/nexusqa/reports** |
| 👩‍💻 **Portfolio / CV** | My background and how this project was built | **https://mayageva11.github.io/nexusqa** |

---

## The Live App — Luminary Analytics

**https://luminary-analytics.onrender.com**

This is the application the tests run against. It is a multi-page SaaS analytics dashboard with:

- **Login page** — JWT authentication, three user roles (admin / editor / viewer)
- **Dashboard** — live metric cards (sessions, revenue, users, conversion rate), charts, activity feed
- **Users page** — full user management table with search, sorting, pagination, add/edit/delete
- **Reports page** — 3-step wizard to generate reports, CSV export, delete with undo
- **Analytics page** — time-series data explorer

**Log in and try it yourself:**

| Email | Password | What this role can do |
|---|---|---|
| `admin@luminary.io` | `Test1234!` | Everything — full admin access |
| `editor@luminary.io` | `Test1234!` | View and edit data, cannot manage users |
| `viewer@luminary.io` | `Test1234!` | Read-only, no edit or admin controls |

> The app runs on Render's free tier — the first load may take up to 30 seconds if it has been idle.

---

## The Test Report — Allure

**https://mayageva11.github.io/nexusqa/reports**

Every test run produces an Allure HTML report that is published automatically to GitHub Pages. It shows:

- Pass / fail status for all 234 tests
- Which browser each test ran on
- Screenshots and traces attached to any failure
- Trend graphs that accumulate across nightly runs

The report is regenerated on every push to `main` and every night at 2:00 AM UTC.

---

## Skills Demonstrated

| Skill | How it appears in this project |
|---|---|
| **Playwright** | 234 tests across E2E, API, and visual layers |
| **TypeScript** | Strict mode throughout — app, tests, fixtures, helpers |
| **Page Object Model** | Every page has a typed POM class — no raw selectors in tests |
| **Test fixtures** | Pre-authenticated browser sessions per role (admin/editor/viewer) |
| **API testing** | Full HTTP-level tests for auth, users, and metrics endpoints |
| **CI/CD** | GitHub Actions — lint, typecheck, 3-browser matrix, auto-deploy |
| **AI integration** | Claude API for edge-case test data generation and failure triage |
| **Security testing** | SQL injection, XSS inputs, auth bypass attempts |
| **Cross-browser** | Every test runs in Chromium, Firefox, and WebKit |
| **Responsive testing** | Layout verified at 1280px, 768px, and 390px viewports |

---

## What the Tests Cover

**E2E Tests** (`tests/e2e/`) — real browser, real interactions

- **Auth:** valid login, wrong password, SQL injection in email field, very long inputs, remember-me, logout clears session and blocks re-entry
- **Dashboard:** all 4 metric cards show real values (not dashes), charts render, navigation works, layout holds at mobile/tablet sizes
- **Users:** search filters live, add user with validation, delete with confirmation dialog, role-based UI differences between admin and viewer
- **Reports:** 3-step wizard completes end-to-end, delete triggers undo toast, CSV button present

**API Tests** (`tests/api/`) — HTTP requests directly, no browser

| Endpoint | What is verified |
|---|---|
| `POST /api/auth/login` | 200 + JWT for valid credentials, 401 for wrong password, 400 for missing fields |
| `GET /api/auth/me` | Returns user profile when token is valid, 401 when it is not |
| `POST /api/auth/logout` | Token is invalidated server-side — same token returns 403 afterward |
| `GET /api/users` | Paginated list with correct metadata |
| `POST /api/users` | Creates user, returns 201, validation errors return 400 |
| `DELETE /api/users/:id` | Removes user, subsequent GET returns 404 |
| `GET /api/metrics` | Correct shape — 4 cards, 30-day series, no null or NaN values |

---

## CI/CD Pipeline

Every push to `main` triggers this pipeline automatically:

```
Push to main
    │
    ├─ TypeScript typecheck (app + tests, strict mode)
    │       │
    │       └─ Deploy portfolio page → GitHub Pages
    │
    ├─ Start the Express app server
    │
    ├─ Run all tests in parallel across 3 browsers:
    │       ├─ Chromium ──┐
    │       ├─ Firefox  ──┼─ each uploads allure-results/
    │       └─ WebKit   ──┘
    │
    ├─ Run API tests → uploads allure-results/
    │
    └─ Merge results → generate Allure HTML report
            └─ Deploy to GitHub Pages at /reports
```

Three workflows run in total:
- **`ci.yml`** — full suite on every push and pull request
- **`pr-check.yml`** — smoke tests only on every PR (~60 seconds, blocks merge on failure)
- **`nightly.yml`** — full suite at 2:00 AM UTC, publishes report with accumulated history

---

## AI Integration — Claude API

Three functions in `tests/helpers/claude-generator.ts` connect to the Anthropic Claude API at test runtime:

**`generateTestUsers(count)`** — produces realistic edge-case users instead of "Test User 1":
```
Ñoño García-López    user+tag@sub.domain.io
张伟                  zhang.wei@company.co.uk
O'Brien-Smith, Jr.   long.address+test@subdomain.example.com
```

**`analyzeFailure(testName, errorMessage)`** — when a test fails in CI, Claude classifies it: is it a real bug, a flaky timeout, or an environment issue? The Allure report shows the diagnosis alongside the failure.

**`generateTestScenario(userStory)`** — converts a plain-English user story into structured test steps, assertions, and edge cases.

---

## Running It Locally

### Requirements
- Node.js 18 or higher
- Anthropic API key is optional (only 3 tests use it — all others run without it)

### Start the app

```bash
cd app
npm install
npm run dev
```

App runs at **http://localhost:3001** — use the same login credentials as above.

### Run the tests

```bash
cd tests
npm install
npx playwright install   # downloads browser binaries

npx playwright test                      # all 234 tests, all 3 browsers
npx playwright test --grep @smoke        # 13 smoke tests, ~60 seconds
npx playwright test --project=chromium   # one browser only
npx playwright test --ui                 # interactive visual mode
npx playwright show-report               # open HTML report after a run
```

---

## Project Structure

```
nexusqa/
│
├── app/                        ← Luminary Analytics — the SaaS app under test
│   ├── api/
│   │   ├── server.ts           ← Express server, JWT auth, routes
│   │   ├── store.ts            ← In-memory data store with seed data
│   │   └── routes/             ← auth · users · metrics · reports
│   ├── login.html              ← Login page
│   ├── dashboard.html          ← Metrics dashboard
│   ├── users.html              ← User management
│   ├── reports.html            ← Report wizard
│   └── analytics.html          ← Data explorer
│
├── tests/                      ← The Playwright test suite
│   ├── playwright.config.ts    ← 3-browser config, retries, Allure reporter
│   ├── global-setup.ts         ← Logs in as each role, saves auth state once
│   ├── fixtures/
│   │   ├── auth.fixture.ts     ← adminPage / editorPage / viewerPage
│   │   └── api.fixture.ts      ← Authenticated HTTP client for API tests
│   ├── helpers/
│   │   ├── page-objects/       ← LoginPage · DashboardPage · UsersPage · ReportsPage
│   │   ├── assertions/         ← Custom Playwright matchers
│   │   └── claude-generator.ts ← AI test data and failure analysis
│   ├── e2e/                    ← Browser tests: auth · dashboard · users · reports
│   └── api/                    ← HTTP tests: auth · users · metrics
│
├── portfolio/
│   └── index.html              ← CV / portfolio page (live at GitHub Pages)
│
├── render.yaml                 ← One-click deploy config for Render.com
│
└── .github/workflows/
    ├── ci.yml                  ← Full pipeline on every push
    ├── pr-check.yml            ← Smoke gate on every pull request
    └── nightly.yml             ← Full suite + trend report every night
```

---

## Tech Stack

| Category | Technology |
|---|---|
| Test framework | Playwright 1.49.1 |
| Language | TypeScript 5 (strict mode) |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) |
| App backend | Node.js · Express · JWT |
| App frontend | HTML · CSS · JavaScript · Chart.js |
| CI/CD | GitHub Actions |
| Test reports | Allure · Playwright HTML |
| Hosting | Render (app) · GitHub Pages (report + portfolio) |

---

## About Me

I'm **Maya Erusalimsky**, a QA Automation Engineer with 1.5 years of production experience at Kissterra and a B.Sc. in Computer Science from the College of Management Academic Studies.

I built this project to give a concrete answer to the question every hiring team asks: *"What have you actually built?"*

📧 mayageva11@gmail.com
🔗 https://linkedin.com/in/maya-erusalimsky
🐙 https://github.com/mayageva11
🌐 https://mayageva11.github.io/nexusqa
