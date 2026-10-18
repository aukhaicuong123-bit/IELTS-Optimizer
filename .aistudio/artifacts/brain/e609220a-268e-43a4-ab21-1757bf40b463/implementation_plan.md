# IELTS Optimizer — Implementation Plan: Question Bank Expansion & Safe AI Backend

A comprehensive plan to expand the Question Bank with diverse, verified practice tasks across all 4 skills, followed by the implementation of a full-stack Express server architecture with a server-side Gemini API proxy for personalized, evidence-grounded AI feedback.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The user confirmed the following decisions:
> 1. **Immediate Focus**: **"Add more practice questions to the Question Bank first"** — enrich the catalog with rich, diverse IELTS tasks across Reading, Listening, Writing, and Speaking before wiring backend AI.
> 2. **AI Backend Architecture**: **"Full-stack Express backend with server-side Gemini API proxy"** — `server.ts` running Express mounting Vite middleware in dev (`"dev": "tsx server.ts"`), with a dedicated `/api/ai/*` route that keeps the Gemini API key strictly server-side.

- **Confirmed Decision 1**: Expand the Question Bank from 8 seed items to a rich catalog (16+ verified items) covering high-frequency IELTS topics: *Environment, Education, Science & Technology, Health & Medicine, Urban Living, Culture & Heritage, Global Economy, Crime & Law*.
- **Confirmed Decision 2**: Express backend proxy (`/api/ai/coach` and `/api/health`) using `@google/genai` TypeScript SDK with model `'gemini-3.8-flash'` for structured essay evaluation and approach hints.

---

### 1. Overview & Core Concept

- **What It Does**:
  1. **Question Bank Expansion**: Adds comprehensive practice items for all four skills with full schema validation, verbatim evidence quotes in passages/transcripts, complete 4-criteria IELTS rubrics, and equivalence groups for targeted Retest.
  2. **Safe Full-Stack AI Backend**: Sets up an Express server (`server.ts`) that protects `GEMINI_API_KEY` in environment variables, validates client payloads, enforces word/token limits, and streams or returns structured JSON assessments without exposing secrets to the browser.
- **Key Value**: Provides learners with sufficient breadth of verified practice material while paving the foundation for AI Coach evaluation without relying on brittle rule-based regexes or leaking API keys.

---

### 2. User Experience & Visual Design

#### A. Question Bank Catalog Experience
- **Expanded Skill Coverage**:
  - **Reading**: Academic passages with Multiple Choice, True/False/Not Given, Yes/No/Not Given, and Matching Headings.
  - **Listening**: Form completion (Section 1), Multiple choice (Section 2/3), Academic lecture notes (Section 4) with synthetic speech audio synthesis.
  - **Writing**: Academic Task 1 (Process diagrams, Bar charts, Comparative tables), General Training Task 1 (Formal & Semi-formal letters), and Task 2 (Opinion essays, Discussion essays, Problem-Solution).
  - **Speaking**: Complete Part 1 interview sets, Part 2 cue cards with 60s/120s timers, and Part 3 abstract discussion follow-ups.
- **Search & Filtering**:
  - Filter chips and search bar instantly index the expanded catalog with zero latency.
  - Difficulty badges (`Foundation`, `Intermediate`, `Advanced`, `Expert`) clearly indicate target band score ranges.

#### B. Visual Hierarchy & Aesthetic Direction
- Maintain the dark theme palette: Canvas `#101614`, Surface `#18211e`, Hairline borders `#2e3d37`.
- Primary actions and active chips in Mint `#b9f2c3`.
- Strict **Zero-Pill Discipline** for metadata (`Skill · Topic · Difficulty · Item Count`), preventing visual clutter.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Modular Content Organization**
  - *Chosen Approach*: Keep seed items in typed files (`src/seedQuestionBank.ts` or partitioned by skill `src/content/questionBank/`) validated at test time and build time.
  - *Why*: Guaranteed type safety, instant client-side searching, and 0-latency browsing while preserving fail-closed filtering.
  - *Alternatives Considered*: Bundling everything into LocalStorage (rejected: fragile and subject to quota limits).

- **Decision 2: Express Server with Vite Middleware**
  - *Chosen Approach*: `server.ts` entry point running Express with `vite.middlewares` mounted in development (`"dev": "tsx server.ts"`).
  - *Why*: Aligns with AI Studio full-stack requirements, enables server-side environment variable security for `GEMINI_API_KEY`, and supports single-port deployment on port 3000.
  - *Alternatives Considered*: Client-side API calls (rejected: forbidden by spec as it leaks API keys to the browser).

- **Decision 3: Structured AI Evaluation Schema**
  - *Chosen Approach*: Strict JSON schema for AI Coach output: `{ overallAssessment, criteria: { taskAchievementOrResponse, coherenceAndCohesion, lexicalResource, grammaticalRangeAndAccuracy }, evidenceQuotes, priorityIssues, actionableRevisions, nextExercise }`.
  - *Why*: Prevents generic "AI slop" or vague praise; forces grounding in specific quotes from the student's submission.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Browser / React Client                          │
│  - QuestionBankView: Instant search & filter over approved items       │
│  - ActivePracticeRunner: Reading / Listening / Writing / Speaking      │
│  - Draft autosave in LocalStorage                                      │
│  - POST /api/ai/coach { taskPrompt, studentResponse, taskType }        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP JSON Request
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Node.js / Express Backend (server.ts)              │
│  - Port 3000 (0.0.0.0)                                                 │
│  - Vite middlewares mounted in dev mode                                │
│  - Input validation (min words, payload sanitization, rate limit)      │
│  - Reads process.env.GEMINI_API_KEY securely                           │
│  - Calls @google/genai SDK (model: 'gemini-3.8-flash')                 │
│  - Validates structured JSON response before returning to client       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS (Server-Side Only)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Google Gemini API                               │
│  - Grounded essay evaluation, criteria scores, verbatim quotes         │
└────────────────────────────────────────────────────────────────────────┘
```

#### Step-by-Step Execution Sequence

1. **Step 1 — Question Bank Expansion**:
   - Add 8+ new comprehensive, verified items to `src/seedQuestionBank.ts`:
     * 2 Reading items: *Renewable Ocean Thermal Energy* (Yes/No/Not Given & Summary Completion), *Cognitive Benefits of Bilingualism* (Matching Headings & Multiple Choice).
     * 2 Listening items: *Student Accommodation Rental Inquiry* (Section 1 Form Completion), *Wildlife Conservation Biome Project* (Section 3 Discussion).
     * 2 Writing items: *Academic Task 1: Global Energy Production Trends (Bar Chart)*, *General Training Task 1: Formal Letter of Complaint to Airline*.
     * 2 Speaking items: *Part 1: Travel & Public Transport*, *Part 2/3: Describe a Difficult Decision You Made*.
   - Run batch validator: verify all new items have valid answer keys, verbatim evidence quotes, complete rubrics, and approved status.
   - Run `npm test` to verify test suite with the expanded dataset.

2. **Step 2 — Full-Stack Express Backend Setup (`server.ts`)**:
   - Install `express`, `tsx`, and `@google/genai`.
   - Update `package.json` dev script: `"dev": "tsx server.ts"`.
   - Create `server.ts` binding to `0.0.0.0:3000`, mounting Vite dev middleware, health check endpoint (`/api/health`), and AI analysis endpoint (`/api/ai/coach`).
   - Add `.env.example` with `GEMINI_API_KEY=`.

3. **Step 3 — AI Coach Service & Verification**:
   - Create server-side endpoint handler with strict input validation and fallback handling if API key is not configured or fails.
   - Verify with tests and compilation.
