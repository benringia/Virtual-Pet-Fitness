<script setup>
import { computed, watch } from 'vue'
import { state } from '../store/state.js'
import { getTodayDate, todayStr } from '../utils/dates.js'
import { triggerAchievement } from '../utils/achievements.js'

const MULTIPLIERS = { sedentary: 0.8, active: 1.6, athlete: 2.2 }
const LEVELS = ['sedentary', 'active', 'athlete']

const latestWeight = computed(() =>
  state.weightLog.length ? state.weightLog[state.weightLog.length - 1] : null
)

const weightInKg = computed(() => {
  if (!latestWeight.value) return null
  const { weight, unit } = latestWeight.value
  return unit === 'lbs' ? weight * 0.453592 : weight
})

const proteinGoal = computed(() => {
  if (!weightInKg.value) return null
  return Math.round(weightInKg.value * MULTIPLIERS[state.proteinActivityLevel])
})

const todaysMeals = computed(() =>
  state.meals.filter(m => m.date === getTodayDate())
)

const mealsWithProtein = computed(() =>
  todaysMeals.value.filter(m => m.protein > 0)
)

const totalProtein = computed(() =>
  todaysMeals.value.reduce((sum, m) => sum + (m.protein || 0), 0)
)

const progress = computed(() => {
  if (!proteinGoal.value) return 0
  return Math.min((totalProtein.value / proteinGoal.value) * 100, 100)
})

const isGoalMet = computed(() =>
  proteinGoal.value !== null && totalProtein.value >= proteinGoal.value
)

watch(totalProtein, (val) => {
  if (proteinGoal.value === null) return
  const todayKey = todayStr()
  if (!state.dietHabits[todayKey]) state.dietHabits[todayKey] = {}
  state.dietHabits[todayKey]['protein'] = val >= proteinGoal.value
  if (val >= proteinGoal.value) {
    triggerAchievement('protein', '💪', 'Protein goal hit!', 'You hit your daily protein target', `protein-${todayKey}`)
  }
})
</script>

<template>
  <div class="bg-gradient-to-br from-white to-indigo-50/40 rounded-3xl border border-white shadow-xl shadow-indigo-100/50 mb-4 px-6 py-6 transition-all duration-300">
    <h2 class="font-semibold text-gray-700 mb-3">🥩 Protein</h2>

    <p v-if="!latestWeight" class="text-sm text-gray-400 text-center py-2">
      Log your weight to set a protein goal
    </p>

    <template v-else>
      <!-- Activity level selector -->
      <div class="flex gap-1.5 mb-4">
        <button
          v-for="level in LEVELS"
          :key="level"
          @click="state.proteinActivityLevel = level"
          :class="state.proteinActivityLevel === level
            ? 'bg-indigo-500 text-white'
            : 'bg-indigo-50 text-gray-500 hover:bg-indigo-100'"
          class="px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize"
        >{{ level }}</button>
      </div>

      <!-- Progress bar -->
      <div class="bg-gray-100 rounded-full h-2 mb-2">
        <div
          class="h-2 rounded-full transition-all duration-300"
          :class="isGoalMet ? 'bg-emerald-500' : 'bg-indigo-500'"
          :style="{ width: progress + '%' }"
        ></div>
      </div>

      <!-- Consumed / goal -->
      <div
        class="text-sm font-semibold mb-3"
        :class="isGoalMet ? 'text-emerald-600' : 'text-indigo-500'"
      >
        {{ totalProtein }}g / {{ proteinGoal }}g
      </div>

      <!-- Meal breakdown -->
      <div v-if="mealsWithProtein.length" class="max-h-28 overflow-y-auto space-y-1">
        <div
          v-for="meal in mealsWithProtein"
          :key="meal.id"
          class="flex justify-between text-xs text-gray-400 bg-indigo-50 rounded-lg px-2 py-1"
        >
          <span class="capitalize truncate mr-2">{{ meal.name }}</span>
          <span class="shrink-0 font-medium text-indigo-500">{{ meal.protein }}g</span>
        </div>
      </div>
    </template>
  </div>
</template>
