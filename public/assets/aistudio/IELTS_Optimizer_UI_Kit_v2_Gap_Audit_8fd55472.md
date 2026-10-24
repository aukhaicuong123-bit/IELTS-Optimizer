# IELTS Optimizer — UI Implementation Kit v2 Gap Audit

**Audit date:** 23 October 2026  
**Repository:** https://github.com/aukhaicuong123-bit/IELTS-Optimizer  
**Production:** https://aukhaicuong123-bit.github.io/IELTS-Optimizer/  
**Latest verified commit:** `1bf010321352984e36fd556cd88b18f3c745ae37` — `fix: stabilize post-redesign progression and simulators`  
**Latest deploy workflow:** https://github.com/aukhaicuong123-bit/IELTS-Optimizer/actions/runs/39901180272

## Executive verdict

The user's concern is valid. The repository has received a meaningful visual refresh, but the evidence does **not** support calling it a complete implementation of `IELTS_Optimizer_UI_Implementation_Kit_v2`. The current state is best described as a **partial redesign and visual skin over existing screens**, with some good new illustrations/components and targeted stabilization fixes. It is not yet accepted against all screen references and responsive states in the kit.

The latest GitHub Actions deployment on `main` completed successfully for `1bf0103`. This is not currently just a stale deployment problem. A successful build/deploy proves that the application compiled and published; it does not prove that every screen visually matches the 18 reference screens or passes interaction/viewport acceptance.

**Important verification limitation:** I reviewed the ZIP specifications and current GitHub source and confirmed the deploy workflow. I could not capture the live site in a browser from this environment, so this report does not claim a pixel-by-pixel screenshot comparison of the production site.

## What is already in place

- Light cream/mint/forest-green theme and responsive-scoped rules have been added.
- Existing sidebar/nav grouping remains present in `src/App.tsx`.
- Journey/mountain assets and 20 section SVGs exist in `public/assets/` and are referenced through `src/uiAssets.ts`.
- Dashboard has a Journey (`ForumStudyTree`), one recommendation-driven mission card, learner profile summary, real timer, recent evidence, and a heatmap.
- Reading includes a themed intro, topic selection, authored passages/questions, submit/scoring, and retest handling.
- Listening, Writing and Speaking use a shared `SkillPractice` screen with themed introduction plus existing practice controls.
- Exam Library has a themed hero, module/search filters, cards, and empty state.
- Vocabulary and Grammar hubs have themed illustration headers and real learning interactions.
- Recent stabilization made Grammar completion idempotent by activity ID, unified known-vocabulary counting, and scoped style overrides to exam simulators/results.
- Existing test/build reports and the latest deployment indicate technical build health. Visual acceptance is still unverified.

## Screen-by-screen gap assessment

Status meanings: **Partial** = substantial pieces exist but current code/spec evidence does not show full reference-level implementation; **Needs implementation/verification** = a required layout or acceptance behavior appears absent or is not demonstrated.

| Kit screen | Current assessment | Evidence / remaining gap |
|---|---|---|
| 01 Dashboard | **Partial** | Journey + mission + profile + timer + evidence + heatmap exist. Order is Journey → Mission → **Profile → Timer** → Evidence → Heatmap, while the kit prioritizes Timer/Today before Profile/Evidence. The four skill tiles repeat the same global `targetBand` under Listening/Reading/Writing/Speaking, which can look like four measured skill bands despite not being skill-specific evidence. |
| 02 Onboarding / goals | **Needs implementation** | Current `Profile()` is a single form with Save/Reset; the staged onboarding/stepper experience shown by the reference is not evidenced. Keep it inside Profile if that fits the route model; do not invent a dead route. |
| 03 Today missions | **Partial** | One recommendation-driven `DashboardMissionCard` exists. The reference's broader task/secondary-action hierarchy is not clearly implemented. Any secondary mission must be backed by real plan/recommendation data, not placeholders. |
| 04 Learning Journey | **Closest to target, still verify** | `ForumStudyTree` and journey/milestone assets exist. Test rank progress, milestone states, mobile stacking/scrolling, and the full component against `04-journey.png`; a mountain background alone is not acceptance. |
| 05 Exam Library | **Partial, strongest non-dashboard screen** | Hero, filters, cards and empty state have themed classes/assets. Verify 1440→320 px layout, filter/search empty states, card metadata, and consistency between every card and its actual exam collection. |
| 06 Exam Runner | **Partial / high-priority visual gap** | Reading/Listening/Writing/Speaking simulator components still contain many legacy inline dark colors. The stabilization commit mostly adds `.exam-simulator-*` wrappers and CSS overrides. This can produce state-specific inconsistencies and is not equivalent to reworking runner hierarchy, navigation, timer, question status and mobile layout to the reference. |
| 07 Exam Results | **Partial / high-priority visual gap** | Result views use some of the same legacy inline styles and depend on broad/scoped CSS overrides. Verify each skill has a deliberately composed result view, truthful metrics, answer review, retry/return actions, and no fabricated band for Writing/Speaking. |
| 08 Reading Practice | **Partial** | Has themed intro, topic/passages/questions and retest evidence logic. Verify all reference states (selected, unanswered, submitted, review, empty, retest) and mobile passage/question interaction, not only the initial screen. |
| 09 Listening Practice | **Partial** | The shared `SkillPractice` includes audio upload/source controls and question practice. Verify real playback states, progress, section changes, transcript disclosure and no fake waveform/progress when no audio is playing. |
| 10 Writing Lab | **Partial** | Task 1/Task 2, chart stimuli, editor and save/evaluation scaffolding exist. Verify the editor is the main workspace, drafts survive errors, feedback reflects actual available results, and mobile keyboard/scroll behavior. |
| 11 Speaking Practice | **Partial** | Recording controls and prompt flows exist. Verify permission request, recording/stopped/saved/error/unsupported states, timer synchronization, and that no unsupported AI band/feedback is shown. |
| 12 Vocabulary Hub | **Partial** | Topic-based hub, known-word persistence, quiz/cards and illustration are present. Compare card/quiz/filter layouts to the reference; verify empty search and duplicate XP/known toggles. |
| 13 Grammar Hub | **Partial** | CEFR levels, rules, examples and drills are present. Latest duplicate-completion fix is good, but the whole page still needs reference-level layout review and interaction-state QA. |
| 14 Error Memory / Retest | **Partial** | `Errors()` and evidence/retest engine exist. Verify open/resolved/insufficient-evidence states, occurrence-level retest identity and empty state against the screen reference. |
| 15 Analytics / Heatmap | **Needs stronger screen composition** | `ActivityHeatmapHub` is real and rendered on Dashboard, but `Record()` contains Learning Record/history sections and does not mount `ActivityHeatmapHub`. The Analytics/Heatmap reference therefore is not clearly delivered as a coherent analytics experience. Integrate metrics/chart/heatmap into an existing route such as Record or Dashboard; do not create a dead sidebar route. |
| 16 Profile / Settings | **Partial** | Existing form and persistence remain. Needs reference-level grouping, clear goal-setting flow, validation/help/error states and carefully confirmed reset action. |
| 17 Component Library | **Needs implementation/verification** | CSS contains many screen-specific and legacy rules; there is no clear evidence that common controls/states were normalized as a consistent reusable library. Define the shared tokens/components actually needed without creating an unnecessary framework. |
| 18 Empty / Loading / Responsive | **Needs explicit acceptance** | Some empty states, focus rules and breakpoints exist, but there is no verified screenshot/interaction evidence for all screens at 1440, 1024, 768, 390 and 320 px, nor for empty/loading/error/success states. |

## Root cause

This is not mainly a missing-asset problem. Assets are present. The main gap is implementation depth:

1. Some screens received a new intro/banner and palette, while much of the old DOM/layout remains.
2. The simulator redesign relies on CSS overrides over legacy inline styles instead of consistently structured light-theme components and explicit state layouts.
3. Dashboard, onboarding and analytics composition do not fully follow the screen-by-screen spec.
4. Source-code changes and successful CI have been used as a proxy for visual acceptance, but the required screenshot comparison has not been completed.

## Highest-priority fixes

### P0 — Correct truthfulness and major layout gaps

1. In Dashboard, reorder the hierarchy to follow the kit: Journey → Next Mission → Timer/Today → Profile/skill evidence → Recent Evidence → Heatmap, while retaining useful information and not duplicating quote-like content.
2. Replace the four repeated global target-band values in the skill snapshot with genuine per-skill evidence when available; otherwise show `Chưa có dữ liệu`. Keep the overall target band visibly labeled as a target, not an achieved/current skill band.
3. Implement the onboarding/goal-setting stepper inside Profile or an existing valid route. Preserve the current field validation and persistence keys.
4. Compose the Analytics/Heatmap experience coherently using real sessions/attempts/submissions and units. The heatmap must continue to represent activity time, never mastery.
5. Redesign active and result states of all four exam simulators to the reference layout, replacing the legacy dark-inline visual patterns with reusable light-theme classes/tokens where practical. Keep actual timer/scoring/submission behavior unchanged.

### P1 — Screen fidelity and interaction states

6. Compare all 18 references one by one. Fix layout hierarchy, card proportions, typography, spacing, illustration scale, empty states and responsive transitions. Do not use reference screenshots as live UI images.
7. Verify Reading, Listening, Writing, Speaking, Vocabulary, Grammar and Error Memory states listed in the kit; retain their existing domain logic and persistence.
8. Ensure a single visual token system is used across screens. Avoid appending another broad `!important` patch layer to compensate for each inline color.
9. Test the unchanged sidebar, navigation targets, keyboard focus, reduced motion and narrow mobile overflow.

## Mandatory visual acceptance gate before declaring completion

For **each of the 18 reference screens**:

- Render the real React application, not a mockup image, at 1440, 1024, 768, 390 and 320 px where relevant.
- Capture actual browser screenshots and compare side by side with the corresponding `references/screens/*.png`.
- Check initial state and key interaction states: hover/focus, active/selected, empty, submitted/result, loading/error where applicable.
- Check no horizontal overflow, clipped CTA, overlapping text, unreadable contrast or broken GitHub Pages assets.
- Verify all buttons do what their labels promise and domain values come from real data.
- Run `npm test`, `npm run build`, `npm run lint` if present, and `git diff --check`.
- Only after both functional checks and screenshot review pass, commit/push and verify the GitHub Actions deployment.

## Recommended instruction to the coding agent

> Treat this report and `IELTS_Optimizer_UI_Implementation_Kit_v2/` as the acceptance contract. Do not interpret the existing redesign commit as completion. Audit the actual DOM/layout of every view, implement the remaining screen-level composition and missing onboarding/analytics presentation, then visually verify all 18 reference screens using real browser screenshots at desktop/tablet/mobile widths. Prefer fixing components and shared tokens over adding broad CSS overrides. Preserve sidebar, current routes, storage schema, study content, scoring, timer, XP/rank, heatmap meaning, Error Memory occurrence identity and all existing interactions. Do not claim completion without a screenshot comparison matrix, passing tests/build, and a verified successful deploy. When a build passes, deploy automatically as authorized; never deploy a broken build or claim a deploy happened unless the workflow confirms it.
