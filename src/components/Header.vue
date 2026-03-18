<template>
  <header class="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-indigo-100">
    <div class="px-4 lg:px-6 py-3 flex items-center justify-between">

      <!-- Left: Petfit logo -->
      <div class="flex items-center shrink-0">
        <svg width="120" viewBox="0 0 340 90" xmlns="http://www.w3.org/2000/svg" aria-label="Petfit">
          <g transform="translate(10, 5)">
            <circle cx="35" cy="18" r="10" fill="#6366f1"/>
            <circle cx="62" cy="18" r="10" fill="#6366f1"/>
            <circle cx="14" cy="30" r="8" fill="#6366f1"/>
            <circle cx="83" cy="30" r="8" fill="#6366f1"/>
            <circle cx="48" cy="52" r="32" fill="#a5b4fc"/>
            <circle cx="38" cy="46" r="6" fill="#6366f1"/>
            <circle cx="58" cy="46" r="6" fill="#6366f1"/>
            <circle cx="48" cy="62" r="6" fill="#6366f1"/>
            <text x="105" y="52" font-family="sans-serif" font-weight="600" font-size="46" fill="#6366f1">Petfit</text>
            <text x="107" y="70" font-family="sans-serif" font-weight="400" font-size="11" fill="#6366f1" letter-spacing="3">STAY FIT. EVOLVE.</text>
          </g>
        </svg>
      </div>

      <!-- Right: pet info -->
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1">
          <template v-if="!editing">
            <span class="text-xs font-bold tracking-widest text-gray-500 uppercase">
              {{ state.petName }} · {{ stage }}
            </span>
            <button @click="startEdit" aria-label="Rename pet" class="text-gray-400 hover:text-indigo-400 transition-colors text-xs leading-none">✏️</button>
          </template>
          <template v-else>
            <input
              ref="inputEl"
              v-model="editValue"
              maxlength="20"
              @keyup.enter="saveEdit"
              @blur="saveEdit"
              class="text-xs font-bold tracking-widest text-gray-500 uppercase bg-transparent border-b border-indigo-300 focus:outline-none w-28"
            />
            <span class="text-xs font-bold tracking-widest text-gray-500 uppercase">· {{ stage }}</span>
          </template>
        </div>
        <span class="border border-indigo-300 text-indigo-500 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap">
          lvl {{ state.level }}
        </span>
        <span v-if="state.startDate" class="text-xs text-gray-400 whitespace-nowrap hidden sm:inline">day {{ dayCount }}</span>
      </div>

    </div>
  </header>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue'
import { state } from '../store/state.js'
import { getStageFromLevel } from '../utils/xp.js'
import { daysBetween, getTodayDate } from '../utils/dates.js'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const stage = computed(() => getStageFromLevel(state.level))
const dayCount = computed(() => state.startDate ? daysBetween(state.startDate, getTodayDate()) + 1 : 1)

const editing = ref(false)
const editValue = ref('')
const inputEl = ref(null)

function startEdit() {
  editValue.value = state.petName
  editing.value = true
  nextTick(() => inputEl.value?.focus())
}

function saveEdit() {
  const trimmed = editValue.value.trim()
  state.petName = trimmed || state.petName
  editing.value = false
}
</script>
