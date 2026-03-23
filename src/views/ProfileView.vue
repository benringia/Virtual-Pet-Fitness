<template>
  <div class="p-6">
  <div class="max-w-3xl mx-auto space-y-4">

    <!-- Pet Hero (primary) -->
    <Pet />

    <!-- User Card + Pet Wardrobe -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">

      <!-- User Card -->
      <div class="h-full bg-linear-to-br from-white to-indigo-50 rounded-2xl border border-indigo-100 shadow-sm p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-base font-bold text-indigo-600 shrink-0">
            {{ avatarLetter }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-slate-800 truncate">{{ displayName }}</p>
            <p class="text-[11px] text-slate-400 truncate">{{ state.user?.email || 'No email' }}</p>
            <p class="text-[11px] text-slate-400 mt-0.5">Level {{ state.level ?? 1 }} · {{ xpInLevel }}/100 XP</p>
          </div>
        </div>
      </div>

      <!-- Pet Wardrobe -->
      <div class="h-full bg-linear-to-br from-white to-indigo-50 rounded-2xl border border-indigo-100 shadow-sm p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md">
        <p class="text-xs font-semibold text-slate-600 mb-2">Pet Wardrobe</p>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="item in wardrobe"
            :key="item.id"
            class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl cursor-pointer hover:scale-105 transition"
          >
            {{ item.icon }}
          </div>
        </div>
      </div>

    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="p-3 rounded-xl border border-slate-100 bg-white shadow-sm">
        <p class="text-base font-semibold text-slate-800">🔥 {{ streak }}</p>
        <p class="text-[11px] text-slate-400">Workout Streak</p>
      </div>
      <div class="p-3 rounded-xl border border-slate-100 bg-white shadow-sm">
        <p class="text-base font-semibold text-slate-800">🍽️ {{ mealsCount }}</p>
        <p class="text-[11px] text-slate-400">Meals Logged</p>
      </div>
      <div class="p-3 rounded-xl border border-slate-100 bg-white shadow-sm">
        <p class="text-base font-semibold text-slate-800">💪 {{ workoutsCount }}</p>
        <p class="text-[11px] text-slate-400">Workouts</p>
      </div>
      <div class="p-3 rounded-xl border border-slate-100 bg-white shadow-sm">
        <p class="text-base font-semibold text-slate-800">⭐ {{ xp }}</p>
        <p class="text-[11px] text-slate-400">Total XP</p>
      </div>
    </div>

    <!-- Progress Summary -->
    <div class="rounded-2xl border border-indigo-100 bg-linear-to-br from-white to-slate-50 p-4 shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <p class="text-xs font-semibold text-slate-600">Progress Summary</p>
        <button
          @click="activeView = 'progress'"
          class="text-[11px] text-indigo-500 font-medium hover:underline"
        >
          View Full →
        </button>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div>
          <p class="text-base font-semibold" :class="weightChangeColor">{{ weightChange }}</p>
          <p class="text-[11px] text-slate-400">Weight</p>
        </div>
        <div>
          <p class="text-base font-semibold text-slate-800">🔥 {{ workoutStreak }}d</p>
          <p class="text-[11px] text-slate-400">Streak</p>
        </div>
        <div>
          <p class="text-base font-semibold text-slate-800">{{ xpTrend }}</p>
          <p class="text-[11px] text-slate-400">XP Trend</p>
        </div>
      </div>
    </div>

    <!-- Activity Feed -->
    <div class="rounded-2xl border border-indigo-100 bg-linear-to-br from-white to-indigo-50 p-4 shadow-sm">
      <p class="text-xs font-semibold text-slate-600 mb-2">Activity</p>
      <div v-if="!latestNotifications.length" class="text-[11px] text-slate-400">
        You're all caught up 🎉
      </div>
      <div class="max-h-48 overflow-y-auto">
        <div
          v-for="notif in latestNotifications"
          :key="notif.id"
          class="flex items-start gap-2 py-1.5 border-b border-slate-100 last:border-none"
        >
          <span class="text-sm shrink-0 mt-0.5">{{ notif.emoji || '🔔' }}</span>
          <div class="flex-1 min-w-0">
            <p class="text-xs text-slate-700 leading-tight">{{ notif.title }}</p>
            <p class="text-[11px] text-slate-400 leading-tight mt-0.5">{{ notif.message }}</p>
            <p class="text-[10px] text-slate-300 mt-0.5">{{ formatTime(notif.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings -->
    <div class="rounded-2xl border border-indigo-100 bg-linear-to-br from-white to-indigo-50 p-4 shadow-sm">
      <p class="text-xs font-semibold text-slate-600 mb-3">Settings</p>
      <div class="space-y-2">
        <div class="space-y-1">
          <label for="profile-name" class="text-[11px] text-slate-400">Display name</label>
          <input
            id="profile-name"
            v-model="nameInput"
            type="text"
            placeholder="Your name"
            maxlength="50"
            class="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none transition bg-white"
          />
        </div>
        <button
          @click="updateName"
          :disabled="!nameInput.trim() || saving"
          class="w-full py-1.5 rounded-lg bg-indigo-500 text-white text-xs font-medium hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {{ saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save Name' }}
        </button>
        <button
          @click="handleLogout"
          class="w-full py-1.5 rounded-lg text-xs text-rose-500 hover:bg-rose-50 transition"
        >
          Log out
        </button>
      </div>
    </div>

  </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { state } from '../store/state.js'
import { getStageFromLevel } from '../utils/xp.js'
import { supabase } from '../lib/supabase.js'
import Pet from '../components/Pet.vue'
import { activeView } from '../composables/useActiveView.js'

const displayName = computed(() => {
  if (!state.user) return 'User'
  return state.user.user_metadata?.name || state.user.email?.split('@')[0] || 'User'
})

const avatarLetter = computed(() => displayName.value.charAt(0).toUpperCase())

const xp = computed(() => state.xp ?? 0)
const xpInLevel = computed(() => xp.value % 100)

const streak = computed(() => state.streaks?.workout?.count ?? 0)
const mealsCount = computed(() => state.meals?.length ?? 0)
const workoutsCount = computed(() =>
  (state.workoutSessions?.length ?? 0) +
  (state.workouts?.filter(w => w.type === 'Custom').length ?? 0)
)

const latestNotifications = computed(() => (state.notifications ?? []).slice(0, 10))

const workoutStreak = computed(() => state.streaks?.workout?.count ?? 0)

const weightChange = computed(() => {
  const log = state.weightLog ?? []
  if (log.length < 2) return '—'
  const sorted = [...log].sort((a, b) => a.date.localeCompare(b.date))
  const first = sorted[0].weight
  const last = sorted[sorted.length - 1].weight
  const diff = Math.round((last - first) * 10) / 10
  if (diff === 0) return '0 kg'
  return diff > 0 ? `+${diff} kg` : `${diff} kg`
})

const weightChangeColor = computed(() => {
  const log = state.weightLog ?? []
  if (log.length < 2) return 'text-slate-800'
  const sorted = [...log].sort((a, b) => a.date.localeCompare(b.date))
  const diff = sorted[sorted.length - 1].weight - sorted[0].weight
  if (diff < 0) return 'text-emerald-600'
  if (diff > 0) return 'text-rose-500'
  return 'text-slate-800'
})

const xpTrend = computed(() => {
  const workouts = state.workouts ?? []
  if (!workouts.length) return '—'
  const last7 = workouts.slice(-7)
  const totalXP = last7.reduce((sum, w) => sum + (w.xp ?? 0), 0)
  if (totalXP === 0) return 'Low'
  if (totalXP < 100) return 'Moderate'
  return 'High'
})

function formatTime(timestamp) {
  const diff = Date.now() - timestamp
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago'
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago'
  return new Date(timestamp).toLocaleDateString()
}

const wardrobe = ref([
  { id: 1, icon: '🎩' },
  { id: 2, icon: '👑' },
  { id: 3, icon: '🕶️' },
  { id: 4, icon: '🎀' },
  { id: 5, icon: '⚔️' },
])

const nameInput = ref(state.user?.user_metadata?.name || '')
const saving = ref(false)
const saved = ref(false)

async function updateName() {
  const trimmed = nameInput.value.trim()
  if (!trimmed || saving.value) return
  saving.value = true
  saved.value = false
  try {
    const { data, error } = await supabase.auth.updateUser({ data: { name: trimmed } })
    if (!error && data.user) {
      state.user = data.user
      saved.value = true
      setTimeout(() => { saved.value = false }, 2000)
    }
  } finally {
    saving.value = false
  }
}

async function handleLogout() {
  await supabase.auth.signOut().catch(() => {})
  state.user = null
  state.session = null
}
</script>
