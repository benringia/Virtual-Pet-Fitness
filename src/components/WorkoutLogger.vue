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
      class="w-full flex items-center px-4 py-3 transition-colors duration-200"
      :class="showCustom ? 'bg-indigo-50' : 'bg-white'"
      @click="showCustom = !showCustom"
    >
      <span class="text-sm font-semibold text-gray-700">Activities</span>
      <svg
        class="w-4 h-4 text-gray-400 ml-auto transition-transform duration-200"
        :class="{ 'rotate-180': showCustom }"
        viewBox="0 0 20 20" fill="currentColor"
      >
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- Section body -->
    <div v-show="showCustom" class="bg-white px-4 pb-4">
      <!-- Custom input -->
      <div class="pt-3">
        <p class="text-xs text-gray-400 uppercase tracking-widest mb-2">What did you do today?</p>
        <input
          v-model="activityName"
          type="text"
          placeholder="enter activity"
          class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:border-indigo-300"
        />
        <div class="flex items-center gap-2">
          <button
            v-for="sub in CUSTOM_SUBTYPES"
            :key="sub.label"
            @click="selectedCustom = sub"
            class="text-xs px-3 py-1.5 rounded-full border transition-colors"
            :class="selectedCustom?.label === sub.label
              ? 'bg-indigo-500 text-white border-indigo-500'
              : 'bg-indigo-50 text-gray-500 border-indigo-100 hover:border-indigo-300'"
          >
            {{ sub.label }} <span :class="selectedCustom?.label === sub.label ? 'text-white' : 'text-indigo-500'">+{{ sub.xp }}</span>
          </button>
          <div class="flex-1" />
          <button
            @click="logCustom"
            :disabled="!activityName.trim()"
            class="px-4 py-1.5 bg-indigo-500 text-white rounded-full text-sm font-medium transition-all duration-150 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed"
            :class="logged ? 'scale-95 bg-indigo-700' : ''"
          >
            {{ logged ? '✓' : '+ log' }}
          </button>
        </div>
      </div>

      <!-- Divider -->
      <hr class="border-gray-100 mt-3 mb-3" />

      <!-- Estimated burn -->
      <p class="text-xs text-indigo-500 font-semibold uppercase tracking-wide mb-2">🔥 Estimated Calories Burned</p>
      <CaloriesBurned />
    </div>
  </div>

  <!-- Workout type accordions -->
  <div class="space-y-2 mb-4">
    <div
      v-for="type in MAIN_TYPES"
      :key="type"
      class="rounded-2xl shadow-sm overflow-hidden border transition-colors duration-200"
      :class="openWorkout === type ? 'border-indigo-200' : 'border-transparent'"
    >
      <!-- Accordion header -->
      <button
        class="w-full flex items-center gap-2 px-4 py-3 transition-colors duration-200"
        :class="openWorkout === type ? 'bg-indigo-50' : 'bg-white'"
        @click="openWorkout = openWorkout === type ? null : type"
      >
        <span class="w-2.5 h-2.5 rounded-full shrink-0" :class="WORKOUT_META[type].dot" />
        <span class="text-sm font-semibold text-gray-700">{{ type }}</span>
        <span class="text-xs text-gray-300 ml-1">{{ sessionCounts[type] }} sessions</span>
        <svg
          class="w-4 h-4 text-gray-400 ml-auto transition-transform duration-200"
          :class="{ 'rotate-180': openWorkout === type }"
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Accordion body -->
      <div v-if="openWorkout === type" class="bg-white px-4 pb-3">
        <!-- XP progress bar -->
        <div class="mb-2">
          <div class="flex justify-between text-xs text-gray-400 mb-1">
            <span>{{ todayXP[type] }} / {{ WORKOUT_CAP }} xp today</span>
          </div>
          <div class="w-full bg-indigo-100 rounded-full h-1">
            <div
              class="bg-indigo-500 h-1 rounded-full transition-all duration-300"
              :style="{ width: Math.min((todayXP[type] / WORKOUT_CAP) * 100, 100) + '%' }"
            />
          </div>
        </div>

        <!-- Sub-type pills -->
        <div class="flex flex-wrap gap-1">
          <button
            v-for="sub in WORKOUT_SUBTYPES[type]"
            :key="sub.label"
            @click="logWorkout(type, sub)"
            class="text-xs px-2 py-1 rounded-full bg-indigo-50 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
          >
            {{ sub.label }} <span class="text-indigo-500">+{{ sub.xp }}</span>
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

const MAIN_TYPES = ['Strength', 'Walking', 'Boxing', 'Tennis']

const CUSTOM_SUBTYPES = [
  { label: 'light',  xp: 15 },
  { label: 'medium', xp: 25 },
  { label: 'custom', xp: 20 },
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

function logWorkout(type, sub) {
  maybeSetStartDate(state)
  state.workouts.push({ type, name: `${type} – ${sub.label}`, xp: sub.xp, date: today })
  addXP(state, sub.xp)
  updateWorkoutStreak(state)
  setMood('workout')
}

function logCustom() {
  const name = activityName.value.trim()
  if (!name) return
  const sub = selectedCustom.value
  maybeSetStartDate(state)
  state.workouts.push({ type: 'Custom', activity: name, intensity: sub.label, xp: sub.xp, date: today })
  addXP(state, sub.xp)
  updateWorkoutStreak(state)
  setMood('workout')
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
