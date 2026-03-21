import { todayStr } from './dates.js'
import { XP_PER_LEVEL, DIET_HABITS } from './xp.js'

function cutoff(days) {
  const d = new Date(todayStr() + 'T00:00:00')
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

function confidenceLabel(daysOfData) {
  if (daysOfData < 7)  return 'low'
  if (daysOfData < 14) return 'medium'
  return 'high'
}

function computeCaloriePredictions(state) {
  const cutoff7 = cutoff(7)
  const today = todayStr()
  const entries = state.calHistory.filter(d => d.date >= cutoff7)

  // Include today's in-progress data if present (checkDayRollover ensures this is always today's)
  if (state.calories.eaten > 0 || state.calories.burned > 0) {
    entries.push({ date: today, eaten: state.calories.eaten, burned: state.calories.burned })
  }

  const daysOfData = entries.length
  if (daysOfData === 0) return { hasData: false }

  const totalDeficit = entries.reduce((sum, d) => sum + (d.burned - d.eaten), 0)
  const avgDailyDeficit = totalDeficit / daysOfData
  const projected30dDeficit = Math.round(avgDailyDeficit * 30)
  const weightChangeKg = Math.round((projected30dDeficit / 7716) * 10) / 10

  return {
    hasData: true,
    avgDailyDeficit: Math.round(avgDailyDeficit),
    projected30dDeficit,
    weightChangeKg,
    daysOfData,
    confidence: confidenceLabel(daysOfData),
  }
}

function computeWorkoutPredictions(state) {
  const cutoff14 = cutoff(14)
  const recent = state.workouts.filter(w => w.date >= cutoff14)
  const daysWithWorkouts = new Set(recent.map(w => w.date)).size

  if (recent.length === 0) return { hasData: false }

  const weeklyAvg = Math.round((recent.length / 2) * 10) / 10
  const projected30d = Math.round(weeklyAvg * 4.3)

  return {
    hasData: true,
    weeklyAvg,
    projected30d,
    daysOfData: daysWithWorkouts,
    confidence: confidenceLabel(daysWithWorkouts),
  }
}

function computeXpPredictions(state) {
  const cutoff14 = cutoff(14)

  // Build a map of date → xp for all dates in window
  const xpByDate = {}

  for (const w of state.workouts) {
    if (w.date >= cutoff14) {
      xpByDate[w.date] = (xpByDate[w.date] ?? 0) + w.xp
    }
  }

  for (const [date, habits] of Object.entries(state.dietHabits)) {
    if (date >= cutoff14) {
      const habitXp = DIET_HABITS.reduce((sum, h) => sum + (habits[h.key] ? h.xp : 0), 0)
      if (habitXp > 0) xpByDate[date] = (xpByDate[date] ?? 0) + habitXp
    }
  }

  const activeDates = Object.values(xpByDate).filter(xp => xp > 0)
  const daysWithXp = activeDates.length

  if (daysWithXp === 0) return { hasData: false }

  const totalXp = activeDates.reduce((sum, xp) => sum + xp, 0)
  const avgDailyXp = totalXp / daysWithXp
  const projected30d = Math.round(avgDailyXp * 30)
  const levelsGained = Math.floor(projected30d / XP_PER_LEVEL)
  const projectedLevel = state.level + levelsGained

  return {
    hasData: true,
    avgDailyXp: Math.round(avgDailyXp),
    projected30d,
    levelsGained,
    projectedLevel,
    daysOfData: daysWithXp,
    confidence: confidenceLabel(daysWithXp),
  }
}

export function computePredictions(state) {
  return {
    calories: computeCaloriePredictions(state),
    workouts: computeWorkoutPredictions(state),
    xp:       computeXpPredictions(state),
  }
}
