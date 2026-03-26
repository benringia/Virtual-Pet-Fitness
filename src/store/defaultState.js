function localDateStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function createDefaultState() {
  const today = localDateStr()
  return {
    petName: 'Flarepup',
    petType: null,
    hasSeenWelcome: false,
    startDate: today,
    currentDate: today,
    xp: 0,
    level: 1,
    workouts: [],
    workoutTypes: [
      { id: 'strength', name: 'Strength', color: '#f472b6', sessions: [] },
      { id: 'walking',  name: 'Walking',  color: '#60a5fa', sessions: [] },
      { id: 'boxing',   name: 'Boxing',   color: '#f87171', sessions: [] },
      { id: 'tennis',   name: 'Tennis',   color: '#4ade80', sessions: [] },
    ],
    dietHabits: {},
    calories: { eaten: 0, burned: 0, burnedManual: [], goal: 2000, date: null },
    streaks: {
      workout: { count: 0, lastDate: null },
      diet:    { count: 0, lastDate: null },
      deficit: { count: 0, lastDate: null },
    },
    calHistory: [],
    weightLog: [],
    weightGoal: null,
    weightGoalType: 'Maintain',
    hasCelebratedGoal: false,
    weightUnit: 'kg',
    meals: [],
    proteinActivityLevel: 'active',
    petMood: 'idle',
    reminder: { enabled: false, time: '20:00' },
    restDays: [],
    todayIsRestDay: false,
    lastWeeklyReportShown: null,
    workoutSets: [],
    workoutSessions: [],
    trainingCategory: 'bodybuilding',
    workoutPrograms: {},
    hiddenLabels: [],
    miscActivity: 'Walking',
    customMiscName: '',
    waterIntake: 0,
    completedHabitsToday: {},
    notifications: [],
    user: null,
    session: null,
  }
}
