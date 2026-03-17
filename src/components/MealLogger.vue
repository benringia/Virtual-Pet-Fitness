<template>
  <div class="bg-white rounded-2xl shadow-sm mb-4 px-4 py-4">
    <div class="flex items-center gap-2 mb-3">
      <span class="text-base">🍽️</span>
      <h2 class="font-semibold text-gray-700">Meal Logger</h2>
    </div>

    <!-- Type selector -->
    <div class="flex flex-wrap gap-1.5 mb-3">
      <button
        v-for="t in TYPES"
        :key="t"
        @click="selectedType = t"
        :class="selectedType === t ? 'bg-pink-400 text-white' : 'bg-pink-50 text-gray-500 hover:bg-pink-100'"
        class="px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize"
      >{{ t }}</button>
    </div>

    <!-- Inputs -->
    <div class="flex flex-col gap-2 mb-3">
      <input
        v-model="mealName"
        type="text"
        placeholder="meal name"
        maxlength="60"
        class="w-full border border-pink-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pink-300"
      />
      <div class="flex gap-2 min-w-0">
        <input
          v-model.number="mealCalories"
          type="number"
          placeholder="calories"
          min="0"
          class="w-1/2 min-w-0 border border-pink-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pink-300"
        />
        <input
          v-model.number="mealProtein"
          type="number"
          placeholder="protein (g)"
          min="0"
          class="w-1/2 min-w-0 border border-pink-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pink-300"
        />
      </div>
    </div>

    <button
      @click="logMeal"
      :disabled="!canLog"
      class="w-full rounded-xl py-2 text-sm font-semibold transition-colors"
      :class="canLog ? 'bg-pink-400 text-white hover:bg-pink-500' : 'bg-pink-100 text-pink-300 cursor-not-allowed'"
    >+ log meal <span class="text-xs font-normal opacity-75">+{{ MEAL_LOG_XP }} xp</span></button>

    <!-- Today's meals -->
    <template v-if="todaysMeals.length">
      <div class="mt-4 space-y-3">
        <div v-for="group in grouped" :key="group.type">
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 capitalize">{{ group.type }}</div>
          <div
            v-for="meal in group.meals"
            :key="meal.id"
            class="flex items-center justify-between text-sm py-1.5 border-b border-pink-50 last:border-0"
          >
            <span class="text-gray-700 font-medium truncate mr-2">{{ meal.name }}</span>
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xs text-gray-400">{{ meal.calories }} kcal</span>
              <span v-if="meal.protein" class="text-xs text-purple-400">{{ meal.protein }}g</span>
              <button
                @click="deleteMeal(meal)"
                class="text-gray-300 hover:text-red-400 transition-colors text-xs leading-none"
                aria-label="Delete meal"
              >✕</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Totals -->
      <div class="mt-3 pt-3 border-t border-pink-100 flex gap-4 text-xs text-gray-500">
        <span>Total: <span class="font-semibold text-pink-500">{{ totalCalories }} kcal</span></span>
        <span v-if="totalProtein">Protein: <span class="font-semibold text-purple-400">{{ totalProtein }}g</span></span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { state } from '../store/state.js'
import { addXP, MEAL_LOG_XP } from '../utils/xp.js'
import { getTodayDate, maybeSetStartDate } from '../utils/dates.js'

const TYPES = ['breakfast', 'lunch', 'dinner', 'snack']

const selectedType = ref('breakfast')
const mealName = ref('')
const mealCalories = ref(null)
const mealProtein = ref(null)

const canLog = computed(() => mealName.value.trim().length > 0 && mealCalories.value > 0)

const todaysMeals = computed(() => state.meals.filter(m => m.date === getTodayDate()))

const grouped = computed(() =>
  TYPES
    .map(t => ({ type: t, meals: todaysMeals.value.filter(m => m.type === t) }))
    .filter(g => g.meals.length > 0)
)

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
  mealName.value = ''
  mealCalories.value = null
  mealProtein.value = null
}

function deleteMeal(meal) {
  const idx = state.meals.findIndex(m => m.id === meal.id)
  if (idx === -1) return
  state.meals.splice(idx, 1)
  state.calories.eaten = Math.max(0, state.calories.eaten - meal.calories)
  addXP(state, -MEAL_LOG_XP)
}
</script>
