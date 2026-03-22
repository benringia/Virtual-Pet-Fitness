<template>
  <!-- Quick Log — Refined Misc Hub -->
  <div class="bg-gradient-to-br from-white to-indigo-50 rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-100/30 p-4 md:p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-200/50 h-fit">
    <!-- Header: title -->
    <div 
      @click="windowWidth < 1280 ? isExpanded = !isExpanded : null" 
      :class="windowWidth < 1280 ? 'cursor-pointer' : 'cursor-default'"
      class="mb-5 px-1 flex items-center justify-between transition-all"
    >
      <div>
        <h3 class="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-1">
          <span class="text-2xl">🚲</span> <span class="text-orange-500">Misc Movement</span>
        </h3>
        <p class="text-sm text-slate-400">Log un-structured activity</p>
      </div>
      <button v-if="windowWidth < 1280" class="p-2 text-orange-400 hover:text-orange-600 transition-colors xl:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" :class="isExpanded ? 'rotate-180' : ''" class="w-5 h-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
    
    <!-- Body -->
    <div v-show="isExpanded || windowWidth >= 1280" class="rounded-xl p-4 border border-orange-50 animate-in fade-in slide-in-from-top-2 duration-300 xl:!block">
      <div class="flex flex-col gap-5">
        <!-- 1. Activity Selector (Full Width) -->
        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-1">What did you do today?</label>
          <div class="relative w-full">
            <select
              v-model="state.miscActivity"
              @change="handleActivityChange"
              class="w-full h-[44px] bg-white border border-slate-200 rounded-2xl px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer appearance-none shadow-sm transition-all"
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
            class="w-full h-[44px] bg-white border border-orange-100 rounded-2xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-slate-300 shadow-sm transition-all"
          />
        </div>
        
        <!-- 2. Intensity Selection -->
        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-1">Select Intensity</label>
          <div class="flex w-full gap-2 overflow-hidden items-center">
            <button
              v-for="sub in CUSTOM_SUBTYPES"
              :key="sub.label"
              @click="selectedCustom = sub"
              class="flex-1 h-[42px] px-2.5 rounded-2xl border transition-all cursor-pointer font-bold uppercase tracking-tight text-[11px]"
              :class="selectedCustom?.label === sub.label
                ? 'bg-orange-500 text-white border-transparent shadow-md hover:bg-orange-600'
                : 'bg-white border-slate-200 text-slate-500 hover:border-orange-400 hover:text-orange-600'"
            >
              {{ sub.label }}
            </button>
          </div>
        </div>

        <!-- 3. Primary Action Button -->
        <button
          @click="logCustom"
          :disabled="isLogDisabled"
          class="w-full h-[48px] px-6 rounded-2xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          :class="logged 
            ? 'bg-green-500 text-white scale-[0.98]' 
            : 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5'"
        >
          <span v-if="logged">✓ Recorded</span>
          <template v-else>
            Log Activity <span class="text-base font-normal opacity-80">+</span>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

const isExpanded = ref(typeof window !== 'undefined' ? window.innerWidth >= 1280 : true)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)

function handleResize() {
  windowWidth.value = window.innerWidth
  if (window.innerWidth >= 1280) {
    isExpanded.value = true
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

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
