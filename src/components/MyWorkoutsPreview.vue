<script setup>
import { computed } from 'vue'
import { state } from '../store/state.js'
import { activeView } from '../composables/useActiveView.js'

const todayStr = (() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
})()

const CATEGORIES = [
  { id: 'bodybuilding', label: 'Body Building', emoji: '🏋️', color: 'text-indigo-600', bg: 'bg-indigo-50/50' },
  { id: 'calisthenics', label: 'Calisthenics',  emoji: '🤸', color: 'text-orange-600', bg: 'bg-orange-50/50' },
  { id: 'cardio',       label: 'Cardio',        emoji: '🏃', color: 'text-rose-600',   bg: 'bg-rose-50/50' },
]

const categoryStatus = computed(() => {
  return CATEGORIES.map(cat => {
    const isComplete = state.workoutSessions.some(s => s.date === todayStr && s.category === cat.id)
    return { ...cat, isComplete }
  })
})

function navigateToCategory(catId) {
  state.trainingCategory = catId
  activeView.value = 'workouts'
}
</script>

<template>
  <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
    <div class="mb-6">
      <h3 class="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-1">
        <span class="text-2xl">⚡</span> Daily Training
      </h3>
      <p class="text-sm text-slate-400">Track your progress for today</p>
    </div>

    <div class="space-y-2">
      <div v-for="cat in categoryStatus" :key="cat.id"
        @click="navigateToCategory(cat.id)"
        class="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:shadow-md hover:border-slate-100 transition-all cursor-pointer group"
        :class="cat.isComplete ? cat.bg : 'bg-white'">
        
        <div class="flex items-center gap-3">
          <span class="text-xl">{{ cat.emoji }}</span>
          <div>
            <p class="text-[13px] font-semibold text-slate-700">{{ cat.label }}</p>
            <p v-if="cat.isComplete" class="text-[10px] text-emerald-600 font-medium">✅ Session Logged</p>
            <p v-else class="text-[10px] text-slate-400">No session yet today • +XP</p>
          </div>
        </div>

        <div v-if="!cat.isComplete" 
          class="text-[10px] font-bold text-indigo-500 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded-lg group-hover:bg-indigo-100 transition-colors">
          + Log
        </div>
        <div v-else class="text-emerald-500">
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

