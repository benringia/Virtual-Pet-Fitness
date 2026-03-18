import { reactive, ref } from 'vue'
import { todayStr } from './dates.js'

const BORDER_COLORS = {
  levelup:  'border-indigo-500',
  protein:  'border-emerald-400',
  calorie:  'border-emerald-400',
  streak:   'border-amber-400',
  workout:  'border-blue-400',
  diet:     'border-green-400',
  weight:   'border-pink-400',
}

const EVOLUTION_MAP = {
  'Egg→Pup':      { emoji: '🐶', message: 'Your pet has evolved into a Pup!' },
  'Pup→Blossom':  { emoji: '🌸', message: 'Your pet has evolved into Blossom!' },
  'Blossom→Fighter': { emoji: '🥷', message: 'Your pet has evolved into Fighter!' },
  'Fighter→Queen':   { emoji: '👸', message: 'Your pet has evolved into Queen!' },
}

export const notifications = reactive([])
export const evolutionEvent = ref(null)

// In-memory dedupe: { key → 'YYYY-MM-DD' }
const shownToday = {}

export function triggerAchievement(type, emoji, title, message, dedupeKey) {
  const key = dedupeKey ?? `${type}-${todayStr()}`
  if (shownToday[key] === todayStr()) return
  shownToday[key] = todayStr()

  if (notifications.length >= 3) notifications.shift()
  notifications.push({ id: Date.now() + Math.random(), type, emoji, title, message, borderColor: BORDER_COLORS[type] ?? 'border-indigo-300' })
}

export function triggerEvolution(fromStage, toStage) {
  const data = EVOLUTION_MAP[`${fromStage}→${toStage}`]
  if (data) evolutionEvent.value = { ...data, stage: toStage }
}

export function dismissEvolution() {
  evolutionEvent.value = null
}

export function clearShownToday() {
  for (const key of Object.keys(shownToday)) delete shownToday[key]
}
