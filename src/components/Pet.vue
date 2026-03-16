<template>
  <!-- Pet display card -->
  <div class="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
    <div class="relative bg-linear-to-b from-pink-100 to-white px-4 pt-4 pb-6 flex flex-col items-center min-h-40">
      <!-- Motivational pill -->
      <div class="absolute top-3 right-3 bg-white border border-pink-200 rounded-full px-3 py-1 text-xs text-pink-400">
        every step counts! 🌸
      </div>

      <!-- Pet emoji -->
      <div class="text-8xl select-none mt-4" :class="animClass">{{ stageEmoji }}</div>

      <!-- Mood overlay badge -->
      <div v-if="moodOverlay" class="mt-2 text-2xl">{{ moodOverlay }}</div>
    </div>

    <!-- XP bar -->
    <div class="px-4 pb-3">
      <div class="flex justify-between text-xs text-gray-400 mb-1">
        <span>xp to next level</span>
        <span>{{ xpProgress }} / {{ XP_PER_LEVEL }}</span>
      </div>
      <div class="w-full bg-pink-100 rounded-full h-1.5">
        <div
          class="bg-pink-400 h-1.5 rounded-full transition-all duration-500"
          :style="{ width: xpPct + '%' }"
        />
      </div>
    </div>
  </div>

  <!-- Stats bubbles row -->
  <div class="flex justify-between gap-2 mb-4">
    <!-- Level -->
    <div class="flex-1 bg-white rounded-2xl shadow-sm py-2 text-center">
      <div class="text-base font-bold text-pink-500">{{ state.level }}</div>
      <div class="text-xs text-gray-400 uppercase tracking-wide">level</div>
    </div>
    <!-- Per-type session counts -->
    <div
      v-for="(meta, type) in WORKOUT_META"
      :key="type"
      class="flex-1 bg-white rounded-2xl shadow-sm py-2 text-center"
    >
      <div class="text-base font-bold text-gray-700">{{ sessionCounts[type] }}</div>
      <div class="text-xs text-gray-400 uppercase tracking-wide">{{ meta.abbr }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { state } from '../store/state.js'
import { getStageFromLevel, WORKOUT_META, XP_PER_LEVEL } from '../utils/xp.js'
import { mood } from '../utils/pet.js'

const STAGE_EMOJI = { Egg: '🥚', Pup: '🐶', Blossom: '🌸', Fighter: '🥷', Queen: '👸' }
const MOOD_OVERLAY = { idle: '', happy: '😊', excited: '✨', diet: '🥗', workout: '💪' }
const MOOD_ANIM = { idle: '', happy: 'animate-bounce', excited: 'animate-bounce', diet: 'animate-pulse', workout: 'animate-bounce' }

const stage = computed(() => getStageFromLevel(state.level))
const stageEmoji = computed(() => STAGE_EMOJI[stage.value])
const moodOverlay = computed(() => MOOD_OVERLAY[mood.value])
const animClass = computed(() => MOOD_ANIM[mood.value])

const xpProgress = computed(() => state.xp % XP_PER_LEVEL)
const xpPct = computed(() => (xpProgress.value / XP_PER_LEVEL) * 100)

const sessionCounts = computed(() => {
  const counts = { Strength: 0, Walking: 0, Boxing: 0, Tennis: 0 }
  for (const w of state.workouts) {
    if (w.type in counts) counts[w.type]++
  }
  return counts
})
</script>
