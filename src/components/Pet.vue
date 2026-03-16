<template>
  <section class="mb-4 p-4 bg-white rounded shadow text-center">
    <p class="text-4xl">🥚</p>
    <p class="text-sm text-gray-500 mt-1">{{ stage }} · Level {{ state.level }}</p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { state } from '../store/state.js'
import { getStageFromLevel } from '../utils/xp.js'

const stage = computed(() => getStageFromLevel(state.level))
</script>
