# OptiStudy

OptiStudy is a local-first Personalized IELTS Learning System. The MVP connects a learner profile, Reading practice, Error Memory, Retest evidence, study planning, real study sessions, a data-backed heatmap, recommendations, and a learning record.

## Run locally

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run build
```

## Public access

The project includes a GitHub Pages workflow. After GitHub Pages is enabled with **GitHub Actions** as its source, the public app is available at:

https://aukhaicuong123-bit.github.io/IELTS-Optimizer/

## Product assumptions

- The Reading score is a practice result, not an official IELTS band estimate.
- The initial Retest flow preserves the original error and adds a new attempt record; an expanded content catalogue can add more equivalent questions later.
- All learner history is stored in `localStorage` under a versioned schema. No demo history is seeded.
- Study time and learning progress are intentionally reported as separate evidence streams.
- Listening, Writing and Speaking are represented by extensible types but are not claimed as implemented MVP modules.
