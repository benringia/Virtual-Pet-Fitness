const STORAGE_KEY = 'flarepup-v5'

const defaultState = {
  xp: 0,
  level: 1,
  workouts: [],
  dietHabits: {},
  calories: { eaten: 0, burned: 0, goal: 2000 },
  streaks: {
    workout: { count: 0, lastDate: null },
    diet: { count: 0, lastDate: null },
    deficit: { count: 0, lastDate: null },
  },
  calHistory: [],
}

export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaultState, ...JSON.parse(saved) } : { ...defaultState }
  } catch {
    return { ...defaultState }
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

let debounceTimer = null
export function debouncedSave(state) {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => saveState(state), 600)
}
