import { todayStr } from './dates.js'

export const MOOD_MESSAGES = {
  idle:    "come on, let's move! 😴",
  happy:   'feeling good today! 😊',
  excited: "we're on fire!! 🤩",
  strong:  'nothing can stop us! 💪',
  hungry:  'feed me something! 🍽️',
  tired:   'i missed you... 😓',
  sad:     "let's get back on track 😢",
  resting: 'taking it easy today 😴',
}

function getYesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

// Call BEFORE updateXStreak — returns true if any active streak is about to break
export function willStreakBreak(state) {
  const today = todayStr()
  const yesterday = getYesterday()
  return ['workout', 'diet', 'deficit'].some(key => {
    const s = state.streaks[key]
    return s.count > 0 && s.lastDate && s.lastDate !== today && s.lastDate !== yesterday
  })
}

export function computeMood(state, { streakBroke = false } = {}) {
  const today = todayStr()
  const yesterday = getYesterday()
  const hour = new Date().getHours()

  // excited: calorie goal hit, deficit achieved, OR streak milestone (7, 14, 30)
  const goalHit = state.calories.eaten > 0 && state.calories.eaten >= state.calories.goal
  const deficitHit = state.calories.burned > 0 && state.calories.burned > state.calories.eaten
  const streakMilestone = ['workout', 'diet', 'deficit'].some(k =>
    [7, 14, 30].includes(state.streaks[k].count)
  )
  if (goalHit || deficitHit || streakMilestone) return 'excited'

  // strong: worked out today
  if (state.workouts.some(w => w.date === today)) return 'strong'

  // happy: logged a meal OR checked a diet habit today
  const loggedMeal = state.meals.some(m => m.date === today)
  const checkedHabit = !!(state.dietHabits[today] &&
    Object.values(state.dietHabits[today]).some(Boolean))
  if (loggedMeal || checkedHabit) return 'happy'

  // sad: a streak just broke (checked before streak was updated by caller)
  if (streakBroke) return 'sad'

  // hungry: after 12pm and no meal logged today
  if (hour >= 12 && !loggedMeal) return 'hungry'

  // tired: no activity yesterday AND none today
  const activeYesterday =
    state.workouts.some(w => w.date === yesterday) ||
    state.meals.some(m => m.date === yesterday) ||
    !!(state.dietHabits[yesterday] && Object.values(state.dietHabits[yesterday]).some(Boolean))
  if (!activeYesterday) return 'tired'

  if (state.todayIsRestDay) return 'resting'
  return 'idle'
}
