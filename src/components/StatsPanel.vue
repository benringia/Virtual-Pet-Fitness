<template>
  <div class="bg-gradient-to-br from-white to-indigo-50/40 rounded-3xl border border-white shadow-xl shadow-indigo-100/50 p-4 md:p-6">

    <!-- Header row -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-xs text-indigo-400 uppercase tracking-wider font-medium">Your Journey</p>
        <h2 class="text-xl font-bold text-gray-800 mt-0.5">{{ state.petName || 'Flarepup' }}</h2>
      </div>
      <div class="bg-indigo-50 rounded-xl p-2">
        <svg class="w-5 h-5" viewBox="10 8 96 86" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <g transform="translate(10, 5)">
            <circle cx="35" cy="18" r="10" fill="#6366f1"/>
            <circle cx="62" cy="18" r="10" fill="#6366f1"/>
            <circle cx="14" cy="30" r="8" fill="#6366f1"/>
            <circle cx="83" cy="30" r="8" fill="#6366f1"/>
            <circle cx="48" cy="52" r="32" fill="#a5b4fc"/>
            <circle cx="38" cy="46" r="6" fill="#6366f1"/>
            <circle cx="58" cy="46" r="6" fill="#6366f1"/>
            <circle cx="48" cy="62" r="6" fill="#6366f1"/>
          </g>
        </svg>
      </div>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="bg-indigo-50 rounded-xl p-3">
        <p class="text-xs text-gray-400">Day</p>
        <p class="text-2xl font-bold text-indigo-600">{{ dayNumber ?? '—' }}</p>
      </div>
      <div class="bg-indigo-50 rounded-xl p-3">
        <p class="text-xs text-gray-400">Streak</p>
        <p class="text-2xl font-bold text-indigo-600">{{ state.streaks.workout.count }}</p>
      </div>
    </div>

    <!-- 7-segment streak bar -->
    <div class="flex gap-1 mb-3" aria-hidden="true">
      <div
        v-for="i in 7"
        :key="i"
        :class="i <= Math.min(state.streaks.workout.count, 7) ? 'bg-indigo-500' : 'bg-indigo-100'"
        class="h-1.5 flex-1 rounded-full transition-colors"
      />
    </div>

    <!-- Start date -->
    <p v-if="formattedStart" class="text-xs text-gray-400">Started {{ formattedStart }}</p>
    <p v-else class="text-xs text-gray-400">Log your first activity to begin</p>

  </div>
  <slot />
</template>

<script setup>
import { computed } from 'vue'
import { state } from '../store/state.js'
import { getTodayDate, daysBetween, formatDate } from '../utils/dates.js'

const dayNumber = computed(() =>
  state.startDate ? daysBetween(state.startDate, getTodayDate()) + 1 : null
)
const formattedStart = computed(() =>
  state.startDate ? formatDate(state.startDate) : null
)
</script>
