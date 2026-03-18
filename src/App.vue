<template>
  <div class="min-h-screen bg-pink-50">
    <Header v-model="activeView" />
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-4">

      <ProgressDashboard v-if="activeView === 'progress'" />

      <div v-if="activeView === 'tracker'" class="lg:grid lg:grid-cols-[1fr_2fr_1fr] lg:gap-6 lg:items-start">
        <!-- Left column: Pet + WeightLog + StatsPanel -->
        <div class="contents lg:block lg:overflow-y-auto">
          <Pet />
          <WeightLog />
          <StatsPanel />
        </div>
        <!-- Center column: WorkoutLogger + CaloriesBurned -->
        <div class="contents lg:block lg:overflow-y-auto">
          <WorkoutLogger />
          <CaloriesBurned />
        </div>
        <!-- Right column: DietHabits + MealLogger + CaloriesTracker -->
        <div class="contents lg:block lg:overflow-y-auto">
          <DietHabits />
          <MealLogger />
          <CaloriesTracker />
          <ProteinCounter />
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
import ProteinCounter from './components/ProteinCounter.vue'
import WeightLog from './components/WeightLog.vue'
import MealLogger from './components/MealLogger.vue'
import CaloriesBurned from './components/CaloriesBurned.vue'
import StatsPanel from './components/StatsPanel.vue'
import ProgressDashboard from './components/ProgressDashboard.vue'
import { state } from './store/state.js'
import { checkDayRollover } from './utils/dates.js'

onMounted(() => checkDayRollover(state))

const activeView = ref('tracker')
</script>
