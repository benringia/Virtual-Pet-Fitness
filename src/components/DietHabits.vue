<template>
  <section class="mb-4 p-4 bg-white rounded shadow">
    <h2 class="font-semibold mb-1">Diet Habits</h2>
    <p class="text-xs text-gray-400 mb-3">{{ checkedCount }} / {{ DIET_HABITS.length }} habits today</p>

    <ul class="space-y-2">
      <li
        v-for="habit in DIET_HABITS"
        :key="habit.key"
        class="flex items-center justify-between"
      >
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            :checked="todayHabits[habit.key] ?? false"
            @change="toggle(habit.key)"
            class="w-4 h-4 accent-indigo-600"
          />
          <span class="text-sm">{{ habit.label }}</span>
        </label>
        <span
          class="text-xs font-medium"
          :class="todayHabits[habit.key] ? 'text-indigo-500' : 'text-gray-300'"
        >
          +{{ DIET_HABIT_XP }} XP
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { state } from '../store/state.js'
import { DIET_HABITS, DIET_HABIT_XP, addXP } from '../utils/xp.js'
import { todayStr } from '../utils/dates.js'
import { updateDietStreak } from '../utils/streaks.js'
import { setMood } from '../utils/pet.js'

const todayKey = todayStr()

const todayHabits = computed(() => state.dietHabits[todayKey] ?? {})

const checkedCount = computed(() =>
  DIET_HABITS.filter(h => todayHabits.value[h.key]).length
)

function toggle(key) {
  if (!state.dietHabits[todayKey]) state.dietHabits[todayKey] = {}
  const wasChecked = !!state.dietHabits[todayKey][key]
  state.dietHabits[todayKey][key] = !wasChecked
  addXP(state, wasChecked ? -DIET_HABIT_XP : DIET_HABIT_XP)
  updateDietStreak(state)
  const allDone = DIET_HABITS.every(h => state.dietHabits[todayKey][h.key])
  setMood(allDone ? 'excited' : 'diet')
}
</script>
