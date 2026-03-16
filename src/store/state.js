import { reactive, watch } from 'vue'
import { loadState, debouncedSave } from './persistence.js'

export const state = reactive(loadState())

watch(state, debouncedSave, { deep: true })
