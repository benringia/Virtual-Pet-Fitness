<template>
  <div class="relative overflow-hidden bg-linear-to-br from-white to-indigo-50/60 rounded-3xl border border-indigo-100 shadow-lg p-5 transition-all duration-300">
    <!-- Top accent bar -->
    <div class="absolute top-0 left-0 w-full h-1 bg-indigo-500/80 rounded-t-3xl"></div>

    <!-- Header -->
    <div class="flex items-start justify-between mb-3 mt-0.5">
      <div>
        <h2 class="text-base font-semibold text-slate-800 flex items-center gap-2">🍽️ Meal Logger</h2>
        <p class="text-xs text-slate-400 mt-0.5">Log your meals quickly</p>
      </div>
    </div>

    <!-- Type selector -->
    <div class="flex flex-wrap gap-1.5 mb-3">
      <button
        v-for="t in TYPES"
        :key="t"
        @click="selectedType = t"
        :class="selectedType === t ? 'bg-indigo-500 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-200 hover:text-indigo-600'"
        class="px-3 py-1 rounded-full text-xs font-medium transition-all capitalize"
      >{{ t }}</button>
    </div>

    <!-- Preset meals -->
    <div class="flex flex-wrap gap-1.5 mb-3">
      <span class="text-[10px] text-slate-400 uppercase tracking-wide self-center mr-1 font-medium">Quick add</span>
      <button
        v-for="meal in PRESET_MEALS"
        :key="meal.name"
        @click="quickLog(meal)"
        :class="flashedMeal === meal.name ? 'ring-2 ring-indigo-300 bg-indigo-200' : 'bg-indigo-100 hover:bg-indigo-200'"
        class="px-3 py-1.5 rounded-full text-xs font-medium text-indigo-700 transition-all hover:scale-[1.03] active:scale-[0.97]"
      >{{ meal.name }}</button>
    </div>

    <!-- Recent meals -->
    <div v-if="recentMeals.length" class="flex flex-wrap gap-1.5 mb-3">
      <span class="text-[10px] text-slate-400 uppercase tracking-wide self-center mr-1 font-medium">Recent</span>
      <button
        v-for="meal in recentMeals"
        :key="meal.name"
        @click="quickLog(meal)"
        :class="flashedMeal === meal.name ? 'ring-2 ring-indigo-300 bg-indigo-100' : 'bg-white border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50'"
        class="px-2.5 py-1 rounded-full text-xs text-indigo-600 transition-all hover:scale-[1.03] active:scale-[0.97]"
      >{{ meal.name }}</button>
    </div>

    <!-- Inputs -->
    <div class="mt-4 p-3 rounded-2xl bg-white border border-slate-100 flex flex-col gap-2">
      <input
        v-model="mealName"
        type="text"
        placeholder="meal name"
        maxlength="60"
        class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all"
      />
      <div class="flex gap-2 min-w-0">
        <input
          v-model.number="mealCalories"
          type="number"
          placeholder="calories"
          min="0"
          class="w-1/2 min-w-0 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all"
        />
        <input
          v-model.number="mealProtein"
          type="number"
          placeholder="protein (g)"
          min="0"
          class="w-1/2 min-w-0 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all"
        />
      </div>
    </div>

    <button
      @click="logMeal"
      :disabled="!canLog"
      class="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
      :class="canLog
        ? 'bg-linear-to-r from-indigo-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.98]'
        : 'bg-indigo-100 text-indigo-300 cursor-not-allowed'"
    >+ Log Meal <span class="text-xs opacity-75">+{{ MEAL_LOG_XP }} XP</span></button>

    <!-- Today's meals -->
    <template v-if="todaysMeals.length">
      <div class="relative mt-4 space-y-3">
        <div v-for="group in visibleGrouped" :key="group.type">
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{{ group.type }}</div>
          <div
            v-for="meal in group.meals"
            :key="meal.id"
            class="flex items-center justify-between text-sm py-1.5 border-b border-indigo-50 last:border-0"
          >
            <span class="text-gray-700 font-medium truncate mr-2">{{ meal.name }}</span>
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xs text-gray-400">{{ meal.calories }} kcal</span>
              <span v-if="meal.protein" class="text-xs text-indigo-400">{{ meal.protein }}g</span>
              <button
                @click="deleteMeal(meal)"
                class="text-red-400 hover:text-red-600 transition-colors"
                aria-label="Delete meal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Fade overlay when collapsed -->
        <div
          v-if="!showAllMeals && todaysMeals.length > DISPLAY_LIMIT"
          class="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-white to-transparent pointer-events-none"
        />
      </div>

      <!-- Show more / less toggle -->
      <div v-if="todaysMeals.length > DISPLAY_LIMIT" class="mt-3 text-center">
        <button
          @click="showAllMeals = !showAllMeals"
          class="text-xs text-indigo-500 hover:underline"
        >
          {{ showAllMeals ? 'Show less' : `Show ${todaysMeals.length - DISPLAY_LIMIT} more` }}
        </button>
      </div>

      <!-- Totals -->
      <div class="mt-3 pt-3 border-t border-indigo-100 flex gap-4 text-xs text-gray-500">
        <span>Total: <span class="font-semibold text-indigo-500">{{ totalCalories }} kcal</span></span>
        <span v-if="totalProtein">Protein: <span class="font-semibold text-indigo-400">{{ totalProtein }}g</span></span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { state } from '../store/state.js'
import { addXP, MEAL_LOG_XP } from '../utils/xp.js'
import { getTodayDate, maybeSetStartDate } from '../utils/dates.js'
import { computeMood } from '../utils/mood.js'

const TYPES = ['breakfast', 'lunch', 'dinner', 'snack']

const PRESET_MEALS = [
  { name: 'Chicken + Rice', calories: 450, protein: 35 },
  { name: 'Eggs',           calories: 150, protein: 12 },
  { name: 'Protein Shake',  calories: 200, protein: 25 },
  { name: 'Banana',         calories: 100, protein: 1  },
  { name: 'Tuna Sandwich',  calories: 300, protein: 20 },
]

const DISPLAY_LIMIT = 5
const showAllMeals = ref(false)
const flashedMeal = ref(null)

const selectedType = ref('breakfast')
const mealName = ref('')
const mealCalories = ref(null)
const mealProtein = ref(null)

const canLog = computed(() => mealName.value.trim().length > 0 && mealCalories.value > 0)

const recentMeals = computed(() => {
  const seen = new Set()
  return [...state.meals]
    .reverse()
    .filter(m => {
      if (seen.has(m.name)) return false
      seen.add(m.name)
      return true
    })
    .slice(0, 8)
    .map(({ name, calories, protein }) => ({ name, calories, protein }))
})

const todaysMeals = computed(() => state.meals.filter(m => m.date === getTodayDate()))

const grouped = computed(() =>
  TYPES
    .map(t => ({ type: t, meals: todaysMeals.value.filter(m => m.type === t) }))
    .filter(g => g.meals.length > 0)
)

const visibleGrouped = computed(() => {
  if (showAllMeals.value) return grouped.value
  let remaining = DISPLAY_LIMIT
  return grouped.value.reduce((acc, group) => {
    if (remaining <= 0) return acc
    const meals = group.meals.slice(0, remaining)
    remaining -= meals.length
    acc.push({ ...group, meals })
    return acc
  }, [])
})

const totalCalories = computed(() => todaysMeals.value.reduce((s, m) => s + m.calories, 0))
const totalProtein = computed(() => todaysMeals.value.reduce((s, m) => s + m.protein, 0))

function logMeal() {
  if (!canLog.value) return
  const calories = mealCalories.value
  const protein = mealProtein.value ?? 0
  state.meals.push({
    id: crypto.randomUUID(),
    date: getTodayDate(),
    name: mealName.value.trim(),
    calories,
    protein,
    type: selectedType.value,
  })
  state.calories.eaten += calories
  addXP(state, MEAL_LOG_XP)
  maybeSetStartDate(state)
  state.petMood = computeMood(state)
  mealName.value = ''
  mealCalories.value = null
  mealProtein.value = null
}

function quickLog(meal) {
  flashedMeal.value = meal.name
  setTimeout(() => { flashedMeal.value = null }, 300)
  state.meals.push({
    id: crypto.randomUUID(),
    date: getTodayDate(),
    name: meal.name,
    calories: meal.calories,
    protein: meal.protein ?? 0,
    type: selectedType.value,
  })
  state.calories.eaten += meal.calories
  addXP(state, MEAL_LOG_XP)
  maybeSetStartDate(state)
  state.petMood = computeMood(state)
}

function deleteMeal(meal) {
  const idx = state.meals.findIndex(m => m.id === meal.id)
  if (idx === -1) return
  state.meals.splice(idx, 1)
  state.calories.eaten = Math.max(0, state.calories.eaten - meal.calories)
  addXP(state, -MEAL_LOG_XP)
}
</script>
