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
- if an entry exists for today in state.weightLog, hide the weight input form and 'Log Weight' button
- when hidden, show a "Weight logged for today ✓" message and display the chart/current weight summary only

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

- Step 6 🔲 — Mobile responsive + bottom tab bar

## Mobile layout
- Sidebar: hidden on mobile (hidden lg:flex)
- Bottom tab bar: fixed, lg:hidden
  Items: Tracker / Progress / My Workouts / Profile (placeholder)
- Masonry: columns-1 on mobile, columns-2 on lg+
- Right column: stacks below masonry on mobile
- Header: greeting only on mobile, full on lg+
- Main content: pb-20 for bottom tab bar clearance

## Project Structure
- `src/components/PetMiniWidget.vue`: New compact, horizontal pet status for the training hub.
- `src/components/WorkoutsView.vue`: Refactored into a 12-column responsive grid (7/5 split).
- `src/utils/workoutMath.js`: Centralized Epley 1RM and Volume calculations.
- `src/components/DailyBrief.vue`: Unified right-column glassmorphism view for the horizontal calendar and daily sessions.

**Deprecated Components (Do Not Use):**
- 'Workout Types' accordions and 'New Workout Type' forms have been fully deprecated. Focus is purely on Session-First logging with Exercise-level 1RM tracking.
- Standalone 'WorkoutCalendar' and nested un-encapsulated history loops.

## UI Standards (Premium Redesign)
- **Visual Language:** Use dynamic mesh gradients (`bg-[radial-gradient(...)]`) with Indigo/Slate tones.
- **Surfaces:** Use Glassmorphism (white/70, backdrop-blur-2xl, rounded-3xl, shadow-xl). Inner elements (Exercise inputs/rows) use `rounded-xl`.
- **Typography:** Tracking-tight, font-semibold at most for headers. **STRICT RULE: No font-bold, font-extrabold, or font-black in history/brief views.**
- **Scaling & Density:** All history cards must be remarkably compact. Internal padding is `p-5`. Left accent bars must be subtle `w-[3px]` gradients and strictly match the height of the current session content, not the card wrapper.
- **Action Colors:**
  - Body Building: Indigo-600 (Electric Indigo) for buttons/badges.
  - Calisthenics: Amber-500 (Flame Orange) for icons/borders.
  - Cardio: Rose-500 (Vibrant Rose) for icons/badges.
- **Animation & Interaction:**
  - Save Button: Scale-102 on hover, gradient-to-r.
  - History Cards: Subtle `hover:-translate-y-1` and shadow depth increases on hover.
  - Success State: Trigger `isCelebrating` on PetMiniWidget for 3.5s.

## Core Layout (7/5 Split)
- **Left Column (Col 7-8, Hero):** Houses `PetMiniWidget` (Hero Header) and `LogNewSession` card.
- **Right Column (Col 4-5, Reference):** Houses `DailyBrief`. 
- **Sticky Logic:** The Right Column must be `lg:sticky lg:top-8` for constant reference.

## Daily Brief Component & Editing Flow
- **Container**: Glassmorphism (`bg-white/70`, `backdrop-blur-2xl`, `rounded-3xl`).
- **Header**: Horizontal week-slider for date selection. Selected date has an indigo glow. Maintain `selectedDate` as the single source of truth.
- **Typography**: 
  - Session Title: `text-sm font-semibold capitalize`.
  - Exercise Name: `text-[13px] font-medium capitalize`.
  - Stats: `text-[10px] uppercase tracking-wide` using `•` separators.
- **Inline Editing Logic**:
  - **State**: Use a reactive `editDraft` object to clone the session for editing.
  - **Triggers**: Enter via Pencil icon (`text-slate-300 hover:text-indigo-400`); Exit via 'Cancel' text button (clears `editDraft`).
  - **Persistence**: Emit `update-session` only upon clicking 'Save Changes'. Ensure `1RM` and `Volume` recalculate automatically within `editDraft` as the user types.
  - **Input Styling**: 
    - Inputs must match read-only font sizes exactly (Title: `text-sm font-semibold`, Exercise: `text-[13px] font-medium`, Stats: `text-[11px] font-normal uppercase`). 
    - **Labels**: Each input (Weight, Sets, Reps) requires a tiny header label: `text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1`.
    - Use `border-slate-100` and `bg-white/50` for inputs to maintain glassmorphism transparency.
  - **Editor Layout**: 
    - Use "Ghost" buttons (transparent backgrounds, thin dashed borders) for `+ Add Exercise` and `X` (Remove) during edit mode. 
    - **Initialization**: New rows via '+ Add Exercise' start with empty strings/null for values. Placeholders: Name: "e.g. Pull Ups", Weight: "kg", Sets: "0", Reps: "0".
    - **Primary Action**: 'Save Changes' must be a small indigo/violet gradient pill (`text-[12px]`, `py-2`). **Disable button** if any row has an empty Name, 0 Reps, or if `activeExerciseCount` is 0.

## Workout Logging Logic
- **Active Exercise Counting**: 
  - Do not display a count based solely on array length.
  - **Logic**: Use a computed property `activeExerciseCount` that filters for exercises where `name.trim() !== ''`.
  - **Visibility**: If `activeExerciseCount === 0`, do not show the "X exercises" badge in the 'Log New Session' header.
- **Log New Session Initialization**: 
  - Maintain the default empty row on mount, but ensure the UI treats it as "Pending," not "Logged."
  - **Guardrails**: Do not let the placeholder "e.g. Bench Press" count as a value. Ensure the 'Save Session' button remains disabled while `activeExerciseCount` is 0.

## Daily Brief Scaling & Scrollable Content
- **Constraint**: The `DailyBrief` content area must display exactly **one session at a time** as the primary focus.
- **Adaptive Logic**: 
  - If `sessions.length === 1`: The card must use `h-auto` (hug content).
  - If `sessions.length > 1`: Apply `max-h-[450px] overflow-y-auto snap-y snap-proximity`.
- **Scrolling**: Use a scroll-snap container to allow vertical swiping between multiple sessions on the same date. Style scrollbar as a thin, subtle line (`scrollbar-thin scrollbar-thumb-slate-200`). Ensure 'Edit Mode' locks scrolling while editing.
- **Padding**: Ensure `pb-6` is consistent so content doesn't touch the rounded edge.
- **Visual Indicators**:
  - **Pagination**: If `sessionsForSelectedDate.length > 1`, display small navigation dots at the bottom of the card.
- **Scroll Hint**: Use a subtle fade-out effect at the bottom of the active session to indicate more content below.
- **Guardrails**: Do not remove sessions; they must all be accessible via the vertical scroll. Do not let card collapse to zero height; maintain base padding.

## Daily Brief Header Alignment
- **Session Header Layout**: 
  - **Structure**: Use a flex container (`flex justify-between items-center`) for the session title row.
  - **Left Side**: Session Name (e.g., 'Push') in `text-sm font-semibold`.
  - **Right Side**: The Stats Ribbon (Category, Volume/Reps, Count). 
  - **Spacing**: Ensure a minimum gap between the title and the ribbon to prevent overlapping on mobile.
- **Ribbon Styling**: Scale down the ribbon to `py-1 px-3` and `text-[9px]`. Remove the ribbon's solid background; use a subtle border instead to prevent heavy visual weighting.
- **Guardrails**: Do not let the Trash/Edit icons interfere with the ribbon. Icons must remain in the far top-right corner, anchored cleanly above or within the fluid flex row constraints.

## Cardio Tracking (Mode)
- **Logger UI**:
  - **Form State**: If `trainingCategory === 'cardio'`, replace [Weight/Sets/Reps] with [Duration/Intensity].
  - **Inputs**: 
    - Duration: `type="number"`, placeholder="mins".
    - Intensity: `type="select"` or `button-group` (Low, Moderate, High, Max).
  - **Selection**: Use a dropdown for `basicCardioExercises`. If 'Custom...' is selected, show a text input.
  - **Typography**: Exercise/Session names `text-[13px] font-medium`, labels/stats `text-[11px]`.
  - **Validation**: Cardio sessions require a valid Name and Duration > 0 to be considered "Active."
  - **Guardrails**: Maintain glassmorphism card style and ensure `category: 'cardio'` tag is saved.

## Cardio Incline
- **Conditional Field**: Display 'Incline' input only if selected exercise is `Running`, `Walking`, or `Cycling`.
- **Incline Selection**: Replace numeric input and pills with a standard styled `<select>` dropdown.
- **Dropdown Width**: `w-24` fixed width to match the Duration input for symmetry.
- **Dropdown List**: [0, 1, 2, 3, 4, 5, 8, 10, 12, 15]. Display values with `°` symbol (e.g., "15°").
- **Data Model**: Store raw numeric values in database, handle unit display in template.
- **Stats Display**: If `incline > 0`, append `• [INCLINE]°` or `• [INCLINE]%` to the ribbon.
- **Guardrails**: Synchronize headers (Duration, Incline, Intensity) at the top of the row. Use `rounded-xl` and `bg-white/50 backdrop-blur`. No incline for `Swimming` or `Rowing`.

## Cardio Duration
- **Duration Column Alignment**: 
  - **Container**: `w-32` fixed width, `flex flex-col items-center`.
  - **Stepper Row**: `flex items-center justify-between w-full h-11 h-full bg-white/50 border border-slate-100 rounded-xl p-1`. 
  - **Input Style**: Centered, `w-12`, `bg-transparent border-none focus:ring-0`.
- **Duration Stepper Component**: 
  - **Structure**: Horizontal group: Minus `-` button (subtracts 5 mins), Centered Input, Plus `+` button (adds 5 mins).
  - **Unit Indicator**: Add an uneditable `text-[10px] text-slate-400` indicator inside the stepper container.
    - **Pluralization**: Display "min" if `duration === 1`, else "mins". Template: `{{ ex.duration === 1 ? 'min' : 'mins' }}`.
- **Validation**: Default to `1` for new cardio exercises. Minimum duration: 1. Increment/Decrement: 5 mins.
- **Guardrails**: Buttons: `w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center`. Disable or block the minus button if `duration <= 1`. Containers must match Exercise/Intensity dropdown heights. Label remains centered. Use fixed width for unit span to prevent jitter.

## Secondary Action Buttons
- **'Add Another Exercise' Button**:
  - **Logic**: Use a solid `rounded-xl` container with balanced category accents.
  - **Styling**: `bg-[ACCENT]-50 text-[ACCENT]-600 border border-[ACCENT]-100` (Indigo for Body Building, Amber for Calisthenics, Rose for Cardio).
  - **Typography**: `font-medium`, `text-sm`, centered alignment.
  - **Visuals**: Maintain `+` icon. Hover: Increase background opacity or shift to `0` to `50` to `100` variants slightly for feedback.
  - **Guardrails**: Must remain distinct from and less dominant than the primary "Save Session" button.

## Calisthenics & Skills
- **Pre-defined List**: ['Pull Ups', 'Push Ups', 'Dips', 'Muscle Ups', 'Handstand Push Ups', 'Chin Ups', 'Leg Raises', 'Plank', 'Custom...'].
- **Weighted & Hold Toggles**: 
  - **Logic**: Add 'Weighted' and 'Hold Time' boolean toggles in the exercise header.
  - **Visibility (Weight)**: 'Weighted' toggle is ALWAYS visible. Weight input only appears if true.
  - **Visibility (Hold Time)**: 'Hold Time' toggle is ONLY visible when `name === 'Custom...'`.
  - **Skill UI Trigger**: Trigger Skill UI (REPS -> HOLD (SEC) + 'sec') if 'Hold Time' is true OR the exercise is in `STATIC_HOLDS`.
  - **Auto-Logic**: If an exercise from `STATIC_HOLDS` is picked, trigger Skill UI automatically. If a user switches from 'Custom' (with Hold checked) to a standard exercise (e.g., Push Ups), reset `isHold` to false.
  - **Data Integrity**: If 'Weighted' is toggled OFF, clear the weight value to 0 before saving.
- **Horizontal Alignment**: 
  - **Layout**: All calisthenics inputs (Exercise, Weight?, Sets, Reps/Hold) sit on a single horizontal row.
  - **Sizing**: Exercise: `flex-1` (growth factor). Weight/Sets/Reps: `w-20` (fixed/compact).
  - **Logic**: If weight is hidden, the Exercise name expands to maintain a 3-column rhythm (Exercise, Sets, Reps).
  - **Verticality**: Use `items-start` for labels. `gap-3` or `gap-4` between columns.
- **Guardrails**: Bodybuilding weight is ALWAYS visible. Amber-500 theme for toggle/focus. No wrapping unless `< 320px`. Hold/Reps swap/Weight toggle must not break the horizontal row.

## Cardio Session Labeling
- **Auto-Populate**: If `trainingCategory === 'cardio'` and `sessionLabel` matches the previous auto-generated value (or is empty), set label to `[Selected Exercise] Session`.
- **Manual Override**: Track `isLabelManuallyEdited`. If the user manually edits the `sessionLabel`, stop auto-populating.
- **Guardrails**: Placeholder remains "e.g. Morning Run".

## Daily Brief Display (Cardio)
- **Stats Ribbon**: Display `[MINS] • [INTENSITY]` instead of Volume for cardio sessions.
- **Accent Bar**: Use a Rose-500 vertical gradient for cardio entries.
- **Guardrails**: Do not attempt to calculate 'Total Volume' for cardio. Maintain 'Compact-Pro' typographic scale (13px/10px) for stats.

## Body Building Features
- **Quick-Label Pills**: 
  - **Logic**: Extract the top 3 most frequent `sessionLabels` from last 30 Body Building sessions to find non-blacklisted unique entries.
  - **Exclusion**: Strictly filter out any labels in the persistent `state.hiddenLabels` blacklist.
  - **Category Filtering**: Proposed labels must be strictly filtered for the `bodybuilding` category only.
  - **UI (Glass-morphism)**: Small indigo pills (`text-[10px]`) with `bg-opacity-50`. Clicking a pill fills the input field.
  - **Management**: Include a dedicated delete button ('×') inside each pill.
  - **Interaction**: Position the '×' with `ml-1.5`. Use `@click.stop` to ensure clicking '×' DOES NOT populate the input. The '×' must highlight as `text-red-500` on hover for clear destructive feedback.
- **PR (Personal Record) Detection & Celebration**: 
  - **Detection**: Trigger if current `weight > historicalMaxWeight` OR (`weight === historicalMaxWeight` AND `reps > historicalMaxReps`).
  - **Interaction**: Display a `text-emerald-500` (Victory Green) crown icon next to the Weight input with a subtle `animate-pulse` when a PR is detected.
  - **Celebration Trigger**: If any exercise in a session is a PR, trigger a 1.5s visual animation (e.g., emerald-500 confetti or scale effect) upon clicking "Save Session".
  - **Daily Brief PR Highlighting**: Any exercise row hit as a PR must be distinct with `bg-emerald-50/40` and left-accent `border-l-4 border-emerald-400`. Added small `text-emerald-600 font-bold text-[8px]` badge: "NEW PR".
  - **Daily Brief Stats Ribbon (Category Badge)**:
    - **Background**: Category-specific light tints with `backdrop-blur-sm`:
        - Body Building: `bg-indigo-50/80 border border-indigo-100/50`
        - Calisthenics: `bg-amber-50/80 border border-amber-100/50`
        - Cardio: `bg-rose-50/80 border border-rose-100/50`
    - **Visuals**: Primary category color for text/icons (e.g., `text-indigo-600`).
    - **PR Crown**: Within the tinted pill, the 👑 should be `text-emerald-500` (Victory Green).
  - **Guardrails**: Do not change the Amber theme for the Calisthenics category tab. Confetti/Animation must not block the database save transaction (fire and forget). Ensure the 👑 icon and styling persist correctly alongside `BODYWEIGHT` for Calisthenics skills.

- **Body Building Filtered Exercise Library**:
  - **Mapping**: Maintain a comprehensive reactive mapping of `Body Part -> Exercise List`.
  - **Sample Library**:
    - **Chest**: `['Bench Press', 'Incline DB Press', 'Chest Flyes', 'Dips', 'Custom...']`
    - **Back**: `['Pull Ups', 'Bent Over Rows', 'Lat Pulldowns', 'Deadlifts', 'Custom...']`
    - **Shoulders**: `['Overhead Press', 'Lateral Raises', 'Face Pulls', 'Custom...']`
    - **Quads/Hamstrings/Glutes/Calves/Abs**: Each should have specific common exercises and always include `Custom...` as the final option.
  - **Reactive Filtering & Flow**:
    - **Default Values**: Specifically initialize both `bodyPart` and `exerciseName` to `''` for all new Body Building entries.
    - **Dropdown Interactivity**: The **Exercise** dropdown must remain strictly `disabled` until a valid `bodyPart` is chosen from the first selector.
    - **State Reset**: Changing the `bodyPart` selection must immediately reset the `exerciseName` back to `''` (the placeholder state).
    - **Placeholders**: Use "Select Part..." and "Select Exercise..." as the initial unselected states. These must be marked as `disabled` and `selected` in the HTML to prevent invalid logs.
  - **UI Layout**: 
    - Position the 'PART' dropdown to the immediate left of the 'EXERCISE' input.
    - Widths: `w-28` (or `flex-[1]`) for Body Part; `flex-[2]` for Exercise Name.
    - Labeling: Vertical alignment of 'PART' and 'EXERCISE' labels is critical.
    - Custom Input: If `exerciseName === 'Custom...'`, display a text input field for the custom name.
    - Visibility: Only show this mapping for the `bodybuilding` category; keep it hidden for Calisthenics and Cardio.

- **Frictionless Workout Logging**:
  - **Quick-Stepper Controls**: 
    - **Weight**: Integrate `-` and `+` buttons for quick adjustments in `2.5kg` or `5kg` increments.
    - **Sets/Reps**: Integrate `-` and `+` buttons for increments of `1`.
    - **Styling**: Small, circular, low-profile gray buttons positioned inside or immediately adjacent to inputs.
  - **Smart Persistence**: When "Add Another Exercise" is clicked, the new row must automatically inherit the `weight` and `sets` values from the exercise immediately preceding it.
  - **Auto-Focus Logic**: Upon selecting a `bodyPart` or `exerciseName` from a dropdown, the UI must automatically move the cursor focus to the `weight` (or first relevant numeric) input field.
  - **Numeric Keyboard (Mobile Ops)**: All numeric inputs (Weight, Sets, Reps, Duration) MUST utilize `inputmode="decimal"` or `type="number"` to ensure the numeric keypad is forced on mobile devices.
  - **Stepper UI Standards**: 
    - **Weight Input**: Minimum width `w-24` (or `min-w-[90px]`) to ensure 3-digit decimals (e.g., 102.5) remain fully visible.
    - **Sets/Reps (Calisthenics)**: Enforce a minimum width of `min-w-[48px]` (or `w-14`) for the numeric input field, ensuring a compact but legible display.
    - **Text Alignment**: Use `text-center` for all numeric inputs to keep values balanced between steppers.
    - **Padding & Clipping**: Minimize horizontal padding (`px-0.5`) within inputs to maximize digit visibility. Set `overflow-visible` on parent containers.
    - **Flex Integrity**: The input/stepper container must use `gap-1`. The main Exercise dropdown requires `min-w-0` and `flex-shrink` to protect the layout on small screens.
  - **Guardrails**: 
    - Strictly prohibit negative values for Weight, Sets, or Reps.
    - Maintain the 'Victory Green' (emerald-500) PR icon placement next to the weight input.
    - Use 'amber-500' accent colors for all steppers and interactive elements in the Calisthenics tab.
    - Do not allow the "Weighted" checkbox or increased widths to push entry rows onto a second line on mobile devices.
- **Typography**: The primary title uses `font-semibold` (weight 600).
- **Styling**: 
  - **Text**: Category name in the title uses its specific accent: `text-indigo-600` (Body Building), `text-amber-500` (Calisthenics), or `text-rose-500` (Cardio).
  - **Icon**: The `+` icon background color matches the category: `bg-indigo-500`, `bg-amber-500`, or `bg-rose-500`. Add `duration-300` for color shifts.
- **Guardrails**: The plus sign remains white. Do not shift the chevron or the '1 exercise' badge.

## Daily Brief Display (Calisthenics)
- **Weight Labeling**: If weight is `0` or `isWeighted` is false, hide the KG value and display `BODYWEIGHT` in the stats ribbon.
- **Stats Ribbon**: 
  - Weighted: `[WEIGHT]kg • [SETS] sets • [REPS]REPS/s`
  - Bodyweight: `BODYWEIGHT • [SETS] sets • [REPS]REPS/s`
- **Session Header Bug (NaN Fix)**: In any session header badge (Daily Brief or Logs), ensure the total output doesn't render `NaN`. If calculations fail or for pure Skill/Cali flows, fallback to displaying the primary activity type (e.g. `🤸 CALISTHENICS` or `🏃 CARDIO`) instead of broken rep counts.
- **Accent Bar**: Amber-500 theme.

## Data Schema & Logic
- `workoutSessions`: Array of `{ id, date, label, category, exercises: [], cardioDetails? }`.
- Exercise Object (Strength/Cali): `{ name, weight, sets, reps, oneRM }`.
- Exercise Object (Cardio): `{ name, duration (defaults to 1), intensity }`.
- `CardioSession`: `{ id, date, name, duration, intensity, category: 'cardio' }`.
- `category`: 'bodybuilding', 'calisthenics', or 'cardio' (determines UI logic and math).
- **XP Logic**: Sessions grant base XP; intensity/duration multipliers to be defined in future pet-evolution rules.
- `selectedDate`: Controlled by `useSelectedDate.js` (ephemeral UI state).
- **Session Filtering:** The UI must natively filter and show ONLY sessions matching `selectedDate`.
- **Historical Protection & Session Locking**: 
  - If `selectedDate` is NOT today, hide the 'Log New Session' form entirely and render a "Back to Today" shortcut.
  - **Data Integrity**: All workout sessions belonging to a date strictly before `today` must be read-only. Hide Edit (Pencil) and Trash (Delete) icons for any session where `selectedDate < today`.
  - **Visuals**: Locked cards keep the top-right empty for a cleaner "archived" look. Disable all 'Save Changes' logic entirely for past dates.
- `workoutSets`: Existing legacy array in state kept for backward compatibility (Read-only).

## Pet Integration & Animation Rules
- Mini-Status: The Training Hub must display a `PetMiniWidget` at the top of the Left Column (above the Logger) to provide immediate feedback.
- Session Victory Logic: Upon calling `saveSession()`, the `PetMiniWidget` triggers a 3-second `isCelebrating` state.
- Feedback Loop: If a New PR is detected (calculated vs. history): Display "NEW RECORD! 🏆". Standard Success: Display "Session Saved! +XP".
- Visuals: Widget uses `animate-bounce` or `scale-110` pulse during celebration.

## UI Layout & Component Standards
### Page Headers
- **Hero Title**: Use `text-3xl font-extrabold tracking-tight text-slate-900`. Prepend with a ⚡ (Bolt) icon (e.g., "⚡ My Training"). Stack vertically above category selection with `mb-2`.
- **Navigation (Back Button)**: Use a 'Ghost' style (transparent background, `text-slate-500`, `hover:text-indigo-600`). Always position at the top-left (breadcrumb layout) above the Title.
- **Session Counters**: Display count as a subtle pill badge next to the title: `text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full ml-2`.

### Motivational Component
- **Style**: Slim, full-width banner positioned below the header and above the logger/tabs. Maintain a `mt-4` gap between the Title and Tip, and a `mb-10` separation between the Tip and interaction categories.
- **Visuals**: `bg-slate-50 border-l-4 border-indigo-500 py-3 px-4 rounded-r-xl shadow-sm`.
- **Text**: `text-[13px] text-slate-600 italic font-medium`.
- **Logic**: Tips must be dynamically rotated or randomized from a `MOTIVATIONAL_TIPS` array stored in a dedicated utility.
- **Guardrails**: Ensure no more than 2 lines of text on mobile (< 375px). Prevent element overlap during viewport resizing. Keep in document flow (do not use absolute positioning for Tip spacing).
### Tracker Dashboard Teasers
- **Components**: Replace any generic "Structured Workouts" entry with a list of active training category teasers (**BB**, **Cali**, **Cardio**). 
- **Section Header**: Use **`text-xl font-bold text-slate-900 tracking-tight`** for the title ("⚡ Daily Training"). Prepend title with ⚡.
- **Sub-text**: Use `text-sm text-slate-400` for the descriptive text immediately below the title (e.g., "Track your progress for today").
- **Status State Logic**:
  - *Incomplete*: Display "No [Category] yet today" with a themed/gray icon and a subtle XP bonus mention.
  - *Complete*: Display "✅ [Category] Session Logged" with a Green/themed accent and higher saturation.
- **Interactivity & Navigation**: Clicking a teaser Card must:
  1.  Switch the `activeView` to 'workouts'.
  2.  Automatically set the `state.trainingCategory` to match the specific teaser selected.
- **Styling**: Compact card layout with `border border-slate-100` and category-specific hover backgrounds (e.g., `bg-indigo-50/50`).
- **Guardrails**: Ensure teasers are small and horizontally aligned to avoid dashboard clutter. Preserve any 'Locked' state visuals for past-day tracking.
### Tracker Dashboard Hierarchy
- **Tier 1 (Priority)**: Top—PETFIT Virtual Pet Status & Primary Progress/XP Bars.
- **Tier 2 (Core)**: Middle—Training Hub (Daily Training).
- **Tier 3 (Utility)**: Bottom—Misc Movement Library.
- **Compact Layout**: Prioritize a tighter vertical stack to keep both core sections "above the fold" on most mobile devices. Use **`mb-6`** (24px) below training cards, and a tighter **`mt-4`** (16px) gap for the Misc Movement section. Do NOT use larger separators like mt-12.

### Dashboard Column Layout
- **Masonry Columns & Spacing**:
  - **Requirement**: Cards in the Overview/Tracker view MUST stack vertically without leaving large gaps between uneven heights.
  - **Implementation**: Utilize Tailwind's **`columns-1 md:columns-2 lg:columns-3`** for a true masonry effect. Ensure each card is wrapped in a container that uses **`break-inside-avoid mb-6 w-full`** to maintain clean column breaks.
- **Intrinsic Height Management**:
  - **Requirement**: Side-by-side cards (when using standard Flex/Grid instead of Masonry) must NOT stretch to match the height of their tallest neighbor.
  - **Alignment**: Configure parent containers with **`items-start`** (for Flex) or specify **`items-start`** on grid layouts to ensure top-alignment without vertical stretching.
- **Specific Constraints**:
  - **Daily Reset Card**: This component should never expand vertically. Use **`h-fit`** or wrap in an `items-start` wrapper to maintain its minimal footprint.
- **Guardrails**:
  - **No Fixed Heights**: Never use hardcoded pixel heights (e.g., `h-64`) for dashboard cards; allow them to grow naturally with their data.
  - **Bottom Clipping**: Ensure 'Today's Progress' or other core cards are never cut off during column breaks by properly applying `break-inside-avoid`.

### Quick Log (Misc Movement Library)
- **Library**: Provide a pre-set list for un-structured movement: `['Walking', 'Cleaning/Chores', 'Grocery Shopping', 'Biking (Commute)', 'Stretching/Yoga', 'Hiking', 'Custom...']`.
- **Default Intensity Mapping**: 
  - *Walking / Groceries*: Default to 'Easy'.
  - *Cleaning / Yoga*: Default to 'Moderate'.
  - *Hiking / Biking*: Default to 'Intense'.
- **UI Logic**: Use a `<select>` dropdown for the library. The 'Custom' text input must ONLY appear if 'Custom...' is selected.
- **Branding & Palette**:
  - **Accent Color**: Use **Orange** accents (e.g., `text-orange-600`, `bg-orange-500`, `border-orange-100`) for all Misc Movement UI elements.
  - **Intensity Pill-Toggles**: 
    - *Inactive*: `bg-slate-50 text-slate-500`. 
    - *Active*: `bg-orange-500 text-white shadow-md hover:bg-orange-600`.
  - **Action Button**: Use a solid **`bg-orange-600 text-white hover:bg-orange-700`** for the primary **`+ LOG`** button.
- **Header Style**: Use identical style to Daily Training: `text-xl font-bold text-slate-900 tracking-tight`. Prepend with 🚲 (Bicycle) or 🧹 (Broom) icon.
- **Guardrails**:
  - Do NOT change the colors of the primary Daily Training hub; keep the orange palette exclusive to the un-structured movement card.
  - Keep XP rewards lower (+5 to +15 XP). 
  - Section must sit closely beneath the training hub with standard **`mt-4`** whitespace.

### Color Grouping & Semantic Palettes
- **Orange Theme Group (Lifestyle & Body Weight)**:
  - **Categories**: **Calisthenics** & **Misc Movement**.
  - **Primary Accents**: `text-orange-600`, `bg-orange-600`.
  - **Soft Accents**: `bg-orange-50/50`, `border-orange-100/50`.
  - **Focus States**: `focus:ring-orange-500`.
- **Blue Theme Group (Traditional Strength)**:
  - **Categories**: **Body Building**.
  - **Primary Accents**: `text-indigo-600`, `bg-indigo-600`.
  - **Soft Accents**: `bg-indigo-50/50`, `border-indigo-100/50`.
- **Completion & Success**:
  - **Visual Indicator**: Always use **`text-emerald-500` (Victory Green)** for success text and "✅ Session Logged" states across ALL sections.

- **Guardrails**:
  - Do NOT change the **Blue** palette for Body Building. 
  - Do NOT change the **Indigo/Red** palette for Cardio. 
  - Ensure **Misc Movement** and **Calisthenics** are aesthetically linked through the Shared Orange palette.

### Weight Log (Lifestyle Progress)
- **Header Synchronization**: Match the "Daily Training" and "Misc Movement" hubs—use **`text-xl font-bold text-slate-900 tracking-tight`**.
- **Iconography**: Prepend the header with a **⚖️ (Balance Scale)** icon.
- **Layout**: Use **`flex items-center gap-2 mb-4`** for the title container.
- **Spacing**: Maintain a standard **`mt-8` or `mt-12`** vertical gap from the Misc Movement section to ensure lifestyle groups are distinct.
- **Goal Logic**:
  - **Success Math**:
    - **Loss Mode**: SUCCESS if `currentWeight <= goalWeight`.
    - **Gain Mode**: SUCCESS if `currentWeight >= goalWeight`.
    - **Maintain Mode**: SUCCESS if `Math.abs(currentWeight - goalWeight) <= 0.5`.
  - **Dynamic Vocabulary**: 
    - Feedback must change by mode: `[x] [unit] to lose`, `[x] [unit] to gain`, or `On track` (for Maintain).
  - **Color Strategy**: Apply **`text-emerald-500` (Victory Green)** ONLY when the Success Math for the active goal type evaluates to TRUE.
  - **Projection Analytics**:
    - **Goal Forecast**: Estimate completion date using the slope of the last **3 entries**. 
    - **Math**: `DaysToGoal = (RemainingWeight / AverageDailyChange)`.
    - **Display**: Show as italicized sub-label (`text-[11px] text-slate-400`) below goal status.
    - **Fallback**: Display "Needs more data" if entries < 3 or "Stable/Trend away" if moving away from goal.
  - **Celebration Logic**:
    - **Event**: Trigger **`confetti()`** when `isSuccess` state flips from `false` to `true`.
    - **Persistence**: Store **`hasCelebratedGoal`** in weight state to prevent duplicate triggers on reload.
- **Input Layout**: Implement Goal Type selectors as a horizontal 'Pill' toggle (e.g., bg-gray-100 wrapper) positioned directly above the Goal Weight text input.

### Unit Conversions & Display
- **Global Unit State**: Use centralized **`state.weightUnit`** ('kg' or 'lbs') to drive all UI elements.
- **Base Storage Requirement**: ALWAYS store weights in the database/JSON in **KG** (the Base Value). Convert only for display and input to prevent cumulative rounding errors.
- **Math**: 
  - $lbs = kg \times 2.20462$
  - $kg = lbs / 2.20462$
- **Reactive UI**: 
  - **Formatting**: Weights must pass through a formatter that applies conversion and appends the unit label.
  - **Inputs**: Update `placeholder` and `value` dynamically when unit is toggled.
  - **Thresholds**: The 0.5kg "Maintain" range must scale to **~1.1 lbs** in LBS mode.

  - Keep 'Goal Weight' as an optional input.

### Weight Log Standards (Emotional Design)
- **Stat Hero Section**:
  - **Dominant Metric**: Display current weight using **`text-5xl font-extrabold text-slate-900`**.
  - **Unit Label**: Complement with **`text-lg text-slate-400 font-medium`**.
  - **Atmosphere**: Use a **`bg-gradient-to-br from-white to-indigo-50/30`** backdrop to elevate the section's visual quality.
- **Feedback & Status Badges**:
  - **The Streak Pill**: Format daily streaks in a rounded pill using **`bg-orange-100 text-orange-700`** with a subtle pulse animation.
  - **Semantic Feedback**: 
    - Use **`text-emerald-600`** for progress alignment (on-track).
    - Use **`text-rose-500`** for deviation (off-track) according to selected Goal Type.
- **Interaction & Action State**:
  - **Default View**: Maintain high signal-to-noise ratio by showing only Stats, Active Goal Type, and Streak.
  - **Active Reveal**: Use a smooth transition to reveal weight/goal input fields only when the user triggers the "Update" action.
- **Navigation & Controls**:
  - **Glass-morphism**: Style the 'kg/lbs' unit toggle with a modern glass-morphism aesthetic (subtle backdrop blur, thin border).
  - **Header**: Maintain the **`text-xl font-bold`** header with the **⚖️** icon.
- **Weight Goal Configuration**:
  - **Goal Type Selector**: Use the [Loss] [Maintain] [Gain] pill-toggle. 
  - **Styling**: Active state = **`bg-indigo-600`** with shadow; inactive = **`text-slate-400`**.
  - **Reactive Feedback**: Ensure the "X kg to gain/lose" text remains fully reactive.

### Form Controls (Custom Selects)
- **Select Affordance**: All `<select>` elements must feature a visible downward chevron icon on the right to indicate dropdown functionality.
- **Styling**: 
  - Use `appearance-none` on the select tag.
  - Add a background-image chevron or an absolute-positioned icon (e.g., `text-slate-400`).
  - Ensure **`pr-10`** padding on the select to prevent text from overlapping the icon.
- **Interaction**: Ensure the icon is `pointer-events-none` so clicking it still opens the native dropdown.
- **Focus States**: Maintain the 'indigo' border on focus.

## Math Standards
- 1RM: `(weight * (1 + reps / 30))`.
- Volume: `Σ (weight * reps)` for the session exercises.

## Navigation Rules
- **View Naming**: Rename "Tracker" to **"Overview"** across all UI elements, menus, and breadcrumbs.
- **Internal State**: Use **`'overview'`** as the `activeView` value. Update all `v-if` and navigation logic accordingly.
- **Home Icon**: Always use the 'Home' (house) icon for the Overview section.
- `activeView` supports 'overview', 'progress', and 'workouts'.
- Default view remains 'overview'.

> **GUARDRAILS:** 
> - The localStorage key MUST remain `flarepup-v5`. No exceptions.
> - Do not duplicate pet logic; use the shared store state for XP and Level.
> - Ensure the 'speech bubble' text is high-contrast for readability. 
> - Ensure navigation labels (e.g., 'Overview') are perfectly vertically centered in all nav-bars.
