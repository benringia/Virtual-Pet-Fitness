import { todayStr } from './dates.js'
import { addXP } from './xp.js'
import { updateWorkoutStreak } from './streaks.js'
import { computeMood } from './mood.js'

function getWeekStart() {
  const d = new Date()
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  d.setHours(0, 0, 0, 0)
  return d
}

export function getRestDaysThisWeek(restDays) {
  const weekStart = getWeekStart()
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)
  return restDays.filter(dateStr => {
    const [y, m, d] = dateStr.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    return date >= weekStart && date < weekEnd
  }).length
}

export function canLogRestDay(state) {
  if (state.todayIsRestDay) return false
  if (getRestDaysThisWeek(state.restDays) >= 2) return false
  return true
}

export function logRestDay(state) {
  if (!canLogRestDay(state)) return
  state.restDays.push(todayStr())
  state.todayIsRestDay = true
  addXP(state, 8)
  updateWorkoutStreak(state)
  state.petMood = computeMood(state)
}
