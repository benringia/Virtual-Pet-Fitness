<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-slate-800 mb-8 px-1">Mastery Overview</h1>

    <!-- Row 1: High Level Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-stretch">
      <!-- 1. Weight Trend (Col 1-2) -->
      <section class="md:col-span-2 bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 shadow-xl shadow-indigo-100/20 rounded-3xl p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-200/50 flex flex-col">
        <h2 class="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4 px-1">⚖️ Weight Trend</h2>
        <div v-if="weightAsc.length >= 2" class="flex-1 flex flex-col">
          <div class="flex gap-4 mb-6">
            <div class="flex-1 bg-white border border-indigo-50 rounded-2xl p-3 text-center shadow-sm">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Start</div>
              <div class="text-lg font-bold text-slate-700">{{ weightStartDisplay }}<span class="text-xs text-slate-400 ml-1">{{ state.weightUnit }}</span></div>
            </div>
            <div class="flex-1 bg-white border border-indigo-50 rounded-2xl p-3 text-center shadow-sm">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current</div>
              <div class="text-lg font-bold text-slate-700">{{ weightCurrentDisplay }}<span class="text-xs text-slate-400 ml-1">{{ state.weightUnit }}</span></div>
            </div>
            <div class="flex-1 border rounded-2xl p-3 text-center shadow-sm" :class="weightChange > 0 ? 'bg-orange-50 border-orange-100' : 'bg-emerald-50 border-emerald-100'">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Change</div>
              <div class="text-lg font-bold" :class="weightChange > 0 ? 'text-orange-600' : 'text-emerald-600'">
                {{ weightChange > 0 ? '+' : '' }}{{ weightChangeDisplay }}<span class="text-xs ml-1">{{ state.weightUnit }}</span>
              </div>
            </div>
          </div>
          <div class="px-2 mt-auto">
            <svg :viewBox="`0 0 ${W} ${H}`" class="w-full h-32" aria-hidden="true">
              <line v-if="goalLineY !== null" :x1="0" :y1="goalLineY" :x2="W" :y2="goalLineY"
                stroke="#c084fc" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.4" />
              <polyline :points="weightPoints" fill="none" stroke="#6366f1" stroke-width="3"
                stroke-linejoin="round" stroke-linecap="round" />
              <circle v-for="(p, i) in weightCoords" :key="i" :cx="p.x" :cy="p.y" r="4" fill="#6366f1" class="shadow-sm" />
              <text :x="W - 2" :y="weightCoords[0].y + 4" text-anchor="end" font-size="9" font-weight="bold" fill="#94a3b8">{{ weightMinDisplay }}</text>
              <text :x="W - 2" :y="weightCoords.reduce((a, b) => a.y < b.y ? a : b).y + 4" text-anchor="end" font-size="9" font-weight="bold" fill="#94a3b8">{{ weightMaxDisplay }}</text>
            </svg>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-12 text-slate-400 flex-1">
          <span class="text-3xl mb-2">📉</span>
          <p class="text-xs font-bold uppercase tracking-widest">Entry needed</p>
        </div>
      </section>

      <!-- 2. Streaks (Col 3) -->
      <section class="md:col-span-1 bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 shadow-xl shadow-indigo-100/20 rounded-3xl p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-200/50 flex flex-col">
        <h2 class="text-xs font-bold tracking-widest text-slate-400 uppercase mb-5 px-1">🔥 Current Streaks</h2>
        <div class="flex flex-col gap-4 flex-1">
          <div v-for="s in streakCards" :key="s.key"
            class="flex items-center gap-4 bg-white border rounded-2xl p-4 shadow-sm"
            :class="s.count > 0 ? 'border-orange-100' : 'border-slate-100'">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner"
                 :class="s.count > 0 ? 'bg-orange-50' : 'bg-slate-50'">
              {{ s.count > 0 ? (s.key === 'workout' ? '⚡' : (s.key === 'diet' ? '🥗' : '🔥')) : '💤' }}
            </div>
            <div class="flex-1">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{{ s.label }}</div>
              <div class="flex items-baseline gap-1">
                <span class="text-2xl font-black" :class="s.count > 0 ? 'text-slate-800' : 'text-slate-300'">{{ s.count }}</span>
                <span class="text-[10px] font-bold text-slate-400">DAYS</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Row 2: Activity Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-stretch">
      <!-- 3. XP Per Day (Col 1-2) -->
      <section class="md:col-span-2 bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 shadow-xl shadow-indigo-100/20 rounded-3xl p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-200/50 flex flex-col">
        <h2 class="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1 px-1">✨ XP Per Day <span class="text-slate-300 font-normal normal-case">(last 30 days)</span></h2>
        <div v-if="xpBars.some(b => b.xp > 0)" class="flex-1 flex flex-col">
          <div class="px-2 mt-4 flex-1 flex items-end">
            <svg :viewBox="`0 0 ${W} ${BAR_H}`" class="w-full h-32" aria-hidden="true">
              <rect v-for="(bar, i) in xpBars" :key="i"
                :x="bar.x" :y="bar.y" :width="bar.w" :height="bar.h"
                :fill="bar.isMax ? '#6366f1' : '#e2e8f0'"
                rx="3" />
            </svg>
          </div>
          <div class="mt-6 flex items-center justify-center gap-2">
             <div class="bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 flex items-center gap-2">
               <span class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Best day</span>
               <span class="text-xs font-black text-indigo-600 tracking-tight">{{ xpMaxDay.date }} · {{ xpMaxDay.xp }} XP</span>
             </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-12 text-slate-400 flex-1">
          <span class="text-3xl mb-2">✨</span>
          <p class="text-xs font-bold uppercase tracking-widest">Start evolving</p>
        </div>
      </section>

      <!-- 4. Workout History (Col 3) -->
      <section class="md:col-span-1 bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 shadow-xl shadow-indigo-100/20 rounded-3xl p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-200/50 flex flex-col">
        <h2 class="text-xs font-bold tracking-widest text-slate-400 uppercase mb-5 px-1">🏋️ Recent History</h2>
        <div v-if="limitedWorkoutGroups.length" class="space-y-4 flex-1">
          <div v-for="group in limitedWorkoutGroups" :key="group.date" class="relative pl-4 border-l-2 border-indigo-100 pb-2 last:pb-0">
            <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-indigo-400 shadow-sm"></div>
            <div class="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 leading-none">{{ formatDate(group.date) }}</div>
            <div v-for="(entry, i) in group.entries" :key="i"
              class="flex items-center justify-between bg-white border border-slate-50 rounded-xl px-3 py-2.5 mb-2 shadow-sm last:mb-0">
              <span class="text-[11px] font-bold text-slate-700">{{ workoutMeta(entry).emoji }} {{ workoutLabel(entry) }}</span>
              <span class="text-[10px] font-black text-emerald-500 uppercase">+{{ entry.xp }} XP</span>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-12 text-slate-400 flex-1">
          <span class="text-3xl mb-2">💪</span>
          <p class="text-xs font-bold uppercase tracking-widest">No reps yet</p>
        </div>
      </section>
    </div>

    <!-- 5. Monthly Predictions -->
    <section class="bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 shadow-xl shadow-indigo-100/20 rounded-3xl p-8 mb-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-200/50">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🔮</div>
          <h2 class="text-sm font-black text-slate-800 uppercase tracking-widest">Monthly Predictions</h2>
        </div>

        <!-- Tab row -->
        <div class="flex bg-slate-100/50 p-1 rounded-2xl border border-slate-100 self-start md:self-auto">
          <button
            v-for="tab in predTabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300"
            :class="activeTab === tab.key ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'"
          >{{ tab.label }}</button>
        </div>
      </div>

      <!-- Calories tab -->
      <template v-if="activeTab === 'calories'">
        <p v-if="!predictions.calories.hasData" class="text-[11px] font-bold text-slate-400 text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 uppercase tracking-widest">log a calorie day to unlock 🔥</p>
        <template v-else>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white border border-indigo-50 shadow-sm rounded-2xl p-5 text-center">
              <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">projected deficit</div>
              <div class="text-2xl font-black text-indigo-600 tracking-tight">{{ predictions.calories.projected30dDeficit.toLocaleString() }}</div>
              <div class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">kcal / month</div>
            </div>
            <div class="bg-white border shadow-sm rounded-2xl p-5 text-center" :class="predictions.calories.weightChangeKg >= 0 ? 'border-emerald-100' : 'border-orange-100'">
              <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">est. weight change</div>
              <div class="text-2xl font-black tracking-tight" :class="predictions.calories.weightChangeKg >= 0 ? 'text-emerald-600' : 'text-orange-600'">
                {{ predictions.calories.weightChangeKg >= 0 ? '-' : '+' }}{{ Math.abs(toDisplay(predictions.calories.weightChangeKg)) }}
              </div>
              <div class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{{ state.weightUnit }} total</div>
            </div>
            <div class="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-center">
              <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">avg daily deficit</div>
              <div class="text-2xl font-black text-slate-700 tracking-tight">{{ predictions.calories.avgDailyDeficit }}</div>
              <div class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">kcal / day</div>
            </div>
          </div>
          <p class="text-[10px] font-bold text-slate-300 mt-6 text-right uppercase tracking-widest italic">Based on your last 7 days of data</p>
        </template>
      </template>

      <!-- Workouts tab -->
      <template v-else-if="activeTab === 'workouts'">
        <p v-if="!predictions.workouts.hasData" class="text-[11px] font-bold text-slate-400 text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 uppercase tracking-widest">log a workout to unlock 🏋️</p>
        <template v-else>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white border border-indigo-50 shadow-sm rounded-2xl p-5 text-center">
              <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">projected sessions</div>
              <div class="text-2xl font-black text-indigo-600 tracking-tight">~{{ predictions.workouts.projected30d }}</div>
              <div class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">sessions / month</div>
            </div>
            <div class="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-center">
              <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">weekly average</div>
              <div class="text-2xl font-black text-slate-700 tracking-tight">{{ predictions.workouts.weeklyAvg }}</div>
              <div class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">sessions / week</div>
            </div>
          </div>
          <p class="text-[10px] font-bold text-slate-300 mt-6 text-right uppercase tracking-widest italic">Based on your last 14 days of activity</p>
        </template>
      </template>

      <!-- XP & level tab -->
      <template v-else>
        <p v-if="!predictions.xp.hasData" class="text-[11px] font-bold text-slate-400 text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 uppercase tracking-widest">log workouts or habits to unlock ✨</p>
        <template v-else>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white border border-indigo-50 shadow-sm rounded-2xl p-5 text-center">
              <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">projected xp</div>
              <div class="text-2xl font-black text-indigo-600 tracking-tight">+{{ predictions.xp.projected30d.toLocaleString() }}</div>
              <div class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">xp / month</div>
            </div>
            <div class="bg-white border border-indigo-50 shadow-sm rounded-2xl p-5 text-center">
              <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">levels gained</div>
              <div class="text-2xl font-black text-indigo-600 tracking-tight">{{ predictions.xp.levelsGained }}</div>
              <div class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">→ LVL {{ predictions.xp.projectedLevel }}</div>
            </div>
            <div class="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-center">
              <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">avg daily xp</div>
              <div class="text-2xl font-black text-slate-700 tracking-tight">{{ predictions.xp.avgDailyXp }}</div>
              <div class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">xp / day</div>
            </div>
          </div>
          <p class="text-[10px] font-bold text-slate-300 mt-6 text-right uppercase tracking-widest italic">Based on your last 14 days of activity</p>
        </template>
      </template>
    </section>

    <!-- 6. Evolution Path -->
    <section class="bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 shadow-xl shadow-indigo-100/20 rounded-3xl p-8 mb-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-200/50 overflow-x-auto overflow-y-hidden">
      <h2 class="text-xs font-bold tracking-widest text-slate-400 uppercase mb-10 px-1">🏆 Evolution Path</h2>
      <div class="relative flex items-start justify-between px-8 min-w-[600px] py-4">
        <!-- Base line -->
        <div class="absolute top-10 left-12 right-12 h-1 bg-slate-100 z-0 rounded-full"></div>
        <!-- Progress line -->
        <div
          class="absolute top-10 left-12 h-1 bg-gradient-to-r from-indigo-400 to-indigo-600 z-0 transition-all duration-1000 rounded-full shadow-sm shadow-indigo-200"
          :style="{ width: currentStageIndex > 0 ? `calc(${(currentStageIndex / (STAGE_LIST.length - 1)) * 100}%)` : '0%' }"
        ></div>

        <!-- Stage nodes -->
        <div v-for="(s, i) in STAGE_LIST" :key="s.name" class="relative z-10 flex flex-col items-center gap-3 w-20">
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all duration-500 shadow-sm"
            :class="i < currentStageIndex  ? 'bg-indigo-50 border-indigo-300 text-indigo-400'
                   : i === currentStageIndex ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200 scale-110'
                   : 'bg-white border-slate-200 text-slate-200'"
          >
            <span :class="i > currentStageIndex ? 'grayscale opacity-30' : ''">{{ s.emoji }}</span>
          </div>
          
          <div class="flex flex-col items-center">
            <span
              class="text-[10px] font-black uppercase tracking-widest"
              :class="i === currentStageIndex ? 'text-indigo-600'
                     : i < currentStageIndex  ? 'text-indigo-400'
                     : 'text-slate-300'"
            >{{ s.name }}</span>
            <div v-if="i === currentStageIndex" class="mt-1 px-2 py-0.5 bg-indigo-600 text-[8px] font-black text-white rounded-full uppercase tracking-tighter shadow-sm animate-pulse">active</div>
            <div v-else-if="i < currentStageIndex" class="text-emerald-500 text-[10px] mt-1 font-black">✓</div>
          </div>
        </div>
      </div>
    </section>
  </div>
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

const limitedWorkoutGroups = computed(() => {
  // Limit to last 5 entries total
  let count = 0
  const limited = []
  for (const group of workoutGroups.value) {
    const entries = []
    for (const entry of group.entries) {
      if (count < 5) {
        entries.push(entry)
        count++
      }
    }
    if (entries.length > 0) {
      limited.push({ date: group.date, entries })
    }
  }
  return limited
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
