<template>
  <div class="lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">

    <!-- 1. Weight Trend -->
    <section class="bg-white rounded-2xl border border-pink-100 shadow-sm p-4 mb-4 lg:mb-0">
      <h2 class="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">⚖️ Weight Trend</h2>
      <div v-if="weightAsc.length >= 2">
        <div class="flex gap-3 mb-3">
          <div class="flex-1 bg-pink-50 rounded-xl p-2 text-center">
            <div class="text-xs text-gray-400">Start</div>
            <div class="font-bold text-gray-700">{{ weightAsc[0].weight }}<span class="text-xs text-gray-400 ml-0.5">{{ state.weightUnit }}</span></div>
          </div>
          <div class="flex-1 bg-pink-50 rounded-xl p-2 text-center">
            <div class="text-xs text-gray-400">Current</div>
            <div class="font-bold text-gray-700">{{ weightAsc.at(-1).weight }}<span class="text-xs text-gray-400 ml-0.5">{{ state.weightUnit }}</span></div>
          </div>
          <div class="flex-1 rounded-xl p-2 text-center" :class="weightChange > 0 ? 'bg-orange-50' : 'bg-green-50'">
            <div class="text-xs text-gray-400">Change</div>
            <div class="font-bold" :class="weightChange > 0 ? 'text-orange-400' : 'text-green-500'">
              {{ weightChange > 0 ? '+' : '' }}{{ weightChange }}<span class="text-xs ml-0.5">{{ state.weightUnit }}</span>
            </div>
          </div>
        </div>
        <svg :viewBox="`0 0 ${W} ${H}`" class="w-full h-28" aria-hidden="true">
          <line v-if="goalLineY !== null" :x1="0" :y1="goalLineY" :x2="W" :y2="goalLineY"
            stroke="#c084fc" stroke-width="1" stroke-dasharray="4 3" opacity="0.6" />
          <polyline :points="weightPoints" fill="none" stroke="#f472b6" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" />
          <circle v-for="(p, i) in weightCoords" :key="i" :cx="p.x" :cy="p.y" r="3" fill="#f472b6" />
          <text :x="W - 2" :y="weightCoords[0].y + 4" text-anchor="end" font-size="8" fill="#9ca3af">{{ weightMin }}</text>
          <text :x="W - 2" :y="weightCoords.reduce((a, b) => a.y < b.y ? a : b).y + 4" text-anchor="end" font-size="8" fill="#9ca3af">{{ weightMax }}</text>
        </svg>
      </div>
      <p v-else class="text-xs text-gray-400 text-center py-4">Log weight entries to see your trend.</p>
    </section>

    <!-- 2. Workout History Timeline -->
    <section class="bg-white rounded-2xl border border-pink-100 shadow-sm p-4 mb-4 lg:mb-0">
      <h2 class="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">🏋️ Workout History</h2>
      <div v-if="workoutGroups.length" class="space-y-3 max-h-64 overflow-y-auto pr-1">
        <div v-for="group in workoutGroups" :key="group.date">
          <div class="text-xs font-semibold text-pink-400 mb-1">{{ formatDate(group.date) }}</div>
          <div v-for="(entry, i) in group.entries" :key="i"
            class="flex items-center justify-between text-xs bg-pink-50 rounded-lg px-3 py-1.5 mb-1">
            <span class="text-gray-600">{{ workoutMeta(entry).emoji }} {{ workoutLabel(entry) }}</span>
            <span class="text-pink-500 font-semibold">+{{ entry.xp }} XP</span>
          </div>
        </div>
      </div>
      <p v-else class="text-xs text-gray-400 text-center py-4">No workouts logged yet.</p>
    </section>

    <!-- 3. XP Per Day Bar Chart -->
    <section class="bg-white rounded-2xl border border-pink-100 shadow-sm p-4 mb-4 lg:mb-0">
      <h2 class="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">✨ XP Per Day <span class="text-gray-300 font-normal normal-case">(last 30 days, workouts)</span></h2>
      <div v-if="xpBars.some(b => b.xp > 0)">
        <svg :viewBox="`0 0 ${W} ${BAR_H}`" class="w-full h-28 mt-2" aria-hidden="true">
          <rect v-for="(bar, i) in xpBars" :key="i"
            :x="bar.x" :y="bar.y" :width="bar.w" :height="bar.h"
            :fill="bar.isMax ? '#f472b6' : '#fce7f3'"
            rx="2" />
        </svg>
        <div class="text-xs text-gray-400 text-center mt-1">Best day: <span class="text-pink-500 font-semibold">{{ xpMaxDay.date }} · {{ xpMaxDay.xp }} XP</span></div>
      </div>
      <p v-else class="text-xs text-gray-400 text-center py-4">Log workouts to see daily XP.</p>
    </section>

    <!-- 4. Streaks -->
    <section class="bg-white rounded-2xl border border-pink-100 shadow-sm p-4 mb-4 lg:mb-0">
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

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { state } from '../store/state.js'
import { WORKOUT_META } from '../utils/xp.js'
import { todayStr } from '../utils/dates.js'

const W = 300
const H = 100
const BAR_H = 80
const PAD = 10

// ── Weight trend ─────────────────────────────────────────────────────────────

const weightAsc = computed(() =>
  [...state.weightLog].sort((a, b) => a.date.localeCompare(b.date))
)

const weightMin = computed(() => Math.min(...weightAsc.value.map(e => e.weight)))
const weightMax = computed(() => Math.max(...weightAsc.value.map(e => e.weight)))
const weightChange = computed(() => {
  if (weightAsc.value.length < 2) return 0
  return +(weightAsc.value.at(-1).weight - weightAsc.value[0].weight).toFixed(1)
})

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
  return WORKOUT_META[entry.type] ?? { emoji: '🏃', abbr: entry.type }
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

// ── Streaks ───────────────────────────────────────────────────────────────────

const streakCards = computed(() => [
  { key: 'workout', label: 'Workout', count: state.streaks.workout.count, lastDate: state.streaks.workout.lastDate },
  { key: 'diet',    label: 'Diet',    count: state.streaks.diet.count,    lastDate: state.streaks.diet.lastDate },
  { key: 'deficit', label: 'Deficit', count: state.streaks.deficit.count, lastDate: state.streaks.deficit.lastDate },
])
</script>
