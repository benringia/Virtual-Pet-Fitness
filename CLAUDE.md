# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Keep responses extremely concise. Focus on key information only. Avoid long explanations and large code dumps unless explicitly requested.

we're building the app descripbed in @spec.md. Read that file for general architectural tasks or to double-check the exact database structure, tech stach or application architecture.

Keep your replies extremely conscise and focus on conveying the key information. No unnecessary fluff, no long code snippets.

Whenever working with any third-party library or something similar, you MUST look up the official documentation to ensure that you're working with up-to-date information.

Use the DocsExplorer subagent for efficient documentation lookup.

---

## Project Overview

Petfit is a **gamified fitness tracker web app** — client-only, no backend, no auth, no external DB.

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

### Achievement Notification System

Two notification types:

1. Toast (ToastNotification.vue) — bottom-right, auto-dismisses after 4s
   Used for: level up, protein goal, calorie goal, streak milestones,
   first workout, all diet habits completed, weight goal hit

2. Evolution Modal (EvolutionModal.vue) — center screen, requires dismissal
   Used for: pet evolution only (Egg→Pup, Pup→Blossom, Blossom→Fighter, Fighter→Queen)

Logic in: src/utils/achievements.js
- triggerAchievement(type, message) adds to notification queue
- No duplicate toasts for same achievement within same day

Both components mounted at root level in App.vue.
triggerAchievement() called from: xp.js, Pet.vue, ProteinCounter.vue,
CaloriesTracker.vue, streak logic, WorkoutLogger.vue, DietHabits.vue, WeightLog.vue

### Daily Notifications

**Day Reset Toast:**
- Fires once per day when daily reset is detected
- Calls triggerAchievement('dayReset', message) after reset runs
- Uses existing ToastNotification system

**End of Day Reminder:**
Component: src/components/ReminderSettings.vue
Logic: src/utils/reminder.js
Placed in sidebar above reset button.

State addition:
reminder: {
  enabled: false,
  time: '20:00'
}

Uses browser Notification API (no external services).
scheduleReminder(time) uses setTimeout to fire at set time.
Scheduled on app load in App.vue onMounted if enabled + permission granted.
Gracefully handles permission denied state.

**Countdown to Reset:**
Displayed inside ReminderSettings.vue, below the time picker.
Only visible when reminder.enabled is true.
Updates every minute via setInterval (cleared on onUnmounted).
Format: "X hrs Y mins until reset" or "X mins until reset" (under 1hr).
Disappears when daily reset fires (currentDate updates to today).
Uses local time only — no UTC. Midnight = next 00:00 local.
Style: small text, indigo-400, no extra card/border.

### Rest Day Logging
Component: src/components/WorkoutLogger.vue (button added below accordions)
Logic: src/utils/restDay.js
State:
  - restDays: [] — persistent array of logged rest day date strings
  - todayIsRestDay: false — resets daily

Rules:
  - Max 2 rest days per Mon–Sun week
  - One log per day max
  - Awards +8 XP on log
  - Sets petMood to "resting" for the day
  - Protects workout streak — treated same as a logged workout
  - todayIsRestDay resets daily; restDays array never clears (history)

Mood: "resting" added to mood.js — lowest priority, message: "taking it easy today 😴"

Helper text in UI: "X of 2 rest days used this week"
Button style: indigo outline (not filled), disabled when limit reached or already logged today

### Weekly Report
Component: src/components/WeeklyReportModal.vue
Logic: src/utils/weeklyReport.js
State: lastWeeklyReportShown: null — stores Monday date string of last auto-show

Auto-pop: fires once every Monday on first app load of the week.
Manual trigger: "📊 Weekly Report" button at top of Progress tab in 
ProgressDashboard.vue.
Requires manual dismissal (no auto-close).

Report covers last Mon–Sun:
- Workouts logged (X of 7 days)
- Avg daily calorie deficit
- Protein goal hit (X of 7 days)
- Diet habits completion rate (%)
- XP earned last week
- Streak status (all 3 streaks)
- Best day (most XP)
- Summary line based on overall performance

Style: center modal, white + indigo, scrollable on mobile.
Follows same pattern as EvolutionModal.vue.

### Workout Types — Dynamic Structure (Step 1 of refactor)
State is being migrated from fixed workout keys to dynamic array.

Current state has BOTH during migration:
- `workouts` (old fixed keys — do not remove until Step 2)
- `workoutTypes` (new dynamic array — source of truth going forward)

New structure:
workoutTypes: [
  { id: 'strength', name: 'Strength', color: '#f472b6', sessions: [] },
  { id: 'walking',  name: 'Walking',  color: '#60a5fa', sessions: [] },
  { id: 'boxing',   name: 'Boxing',   color: '#f87171', sessions: [] },
  { id: 'tennis',   name: 'Tennis',   color: '#4ade80', sessions: [] },
]

DO NOT delete `workouts` (old) until Step 2 migration is complete.
DO NOT add external libraries.
localStorage key: `flarepup-v5` — never change.


### Workout Types — Dynamic Structure (Step 2 of refactor)
Migration complete. All files now use `state.workoutTypes` instead 
of hardcoded type names.

## Current state of refactor
- Step 1 ✅ — `workoutTypes` array added to state/persistence.js
- Step 2 ✅ — All references migrated to dynamic workoutTypes
- Step 3 🔲 — Add/Delete workout types UI
- Step 4 🔲 — Custom subtypes per user-defined type
- Step 5 🔲 — Fix weekly report + predictions for dynamic types
- Step 6 🔲 — Polish + mute 0-session accordions

## Key decisions made in Step 2
- Workout entries keep `type: 'Strength'` shape (matches workoutType.name)
- `openWorkout` ref uses `wt.id` (lowercase slug) not name string
- WORKOUT_SUBTYPES and WORKOUT_META stay in xp.js as source of truth
  for the 4 default types only
- User-defined types will NOT have subtypes until Step 4
- streaks.js, predictions.js, calories.js were NOT changed — 
  they are type-agnostic

## workoutTypes structure
workoutTypes: [
  { id: 'strength', name: 'Strength', color: '#f472b6', sessions: [] },
  { id: 'walking',  name: 'Walking',  color: '#60a5fa', sessions: [] },
  { id: 'boxing',   name: 'Boxing',   color: '#f87171', sessions: [] },
  { id: 'tennis',   name: 'Tennis',   color: '#4ade80', sessions: [] },
]

## DO NOT
- Delete `workouts` flat array (session history)
- Change localStorage key `flarepup-v5`
- Add external libraries
- Hardcode type names anywhere — always loop state.workoutTypes


### Workout Types — Dynamic Structure (Step 3 of refactor)
Add/Delete custom workout types UI complete.

## Current state of refactor
- Step 1 ✅ — `workoutTypes` array added to state/persistence.js
- Step 2 ✅ — All references migrated to dynamic workoutTypes
- Step 3 ✅ — Add/Delete workout types UI
- Step 4 🔲 — Custom subtypes per user-defined type
- Step 5 🔲 — Fix weekly report + predictions for dynamic types
- Step 6 🔲 — Polish + mute 0-session accordions

## Add workout type
- "+" button below last accordion
- Inline form: name input + 6 color swatches
- Preset colors: #f472b6, #60a5fa, #f87171, #4ade80, #fb923c, #a78bfa
- slugify: name.toLowerCase().replace(/\s+/g, '-')
- Validates: name required, no duplicates (case-insensitive)
- Awards +5 XP on add
- New type shape: { id, name, color, sessions: [] }

## Delete workout type
- Trash icon on accordion header, right side before chevron
- Only visible on user-defined types (not default 4)
- Default 4 (Strength/Walking/Boxing/Tennis) cannot be deleted
- Inline confirmation: "Remove [name]? Past sessions are kept."
- On confirm: removes from state.workoutTypes only
- state.workouts history is NEVER deleted

## Key rules
- Do NOT delete `workouts` flat array (session history)
- Do NOT change localStorage key `flarepup-v5`
- Do not add external libraries
- Always loop state.workoutTypes — never hardcode type names


### Workout Types — Dynamic Structure (Step 4 of refactor)
- Step 4 🔲 — Custom subtypes per user-defined type

## Custom subtypes (user-defined types only)
State shape: { id, name, color, sessions: [], subtypes: [] }
subtypes: [{ label, xp }]
Default 4 types still use WORKOUT_SUBTYPES from xp.js — never 
add subtypes array to default types in workoutTypes.
Max XP per subtype: 5–80.
Duplicate subtype names not allowed (case-insensitive, per type).

- Step 4 ✅ — Custom subtypes per user-defined type complete and verified


- Step 5 🔲 — Fix weekly report + predictions for dynamic types

## Weekly report + predictions (Step 5)
Both weeklyReport.js and predictions.js updated to derive 
workout types from state.workoutTypes dynamically.
No hardcoded type names anywhere in either file.

- Step 6 ✅ — Polish + mute 0-session accordions complete

## Refactor complete ✅
All 6 steps of dynamic workout types refactor done.
Workout types are fully dynamic — users can add/delete types 
and subtypes. Default 4 types unchanged.


### Sidebar Redesign — Collapsible Rail Nav (Step 1 of redesign)
- Step 1 🔲 — Rail nav shell
- Step 2 🔲 — Clean sidebar (non-nav items removed)
- Step 3 🔲 — Masonry content area
- Step 4 🔲 — Weight Log, Reminder, Rest Day in masonry
- Step 5 🔲 — Today's Progress card
- Step 6 🔲 — Polish + mobile bottom nav

## Rail nav specs
- Collapsed: w-16 (64px), icons only
- Expanded: w-60 (240px), icons + labels
- Trigger: @mouseenter / @mouseleave
- Transition: transition-all duration-300 ease-in-out
- Top: Petfit logo (paw only collapsed, paw + wordmark expanded)
- Nav: Tracker (Home), Progress (ChartBar), My Workouts (Fire)
- Bottom: Logout placeholder + Reset text-link (visible expanded only)
- Icons: Heroicons inline SVG only, 20px stroke-2
- bg-indigo-50/50 border-r border-indigo-100
- Mobile: unchanged (lg:flex hidden on mobile)
- Step 1 ✅ — Rail nav shell complete
- Step 2 🔲 — Clean sidebar (non-nav items removed)

- Step 2 ✅ — Sidebar cleaned
- Step 3 🔲 — Masonry content area

- Step 3 ✅ — Masonry content area complete
- Step 4 🔲 — Real components in masonry

## Masonry layout
CSS columns-based (no JS, no libs)
Container: columns-1 lg:columns-2 gap-4
Each card: break-inside-avoid mb-4 w-full

- Step 4 ✅ — Real components in masonry complete
- Step 5 🔲 — Today's Progress card

## TodayProgress.vue
Component: src/components/TodayProgress.vue
3 SVG donut rings: Workouts (indigo) / Habits (emerald) / XP (amber)
Daily goals: Workouts=3, Habits=5, XP=300
Today's workout summary: active types + session counts
Pet motivation nudge: dynamic message based on state
Local time only — no UTC.