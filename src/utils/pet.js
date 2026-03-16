import { ref } from 'vue'

export const mood = ref('idle')
let timer = null

export function setMood(newMood, duration = 4000) {
  mood.value = newMood
  clearTimeout(timer)
  if (newMood !== 'idle') {
    timer = setTimeout(() => { mood.value = 'idle' }, duration)
  }
}
