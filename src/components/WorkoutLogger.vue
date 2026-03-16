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
  <div class="border-l-4 border-pink-300 bg-white rounded-r-2xl shadow-sm mb-4 px-4 py-2.5">
    <p class="text-xs text-gray-500 italic">
      <span class="text-pink-500 font-semibold not-italic">tip:</span> {{ currentTip }}
    </p>
  </div>

  <!-- Workout type grid (2x2) -->
  <div class="grid grid-cols-2 gap-3 mb-4">
    <div
      v-for="type in MAIN_TYPES"
      :key="type"
      class="bg-white rounded-2xl shadow-sm p-3"
    >
      <!-- Card header -->
      <div class="flex items-center gap-2 mb-2">
        <span class="w-2.5 h-2.5 rounded-full shrink-0" :class="WORKOUT_META[type].dot" />
        <span class="text-sm font-semibold text-gray-700">{{ type }}</span>
        <span class="ml-auto text-base">{{ WORKOUT_META[type].emoji }}</span>
      </div>

      <!-- XP progress bar -->
      <div class="mb-0.5">
        <div class="flex justify-between text-xs text-gray-400 mb-1">
          <span>{{ todayXP[type] }} / {{ WORKOUT_CAP }} xp</span>
        </div>
        <div class="w-full bg-pink-100 rounded-full h-1">
          <div
            class="bg-pink-400 h-1 rounded-full transition-all duration-300"
            :style="{ width: Math.min((todayXP[type] / WORKOUT_CAP) * 100, 100) + '%' }"
          />
        </div>
      </div>

      <!-- Sub-type pills -->
      <div class="flex flex-wrap gap-1 mt-2">
        <button
          v-for="sub in WORKOUT_SUBTYPES[type]"
          :key="sub.label"
          @click="logWorkout(type, sub)"
          class="text-xs px-2 py-1 rounded-full bg-pink-50 text-gray-600 hover:bg-pink-100 hover:text-pink-600 transition-colors"
        >
          {{ sub.label }} <span class="text-pink-400">+{{ sub.xp }}</span>
        </button>
      </div>

      <!-- Session count -->
      <div class="text-right text-xs text-gray-300 mt-2">
        {{ sessionCounts[type] }} sessions
      </div>
    </div>
  </div>

  <!-- Log something else (Custom) -->
  <div class="bg-white rounded-2xl shadow-sm px-4 py-3 mb-4">
    <p class="text-xs text-gray-400 uppercase tracking-widest mb-2">Log something else</p>
    <div class="flex items-center gap-2">
      <button
        v-for="sub in CUSTOM_SUBTYPES"
        :key="sub.label"
        @click="selectedCustom = sub"
        class="text-xs px-3 py-1.5 rounded-full border transition-colors"
        :class="selectedCustom?.label === sub.label
          ? 'bg-pink-400 text-white border-pink-400'
          : 'bg-pink-50 text-gray-500 border-pink-100 hover:border-pink-300'"
      >
        {{ sub.label }} <span :class="selectedCustom?.label === sub.label ? 'text-white' : 'text-pink-400'">+{{ sub.xp }}</span>
      </button>
      <div class="flex-1" />
      <button
        @click="logCustom"
        class="px-4 py-1.5 bg-pink-400 hover:bg-pink-500 text-white rounded-full text-sm font-medium transition-colors"
      >
        + log
      </button>
    </div>

    <!-- Custom name input -->
    <input
      v-if="selectedCustom?.label === 'custom'"
      v-model="customName"
      type="text"
      placeholder="workout name…"
      class="mt-2 w-full border border-gray-200 rounded-full px-3 py-1 text-sm focus:outline-none focus:border-pink-300"
    />
  </div>

  <!-- Recent activity -->
  <div class="bg-white rounded-2xl shadow-sm px-4 py-3 mb-4">
    <p class="text-xs text-gray-400 uppercase tracking-widest mb-2">Recent activity</p>
    <p v-if="!recentWorkouts.length" class="text-sm text-gray-300">
      nothing yet – your first workout awaits! 🌸
    </p>
    <ul v-else class="space-y-1">
      <li
        v-for="(w, i) in recentWorkouts"
        :key="i"
        class="flex items-center justify-between text-sm"
      >
        <span class="text-gray-600">{{ w.name }}</span>
        <span class="text-pink-400 font-medium text-xs">+{{ w.xp }} xp</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { state } from '../store/state.js'
import { WORKOUT_SUBTYPES, WORKOUT_META, WORKOUT_CAP, addXP } from '../utils/xp.js'
import { todayStr } from '../utils/dates.js'
import { updateWorkoutStreak } from '../utils/streaks.js'
import { setMood } from '../utils/pet.js'

const MAIN_TYPES = ['Strength', 'Walking', 'Boxing', 'Tennis']

const CUSTOM_SUBTYPES = [
  { label: 'light',  xp: 15 },
  { label: 'medium', xp: 25 },
  { label: 'custom', xp: 20 },
]

const TIPS = [
  'consistency beats intensity – even a 10-min walk counts!',
  'rest days are part of training. listen to your body.',
  'every session is progress, no matter how small.',
  'hydrate! water fuels your workouts.',
]

const selectedCustom = ref(CUSTOM_SUBTYPES[0])
const customName = ref('')

const currentTip = TIPS[Math.floor(Math.random() * TIPS.length)]

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
  state.workouts.push({ type, name: `${type} – ${sub.label}`, xp: sub.xp, date: today })
  addXP(state, sub.xp)
  updateWorkoutStreak(state)
  setMood('workout')
}

function logCustom() {
  const sub = selectedCustom.value
  if (!sub) return
  const name = sub.label === 'custom' ? (customName.value.trim() || 'Custom') : sub.label
  state.workouts.push({ type: 'Custom', name, xp: sub.xp, date: today })
  addXP(state, sub.xp)
  updateWorkoutStreak(state)
  setMood('workout')
  if (sub.label === 'custom') customName.value = ''
}

const recentWorkouts = computed(() => [...state.workouts].reverse().slice(0, 5))
</script>
