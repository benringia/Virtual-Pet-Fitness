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

  <!-- Structured workouts section label -->
  <div class="mb-2 mt-1 flex items-center gap-2 px-1">
    <div class="flex items-center gap-1.5">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-indigo-500 shrink-0" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
      <span class="text-[10px] font-semibold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full">
        Structured Workouts
      </span>
    </div>
    <span v-if="todaySessionCount > 0" class="text-[10px] text-gray-400 ml-auto whitespace-nowrap">
      {{ activeTypesToday }} type{{ activeTypesToday !== 1 ? 's' : '' }} · {{ todaySessionCount }} session{{ todaySessionCount !== 1 ? 's' : '' }} today
    </span>
    <span v-else class="text-[10px] text-gray-400 ml-auto">bonus XP for specific training</span>
  </div>

  <!-- Workout type accordions -->
  <div class="space-y-2 mb-4">
    <div
      v-for="wt in visibleTypes"
      :key="wt.id"
      class="rounded-2xl shadow-sm hover:shadow-md overflow-hidden border transition-all duration-500"
      :class="[
        openWorkout === wt.id ? 'border border-indigo-100 border-l-4' : 'border border-transparent',
        sessionCounts[wt.name] === 0 && openWorkout !== wt.id ? 'opacity-60' : 'opacity-100',
        recentlyAddedId === wt.id ? 'ring-2 ring-indigo-400 ring-offset-1' : ''
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
          <span class="text-sm font-semibold text-gray-700 capitalize">{{ wt.name }}</span>
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
        <!-- XP progress bar — default types -->
        <div v-if="DEFAULT_TYPE_IDS.includes(wt.id)" v-show="todayXP[wt.name] > 0" class="mb-3 mt-1">
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
          <!-- XP progress bar — user-defined types with at least one subtype -->
          <div v-if="(wt.subtypes ?? []).length > 0" class="mb-3 mt-1">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs font-medium text-gray-500">XP today</span>
              <span class="text-xs font-semibold text-indigo-600">{{ todayXP[wt.name] ?? 0 }}<span class="text-gray-400 font-normal"> / {{ WORKOUT_CAP }}</span></span>
            </div>
            <div class="w-full bg-indigo-100 rounded-full h-2">
              <div
                class="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: Math.min(((todayXP[wt.name] ?? 0) / WORKOUT_CAP) * 100, 100) + '%' }"
              />
            </div>
          </div>
          <p v-if="(wt.subtypes ?? []).length === 0 && showSubForm !== wt.id" class="text-xs text-gray-400 italic py-2">No subtypes yet — add one below</p>
          <div class="flex flex-wrap gap-1.5 mt-3 mb-3">
            <div
              v-for="sub in (wt.subtypes ?? [])"
              :key="sub.label"
              class="inline-flex items-center text-xs rounded-full bg-white border border-indigo-100 shadow-sm hover:border-indigo-400 transition-colors"
            >
              <button
                @click="logWorkout(wt.name, sub)"
                class="px-3 py-1.5 text-gray-700 hover:text-indigo-600 cursor-pointer"
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
          <p v-if="(wt.subtypes ?? []).length >= 8" class="text-xs text-gray-400 mt-2">Max 8 subtypes reached</p>
          <!-- Add subtype form -->
          <div v-if="showSubForm === wt.id" class="mt-2 flex items-end gap-2">
            <div class="flex flex-col flex-1">
              <label class="text-xs text-indigo-400 uppercase tracking-wide mb-1 block">Subtype name</label>
              <input
                v-model="newSubName"
                @keydown.enter="addSubtype(wt)"
                type="text"
                maxlength="30"
                placeholder="subtype name"
                class="text-xs border border-indigo-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-300"
              />
            </div>
            <div class="flex flex-col">
              <label class="text-xs text-indigo-400 uppercase tracking-wide mb-1 block">XP</label>
              <input
                v-model.number="newSubXp"
                type="number"
                min="5"
                max="80"
                class="w-16 text-xs border border-indigo-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-300"
              />
            </div>
            <button
              @click="addSubtype(wt)"
              class="bg-indigo-600 text-white text-xs font-medium px-4 py-1.5 rounded-full hover:bg-indigo-700 transition-colors cursor-pointer"
            >Add</button>
          </div>
          <p v-if="subError && showSubForm === wt.id" class="text-xs text-red-500 mt-1">{{ subError }}</p>
          <!-- Toggle button -->
          <button
            v-if="(wt.subtypes ?? []).length < 8"
            @click="toggleSubForm(wt.id)"
            class="mt-2 text-xs text-gray-400 hover:text-red-400 transition-colors cursor-pointer underline-offset-2 hover:underline"
          >
            <span v-if="showSubForm !== wt.id">+ add subtype</span>
            <span v-else>cancel</span>
          </button>
        </template>
      </div>
    </div>
  </div>

  <!-- Show/hide inactive types toggle -->
  <div v-if="inactiveTypeCount > 0" class="mb-2">
    <button
      @click="showAllTypes = !showAllTypes"
      class="w-full text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 cursor-pointer transition-colors px-4 py-2 rounded-full text-center"
    >
      <span v-if="!showAllTypes">Show {{ inactiveTypeCount }} more ▾</span>
      <span v-else>Hide inactive types ▴</span>
    </button>
  </div>

  <!-- Add workout type button -->
  <div v-if="!showAddForm" class="mb-2">
    <button
      @click="showAddForm = true"
      class="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl border-2 border-dashed border-indigo-200 text-indigo-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 cursor-pointer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14"/>
      </svg>
      <span class="text-sm font-medium">Add a custom workout type</span>
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

const showAddForm = ref(false)
const newTypeName = ref('')
const newTypeColor = ref('#f472b6')
const addError = ref('')
const confirmDeleteId = ref(null)

const newSubName = ref('')
const newSubXp = ref(20)
const subError = ref('')
const showSubForm = ref(null)

const tipIndex = ref(0)
let tipTimer = null

onMounted(() => {
  tipIndex.value = Math.floor(Math.random() * TIPS.length)
  tipTimer = setInterval(() => { tipIndex.value++ }, 10000)
})

const recentlyAddedId = ref(null)
let recentlyAddedTimer = null

onUnmounted(() => {
  clearInterval(tipTimer)
  clearTimeout(recentlyAddedTimer)
})

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


const todaySessionCount = computed(() =>
  state.workouts.filter(w => w.date === today).length
)

const activeTypesToday = computed(() =>
  new Set(state.workouts.filter(w => w.date === today).map(w => w.type)).size
)

const showAllTypes = ref(false)
const inactiveTypeCount = computed(() =>
  state.workoutTypes.filter(wt =>
    DEFAULT_TYPE_IDS.includes(wt.id) && sessionCounts.value[wt.name] === 0
  ).length
)
const visibleTypes = computed(() => {
  if (showAllTypes.value) return state.workoutTypes
  return state.workoutTypes.filter(wt =>
    !DEFAULT_TYPE_IDS.includes(wt.id) || sessionCounts.value[wt.name] > 0
  )
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
  const remaining = Math.max(0, WORKOUT_CAP - todayXP.value[type])
  const xpToAward = Math.min(sub.xp, remaining)
  state.workouts.push({ type, name: `${type} – ${sub.label}`, xp: xpToAward, date: today })
  if (xpToAward > 0) addXP(state, xpToAward)
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
  const newId = slugify(name)
  state.workoutTypes.push({ id: newId, name, color: newTypeColor.value, sessions: [] })
  showAllTypes.value = true
  recentlyAddedId.value = newId
  clearTimeout(recentlyAddedTimer)
  recentlyAddedTimer = setTimeout(() => { recentlyAddedId.value = null }, 5000)
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
  showSubForm.value = null
  subError.value = ''
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
  if (existing.length >= 8) { subError.value = 'Maximum 8 subtypes reached'; return }
  if (existing.some(s => s.label.toLowerCase() === name.toLowerCase())) {
    subError.value = 'Already exists'
    return
  }
  wt.subtypes = [...existing, { label: name, xp }]
  newSubName.value = ''
  newSubXp.value = 20
  subError.value = ''
  showSubForm.value = null
}

function toggleSubForm(id) {
  showSubForm.value = showSubForm.value === id ? null : id
  if (showSubForm.value === null) subError.value = ''
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
