<template>
  <section class="mb-4 p-4 bg-white rounded shadow">
    <h2 class="font-semibold mb-3">Stats</h2>

    <div class="grid grid-cols-3 gap-3 mb-5">
      <div v-for="s in streakItems" :key="s.label" class="text-center">
        <div class="text-2xl font-bold" :class="s.count > 0 ? 'text-indigo-600' : 'text-gray-300'">
          {{ s.count > 0 ? '🔥' : '—' }} {{ s.count }}
        </div>
        <div class="text-xs text-gray-500 mt-1">{{ s.label }}</div>
      </div>
    </div>

    <h3 class="text-sm font-semibold text-gray-500 mb-2">30-Day Forecast</h3>
    <div class="grid grid-cols-2 gap-2">
      <div v-for="p in predictionItems" :key="p.label" class="bg-gray-50 rounded p-2">
        <div class="text-lg font-bold text-indigo-600">
          {{ p.value !== null ? p.value : '—' }}
        </div>
        <div class="text-xs text-gray-500">{{ p.label }}</div>
      </div>
    </div>
    <p v-if="!hasData" class="text-xs text-gray-400 mt-2">Log activity for 7 days to see forecasts.</p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { state } from '../store/state.js'
import { computePredictions } from '../utils/predictions.js'

const streakItems = computed(() => [
  { label: 'Workout Streak', count: state.streaks.workout.count },
  { label: 'Diet Streak',    count: state.streaks.diet.count },
  { label: 'Deficit Streak', count: state.streaks.deficit.count },
])

const predictions = computed(() => computePredictions(state))

const hasData = computed(() => predictions.value.xp30d !== null || predictions.value.calories30d !== null)

const predictionItems = computed(() => [
  { label: 'Calories (total)', value: predictions.value.calories30d?.toLocaleString() ?? null },
  { label: 'Workouts',         value: predictions.value.workouts30d },
  { label: 'XP Gained',        value: predictions.value.xp30d?.toLocaleString() ?? null },
  { label: 'Projected Level',  value: predictions.value.projectedLevel },
])
</script>
