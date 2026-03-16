import { todayStr } from './dates.js'

function dateMinus1(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

function advanceStreakForDate(streak, date) {
  if (streak.lastDate === date) return
  streak.count = streak.lastDate === dateMinus1(date) ? streak.count + 1 : 1
  streak.lastDate = date
}

export function resetExpiredStreaks(state) {
  const yesterday = dateMinus1(todayStr())
  for (const streak of Object.values(state.streaks)) {
    if (streak.lastDate && streak.lastDate < yesterday) streak.count = 0
  }
}

export function updateWorkoutStreak(state) {
  advanceStreakForDate(state.streaks.workout, todayStr())
}

export function updateDietStreak(state) {
  const todayHabits = state.dietHabits[todayStr()] ?? {}
  const KEYS = ['water', 'veggies', 'protein', 'noJunk', 'balanced']
  if (KEYS.every(k => todayHabits[k])) advanceStreakForDate(state.streaks.diet, todayStr())
}

export function updateDeficitStreak(state, date, eaten, burned, goal) {
  if (eaten - burned < goal) advanceStreakForDate(state.streaks.deficit, date)
}
