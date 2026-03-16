# CLAUDE.md

This file guides Claude Code when working in this repository.

Keep responses extremely concise. Focus on key information only. Avoid long explanations and large code dumps unless explicitly requested.

---

# Project Overview

Virtual Pet Fitness is a **gamified fitness tracker web app**.

Users log workouts, calories, and diet habits to evolve a virtual pet through stages.

Pet stages:

Egg → Pup → Blossom → Fighter → Queen

100 XP = 1 Level

Evolution levels:

1, 3, 6, 10, 15

The app is **client-only** and stores data locally.

---

# Tech Stack

Use only the following stack:

* Vue 3 (Composition API)
* Vite
* Tailwind CSS
* localStorage

No backend.
No authentication.
No external databases.

---

# Project Structure

src/

components/
Pet.vue
WorkoutLogger.vue
DietHabits.vue
CaloriesTracker.vue
StatsPanel.vue

store/
state.js
persistence.js

utils/
xp.js
dates.js
predictions.js

App.vue
main.js

---

# State Management

Use a **single global reactive state**.

Persist state to localStorage under:

flarepup-v5

Autosave with ~600ms debounce.

Example state:

{
xp: 0,
level: 1,
workouts: [],
dietHabits: {},
calories: {
eaten: 0,
burned: 0,
goal: 2000
},
streaks: {
workout: 0,
diet: 0,
deficit: 0
},
calHistory: []
}

---

# Persistence

State must:

Load from localStorage on app start.

Save automatically when changed.

Create helpers:

loadState()
saveState()

Debounce saves to prevent excessive writes.

---

# XP System

100 XP = 1 Level.

XP Sources:

Workouts
Diet habits
Calorie deficit

Levels determine pet evolution stage.

---

# Workout System

Users can log workouts:

Strength
Walking
Boxing
Tennis
Custom workout

Each workout adds XP.

Store workouts in history.

---

# Diet Habits

Daily checklist:

Water
Vegetables
Protein
No junk food
Balanced meals

Each gives XP.

Habits reset daily.

---

# Calories

Users track:

Calories eaten
Calories burned
Daily goal

Store 60 days of calorie history.

Compute deficit/surplus.

---

# Streaks

Track 3 streaks:

Workout streak
Diet streak
Calorie deficit streak

Each streak stores:

count
lastDate

Check streak resets on first interaction each day.

---

# Pet System

Pet stages:

Egg
Pup
Blossom
Fighter
Queen

Stage determined by level.

Pet has moods:

idle
happy
excited
diet
workout

Pet component reacts to state changes.

Initial version may use emojis.

---

# Predictions

Compute 30-day projections based on recent averages:

Calories
Workouts
XP gain

Place logic in:

utils/predictions.js

---

# UI Layout

Use Tailwind.

Layout:

Header
Pet Display
Workout Logger
Diet Habits
Calories Tracker
Stats Panel

Keep UI minimal.

---

# Code Rules

Use Vue Composition API.

Prefer small reusable functions.

Separate logic into utils where possible.

Avoid large components.

Prefer computed values over manual recalculation.

---

# When Adding Libraries

Always check **official documentation first**.

Prefer lightweight solutions.

Avoid large dependencies unless necessary.

---

# Development Workflow

1. Implement core state
2. Add persistence
3. Build base components
4. Connect components to state
5. Add XP + leveling
6. Add pet evolution
7. Add streaks
8. Add predictions
9. Polish UI

---

# Key Principles

Keep code simple.

Avoid unnecessary abstractions.

Prefer readability over cleverness.

The project should remain easy to understand and modify.
