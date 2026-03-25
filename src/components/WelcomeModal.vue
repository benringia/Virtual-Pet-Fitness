<script setup>
import { ref } from 'vue'

const emit = defineEmits(['save'])

const name = ref('')

function handleSubmit() {
  const trimmed = name.value.trim()
  if (!trimmed) return
  emit('save', trimmed)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div class="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center">
          <div class="text-6xl mb-4">🐾</div>
          <h2 class="text-2xl font-bold text-indigo-700 mb-2">Welcome to Petfit</h2>
          <p class="text-sm text-gray-500 mb-6">Give your pet a name to get started</p>

          <input
            v-model="name"
            type="text"
            maxlength="20"
            placeholder="e.g. Flarepup"
            @keyup.enter="handleSubmit"
            class="w-full border border-indigo-200 rounded-xl px-4 py-3 text-center text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
          />

          <button
            @click="handleSubmit"
            :disabled="!name.trim()"
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
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
