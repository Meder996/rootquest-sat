# RootQuest SAT

> Decode difficult words. Unlock your SAT potential.

A gamified web app for learning SAT roots, prefixes, and suffixes through interactive lessons,
flashcards, quizzes, and spaced repetition — built around a "word garden" metaphor where every
study session grows your personal learning world.

## Features

- **Word garden world map** — Prefix Planet, Root Forest, Suffix City, SAT Arena (60-second speed rounds), Memory Garden (due reviews), and Mastery Museum (achievements & analytics).
- **160 word parts** with meanings, origins, difficulty levels, memory clues, and 320+ example words with in-context sentences.
- **1,100+ quiz questions** generated from the content bank across six question types: meaning, inference, example identification, vocabulary-in-context, sentence completion, and confusing-pair comparison.
- **Spaced repetition engine** (SM-2-inspired) — rate each card Again / Hard / Good / Easy; intervals, ease factors, and mastery states (New → Learning → Familiar → Strong → Mastered) are scheduled automatically, with "why is this due?" explanations.
- **Guided lessons** — 10 curated learning paths with mini-check questions after each word part.
- **Flashcards** — flip cards, keyboard shortcuts (Space to flip, 1–4 to rate), star difficult items.
- **Gamification** — XP, daily streaks, daily goals, and 12 unlockable achievements.
- **Progress analytics** — weekly activity chart, mastery donut, weakest-category detection, quiz history, and saved-word collections.
- **Onboarding flow** — name, SAT date, daily goal, and an optional placement quiz with a personalized plan.
- **Accessibility & responsive design** — works from 320px phones to desktop, keyboard navigable, visible focus states, respects reduced-motion preferences, dark & light themes.

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS + shadcn/ui components
- Recharts for analytics visualizations
- Lucide icons
- Local persistence via `localStorage` (frontend MVP — no backend required)

## Getting started

```bash
npm install
npm run dev      # start dev server
npm run build    # production build to dist/
```

## Project structure

```
src/
├── data/           # word-part content, question bank, achievements, lessons
├── lib/            # SRS algorithm, global store, types
├── components/     # app shell, shared cards & UI primitives (ui/)
├── pages/          # landing, onboarding, dashboard, library, detail,
│                   # flashcards, learn, quiz, review, worlds, progress, profile
└── hooks/          # shared hooks
```

## Data & privacy

This MVP stores all progress (XP, streaks, quiz history, review schedules) in the browser's
local storage only. Nothing is uploaded or shared. Clearing browser data erases progress.

## Roadmap

- Full backend with accounts, sync across devices, and admin content management
- Audio pronunciation, teacher classrooms, and offline study mode
