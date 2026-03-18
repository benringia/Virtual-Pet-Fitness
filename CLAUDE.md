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

## Feature Rules

Do NOT remove or rewrite existing systems unless explicitly instructed.

Existing core systems include:

- XP system
- Workout logging
- Custom workout logging
- Diet habits
- Calorie tracking
- Streak tracking
- Monthly predictions
- Pet evolution

When implementing new features, extend the existing architecture rather than replacing it.

### Custom Workout Logging

Users can log custom activities.

UI includes:
- text input for activity name
- intensity buttons:
  - light (+15 XP)
  - medium (+25 XP)
  - custom (+20 XP)

When logged:
- add entry to workout history
- award XP based on intensity
- trigger workout mood
- update workout streak

### Monthly Predictions

Show 30-day projections based on recent activity.

Prediction categories:
- calories
- workouts
- xp & level

Use rolling averages:

Calories
- use last 7 days average calorie deficit
- project 30-day deficit
- estimate weight change using:
  3500 kcal ≈ 1 lb fat

Workouts
- use last 14 days workout count
- compute weekly average
- project workouts over 30 days

XP & Level
- use last 14 days average XP gain
- project XP over 30 days
- compute projected level based on:
  100 XP = 1 level

UI behavior:
- predictions shown in StatsPanel.vue
- tabs: calories / workouts / xp & level
- locked until at least one calorie day is logged

Data windows:

- Calories predictions → last 7 days
- Workout predictions → last 14 days
- XP predictions → last 14 days

Ignore missing days when calculating averages.

## UI Rules

UI must follow the existing design system:

- pastel color palette
- rounded cards
- pill-style buttons
- subtle borders
- minimal shadows

Use Tailwind utilities only.
Avoid introducing new UI frameworks.

## Component Design Rules

Components should remain small and focused.

Guidelines:

- Components should generally stay under ~200 lines.
- Business logic should live in `src/utils/` or `src/store/`, not inside components.
- Components should primarily handle:
  - UI rendering
  - user interactions
  - calling utility functions

Avoid placing calculations, prediction logic, XP math, or state mutations directly inside components.

Use:

- `computed()` for derived values
- `watch()` only when necessary
- composable helper functions if logic is reused

Example structure:

Component
  → handles UI
  → calls util function

utils/
  → contains calculations and reusable logic

store/
  → contains state mutations and persistence

  ### Pet Naming

Users can rename their pet.

The pet name is displayed in the header next to the evolution stage.

Example:
FLAREPUP · PUP

Behavior:

- clicking the edit icon allows the user to rename the pet
- the name becomes a text input while editing
- pressing Enter or clicking outside saves the new name
- empty names should revert to the previous value
- trim whitespace
- maximum length: 20 characters

Persistence:

The name must be stored in the global state and persisted through the existing localStorage autosave.

Example state addition:

petName: "Flarepup"

The evolution stage label (Egg, Pup, Blossom, Fighter, Queen) must still be determined by the level system and should not be editable.

### Daily Reset System

Some values reset every day while progress persists.

Daily reset affects:

- diet habits checklist
- calorie input fields
- temporary daily counters

The reset happens automatically when the user interacts with the app on a new day.

The following must NOT reset:

- XP
- level
- workout history
- streak counts
- predictions

Activities must store a date field.

State should also store:

startDate → when the user first started using the app  
currentDate → today's date

### Body Weight Log

Users can log their body weight daily to track progress over time.

**State additions:**
weightLog: []        // { date: 'YYYY-MM-DD', weight: number, unit: 'kg' | 'lbs' }
weightGoal: null     // target weight in same unit as logs
weightUnit: 'kg'     // user preference, toggleable

**XP rules:**
- +10 XP for logging weight on a new day
- +15 XP bonus for a 7-day logging streak

**Component:** `src/components/WeightLog.vue`

UI includes:
- weight input for today
- kg / lbs unit toggle
- optional goal weight input
- SVG line chart of last 30 entries (no external library)
- current weight, goal, and difference display
- 7-day logging streak indicator

Behavior:
- one entry per day maximum
- logging again on the same day updates the existing entry
- XP awarded via existing xp.js util
- persisted through existing localStorage autosave

Placement in App.vue: between CaloriesTracker and StatsPanel


### Progress Dashboard

A separate view toggled from the main tracker via a tab switcher.

Tab state managed in App.vue using a reactive `activeView` ref:
- 'tracker' → default main view
- 'progress' → ProgressDashboard.vue

Component: `src/components/ProgressDashboard.vue`

Shows:
- Weight trend SVG line chart (from weightLog state)
  - Dashed goal line if weightGoal is set
  - Current weight, starting weight, total change
- Workout history timeline grouped by date (from workouts state)
- XP earned per day SVG bar chart — last 30 days (from calHistory + workouts)
- Streak history for all 3 streaks with best streak tracking

No new state fields unless strictly necessary.
No external chart libraries — SVG only.
Reads from existing global state only.

App name: Petfit (localStorage key remains `flarepup-v5`)

### Meal Logger

A new card below the Diet Today card for logging individual meals.

Component: `src/components/MealLogger.vue`

State addition:
meals: []  // { id, date, name, calories, protein, type }
// type: 'breakfast' | 'lunch' | 'dinner' | 'snack'

XP: +10 XP per meal logged (via xp.js)

Behavior:
- Log meal name, calories, protein (g), and meal type
- Today's meals shown grouped by type
- Logged calories auto-add to calories.eaten in existing state
- Only today's meals shown; history preserved in state
- Resets display daily, history kept
- Delete per entry supported

Placement in App.vue: below DietHabits.vue


### Calories Burned Sources

Component: `src/components/CaloriesBurned.vue`
Placed in App.vue below WorkoutLogger.

Calories burned is derived from two sources:

1. Auto-calculated from today's logged workouts
   - Logic in src/utils/calories.js
   - Each workout type/intensity maps to a kcal estimate

2. Manual override for fitness watch users
   - Stored in calories.burnedManual in state
   - null = use auto-calculated value
   - number = use manual value

State addition:
calories.burnedManual: null

UI shows source label: "estimated from workouts" or "from fitness watch"
Clearing manual input reverts to auto-calculated.
CaloriesTracker.vue reads calories.burned — do not modify it.



### Protein Counter

Component: `src/components/ProteinCounter.vue`
Placed in App.vue below CaloriesTracker.

State addition:
proteinActivityLevel: 'active' // 'sedentary' | 'active' | 'athlete'

Protein goal = latest weight from weightLog × activity multiplier:
- sedentary → 0.8g per kg
- active → 1.6g per kg
- athlete → 2.2g per kg

Shows:
- Activity level pill selector
- Progress bar (consumed vs goal)
- Total consumed / goal in grams
- Breakdown list by meal (from meals state)

If no weight logged, shows prompt to log weight first.
Protein data sourced from meals array — no separate protein input.

### Pet Mood System

State addition:
petMood: 'idle'

Logic in: src/utils/mood.js via computeMood()

Moods and triggers:
- idle → default, no activity today
- happy → meal logged or diet habit completed
- excited → calorie goal hit or streak milestone (7, 14, 30 days)
- strong → workout logged
- hungry → no meal logged after 12pm
- tired → no activity for more than 1 day
- sad → streak just broke

Priority: excited > strong > happy > hungry > tired > sad > idle

computeMood() reads from state and returns highest priority mood.
Called after every relevant user action.
Result saved to state.petMood.

Displayed in Pet.vue as a dynamic speech bubble (top right of pet card).
Replaces the static "every step counts!" message.