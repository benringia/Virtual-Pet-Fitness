<template>
  <div class="min-h-screen bg-[#f8f8ff] flex flex-col">
    <Header v-model="activeView" />

    <div class="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full">

      <!-- LEFT SIDEBAR (desktop only) -->
      <aside class="hidden lg:flex flex-col w-56 shrink-0 bg-white border-r border-indigo-100 sticky mt-6 rounded-2xl h-100vh overflow-hidden">
        <div class="flex-1 overflow-y-auto px-2 pt-4 lg:pt-6 pb-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <StatsPanel>
            <nav class="p-4 flex flex-col gap-1" aria-label="Main navigation">
              <button
                @click="activeView = 'tracker'"
                :class="activeView === 'tracker' ? 'bg-indigo-100 text-indigo-600 font-semibold' : 'text-gray-500 hover:bg-indigo-50'"
                class="w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
              ><span>🏠</span> Tracker</button>
              <button
                @click="activeView = 'progress'"
                :class="activeView === 'progress' ? 'bg-indigo-100 text-indigo-600 font-semibold' : 'text-gray-500 hover:bg-indigo-50'"
                class="w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
              ><span>📊</span> Progress</button>
            </nav>
            <WeightLog />
          </StatsPanel>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="flex-1 overflow-y-auto pb-16 lg:pb-0">

        <!-- Progress view -->
        <div v-if="activeView === 'progress'" class="p-4 lg:p-6">
          <ProgressDashboard />
        </div>

        <!-- Tracker view -->
        <div v-if="activeView === 'tracker'" class="flex flex-col lg:flex-row gap-4 p-4 lg:p-6 items-start">

          <!-- Center column -->
          <div class="w-full lg:flex-1 min-w-0">
            <Pet />
            <WorkoutLogger />
            <CaloriesBurned />
          </div>

          <!-- Right panel -->
          <div class="w-full lg:w-80 shrink-0">
            <!-- Mini stat cards -->
            <div class="grid grid-cols-3 gap-2 mb-4">
              <div class="bg-white rounded-2xl shadow-sm p-3 text-center">
                <div class="text-lg font-bold text-orange-500">{{ state.streaks.workout.count }}</div>
                <div class="text-xs text-gray-400 leading-tight mt-0.5">workout<br>streak</div>
              </div>
              <div class="bg-white rounded-2xl shadow-sm p-3 text-center">
                <div class="text-lg font-bold text-indigo-500">{{ state.calories.eaten }}</div>
                <div class="text-xs text-gray-400 leading-tight mt-0.5">kcal<br>today</div>
              </div>
              <div class="bg-white rounded-2xl shadow-sm p-3 text-center">
                <div class="text-lg font-bold text-green-500">{{ state.streaks.diet.count }}</div>
                <div class="text-xs text-gray-400 leading-tight mt-0.5">diet<br>streak</div>
              </div>
            </div>
            <DietHabits />
            <MealLogger />
            <CaloriesTracker />
            <ProteinCounter />
          </div>

        </div>
      </main>
    </div>

    <!-- Mobile bottom nav (fixed) -->
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-indigo-100 flex z-20" aria-label="Mobile navigation">
      <button
        @click="activeView = 'tracker'"
        :class="activeView === 'tracker' ? 'text-indigo-500' : 'text-gray-400'"
        class="flex-1 py-3 flex flex-col items-center gap-0.5 text-xs font-medium transition-colors"
      ><span class="text-lg leading-none">🏠</span> Tracker</button>
      <button
        @click="activeView = 'progress'"
        :class="activeView === 'progress' ? 'text-indigo-500' : 'text-gray-400'"
        class="flex-1 py-3 flex flex-col items-center gap-0.5 text-xs font-medium transition-colors"
      ><span class="text-lg leading-none">📊</span> Progress</button>
    </nav>

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
