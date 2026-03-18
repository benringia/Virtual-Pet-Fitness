import { ref } from 'vue'
import { DIET_HABITS, MEAL_LOG_XP, WEIGHT_LOG_XP } from './xp.js'

export const showWeeklyReport = ref(false)

const PROTEIN_MULTIPLIERS = { sedentary: 0.8, active: 1.6, athlete: 2.2 }

function toDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getMondayOf(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function getThisMonday() {
  return toDateStr(getMondayOf(new Date()))
}

export function getLastWeekRange() {
  const thisMonday = getMondayOf(new Date())
  const lastMonday = new Date(thisMonday)
  lastMonday.setDate(lastMonday.getDate() - 7)
  const lastSunday = new Date(lastMonday)
  lastSunday.setDate(lastSunday.getDate() + 6)
  return { monday: toDateStr(lastMonday), sunday: toDateStr(lastSunday) }
}

function datesInRange(monday, sunday) {
  const dates = []
  const cur = new Date(monday + 'T00:00:00')
  const end = new Date(sunday + 'T00:00:00')
  while (cur <= end) {
    dates.push(toDateStr(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('-').map(Number)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[m - 1]} ${d}`
}

export function buildWeeklyReport(state) {
  const { monday, sunday } = getLastWeekRange()
  const days = datesInRange(monday, sunday)
  const daySet = new Set(days)

  // Workouts: unique days with at least one workout
  const workoutDays = new Set(
    (state.workouts || []).filter(w => daySet.has(w.date)).map(w => w.date)
  ).size

  // Avg calorie deficit (burned - eaten per day)
  const calEntries = (state.calHistory || []).filter(e => daySet.has(e.date))
  const avgCalDeficit = calEntries.length
    ? Math.round(calEntries.reduce((sum, e) => sum + (e.burned - e.eaten), 0) / calEntries.length)
    : null

  // Protein goal days
  const latestWeight = (state.weightLog || []).slice(-1)[0]?.weight ?? null
  const multiplier = PROTEIN_MULTIPLIERS[state.proteinActivityLevel || 'active']
  const proteinGoal = latestWeight ? latestWeight * multiplier : null
  let proteinGoalDays = 0
  if (proteinGoal) {
    for (const date of days) {
      const dayProtein = (state.meals || [])
        .filter(m => m.date === date)
        .reduce((sum, m) => sum + (m.protein || 0), 0)
      if (dayProtein >= proteinGoal) proteinGoalDays++
    }
  }

  // Diet habits completion rate
  const habits = state.dietHabits || {}
  const habitKeys = DIET_HABITS.map(h => h.key)
  let totalHabitsPossible = 0
  let totalHabitsCompleted = 0
  for (const date of days) {
    if (habits[date]) {
      totalHabitsPossible += habitKeys.length
      totalHabitsCompleted += habitKeys.filter(k => habits[date][k]).length
    }
  }
  const dietHabitsRate = totalHabitsPossible > 0
    ? Math.round((totalHabitsCompleted / totalHabitsPossible) * 100)
    : 0

  // XP earned — reconstruct per-day XP map, then sum
  const xpByDay = {}
  for (const date of days) xpByDay[date] = 0

  for (const w of (state.workouts || [])) {
    if (daySet.has(w.date)) xpByDay[w.date] += w.xp || 0
  }
  for (const date of days) {
    if (habits[date]) {
      for (const h of DIET_HABITS) {
        if (habits[date][h.key]) xpByDay[date] += h.xp
      }
    }
    const dayMeals = (state.meals || []).filter(m => m.date === date)
    xpByDay[date] += dayMeals.length * MEAL_LOG_XP
    const dayWeight = (state.weightLog || []).filter(w => w.date === date)
    xpByDay[date] += dayWeight.length * WEIGHT_LOG_XP
  }

  const xpEarned = Object.values(xpByDay).reduce((a, b) => a + b, 0)

  // Best day
  const bestDayEntry = Object.entries(xpByDay).reduce(
    (best, [date, xp]) => (xp > best.xp ? { date, xp } : best),
    { date: null, xp: -1 }
  )
  const bestDay = bestDayEntry.xp > 0 ? formatDisplayDate(bestDayEntry.date) : '—'

  // Summary line
  let summaryLine
  if (dietHabitsRate >= 80) summaryLine = "Strong week! Your pet is proud. 💪"
  else if (dietHabitsRate >= 50) summaryLine = "Decent week — keep the momentum. 🐾"
  else summaryLine = "Rough week, but you showed up. Let's go. 🌱"

  return {
    range: {
      monday: formatDisplayDate(monday),
      sunday: formatDisplayDate(sunday),
    },
    workoutDays,
    avgCalDeficit,
    proteinGoalDays,
    proteinGoalAvailable: proteinGoal !== null,
    dietHabitsRate,
    xpEarned,
    streaks: {
      workout: state.streaks?.workout?.count ?? 0,
      diet: state.streaks?.diet?.count ?? 0,
      deficit: state.streaks?.deficit?.count ?? 0,
    },
    bestDay,
    summaryLine,
  }
}
