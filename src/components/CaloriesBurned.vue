<template>
  <div>
    <!-- Total -->
    <div class="mb-1">
      <div class="flex items-baseline gap-1.5 mb-1">
        <span class="text-2xl font-bold text-indigo-500">{{ totalBurned }}</span>
        <span class="text-sm text-gray-400">kcal total</span>
      </div>
      <div class="flex flex-col gap-0.5">
        <span class="text-xs text-gray-400">{{ autoCalories }} kcal from activities</span>
        <span v-if="hasWatchEntries" class="text-xs text-indigo-400 font-medium">{{ watchCalories }} kcal from fitness watch</span>
      </div>
    </div>

    <!-- Workout breakdown (auto mode) -->
    <hr class="border-indigo-100 my-3" />
    <p class="text-xs uppercase tracking-wide text-indigo-400 font-medium mb-2">Recent activities</p>
    <div v-if="autoResult.items.length" class="space-y-1 max-h-48 overflow-y-auto">
      <div
        v-for="(item, i) in autoResult.items"
        :key="i"
        class="flex justify-between text-xs text-gray-500 py-1 border-b border-indigo-50 last:border-0"
      >
        <span>{{ displayName(item.workout) }}</span>
        <span class="text-indigo-400 font-medium">{{ item.kcal }} kcal <span class="text-gray-400 font-normal">est.</span></span>
      </div>
    </div>
    <p v-else class="text-xs text-gray-400">log a workout to see estimates</p>

    <div class="bg-indigo-50 rounded-xl p-3 mt-3 border border-indigo-100">
      <p class="font-medium text-indigo-600 text-sm">⌚ Have a fitness watch?</p>
      <p class="text-xs text-indigo-400 mt-0.5 mb-2">Log your exact calories burned for more accuracy.</p>

      <!-- Add entry inputs -->
      <div class="flex gap-2 items-center mb-2">
        <input
          v-model="labelInput"
          type="text"
          placeholder="activity name (optional)"
          maxlength="50"
          class="flex-1 min-w-0 border border-indigo-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-300 bg-white"
        />
        <input
          v-model="kcalInput"
          @keyup.enter="addManualEntry"
          type="number"
          min="0"
          placeholder="e.g. 320 kcal"
          class="flex-1 min-w-0 border border-indigo-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-300 bg-white"
        />
        <button
          @click="addManualEntry"
          :disabled="!canAddEntry"
          class="px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
          :class="canAddEntry ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-indigo-100 text-indigo-300 cursor-not-allowed'"
        >Add</button>
      </div>

      <!-- Manual entries list -->
      <div v-if="manualEntries.length" class="space-y-1 max-h-32 overflow-y-auto pr-3">
        <div
          v-for="(entry, i) in manualEntries"
          :key="i"
          class="flex justify-between items-center text-xs text-gray-500 bg-white rounded-lg px-3 py-2"
        >
          <span class="flex items-center text-indigo-500 font-medium">
            <span class="w-2 h-2 rounded-full bg-indigo-300 inline-block mr-2 shrink-0"></span>
            <span class="capitalize">{{ entry.label ? `${entry.label} – ${entry.kcal} kcal` : `${entry.kcal} kcal` }}</span>
          </span>
          <button
            @click="removeEntry(i)"
            class="text-red-400 hover:text-red-600 transition-colors"
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

const watchCalories = computed(() => manualEntries.value.reduce((s, e) => s + e.kcal, 0))
const autoCalories = computed(() => autoResult.value.total)
const totalBurned = computed(() => autoCalories.value + watchCalories.value)
const hasWatchEntries = computed(() => manualEntries.value.length > 0)

const canAddEntry = computed(() => kcalInput.value !== '' && +kcalInput.value > 0)

watch(totalBurned, val => { state.calories.burned = val }, { immediate: true })

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
