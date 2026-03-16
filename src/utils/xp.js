export const XP_PER_LEVEL = 100

export const WORKOUT_TYPES = ['Strength', 'Walking', 'Boxing', 'Tennis', 'Custom']

export const WORKOUT_XP = {
  Strength: 30,
  Walking: 15,
  Boxing: 30,
  Tennis: 20,
  Custom: 20,
}

export const DIET_HABITS = [
  { key: 'water',    label: '💧 Water' },
  { key: 'veggies',  label: '🥦 Vegetables' },
  { key: 'protein',  label: '🥩 Protein' },
  { key: 'noJunk',   label: '🚫 No Junk Food' },
  { key: 'balanced', label: '🍽️ Balanced Meals' },
]

export const DIET_HABIT_XP = 10

// Evolution stages: [minLevel, stageName]
const STAGES = [
  [15, 'Queen'],
  [10, 'Fighter'],
  [6, 'Blossom'],
  [3, 'Pup'],
  [1, 'Egg'],
]

export function getLevelFromXP(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function getStageFromLevel(level) {
  for (const [minLevel, name] of STAGES) {
    if (level >= minLevel) return name
  }
  return 'Egg'
}

export function addXP(state, amount) {
  state.xp += amount
  state.level = getLevelFromXP(state.xp)
}
