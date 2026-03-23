import { todayStr } from './dates.js'
import { triggerAchievement } from './achievements.js'

const STREAK_MILESTONES = [7, 14, 30]
const STREAK_MESSAGES = { 7: 'One week of consistency', 14: 'Two weeks strong', 30: 'One month of dedication' }
const STREAK_EMOJIS   = { 7: '🔥', 14: '💫', 30: '👑' }

export function fireWorkoutToasts(state) {
  const sessionCount = (state.workoutSessions ?? []).length + (state.workouts ?? []).filter(w => w.type === 'Custom').length
  if (sessionCount === 1) {
    triggerAchievement('workout', '🏋️', 'First workout!', 'Your journey begins', 'workout-first')
  }
  const count = state.streaks.workout.count
  if (STREAK_MILESTONES.includes(count)) {
    triggerAchievement('streak', STREAK_EMOJIS[count], `${count}-day streak!`, STREAK_MESSAGES[count], `streak-${count}-workout-${todayStr()}`)
  }
}

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
