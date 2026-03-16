<template>
  <section class="mb-4 p-4 bg-white rounded shadow">
    <h2 class="font-semibold mb-3">Workout Logger</h2>

    <div class="flex flex-wrap gap-2 mb-3">
      <button
        v-for="type in WORKOUT_TYPES"
        :key="type"
        @click="selectedType = type"
        :class="[
          'px-3 py-1 rounded text-sm border',
          selectedType === type
            ? 'bg-indigo-600 text-white border-indigo-600'
            : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
        ]"
      >
        {{ type }}
      </button>
    </div>

    <div v-if="selectedType === 'Custom'" class="mb-3">
      <input
        v-model="customName"
        type="text"
        placeholder="Workout name…"
        class="w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-indigo-400"
      />
    </div>

    <button
      @click="logWorkout"
      :disabled="selectedType === 'Custom' && !customName.trim()"
      class="px-4 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-40"
    >
      Log Workout (+{{ WORKOUT_XP[selectedType] }} XP)
    </button>

    <ul v-if="recentWorkouts.length" class="mt-4 space-y-1">
      <li
        v-for="(w, i) in recentWorkouts"
        :key="i"
        class="flex items-center justify-between text-sm text-gray-700"
      >
        <span>{{ w.name }}</span>
        <span class="flex items-center gap-2 text-gray-400">
          <span class="text-indigo-500 font-medium">+{{ w.xp }} XP</span>
          {{ w.date }}
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { state } from '../store/state.js'
import { WORKOUT_TYPES, WORKOUT_XP, addXP } from '../utils/xp.js'
import { todayStr } from '../utils/dates.js'

const selectedType = ref('Strength')
const customName = ref('')

function logWorkout() {
  const name = selectedType.value === 'Custom' ? customName.value.trim() : selectedType.value
  const xp = WORKOUT_XP[selectedType.value]

  state.workouts.push({ type: selectedType.value, name, xp, date: todayStr() })
  addXP(state, xp)

  if (selectedType.value === 'Custom') customName.value = ''
}

const recentWorkouts = computed(() =>
  [...state.workouts].reverse().slice(0, 5)
)
</script>
