import { triggerAchievement } from './achievements.js'

const ERROR_MAP = {
  'user_already_exists':        'Account already exists. Try logging in.',
  'invalid login credentials':  'Invalid email or password.',
}

function getAuthMessage(error) {
  const code = error?.code ?? ''
  const msg  = error?.message?.toLowerCase() ?? ''

  if (ERROR_MAP[code])                           return ERROR_MAP[code]
  if (msg.includes('invalid login credentials')) return ERROR_MAP['invalid login credentials']
  return error?.message ?? 'Something went wrong. Please try again.'
}

export function handleAuthError(error) {
  const message = getAuthMessage(error)
  triggerAchievement('error', '⚠️', 'Auth Error', message, `auth-error-${message}`)
  return message
}
