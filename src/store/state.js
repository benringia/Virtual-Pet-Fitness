import { reactive, watch } from 'vue'
import { createDefaultState } from './defaultState.js'
import { debouncedSave } from './persistence.js'

export const state = reactive(createDefaultState())

watch(state, debouncedSave, { deep: true })
