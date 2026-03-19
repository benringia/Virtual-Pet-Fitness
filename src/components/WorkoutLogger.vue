<template>
  <!-- Day streak banner -->
  <div class="bg-white rounded-2xl shadow-sm mb-3 px-4 py-3 flex items-center gap-3">
    <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-lg shrink-0">
      {{ state.streaks.workout.count }}
    </div>
    <div>
      <div class="text-sm font-semibold text-gray-700">day streak 🔥</div>
      <div class="text-xs text-gray-400">
        {{ state.streaks.workout.count > 0 ? 'keep it up!' : 'log a workout to start!' }}
      </div>
    </div>
  </div>

  <!-- Tip banner -->
  <div class="border-l-4 border-indigo-300 bg-white rounded-r-2xl shadow-sm mb-4 px-4 py-2.5">
    <Transition name="tip-fade" mode="out-in">
      <p :key="tipIndex" class="text-xs text-gray-500 italic">
        <span class="text-indigo-500 font-semibold not-italic">tip:</span> {{ TIPS[tipIndex % TIPS.length] }}
      </p>
    </Transition>
  </div>

  <!-- Custom & Recent collapsible -->
  <div
    class="rounded-2xl shadow-sm overflow-hidden border mb-4 transition-colors duration-200"
    :class="showCustom ? 'border-indigo-200' : 'border-transparent'"
  >
    <!-- Section header -->
    <button
      class="w-full flex items-center px-4 py-3 min-h-11 transition-colors duration-200 cursor-pointer"
      :class="showCustom ? 'bg-indigo-50' : 'bg-white'"
      @click="showCustom = !showCustom"
    >
      <span class="text-sm font-semibold text-gray-700">⚡ Quick Log</span>
      <svg
        class="w-4 h-4 text-gray-400 ml-auto transition-transform duration-200"
        :class="{ 'rotate-180': showCustom }"
        viewBox="0 0 20 20" fill="currentColor"
      >
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- Section body -->
    <div v-show="showCustom" class="bg-white px-4 pt-3 pb-4">
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
              class="text-xs px-3 py-2 min-h-11 rounded-full border transition-colors cursor-pointer"
              :class="selectedCustom?.label === sub.label
                ? 'bg-indigo-600 text-white border-transparent'
                : 'bg-white border-indigo-200 text-indigo-400 hover:border-indigo-400'"
            >
              {{ sub.label }} <span :class="selectedCustom?.label === sub.label ? 'text-white' : 'text-indigo-500'">+{{ sub.xp }}</span>
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

  <!-- Structured workouts section label -->
  <div class="mb-1.5 mt-1 flex items-center gap-2 px-1">
    <span class="text-[10px] font-semibold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full">
      Structured Workouts
    </span>
    <span class="text-[10px] text-gray-400">bonus XP for specific training</span>
  </div>

  <!-- Workout type accordions -->
  <div class="space-y-2 mb-4">
    <div
      v-for="type in MAIN_TYPES"
      :key="type"
      class="rounded-2xl shadow-sm overflow-hidden border transition-all duration-200"
      :class="openWorkout === type ? 'border border-indigo-100 border-l-4' : 'border border-transparent'"
      :style="openWorkout === type ? { borderLeftColor: WORKOUT_ACCENT[type] } : {}"
    >
      <!-- Accordion header -->
      <button
        class="w-full flex items-center gap-2 px-4 py-3 min-h-11 transition-colors duration-200 cursor-pointer"
        :class="openWorkout === type ? 'bg-indigo-50' : 'bg-white'"
        @click="openWorkout = openWorkout === type ? null : type"
      >
        <span class="w-2.5 h-2.5 rounded-full shrink-0" :class="WORKOUT_META[type].dot" />
        <span class="text-sm font-semibold text-gray-700">{{ type }}</span>
        <span class="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium ml-1">{{ sessionCounts[type] }}</span>
        <svg
          class="w-4 h-4 text-gray-400 ml-auto transition-transform duration-200"
          :class="{ 'rotate-180': openWorkout === type }"
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Accordion body -->
      <div v-if="openWorkout === type" class="bg-white px-4 pb-3 border-t border-indigo-100">
        <!-- XP progress bar -->
        <div class="mb-3 mt-1">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-medium text-gray-500">XP today</span>
            <span class="text-xs font-semibold text-indigo-600">{{ todayXP[type] }}<span class="text-gray-400 font-normal"> / {{ WORKOUT_CAP }}</span></span>
          </div>
          <div class="w-full bg-indigo-100 rounded-full h-2">
            <div
              class="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: Math.min((todayXP[type] / WORKOUT_CAP) * 100, 100) + '%' }"
            />
          </div>
        </div>

        <!-- Sub-type pills -->
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="sub in WORKOUT_SUBTYPES[type]"
            :key="sub.label"
            @click="logWorkout(type, sub)"
            class="text-xs px-3 py-2 min-h-11 rounded-full bg-white border border-indigo-100 shadow-sm text-gray-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            {{ sub.label }} <span class="text-indigo-500 font-medium">+{{ sub.xp }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CaloriesBurned from './CaloriesBurned.vue'
import { state } from '../store/state.js'
import { WORKOUT_SUBTYPES, WORKOUT_META, WORKOUT_CAP, addXP } from '../utils/xp.js'
import { todayStr, maybeSetStartDate } from '../utils/dates.js'
import { updateWorkoutStreak } from '../utils/streaks.js'
import { setMood } from '../utils/pet.js'
import { computeMood, willStreakBreak } from '../utils/mood.js'
import { triggerAchievement } from '../utils/achievements.js'

const STREAK_MILESTONES = [7, 14, 30]
const STREAK_MESSAGES = { 7: 'One week of consistency', 14: 'Two weeks strong', 30: 'One month of dedication' }
const STREAK_EMOJIS = { 7: '🔥', 14: '💫', 30: '👑' }

const MAIN_TYPES = ['Strength', 'Walking', 'Boxing', 'Tennis']

const WORKOUT_ACCENT = {
  Strength: '#f472b6',
  Walking:  '#60a5fa',
  Boxing:   '#f87171',
  Tennis:   '#4ade80',
}

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
const openWorkout = ref(null)
const showCustom = ref(true)

const tipIndex = ref(0)
let tipTimer = null

onMounted(() => {
  tipIndex.value = Math.floor(Math.random() * TIPS.length)
  tipTimer = setInterval(() => { tipIndex.value++ }, 10000)
})

onUnmounted(() => clearInterval(tipTimer))

const today = todayStr()

const todayXP = computed(() => {
  const totals = { Strength: 0, Walking: 0, Boxing: 0, Tennis: 0 }
  for (const w of state.workouts) {
    if (w.date === today && w.type in totals) totals[w.type] += w.xp
  }
  return totals
})

const sessionCounts = computed(() => {
  const counts = { Strength: 0, Walking: 0, Boxing: 0, Tennis: 0 }
  for (const w of state.workouts) {
    if (w.type in counts) counts[w.type]++
  }
  return counts
})

function fireWorkoutToasts() {
  if (state.workouts.length === 1) {
    triggerAchievement('workout', '🏋️', 'First workout!', 'Your journey begins', 'workout-first')
  }
  const count = state.streaks.workout.count
  if (STREAK_MILESTONES.includes(count)) {
    triggerAchievement('streak', STREAK_EMOJIS[count], `${count}-day streak!`, STREAK_MESSAGES[count], `streak-${count}-workout-${todayStr()}`)
  }
}

function logWorkout(type, sub) {
  maybeSetStartDate(state)
  state.workouts.push({ type, name: `${type} – ${sub.label}`, xp: sub.xp, date: today })
  addXP(state, sub.xp)
  const broke = willStreakBreak(state)
  updateWorkoutStreak(state)
  fireWorkoutToasts()
  setMood('workout')
  state.petMood = computeMood(state, { streakBroke: broke })
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
