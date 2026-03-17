<template>
  <header class="sticky top-0 z-10 bg-pink-50/95 backdrop-blur-sm border-b border-pink-100">
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-3">

      <!-- Desktop: single row 3-zone grid -->
      <!-- Mobile row 1: logo + pet info -->
      <div class="flex items-center justify-between lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-4">

        <!-- Left: Petfit logo -->
        <div class="flex items-center">
          <svg width="160" viewBox="0 0 340 90" xmlns="http://www.w3.org/2000/svg" aria-label="Petfit">
            <g transform="translate(10, 5)">
              <circle cx="35" cy="18" r="10" fill="#ec4899"/>
              <circle cx="62" cy="18" r="10" fill="#ec4899"/>
              <circle cx="14" cy="30" r="8" fill="#ec4899"/>
              <circle cx="83" cy="30" r="8" fill="#ec4899"/>
              <circle cx="48" cy="52" r="32" fill="#f9a8d4"/>
              <circle cx="38" cy="46" r="6" fill="#ec4899"/>
              <circle cx="58" cy="46" r="6" fill="#ec4899"/>
              <circle cx="48" cy="62" r="6" fill="#ec4899"/>
              <text x="105" y="52" font-family="sans-serif" font-weight="600" font-size="46" fill="#ec4899">Petfit</text>
              <text x="107" y="70" font-family="sans-serif" font-weight="400" font-size="11" fill="#ec4899" letter-spacing="3">STAY FIT. EVOLVE.</text>
            </g>
          </svg>
        </div>

        <!-- Center: tab switcher — hidden on mobile row 1, shown on desktop -->
        <nav class="hidden lg:flex justify-center gap-2" aria-label="View switcher">
          <button
            @click="emit('update:modelValue', 'tracker')"
            :class="modelValue === 'tracker' ? 'bg-pink-400 text-white' : 'text-gray-400 hover:bg-pink-100 border border-pink-200'"
            class="rounded-full px-4 py-1.5 text-xs font-semibold transition-colors"
          >Tracker</button>
          <button
            @click="emit('update:modelValue', 'progress')"
            :class="modelValue === 'progress' ? 'bg-pink-400 text-white' : 'text-gray-400 hover:bg-pink-100 border border-pink-200'"
            class="rounded-full px-4 py-1.5 text-xs font-semibold transition-colors"
          >Progress</button>
        </nav>

        <!-- Right: pet info -->
        <div class="flex items-center gap-2">
          <!-- Pet name (editable) + stage -->
          <div class="flex items-center gap-1">
            <template v-if="!editing">
              <span class="text-xs font-bold tracking-widest text-gray-500 uppercase">
                {{ state.petName }} · {{ stage }}
              </span>
              <button @click="startEdit" aria-label="Rename pet" class="text-gray-400 hover:text-pink-400 transition-colors text-xs leading-none">✏️</button>
            </template>
            <template v-else>
              <input
                ref="inputEl"
                v-model="editValue"
                maxlength="20"
                @keyup.enter="saveEdit"
                @blur="saveEdit"
                class="text-xs font-bold tracking-widest text-gray-500 uppercase bg-transparent border-b border-pink-300 focus:outline-none w-28"
              />
              <span class="text-xs font-bold tracking-widest text-gray-500 uppercase">· {{ stage }}</span>
            </template>
          </div>
          <!-- Level badge -->
          <span class="border border-pink-300 text-pink-500 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap">
            lvl {{ state.level }}
          </span>
          <!-- Day counter -->
          <span v-if="state.startDate" class="text-xs text-gray-400 whitespace-nowrap">day {{ dayCount }}</span>
        </div>

      </div>

      <!-- Mobile row 2: tab switcher -->
      <nav class="flex gap-2 mt-2 lg:hidden" aria-label="View switcher">
        <button
          @click="emit('update:modelValue', 'tracker')"
          :class="modelValue === 'tracker' ? 'bg-pink-400 text-white' : 'text-gray-400 hover:bg-pink-100 border border-pink-200'"
          class="rounded-full px-4 py-1.5 text-xs font-semibold transition-colors"
        >Tracker</button>
        <button
          @click="emit('update:modelValue', 'progress')"
          :class="modelValue === 'progress' ? 'bg-pink-400 text-white' : 'text-gray-400 hover:bg-pink-100 border border-pink-200'"
          class="rounded-full px-4 py-1.5 text-xs font-semibold transition-colors"
        >Progress</button>
      </nav>

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
