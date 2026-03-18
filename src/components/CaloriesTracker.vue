<template>
  <div class="bg-white rounded-2xl shadow-sm mb-4 px-4 py-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h2 class="font-semibold text-gray-700">🔥 Calorie deficit</h2>
      <span class="bg-orange-100 text-orange-500 rounded-full px-2.5 py-0.5 text-xs font-medium">
        {{ state.streaks.deficit.count }} day streak
      </span>
    </div>

    <!-- Daily goal row -->
    <div class="flex items-center justify-between mb-4 text-sm text-gray-500">
      <span>daily goal:</span>
      <div class="flex items-center gap-2">
        <input
          type="number" min="0" step="100"
          :value="state.calories.goal"
          @change="state.calories.goal = +$event.target.value"
          class="w-20 text-center font-semibold text-gray-700 border-b border-gray-200 focus:outline-none focus:border-indigo-300 bg-transparent"
        />
        <span class="text-xs text-gray-400">kcal target</span>
      </div>
    </div>

    <!-- Calories Eaten (read-only) -->
    <div class="mb-4">
      <label class="block text-xs text-gray-400 uppercase tracking-widest mb-1">Calories Eaten</label>
      <div class="flex items-center border border-indigo-100 rounded-xl px-3 py-2 bg-indigo-50">
        <span class="text-xl font-bold text-indigo-500 w-full">{{ state.calories.eaten || 0 }}</span>
        <span class="text-xs text-indigo-300 shrink-0">kcal</span>
      </div>
    </div>

    <!-- Remaining calories -->
    <div v-if="state.calories.eaten > 0" class="text-center py-2">
      <div class="text-xs text-gray-400 mb-1 uppercase tracking-widest">remaining calories</div>
      <div class="text-2xl font-semibold" :class="isDeficit ? 'text-green-500' : 'text-red-400'">
        {{ Math.abs(balance) }} kcal
      </div>
    </div>

    <!-- Today's meal history -->
    <div v-if="todaysMeals.length" class="mt-3 max-h-24 overflow-y-auto">
      <div v-for="meal in todaysMeals" :key="meal.id" class="text-xs text-gray-400 bg-indigo-50 rounded-lg px-2 py-1 mb-1 last:mb-0">
        – {{ meal.calories }} kcal from <span class="capitalize">{{ meal.name }}</span>
      </div>
    </div>

    <p class="text-center text-xs text-gray-300 mt-2">resets daily · be honest with yourself, queen 💜</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { state } from '../store/state.js'
import { getTodayDate } from '../utils/dates.js'

const balance = computed(() =>
  state.calories.goal - state.calories.eaten
)
const isDeficit = computed(() => balance.value > 0)
const todaysMeals = computed(() => state.meals.filter(m => m.date === getTodayDate()))
</script>
