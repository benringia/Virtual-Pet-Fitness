<template>
  <div class="min-h-screen bg-pink-50">
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      <!-- Header -->
      <header class="flex items-center justify-between mb-5 lg:mb-8">
        <div class="flex items-center gap-1">
          <template v-if="!editing">
            <span class="text-xs font-bold tracking-widest text-gray-500 uppercase">
              {{ state.petName }} · {{ stage }}
            </span>
            <button @click="startEdit" class="text-gray-400 hover:text-pink-400 transition-colors text-xs leading-none">✏️</button>
          </template>
          <template v-else>
            <input
              ref="inputEl"
              v-model="editValue"
              maxlength="20"
              @keyup.enter="saveEdit"
              @blur="saveEdit"
              class="text-xs font-bold tracking-widest text-gray-500 uppercase bg-transparent border-b border-pink-300 focus:outline-none w-32"
            />
            <span class="text-xs font-bold tracking-widest text-gray-500 uppercase">· {{ stage }}</span>
          </template>
        </div>
        <div class="flex items-center gap-2">
          <span v-if="state.startDate" class="text-xs text-gray-400">day {{ dayCount }}</span>
          <span class="border border-pink-300 text-pink-500 rounded-full px-3 py-0.5 text-xs font-semibold">
            lvl {{ state.level }}
          </span>
        </div>
      </header>

      <!-- Tab switcher -->
      <nav class="flex gap-2 mb-5 lg:mb-6" aria-label="View switcher">
        <button
          @click="activeView = 'tracker'"
          :class="activeView === 'tracker' ? 'bg-pink-400 text-white' : 'text-gray-400 hover:bg-pink-50 border border-pink-200'"
          class="rounded-full px-4 py-1.5 text-xs font-semibold transition-colors"
        >Tracker</button>
        <button
          @click="activeView = 'progress'"
          :class="activeView === 'progress' ? 'bg-pink-400 text-white' : 'text-gray-400 hover:bg-pink-50 border border-pink-200'"
          class="rounded-full px-4 py-1.5 text-xs font-semibold transition-colors"
        >Progress</button>
      </nav>

      <ProgressDashboard v-if="activeView === 'progress'" />

      <div v-if="activeView === 'tracker'" class="lg:grid lg:grid-cols-[1fr_2fr_1fr] lg:gap-6 lg:items-start">
        <!-- Left column: Pet + WeightLog -->
        <div class="contents lg:block lg:overflow-y-auto">
          <Pet />
          <WeightLog />
        </div>
        <!-- Center column: WorkoutLogger -->
        <div class="contents lg:block lg:overflow-y-auto">
          <WorkoutLogger />
        </div>
        <!-- Right column: DietHabits + CaloriesTracker + StatsPanel -->
        <div class="contents lg:block lg:overflow-y-auto">
          <DietHabits />
          <CaloriesTracker />
          <StatsPanel />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, nextTick } from 'vue'
import Pet from './components/Pet.vue'
import WorkoutLogger from './components/WorkoutLogger.vue'
import DietHabits from './components/DietHabits.vue'
import CaloriesTracker from './components/CaloriesTracker.vue'
import WeightLog from './components/WeightLog.vue'
import StatsPanel from './components/StatsPanel.vue'
import ProgressDashboard from './components/ProgressDashboard.vue'
import { state } from './store/state.js'
import { checkDayRollover, daysBetween, getTodayDate } from './utils/dates.js'
import { getStageFromLevel } from './utils/xp.js'

onMounted(() => checkDayRollover(state))

const stage = computed(() => getStageFromLevel(state.level))
const dayCount = computed(() => state.startDate ? daysBetween(state.startDate, getTodayDate()) + 1 : 1)

const activeView = ref('tracker')

const editing = ref(false)
const editValue = ref('')
const inputEl = ref(null)

function startEdit() {
  editValue.value = state.petName
  editing.value = true
  nextTick(() => inputEl.value?.focus())
}

function saveEdit() {
  const trimmed = editValue.value.trim()
  state.petName = trimmed || state.petName
  editing.value = false
}
</script>
