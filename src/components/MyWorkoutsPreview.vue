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
  <section class="bg-gradient-to-br from-white to-indigo-50/40 rounded-3xl border border-white shadow-xl shadow-indigo-100/50 p-4 md:p-6">
    <div class="mb-5">
      <h3 class="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-1">
        <span class="relative flex h-8 w-8 items-center justify-center bg-orange-100 rounded-full text-lg shadow-sm">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-20"></span>
          ⚡
        </span>
        Daily Training
      </h3>
      <p class="text-sm text-slate-400 ml-10">Track your progress for today</p>
    </div>

    <!-- Mobile: horizontal snap carousel | Desktop: vertical list -->
    <div class="flex flex-row overflow-x-auto gap-3 pb-2 snap-x scrollbar-hide -mx-4 px-4 md:flex-col md:gap-2.5 md:mx-0 md:px-0 md:overflow-x-visible md:pb-0">
      <div v-for="cat in categoryStatus" :key="cat.id"
        @click="navigateToCategory(cat.id)"
        class="w-40 flex-shrink-0 snap-start bg-white rounded-2xl border border-slate-100 p-3 shadow-sm hover:shadow-md hover:border-orange-100 transition-all cursor-pointer group flex flex-col items-center text-center
               md:w-full md:flex-row md:justify-between md:text-left md:items-center md:shadow-sm md:border-slate-50">

        <!-- Top/Left: Icon & Info Container -->
        <div class="flex flex-col items-center gap-2 md:flex-row md:gap-3">
          <!-- Icon -->
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-2xl transition-transform group-hover:scale-110 shadow-sm"
               :class="cat.isComplete ? cat.bg : 'bg-slate-50'">
            {{ cat.emoji }}
          </div>
          
          <!-- Text Info -->
          <div>
            <p class="text-sm font-bold text-slate-800 truncate">{{ cat.label }}</p>
            <div class="flex items-center justify-center md:justify-start gap-1.5 mt-0.5">
              <span class="px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded text-[9px] font-bold">+XP</span>
              <p v-if="cat.isComplete" class="text-[9px] text-emerald-600 font-black whitespace-nowrap uppercase tracking-wider">Logged</p>
              <p v-else class="text-[9px] text-slate-400 whitespace-nowrap uppercase tracking-wider">Pending</p>
            </div>
          </div>
        </div>

        <!-- Bottom/Right: Action CTA -->
        <div class="w-full mt-3 md:mt-0 md:w-auto">
          <button v-if="!cat.isComplete"
            class="w-full md:w-auto bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl py-1.5 px-3 text-[10px] font-black uppercase tracking-widest shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent transition-all">
            + Log
          </button>
          <div v-else class="flex justify-center md:justify-end text-emerald-500 bg-emerald-50 w-8 h-8 rounded-full items-center shadow-inner">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
