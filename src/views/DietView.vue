<template>
  <div class="pt-8 px-4 sm:px-6 lg:px-8 pb-20 w-full max-w-[1600px] mx-auto font-sans bg-[radial-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-slate-50 to-white min-h-screen">
    
    <!-- 1. Page Header (Styled to match WorkoutsView) -->
    <div class="mb-8 flex flex-col gap-2 px-1">
      <button @click="activeView = 'overview'"
        class="flex items-center gap-1 text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer group w-fit">
        <svg class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>
        Back to Overview
      </button>

      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
          <span>🥗</span> Nutrition & Diet
        </h1>
        <p class="text-sm text-slate-400 font-medium tracking-tight">Focus on your macros, track your meals, and maintain healthy streaks.</p>
      </div>
    </div>

    <!-- 2. Main Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      
      <!-- LEFT COLUMN: Primary Tracking -->
      <div class="lg:col-span-2 flex flex-col gap-6">
         <!-- Primary Action: Meal Logger -->
         <MealLogger class="ring-2 ring-emerald-500/10 shadow-indigo-100/50" />
         
         <!-- Primary Tracking: Protein Counter -->
         <ProteinCounter class="opacity-95 hover:opacity-100 transition-opacity" />
      </div>

      <!-- RIGHT COLUMN: Nutrition Status Panel -->
      <div class="lg:col-span-1 flex flex-col gap-6">
        
        <!-- Unified Nutrition Status Panel -->
        <div class="bg-gradient-to-br from-white to-indigo-50/40 rounded-3xl border border-white shadow-xl shadow-indigo-100/50 p-6 flex flex-col gap-6 transition-all duration-300">
          
          <!-- Pet Context -->
          <PetMiniWidget :isCelebrating="isCelebrating" :message="petMessage" />

          <!-- Diet Streak -->
          <div class="flex items-center justify-between px-1">
            <span class="text-sm text-slate-500 font-medium">Diet Streak</span>
            <span class="text-sm font-bold text-orange-600 flex items-center gap-1">
              {{ state.streaks.diet.count || 0 }} days 🔥
            </span>
          </div>

          <!-- Hydration Tracker (ENHANCED) -->
          <div class="flex items-center justify-between px-1 pt-2 border-t border-indigo-50/50">
            <div>
              <p class="text-sm font-bold text-slate-700">Hydration</p>
              
              <!-- Droplets Fill UI (Styled Circles) -->
              <div class="relative flex items-center gap-2 mt-2" :class="{ 'after:absolute after:inset-0 after:blur-md after:bg-blue-200/30': state.waterIntake > 0 }">
                <div
                  v-for="i in 8"
                  :key="i"
                  class="w-3 h-3 rounded-full transition-all duration-300 shadow-sm"
                  :class="[
                    i <= state.waterIntake
                      ? 'bg-gradient-to-br from-blue-400 to-blue-500 shadow-blue-300/50 scale-110'
                      : 'bg-slate-200',
                    isHydrating && i === Math.min(state.waterIntake, 8) ? 'animate-[dropPop_0.25s_ease-out]' : ''
                  ]"
                ></div>
              </div>
              
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                {{ state.waterIntake }}/8 glasses
              </p>
            </div>

            <!-- Modern Pill Buttons -->
            <div class="flex items-center bg-white/70 backdrop-blur-md border border-slate-200 rounded-xl p-1 shadow-sm hover:border-slate-300 transition-colors">
              <button
                @click="adjustWater(-1)"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition active:scale-95 cursor-pointer font-bold"
              >
                −
              </button>

              <button
                @click="adjustWater(1)"
                class="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md hover:scale-105 active:scale-95 transition cursor-pointer font-bold"
              >
                +
              </button>
            </div>
          </div>

          <!-- Daily Score / Habits Progress -->
          <div class="flex flex-col gap-3 px-1 pt-2 border-t border-indigo-50/50">
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-500 font-medium">Today's Score</span>
              <span class="text-xs font-bold text-emerald-600">{{ Math.round(scorePercent) }}%</span>
            </div>

            <!-- Progress bar -->
            <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
              <div
                class="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2.5 rounded-full transition-all duration-700 ease-out"
                :style="{ width: scorePercent + '%' }"
              ></div>
            </div>

            <!-- Label & Toggle -->
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {{ completedHabits }}/5 habits completed
              </span>
              <button
                @click="showHabits = !showHabits"
                class="text-[11px] text-indigo-500 hover:text-indigo-600 font-bold transition-colors cursor-pointer"
              >
                {{ showHabits ? 'HIDE DETAILS' : 'VIEW HABITS' }}
              </button>
            </div>

            <!-- Collapsible habit list (DYNAMIC SOURCE) -->
            <Transition name="fade">
              <div v-show="showHabits" class="mt-2 flex flex-col gap-2">
                <div
                  v-for="(value, key) in derivedHabits"
                  :key="key"
                  class="flex items-center justify-between py-1.5 px-2 rounded-2xl transition-all duration-300"
                  :class="value ? 'bg-emerald-50/60 border border-emerald-100/50' : 'bg-slate-50/50 border border-transparent'"
                >
                  <div class="flex flex-col">
                    <span class="text-[13px] font-semibold transition-colors" :class="value ? 'text-emerald-700' : 'text-slate-600'">
                      {{ habitLabels[key] }}
                    </span>
                  </div>
                  <span
                    class="text-lg font-black transition-all"
                    :class="value ? 'text-emerald-500 scale-110' : 'text-slate-300 opacity-60'"
                  >
                    {{ value ? '✓' : '○' }}
                  </span>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Motivation Message -->
          <div class="px-1 pt-2 border-t border-indigo-50/50">
            <p class="text-xs text-slate-400 italic font-medium">
              <span v-if="completedHabits === 0">
                Start your first healthy habit today 💪
              </span>
              <span v-else-if="completedHabits < 5">
                You're doing great — keep going!
              </span>
              <span v-else>
                All habits complete 🎉
              </span>
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { state } from '../store/state.js'
import { todayStr } from '../utils/dates.js'
import { activeView } from '../composables/useActiveView.js'
import { triggerAchievement } from '../utils/achievements.js'
import MealLogger from '../components/MealLogger.vue'
import ProteinCounter from '../components/ProteinCounter.vue'
import PetMiniWidget from '../components/PetMiniWidget.vue'

// UI State
const petMessage = ref('')
const isCelebrating = ref(false)
const showHabits = ref(false)
const isHydrating = ref(false)

function adjustWater(amount) {
  state.waterIntake = Math.max(0, state.waterIntake + amount)
  isHydrating.value = true
  setTimeout(() => isHydrating.value = false, 300)
}

// Clearer descriptions for habit list
const habitLabels = {
  water: 'Drink 8 glasses of water',
  veggies: 'Eat vegetables or salad',
  protein: 'Hit your daily protein goal',
  noJunk: 'Avoid junk / fast food',
  balanced: 'Eat 3+ balanced meals'
}

// ── Protein Goal Logic ──
const MULTIPLIERS = { sedentary: 0.8, active: 1.6, athlete: 2.2 }
const proteinGoal = computed(() => {
  if (!state.weightLog.length) return 0
  const latestWeight = state.weightLog[state.weightLog.length - 1]
  const kg = latestWeight.unit === 'lbs' ? latestWeight.weight * 0.453592 : latestWeight.weight
  return Math.round(kg * MULTIPLIERS[state.proteinActivityLevel || 'sedentary'])
})

// ── Derived Habit Logic ──
const derivedHabits = computed(() => {
  const today = todayStr()
  const todaysMeals = state.meals.filter(m => m.date === today)
  const totalProtein = todaysMeals.reduce((sum, m) => sum + (m.protein || 0), 0)

  return {
    water: state.waterIntake >= 8,

    veggies: todaysMeals.some(m => 
      (m.name || '').toLowerCase().includes('veg') || 
      (m.name || '').toLowerCase().includes('salad')
    ),

    protein: totalProtein >= proteinGoal.value && proteinGoal.value > 0,

    noJunk: !todaysMeals.some(m => 
      (m.name || '').toLowerCase().includes('junk') || 
      (m.name || '').toLowerCase().includes('fast')
    ),

    balanced: todaysMeals.length >= 3
  }
})

// ── Habit Notification Logic ──
const prevHabits = ref({})
let isInitialized = false

const messages = {
  water: 'Hydration goal reached 💧',
  veggies: 'Veggies eaten 🥦',
  protein: 'Protein goal hit 💪',
  noJunk: 'Clean eating today 🚫🍔',
  balanced: 'Balanced day achieved ⚖️'
}

const emojis = {
  water: '💧',
  veggies: '🥦',
  protein: '💪',
  noJunk: '🚫',
  balanced: '⚖️'
}

function handleHabitComplete(key) {
  if (state.completedHabitsToday[key]) return
  state.completedHabitsToday[key] = true

  const titles = {
    water: 'Hydration Goal',
    veggies: 'Veggies Eaten',
    protein: 'Protein Target',
    noJunk: 'Clean Eating',
    balanced: 'Balanced Day'
  }

  const messages = {
    water: 'Goal reached! 💧',
    veggies: 'Focus on those greens! 🥦',
    protein: 'Target weight/macros hit 💪',
    noJunk: 'Clean eating today! 🚫🍔',
    balanced: '3+ meals achieved ⚖️'
  }

  const emojis = {
    water: '💧',
    veggies: '🥦',
    protein: '💪',
    noJunk: '🚫',
    balanced: '⚖️'
  }

  triggerAchievement('habit', emojis[key], titles[key], messages[key])
}

watch(derivedHabits, (newVal) => {
  if (!isInitialized) {
    isInitialized = true
    prevHabits.value = { ...newVal }
    return
  }

  Object.keys(newVal).forEach(key => {
    const prev = prevHabits.value[key] ?? false
    const curr = newVal[key]

    if (curr === true && prev === false) {
      handleHabitComplete(key)
    }
  })

  prevHabits.value = { ...newVal }
}, { deep: true, immediate: true })

// Score Calculation
const completedHabits = computed(() =>
  Object.values(derivedHabits.value).filter(Boolean).length
)
const scorePercent = computed(() => (completedHabits.value / 5) * 100)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-5px); }

@keyframes dropPop {
  0% { transform: scale(0.6); opacity: 0.5; }
  100% { transform: scale(1.1); opacity: 1; }
}
</style>
