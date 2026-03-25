import { createDefaultState } from './defaultState.js'

let currentUserId = null

function getStorageKey(userId) {
  return userId ? `flarepup-v5-${userId}` : null
}

function reconcileWorkouts(state) {
  const sessions = state.workoutSessions ?? []
  if (!sessions.length) return
  const recorded = new Set(
    (state.workouts ?? []).filter(w => w.sessionId).map(w => w.sessionId)
  )
  for (const s of sessions) {
    if (!recorded.has(s.id)) {
      state.workouts.push({
        sessionId: s.id,
        type: s.category === 'cardio' ? 'Cardio' : 'Strength',
        name: s.label || 'Session',
        xp: 0,
        date: s.date,
      })
    }
  }
}

export function loadState(userId) {
  currentUserId = userId ?? null
  const key = getStorageKey(currentUserId)

  if (!key) {
    console.debug('[loadState] no userId — returning clean defaults (not persisted)')
    return createDefaultState()
  }

  try {
    const saved = localStorage.getItem(key)
    if (!saved) {
      console.debug('[loadState] NEW USER', currentUserId, '— initializing clean defaults')
      const fresh = createDefaultState()
      localStorage.setItem(key, JSON.stringify(fresh))
      return fresh
    }
    console.debug('[loadState] EXISTING USER', currentUserId, '— loading from', key)
    const state = { ...createDefaultState(), ...JSON.parse(saved) }
    reconcileWorkouts(state)
    return state
  } catch {
    console.warn('[loadState] parse error — falling back to defaults')
    return createDefaultState()
  }
}

export function reloadStateForUser(state, userId) {
  // Hard reset first — prevents stale in-memory fields surviving into new user's context
  Object.assign(state, createDefaultState())
  const fresh = loadState(userId)
  Object.assign(state, fresh)
}

export function saveState(state) {
  const key = getStorageKey(currentUserId)
  if (!key) return  // no user authenticated — do not write to localStorage
  localStorage.setItem(key, JSON.stringify(state))
}

function localDateStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function resetState(state) {
  import('../utils/achievements.js').then(({ clearShownToday }) => clearShownToday())
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
  const fresh = createDefaultState()
  // resetState sets today's date explicitly — override the factory's value
  const today = localDateStr()
  fresh.startDate = today
  fresh.currentDate = today
  fresh.calories.date = today
  fresh.petName = 'Flarepup'
  Object.assign(state, fresh)
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
