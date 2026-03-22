<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-white to-indigo-50/40 rounded-3xl border border-white shadow-xl shadow-indigo-100/50 p-4 md:p-6">
    
    <!-- Header: Glass-morphism Unit Toggle -->
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-1">
        <span class="text-2xl">⚖️</span> Weight Log
        <span v-if="!hasLoggedToday" class="flex h-2 w-2 relative -top-1">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </h2>
      <div class="flex bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-1 text-[10px] font-bold shadow-sm">
        <button
          @click="state.weightUnit = 'kg'"
          :class="state.weightUnit === 'kg' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'"
          class="px-3 py-1.5 rounded-lg transition-all cursor-pointer uppercase"
        >kg</button>
        <button
          @click="state.weightUnit = 'lbs'"
          :class="state.weightUnit === 'lbs' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'"
          class="px-3 py-1.5 rounded-lg transition-all cursor-pointer uppercase"
        >lbs</button>
      </div>
    </div>

    <!-- Hero Section -->
    <div v-if="currentWeight !== null" class="relative flex flex-col items-center justify-center mb-8 py-4">
      <!-- Floating Streak Badge -->
      <div v-if="streak > 0" 
           class="absolute -top-2 left-1/2 -translate-x-1/2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm border border-orange-200 animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
          <path fill-rule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.176 7.547 7.547 0 01-1.705-1.715.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clip-rule="evenodd"/>
        </svg>
        {{ streak }} Day Streak
      </div>

      <!-- Main Weight Display -->
      <div class="flex items-baseline gap-1 mt-2">
        <span class="text-6xl font-bold text-slate-900 tracking-tighter">{{ displayCurrentWeight }}</span>
        <span class="text-xl font-medium text-slate-300">{{ state.weightUnit }}</span>
      </div>

      <!-- Weekly Progress Summary -->
      <p v-if="weeklyProgressText" class="mt-3 text-[11px] font-bold tracking-tight" :class="weeklyProgressColor">
        {{ weeklyProgressText }}
      </p>

      <!-- Goal Info -->
      <div v-if="state.weightGoal" class="flex items-center gap-2 mt-4 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/80 shadow-sm">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target:</span>
        <span class="text-xs font-bold text-slate-700">{{ displayGoalWeight }} {{ state.weightUnit }}</span>
        <span class="w-1 h-1 rounded-full bg-slate-200"></span>
        <span class="text-xs font-bold" :class="isSuccess ? 'text-emerald-600' : 'text-rose-500'">{{ diffText }}</span>
      </div>
    </div>

    <!-- Actions & Editing -->
    <div class="space-y-4">
      <!-- Edit Mode Toggle -->
      <div v-if="!isEditing" class="flex flex-col items-center">
        <button 
          v-if="!hasLoggedToday"
          @click="isEditing = true"
          class="group relative flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-200/50 hover:bg-indigo-700 active:scale-95 transition-all w-full md:w-auto"
        >
          <span class="text-lg">+</span> Update Weight Log
        </button>
        <div v-else class="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
          Daily log complete
        </div>
      </div>

      <!-- Editing Form -->
      <div v-else class="bg-white/80 backdrop-blur-sm rounded-3xl p-5 border border-white shadow-sm space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <!-- Goal Objective (Mode Selectors) -->
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase mb-3 px-1 tracking-widest">Weight Objective</p>
          <div class="flex gap-2">
            <button v-for="type in ['Loss', 'Maintain', 'Gain']" :key="type"
              @click="state.weightGoalType = type"
              :class="state.weightGoalType === type ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:text-slate-600'"
              class="flex-1 py-2 text-[10px] font-black rounded-xl transition-all duration-200 cursor-pointer uppercase tracking-widest">
              {{ type }}
            </button>
          </div>
        </div>

        <!-- Inputs Row -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Today</label>
            <input
              v-model.number="weightInput"
              type="number"
              step="0.1"
              :placeholder="toDisplay(currentWeight) || '--'"
              class="w-full bg-slate-50/50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Goal</label>
            <input
              v-model.number="goalInput"
              type="number"
              step="0.1"
              @change="saveGoal"
              :placeholder="displayGoalWeight || '--'"
              class="w-full bg-slate-50/50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
            />
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            @click="handleLog"
            :disabled="!weightInput"
            class="flex-1 bg-indigo-600 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-30 transition-all active:scale-95"
          >
            Save Record
          </button>
          <button
            @click="isEditing = false"
            class="px-5 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { state } from '../store/state.js'
import { logWeight, getWeightStreak } from '../utils/weight.js'
import { triggerAchievement } from '../utils/achievements.js'
import { todayStr } from '../utils/dates.js'
import { confetti } from '../utils/confetti.js'

// Gauge visualization logic removed (SVG-based)

const hasLoggedToday = computed(() =>
  state.weightLog.some(w => w.date === todayStr())
)

const isEditing = ref(false)

const KG_TO_LBS = 2.20462
const toDisplay = (kg) => kg === null ? null : (state.weightUnit === 'lbs' ? +(kg * KG_TO_LBS).toFixed(1) : +kg.toFixed(1))
const fromDisplay = (val) => val === null ? null : (state.weightUnit === 'lbs' ? +(val / KG_TO_LBS).toFixed(3) : +val.toFixed(3))

const weightInput = ref(null)
const goalInput = ref(toDisplay(state.weightGoal))

function saveGoal() {
  state.weightGoal = goalInput.value > 0 ? fromDisplay(goalInput.value) : null
}

watch(() => state.weightGoal, (val) => {
  if (val === null) goalInput.value = ''
  else goalInput.value = toDisplay(val)
})

watch(() => state.weightUnit, (newUnit, oldUnit) => {
  if (weightInput.value !== null) {
    if (newUnit === 'lbs') weightInput.value = +(weightInput.value * KG_TO_LBS).toFixed(1)
    else weightInput.value = +(weightInput.value / KG_TO_LBS).toFixed(1)
  }
  // goalInput is handled by watcher on state.weightGoal or just manually here
  if (goalInput.value !== null && goalInput.value !== '') {
    if (newUnit === 'lbs') goalInput.value = +(goalInput.value * KG_TO_LBS).toFixed(1)
    else goalInput.value = +(goalInput.value / KG_TO_LBS).toFixed(1)
  }
})

function handleLog() {
  if (!weightInput.value || weightInput.value <= 0) return
  const kgValue = fromDisplay(weightInput.value)
  logWeight(state, kgValue)
  weightInput.value = null
  isEditing.value = false
  const goal = state.weightGoal
  const type = state.weightGoalType
  const cur = currentWeight.value
  
  if (!goal || cur === null) return
  
  const reached = type === 'Loss' ? cur <= goal : type === 'Gain' ? cur >= goal : Math.abs(cur - goal) <= 0.5
  if (reached) {
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
const displayCurrentWeight = computed(() => toDisplay(currentWeight.value))
const displayGoalWeight = computed(() => toDisplay(state.weightGoal))

const diff = computed(() => {
  if (currentWeight.value === null || !state.weightGoal) return null
  return +(state.weightGoal - currentWeight.value).toFixed(2)
})

const diffText = computed(() => {
  if (diff.value === null) return ''
  const unit = state.weightUnit
  const absKg = Math.abs(diff.value)
  const displayAbs = unit === 'lbs' ? +(absKg * KG_TO_LBS).toFixed(1) : +absKg.toFixed(1)
  
  if (displayAbs === 0) return 'Goal reached!'
  
  if (state.weightGoalType === 'Maintain') {
    return `${displayAbs} ${unit} from target`
  }
  const action = state.weightGoalType === 'Loss' ? 'lose' : 'gain'
  return `${displayAbs} ${unit} to ${action}`
})

const isSuccess = computed(() => {
  if (currentWeight.value === null || !state.weightGoal) return false
  const goal = state.weightGoal
  const type = state.weightGoalType
  const cur = currentWeight.value
  return type === 'Loss' ? cur <= goal : type === 'Gain' ? cur >= goal : Math.abs(cur - goal) <= 0.5
})

const weeklyProgress = computed(() => {
  if (state.weightLog.length < 2) return null
  const current = currentWeight.value
  const weekAgo = last7.value[0]?.weight
  if (current === null || weekAgo === undefined) return null
  return +(current - weekAgo).toFixed(2)
})

const weeklyProgressText = computed(() => {
  const p = weeklyProgress.value
  if (p === null) return null
  const unit = state.weightUnit
  const displayAbs = unit === 'lbs' ? +(Math.abs(p) * KG_TO_LBS).toFixed(1) : +Math.abs(p).toFixed(1)
  const verb = p >= 0 ? 'gained' : 'lost'
  return `You've ${verb} ${displayAbs}${unit} this week. Keep going!`
})

const weeklyProgressColor = computed(() => {
  const p = weeklyProgress.value
  if (p === null) return 'text-slate-500'
  const type = state.weightGoalType
  const isGood = type === 'Loss' ? p < 0 : type === 'Gain' ? p > 0 : Math.abs(p) <= 0.2
  return isGood ? 'text-emerald-500' : 'text-rose-500'
})

const startWeight = computed(() => state.weightLog[0]?.weight ?? null)

const projectedDate = computed(() => {
  if (state.weightGoalType === 'Maintain' || !state.weightGoal) return null
  if (last7.value.length < 3) return null
  
  const entries = last7.value.slice(-3)
  const weights = entries.map(e => e.weight)
  const dates = entries.map(e => new Date(e.date).getTime())
  
  const d1 = (weights[1] - weights[0]) / ((dates[1] - dates[0]) / (1000 * 60 * 60 * 24))
  const d2 = (weights[2] - weights[1]) / ((dates[2] - dates[1]) / (1000 * 60 * 60 * 24))
  const avgSlope = (d1 + d2) / 2
  
  if (avgSlope === 0) return null
  
  const remaining = state.weightGoal - currentWeight.value
  const days = remaining / avgSlope
  
  if (days <= 0) return null
  
  const target = new Date()
  target.setDate(target.getDate() + Math.ceil(days))
  
  return target.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
})

const isTrendStrong = computed(() => {
  if (last7.value.length < 3) return false
  const entries = last7.value.slice(-3)
  const d1 = entries[1].weight - entries[0].weight
  const d2 = entries[2].weight - entries[1].weight
  return (d1 * d2 > 0) && (Math.abs(d1) > 0.1 || Math.abs(d2) > 0.1)
})

watch(isSuccess, (val) => {
  if (val && !state.hasCelebratedGoal) {
    confetti()
    state.hasCelebratedGoal = true
  }
})

watch([() => state.weightGoal, () => state.weightGoalType], () => {
  state.hasCelebratedGoal = false
}, { flush: 'post' })

// Removed old SVG chart coordinate and path logic
</script>

<style scoped>
/* Progress Gauge animations and styles removed (SVG pulse dots no longer needed) */
</style>
