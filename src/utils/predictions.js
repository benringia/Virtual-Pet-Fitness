import { todayStr } from './dates.js'
import { getLevelFromXP, DIET_HABIT_XP } from './xp.js'

const WINDOW = 7

function cutoffDate() {
  const d = new Date(todayStr() + 'T00:00:00')
  d.setDate(d.getDate() - WINDOW)
  return d.toISOString().slice(0, 10)
}

export function computePredictions(state) {
  const cutoff = cutoffDate()

  // Workouts in window
  const recentWorkouts = state.workouts.filter(w => w.date >= cutoff && w.date < todayStr())
  const avgWorkouts = recentWorkouts.length / WINDOW

  // Workout XP in window
  const workoutXP = recentWorkouts.reduce((sum, w) => sum + w.xp, 0)

  // Diet XP in window
  const dietXP = Object.entries(state.dietHabits)
    .filter(([date]) => date >= cutoff && date < todayStr())
    .reduce((sum, [, habits]) => {
      const checked = Object.values(habits).filter(Boolean).length
      return sum + checked * DIET_HABIT_XP
    }, 0)

  const avgXP = (workoutXP + dietXP) / WINDOW

  // Calorie history in window
  const recentCal = state.calHistory.filter(d => d.date >= cutoff)
  const avgCalories = recentCal.length > 0
    ? recentCal.reduce((sum, d) => sum + d.eaten, 0) / recentCal.length
    : null

  const hasData = recentWorkouts.length > 0 || recentCal.length > 0

  if (!hasData) return { calories30d: null, workouts30d: null, xp30d: null, projectedLevel: null }

  const xp30d = Math.round(avgXP * 30)

  return {
    calories30d: avgCalories !== null ? Math.round(avgCalories * 30) : null,
    workouts30d: Math.round(avgWorkouts * 30),
    xp30d,
    projectedLevel: getLevelFromXP(state.xp + xp30d),
  }
}
