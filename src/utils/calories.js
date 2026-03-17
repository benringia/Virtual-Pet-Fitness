const WORKOUT_KCAL = {
  'Strength – bodyweight': 150,
  'Strength – dumbbells':  200,
  'Strength – full gym':   300,
  'Strength – new pb!':    350,
  'Walking – short walk':  100,
  'Walking – 30 min':      150,
  'Walking – 1 hr+':       250,
  'Walking – hike/trail':  350,
  'Boxing – shadow':       200,
  'Boxing – bag':          300,
  'Boxing – class':        400,
  'Boxing – sparring':     450,
  'Tennis – drills':       200,
  'Tennis – casual':       250,
  'Tennis – match':        350,
  'Tennis – tourney':      450,
}

const CUSTOM_KCAL = { light: 150, medium: 250, custom: 350 }

export function estimateWorkoutCalories(workout) {
  if (workout.type === 'Custom') return CUSTOM_KCAL[workout.intensity] ?? 0
  return WORKOUT_KCAL[workout.name] ?? 0
}

export function getTodayBurned(workouts, todayDate) {
  const items = workouts
    .filter(w => w.date === todayDate)
    .map(w => ({ workout: w, kcal: estimateWorkoutCalories(w) }))
    .filter(item => item.kcal > 0)
  const total = items.reduce((sum, item) => sum + item.kcal, 0)
  return { items, total }
}
