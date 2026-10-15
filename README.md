# IELTS Optimizer

IELTS Optimizer is a local-first personalized IELTS learning system. It connects Reading practice, objective-based Error Memory, equivalent Retest evidence, reflection, measured study sessions, a goal-based Heatmap, transparent Study Plan rules, Learning Network resources and a Learning Design explainer.

## Run locally

```bash
npm install
npm run dev
npm run test
npm run build
```

Public app: https://aukhaicuong123-bit.github.io/IELTS-Optimizer/

## Implemented

- Reading practice with per-question feedback and a different Retest passage testing the same objectives.
- Error history is preserved; an error closes only after a correct matching objective in Retest. New Retest errors are stored.
- Timer sessions use one React/localStorage source of truth, support pause/resume, and are labelled measured activity. No leaderboard or pressure streak is used.
- Heatmap uses study-session minutes only, local calendar dates, cross-midnight splitting, goal-based colours, planned rest dates and keyboard-accessible day cells.
- Reflection is saved on each attempt. Learning Network uses named external resources and clearly reports that real Peer Learning is unavailable in local mode.
- Learning Design maps Behaviorism, Cognitivism, Constructivism, Connectivism, TPACK and SAMR to implemented or explicitly planned features.

## Data and privacy

Learner data stays in the browser. The current storage key is `ielts-optimizer-store-v1`; older `optistudy-store-v1` data is read and migrated without replacing history. No demo history or fake peer activity is seeded.

Peer collaboration is not claimed as online functionality. A future Supabase integration would require `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, a public-safe client configuration, SQL schema and Row Level Security before it could be enabled.

IELTS practice scores are evidence from this app, not official IELTS band scores, and the product makes no claim that it improves a learner's band without learner research.
