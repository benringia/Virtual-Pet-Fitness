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
  return hrs > 0 ? `${hrs}h ${mins}m until reset` : `${mins}m until reset`
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
  <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

    <!-- Header + toggle row -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-xs text-indigo-400 uppercase tracking-wider font-medium">Daily Reset</p>
        <h2 class="text-base font-semibold text-gray-800 mt-0.5">Reminder</h2>
      </div>
      <button
        @click="onToggle"
        role="switch"
        :aria-checked="state.reminder.enabled"
        aria-label="Enable daily reminder"
        :class="state.reminder.enabled ? 'bg-indigo-500' : 'bg-gray-200'"
        class="relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-indigo-400 cursor-pointer"
      >
        <span
          :class="state.reminder.enabled ? 'translate-x-5' : 'translate-x-0.5'"
          class="inline-block h-5 w-5 mt-0.5 rounded-full bg-white shadow transition-transform"
        />
      </button>
    </div>

    <!-- Enabled state -->
    <div v-if="state.reminder.enabled" class="space-y-3">

      <!-- Time input -->
      <input
        v-model="state.reminder.time"
        type="time"
        aria-label="Reminder time"
        class="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3 text-gray-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-shadow"
      />

      <!-- Countdown block -->
      <div v-if="state.currentDate !== null" class="bg-indigo-50 rounded-xl px-4 py-3">
        <p class="text-xs text-gray-400 mb-0.5">Until daily reset</p>
        <p class="text-lg font-bold text-gray-800">{{ resetCountdown }}</p>
      </div>

      <p class="text-xs text-gray-400">We'll remind you to log before the day resets</p>

      <button
        v-if="permission === 'default'"
        @click="onRequestPermission"
        class="w-full text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl py-2.5 transition-colors cursor-pointer font-medium"
      >
        Allow notifications
      </button>

      <p v-if="permission === 'denied'" class="text-xs text-red-400">
        Notifications blocked. Enable in browser settings.
      </p>

    </div>

    <!-- Disabled state hint -->
    <p v-else class="text-xs text-gray-400">Enable to get a daily log reminder</p>

  </div>
</template>
