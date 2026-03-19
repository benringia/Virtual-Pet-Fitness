import { triggerAchievement } from './achievements.js'
import { todayStr } from './dates.js'

export const XP_PER_LEVEL = 100

export const WORKOUT_SUBTYPES = {
  Strength: [
    { label: 'bodyweight', xp: 20 },
    { label: 'dumbbells',  xp: 35 },
    { label: 'full gym',   xp: 55 },
    { label: 'new pb!',    xp: 80 },
  ],
  Walking: [
    { label: 'short walk', xp: 15 },
    { label: '30 min',     xp: 30 },
    { label: '1 hr+',      xp: 45 },
    { label: 'hike/trail', xp: 65 },
  ],
  Boxing: [
    { label: 'shadow',   xp: 20 },
    { label: 'bag',      xp: 35 },
    { label: 'class',    xp: 55 },
    { label: 'sparring', xp: 75 },
  ],
  Tennis: [
    { label: 'drills',  xp: 20 },
    { label: 'casual',  xp: 35 },
    { label: 'match',   xp: 55 },
    { label: 'tourney', xp: 75 },
  ],
}

export const WORKOUT_CAP = 120

export const WORKOUT_META = {
  Strength: { dot: 'bg-pink-400',  emoji: '💪', abbr: 'STR' },
  Walking:  { dot: 'bg-blue-400',  emoji: '🚶', abbr: 'WALK' },
  Boxing:   { dot: 'bg-red-400',   emoji: '🥊', abbr: 'BOX' },
  Tennis:   { dot: 'bg-green-400', emoji: '🎾', abbr: 'TENNIS' },
}

export const DIET_HABITS = [
  { key: 'water',    label: 'drank 8 glasses of water',  emoji: '💧', xp: 15 },
  { key: 'veggies',  label: 'ate veggies / salad',        emoji: '🥦', xp: 15 },
  { key: 'protein',  label: 'hit protein goal',           emoji: '🥩', xp: 20 },
  { key: 'noJunk',   label: 'no junk food today',         emoji: '🚫', xp: 20 },
  { key: 'balanced', label: 'ate balanced meals',         emoji: '🍽️', xp: 15 },
]

export const DIET_HABIT_XP = 10 // kept for legacy compatibility

export const WEIGHT_LOG_XP = 10
export const WEIGHT_STREAK_BONUS_XP = 15
export const MEAL_LOG_XP = 10

// Evolution stages: [minLevel, stageName, emoji]
const STAGES = [
  [15, 'Queen',   '👸'],
  [10, 'Fighter', '🥷'],
  [6,  'Blossom', '🌸'],
  [3,  'Pup',     '🐶'],
  [1,  'Egg',     '🥚'],
]

export const STAGE_LIST = [
  { name: 'Egg',     emoji: '🥚',  minLevel: 1  },
  { name: 'Pup',     emoji: '🐶',  minLevel: 3  },
  { name: 'Blossom', emoji: '🌸',  minLevel: 6  },
  { name: 'Fighter', emoji: '🥷',  minLevel: 10 },
  { name: 'Queen',   emoji: '👸',  minLevel: 15 },
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
  const oldLevel = state.level
  state.xp += amount
  state.level = getLevelFromXP(state.xp)
  if (state.level > oldLevel) {
    triggerAchievement('levelup', '⬆️', 'Level up!', `You reached level ${state.level}`, `levelup-${state.level}-${todayStr()}`)
  }
}
