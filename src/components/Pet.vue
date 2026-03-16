<template>
  <section class="mb-4 p-4 bg-white rounded shadow text-center">
    <div class="relative inline-block">
      <div class="text-8xl select-none" :class="animClass">{{ stageEmoji }}</div>
      <div v-if="moodOverlay" class="absolute -top-2 -right-2 text-3xl">{{ moodOverlay }}</div>
    </div>
    <p class="text-sm font-semibold mt-3 capitalize text-indigo-600">{{ stage }}</p>
    <p class="text-xs text-gray-400">Level {{ state.level }} · {{ moodLabel }}</p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { state } from '../store/state.js'
import { getStageFromLevel } from '../utils/xp.js'
import { mood } from '../utils/pet.js'

const STAGE_EMOJI = {
  Egg:     '🥚',
  Pup:     '🐶',
  Blossom: '🌸',
  Fighter: '🥷',
  Queen:   '👸',
}

const MOOD_OVERLAY = {
  idle:    '',
  happy:   '😊',
  excited: '✨',
  diet:    '🥗',
  workout: '💪',
}

const MOOD_LABEL = {
  idle:    'Resting…',
  happy:   'Happy!',
  excited: 'Excited!',
  diet:    'Eating well!',
  workout: 'Training!',
}

const MOOD_ANIM = {
  idle:    '',
  happy:   'animate-bounce',
  excited: 'animate-bounce',
  diet:    'animate-pulse',
  workout: 'animate-bounce',
}

const stage = computed(() => getStageFromLevel(state.level))
const stageEmoji = computed(() => STAGE_EMOJI[stage.value])
const moodOverlay = computed(() => MOOD_OVERLAY[mood.value])
const moodLabel = computed(() => MOOD_LABEL[mood.value])
const animClass = computed(() => MOOD_ANIM[mood.value])
</script>
