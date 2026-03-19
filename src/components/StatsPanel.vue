<template>
  <!-- Journey card -->
  <div class="bg-white/80 rounded-xl px-4 py-3 mx-2 mb-2">
    <div class="flex items-center gap-2 mb-1">
      <span class="text-base">🗓️</span>
      <h2 class="font-semibold text-gray-700">Your journey</h2>
    </div>
    <template v-if="formattedStart">
      <p class="text-xs text-gray-600">Started: {{ formattedStart }}</p>
      <p class="text-sm font-bold text-indigo-500 mt-1">Day {{ dayNumber }}</p>
    </template>
    <p v-else class="text-xs text-gray-400">Log your first activity to start your journey 🌸</p>
  </div>

  <slot />

  <!-- Reset button -->
  <div class="border-t border-indigo-100/60 my-2 mx-2" />
  <div class="text-center mb-6">
    <button
      @click="showResetModal = true"
      class="text-xs text-red-400 hover:text-red-500 transition-colors hover:underline underline-offset-2 cursor-pointer"
    >
      🌸 reset pet &amp; start over
    </button>
    <p class="text-xs text-indigo-600 mt-1">fresh start!</p>
  </div>

  <!-- Reset confirmation modal -->
  <Teleport to="body">
    <div
      v-if="showResetModal"
      class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      @click.self="showResetModal = false"
    >
      <div class="bg-white rounded-2xl p-6 shadow-lg max-w-sm w-full mx-4">
        <h2 class="font-medium text-gray-800 mb-2">Reset everything?</h2>
        <p class="text-sm text-gray-500 mb-6">This will erase all your progress, workouts, and data. This cannot be undone.</p>
        <div class="flex gap-3 justify-end">
          <button
            @click="showResetModal = false"
            class="bg-indigo-50 text-indigo-600 rounded-xl px-5 py-2 text-sm font-medium hover:bg-indigo-100 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleReset"
            class="bg-red-100 text-red-600 rounded-xl px-5 py-2 text-sm font-medium hover:bg-red-200 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { state } from '../store/state.js'
import { resetState } from '../store/persistence.js'
import { getTodayDate, daysBetween, formatDate } from '../utils/dates.js'

const showResetModal = ref(false)

const dayNumber = computed(() =>
  state.startDate ? daysBetween(state.startDate, getTodayDate()) + 1 : null
)
const formattedStart = computed(() =>
  state.startDate ? formatDate(state.startDate) : null
)

function handleReset() {
  resetState(state)
  showResetModal.value = false
}
</script>
