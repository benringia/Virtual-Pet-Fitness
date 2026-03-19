<template>
  <div>
    <!-- Sub-tab bar -->
    <div class="flex gap-4 mb-3 border-b border-gray-200">
      <button
        @click="activeTab = 'activities'"
        class="text-sm font-medium pb-2 transition-colors -mb-px"
        :class="activeTab === 'activities' ? 'text-indigo-600 font-bold border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'"
      >📝 Log</button>
      <button
        @click="activeTab = 'watch'"
        class="text-sm font-medium pb-2 transition-colors -mb-px"
        :class="activeTab === 'watch' ? 'text-indigo-600 font-bold border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'"
      >⌚ Watch</button>
    </div>

    <!-- Tab: Activities -->
    <div v-show="activeTab === 'activities'">
      <!-- Calories summary pills -->
      <p class="text-xs uppercase tracking-wide text-gray-400 mb-2">🔥 Estimated Calories Burned</p>
      <div class="flex flex-wrap gap-2 mb-3">
        <span class="bg-indigo-50 text-indigo-600 rounded-full px-3 py-1 text-xs font-semibold">{{ totalBurned }} kcal total</span>
        <span class="bg-indigo-50 text-gray-500 rounded-full px-3 py-1 text-xs">{{ autoCalories }} from activities</span>
        <span v-if="hasWatchEntries" class="bg-indigo-50 text-gray-500 rounded-full px-3 py-1 text-xs">{{ watchCalories }} from watch</span>
      </div>

      <!-- Activity Logger (injected from WorkoutLogger via slot) -->
      <template v-if="$slots.default">
        <hr class="border-gray-100 mb-3" />
        <slot />
      </template>

      <!-- Recent Activities -->
      <template v-if="autoResult.items.length">
        <hr class="border-gray-100 my-3" />
        <p class="text-xs uppercase tracking-wide text-gray-400 mb-2">Recent Activities</p>
        <div class="space-y-1">
          <div
            v-for="(item, i) in autoResult.items.slice(0, 3)"
            :key="i"
            class="flex justify-between text-xs text-gray-500 py-1 border-b border-indigo-50 last:border-0"
          >
            <span>{{ displayName(item.workout) }}</span>
            <span class="text-indigo-400 font-medium">{{ item.kcal }} kcal <span class="text-gray-400 font-normal">est.</span></span>
          </div>
        </div>
        <p v-if="autoResult.items.length > 3" class="text-xs text-gray-400 mt-1">+ {{ autoResult.items.length - 3 }} more today</p>
      </template>
    </div>

    <!-- Tab: Watch -->
    <div v-show="activeTab === 'watch'">
      <p class="text-xs text-gray-400 mb-3">Log your exact calories burned for more accuracy.</p>
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
      <div v-if="manualEntries.length" class="space-y-1 max-h-40 overflow-y-auto">
        <div
          v-for="(entry, i) in manualEntries"
          :key="i"
          class="flex justify-between items-center text-xs text-gray-500 bg-indigo-50 rounded-lg px-3 py-2"
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
import { addXP } from '../utils/xp.js'

// Migrate old formats (null or array of numbers) to array of { label, kcal }
if (!Array.isArray(state.calories.burnedManual)) {
  state.calories.burnedManual = []
} else {
  state.calories.burnedManual = state.calories.burnedManual.map(e =>
    typeof e === 'number' ? { label: '', kcal: e } : e
  )
}

const activeTab = ref('activities')

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
  addXP(state, 5)
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
