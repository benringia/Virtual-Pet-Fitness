<template>
  <div class="bg-white rounded-2xl shadow-sm mb-4 px-4 py-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h2 class="font-semibold text-gray-700">🥗 Diet today</h2>
      <span class="bg-orange-100 text-orange-500 rounded-full px-2.5 py-0.5 text-xs font-medium">
        {{ state.streaks.diet.count }} day streak
      </span>
    </div>

    <!-- Habit list -->
    <ul class="space-y-2.5">
      <li
        v-for="habit in DIET_HABITS"
        :key="habit.key"
        class="flex items-center gap-3"
      >
        <span class="text-lg w-6 text-center shrink-0">{{ habit.emoji }}</span>
        <span class="flex-1 text-sm text-gray-600">{{ habit.label }}</span>
        <span
          class="text-xs font-medium px-2 py-0.5 rounded-full"
          :class="todayHabits[habit.key] ? 'bg-indigo-100 text-indigo-500' : 'bg-gray-100 text-gray-400'"
        >
          +{{ habit.xp }} xp
        </span>
        <input
          type="checkbox"
          :checked="todayHabits[habit.key] ?? false"
          @change="toggle(habit)"
          class="w-4 h-4 accent-indigo-500 cursor-pointer"
        />
      </li>
    </ul>

    <p class="text-center text-xs text-gray-300 mt-4">habits reset daily · come back tomorrow! 🌸</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { state } from '../store/state.js'
import { DIET_HABITS, addXP } from '../utils/xp.js'
import { todayStr, maybeSetStartDate } from '../utils/dates.js'
import { updateDietStreak } from '../utils/streaks.js'
import { setMood } from '../utils/pet.js'

const todayKey = todayStr()

const todayHabits = computed(() => state.dietHabits[todayKey] ?? {})

function toggle(habit) {
  if (!state.dietHabits[todayKey]) state.dietHabits[todayKey] = {}
  const wasChecked = !!state.dietHabits[todayKey][habit.key]
  if (!wasChecked) maybeSetStartDate(state)
  state.dietHabits[todayKey][habit.key] = !wasChecked
  addXP(state, wasChecked ? -habit.xp : habit.xp)
  updateDietStreak(state)
  const allDone = DIET_HABITS.every(h => state.dietHabits[todayKey][h.key])
  setMood(allDone ? 'excited' : 'diet')
}
</script>
