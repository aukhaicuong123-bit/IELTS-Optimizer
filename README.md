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

- Reading practice with per-question feedback, passage evidence cues and a different Retest passage testing the same authored equivalence key. Every Retest targets one explicit difficulty/occurrence pair.
- Error history is preserved; the Learning Engine derives occurrence state conservatively from reliable evidence. Historical Retest IDs alone never prove success.
- Listening uses browser-generated speech with honest labelling, playback controls and a transcript fallback. It is not an official IELTS recording.
- Writing supports Academic Task 1, Academic Task 2 and General Training Task 1 practice, local draft autosave, word count and transparent rule-based revision cues.
- Speaking supports browser recording/playback where available, transcript/notes fallback and local practice history without fabricated pronunciation or band scores.
- Vocabulary and Grammar review activities are linked to real Error Memory and save correction evidence to Learning Record.
- Timer sessions store active intervals, exclude paused time, survive reloads as paused sessions and are labelled measured activity. No leaderboard or pressure streak is used.
- Heatmap uses measured active intervals, local calendar dates, cross-midnight splitting, goal-based colours, planned rest dates, activity counts, skill summaries and keyboard-accessible day cells.
- Reflection is saved on each attempt. Learning Network uses named external resources and clearly reports that real Peer Learning is unavailable in local mode.
- Learning Design maps Behaviorism, Cognitivism, Constructivism, Connectivism, TPACK and SAMR to implemented or explicitly planned features.

## Data and privacy

Learner data stays in the browser. The current storage key is `ielts-optimizer-store-v1`; older `optistudy-store-v1` data is read and migrated without replacing history. No demo history or fake peer activity is seeded.

Peer collaboration is not claimed as online functionality. A future Supabase integration would require `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, a public-safe client configuration, SQL schema and Row Level Security before it could be enabled.

IELTS practice scores are evidence from this app, not official IELTS band scores, and the product makes no claim that it improves a learner's band without learner research.
