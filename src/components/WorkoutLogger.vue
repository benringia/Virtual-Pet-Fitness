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
      v-for="wt in state.workoutTypes"
      :key="wt.id"
      class="rounded-2xl shadow-sm overflow-hidden border transition-all duration-200"
      :class="[
        openWorkout === wt.id ? 'border border-indigo-100 border-l-4' : 'border border-transparent',
        sessionCounts[wt.name] === 0 && openWorkout !== wt.id ? 'opacity-60' : 'opacity-100'
      ]"
      :style="openWorkout === wt.id ? { borderLeftColor: wt.color } : {}"
    >
      <!-- Accordion header row -->
      <div class="flex items-center" :class="openWorkout === wt.id ? 'bg-indigo-50' : 'bg-white'">
        <button
          class="flex-1 flex items-center gap-2 px-4 py-3 min-h-11 transition-colors duration-200 cursor-pointer"
          @click="toggleAccordion(wt.id)"
        >
          <span
            class="w-2.5 h-2.5 rounded-full shrink-0"
            :class="WORKOUT_META[wt.name]?.dot"
            :style="!WORKOUT_META[wt.name] ? { backgroundColor: wt.color } : {}"
          />
          <span class="text-sm font-semibold text-gray-700">{{ wt.name }}</span>
          <span class="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium ml-1">{{ sessionCounts[wt.name] }}</span>
          <svg
            class="w-4 h-4 text-gray-400 ml-auto transition-transform duration-200"
            :class="{ 'rotate-180': openWorkout === wt.id }"
            viewBox="0 0 20 20" fill="currentColor"
          >
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        </button>
        <!-- Trash icon — user-defined types only -->
        <button
          v-if="!DEFAULT_TYPE_IDS.includes(wt.id)"
          @click="confirmDeleteId = confirmDeleteId === wt.id ? null : wt.id"
          class="pr-3 pl-1 py-3 cursor-pointer text-gray-300 hover:text-red-400 transition-colors"
          aria-label="Remove workout type"
        >
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Inline delete confirmation -->
      <div v-if="confirmDeleteId === wt.id" class="bg-red-50 px-4 py-2 flex items-center gap-2 border-t border-red-100">
        <span class="text-xs text-red-700 flex-1">Remove {{ wt.name }}? Past sessions are kept.</span>
        <button @click="removeWorkoutType(wt.id)" class="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-2.5 py-1 rounded-full cursor-pointer transition-colors">Remove</button>
        <button @click="confirmDeleteId = null" class="text-xs font-medium text-gray-500 hover:text-gray-700 px-2.5 py-1 rounded-full cursor-pointer transition-colors">Keep</button>
      </div>

      <!-- Accordion body -->
      <div v-if="openWorkout === wt.id" class="bg-white px-4 pb-3 border-t border-indigo-100">
        <!-- XP progress bar -->
        <div v-show="todayXP[wt.name] > 0" class="mb-3 mt-1">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-medium text-gray-500">XP today</span>
            <span class="text-xs font-semibold text-indigo-600">{{ todayXP[wt.name] }}<span class="text-gray-400 font-normal"> / {{ WORKOUT_CAP }}</span></span>
          </div>
          <div class="w-full bg-indigo-100 rounded-full h-2">
            <div
              class="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: Math.min((todayXP[wt.name] / WORKOUT_CAP) * 100, 100) + '%' }"
            />
          </div>
        </div>

        <!-- Sub-type pills — default types -->
        <div v-if="DEFAULT_TYPE_IDS.includes(wt.id)" class="flex flex-wrap gap-1.5">
          <button
            v-for="sub in (WORKOUT_SUBTYPES[wt.name] ?? [])"
            :key="sub.label"
            @click="logWorkout(wt.name, sub)"
            class="text-xs px-3 py-2 min-h-11 rounded-full bg-white border border-indigo-100 shadow-sm text-gray-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            {{ sub.label }} <span class="text-indigo-500 font-medium">+{{ sub.xp }}</span>
          </button>
        </div>

        <!-- Sub-type pills + add form — user-defined types -->
        <template v-else>
          <p v-if="(wt.subtypes ?? []).length === 0" class="text-xs text-gray-400 italic py-2">No subtypes yet — add one below</p>
          <div class="flex flex-wrap gap-1.5 mb-3">
            <div
              v-for="sub in (wt.subtypes ?? [])"
              :key="sub.label"
              class="flex items-center text-xs rounded-full bg-white border border-indigo-100 shadow-sm hover:border-indigo-400 transition-colors"
            >
              <button
                @click="logWorkout(wt.name, sub)"
                class="px-3 py-2 min-h-11 text-gray-700 hover:text-indigo-600 cursor-pointer"
              >
                {{ sub.label }} <span class="text-indigo-500 font-medium">+{{ sub.xp }}</span>
              </button>
              <button
                @click="removeSubtype(wt, sub.label)"
                class="pr-2.5 text-gray-300 hover:text-red-400 cursor-pointer transition-colors"
                aria-label="Remove subtype"
              >×</button>
            </div>
          </div>
          <!-- Add subtype form -->
          <div class="flex items-center gap-2 pt-2 border-t border-indigo-50">
            <input
              v-model="newSubName"
              @keydown.enter="addSubtype(wt)"
              type="text"
              maxlength="30"
              placeholder="subtype name"
              class="flex-1 text-xs border border-indigo-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-300"
            />
            <input
              v-model.number="newSubXp"
              type="number"
              min="5"
              max="80"
              class="w-16 text-xs border border-indigo-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-300"
            />
            <button
              @click="addSubtype(wt)"
              class="text-xs px-3 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
            >Add</button>
          </div>
          <p v-if="subError" class="text-xs text-red-500 mt-1">{{ subError }}</p>
        </template>
      </div>
    </div>
  </div>

  <!-- Add workout type button -->
  <div v-if="!showAddForm" class="flex justify-end mb-2">
    <button
      @click="showAddForm = true"
      class="text-sm px-3 py-1.5 rounded-full border border-indigo-300 text-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer"
    >
      + type
    </button>
  </div>

  <!-- Inline add form -->
  <div v-if="showAddForm" class="bg-white/80 rounded-xl border border-indigo-100 p-4 mb-4">
    <p class="text-xs text-indigo-500 uppercase tracking-widest mb-2">New workout type</p>
    <input
      v-model="newTypeName"
      @keydown.enter="addWorkoutType"
      type="text"
      maxlength="30"
      placeholder="e.g. Cycling"
      class="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
    <p v-if="addError" class="text-xs text-red-500 mb-2">{{ addError }}</p>
    <!-- Color swatches -->
    <div class="flex gap-2 mb-3">
      <button
        v-for="c in COLOR_SWATCHES"
        :key="c"
        @click="newTypeColor = c"
        :style="{ backgroundColor: c }"
        :class="newTypeColor === c ? 'ring-2 ring-offset-1 ring-indigo-500' : ''"
        class="w-6 h-6 rounded-full cursor-pointer transition-all"
        :aria-label="`Select color ${c}`"
      />
    </div>
    <div class="flex gap-2">
      <button
        @click="addWorkoutType"
        class="text-sm px-4 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer font-medium"
      >
        Add
      </button>
      <button
        @click="cancelAdd"
        class="text-sm px-4 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        Cancel
      </button>
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

const DEFAULT_TYPE_IDS = ['strength', 'walking', 'boxing', 'tennis']
const COLOR_SWATCHES = ['#f472b6', '#60a5fa', '#f87171', '#4ade80', '#fb923c', '#a78bfa']

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

const showAddForm = ref(false)
const newTypeName = ref('')
const newTypeColor = ref('#f472b6')
const addError = ref('')
const confirmDeleteId = ref(null)

const newSubName = ref('')
const newSubXp = ref(20)
const subError = ref('')

const tipIndex = ref(0)
let tipTimer = null

onMounted(() => {
  tipIndex.value = Math.floor(Math.random() * TIPS.length)
  tipTimer = setInterval(() => { tipIndex.value++ }, 10000)
})

onUnmounted(() => clearInterval(tipTimer))

const today = todayStr()

const todayXP = computed(() => {
  const totals = {}
  for (const wt of state.workoutTypes) totals[wt.name] = 0
  for (const w of state.workouts) {
    if (w.date === today && w.type in totals) totals[w.type] += w.xp
  }
  return totals
})

const sessionCounts = computed(() => {
  const counts = {}
  for (const wt of state.workoutTypes) counts[wt.name] = 0
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
  subError.value = ''
  maybeSetStartDate(state)
  state.workouts.push({ type, name: `${type} – ${sub.label}`, xp: sub.xp, date: today })
  addXP(state, sub.xp)
  const broke = willStreakBreak(state)
  updateWorkoutStreak(state)
  fireWorkoutToasts()
  setMood('workout')
  state.petMood = computeMood(state, { streakBroke: broke })
}

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-')
}

function addWorkoutType() {
  const name = newTypeName.value.trim()
  if (!name) { addError.value = 'Name is required'; return }
  const duplicate = state.workoutTypes.some(wt => wt.name.toLowerCase() === name.toLowerCase())
  if (duplicate) { addError.value = 'Type already exists'; return }
  state.workoutTypes.push({ id: slugify(name), name, color: newTypeColor.value, sessions: [] })
  addXP(state, 5)
  newTypeName.value = ''
  newTypeColor.value = '#f472b6'
  addError.value = ''
  showAddForm.value = false
}

function cancelAdd() {
  newTypeName.value = ''
  newTypeColor.value = '#f472b6'
  addError.value = ''
  showAddForm.value = false
}

function removeWorkoutType(id) {
  state.workoutTypes = state.workoutTypes.filter(wt => wt.id !== id)
  if (openWorkout.value === id) openWorkout.value = null
  confirmDeleteId.value = null
}

function toggleAccordion(id) {
  openWorkout.value = openWorkout.value === id ? null : id
  newSubName.value = ''
  newSubXp.value = 20
  subError.value = ''
}

function addSubtype(wt) {
  const name = newSubName.value.trim()
  const xp = Number(newSubXp.value)
  if (!name) { subError.value = 'Name is required'; return }
  if (xp < 5 || xp > 80) { subError.value = 'XP must be 5–80'; return }
  const existing = wt.subtypes ?? []
  if (existing.some(s => s.label.toLowerCase() === name.toLowerCase())) {
    subError.value = 'Already exists'
    return
  }
  wt.subtypes = [...existing, { label: name, xp }]
  newSubName.value = ''
  newSubXp.value = 20
  subError.value = ''
}

function removeSubtype(wt, label) {
  wt.subtypes = (wt.subtypes ?? []).filter(s => s.label !== label)
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
