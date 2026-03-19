<template>
  <div class="min-h-screen bg-[#f8f8ff] flex flex-col">
    <Header v-model="activeView" />

    <div class="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full">

      <!-- LEFT SIDEBAR (desktop only) -->
      <aside class="hidden lg:flex flex-col w-56 shrink-0 bg-indigo-50/50 border-r border-indigo-100 sticky mt-6 rounded-2xl h-100vh overflow-hidden">
        <div class="flex-1 overflow-y-auto px-2 pt-4 lg:pt-6 pb-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <StatsPanel>
            <nav class="p-4 flex flex-col gap-1" aria-label="Main navigation">
              <button
                @click="activeView = 'tracker'"
                :aria-current="activeView === 'tracker' ? 'page' : undefined"
                :class="activeView === 'tracker' ? 'bg-white shadow-sm text-indigo-600 font-semibold' : 'text-indigo-700 hover:bg-indigo-100/60'"
                class="w-full text-left px-4 py-2.5 min-h-11 rounded-xl text-sm transition-colors flex items-center gap-2 cursor-pointer"
              ><span>🏠</span> Tracker</button>
              <button
                @click="activeView = 'progress'"
                :aria-current="activeView === 'progress' ? 'page' : undefined"
                :class="activeView === 'progress' ? 'bg-white shadow-sm text-indigo-600 font-semibold' : 'text-indigo-700 hover:bg-indigo-100/60'"
                class="w-full text-left px-4 py-2.5 min-h-11 rounded-xl text-sm transition-colors flex items-center gap-2 cursor-pointer"
              ><span>📊</span> Progress</button>
            </nav>
            <div class="border-t border-indigo-100/60 my-2" />
            <WeightLog />
            <div class="border-t border-indigo-100/60 my-2" />
            <ReminderSettings />
            <div class="border-t border-indigo-100/60 my-2" />
            <div class="px-4 pb-3">
              <button
                @click="handleLogRestDay"
                :disabled="!restDayAllowed"
                :class="restDayAllowed
                  ? 'text-indigo-700 hover:bg-indigo-100/60'
                  : 'text-gray-400 cursor-not-allowed'"
                class="w-full py-2 min-h-11 px-4 rounded-xl text-sm font-medium transition-colors cursor-pointer bg-transparent border border-indigo-200"
              >
                {{ restLogged ? '✓ Rest day logged' : '😴 Log Rest Day' }}
              </button>
              <p class="text-xs text-center text-gray-600 mt-1.5">
                {{ restDaysThisWeek }} of 2 rest days used this week
              </p>
            </div>
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
            <WorkoutLogger />
          </div>

          <!-- Right panel -->
          <div class="w-full lg:w-80 shrink-0">
            <Pet />
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
            <!-- Tabbed right panel card -->
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
              <!-- Tab bar -->
              <div class="flex gap-1 p-3 border-b border-indigo-50">
                <button
                  v-for="tab in [
                    { id: 'diet',     label: 'Diet' },
                    { id: 'meals',    label: 'Meals' },
                    { id: 'calories', label: 'Calories' },
                    { id: 'protein',  label: 'Protein' },
                  ]"
                  :key="tab.id"
                  @click="activeRightTab = tab.id"
                  :class="activeRightTab === tab.id
                    ? 'bg-indigo-500 text-white'
                    : 'bg-indigo-50 text-indigo-400 hover:bg-indigo-100'"
                  class="flex-1 text-xs font-medium py-1.5 px-2 rounded-full transition-colors"
                >{{ tab.label }}</button>
              </div>

              <!-- Tab content -->
              <div v-show="activeRightTab === 'diet'"><DietHabits /></div>
              <div v-show="activeRightTab === 'meals'"><MealLogger /></div>
              <div v-show="activeRightTab === 'calories'">
                <CaloriesTracker />
              </div>
              <div v-show="activeRightTab === 'protein'"><ProteinCounter /></div>
            </div>
          </div>

        </div>
      </main>
    </div>

    <ToastNotification />
    <EvolutionModal />
    <WeeklyReportModal />

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
import { onMounted, ref, computed } from 'vue'
import Header from './components/Header.vue'
import ToastNotification from './components/ToastNotification.vue'
import EvolutionModal from './components/EvolutionModal.vue'
import Pet from './components/Pet.vue'
import WorkoutLogger from './components/WorkoutLogger.vue'
import DietHabits from './components/DietHabits.vue'
import CaloriesTracker from './components/CaloriesTracker.vue'
import ProteinCounter from './components/ProteinCounter.vue'
import WeightLog from './components/WeightLog.vue'
import MealLogger from './components/MealLogger.vue'

import StatsPanel from './components/StatsPanel.vue'
import ProgressDashboard from './components/ProgressDashboard.vue'
import ReminderSettings from './components/ReminderSettings.vue'
import WeeklyReportModal from './components/WeeklyReportModal.vue'
import { state } from './store/state.js'
import { checkDayRollover } from './utils/dates.js'
import { scheduleReminder } from './utils/reminder.js'
import { canLogRestDay, logRestDay, getRestDaysThisWeek } from './utils/restDay.js'
import { showWeeklyReport, getThisMonday } from './utils/weeklyReport.js'

const restDaysThisWeek = computed(() => getRestDaysThisWeek(state.restDays))
const restDayAllowed = computed(() => canLogRestDay(state))
const restLogged = ref(false)

function handleLogRestDay() {
  logRestDay(state)
  restLogged.value = true
  setTimeout(() => { restLogged.value = false }, 1500)
}

onMounted(() => {
  checkDayRollover(state)
  if (state.reminder.enabled && Notification.permission === 'granted') {
    scheduleReminder(state.reminder.time)
  }
  const today = new Date()
  if (today.getDay() === 1) {
    const thisMonday = getThisMonday()
    if (state.lastWeeklyReportShown !== thisMonday) {
      showWeeklyReport.value = true
      state.lastWeeklyReportShown = thisMonday
    }
  }
})

const activeView = ref('tracker')
const activeRightTab = ref('diet')
</script>
