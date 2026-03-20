import { ref } from 'vue'
import { todayStr } from '../utils/dates.js'

export const selectedDate = ref(todayStr())
