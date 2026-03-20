<script setup>
import { ref, computed } from 'vue'
import { selectedDate } from '../composables/useSelectedDate.js'
import { todayStr } from '../utils/dates.js'

const props = defineProps({
  workoutSets:     { type: Array, default: () => [] },
  workoutSessions: { type: Array, default: () => [] },
})

const today = todayStr()
const viewYear  = ref(Number(today.slice(0, 4)))
const viewMonth = ref(Number(today.slice(5, 7)) - 1)

function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
  else viewMonth.value--
}
function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
  else viewMonth.value++
}

const monthLabel = computed(() =>
  new Date(viewYear.value, viewMonth.value, 1)
    .toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
)

const days = computed(() => {
  const year = viewYear.value, month = viewMonth.value
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7
  const total = new Date(year, month + 1, 0).getDate()
  const cells = Array(startOffset).fill(null)
  for (let d = 1; d <= total; d++) {
    cells.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
  }
  return cells
})

const datesWithActivity = computed(() => {
  const s = new Set()
  for (const ws of props.workoutSets) if (ws.date) s.add(ws.date)
  for (const ws of props.workoutSessions) if (ws.date) s.add(ws.date)
  return s
})

function select(d) { if (d) selectedDate.value = d }
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-3 mb-3">
    <!-- Month nav -->
    <div class="flex items-center justify-between mb-2">
      <button @click="prevMonth" class="p-1 rounded hover:bg-gray-50 text-gray-400 hover:text-gray-700 cursor-pointer transition-colors" aria-label="Previous month">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>
      </button>
      <span class="text-[11px] font-semibold text-gray-500 tracking-wide uppercase">{{ monthLabel }}</span>
      <button @click="nextMonth" class="p-1 rounded hover:bg-gray-50 text-gray-400 hover:text-gray-700 cursor-pointer transition-colors" aria-label="Next month">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
      </button>
    </div>

    <!-- Day headers -->
    <div class="grid grid-cols-7 mb-1">
      <div v-for="h in ['M','T','W','T','F','S','S']" :key="h + Math.random()"
        class="text-center text-[9px] font-bold text-gray-300 uppercase tracking-wider pb-0.5">{{ h }}</div>
    </div>

    <!-- Date grid -->
    <div class="grid grid-cols-7 gap-y-0.5">
      <div v-for="(dateStr, idx) in days" :key="idx"
        @click="select(dateStr)"
        :class="[
          'relative flex flex-col items-center justify-center rounded-full h-7 w-7 mx-auto text-[11px] transition-all',
          dateStr ? 'cursor-pointer' : '',
          dateStr === selectedDate ? 'bg-indigo-600 text-white font-bold shadow-sm' :
          dateStr === today ? 'bg-indigo-50 text-indigo-600 font-semibold hover:bg-indigo-100' :
          dateStr ? 'text-gray-500 hover:bg-gray-50' : '',
        ]"
      >
        <span v-if="dateStr">{{ Number(dateStr.slice(8)) }}</span>
        <span v-if="dateStr && datesWithActivity.has(dateStr)"
          class="absolute bottom-0.5 w-1 h-1 rounded-full"
          :class="dateStr === selectedDate ? 'bg-white/60' : 'bg-indigo-400'"
        />
      </div>
    </div>

    <!-- Selected label -->
    <p class="text-center text-[10px] text-gray-400 mt-2">
      <span class="text-indigo-500 font-medium">
        {{ new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) }}
      </span>
      <span v-if="selectedDate === today" class="text-gray-300"> · Today</span>
    </p>
  </div>
</template>
