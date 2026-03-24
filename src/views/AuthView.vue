<template>
  <div class="min-h-screen bg-[#f8f8ff] flex items-center justify-center px-4">
    <div class="w-full max-w-sm bg-gradient-to-br from-white to-indigo-50 rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-100/30 p-8">

      <!-- Logo -->
      <div class="flex items-center justify-center gap-2 mb-8">
        <svg class="w-8 h-8 text-indigo-600" viewBox="10 8 96 86" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(10, 5)">
            <circle cx="35" cy="18" r="10" fill="currentColor"/>
            <circle cx="62" cy="18" r="10" fill="currentColor"/>
            <circle cx="14" cy="30" r="8" fill="currentColor"/>
            <circle cx="83" cy="30" r="8" fill="currentColor"/>
            <circle cx="48" cy="52" r="32" fill="currentColor" fill-opacity="0.5"/>
            <circle cx="38" cy="46" r="6" fill="currentColor"/>
            <circle cx="58" cy="46" r="6" fill="currentColor"/>
            <circle cx="48" cy="62" r="6" fill="currentColor"/>
          </g>
        </svg>
        <span class="text-xl font-semibold text-slate-800">Petfit</span>
      </div>

      <!-- Toggle -->
      <div class="flex bg-slate-100 rounded-xl p-1 mb-6">
        <button
          @click="isLogin = true"
          :class="isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          class="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200"
        >
          Log in
        </button>
        <button
          @click="isLogin = false"
          :class="!isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          class="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200"
        >
          Sign up
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" novalidate>
        <div class="flex flex-col gap-4">

          <!-- Name (register only) -->
          <div v-if="!isLogin" class="flex flex-col gap-1">
            <label for="auth-name" class="text-xs font-medium text-slate-500 uppercase tracking-wide">Name</label>
            <input
              id="auth-name"
              v-model="name"
              type="text"
              autocomplete="name"
              placeholder="Your name"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label for="auth-email" class="text-xs font-medium text-slate-500 uppercase tracking-wide">Email</label>
            <input
              id="auth-email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              required
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label for="auth-password" class="text-xs font-medium text-slate-500 uppercase tracking-wide">Password</label>
            <input
              id="auth-password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="••••••••"
              required
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            />
          </div>

          <!-- Error -->
          <p v-if="error" role="alert" class="text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
            {{ error }}
          </p>

          <!-- Success (email confirmation required) -->
          <p v-if="successMsg" role="status" class="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
            {{ successMsg }}
          </p>

          <button
            type="submit"
            :disabled="loading || !email.trim() || !password.trim()"
            class="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {{ loading ? 'Loading…' : isLogin ? 'Log in' : 'Create account' }}
          </button>

        </div>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabase.js'
import { handleAuthError } from '../utils/authErrors.js'

const email = ref('')
const password = ref('')
const name = ref('')
const isLogin = ref(true)
const loading = ref(false)
const error = ref('')
const successMsg = ref('')

async function attemptLogin(email, password) {
  const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
  return { data, authError }
}

async function handleSubmit() {
  error.value = ''
  successMsg.value = ''
  loading.value = true

  console.log('LOGIN ATTEMPT', { email: email.value })

  try {
    if (isLogin.value) {
      const { authError } = await attemptLogin(email.value, password.value)
      if (authError) error.value = handleAuthError(authError)
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: { data: { name: name.value.trim() || undefined } },
    })

    if (signUpError?.code === 'user_already_exists') {
      const { authError } = await attemptLogin(email.value, password.value)
      if (authError) error.value = handleAuthError(authError)
      return
    }

    if (signUpError) {
      error.value = handleAuthError(signUpError)
      return
    }

    if (!data.session) {
      successMsg.value = 'Check your email to confirm your account.'
    }
    // If data.session exists, onAuthStateChange in App.vue handles the transition automatically
  } catch (e) {
    error.value = handleAuthError(e)
  } finally {
    loading.value = false
  }
}
</script>
