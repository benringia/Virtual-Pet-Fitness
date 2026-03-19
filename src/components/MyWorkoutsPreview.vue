<script setup>
import { computed } from 'vue'
import { state } from '../store/state.js'

const todayStr = (() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
})()

const structuredToday = computed(() =>
  state.workouts.filter(w =>
    w.date === todayStr &&
    w.type !== 'Custom' &&
    state.workoutTypes.some(wt => wt.name === w.type)
  )
)

const structuredXpToday = computed(() =>
  structuredToday.value.reduce((s, w) => s + (w.xp || 0), 0)
)

const activeTypesToday = computed(() => {
  const counts = {}
  for (const w of structuredToday.value) {
    counts[w.type] = (counts[w.type] || 0) + 1
  }
  return Object.entries(counts).map(([name, count]) => {
    const wt = state.workoutTypes.find(t => t.name === name)
    return { name, count, color: wt?.color ?? '#6366f1' }
  })
})

const activeSummary = computed(() => {
  const total = structuredToday.value.length
  return total === 0
    ? 'No sessions yet today'
    : `${total} session${total !== 1 ? 's' : ''} today`
})
</script>

<template>
  <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

    <!-- Header row -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-sm font-semibold text-gray-700">
          Structured Workouts
        </h3>
        <p class="text-xs text-gray-400 mt-0.5">
          {{ activeSummary }}
        </p>
      </div>
      <!-- XP badge -->
      <div v-if="structuredXpToday > 0"
        class="bg-indigo-50 rounded-xl px-3 py-1.5 text-center">
        <p class="text-xs text-indigo-400">XP today</p>
        <p class="text-sm font-bold text-indigo-600">
          +{{ structuredXpToday }}
        </p>
      </div>
    </div>

    <!-- Active types list -->
    <div v-if="activeTypesToday.length > 0"
      class="space-y-2 mb-4">
      <div
        v-for="item in activeTypesToday.slice(0, 3)"
        :key="item.name"
        class="flex items-center gap-2 text-xs text-gray-600"
      >
        <span class="w-2 h-2 rounded-full shrink-0"
          :style="{ backgroundColor: item.color }"/>
        <span>{{ item.name }}</span>
        <span class="text-gray-400 ml-auto">
          {{ item.count }} session{{ item.count !== 1 ? 's' : '' }}
        </span>
      </div>
      <p v-if="activeTypesToday.length > 3"
        class="text-[11px] text-gray-400 pl-4">
        + {{ activeTypesToday.length - 3 }} more
      </p>
    </div>

    <!-- Empty state -->
    <div v-else
      class="bg-indigo-50 rounded-xl p-3 mb-4 text-center">
      <p class="text-xs text-indigo-500">
        No structured workouts yet today
      </p>
      <p class="text-[11px] text-gray-400 mt-0.5">
        Log specific training for bonus XP
      </p>
    </div>

    <!-- CTA button -->
    <button
      class="w-full flex items-center justify-center gap-2
        py-2 rounded-xl border border-indigo-200
        text-indigo-500 text-xs font-medium
        hover:bg-indigo-50 transition-colors cursor-pointer"
    >
      View My Workouts
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </button>

  </section>
</template>
