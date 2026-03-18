<script setup>
import { watch, onUnmounted } from 'vue'
import { notifications } from '../utils/achievements.js'

const timers = new Map()

watch(
  () => [...notifications],
  (newList) => {
    for (const n of newList) {
      if (!timers.has(n.id)) {
        const tid = setTimeout(() => dismiss(n.id), 4000)
        timers.set(n.id, tid)
      }
    }
  },
  { deep: false }
)

function dismiss(id) {
  clearTimeout(timers.get(id))
  timers.delete(id)
  const idx = notifications.findIndex(n => n.id === id)
  if (idx !== -1) notifications.splice(idx, 1)
}

onUnmounted(() => {
  for (const tid of timers.values()) clearTimeout(tid)
  timers.clear()
})
</script>

<template>
  <div class="fixed bottom-6 right-4 z-50 flex flex-col gap-2 pointer-events-none" aria-live="polite">
    <TransitionGroup name="toast-slide">
      <div
        v-for="n in notifications"
        :key="n.id"
        class="pointer-events-auto flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-lg border border-indigo-100 border-l-4 min-w-64 max-w-xs"
        :class="n.borderColor"
        role="status"
      >
        <span class="text-xl shrink-0">{{ n.emoji }}</span>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold text-gray-700 leading-tight">{{ n.title }}</div>
          <div class="text-xs text-gray-400 leading-tight mt-0.5">{{ n.message }}</div>
        </div>
        <button
          @click="dismiss(n.id)"
          class="text-gray-300 hover:text-gray-500 text-lg leading-none shrink-0 transition-colors"
          aria-label="Dismiss notification"
        >×</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-slide-enter-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.toast-slide-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.toast-slide-enter-from {
  transform: translateX(110%);
  opacity: 0;
}
.toast-slide-leave-to {
  transform: translateX(110%);
  opacity: 0;
}
</style>
