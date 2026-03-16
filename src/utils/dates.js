import { updateDeficitStreak, resetExpiredStreaks } from './streaks.js'

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function isSameDay(a, b) {
  return a === b
}

export function getTodayDate() {
  return todayStr()
}

export function isNewDay(lastDate) {
  return lastDate !== todayStr()
}

export function daysBetween(date1, date2) {
  if (!date1 || !date2) return 0
  const [y1, m1, d1] = date1.split('-').map(Number)
  const [y2, m2, d2] = date2.split('-').map(Number)
  const a = new Date(y1, m1 - 1, d1)
  const b = new Date(y2, m2 - 1, d2)
  return Math.round(Math.abs((b - a) / 86400000))
}

export function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function maybeSetStartDate(state) {
  if (!state.startDate) state.startDate = todayStr()
}

export function checkDayRollover(state) {
  const today = todayStr()
  state.currentDate = today
  if (state.calories.date === today) return

  if (state.calories.date) {
    state.calHistory.push({
      date: state.calories.date,
      eaten: state.calories.eaten,
      burned: state.calories.burned,
      goal: state.calories.goal,
    })
    if (state.calHistory.length > 60) state.calHistory.splice(0, state.calHistory.length - 60)
    updateDeficitStreak(state, state.calories.date, state.calories.eaten, state.calories.burned, state.calories.goal)
  }

  state.calories.eaten = 0
  state.calories.burned = 0
  state.calories.date = today
  resetExpiredStreaks(state)
}
