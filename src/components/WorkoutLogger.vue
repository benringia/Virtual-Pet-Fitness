<template>
  <!-- Tip banner -->
  <div class="bg-indigo-50 rounded-2xl mb-4 px-4 py-3 flex items-start gap-3">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
      <path d="M9 18h6"/><path d="M10 22h4"/>
    </svg>
    <Transition name="tip-fade" mode="out-in">
      <p :key="tipIndex" class="text-xs text-gray-700 leading-relaxed">
        <span class="text-indigo-600 font-semibold">Tip: </span>{{ TIPS[tipIndex % TIPS.length] }}
      </p>
    </Transition>
  </div>

  <!-- Quick Log — always open -->
  <div class="rounded-2xl shadow-sm overflow-hidden border border-indigo-100 mb-4">
    <!-- Header: title + donut arc -->
    <div class="bg-white px-4 py-3 flex items-center justify-between border-b border-indigo-50">
      <span class="text-sm font-semibold text-gray-700">Quick Log</span>
      <!-- Donut arc: today sessions / goal 3 — r=12, circumference≈75.4 -->
      <div class="relative flex items-center justify-center w-8 h-8">
        <svg viewBox="0 0 32 32" class="w-8 h-8 -rotate-90" aria-hidden="true">
          <circle cx="16" cy="16" r="12" fill="none" stroke="#e0e7ff" stroke-width="3.5"/>
          <circle cx="16" cy="16" r="12" fill="none" stroke="#6366f1" stroke-width="3.5"
            :stroke-dasharray="`${Math.min(todaySessionCount / 3, 1) * 75.4} 75.4`"
            stroke-linecap="round"/>
        </svg>
        <span class="absolute text-[9px] font-bold text-indigo-600 leading-none">
          {{ todaySessionCount }}
        </span>
      </div>
    </div>
    <!-- Body -->
    <div class="bg-white px-4 pt-3 pb-4">
      <CaloriesBurned>
        <!-- Activity Logger -->
        <div class="bg-indigo-50 rounded-xl p-4">
          <p class="text-xs text-indigo-500 uppercase tracking-widest mb-2">Log any activity</p>
          <input
            v-model="activityName"
            type="text"
            placeholder="enter activity"
            class="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <p class="text-xs text-indigo-400 uppercase tracking-wide mb-2">Intensity</p>
          <div class="flex items-center gap-2">
            <button
              v-for="sub in CUSTOM_SUBTYPES"
              :key="sub.label"
              @click="selectedCustom = sub"
              class="text-xs px-3 py-2 min-h-11 rounded-full border transition-colors cursor-pointer font-medium"
              :class="selectedCustom?.label === sub.label
                ? 'bg-indigo-600 text-white border-transparent'
                : 'bg-white border-indigo-200 text-indigo-500 hover:border-indigo-400'"
            >
              {{ sub.label }} <span :class="selectedCustom?.label === sub.label ? 'text-indigo-200' : 'text-indigo-400'">+{{ sub.xp }}</span>
            </button>
            <div class="flex-1" />
            <button
              @click="logCustom"
              :disabled="!activityName.trim()"
              class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              :class="logged ? 'scale-95 bg-green-500' : 'bg-indigo-600 hover:bg-indigo-700'"
            >
              {{ logged ? '✓' : '+ log' }}
            </button>
          </div>
        </div>
      </CaloriesBurned>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CaloriesBurned from './CaloriesBurned.vue'
import { state } from '../store/state.js'
import { addXP } from '../utils/xp.js'
import { todayStr, maybeSetStartDate } from '../utils/dates.js'
import { updateWorkoutStreak } from '../utils/streaks.js'
import { setMood } from '../utils/pet.js'
import { computeMood, willStreakBreak } from '../utils/mood.js'
import { triggerAchievement } from '../utils/achievements.js'

const STREAK_MILESTONES = [7, 14, 30]
const STREAK_MESSAGES = { 7: 'One week of consistency', 14: 'Two weeks strong', 30: 'One month of dedication' }
const STREAK_EMOJIS = { 7: '🔥', 14: '💫', 30: '👑' }

const CUSTOM_SUBTYPES = [
  { label: 'Easy',     xp: 15 },
  { label: 'Moderate', xp: 25 },
  { label: 'Intense',  xp: 20 },
]

const TIPS = [
  'hydrate! water fuels your workouts.',
  'rest days are part of training. listen to your body.',
  'every rep counts. show up for yourself.',
  'progress, not perfection.',
  'your future self will thank you.',
  'consistency beats intensity. keep going.',
  'small steps every day lead to big results.',
  'fuel your body, it\'s the only one you have.',
  'strength grows outside your comfort zone.',
  'you are stronger than you think.',
]

const selectedCustom = ref(CUSTOM_SUBTYPES[0])
const activityName = ref('')
const logged = ref(false)
const tipIndex = ref(0)
let tipTimer = null

onMounted(() => {
  tipIndex.value = Math.floor(Math.random() * TIPS.length)
  tipTimer = setInterval(() => { tipIndex.value++ }, 10000)
})

onUnmounted(() => {
  clearInterval(tipTimer)
})

const today = todayStr()

const todaySessionCount = computed(() =>
  state.workouts.filter(w => w.date === today).length
)

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
  const name = activityName.value.trim()
  if (!name) return
  const sub = selectedCustom.value
  maybeSetStartDate(state)
  state.workouts.push({ type: 'Custom', activity: name, intensity: sub.label, xp: sub.xp, date: today })
  addXP(state, sub.xp)
  const broke = willStreakBreak(state)
  updateWorkoutStreak(state)
  fireWorkoutToasts()
  setMood('workout')
  state.petMood = computeMood(state, { streakBroke: broke })
  activityName.value = ''
  logged.value = true
  setTimeout(() => { logged.value = false }, 1000)
}
</script>

<style scoped>
.tip-fade-enter-active,
.tip-fade-leave-active {
  transition: opacity 0.4s ease;
}
.tip-fade-enter-from,
.tip-fade-leave-to {
  opacity: 0;
}
</style>
