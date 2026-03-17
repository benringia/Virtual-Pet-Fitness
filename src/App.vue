<template>
  <div class="min-h-screen bg-pink-50">
    <Header v-model="activeView" />
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-4">

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
import { onMounted, ref } from 'vue'
import Header from './components/Header.vue'
import Pet from './components/Pet.vue'
import WorkoutLogger from './components/WorkoutLogger.vue'
import DietHabits from './components/DietHabits.vue'
import CaloriesTracker from './components/CaloriesTracker.vue'
import WeightLog from './components/WeightLog.vue'
import StatsPanel from './components/StatsPanel.vue'
import ProgressDashboard from './components/ProgressDashboard.vue'
import { state } from './store/state.js'
import { checkDayRollover } from './utils/dates.js'

onMounted(() => checkDayRollover(state))

const activeView = ref('tracker')
</script>
