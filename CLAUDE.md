# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Keep responses extremely concise. Focus on key information only. Avoid long explanations and large code dumps unless explicitly requested.

we're building the app descripbed in @spec.md. Read that file for general architectural tasks or to double-check the exact database structure, tech stach or application architecture.

Keep your replies extremely conscise and focus on conveying the key information. No unnecessary fluff, no long code snippets.

Whenever working with any third-party library or something similar, you MUST look up the official documentation to ensure that you're working with up-to-date information.

Use the DocsExplorer subagent for efficient documentation lookup.

---

## Project Overview

Virtual Pet Fitness is a **gamified fitness tracker web app** — client-only, no backend, no auth, no external DB.

Users log workouts, calories, and diet habits to evolve a virtual pet through stages:

**Egg → Pup → Blossom → Fighter → Queen** (at levels 1, 3, 6, 10, 15)

100 XP = 1 Level.

---

## Tech Stack

- Vue 3 (Composition API)
- Vite
- Tailwind CSS
- localStorage (only persistence)

---

## Dev Commands

```bash
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview build
```

---

## Architecture

### State (`src/store/state.js`)

Single global reactive state persisted to localStorage under key `flarepup-v5`. Autosave with ~600ms debounce via `loadState()` / `saveState()` in `src/store/persistence.js`.

```js
{
  xp: 0,
  level: 1,
  workouts: [],
  dietHabits: {},
  calories: { eaten: 0, burned: 0, goal: 2000 },
  streaks: { workout: 0, diet: 0, deficit: 0 },
  calHistory: []  // 60-day rolling history
}
```

### XP Sources

- Logging a workout
- Completing diet habit checklist items
- Achieving a calorie deficit

### Streaks

Three streaks (`workout`, `diet`, `deficit`), each with `{ count, lastDate }`. Check for resets on first interaction each day.

### Predictions (`src/utils/predictions.js`)

30-day projections based on recent averages: calories, workouts, XP gain.

---

## Component Layout

```
App.vue
  Header
  Pet.vue          ← reacts to level/mood; moods: idle, happy, excited, diet, workout
  WorkoutLogger.vue ← types: Strength, Walking, Boxing, Tennis, Custom
  DietHabits.vue   ← daily checklist: Water, Vegetables, Protein, No junk food, Balanced meals; resets daily
  CaloriesTracker.vue
  StatsPanel.vue
```

---

## Code Rules

- Vue Composition API only
- Separate logic into `src/utils/` (xp.js, dates.js, predictions.js)
- Prefer computed values over manual recalculation
- Keep components small; push logic to utils
