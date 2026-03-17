<template>
  <!-- Journey card -->
  <div class="bg-white rounded-2xl shadow-sm mb-4 px-4 py-4">
    <div class="flex items-center gap-2 mb-1">
      <span class="text-base">🗓️</span>
      <h2 class="font-semibold text-gray-700">Your journey</h2>
    </div>
    <template v-if="formattedStart">
      <p class="text-xs text-gray-400">Started: {{ formattedStart }}</p>
      <p class="text-sm font-bold text-pink-500 mt-1">Day {{ dayNumber }}</p>
    </template>
    <p v-else class="text-xs text-gray-400">Log your first activity to start your journey 🌸</p>
  </div>

  <!-- Monthly predictions -->
  <div class="bg-white rounded-2xl shadow-sm mb-4 px-4 py-4">
    <div class="flex items-center gap-2 mb-3">
      <span class="text-base">🔮</span>
      <h2 class="font-semibold text-gray-700">Monthly predictions</h2>
    </div>
    <p class="text-xs text-gray-400 mb-3">based on your current pace</p>

    <!-- Tabs -->
    <div class="flex gap-2 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="px-3 py-1 rounded-full text-xs font-medium transition-colors"
        :class="activeTab === tab.key
          ? 'bg-pink-400 text-white'
          : 'bg-gray-100 text-gray-500 hover:bg-pink-50'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab content -->
    <div class="py-3 text-sm">

      <!-- Calories tab -->
      <template v-if="activeTab === 'calories'">
        <template v-if="!predictions.calories.hasData">
          <p class="text-center text-gray-400">log your first calorie day to unlock predictions 🔥</p>
        </template>
        <template v-else>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-gray-500">projected monthly deficit</span>
              <span class="font-bold text-pink-500">{{ predictions.calories.projected30dDeficit.toLocaleString() }} kcal</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-500">est. weight change</span>
              <span class="font-bold" :class="predictions.calories.weightChangeLbs >= 0 ? 'text-green-500' : 'text-red-400'">
                {{ predictions.calories.weightChangeLbs >= 0 ? '-' : '+' }}{{ Math.abs(predictions.calories.weightChangeLbs) }} lbs
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400 text-xs">avg daily deficit</span>
              <span class="text-gray-500 text-xs">{{ predictions.calories.avgDailyDeficit }} kcal / day</span>
            </div>
            <div class="flex justify-end mt-1">
              <span class="text-xs px-2 py-0.5 rounded-full" :class="confidenceClass(predictions.calories.confidence)">
                {{ predictions.calories.confidence }} confidence
              </span>
            </div>
          </div>
        </template>
      </template>

      <!-- Workouts tab -->
      <template v-else-if="activeTab === 'workouts'">
        <template v-if="!predictions.workouts.hasData">
          <p class="text-center text-gray-400">log your first workout to unlock predictions 🏋️</p>
        </template>
        <template v-else>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-gray-500">projected sessions</span>
              <span class="font-bold text-pink-500">~{{ predictions.workouts.projected30d }} / month</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400 text-xs">weekly average</span>
              <span class="text-gray-500 text-xs">{{ predictions.workouts.weeklyAvg }} / week</span>
            </div>
            <div class="flex justify-end mt-1">
              <span class="text-xs px-2 py-0.5 rounded-full" :class="confidenceClass(predictions.workouts.confidence)">
                {{ predictions.workouts.confidence }} confidence
              </span>
            </div>
          </div>
        </template>
      </template>

      <!-- XP & level tab -->
      <template v-else>
        <template v-if="!predictions.xp.hasData">
          <p class="text-center text-gray-400">log workouts or habits to unlock predictions ✨</p>
        </template>
        <template v-else>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-gray-500">projected xp</span>
              <span class="font-bold text-pink-500">+{{ predictions.xp.projected30d.toLocaleString() }} xp</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-500">levels gained</span>
              <span class="font-bold text-pink-500">{{ predictions.xp.levelsGained }} → lvl {{ predictions.xp.projectedLevel }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400 text-xs">avg daily xp</span>
              <span class="text-gray-500 text-xs">{{ predictions.xp.avgDailyXp }} xp / day</span>
            </div>
            <div class="flex justify-end mt-1">
              <span class="text-xs px-2 py-0.5 rounded-full" :class="confidenceClass(predictions.xp.confidence)">
                {{ predictions.xp.confidence }} confidence
              </span>
            </div>
          </div>
        </template>
      </template>

      <!-- Helper text always shown -->
      <p class="text-center text-xs text-gray-300 mt-3">⭐ predictions improve as you log more days</p>
    </div>
  </div>

  <!-- Evolution path -->
  <div class="bg-white rounded-2xl shadow-sm mb-4 px-4 py-4">
    <p class="text-xs text-gray-400 uppercase tracking-widest mb-3">Evolution Path</p>
    <div class="flex items-center justify-between">
      <template v-for="(s, i) in STAGE_LIST" :key="s.name">
        <div class="flex flex-col items-center gap-1">
          <span
            class="text-2xl transition-all duration-300"
            :class="currentStage === s.name ? 'scale-125' : 'opacity-40'"
          >{{ s.emoji }}</span>
          <span
            class="text-xs"
            :class="currentStage === s.name ? 'text-pink-500 font-semibold' : 'text-gray-300'"
          >{{ s.name.toLowerCase() }}</span>
        </div>
        <div v-if="i < STAGE_LIST.length - 1" class="flex-1 h-px bg-gray-200 mx-1 mb-4" />
      </template>
    </div>
  </div>

  <!-- Reset button -->
  <div class="text-center mb-6">
    <button
      @click="confirmReset"
      class="w-full py-2.5 rounded-full border border-pink-300 text-pink-400 text-sm hover:bg-pink-50 transition-colors"
    >
      🌸 reset pet &amp; start over
    </button>
    <p class="text-xs text-gray-300 mt-1">fresh start!</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { state } from '../store/state.js'
import { resetState } from '../store/persistence.js'
import { computePredictions } from '../utils/predictions.js'
import { getStageFromLevel, STAGE_LIST } from '../utils/xp.js'
import { getTodayDate, daysBetween, formatDate } from '../utils/dates.js'

const dayNumber = computed(() =>
  state.startDate ? daysBetween(state.startDate, getTodayDate()) + 1 : null
)
const formattedStart = computed(() =>
  state.startDate ? formatDate(state.startDate) : null
)

const activeTab = ref('calories')

const tabs = [
  { key: 'calories',  label: 'calories' },
  { key: 'workouts',  label: 'workouts' },
  { key: 'xp',        label: 'xp & level' },
]

const predictions = computed(() => computePredictions(state))
const currentStage = computed(() => getStageFromLevel(state.level))

const CONFIDENCE_CLASSES = {
  low:    'bg-red-100 text-red-400',
  medium: 'bg-yellow-100 text-yellow-500',
  high:   'bg-green-100 text-green-500',
}
function confidenceClass(level) { return CONFIDENCE_CLASSES[level] ?? '' }

function confirmReset() {
  if (confirm('Reset your pet and start over? This cannot be undone.')) {
    resetState(state)
  }
}
</script>
