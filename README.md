# NexusQA — QA Automation Portfolio Project

**Built by Maya Erusalimsky** | QA Automation Engineer

[![CI](https://github.com/mayageva11/nexusqa/actions/workflows/ci.yml/badge.svg)](https://github.com/mayageva11/nexusqa/actions/workflows/ci.yml)
[![Nightly](https://github.com/mayageva11/nexusqa/actions/workflows/nightly.yml/badge.svg)](https://github.com/mayageva11/nexusqa/actions/workflows/nightly.yml)
[![Allure Report](https://img.shields.io/badge/Allure_Report-live-cyan)](https://mayageva11.github.io/nexusqa/reports)
[![Browsers](https://img.shields.io/badge/browsers-Chromium_%7C_Firefox_%7C_WebKit-blue)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6)](https://www.typescriptlang.org)

---

## 👋 What Is This Project?

This is a **complete, real-world QA automation project** I built from scratch to demonstrate professional automation engineering skills.

It includes two parts:

1. **A web application** called *Luminary Analytics* — a SaaS-style analytics dashboard with login, user management, reports, and charts. I built it myself so I would have something realistic to test.

2. **A full test suite** for that application — 234 automated tests covering every feature, written in Playwright and TypeScript, running in a real CI/CD pipeline on GitHub Actions.

The goal was to build something that looks and works exactly like a real job — not a tutorial, not a toy project.

---

## 🌐 Live Demo & Portfolio

| | Link |
|---|---|
| **My Portfolio / CV** | **https://mayageva11.github.io/nexusqa** |
| **Test Report (Allure)** | **https://mayageva11.github.io/nexusqa/reports** |
| GitHub Actions (CI runs) | https://github.com/mayageva11/nexusqa/actions |
| Source Code | https://github.com/mayageva11/nexusqa |

---

## 💼 What Skills Does This Demonstrate?

| Skill | How it appears in this project |
|---|---|
| **Playwright** | 234 tests across E2E, API, and visual layers |
| **TypeScript** | Everything is strictly typed — app, tests, fixtures, helpers |
| **Page Object Model** | All pages have a typed POM class — tests never contain raw selectors |
| **Test fixtures** | Pre-authenticated browser sessions for admin/editor/viewer roles |
| **API testing** | Full HTTP-level tests for auth, users, and metrics endpoints |
| **CI/CD** | GitHub Actions pipeline — lint, typecheck, 3-browser matrix, deploy |
| **AI integration** | Claude API used to generate edge-case test data and triage failures |
| **Security testing** | SQL injection, XSS inputs, auth bypass — all covered |
| **Cross-browser** | Tests run in Chromium, Firefox, and WebKit on every push |
| **Responsive testing** | Layout checks at 1280px and 768px viewports |

---

## 🧪 What Is Tested?

### The Application Under Test: Luminary Analytics

A multi-page SaaS dashboard with:
- **Login page** — JWT-based authentication with role management
- **Dashboard** — real-time metric cards, charts, activity feed
- **Users page** — full CRUD table with search, sort, and pagination
- **Reports page** — 3-step wizard to generate and export reports
- **Analytics page** — time-series data visualization

### Test Layers

**E2E Tests** — `tests/e2e/`

These tests open a real browser and interact with the app like a user would:

- Login: valid credentials, wrong password, SQL injection attempt, very long input, remember-me
- Logout: clears token, invalidates server session, blocks re-entry to protected pages
- Dashboard: all 4 metric cards show real values, charts render, sidebar navigation works
- Users: search filters in real time, add/delete with confirmation dialogs, role-based UI (viewer can't see admin buttons)
- Reports: complete 3-step wizard flow, delete with undo toast, CSV export button

**API Tests** — `tests/api/`

These test the backend directly via HTTP — no browser:

- Auth: valid login returns a JWT, wrong password returns 401, missing fields return 400
- Protected routes: no token → 401, bad token → 403, logout invalidates token server-side
- Users: create, read, update, delete all return correct status codes and response shapes
- Metrics: response has exactly the right fields, 30 days of data, no null/NaN values

**Visual / Responsive Tests**

- Page layout at desktop (1280px) and tablet (768px) — no broken overflow or hidden elements

---

## 🤖 Claude AI Integration

I wired the **Anthropic Claude API** directly into the test infrastructure. It does three things:

**1. Generates realistic edge-case test data**

Instead of fake names like "Test User 1", Claude generates users with Unicode names, tagged emails, hyphens, apostrophes — the kind of input that actually breaks things:

```
Ñoño García-López   user+tag@sub.domain.io
张伟                 zhang.wei@company.co.uk
O'Brien-Smith, Jr.  long.address+test@subdomain.example.com
```

**2. Analyzes test failures automatically**

When a test fails in CI, Claude reads the error message and explains why — was it a flaky test, a real bug, or an environment issue? The CI report shows the diagnosis, not just "FAILED".

**3. Converts user stories into test plans**

Give it a sentence like *"As an admin I want to filter users by role"* and it returns a structured list of test steps, assertions, and edge cases.

---

## ⚙️ CI/CD Pipeline

Every time I push to GitHub, this runs automatically:

```
Push to main
    │
    ├─ Typecheck (TypeScript strict mode, app + tests)
    │       │
    │       └─ Deploy portfolio → GitHub Pages (mayageva11.github.io/nexusqa)
    │
    ├─ Start the app server (with health check retry)
    │
    ├─ Run all tests in parallel:
    │       ├─ Chromium  ──┐
    │       ├─ Firefox   ──┼─ each uploads allure-results/
    │       └─ WebKit    ──┘
    │
    ├─ Run API tests ──────── uploads allure-results/
    │
    └─ Merge all allure-results → generate Allure HTML report
            └─ Deploy report → GitHub Pages (/reports)
```

If any test fails, the pipeline goes red and I get the failure reason with screenshots and traces attached.

**Three workflows:**
- `ci.yml` — runs on every push and pull request (full suite)
- `pr-check.yml` — runs smoke tests only on every PR (fast, ~60 seconds, blocks merge on failure)
- `nightly.yml` — runs the full suite every night at 2:00 AM UTC and publishes a trend report

---

## 🚀 How to Run It Yourself

### Requirements
- Node.js 18 or higher
- That's it. An Anthropic API key is optional (only 3 tests use it).

### Step 1 — Install

```bash
# Install the app
cd app && npm install

# Install the tests and browsers
cd ../tests && npm install && npx playwright install
```

### Step 2 — Configure

```bash
cp .env.example .env
# The defaults work out of the box — no changes needed to get started
```

### Step 3 — Start the app

```bash
cd app
npm start
```

App is now running at **http://localhost:3001**

Login with any of these accounts:

| Email | Password | What you can do |
|---|---|---|
| `admin@luminary.io` | `Test1234!` | Everything |
| `editor@luminary.io` | `Test1234!` | Read and edit |
| `viewer@luminary.io` | `Test1234!` | Read only |

### Step 4 — Run the tests

```bash
cd tests

# Run everything
npx playwright test

# Quick smoke check (13 tests, ~60 seconds)
npx playwright test --grep @smoke

# One browser only
npx playwright test --project=chromium

# Open visual test UI
npx playwright test --ui

# See the HTML report after a run
npx playwright show-report
```

---

## 🗂️ Project Structure

```
nexusqa/
│
├── app/                     ← The web app being tested
│   ├── api/
│   │   ├── server.ts        ← Express server with JWT auth
│   │   ├── store.ts         ← Seed data (users, metrics, reports)
│   │   └── routes/          ← auth, users, metrics, reports APIs
│   ├── login.html           ← Login page
│   ├── dashboard.html       ← Metrics + charts
│   ├── users.html           ← User management table
│   ├── reports.html         ← Report wizard
│   └── analytics.html       ← Data explorer
│
├── tests/                   ← The Playwright test suite
│   ├── playwright.config.ts ← 3-browser config, retries, artifacts
│   ├── global-setup.ts      ← Logs in once and saves auth state
│   ├── fixtures/
│   │   ├── auth.fixture.ts  ← Gives tests a pre-logged-in browser
│   │   └── api.fixture.ts   ← Gives tests an authenticated HTTP client
│   ├── helpers/
│   │   ├── page-objects/    ← One class per page (LoginPage, DashboardPage…)
│   │   ├── assertions/      ← Custom Playwright matchers
│   │   └── claude-generator.ts ← AI test data + failure analysis
│   ├── e2e/                 ← Browser-level tests (auth, dashboard, users, reports)
│   └── api/                 ← HTTP-level tests (auth, users, metrics)
│
├── portfolio/
│   └── index.html           ← My CV / portfolio page (live at GitHub Pages)
│
└── .github/workflows/
    ├── ci.yml               ← Full pipeline on every push
    ├── pr-check.yml         ← Smoke tests on every PR
    └── nightly.yml          ← Full suite every night
```

---

## 🛠️ Tech Stack

| | |
|---|---|
| Test framework | Playwright 1.49.1 |
| Language | TypeScript (strict mode throughout) |
| AI | Anthropic Claude API |
| App backend | Node.js + Express + JWT |
| App frontend | HTML / CSS / JavaScript + Chart.js |
| CI/CD | GitHub Actions |
| Test reports | Playwright HTML Report + Allure |
| Containers | Docker + Docker Compose |

---

## 👩‍💻 About Me

I'm **Maya Erusalimsky**, a QA Automation Engineer.

I have 1.5 years of experience in production QA at Kissterra, a B.Sc. in Computer Science from the College of Management Academic Studies, and I'm looking for a role where I can keep building test infrastructure that teams actually rely on.

This project is the best way I know to show what I can do — not a list of buzzwords, but working code.

📧 mayageva11@gmail.com
🔗 https://linkedin.com/in/maya-erusalimsky
🐙 https://github.com/mayageva11
🌐 https://mayageva11.github.io/nexusqa
