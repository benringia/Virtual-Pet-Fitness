<script setup>
import { computed } from 'vue'

const props = defineProps({ level: Number, mood: String, celebrating: Boolean })

const lv        = computed(() => props.level ?? 1)
const showEyes  = computed(() => lv.value >= 3)
const showMouth = computed(() => lv.value >= 6)
const showBlush = computed(() => lv.value >= 6)
const showEars  = computed(() => lv.value >= 10)
const showGlow  = computed(() => lv.value >= 15)

const bodyColor = computed(() => {
  if (lv.value >= 15) return '#a78bfa'
  if (lv.value >= 10) return '#fbbf24'
  if (lv.value >= 6)  return '#fcd34d'
  return '#fde68a'
})

const MOUTH = {
  happy:  'M80 120 Q100 140 120 120',
  sad:    'M80 135 Q100 115 120 135',
  strong: 'M80 120 Q100 125 120 120',
  idle:   'M85 120 Q100 130 115 120',
}
const mouthPath = computed(() => MOUTH[props.mood] || MOUTH.idle)
</script>

<template>
  <svg viewBox="0 0 200 200" class="w-40 h-40 pet-idle pointer-events-none select-none"
    :class="{ 'pet-levelup': celebrating }">

    <ellipse cx="100" cy="170" rx="40" ry="10" fill="rgba(0,0,0,0.1)" />

    <ellipse v-if="showGlow" cx="100" cy="110" rx="60" ry="70"
      fill="rgba(99,102,241,0.15)" />

    <!-- Ears (level >= 10) -->
    <g v-if="showEars">
      <ellipse cx="65" cy="60" rx="12" ry="18" :fill="bodyColor" transform="rotate(-15 65 60)" />
      <ellipse cx="135" cy="60" rx="12" ry="18" :fill="bodyColor" transform="rotate(15 135 60)" />
    </g>

    <path d="M100 40 C140 40 155 80 145 120 C135 150 65 150 55 120 C45 80 60 40 100 40 Z"
      :fill="bodyColor" />

    <g v-if="showEyes">
      <circle cx="80"  cy="95" r="8" fill="#1f2937"/>
      <circle cx="120" cy="95" r="8" fill="#1f2937"/>
      <circle cx="83"  cy="92" r="3" fill="white"/>
      <circle cx="123" cy="92" r="3" fill="white"/>
    </g>

    <g v-if="showBlush">
      <circle cx="65"  cy="110" r="5" fill="#fca5a5" opacity="0.5"/>
      <circle cx="135" cy="110" r="5" fill="#fca5a5" opacity="0.5"/>
    </g>

    <path v-if="showMouth" :d="mouthPath"
      stroke="#1f2937" stroke-width="3" stroke-linecap="round" fill="none" />
  </svg>
</template>

<style scoped>
@keyframes pet-float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
}
.pet-idle {
  animation: pet-float 3s ease-in-out infinite;
  transform-origin: center bottom;
}

@keyframes pet-levelup {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.1); }
}
.pet-levelup {
  animation: pet-levelup 0.55s ease-in-out 3;
}
</style>
