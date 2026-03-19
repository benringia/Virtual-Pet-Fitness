<template>
  <div class="min-h-screen bg-[#f8f8ff] flex flex-col">

    <div class="flex flex-1 overflow-hidden w-full">

      <!-- LEFT SIDEBAR (desktop only) — rail nav -->
      <aside
        @mouseenter="railExpanded = true"
        @mouseleave="railExpanded = false"
        :class="railExpanded ? 'w-60' : 'w-16'"
        class="hidden lg:flex flex-col shrink-0 bg-indigo-600 border-r border-indigo-500 fixed left-0 top-0 h-screen overflow-hidden transition-all duration-300 ease-in-out z-30"
      >
        <!-- Top: logo + nav -->
        <div class="flex flex-col flex-1 p-2 pt-4 gap-1">

          <!-- Logo -->
          <div class="w-full flex items-center gap-3 min-h-11 px-3 py-2 overflow-hidden">
            <svg class="w-7 h-7 shrink-0" :class="railExpanded ? 'mx-0' : 'mx-auto'" viewBox="10 8 96 86" xmlns="http://www.w3.org/2000/svg" aria-label="Petfit">
              <g transform="translate(10, 5)">
                <circle cx="35" cy="18" r="10" fill="white"/>
                <circle cx="62" cy="18" r="10" fill="white"/>
                <circle cx="14" cy="30" r="8" fill="white"/>
                <circle cx="83" cy="30" r="8" fill="white"/>
                <circle cx="48" cy="52" r="32" fill="rgba(255,255,255,0.5)"/>
                <circle cx="38" cy="46" r="6" fill="white"/>
                <circle cx="58" cy="46" r="6" fill="white"/>
                <circle cx="48" cy="62" r="6" fill="white"/>
              </g>
            </svg>
            <span v-show="railExpanded" class="text-white font-semibold text-base whitespace-nowrap">Petfit</span>
          </div>
          <!-- Nav items -->
          <nav aria-label="Main navigation" class="flex flex-col gap-1 mt-8">
            <!-- Tracker -->
            <button
              @click="activeView = 'tracker'"
              :aria-current="activeView === 'tracker' ? 'page' : undefined"
              :class="activeView === 'tracker' ? 'bg-white/20 text-white' : 'text-white hover:bg-white/10'"
              class="w-full flex items-center gap-3 min-h-11 px-3 py-2 rounded-xl transition-colors duration-200 cursor-pointer"
              title="Tracker"
            >
              <svg class="w-5 h-5 shrink-0 text-white" :class="railExpanded ? 'mx-0' : 'mx-auto'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span v-show="railExpanded" class="text-sm font-medium whitespace-nowrap text-white">Tracker</span>
            </button>

            <!-- Progress -->
            <button
              @click="activeView = 'progress'"
              :aria-current="activeView === 'progress' ? 'page' : undefined"
              :class="activeView === 'progress' ? 'bg-white/20 text-white' : 'text-white hover:bg-white/10'"
              class="w-full flex items-center gap-3 min-h-11 px-3 py-2 rounded-xl transition-colors duration-200 cursor-pointer"
              title="Progress"
            >
              <svg class="w-5 h-5 shrink-0 text-white" :class="railExpanded ? 'mx-0' : 'mx-auto'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
              <span v-show="railExpanded" class="text-sm font-medium whitespace-nowrap text-white">Progress</span>
            </button>

            <!-- My Workouts (placeholder) -->
            <button
              class="w-full flex items-center gap-3 min-h-11 px-3 py-2 rounded-xl text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer"
              title="My Workouts"
            >
              <svg class="w-5 h-5 shrink-0 text-white" :class="railExpanded ? 'mx-0' : 'mx-auto'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
              </svg>
              <span v-show="railExpanded" class="text-sm font-medium whitespace-nowrap text-white">My Workouts</span>
            </button>
          </nav>
        </div>

        <!-- Bottom: logout + reset -->
        <div class="p-2 flex flex-col gap-2 pb-4">
          <!-- Logout placeholder -->
          <button
            title="Coming soon"
            class="w-full flex items-center gap-3 min-h-11 px-3 py-2 rounded-xl text-white/60 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <svg class="w-5 h-5 shrink-0" :class="railExpanded ? 'mx-0' : 'mx-auto'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            <span v-show="railExpanded" class="text-sm whitespace-nowrap">Logout</span>
          </button>

          <!-- Reset text link (expanded only) -->
          <div v-show="railExpanded" class="text-center">
            <button
              @click="showResetModal = true"
              class="text-xs text-white/60 hover:text-white/90 transition-colors hover:underline underline-offset-2 cursor-pointer"
            >
              🌸 reset pet &amp; start over
            </button>
          </div>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="flex-1 min-w-0 overflow-y-auto pb-16 lg:pb-0 lg:pl-16">

        <!-- Progress view -->
        <div v-if="activeView === 'progress'" class="p-4 lg:p-6">
          <ProgressDashboard />
        </div>

        <!-- Tracker view -->
        <div v-if="activeView === 'tracker'" class="flex flex-col lg:flex-row gap-6 p-6 items-start">

          <!-- Center column — masonry -->
          <div class="flex-1 min-w-0">
            <div class="columns-1 lg:columns-2 gap-4 [column-fill:balance]">

              <!-- WorkoutLogger -->
              <div class="break-inside-avoid mb-4 w-full">
                <WorkoutLogger />
              </div>

              <!-- StatsPanel (Your Journey) -->
              <div class="break-inside-avoid mb-4 w-full">
                <StatsPanel />
              </div>

              <!-- WeightLog + ReminderSettings side by side -->
              <div class="break-inside-avoid mb-4 w-full">
                <div class="grid grid-cols-2 gap-4">
                  <WeightLog />
                  <ReminderSettings />
                </div>
              </div>

              <!-- Rest Day + TodayProgress side by side -->
              <div class="break-inside-avoid mb-4 w-full">
                <div class="grid grid-cols-2 gap-4">
                  <!-- Rest Day -->
                  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div class="flex items-center justify-between mb-4">
                      <h3 class="text-sm font-semibold text-gray-700">Rest Day</h3>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-gray-400" aria-hidden="true">
                        <path d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"/>
                      </svg>
                    </div>
                    <!-- Usage pill slots -->
                    <div class="flex gap-2 mb-4">
                      <div
                        v-for="i in 2"
                        :key="i"
                        :class="i <= restDaysThisWeek
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          : 'bg-gray-50 border-gray-200 text-gray-400'"
                        class="flex-1 rounded-xl border py-2 text-center text-xs font-medium transition-colors"
                      >{{ i <= restDaysThisWeek ? 'Used' : 'Available' }}</div>
                    </div>
                    <!-- Log button -->
                    <button
                      @click="handleLogRestDay"
                      :disabled="!restDayAllowed"
                      :class="restDayAllowed
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
                      class="w-full min-h-11 rounded-xl text-sm font-semibold transition-colors"
                    >
                      {{ restLogged ? '✓ Rest day logged' : restDayAllowed ? 'Log Rest Day' : 'Limit reached this week' }}
                    </button>
                  </div>
                  <TodayProgress />
                </div>
              </div>


            </div>
          </div>

          <!-- Right panel -->
          <div class="w-80 shrink-0">
            <Pet />
            <!-- Activity Stats card -->
            <div class="bg-white rounded-2xl shadow-sm p-4 mb-4">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Activity Stats</h3>
              <!-- Workout type bars -->
              <div class="space-y-2 mb-4">
                <div v-for="wt in state.workoutTypes" :key="wt.id" class="flex items-center gap-2">
                  <span class="text-xs text-gray-500 w-16 truncate shrink-0">{{ wt.name }}</span>
                  <div class="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      class="h-2 rounded-full transition-all duration-500"
                      :style="{
                        width: ((workoutSessionCounts[wt.name] ?? 0) / maxWorkoutSessions * 100) + '%',
                        backgroundColor: wt.color
                      }"
                    />
                  </div>
                  <span class="text-xs font-semibold text-gray-600 w-5 text-right shrink-0">
                    {{ workoutSessionCounts[wt.name] ?? 0 }}
                  </span>
                </div>
              </div>
              <!-- Stat pills -->
              <div class="grid grid-cols-3 gap-2">
                <div class="bg-indigo-50 rounded-xl p-2 text-center">
                  <div class="text-base font-bold text-indigo-600">{{ state.streaks.workout.count }}</div>
                  <div class="text-[10px] text-gray-400 leading-tight mt-0.5">workout<br>streak</div>
                </div>
                <div class="bg-orange-50 rounded-xl p-2 text-center">
                  <div class="text-base font-bold text-orange-500">{{ state.calories.eaten }}</div>
                  <div class="text-[10px] text-gray-400 leading-tight mt-0.5">kcal<br>today</div>
                </div>
                <div class="bg-emerald-50 rounded-xl p-2 text-center">
                  <div class="text-base font-bold text-emerald-600">{{ state.streaks.diet.count }}</div>
                  <div class="text-[10px] text-gray-400 leading-tight mt-0.5">diet<br>streak</div>
                </div>
              </div>
            </div>
            <!-- Tabbed right panel card -->
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
              <!-- Underline tab bar -->
              <div class="flex border-b border-gray-100 px-2">
                <button
                  v-for="tab in [
                    { id: 'diet',     label: 'Diet' },
                    { id: 'meals',    label: 'Meals' },
                    { id: 'calories', label: 'Cals' },
                    { id: 'protein',  label: 'Protein' },
                  ]"
                  :key="tab.id"
                  @click="activeRightTab = tab.id"
                  :class="activeRightTab === tab.id
                    ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold'
                    : 'border-b-2 border-transparent text-gray-400 hover:text-gray-600'"
                  class="flex-1 text-xs py-2.5 px-1 transition-colors -mb-px cursor-pointer"
                >{{ tab.label }}</button>
              </div>
              <!-- Tab content -->
              <div v-show="activeRightTab === 'diet'"><DietHabits /></div>
              <div v-show="activeRightTab === 'meals'"><MealLogger /></div>
              <div v-show="activeRightTab === 'calories'"><CaloriesTracker /></div>
              <div v-show="activeRightTab === 'protein'"><ProteinCounter /></div>
            </div>
          </div>

        </div>
      </main>
    </div>

    <ToastNotification />
    <EvolutionModal />
    <WeeklyReportModal />

    <!-- Reset confirmation modal -->
    <div
      v-if="showResetModal"
      class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      @click.self="showResetModal = false"
    >
      <div class="bg-white rounded-2xl p-6 shadow-lg max-w-sm w-full mx-4">
        <h2 class="font-medium text-gray-800 mb-2">Reset everything?</h2>
        <p class="text-sm text-gray-500 mb-6">This will erase all your progress, workouts, and data. This cannot be undone.</p>
        <div class="flex gap-3 justify-end">
          <button @click="showResetModal = false" class="bg-indigo-50 text-indigo-600 rounded-xl px-5 py-2 text-sm font-medium hover:bg-indigo-100 transition-colors cursor-pointer">Cancel</button>
          <button @click="handleReset" class="bg-red-100 text-red-600 rounded-xl px-5 py-2 text-sm font-medium hover:bg-red-200 transition-colors cursor-pointer">Reset</button>
        </div>
      </div>
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
import TodayProgress from './components/TodayProgress.vue'
import MealLogger from './components/MealLogger.vue'

import StatsPanel from './components/StatsPanel.vue'
import ProgressDashboard from './components/ProgressDashboard.vue'
import ReminderSettings from './components/ReminderSettings.vue'
import WeeklyReportModal from './components/WeeklyReportModal.vue'
import { state } from './store/state.js'
import { resetState } from './store/persistence.js'
import { checkDayRollover } from './utils/dates.js'
import { scheduleReminder } from './utils/reminder.js'
import { canLogRestDay, logRestDay, getRestDaysThisWeek } from './utils/restDay.js'
import { showWeeklyReport, getThisMonday } from './utils/weeklyReport.js'

const restDaysThisWeek = computed(() => getRestDaysThisWeek(state.restDays))
const restDayAllowed = computed(() => canLogRestDay(state))

const workoutSessionCounts = computed(() => {
  const counts = {}
  for (const wt of state.workoutTypes) counts[wt.name] = 0
  for (const w of state.workouts) {
    if (w.type in counts) counts[w.type]++
  }
  return counts
})
const maxWorkoutSessions = computed(() =>
  Math.max(...state.workoutTypes.map(wt => workoutSessionCounts.value[wt.name] ?? 0), 1)
)
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
const railExpanded = ref(false)
const showResetModal = ref(false)

function handleReset() {
  resetState(state)
  showResetModal.value = false
}
</script>
