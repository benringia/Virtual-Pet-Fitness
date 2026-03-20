<template>
  <div class="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm border border-slate-100 relative">
    
    <!-- Top-Right Speech Bubble -->
    <Transition name="bubble-fade">
      <div v-if="message" 
        class="absolute -top-3 -right-2 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md z-10 whitespace-nowrap after:content-[''] after:absolute after:top-full after:right-6 after:-mt-[1px] after:border-4 after:border-transparent after:border-t-indigo-600 tracking-wide">
        {{ message }}
      </div>
    </Transition>

    <!-- Left: Pet Avatar -->
    <div 
      class="w-20 h-20 shrink-0 rounded-full flex items-center justify-center bg-indigo-50 text-4xl transition-transform duration-300"
      :class="isCelebrating ? 'animate-bounce' : ''">
      <span class="select-none">{{ stageEmoji }}</span>
    </div>

    <!-- Right: Name, Level, XP Bar -->
    <div class="flex-1 min-w-0 pr-2">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-sm font-bold text-gray-800 capitalize truncate">{{ state.petName || 'Flarepup' }}</span>
        <span class="shrink-0 bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Lvl {{ state.level }}</span>
      </div>
      <div class="w-full h-2.5 bg-indigo-100/50 rounded-full overflow-hidden mt-1.5">
        <div class="h-full bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.6)] transition-all duration-500 ease-out" 
             :style="{ width: xpPct + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { state } from '../store/state.js'
import { getStageFromLevel, XP_PER_LEVEL } from '../utils/xp.js'

const props = defineProps({
  isCelebrating: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  }
})

const STAGE_EMOJI = { Egg: '🥚', Pup: '🐶', Blossom: '🌸', Fighter: '🥷', Queen: '👸' }
const stage = computed(() => getStageFromLevel(state.level))
const stageEmoji = computed(() => STAGE_EMOJI[stage.value] || '🐾')

const xpIntoLevel = computed(() => state.xp % XP_PER_LEVEL)
const xpPct = computed(() => Math.min((xpIntoLevel.value / XP_PER_LEVEL) * 100, 100))
</script>

<style scoped>
.bubble-fade-enter-active,
.bubble-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.bubble-fade-enter-from,
.bubble-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
