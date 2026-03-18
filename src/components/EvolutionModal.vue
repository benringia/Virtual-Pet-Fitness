<script setup>
import { evolutionEvent, dismissEvolution } from '../utils/achievements.js'

const CONFETTI_COLORS = [
  'bg-indigo-400', 'bg-pink-400', 'bg-amber-400', 'bg-emerald-400',
  'bg-blue-400', 'bg-purple-400', 'bg-red-400', 'bg-yellow-400',
  'bg-cyan-400', 'bg-rose-400', 'bg-lime-400', 'bg-fuchsia-400',
]
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="evolutionEvent"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
        @click.self="dismissEvolution"
      >
        <div class="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center relative overflow-hidden">
          <!-- Confetti particles -->
          <span
            v-for="(color, i) in CONFETTI_COLORS"
            :key="i"
            class="confetti absolute w-2 h-2 rounded-sm"
            :class="color"
            :style="`left:${8 + i * 7}%;animation-delay:${i * 0.12}s`"
            aria-hidden="true"
          />

          <div class="text-8xl mb-4 relative z-10">{{ evolutionEvent.emoji }}</div>
          <h2 class="text-2xl font-bold text-indigo-700 mb-2 relative z-10">{{ evolutionEvent.stage }}</h2>
          <p class="text-sm text-gray-500 mb-6 relative z-10">{{ evolutionEvent.message }}</p>
          <button
            @click="dismissEvolution"
            class="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-3 rounded-full transition-colors relative z-10"
          >
            Let's go! 🚀
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
@keyframes confetti-fall {
  0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(320px) rotate(720deg); opacity: 0; }
}
.confetti {
  animation: confetti-fall 2.5s ease-in infinite;
  top: -8px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
