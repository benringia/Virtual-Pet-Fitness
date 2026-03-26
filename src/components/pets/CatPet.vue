<script setup>
import { computed } from 'vue'

const props = defineProps({ level: Number, mood: String, celebrating: Boolean })

const lv        = computed(() => props.level ?? 1)
const showEyes  = computed(() => lv.value >= 3)
const showMouth = computed(() => lv.value >= 6)
const showBlush = computed(() => lv.value >= 6)
const showGlow  = computed(() => lv.value >= 15)

// Cool lavender/violet palette
const bodyColor = computed(() => {
  if (lv.value >= 15) return '#7c3aed'
  if (lv.value >= 10) return '#a78bfa'
  if (lv.value >= 6)  return '#c4b5fd'
  return '#ede9fe'
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
      fill="rgba(167,139,250,0.15)" />

    <!-- Pointed cat ears — always visible, rendered behind body -->
    <path d="M58 70 L48 38 L78 62 Z" :fill="bodyColor" />
    <path d="M142 70 L152 38 L122 62 Z" :fill="bodyColor" />
    <!-- Ear inner pink -->
    <path d="M61 66 L53 44 L75 62 Z" fill="#fda4af" opacity="0.6" />
    <path d="M139 66 L147 44 L125 62 Z" fill="#fda4af" opacity="0.6" />

    <!-- Body -->
    <path d="M100 40 C140 40 155 80 145 120 C135 150 65 150 55 120 C45 80 60 40 100 40 Z"
      :fill="bodyColor" />

    <!-- Cat eyes (slightly wider set, almond shaped) -->
    <g v-if="showEyes">
      <ellipse cx="78"  cy="93" rx="9" ry="7" fill="#1f2937" transform="rotate(-8 78 93)" />
      <ellipse cx="122" cy="93" rx="9" ry="7" fill="#1f2937" transform="rotate(8 122 93)" />
      <!-- Slit pupils -->
      <ellipse cx="78"  cy="93" rx="3" ry="5.5" fill="#0f172a" transform="rotate(-8 78 93)" />
      <ellipse cx="122" cy="93" rx="3" ry="5.5" fill="#0f172a" transform="rotate(8 122 93)" />
      <!-- Eye shine -->
      <circle cx="81" cy="90" r="2.5" fill="white" />
      <circle cx="125" cy="90" r="2.5" fill="white" />
    </g>

    <g v-if="showBlush">
      <circle cx="64"  cy="110" r="5" fill="#fca5a5" opacity="0.4"/>
      <circle cx="136" cy="110" r="5" fill="#fca5a5" opacity="0.4"/>
    </g>

    <!-- Whiskers (visible with face) -->
    <g v-if="showEyes" stroke="#1f2937" stroke-width="1" opacity="0.3">
      <line x1="55" y1="113" x2="88" y2="118" />
      <line x1="55" y1="120" x2="88" y2="120" />
      <line x1="145" y1="113" x2="112" y2="118" />
      <line x1="145" y1="120" x2="112" y2="120" />
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
