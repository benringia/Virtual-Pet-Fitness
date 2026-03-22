<template>
  <!-- Pet display card -->
  <div class="bg-gradient-to-br from-white to-indigo-50/40 rounded-3xl border border-white shadow-xl shadow-indigo-100/50 p-4 md:p-6 mb-4">

    <!-- Row 1: Name/stage/level + mood bubble -->
    <div class="flex justify-between items-start mb-2">
      <!-- Left: name + stage + level -->
      <div class="flex flex-col">
        <div class="group flex items-center gap-1">
          <template v-if="!editing">
            <span class="text-base font-bold text-indigo-700 leading-tight capitalize">{{ state.petName }}</span>
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
              class="text-base font-bold text-indigo-700 bg-transparent border-b border-indigo-400 focus:outline-none w-32 leading-tight"
            />
          </template>
        </div>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-xs font-semibold uppercase tracking-widest text-indigo-400">{{ stage }}</span>
          <span class="bg-indigo-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">lvl {{ state.level }}</span>
        </div>
      </div>

      <!-- Right: mood bubble -->
      <div class="bubble-float max-w-35 shrink-0 ml-2">
        <Transition name="mood-fade" mode="out-in">
          <div :key="state.petMood" class="bg-white rounded-xl border border-indigo-100 shadow-sm p-2">
            <span class="text-xs font-medium text-indigo-500">{{ moodMessage }}</span>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Row 2: Pet emoji -->
    <div class="flex flex-col items-center my-4">
      <div class="relative flex items-center justify-center">
        <span v-if="nearEvolution" class="sparkle absolute text-base" style="top:-4px;left:-4px;animation-delay:0s">✨</span>
        <span v-if="nearEvolution" class="sparkle absolute text-base" style="top:-4px;right:-4px;animation-delay:0.25s">✨</span>
        <span v-if="nearEvolution" class="sparkle absolute text-base" style="bottom:-4px;left:-4px;animation-delay:0.5s">✨</span>
        <span v-if="nearEvolution" class="sparkle absolute text-base" style="bottom:-4px;right:-4px;animation-delay:0.75s">✨</span>
        <div class="text-7xl select-none" :class="nearEvolution ? 'bounce' : animClass">{{ stageEmoji }}</div>
      </div>
      <div v-if="moodOverlay" class="mt-1 text-2xl">{{ moodOverlay }}</div>
    </div>

    <!-- Row 3: XP bar -->
    <div>
      <div class="flex justify-between text-xs text-gray-400 mb-1.5">
        <span>xp to next level</span>
        <span class="font-semibold text-indigo-500">{{ xpProgress }} / {{ XP_PER_LEVEL }}</span>
      </div>
      <div class="w-full bg-indigo-100 rounded-full h-3 overflow-hidden">
        <div
          class="h-3 rounded-full transition-all duration-500 bg-linear-to-r from-indigo-400 to-indigo-600"
          :style="{ width: xpPct + '%' }"
        />
      </div>
      <div class="text-right text-[10px] text-indigo-400 mt-1">{{ Math.round(xpPct) }}%</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, nextTick, watch } from 'vue'
import { state } from '../store/state.js'
import { getStageFromLevel, XP_PER_LEVEL } from '../utils/xp.js'
import { mood } from '../utils/pet.js'
import { MOOD_MESSAGES } from '../utils/mood.js'
import { triggerEvolution } from '../utils/achievements.js'

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

const xpIntoLevel = computed(() => state.xp % XP_PER_LEVEL)
const evolutionLevels = [3, 6, 10, 15]
const nearEvolution = computed(() => {
  const nextEvolution = evolutionLevels.find(l => l > state.level)
  return nextEvolution && state.level === nextEvolution - 1 && xpIntoLevel.value >= 75
})

const moodMessage = computed(() =>
  nearEvolution.value
    ? 'i can feel it... almost there! ✨'
    : (MOOD_MESSAGES[state.petMood] ?? MOOD_MESSAGES.idle)
)

const stage = computed(() => getStageFromLevel(state.level))
const stageEmoji = computed(() => STAGE_EMOJI[stage.value])
const moodOverlay = computed(() => MOOD_OVERLAY[mood.value])
const animClass = computed(() => MOOD_ANIM[mood.value])

const xpProgress = xpIntoLevel
const xpPct = computed(() => (xpIntoLevel.value / XP_PER_LEVEL) * 100)

watch(() => state.level, (newLevel, oldLevel) => {
  const newStage = getStageFromLevel(newLevel)
  const oldStage = getStageFromLevel(oldLevel)
  if (newStage !== oldStage) triggerEvolution(oldStage, newStage)
})

</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
}
.bubble-float {
  animation: float 1.6s ease-in-out infinite;
}


@keyframes bounce-pet {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.bounce { animation: bounce-pet 0.8s ease-in-out infinite; }

@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.2); }
}
.sparkle { animation: sparkle 1s ease-in-out infinite; }

.mood-fade-enter-active,
.mood-fade-leave-active {
  transition: opacity 0.5s ease;
}
.mood-fade-enter-from,
.mood-fade-leave-to {
  opacity: 0;
}
</style>
