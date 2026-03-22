<script setup>
import { computed } from 'vue'
import { state } from '../store/state.js'
import { todayStr } from '../utils/dates.js'

const CIRCUMFERENCE = 125.66
const WORKOUT_GOAL = 3
const HABITS_TOTAL = 5
const XP_GOAL = 300

const today = todayStr()

const workoutsToday = computed(() =>
  state.workouts.filter(w => w.date === today).length
)

const habitsToday = computed(() =>
  Object.values(state.dietHabits).filter(Boolean).length
)

const xpToday = computed(() =>
  state.workouts.filter(w => w.date === today).reduce((s, w) => s + (w.xp || 0), 0)
)

const workoutSummary = computed(() => {
  const counts = {}
  for (const w of state.workouts.filter(w => w.date === today)) {
    counts[w.type] = (counts[w.type] || 0) + 1
  }
  return Object.entries(counts).map(([name, count]) => {
    const wt = state.workoutTypes.find(t => t.name === name)
    return { name, count, color: wt?.color ?? '#6366f1' }
  })
})

const motivationMsg = computed(() => {
  if (habitsToday.value === HABITS_TOTAL) return "Perfect habits today! 💪"
  if (xpToday.value >= 100) return `Amazing day! ${state.petName || 'your pet'} is proud 🌟`
  if (xpToday.value > 0) return `Keep going — ${state.petName || 'your pet'} is watching!`
  return "Start your first activity to evolve! 🐾"
})

function arc(value, goal) {
  return `${Math.min(value / goal, 1) * CIRCUMFERENCE} ${CIRCUMFERENCE}`
}
</script>

<template>
  <section class="bg-gradient-to-br from-white to-indigo-50 rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-100/30 p-4 md:p-6">

    <!-- Header -->
    <h2 class="text-sm font-semibold text-gray-700 mb-4">Today's Progress</h2>

    <!-- Three donut rings -->
    <div class="flex flex-wrap justify-around mb-4">

      <!-- Workouts -->
      <div class="flex flex-col items-center gap-1.5">
        <div class="relative w-14 h-14">
          <svg viewBox="0 0 48 48" class="w-14 h-14 -rotate-90" aria-hidden="true">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#e0e7ff" stroke-width="5"/>
            <circle cx="24" cy="24" r="20" fill="none" stroke="#6366f1" stroke-width="5"
              :stroke-dasharray="arc(workoutsToday, WORKOUT_GOAL)"
              stroke-linecap="round"/>
          </svg>
          <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
            {{ workoutsToday }}
          </span>
        </div>
        <span class="text-[11px] text-gray-400">Workouts</span>
      </div>

      <!-- Habits -->
      <div class="flex flex-col items-center gap-1.5">
        <div class="relative w-14 h-14">
          <svg viewBox="0 0 48 48" class="w-14 h-14 -rotate-90" aria-hidden="true">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#d1fae5" stroke-width="5"/>
            <circle cx="24" cy="24" r="20" fill="none" stroke="#10b981" stroke-width="5"
              :stroke-dasharray="arc(habitsToday, HABITS_TOTAL)"
              stroke-linecap="round"/>
          </svg>
          <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
            {{ habitsToday }}
          </span>
        </div>
        <span class="text-[11px] text-gray-400">Habits</span>
      </div>

      <!-- XP -->
      <div class="flex flex-col items-center gap-1.5">
        <div class="relative w-14 h-14">
          <svg viewBox="0 0 48 48" class="w-14 h-14 -rotate-90" aria-hidden="true">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#fef3c7" stroke-width="5"/>
            <circle cx="24" cy="24" r="20" fill="none" stroke="#f59e0b" stroke-width="5"
              :stroke-dasharray="arc(xpToday, XP_GOAL)"
              stroke-linecap="round"/>
          </svg>
          <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
            {{ xpToday }}
          </span>
        </div>
        <span class="text-[11px] text-gray-400">XP</span>
      </div>

    </div>

    <!-- Workout breakdown -->
    <template v-if="workoutSummary.length > 0">
      <div class="border-t border-gray-100 pt-3 mb-3 space-y-1.5">
        <div
          v-for="item in workoutSummary.slice(0, 3)" :key="item.name"
          class="flex items-center gap-2 text-xs text-gray-600"
        >
          <span class="w-2 h-2 rounded-full shrink-0" :style="{ backgroundColor: item.color }"/>
          <span>{{ item.name }}</span>
          <span class="text-gray-400 ml-auto">{{ item.count }} session{{ item.count !== 1 ? 's' : '' }}</span>
        </div>
        <p v-if="workoutSummary.length > 3" class="text-[11px] text-gray-400 pl-4">
          + {{ workoutSummary.length - 3 }} more
        </p>
      </div>
    </template>

    <!-- Motivation pill -->
    <div class="bg-indigo-50 rounded-full px-3 py-1.5 text-center">
      <p class="text-xs text-indigo-600 font-medium">{{ motivationMsg }}</p>
    </div>

  </section>
</template>
