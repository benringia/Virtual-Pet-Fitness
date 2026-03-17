<template>
  <div class="bg-white rounded-2xl shadow-sm mb-4 px-4 py-4">
    <div class="flex items-center gap-2 mb-3">
      <span class="text-base">🏃</span>
      <h2 class="font-semibold text-gray-700">Calories Burned</h2>
      <span v-if="isManual" class="ml-auto text-xs bg-pink-100 text-pink-500 rounded-full px-2.5 py-0.5 font-medium">from fitness watch</span>
    </div>

    <!-- Total -->
    <div class="mb-1">
      <div class="text-xs text-gray-400 mb-1">{{ isManual ? 'manual entries' : 'estimated from workouts' }}</div>
      <div class="flex items-baseline gap-1">
        <span class="text-2xl font-bold text-pink-500">{{ effectiveBurned }}</span>
        <span class="text-sm text-gray-400">kcal</span>
      </div>
    </div>

    <!-- Workout breakdown (auto mode) -->
    <template v-if="!isManual">
      <div v-if="autoResult.items.length" class="mt-2 space-y-1 max-h-48 overflow-y-auto">
        <div
          v-for="(item, i) in autoResult.items"
          :key="i"
          class="flex justify-between text-xs text-gray-500 py-1 border-b border-pink-50 last:border-0"
        >
          <span>{{ displayName(item.workout) }}</span>
          <span class="text-pink-400 font-medium">{{ item.kcal }} kcal</span>
        </div>
      </div>
      <p v-else class="mt-2 text-xs text-gray-400">log a workout to see estimates</p>
    </template>

    <div class="border-t border-pink-50 mt-4 pt-4">
      <label class="block text-xs text-gray-400 mb-1.5">Got a fitness watch? Enter exact calories burned</label>

      <!-- Add entry inputs -->
      <div class="flex gap-2 items-center mb-2">
        <input
          v-model="labelInput"
          type="text"
          placeholder="activity name (optional)"
          maxlength="50"
          class="flex-1 border border-pink-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pink-300"
        />
        <input
          v-model="kcalInput"
          @keyup.enter="addManualEntry"
          type="number"
          min="0"
          placeholder="e.g. 320 kcal"
          class="w-32 border border-pink-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pink-300"
        />
        <button
          @click="addManualEntry"
          :disabled="!canAddEntry"
          class="px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
          :class="canAddEntry ? 'bg-pink-400 text-white hover:bg-pink-500' : 'bg-pink-100 text-pink-300 cursor-not-allowed'"
        >Add</button>
      </div>

      <!-- Manual entries list -->
      <div v-if="manualEntries.length" class="space-y-1 max-h-32 overflow-y-auto pr-3">
        <div
          v-for="(entry, i) in manualEntries"
          :key="i"
          class="flex justify-between items-center text-xs text-gray-500 bg-pink-50 rounded-lg px-3 py-2"
        >
          <span class="flex items-center text-pink-400 font-medium">
            <span class="w-2 h-2 rounded-full bg-pink-300 inline-block mr-2 shrink-0"></span>
            <span class="capitalize">{{ entry.label ? `${entry.label} – ${entry.kcal} kcal` : `${entry.kcal} kcal` }}</span>
          </span>
          <button
            @click="removeEntry(i)"
            class="text-gray-300 hover:text-red-400 transition-colors"
            aria-label="Remove entry"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { state } from '../store/state.js'
import { getTodayBurned } from '../utils/calories.js'
import { getTodayDate } from '../utils/dates.js'

// Migrate old formats (null or array of numbers) to array of { label, kcal }
if (!Array.isArray(state.calories.burnedManual)) {
  state.calories.burnedManual = []
} else {
  state.calories.burnedManual = state.calories.burnedManual.map(e =>
    typeof e === 'number' ? { label: '', kcal: e } : e
  )
}

const labelInput = ref('')
const kcalInput = ref('')

const manualEntries = computed(() => state.calories.burnedManual ?? [])

const autoResult = computed(() => getTodayBurned(state.workouts, getTodayDate()))

const isManual = computed(() => manualEntries.value.length > 0)

const effectiveBurned = computed(() =>
  isManual.value
    ? manualEntries.value.reduce((s, e) => s + e.kcal, 0)
    : autoResult.value.total
)

const canAddEntry = computed(() => kcalInput.value !== '' && +kcalInput.value > 0)

watch(effectiveBurned, val => { state.calories.burned = val }, { immediate: true })

function addManualEntry() {
  if (!canAddEntry.value) return
  state.calories.burnedManual.push({ label: labelInput.value.trim(), kcal: +kcalInput.value })
  labelInput.value = ''
  kcalInput.value = ''
}

function removeEntry(index) {
  state.calories.burnedManual.splice(index, 1)
}

function displayName(workout) {
  if (workout.type === 'Custom') return `${workout.activity} (${workout.intensity})`
  return workout.name
}
</script>
