<script setup>
import { computed } from 'vue'
import { showWeeklyReport, buildWeeklyReport } from '../utils/weeklyReport.js'
import { state } from '../store/state.js'

const report = computed(() => buildWeeklyReport(state))

function close() {
  showWeeklyReport.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="showWeeklyReport"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
        @click.self="close"
      >
        <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full relative overflow-y-auto max-h-[90vh]">
          <!-- Header -->
          <div class="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-indigo-50">
            <button
              @click="close"
              class="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-xl leading-none"
              aria-label="Close"
            >✕</button>
            <h2 class="text-lg font-bold text-indigo-700">📊 Weekly Report</h2>
            <p class="text-xs text-gray-400 mt-0.5">{{ report.range.monday }} – {{ report.range.sunday }}</p>
          </div>

          <!-- Stats -->
          <div class="px-6 py-4 space-y-3">
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-500">🏋️ Workouts logged</span>
              <span class="font-semibold text-gray-700">{{ report.workoutDays }} / 7 days</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-500">🔥 Avg calorie deficit</span>
              <span class="font-semibold" :class="report.avgCalDeficit === null ? 'text-gray-300' : report.avgCalDeficit >= 0 ? 'text-green-500' : 'text-orange-400'">
                {{ report.avgCalDeficit === null ? '—' : (report.avgCalDeficit >= 0 ? '+' : '') + report.avgCalDeficit + ' kcal/day' }}
              </span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-500">🥩 Protein goal hit</span>
              <span class="font-semibold text-gray-700">
                {{ report.proteinGoalAvailable ? `${report.proteinGoalDays} / 7 days` : '—' }}
              </span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-500">🥦 Diet habits</span>
              <span class="font-semibold text-gray-700">{{ report.dietHabitsRate }}%</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-500">⭐ XP earned</span>
              <span class="font-semibold text-indigo-500">{{ report.xpEarned }} xp</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-500">🔥 Streaks</span>
              <span class="font-semibold text-gray-700 text-right text-xs leading-snug">
                💪 {{ report.streaks.workout }} · 🥗 {{ report.streaks.diet }} · 📉 {{ report.streaks.deficit }}
              </span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-500">🏆 Best day</span>
              <span class="font-semibold text-gray-700">{{ report.bestDay }}</span>
            </div>

            <!-- Summary -->
            <div class="mt-4 bg-indigo-50 rounded-2xl px-4 py-3 text-sm text-indigo-700 font-medium text-center">
              {{ report.summaryLine }}
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 pb-6 pt-2">
            <button
              @click="close"
              class="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-full transition-colors text-sm"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
