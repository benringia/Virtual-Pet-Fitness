<template>
  <section class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

    <!-- Header row -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-indigo-400 shrink-0" aria-hidden="true">
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
          <path d="M7 21h10"/>
          <path d="M12 3v18"/>
          <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
        </svg>
        Weight Log
      </h2>
      <!-- Unit toggle -->
      <div class="flex bg-gray-100 rounded-lg p-0.5 text-xs font-medium">
        <button
          @click="state.weightUnit = 'kg'"
          :class="state.weightUnit === 'kg' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'"
          class="px-2.5 py-1 rounded-md transition-colors cursor-pointer"
        >kg</button>
        <button
          @click="state.weightUnit = 'lbs'"
          :class="state.weightUnit === 'lbs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'"
          class="px-2.5 py-1 rounded-md transition-colors cursor-pointer"
        >lbs</button>
      </div>
    </div>

    <!-- Current weight hero -->
    <div v-if="currentWeight !== null" class="mb-4">
      <p class="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Current</p>
      <div class="flex items-baseline gap-1.5">
        <span class="text-3xl font-bold text-gray-900">{{ currentWeight }}</span>
        <span class="text-sm text-gray-400">{{ state.weightUnit }}</span>
      </div>
      <!-- Goal progress -->
      <div class="flex items-center gap-3 mt-2">
        <div v-if="state.weightGoal" class="text-xs text-gray-400">
          Goal: <span class="font-semibold text-gray-600">{{ state.weightGoal }} {{ state.weightUnit }}</span>
        </div>
        <div v-if="diff !== null" class="text-xs font-medium"
          :class="diffPositive ? 'text-emerald-500' : 'text-rose-400'"
        >
          {{ diff > 0 ? '+' : '' }}{{ diff }} {{ state.weightUnit }} to goal
        </div>
      </div>
      <!-- Streak badge -->
      <div v-if="streak > 0" class="flex items-center gap-1.5 mt-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 text-amber-500 shrink-0" aria-hidden="true">
          <path fill-rule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.176 7.547 7.547 0 01-1.705-1.715.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clip-rule="evenodd"/>
        </svg>
        <span class="text-xs font-semibold text-amber-700">{{ streak }}-day streak</span>
        <span v-if="streak >= 7" class="text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 font-bold">+15 XP</span>
      </div>
    </div>

    <!-- Mini chart (last 7 entries) -->
    <div v-if="last7.length >= 2" class="mb-4 bg-gray-50 rounded-xl p-3">
      <p class="text-xs text-gray-400 mb-2">Last {{ last7.length }} entries</p>
      <svg :viewBox="`0 0 ${SVG_W} ${SVG_H}`" class="w-full h-14" aria-hidden="true">
        <!-- Goal line -->
        <line
          v-if="state.weightGoal && goalY !== null"
          :x1="0" :y1="goalY" :x2="SVG_W" :y2="goalY"
          stroke="#c084fc" stroke-width="1" stroke-dasharray="4 3" opacity="0.7"
        />
        <!-- Area fill -->
        <defs>
          <linearGradient id="weight-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#6366f1" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <polygon
          v-if="chartCoords.length >= 2"
          :points="areaPoints"
          fill="url(#weight-fill)"
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

    <p v-else-if="!last7.length" class="text-xs text-gray-400 text-center py-2 mb-4">
      Log your weight to see your trend chart.
    </p>

    <div v-if="showForm" class="border-t border-gray-100 pt-4 flex flex-col gap-2">
      <!-- Weight input -->
      <div class="flex flex-col gap-1">
        <label for="weight-input" class="text-xs font-medium text-gray-500">Today's weight</label>
        <input
          id="weight-input"
          v-model.number="weightInput"
          type="number"
          min="1"
          step="0.1"
          :placeholder="`e.g. 72.5 ${state.weightUnit}`"
          class="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-shadow"
        />
      </div>
      <!-- Goal input -->
      <div class="flex flex-col gap-1">
        <label for="goal-input" class="text-xs font-medium text-gray-500">
          Goal weight <span class="font-normal text-gray-400">(optional)</span>
        </label>
        <input
          id="goal-input"
          v-model.number="goalInput"
          type="number"
          min="1"
          step="0.1"
          :placeholder="`e.g. 68 ${state.weightUnit}`"
          @change="saveGoal"
          class="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-shadow"
        />
      </div>
      <button
        @click="handleLog"
        :disabled="!weightInput || weightInput <= 0"
        class="w-full bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-indigo-600 active:bg-indigo-700 transition-colors"
      >
        Log Weight
      </button>
      <button
        @click="showForm = false"
        class="w-full text-xs text-gray-400 hover:text-gray-600 cursor-pointer transition-colors py-1 mt-1"
      >
        cancel
      </button>
    </div>
    <button
      v-else
      @click="showForm = true"
      class="mt-2 text-xs text-indigo-400 hover:text-indigo-600 cursor-pointer transition-colors flex items-center gap-1"
    >
      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
      Update weight
    </button>

  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { state } from '../store/state.js'
import { logWeight, getWeightStreak } from '../utils/weight.js'
import { triggerAchievement } from '../utils/achievements.js'
import { todayStr } from '../utils/dates.js'

const SVG_W = 300
const SVG_H = 80
const PAD = 10

const showForm = ref(!state.weightLog.some(w => w.date === todayStr()))

const weightInput = ref(null)
const goalInput = ref(state.weightGoal)

function saveGoal() {
  state.weightGoal = goalInput.value > 0 ? goalInput.value : null
}

watch(() => state.weightGoal, (val) => {
  if (val === null) goalInput.value = ''
})

function handleLog() {
  if (!weightInput.value || weightInput.value <= 0) return
  logWeight(state, weightInput.value)
  weightInput.value = null
  goalInput.value = ''
  showForm.value = false
  if (state.weightGoal && currentWeight.value !== null && currentWeight.value <= state.weightGoal) {
    triggerAchievement('weight', '⚖️', 'Weight goal reached!', 'You hit your target weight', `weight-goal-${todayStr()}`)
  }
}

const last7 = computed(() =>
  [...state.weightLog]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7)
)

const streak = computed(() => getWeightStreak(state.weightLog))
const currentWeight = computed(() => last7.value.at(-1)?.weight ?? null)

const diff = computed(() => {
  if (currentWeight.value === null || !state.weightGoal) return null
  return +(state.weightGoal - currentWeight.value).toFixed(1)
})
const diffPositive = computed(() => diff.value !== null && diff.value > 0)

const chartMin = computed(() => Math.min(...last7.value.map(e => e.weight)))
const chartMax = computed(() => Math.max(...last7.value.map(e => e.weight)))

const chartCoords = computed(() => {
  if (last7.value.length < 2) return []
  const min = chartMin.value
  const max = chartMax.value
  const range = max - min || 1
  const n = last7.value.length
  return last7.value.map((e, i) => ({
    x: PAD + (i / (n - 1)) * (SVG_W - PAD * 2),
    y: PAD + (1 - (e.weight - min) / range) * (SVG_H - PAD * 2),
  }))
})

const chartPoints = computed(() =>
  chartCoords.value.map(p => `${p.x},${p.y}`).join(' ')
)

const areaPoints = computed(() => {
  if (chartCoords.value.length < 2) return ''
  const pts = chartCoords.value
  const top = pts.map(p => `${p.x},${p.y}`).join(' ')
  return `${top} ${pts.at(-1).x},${SVG_H} ${pts[0].x},${SVG_H}`
})

const minY = computed(() => {
  const coords = chartCoords.value
  return coords.length ? Math.max(...coords.map(p => p.y)) : SVG_H - PAD
})
const maxY = computed(() => {
  const coords = chartCoords.value
  return coords.length ? Math.min(...coords.map(p => p.y)) : PAD
})

const goalY = computed(() => {
  if (!state.weightGoal || last7.value.length < 2) return null
  const min = chartMin.value
  const max = chartMax.value
  const range = max - min || 1
  const y = PAD + (1 - (state.weightGoal - min) / range) * (SVG_H - PAD * 2)
  return y < PAD ? PAD : y > SVG_H - PAD ? SVG_H - PAD : y
})
</script>
