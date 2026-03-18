<template>
  <section class="bg-white rounded-2xl border border-indigo-100 shadow-sm p-4 mb-4">
    <button
      @click="isOpen = !isOpen"
      class="w-full flex items-center justify-between mb-0 focus:outline-none"
      :aria-expanded="isOpen"
    >
      <h2 class="text-xs font-bold tracking-widest text-gray-400 uppercase">⚖️ Weight Log</h2>
      <span class="text-gray-400 text-xs transition-transform duration-200" :class="isOpen ? 'rotate-180' : ''">▼</span>
    </button>

    <transition
      enter-active-class="transition-all duration-200 ease-out overflow-hidden"
      leave-active-class="transition-all duration-200 ease-in overflow-hidden"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-screen"
      leave-from-class="opacity-100 max-h-screen"
      leave-to-class="opacity-0 max-h-0"
    >
    <div v-show="isOpen" class="mt-3">

    <!-- Inputs + Log button -->
    <div class="flex flex-col gap-2 mb-4">
      <input
        v-model.number="weightInput"
        type="number"
        min="1"
        step="0.1"
        placeholder="weight in kg"
        class="w-full border border-indigo-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
      />
      <input
        v-model.number="goalInput"
        type="number"
        min="1"
        step="0.1"
        placeholder="goal weight in kg"
        @change="saveGoal"
        class="w-full border border-indigo-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-300"
      />
      <button
        @click="handleLog"
        :disabled="!weightInput || weightInput <= 0 || !goalInput || goalInput <= 0"
        class="w-full bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 text-xs font-semibold hover:bg-indigo-600 transition-colors"
      >Log</button>
    </div>

    <!-- Stats rows -->
    <div v-if="currentWeight !== null" class="flex flex-col gap-2 mb-4">
      <div class="bg-indigo-50 rounded-xl px-3 py-2 flex justify-between items-center">
        <span class="text-xs text-gray-400">Current</span>
        <span class="text-sm font-bold text-gray-700">{{ currentWeight }} <span class="text-xs font-normal text-gray-400">{{ state.weightUnit }}</span></span>
      </div>
      <div v-if="state.weightGoal" class="bg-indigo-50 rounded-xl px-3 py-2 flex justify-between items-center">
        <span class="text-xs text-gray-400">Goal</span>
        <span class="text-sm font-bold text-gray-700">{{ state.weightGoal }} <span class="text-xs font-normal text-gray-400">{{ state.weightUnit }}</span></span>
      </div>
      <div v-if="diff !== null" class="rounded-xl px-3 py-2 flex justify-between items-center" :class="diffPositive ? 'bg-orange-50' : 'bg-green-50'">
        <span class="text-xs text-gray-400">Difference</span>
        <span class="text-sm font-bold" :class="diffPositive ? 'text-orange-400' : 'text-green-500'">
          {{ diffPositive ? '+' : '' }}{{ diff }} <span class="text-xs font-normal">{{ state.weightUnit }}</span>
        </span>
      </div>
    </div>

    <!-- Streak badge -->
    <div v-if="streak > 0" class="flex items-center gap-2 mb-4 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2">
      <span class="text-sm">🔥</span>
      <span class="text-xs font-semibold text-yellow-700">{{ streak }}-day logging streak</span>
      <span v-if="streak >= 7" class="ml-auto text-xs bg-yellow-200 text-yellow-800 rounded-full px-2 py-0.5 font-bold">+15 XP bonus!</span>
    </div>

    <!-- Chart -->
    <div v-if="last30.length >= 2">
      <div class="text-xs text-gray-400 mb-2">Last {{ last30.length }} entries</div>
      <svg :viewBox="`0 0 ${SVG_W} ${SVG_H}`" class="w-full h-24" aria-hidden="true">
        <!-- Goal line -->
        <line
          v-if="state.weightGoal && goalY !== null"
          :x1="0" :y1="goalY" :x2="SVG_W" :y2="goalY"
          stroke="#c084fc" stroke-width="1" stroke-dasharray="4 3" opacity="0.6"
        />
        <!-- Trend line -->
        <polyline
          :points="chartPoints"
          fill="none"
          stroke="#6366f1"
          stroke-width="2"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
        <!-- Data dots -->
        <circle
          v-for="(pt, i) in chartCoords"
          :key="i"
          :cx="pt.x" :cy="pt.y" r="3"
          fill="#6366f1"
        />
        <!-- Min / max labels -->
        <text :x="SVG_W - 2" :y="minY + 4" text-anchor="end" font-size="8" fill="#9ca3af">{{ chartMin }}</text>
        <text :x="SVG_W - 2" :y="maxY + 4" text-anchor="end" font-size="8" fill="#9ca3af">{{ chartMax }}</text>
      </svg>
    </div>

    <p v-else-if="!last30.length" class="text-xs text-gray-400 text-center py-2">Log your weight to see your trend chart.</p>

    </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const isOpen = ref(false)
import { state } from '../store/state.js'
import { logWeight, getWeightStreak } from '../utils/weight.js'

const SVG_W = 300
const SVG_H = 80
const PAD = 10

const weightInput = ref(null)
const goalInput = ref(state.weightGoal)


function saveGoal() {
  state.weightGoal = goalInput.value > 0 ? goalInput.value : null
}

function handleLog() {
  if (!weightInput.value || weightInput.value <= 0) return
  logWeight(state, weightInput.value)
  weightInput.value = null
}

const last30 = computed(() =>
  [...state.weightLog]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30)
)

const streak = computed(() => getWeightStreak(state.weightLog))

const currentWeight = computed(() => last30.value.at(-1)?.weight ?? null)

const diff = computed(() => {
  if (currentWeight.value === null || !state.weightGoal) return null
  return +(state.weightGoal - currentWeight.value).toFixed(1)
})

const diffPositive = computed(() => diff.value !== null && diff.value > 0)

const chartMin = computed(() => Math.min(...last30.value.map(e => e.weight)))
const chartMax = computed(() => Math.max(...last30.value.map(e => e.weight)))

const chartCoords = computed(() => {
  if (last30.value.length < 2) return []
  const min = chartMin.value
  const max = chartMax.value
  const range = max - min || 1
  const n = last30.value.length

  return last30.value.map((e, i) => ({
    x: PAD + (i / (n - 1)) * (SVG_W - PAD * 2),
    y: PAD + (1 - (e.weight - min) / range) * (SVG_H - PAD * 2),
  }))
})

const chartPoints = computed(() =>
  chartCoords.value.map(p => `${p.x},${p.y}`).join(' ')
)

// Y positions for min/max labels
const minY = computed(() => {
  const coords = chartCoords.value
  return coords.length ? Math.max(...coords.map(p => p.y)) : SVG_H - PAD
})

const maxY = computed(() => {
  const coords = chartCoords.value
  return coords.length ? Math.min(...coords.map(p => p.y)) : PAD
})

const goalY = computed(() => {
  if (!state.weightGoal || last30.value.length < 2) return null
  const min = chartMin.value
  const max = chartMax.value
  const range = max - min || 1
  const y = PAD + (1 - (state.weightGoal - min) / range) * (SVG_H - PAD * 2)
  return y < PAD ? PAD : y > SVG_H - PAD ? SVG_H - PAD : y
})
</script>
