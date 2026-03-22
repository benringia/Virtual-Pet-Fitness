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

const resetCountdownShort = computed(() => {
  const total = minsUntilReset.value
  const hrs = Math.floor(total / 60)
  const mins = total % 60
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`
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
  <div class="bg-gradient-to-br from-white to-indigo-50/40 rounded-3xl border border-white shadow-xl shadow-indigo-100/50 p-4 md:p-6 flex flex-col">

    <!-- Header + toggle row -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-[10px] md:text-xs text-indigo-400 uppercase tracking-widest font-bold">Daily Reset</p>
        <h2 class="text-sm md:text-base font-bold text-gray-800 tracking-tight">Reminder</h2>
      </div>
      <button
        @click="onToggle"
        role="switch"
        :aria-checked="state.reminder.enabled"
        aria-label="Enable daily reminder"
        :class="state.reminder.enabled ? 'bg-indigo-500' : 'bg-gray-200'"
        class="relative inline-flex h-5 w-9 md:h-6 md:w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-indigo-400 cursor-pointer"
      >
        <span
          :class="state.reminder.enabled ? 'translate-x-4 md:translate-x-5' : 'translate-x-0.5'"
          class="inline-block h-4 w-4 md:h-5 md:w-5 mt-0.5 rounded-full bg-white shadow transition-transform"
        />
      </button>
    </div>

    <!-- Enabled state: Layered centered design -->
    <div v-if="state.reminder.enabled" class="flex flex-col items-center">
      <!-- Time input centered -->
      <div class="relative w-32 mx-auto">
        <input
          v-model="state.reminder.time"
          type="time"
          aria-label="Reminder time"
          class="w-full bg-white/60 backdrop-blur-sm border border-indigo-100 rounded-2xl px-3 py-2 text-center text-xl font-black text-gray-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
        />
      </div>

      <!-- Countdown Badge -->
      <div v-if="state.currentDate !== null" class="mt-3 px-3 py-1 bg-indigo-50/80 rounded-full text-[10px] font-bold text-indigo-600 flex items-center gap-1 justify-center whitespace-nowrap">
        <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        {{ resetCountdown }}
      </div>

      <button
        v-if="permission === 'default'"
        @click="onRequestPermission"
        class="w-full mt-4 text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl py-2 transition-colors cursor-pointer font-bold"
      >
        Allow Notifications
      </button>

      <p v-if="permission === 'denied'" class="mt-3 text-[10px] text-red-500 font-medium">
        Notifications blocked
      </p>

      <p class="mt-4 text-[9px] text-gray-400 text-center leading-tight">We'll remind you to log before the day resets</p>
    </div>

    <!-- Disabled state hint -->
    <div v-else class="flex-1 flex items-center justify-center py-4">
      <p class="text-[10px] text-gray-400 font-medium text-center">Enable to receive a daily tracking reminder</p>
    </div>
  </div>
</template>
