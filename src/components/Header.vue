<template>
  <header class="sticky top-0 z-10 bg-white border-b border-indigo-100">
    <div class="px-4 lg:px-6 py-3 flex items-center justify-between">

      <!-- Left: Petfit logo -->
      <div class="flex items-center shrink-0">
        <svg width="120" viewBox="0 0 340 90" xmlns="http://www.w3.org/2000/svg" aria-label="Petfit">
          <g transform="translate(10, 5)">
            <circle cx="35" cy="18" r="10" fill="#6366f1"/>
            <circle cx="62" cy="18" r="10" fill="#6366f1"/>
            <circle cx="14" cy="30" r="8" fill="#6366f1"/>
            <circle cx="83" cy="30" r="8" fill="#6366f1"/>
            <circle cx="48" cy="52" r="32" fill="#a5b4fc"/>
            <circle cx="38" cy="46" r="6" fill="#6366f1"/>
            <circle cx="58" cy="46" r="6" fill="#6366f1"/>
            <circle cx="48" cy="62" r="6" fill="#6366f1"/>
            <text x="105" y="52" font-family="sans-serif" font-weight="600" font-size="46" fill="#6366f1">Petfit</text>
            <text x="107" y="70" font-family="sans-serif" font-weight="400" font-size="11" fill="#6366f1" letter-spacing="3">STAY FIT. EVOLVE.</text>
          </g>
        </svg>
      </div>

      <!-- Right: day counter -->
      <div v-if="state.startDate" class="text-xs text-gray-400 whitespace-nowrap">day {{ dayCount }}</div>

    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { state } from '../store/state.js'
import { daysBetween, getTodayDate } from '../utils/dates.js'

const dayCount = computed(() => state.startDate ? daysBetween(state.startDate, getTodayDate()) + 1 : 1)
</script>
