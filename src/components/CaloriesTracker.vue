<template>
  <div class="bg-white rounded-2xl shadow-sm mb-4 px-4 py-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h2 class="font-semibold text-gray-700">🔥 Calorie deficit</h2>
      <span class="bg-orange-100 text-orange-500 rounded-full px-2.5 py-0.5 text-xs font-medium">
        {{ state.streaks.deficit.count }} day streak
      </span>
    </div>

    <!-- Daily goal row -->
    <div class="flex items-center justify-between mb-4 text-sm text-gray-500">
      <span>daily goal:</span>
      <div class="flex items-center gap-2">
        <input
          type="number" min="0" step="100"
          :value="state.calories.goal"
          @change="state.calories.goal = +$event.target.value"
          class="w-20 text-center font-semibold text-gray-700 border-b border-gray-200 focus:outline-none focus:border-pink-300 bg-transparent"
        />
        <span class="text-xs text-gray-400">kcal target</span>
      </div>
    </div>

    <!-- Eaten / Burned inputs -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-xs text-gray-400 uppercase tracking-widest mb-1">Calories Eaten</label>
        <div class="flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2">
          <input
            type="number" min="0"
            :value="state.calories.eaten"
            @change="state.calories.eaten = +$event.target.value"
            class="text-xl font-bold text-gray-600 w-full bg-transparent focus:outline-none"
            placeholder="e.g. 1400"
          />
          <div class="flex flex-col gap-0.5 shrink-0">
            <button @click="state.calories.eaten += 50" class="text-gray-400 hover:text-pink-400 leading-none text-xs">▲</button>
            <button @click="state.calories.eaten = Math.max(0, state.calories.eaten - 50)" class="text-gray-400 hover:text-pink-400 leading-none text-xs">▼</button>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-xs text-gray-400 uppercase tracking-widest mb-1">Calories Burned</label>
        <div class="flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2">
          <input
            type="number" min="0"
            :value="state.calories.burned"
            @change="state.calories.burned = +$event.target.value"
            class="text-xl font-bold text-gray-600 w-full bg-transparent focus:outline-none"
            placeholder="e.g. 300"
          />
          <div class="flex flex-col gap-0.5 shrink-0">
            <button @click="state.calories.burned += 50" class="text-gray-400 hover:text-pink-400 leading-none text-xs">▲</button>
            <button @click="state.calories.burned = Math.max(0, state.calories.burned - 50)" class="text-gray-400 hover:text-pink-400 leading-none text-xs">▼</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Log button -->
    <button
      @click="logCalories"
      class="w-full py-2.5 rounded-full border border-pink-300 text-pink-500 text-sm font-medium hover:bg-pink-50 transition-all duration-150"
      :class="logged ? 'scale-95 bg-pink-100 border-pink-400' : ''"
    >
      {{ logged ? '✓ logged!' : "log today's calories 🔥" }}
    </button>

    <!-- Balance display -->
    <div
      v-if="state.calories.eaten > 0"
      class="text-center mt-2 text-xs font-medium"
      :class="isDeficit ? 'text-green-500' : 'text-red-400'"
    >
      {{ isDeficit ? 'deficit' : 'surplus' }}: {{ Math.abs(balance) }} kcal
    </div>

    <p class="text-center text-xs text-gray-300 mt-2">resets daily · be honest with yourself, queen 💜</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { state } from '../store/state.js'
import { setMood } from '../utils/pet.js'
import { updateDeficitStreak } from '../utils/streaks.js'
import { todayStr } from '../utils/dates.js'

const balance = computed(() =>
  state.calories.goal - (state.calories.eaten - state.calories.burned)
)
const isDeficit = computed(() => balance.value > 0)
const logged = ref(false)

function logCalories() {
  updateDeficitStreak(state, todayStr(), state.calories.eaten, state.calories.burned, state.calories.goal)
  setMood(isDeficit.value ? 'happy' : 'diet')
  logged.value = true
  setTimeout(() => { logged.value = false }, 1200)
}
</script>
