<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <header class="text-center mb-6">
      <h1 class="text-2xl font-bold">Virtual Pet Fitness</h1>
    </header>
    <Pet />
    <WorkoutLogger />
    <DietHabits />
    <CaloriesTracker />
    <StatsPanel />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Pet from './components/Pet.vue'
import WorkoutLogger from './components/WorkoutLogger.vue'
import DietHabits from './components/DietHabits.vue'
import CaloriesTracker from './components/CaloriesTracker.vue'
import StatsPanel from './components/StatsPanel.vue'
import { state } from './store/state.js'
import { checkDayRollover } from './utils/dates.js'

onMounted(() => checkDayRollover(state))
</script>
