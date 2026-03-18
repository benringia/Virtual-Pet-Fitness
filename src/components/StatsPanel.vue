<template>
  <!-- Journey card -->
  <div class="bg-white rounded-2xl shadow-sm mb-4 px-4 py-4">
    <div class="flex items-center gap-2 mb-1">
      <span class="text-base">🗓️</span>
      <h2 class="font-semibold text-gray-700">Your journey</h2>
    </div>
    <template v-if="formattedStart">
      <p class="text-xs text-gray-400">Started: {{ formattedStart }}</p>
      <p class="text-sm font-bold text-indigo-500 mt-1">Day {{ dayNumber }}</p>
    </template>
    <p v-else class="text-xs text-gray-400">Log your first activity to start your journey 🌸</p>
  </div>

  <slot />

  <!-- Reset button -->
  <div class="text-center mb-6">
    <button
      @click="confirmReset"
      class="w-full py-2.5 rounded-full border border-indigo-300 text-indigo-400 text-sm hover:bg-indigo-50 transition-colors"
    >
      🌸 reset pet &amp; start over
    </button>
    <p class="text-xs text-gray-300 mt-1">fresh start!</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { state } from '../store/state.js'
import { resetState } from '../store/persistence.js'
import { getTodayDate, daysBetween, formatDate } from '../utils/dates.js'

const dayNumber = computed(() =>
  state.startDate ? daysBetween(state.startDate, getTodayDate()) + 1 : null
)
const formattedStart = computed(() =>
  state.startDate ? formatDate(state.startDate) : null
)

function confirmReset() {
  if (confirm('Reset your pet and start over? This cannot be undone.')) {
    resetState(state)
  }
}
</script>
