import { updateDeficitStreak, resetExpiredStreaks } from './streaks.js'

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function isSameDay(a, b) {
  return a === b
}

export function checkDayRollover(state) {
  const today = todayStr()
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
