<template>
  <!-- Quick Log — Refined Misc Hub -->
  <div class=" bg-white border border-orange-100/50 p-4 rounded-2xl shadow-sm transition-colors mb-6">
    <!-- Header: title -->
    <div class="mb-5 px-1">
      <h3 class="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-1">
        <span class="text-2xl">🚲</span> <span class="text-orange-500">Misc Movement</span>
      </h3>
      <p class="text-sm text-slate-400">Log un-structured activity</p>
    </div>
    
    <!-- Body -->
    <div class=" rounded-xl p-4 border border-orange-50">
      <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">What did you do today?</p>
      
      <div class="flex flex-col gap-3 mb-4">
        <!-- Library Dropdown with Indicator -->
        <div class="relative w-full">
          <select
            v-model="state.miscActivity"
            @change="handleActivityChange"
            class="w-full bg-white border border-slate-200 rounded-xl px-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer appearance-none"
          >
            <option v-for="item in MISC_LIBRARY" :key="item.name" :value="item.name">
              {{ item.name }}
            </option>
          </select>
          <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- Custom Input (Conditional) -->
        <input
          v-if="state.miscActivity === 'Custom...'"
          v-model="state.customMiscName"
          type="text"
          placeholder="Enter custom activity name..."
          class="w-full bg-white border border-orange-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-slate-300"
        />
      </div>
      
      <div class="flex items-center justify-between gap-4">
        <!-- Ghost Style Intensity Buttons -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
          <button
            v-for="sub in CUSTOM_SUBTYPES"
            :key="sub.label"
            @click="selectedCustom = sub"
            class="text-[10px] px-3 py-1.5 rounded-full border transition-all cursor-pointer font-bold uppercase tracking-tight"
            :class="selectedCustom?.label === sub.label
              ? 'bg-orange-500 text-white border-transparent shadow-md hover:bg-orange-600'
              : 'bg-white border-slate-200 text-slate-500 hover:border-orange-400 hover:text-orange-600'"
          >
            {{ sub.label }}
          </button>
        </div>

        <button
          @click="logCustom"
          :disabled="isLogDisabled"
          class="px-5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 text-orange-600 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed capitalize tracking-wider"
          :class="logged ? 'scale-95 bg-green-500 text-white' : 'bg-orange-50 hover:bg-orange-100'"
        >
          {{ logged ? '✓' : 'Log Activity +' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { state } from '../store/state.js'
import { addXP } from '../utils/xp.js'
import { todayStr, maybeSetStartDate } from '../utils/dates.js'
import { updateWorkoutStreak } from '../utils/streaks.js'
import { setMood } from '../utils/pet.js'
import { computeMood, willStreakBreak } from '../utils/mood.js'
import { triggerAchievement } from '../utils/achievements.js'

const MISC_LIBRARY = [
  { name: 'Walking',           defaultIntensity: 'Easy' },
  { name: 'Cleaning/Chores',   defaultIntensity: 'Moderate' },
  { name: 'Grocery Shopping',  defaultIntensity: 'Easy' },
  { name: 'Biking (Commute)',  defaultIntensity: 'Intense' },
  { name: 'Stretching/Yoga',   defaultIntensity: 'Moderate' },
  { name: 'Hiking',            defaultIntensity: 'Intense' },
  { name: 'Custom...',         defaultIntensity: 'Moderate' },
]

const STREAK_MILESTONES = [7, 14, 30]
const STREAK_MESSAGES = { 7: 'One week of consistency', 14: 'Two weeks strong', 30: 'One month of dedication' }
const STREAK_EMOJIS = { 7: '🔥', 14: '💫', 30: '👑' }

// Adjusted XP rewards for Misc activity (reduced as per guardrails)
const CUSTOM_SUBTYPES = [
  { label: 'Easy',     xp: 5 },
  { label: 'Moderate', xp: 10 },
  { label: 'Intense',  xp: 15 },
]

const selectedCustom = ref(CUSTOM_SUBTYPES[0])
const logged = ref(false)

const today = todayStr()

const isLogDisabled = computed(() => {
  if (state.miscActivity === 'Custom...') {
    return !state.customMiscName.trim()
  }
  return !state.miscActivity
})

function handleActivityChange() {
  const activity = MISC_LIBRARY.find(a => a.name === state.miscActivity)
  if (activity) {
    const intensity = CUSTOM_SUBTYPES.find(i => i.label === activity.defaultIntensity)
    if (intensity) {
      selectedCustom.value = intensity
    }
  }
}

function fireWorkoutToasts() {
  if (state.workouts.length === 1) {
    triggerAchievement('workout', '🏋️', 'First workout!', 'Your journey begins', 'workout-first')
  }
  const count = state.streaks.workout.count
  if (STREAK_MILESTONES.includes(count)) {
    triggerAchievement('streak', STREAK_EMOJIS[count], `${count}-day streak!`, STREAK_MESSAGES[count], `streak-${count}-workout-${todayStr()}`)
  }
}

function logCustom() {
  const name = state.miscActivity === 'Custom...' 
    ? state.customMiscName.trim() 
    : state.miscActivity
    
  if (!name) return
  
  const sub = selectedCustom.value
  maybeSetStartDate(state)
  state.workouts.push({ 
    type: 'Custom', 
    activity: name, 
    intensity: sub.label, 
    xp: sub.xp, 
    date: today 
  })
  
  addXP(state, sub.xp)
  const broke = willStreakBreak(state)
  updateWorkoutStreak(state)
  fireWorkoutToasts()
  setMood('workout')
  state.petMood = computeMood(state, { streakBroke: broke })
  
  // Clear selections
  state.customMiscName = ''
  state.miscActivity = 'Walking'
  selectedCustom.value = CUSTOM_SUBTYPES[0]
  
  logged.value = true
  setTimeout(() => { logged.value = false }, 1000)
}
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
