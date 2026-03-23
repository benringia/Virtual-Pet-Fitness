export function getCalorieGoal(state) {
  if (!state.weightLog.length) return null

  const latest = state.weightLog[state.weightLog.length - 1]
  const kg = latest.unit === 'lbs' ? latest.weight * 0.453592 : latest.weight
  const maintenance = Math.round(kg * 30)

  const type = state.weightGoalType || 'Maintain'

  if (type === 'Lose') return { goal: maintenance - 400, mode: 'deficit' }
  if (type === 'Gain') return { goal: maintenance + 300, mode: 'surplus' }
  return { goal: maintenance, mode: 'maintain' }
}
