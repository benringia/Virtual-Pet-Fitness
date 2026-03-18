const STORAGE_KEY = 'flarepup-v5'

const defaultState = {
  petName: "Petfit",
  startDate: localDateStr(),
  currentDate: localDateStr(),
  xp: 0,
  level: 1,
  workouts: [],
  dietHabits: {},
  calories: { eaten: 0, burned: 0, burnedManual: [], goal: 2000, date: null },
  streaks: {
    workout: { count: 0, lastDate: null },
    diet: { count: 0, lastDate: null },
    deficit: { count: 0, lastDate: null },
  },
  calHistory: [],
  weightLog: [],
  weightGoal: null,
  weightUnit: 'kg',
  meals: [],
  proteinActivityLevel: 'active',
  petMood: 'idle',
  reminder: { enabled: false, time: '20:00' },
  restDays: [],
  todayIsRestDay: false,
  lastWeeklyReportShown: null,
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

function localDateStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function resetState(state) {
  import('../utils/achievements.js').then(({ clearShownToday }) => clearShownToday())
  const today = localDateStr()
  console.log('[resetState] before:', JSON.stringify({
    meals: state.meals?.length,
    'calories.eaten': state.calories?.eaten,
    'calories.burned': state.calories?.burned,
    'calories.burnedManual': state.calories?.burnedManual,
    weightLog: state.weightLog?.length,
    weightGoal: state.weightGoal,
    xp: state.xp,
    level: state.level,
  }))
  Object.assign(state, {
    petName: 'Flarepup',
    startDate: today,
    currentDate: today,
    xp: 0,
    level: 1,
    workouts: [],
    dietHabits: {},
    calories: { eaten: 0, burned: 0, burnedManual: [], goal: 2000, date: today },
    streaks: {
      workout: { count: 0, lastDate: null },
      diet: { count: 0, lastDate: null },
      deficit: { count: 0, lastDate: null },
    },
    calHistory: [],
    weightLog: [],
    weightGoal: null,
    weightUnit: 'kg',
    meals: [],
    restDays: [],
    todayIsRestDay: false,
  })
  saveState(state)
  console.log('[resetState] after:', JSON.stringify({
    meals: state.meals?.length,
    'calories.eaten': state.calories?.eaten,
    'calories.burned': state.calories?.burned,
    'calories.burnedManual': state.calories?.burnedManual,
    weightLog: state.weightLog?.length,
    weightGoal: state.weightGoal,
    xp: state.xp,
    level: state.level,
  }))
}

let debounceTimer = null
export function debouncedSave(state) {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => saveState(state), 600)
}
