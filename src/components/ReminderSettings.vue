<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { state } from '../store/state.js'
import { requestPermission, scheduleReminder, cancelReminder } from '../utils/reminder.js'

const permission = ref(Notification.permission)

async function onToggle() {
  state.reminder.enabled = !state.reminder.enabled
  if (state.reminder.enabled) {
    if (permission.value === 'default') {
      const result = await requestPermission()
      permission.value = result
    }
    if (permission.value === 'granted') {
      scheduleReminder(state.reminder.time)
    } else {
      state.reminder.enabled = false
    }
  } else {
    cancelReminder()
  }
}

async function onRequestPermission() {
  const result = await requestPermission()
  permission.value = result
  if (result === 'granted' && state.reminder.enabled) {
    scheduleReminder(state.reminder.time)
  }
}

watch(() => state.reminder.time, (newTime) => {
  if (state.reminder.enabled && permission.value === 'granted') {
    scheduleReminder(newTime)
  }
})

function getMinsUntilMidnight() {
  const now = new Date()
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
  return Math.floor((midnight - now) / 60000)
}

const minsUntilReset = ref(getMinsUntilMidnight())

const resetCountdown = computed(() => {
  const total = minsUntilReset.value
  const hrs = Math.floor(total / 60)
  const mins = total % 60
  return hrs > 0 ? `${hrs} hrs ${mins} mins until reset` : `${mins} mins until reset`
})

let countdownInterval = null
onMounted(() => {
  countdownInterval = setInterval(() => {
    minsUntilReset.value = getMinsUntilMidnight()
  }, 60000)
})
onUnmounted(() => clearInterval(countdownInterval))
</script>

<template>
  <div class="mx-2 mb-3 bg-indigo-50 rounded-2xl px-4 py-3 border border-indigo-100">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-semibold text-indigo-700">Daily reminder</span>
      <button
        @click="onToggle"
        :class="state.reminder.enabled ? 'bg-indigo-500' : 'bg-gray-200'"
        class="relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
        role="switch"
        :aria-checked="state.reminder.enabled"
        aria-label="Enable daily reminder"
      >
        <span
          :class="state.reminder.enabled ? 'translate-x-4' : 'translate-x-0.5'"
          class="inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transition-transform"
        />
      </button>
    </div>

    <div v-if="state.reminder.enabled" class="mt-2 space-y-2">
      <input
        v-model="state.reminder.time"
        type="time"
        class="w-full text-xs rounded-xl border border-indigo-200 bg-white px-3 py-1.5 text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        aria-label="Reminder time"
      />

      <p class="text-xs text-indigo-400">We'll remind you to log before the day resets</p>
      <p v-if="state.currentDate !== null" class="text-xs text-indigo-300">{{ resetCountdown }}</p>

      <button
        v-if="permission === 'default'"
        @click="onRequestPermission"
        class="w-full text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl py-1.5 transition-colors"
      >
        Request notification permission
      </button>

      <p
        v-if="permission === 'denied'"
        class="text-xs text-red-400"
      >
        Notifications blocked. Enable them in your browser settings.
      </p>
    </div>
  </div>
</template>
