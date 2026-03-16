<template>
  <section class="mb-4 p-4 bg-white rounded shadow">
    <h2 class="font-semibold mb-3">Calories Tracker</h2>

    <div class="grid grid-cols-3 gap-3 mb-4">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Eaten</label>
        <input
          type="number" min="0"
          :value="state.calories.eaten"
          @change="state.calories.eaten = +$event.target.value"
          class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-400"
        />
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">Burned</label>
        <input
          type="number" min="0"
          :value="state.calories.burned"
          @change="state.calories.burned = +$event.target.value"
          class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-400"
        />
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">Goal</label>
        <input
          type="number" min="0"
          :value="state.calories.goal"
          @change="state.calories.goal = +$event.target.value"
          class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-400"
        />
      </div>
    </div>

    <div class="text-sm font-medium" :class="isDeficit ? 'text-green-600' : 'text-red-500'">
      {{ isDeficit ? 'Deficit' : 'Surplus' }}:
      {{ Math.abs(balance) }} kcal
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { state } from '../store/state.js'

const balance = computed(() =>
  state.calories.goal - (state.calories.eaten - state.calories.burned)
)

const isDeficit = computed(() => balance.value > 0)
</script>
