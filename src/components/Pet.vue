<template>
  <!-- Pet display card — immersive environment hero -->
  <div class="z-1 relative w-full rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.15)] border border-white/10 transition-transform duration-300 hover:scale-[1.0] mb-4">

    <!-- Background Image -->
    <img :key="currentEnvironment" :src="currentEnvironment" alt=""
      class="absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-500" />
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-linear-to-b from-black/30 via-black/20 to-black/40"></div>
    <!-- Glass Overlay -->
    <div class="absolute inset-0 backdrop-blur-[3px] bg-white/5"></div>

    <!-- Content -->
    <div class="relative z-10 p-5">

      <!-- Row 1: Name/stage/level + mood bubble -->
      <div class="flex justify-between items-start mb-2">
        <!-- Left: name + stage + level -->
        <div class="flex flex-col">
          <div class="group flex items-center gap-1">
            <template v-if="!editing">
              <span class="text-xl font-bold text-white leading-tight capitalize">{{ state.petName }}</span>
              <button
                @click="startEdit"
                aria-label="Rename pet"
                class="opacity-0 group-hover:opacity-100 cursor-pointer text-white/50 hover:text-white transition-opacity ml-1 text-sm leading-none"
              >✏️</button>
            </template>
            <template v-else>
              <input
                ref="inputEl"
                v-model="editValue"
                maxlength="20"
                @keyup.enter="saveEdit"
                @blur="saveEdit"
                class="text-base font-bold text-white bg-transparent border-b border-white/50 focus:outline-none w-32 leading-tight"
              />
            </template>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-xs font-semibold uppercase tracking-widest text-white/70">{{ stage }}</span>
            <span class="bg-linear-to-r from-cyan-400 to-blue-500 transition-all duration-500 animate-[glowPulse_2s_ease-in-out_infinite] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">lvl {{ state.level }}</span>
          </div>
        </div>

        <!-- Right: mood bubble -->
        <div class="bubble-float max-w-35 shrink-0 ml-2">
          <Transition name="mood-fade" mode="out-in">
            <div :key="state.petMood" class="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 p-2">
              <span class="text-xs font-medium text-white">{{ moodMessage }}</span>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Row 2: Pet (centered, no inner background — card handles it) -->
      <div class="flex flex-col items-center py-6">
        <div class="relative flex items-center justify-center">
          <span v-if="nearEvolution" class="sparkle absolute text-base" style="top:-4px;left:-4px;animation-delay:0s">✨</span>
          <span v-if="nearEvolution" class="sparkle absolute text-base" style="top:-4px;right:-4px;animation-delay:0.25s">✨</span>
          <span v-if="nearEvolution" class="sparkle absolute text-base" style="bottom:-4px;left:-4px;animation-delay:0.5s">✨</span>
          <span v-if="nearEvolution" class="sparkle absolute text-base" style="bottom:-4px;right:-4px;animation-delay:0.75s">✨</span>
          <DotLottieVue ref="lottieRef" :src="currentPetSrc" autoplay loop
            class="w-48 h-48 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]" />
        </div>
        <div v-if="moodOverlay" class="mt-1 text-2xl">{{ moodOverlay }}</div>
      </div>

      <!-- Row 3: XP bar (futuristic) -->
      <div class="mt-4">
        <div class="flex justify-between text-xs text-white/70 mb-1.5">
          <span>xp to next level</span>
          <span class="font-semibold text-white/80">{{ xpProgress }} / {{ XP_PER_LEVEL }}</span>
        </div>
        <div class="w-full h-2 rounded-full bg-black/30 backdrop-blur-sm overflow-hidden">
          <div
            class="h-full rounded-full bg-linear-to-r from-cyan-400 to-blue-500 transition-all duration-500 animate-[glowPulse_2s_ease-in-out_infinite]"
            :style="{ width: xpPct + '%' }"
          />
        </div>
        <div class="text-right text-[10px] text-white/50 mt-1">{{ Math.round(xpPct) }}%</div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref, nextTick, watch } from 'vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { state } from '../store/state.js'
import { getStageFromLevel, XP_PER_LEVEL } from '../utils/xp.js'
import { mood as petMoodRef } from '../utils/pet.js'
import { MOOD_MESSAGES } from '../utils/mood.js'
import { triggerEvolution } from '../utils/achievements.js'

const editing  = ref(false)
const editValue = ref('')
const inputEl  = ref(null)

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

// Mood overlay emoji (driven by pet.js mood ref)
const MOOD_OVERLAY = { idle: '', happy: '😊', excited: '✨', diet: '🥗', workout: '💪' }
const moodOverlay  = computed(() => MOOD_OVERLAY[petMoodRef.value])

const xpIntoLevel     = computed(() => state.xp % XP_PER_LEVEL)
const evolutionLevels = [3, 6, 10, 15]
const nearEvolution   = computed(() => {
  const next = evolutionLevels.find(l => l > state.level)
  return next && state.level === next - 1 && xpIntoLevel.value >= 75
})

const moodMessage = computed(() =>
  nearEvolution.value
    ? 'i can feel it... almost there! ✨'
    : (MOOD_MESSAGES[state.petMood] ?? MOOD_MESSAGES.idle)
)

const stage      = computed(() => getStageFromLevel(state.level))
const xpProgress = xpIntoLevel
const xpPct      = computed(() => (xpIntoLevel.value / XP_PER_LEVEL) * 100)

// ── Lottie pet ────────────────────────────────────────────────────────────────
const lottieRef = ref(null)

const PET_MAP = {
  core:  '/pets/core.lottie',
  anima: '/pets/anima.lottie',
  dance: '/pets/dance.lottie',
}

// ── Environment background ────────────────────────────────────────────────────
const ENV_MAP = {
  'dirty-room':   '/env/s1-dirty-room.png',
  'repair-bench': '/env/s2-repair-bench.png',
  'tech-lab':     '/env/s3-techlab-discovery.png',
  'gateway':      '/env/s4-advanced-workshop.png',
  'ai-core':      '/env/s5-transcendence.png',
}

function getEnvironment(level) {
  if (level >= 20) return 'ai-core'
  if (level >= 15) return 'gateway'
  if (level >= 10) return 'tech-lab'
  if (level >= 5)  return 'repair-bench'
  return 'dirty-room'
}

const currentEnvironment = computed(() => ENV_MAP[getEnvironment(state.level)])

const petType       = computed(() => state.petType || 'core')
const currentPetSrc = computed(() => PET_MAP[petType.value] || PET_MAP.core)

// Ensure playback resumes after a src swap (reactive :src auto-reloads,
// but an explicit play() call guards against edge cases)
watch(petType, async () => {
  await nextTick()
  lottieRef.value?.getDotLottieInstance()?.play()
})

// Future mood hook — placeholder for segment-based animation triggers
watch(() => state.petMood, () => {
  // e.g. lottieRef.value?.getDotLottieInstance()?.setMarker(state.petMood)
})

// Level-up: trigger evolution modal; no CSS pulse on canvas element
watch(() => state.level, (newLevel, oldLevel) => {
  const newStage = getStageFromLevel(newLevel)
  const oldStage = getStageFromLevel(oldLevel)
  if (newStage !== oldStage) triggerEvolution(oldStage, newStage)
})
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-4px); }
}
.bubble-float {
  animation: float 1.6s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50%       { opacity: 1; transform: scale(1.2); }
}
.sparkle { animation: sparkle 1s ease-in-out infinite; }

.mood-fade-enter-active,
.mood-fade-leave-active { transition: opacity 0.5s ease; }
.mood-fade-enter-from,
.mood-fade-leave-to     { opacity: 0; }

@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 10px rgba(34,211,238,0.6); }
  50%       { box-shadow: 0 0 20px rgba(34,211,238,1); }
}
</style>
