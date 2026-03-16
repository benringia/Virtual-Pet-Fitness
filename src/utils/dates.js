export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function isSameDay(a, b) {
  return a === b
}
