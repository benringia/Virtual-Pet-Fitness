import { todayStr } from './dates.js'
import { addXP, WEIGHT_LOG_XP, WEIGHT_STREAK_BONUS_XP } from './xp.js'

export function getWeightStreak(weightLog) {
  if (!weightLog?.length) return 0

  const dateSet = new Set(weightLog.map(e => e.date))
  let streak = 0
  let cursor = new Date(todayStr())

  while (true) {
    const dateKey = cursor.toISOString().slice(0, 10)
    if (!dateSet.has(dateKey)) break
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export function logWeight(state, weight) {
  if (!weight || weight <= 0) return

  const today = todayStr()
  const existing = state.weightLog.find(e => e.date === today)

  if (existing) {
    existing.weight = weight
    existing.unit = state.weightUnit
  } else {
    state.weightLog.push({ date: today, weight, unit: state.weightUnit })
    addXP(state, WEIGHT_LOG_XP)

    const streak = getWeightStreak(state.weightLog)
    if (streak === 7) addXP(state, WEIGHT_STREAK_BONUS_XP)
  }
}
