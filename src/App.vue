<template>
  <div class="min-h-screen bg-pink-50">
    <div class="max-w-md mx-auto px-4 py-6">
      <!-- Header -->
      <header class="flex items-center justify-between mb-5">
        <span class="text-xs font-bold tracking-widest text-gray-500 uppercase">
          FlarePup · {{ stage }}
        </span>
        <span class="border border-pink-300 text-pink-500 rounded-full px-3 py-0.5 text-xs font-semibold">
          lvl {{ state.level }}
        </span>
      </header>

      <Pet />
      <WorkoutLogger />
      <DietHabits />
      <CaloriesTracker />
      <StatsPanel />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import Pet from './components/Pet.vue'
import WorkoutLogger from './components/WorkoutLogger.vue'
import DietHabits from './components/DietHabits.vue'
import CaloriesTracker from './components/CaloriesTracker.vue'
import StatsPanel from './components/StatsPanel.vue'
import { state } from './store/state.js'
import { checkDayRollover } from './utils/dates.js'
import { getStageFromLevel } from './utils/xp.js'

onMounted(() => checkDayRollover(state))

const stage = computed(() => getStageFromLevel(state.level))
</script>
