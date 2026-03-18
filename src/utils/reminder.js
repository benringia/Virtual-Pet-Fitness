let timeoutId = null

export async function requestPermission() {
  return Notification.requestPermission()
}

export function scheduleReminder(time) {
  cancelReminder()
  const [h, m] = time.split(':').map(Number)
  const now = new Date()
  const target = new Date()
  target.setHours(h, m, 0, 0)
  if (target <= now) return  // Already passed today
  const ms = target - now
  timeoutId = setTimeout(() => {
    new Notification('Petfit reminder 🐾', {
      body: "Don't forget to log today! Your streak is on the line.",
      icon: '/favicon.svg',
    })
  }, ms)
}

export function cancelReminder() {
  if (timeoutId !== null) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}
