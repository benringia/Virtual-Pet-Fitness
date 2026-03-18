<template>
  <!-- Pet display card -->
  <div class="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
    <div class="relative bg-linear-to-b from-indigo-100 to-indigo-50 px-4 pt-4 pb-6 flex flex-col items-center min-h-40">
      <!-- Motivational pill -->
      <div class="absolute top-3 right-3 bg-white border border-indigo-200 rounded-full px-3 py-1 text-xs text-indigo-400">
        every step counts! 🌸
      </div>

      <!-- Pet name / stage / level (top left) -->
      <div class="absolute top-3 left-3 flex flex-col bg-white rounded-2xl px-4 py-3 shadow-md border border-indigo-100">
        <!-- Name row -->
        <div class="group flex items-center gap-1">
          <template v-if="!editing">
            <span class="text-lg font-bold text-indigo-700 tracking-tight leading-tight">{{ state.petName }}</span>
            <button
              @click="startEdit"
              aria-label="Rename pet"
              class="opacity-0 group-hover:opacity-100 cursor-pointer text-indigo-300 hover:text-indigo-500 transition-opacity ml-1 text-sm leading-none"
            >✏️</button>
          </template>
          <template v-else>
            <input
              ref="inputEl"
              v-model="editValue"
              maxlength="20"
              @keyup.enter="saveEdit"
              @blur="saveEdit"
              class="text-lg font-bold text-indigo-700 tracking-tight bg-transparent border-b border-indigo-400 focus:outline-none w-32 leading-tight"
            />
          </template>
        </div>
        <!-- Stage + level row -->
        <div class="flex items-center gap-2 mt-1">
          <span class="text-xs font-semibold uppercase tracking-widest text-indigo-400">{{ stage }}</span>
          <span class="bg-indigo-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">lvl {{ state.level }}</span>
        </div>
      </div>

      <!-- Pet emoji -->
      <div class="text-9xl select-none mt-4" :class="animClass">{{ stageEmoji }}</div>

      <!-- Mood overlay badge -->
      <div v-if="moodOverlay" class="mt-2 text-2xl">{{ moodOverlay }}</div>
    </div>

    <!-- XP bar -->
    <div class="px-4 pb-3">
      <div class="flex justify-between text-xs text-gray-400 mb-1">
        <span>xp to next level</span>
        <span>{{ xpProgress }} / {{ XP_PER_LEVEL }}</span>
      </div>
      <div class="w-full bg-indigo-100 rounded-full h-1.5">
        <div
          class="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
          :style="{ width: xpPct + '%' }"
        />
      </div>
    </div>
  </div>

  <!-- Stats bubbles row -->
  <div class="flex justify-between gap-2 mb-4">
    <!-- Level -->
    <div class="flex-1 bg-white rounded-2xl shadow-sm py-2 text-center">
      <div class="text-base font-bold text-indigo-500">{{ state.level }}</div>
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
import { computed, ref, nextTick } from 'vue'
import { state } from '../store/state.js'
import { getStageFromLevel, WORKOUT_META, XP_PER_LEVEL } from '../utils/xp.js'
import { mood } from '../utils/pet.js'

const editing = ref(false)
const editValue = ref('')
const inputEl = ref(null)

function startEdit() {
  editValue.value = state.petName
  editing.value = true
  nextTick(() => inputEl.value?.focus())
}

function saveEdit() {
  const trimmed = editValue.value.trim()
  state.petName = trimmed || state.petName
  editing.value = false
}

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
