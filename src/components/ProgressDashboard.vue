<template>
  <div>
    <div class="mb-4">
      <button
        @click="showWeeklyReport = true"
        class="w-full border border-indigo-300 text-indigo-500 hover:bg-indigo-50 font-medium py-2.5 rounded-xl text-sm transition-colors"
      >
        📊 Weekly Report
      </button>
    </div>

    <div class="lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">

    <!-- 1. Weight Trend -->
    <section class="bg-white rounded-2xl border border-indigo-100 shadow-sm p-4 mb-4 lg:mb-0">
      <h2 class="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">⚖️ Weight Trend</h2>
      <div v-if="weightAsc.length >= 2">
        <div class="flex gap-3 mb-3">
          <div class="flex-1 bg-indigo-50 rounded-xl p-2 text-center">
            <div class="text-xs text-gray-400">Start</div>
            <div class="font-bold text-gray-700">{{ weightStartDisplay }}<span class="text-xs text-gray-400 ml-0.5">{{ state.weightUnit }}</span></div>
          </div>
          <div class="flex-1 bg-indigo-50 rounded-xl p-2 text-center">
            <div class="text-xs text-gray-400">Current</div>
            <div class="font-bold text-gray-700">{{ weightCurrentDisplay }}<span class="text-xs text-gray-400 ml-0.5">{{ state.weightUnit }}</span></div>
          </div>
          <div class="flex-1 rounded-xl p-2 text-center" :class="weightChange > 0 ? 'bg-orange-50' : 'bg-green-50'">
            <div class="text-xs text-gray-400">Change</div>
            <div class="font-bold" :class="weightChange > 0 ? 'text-orange-400' : 'text-green-500'">
              {{ weightChange > 0 ? '+' : '' }}{{ weightChangeDisplay }}<span class="text-xs ml-0.5">{{ state.weightUnit }}</span>
            </div>
          </div>
        </div>
        <svg :viewBox="`0 0 ${W} ${H}`" class="w-full h-28" aria-hidden="true">
          <line v-if="goalLineY !== null" :x1="0" :y1="goalLineY" :x2="W" :y2="goalLineY"
            stroke="#c084fc" stroke-width="1" stroke-dasharray="4 3" opacity="0.6" />
          <polyline :points="weightPoints" fill="none" stroke="#6366f1" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" />
          <circle v-for="(p, i) in weightCoords" :key="i" :cx="p.x" :cy="p.y" r="3" fill="#6366f1" />
          <text :x="W - 2" :y="weightCoords[0].y + 4" text-anchor="end" font-size="8" fill="#9ca3af">{{ weightMinDisplay }}</text>
          <text :x="W - 2" :y="weightCoords.reduce((a, b) => a.y < b.y ? a : b).y + 4" text-anchor="end" font-size="8" fill="#9ca3af">{{ weightMaxDisplay }}</text>
        </svg>
      </div>
      <p v-else class="text-xs text-gray-400 text-center py-4">Log weight entries to see your trend.</p>
    </section>

    <!-- 2. Workout History Timeline -->
    <section class="bg-white rounded-2xl border border-indigo-100 shadow-sm p-4 mb-4 lg:mb-0">
      <h2 class="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">🏋️ Workout History</h2>
      <div v-if="workoutGroups.length" class="space-y-3 max-h-64 overflow-y-auto pr-1">
        <div v-for="group in workoutGroups" :key="group.date">
          <div class="text-xs font-semibold text-indigo-400 mb-1">{{ formatDate(group.date) }}</div>
          <div v-for="(entry, i) in group.entries" :key="i"
            class="flex items-center justify-between text-xs bg-indigo-50 rounded-lg px-3 py-1.5 mb-1">
            <span class="text-gray-600">{{ workoutMeta(entry).emoji }} {{ workoutLabel(entry) }}</span>
            <span class="text-indigo-500 font-semibold">+{{ entry.xp }} XP</span>
          </div>
        </div>
      </div>
      <p v-else class="text-xs text-gray-400 text-center py-4">No workouts logged yet.</p>
    </section>

    <!-- 3. XP Per Day Bar Chart -->
    <section class="bg-white rounded-2xl border border-indigo-100 shadow-sm p-4 mb-4 lg:mb-0">
      <h2 class="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">✨ XP Per Day <span class="text-gray-300 font-normal normal-case">(last 30 days, workouts)</span></h2>
      <div v-if="xpBars.some(b => b.xp > 0)">
        <svg :viewBox="`0 0 ${W} ${BAR_H}`" class="w-full h-28 mt-2" aria-hidden="true">
          <rect v-for="(bar, i) in xpBars" :key="i"
            :x="bar.x" :y="bar.y" :width="bar.w" :height="bar.h"
            :fill="bar.isMax ? '#6366f1' : '#eef2ff'"
            rx="2" />
        </svg>
        <div class="text-xs text-gray-400 text-center mt-1">Best day: <span class="text-indigo-500 font-semibold">{{ xpMaxDay.date }} · {{ xpMaxDay.xp }} XP</span></div>
      </div>
      <p v-else class="text-xs text-gray-400 text-center py-4">Log workouts to see daily XP.</p>
    </section>

    <!-- 4. Streaks -->
    <section class="bg-white rounded-2xl border border-indigo-100 shadow-sm p-4 mb-4 lg:mb-0">
      <h2 class="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">🔥 Streaks</h2>
      <div class="flex gap-3">
        <div v-for="s in streakCards" :key="s.key"
          class="flex-1 rounded-xl border p-3 text-center"
          :class="s.count > 0 ? 'border-yellow-200 bg-yellow-50' : 'border-gray-100 bg-gray-50'">
          <div class="text-lg mb-1">{{ s.count > 0 ? '🔥' : '💤' }}</div>
          <div class="text-2xl font-bold" :class="s.count > 0 ? 'text-yellow-600' : 'text-gray-300'">{{ s.count }}</div>
          <div class="text-xs font-semibold text-gray-500 mt-1">{{ s.label }}</div>
          <div v-if="s.lastDate" class="text-xs text-gray-400 mt-0.5">last: {{ s.lastDate }}</div>
        </div>
      </div>
    </section>

    <!-- 5. Monthly Predictions -->
    <section class="bg-white rounded-2xl border border-indigo-100 shadow-sm p-4 mb-4 lg:mb-0 lg:col-span-2">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-base">🔮</span>
        <h2 class="text-xs font-bold tracking-widest text-gray-400 uppercase">Monthly Predictions</h2>
      </div>

      <!-- Tab row -->
      <div class="flex gap-2 mb-4">
        <button
          v-for="tab in predTabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
          :class="activeTab === tab.key ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-indigo-50'"
        >{{ tab.label }}</button>
      </div>

      <!-- Calories tab -->
      <template v-if="activeTab === 'calories'">
        <p v-if="!predictions.calories.hasData" class="text-xs text-gray-400 text-center py-4">log a calorie day to unlock 🔥</p>
        <template v-else>
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-indigo-50 rounded-xl p-3 text-center">
              <div class="text-xs text-gray-400 mb-1">projected deficit</div>
              <div class="text-lg font-bold text-indigo-500">{{ predictions.calories.projected30dDeficit.toLocaleString() }}</div>
              <div class="text-xs text-gray-400">kcal</div>
            </div>
            <div class="rounded-xl p-3 text-center" :class="predictions.calories.weightChangeKg >= 0 ? 'bg-green-50' : 'bg-orange-50'">
              <div class="text-xs text-gray-400 mb-1">est. weight change</div>
              <div class="text-lg font-bold" :class="predictions.calories.weightChangeKg >= 0 ? 'text-green-500' : 'text-orange-400'">
                {{ predictions.calories.weightChangeKg >= 0 ? '-' : '+' }}{{ Math.abs(toDisplay(predictions.calories.weightChangeKg)) }}
              </div>
              <div class="text-xs text-gray-400">{{ state.weightUnit }}</div>
            </div>
            <div class="bg-gray-50 rounded-xl p-3 text-center">
              <div class="text-xs text-gray-400 mb-1">avg daily deficit</div>
              <div class="text-lg font-bold text-gray-600">{{ predictions.calories.avgDailyDeficit }}</div>
              <div class="text-xs text-gray-400">kcal/day</div>
            </div>
          </div>
          <p class="text-xs text-gray-300 mt-3 text-right">Based on your last 7 days of calorie data</p>
        </template>
      </template>

      <!-- Workouts tab -->
      <template v-else-if="activeTab === 'workouts'">
        <p v-if="!predictions.workouts.hasData" class="text-xs text-gray-400 text-center py-4">log a workout to unlock 🏋️</p>
        <template v-else>
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-indigo-50 rounded-xl p-3 text-center">
              <div class="text-xs text-gray-400 mb-1">projected sessions</div>
              <div class="text-lg font-bold text-indigo-500">~{{ predictions.workouts.projected30d }}</div>
              <div class="text-xs text-gray-400">/ month</div>
            </div>
            <div class="bg-gray-50 rounded-xl p-3 text-center">
              <div class="text-xs text-gray-400 mb-1">weekly average</div>
              <div class="text-lg font-bold text-gray-600">{{ predictions.workouts.weeklyAvg }}</div>
              <div class="text-xs text-gray-400">/ week</div>
            </div>
            <div class="bg-gray-50 rounded-xl p-3 text-center opacity-40">
              <div class="text-xs text-gray-400 mb-1">—</div>
              <div class="text-lg font-bold text-gray-300">—</div>
              <div class="text-xs text-gray-400"></div>
            </div>
          </div>
          <p class="text-xs text-gray-300 mt-3 text-right">Based on your last 14 days of workouts</p>
        </template>
      </template>

      <!-- XP & level tab -->
      <template v-else>
        <p v-if="!predictions.xp.hasData" class="text-xs text-gray-400 text-center py-4">log workouts or habits to unlock ✨</p>
        <template v-else>
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-indigo-50 rounded-xl p-3 text-center">
              <div class="text-xs text-gray-400 mb-1">projected xp</div>
              <div class="text-lg font-bold text-indigo-500">+{{ predictions.xp.projected30d.toLocaleString() }}</div>
              <div class="text-xs text-gray-400">xp</div>
            </div>
            <div class="bg-indigo-50 rounded-xl p-3 text-center">
              <div class="text-xs text-gray-400 mb-1">levels gained</div>
              <div class="text-lg font-bold text-indigo-500">{{ predictions.xp.levelsGained }}</div>
              <div class="text-xs text-gray-400">→ lvl {{ predictions.xp.projectedLevel }}</div>
            </div>
            <div class="bg-gray-50 rounded-xl p-3 text-center">
              <div class="text-xs text-gray-400 mb-1">avg daily xp</div>
              <div class="text-lg font-bold text-gray-600">{{ predictions.xp.avgDailyXp }}</div>
              <div class="text-xs text-gray-400">xp/day</div>
            </div>
          </div>
          <p class="text-xs text-gray-300 mt-3 text-right">Based on your last 14 days of activity</p>
        </template>
      </template>
    </section>

    <!-- 6. Evolution Path -->
    <section class="bg-white rounded-2xl border border-indigo-100 shadow-sm p-4 mb-4 lg:mb-0 lg:col-span-2">
      <p class="text-xs font-bold tracking-widest text-gray-400 uppercase mb-5">Evolution Path</p>
      <div class="relative flex items-start justify-between px-4">
        <!-- Base line -->
        <div class="absolute top-5 left-8 right-8 h-0.5 bg-indigo-100 z-0"></div>
        <!-- Progress line -->
        <div
          class="absolute top-5 left-8 h-0.5 bg-indigo-400 z-0 transition-all duration-500"
          :style="{ width: currentStageIndex > 0 ? `calc(${(currentStageIndex / (STAGE_LIST.length - 1)) * 100}% - 4rem + 2rem)` : '0%' }"
        ></div>

        <!-- Stage nodes -->
        <div v-for="(s, i) in STAGE_LIST" :key="s.name" class="relative z-10 flex flex-col items-center gap-1 w-16">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2"
            :class="i < currentStageIndex  ? 'bg-indigo-100 border-indigo-300'
                   : i === currentStageIndex ? 'bg-indigo-500 border-indigo-500'
                   : 'bg-white border-gray-200'"
          >
            <span :class="i > currentStageIndex ? 'opacity-30' : ''">{{ s.emoji }}</span>
          </div>
          <span v-if="i === currentStageIndex"
            class="text-xs bg-indigo-500 text-white rounded-full px-1.5 py-0.5 leading-none font-medium">now</span>
          <span v-else-if="i < currentStageIndex" class="text-xs text-indigo-400">✓</span>
          <span v-else class="text-xs opacity-0" aria-hidden="true">·</span>
          <span
            class="text-xs font-medium text-center"
            :class="i === currentStageIndex ? 'text-indigo-500'
                   : i < currentStageIndex  ? 'text-indigo-400'
                   : 'text-gray-300'"
          >{{ s.name.toLowerCase() }}</span>
        </div>
      </div>
    </section>

    </div><!-- end grid -->
  </div><!-- end wrapper -->
</template>

<script setup>
import { ref, computed } from 'vue'
import { state } from '../store/state.js'
import { WORKOUT_META, STAGE_LIST, getStageFromLevel } from '../utils/xp.js'
import { todayStr } from '../utils/dates.js'
import { computePredictions } from '../utils/predictions.js'
import { showWeeklyReport } from '../utils/weeklyReport.js'

const W = 300
const H = 100
const BAR_H = 80
const PAD = 10

const KG_TO_LBS = 2.20462
const toDisplay = (kg) => kg === null ? null : (state.weightUnit === 'lbs' ? +(kg * KG_TO_LBS).toFixed(1) : +kg.toFixed(1))

const weightAsc = computed(() =>
  [...state.weightLog].sort((a, b) => a.date.localeCompare(b.date))
)

const weightMin = computed(() => weightAsc.value.length ? Math.min(...weightAsc.value.map(e => e.weight)) : 0)
const weightMax = computed(() => weightAsc.value.length ? Math.max(...weightAsc.value.map(e => e.weight)) : 0)

const weightMinDisplay = computed(() => toDisplay(weightMin.value))
const weightMaxDisplay = computed(() => toDisplay(weightMax.value))
const weightStartDisplay = computed(() => weightAsc.value.length ? toDisplay(weightAsc.value[0].weight) : 0)
const weightCurrentDisplay = computed(() => weightAsc.value.length ? toDisplay(weightAsc.value.at(-1).weight) : 0)

const weightChange = computed(() => {
  if (weightAsc.value.length < 2) return 0
  return +(weightAsc.value.at(-1).weight - weightAsc.value[0].weight).toFixed(2)
})
const weightChangeDisplay = computed(() => toDisplay(Math.abs(weightChange.value)))

const weightCoords = computed(() => {
  const n = weightAsc.value.length
  if (n < 2) return []
  const min = weightMin.value
  const range = weightMax.value - min || 1
  return weightAsc.value.map((e, i) => ({
    x: PAD + (i / (n - 1)) * (W - PAD * 2),
    y: PAD + (1 - (e.weight - min) / range) * (H - PAD * 2),
  }))
})

const weightPoints = computed(() => weightCoords.value.map(p => `${p.x},${p.y}`).join(' '))

const goalLineY = computed(() => {
  if (!state.weightGoal || weightAsc.value.length < 2) return null
  const min = weightMin.value
  const range = weightMax.value - min || 1
  const y = PAD + (1 - (state.weightGoal - min) / range) * (H - PAD * 2)
  return Math.min(Math.max(y, PAD), H - PAD)
})

// ── Workout history ───────────────────────────────────────────────────────────

function workoutLabel(entry) {
  return entry.name ?? `${entry.activity} (${entry.intensity})`
}

function workoutMeta(entry) {
  if (WORKOUT_META[entry.type]) return WORKOUT_META[entry.type]
  const wt = state.workoutTypes.find(t => t.name === entry.type)
  return { emoji: '🏃', abbr: entry.type, dot: '', color: wt?.color }
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const workoutGroups = computed(() => {
  const sorted = [...state.workouts].sort((a, b) => b.date.localeCompare(a.date))
  const map = new Map()
  for (const entry of sorted) {
    if (!map.has(entry.date)) map.set(entry.date, [])
    map.get(entry.date).push(entry)
  }
  return [...map.entries()].map(([date, entries]) => ({ date, entries }))
})

// ── XP per day bar chart ──────────────────────────────────────────────────────

const xpByDay = computed(() => {
  const today = todayStr()
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (29 - i))
    return d.toISOString().slice(0, 10)
  })
  const totals = new Map(days.map(d => [d, 0]))
  for (const w of state.workouts) {
    if (totals.has(w.date)) totals.set(w.date, totals.get(w.date) + w.xp)
  }
  return days.map(d => ({ date: d, xp: totals.get(d) }))
})

const xpMax = computed(() => Math.max(...xpByDay.value.map(d => d.xp), 1))
const xpMaxDay = computed(() => xpByDay.value.reduce((a, b) => b.xp > a.xp ? b : a, { date: '—', xp: 0 }))

const xpBars = computed(() => {
  const n = xpByDay.value.length
  const barW = (W - PAD * 2) / n - 1
  const maxXp = xpMax.value
  return xpByDay.value.map((d, i) => {
    const h = d.xp > 0 ? Math.max(2, (d.xp / maxXp) * (BAR_H - PAD * 2)) : 0
    return {
      x: PAD + i * ((W - PAD * 2) / n),
      y: BAR_H - PAD - h,
      w: barW,
      h,
      xp: d.xp,
      date: d.date,
      isMax: d.xp === maxXp && d.xp > 0,
    }
  })
})

// ── Monthly Predictions ───────────────────────────────────────────────────────

const activeTab = ref('calories')
const predTabs = [
  { key: 'calories', label: 'calories' },
  { key: 'workouts', label: 'workouts' },
  { key: 'xp',       label: 'xp & level' },
]
const predictions = computed(() => computePredictions(state))

// ── Evolution Path ────────────────────────────────────────────────────────────

const currentStage = computed(() => getStageFromLevel(state.level))
const currentStageIndex = computed(() => STAGE_LIST.findIndex(s => s.name === currentStage.value))

// ── Streaks ───────────────────────────────────────────────────────────────────

const streakCards = computed(() => [
  { key: 'workout', label: 'Workout', count: state.streaks.workout.count, lastDate: state.streaks.workout.lastDate },
  { key: 'diet',    label: 'Diet',    count: state.streaks.diet.count,    lastDate: state.streaks.diet.lastDate },
  { key: 'deficit', label: 'Deficit', count: state.streaks.deficit.count, lastDate: state.streaks.deficit.lastDate },
])
</script>
