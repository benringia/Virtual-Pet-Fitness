<script setup>
import { ref } from 'vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

const emit = defineEmits(['save'])

const name     = ref('')
const selected = ref(null)

const PET_OPTIONS = [
  { id: 'core',  label: 'Core Bot',  src: '/pets/core.lottie' },
  { id: 'anima', label: 'Anima Bot', src: '/pets/anima.lottie' },
  { id: 'dance', label: 'Dance Bot', src: '/pets/dance.lottie' },
]

function handleSubmit() {
  const trimmed = name.value.trim()
  if (!trimmed || !selected.value) return
  emit('save', { name: trimmed, petType: selected.value })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div class="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center">
          <div class="text-6xl mb-4">🐾</div>
          <h2 class="text-2xl font-bold text-indigo-700 mb-2">Welcome to Petfit</h2>
          <p class="text-sm text-gray-500 mb-6">Name your pet and choose its type</p>

          <input
            v-model="name"
            type="text"
            maxlength="20"
            placeholder="e.g. Flarepup"
            @keyup.enter="handleSubmit"
            class="w-full border border-indigo-200 rounded-xl px-4 py-3 text-center text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
          />

          <!-- Pet type picker -->
          <div class="grid grid-cols-3 gap-3 mb-6">
            <button
              v-for="opt in PET_OPTIONS"
              :key="opt.id"
              type="button"
              @click="selected = opt.id"
              :class="selected === opt.id
                ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-400 shadow-md'
                : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'"
              class="flex flex-col items-center p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:scale-105"
            >
              <DotLottieVue :src="opt.src" autoplay loop class="w-16 h-16" />
              <span class="text-xs font-semibold mt-1 text-gray-700">{{ opt.label }}</span>
            </button>
          </div>

          <button
            @click="handleSubmit"
            :disabled="!name.trim() || !selected"
            class="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            Start Journey 🚀
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }
</style>
