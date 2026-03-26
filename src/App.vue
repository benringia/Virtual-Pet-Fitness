<template>
  <div v-if="!isAuthReady" class="min-h-screen bg-[#f8f8ff] flex items-center justify-center">
    <span class="text-slate-400 text-sm">Loading…</span>
  </div>

  <AuthView v-else-if="!state.session" />

  <div v-else class="min-h-screen bg-[#f8f8ff] flex flex-col md:pt-0">
    <!-- Mobile Top Bar (Indigo Branding) -->
    <div class="md:hidden sticky top-0 left-0 right-0 h-14 bg-[#0f172a] z-50 flex items-center justify-center shadow-lg">
      <div class="bg-white/10 p-2 rounded-xl ">
        <svg class="h-6 w-6 text-white" viewBox="10 8 96 86" xmlns="http://www.w3.org/2000/svg">
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
      </div>
    </div>

    <div class="flex flex-1 w-full">

      <!-- LEFT SIDEBAR (desktop only) — rail nav -->
      <aside
        @mouseenter="railExpanded = true"
        @mouseleave="railExpanded = false"
        :class="railExpanded ? 'w-60' : 'w-16'"
        class="sticky hidden lg:flex flex-col shrink-0 relative bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#312e81] border-r border-white/10 fixed left-0 top-0 h-screen overflow-hidden transition-all duration-300 ease-in-out z-30"
      >
        <!-- Glass overlay -->
        <div class="absolute inset-0 backdrop-blur-xl bg-white/5 pointer-events-none"></div>
        <!-- Content wrapper -->
        <div class="relative z-10 flex flex-col h-full">
        <!-- Top: logo + nav (scrollable) -->
        <div class="flex flex-col flex-1 overflow-y-auto px-2 py-4 gap-1 scrollbar-thin scrollbar-thumb-white/10">

          <!-- Logo -->
          <div class="w-full flex items-center gap-3 min-h-11 px-1 py-2">
            <svg class="w-7 h-7 shrink-0" :class="railExpanded ? 'mx-0' : 'mx-auto'" viewBox="10 8 96 86" xmlns="http://www.w3.org/2000/svg" aria-label="Petfit">
              <g transform="translate(10, 5)">
                <circle cx="35" cy="18" r="10" fill="white"/>
                <circle cx="62" cy="18" r="10" fill="white"/>
                <circle cx="14" cy="30" r="8" fill="white"/>
                <circle cx="83" cy="30" r="8" fill="white"/>
                <circle cx="48" cy="52" r="32" fill="rgba(255,255,255,0.5)"/>
                <circle cx="38" cy="46" r="6" fill="white"/>
                <circle cx="58" cy="46" r="6" fill="white"/>
                <circle cx="48" cy="62" r="6" fill="white"/>
              </g>
            </svg>
            <span v-show="railExpanded" class="text-white font-semibold text-base whitespace-nowrap">Petfit</span>
          </div>
          <!-- Nav items -->
          <nav aria-label="Main navigation" class="flex flex-col gap-1 mt-8">
            <!-- Overview -->
            <button
              @click="activeView = 'overview'"
              :aria-current="activeView === 'overview' ? 'page' : undefined"
              :class="activeView === 'overview' ? 'bg-white/10 text-white shadow-[0_0_12px_rgba(34,211,238,0.3)] border border-white/10' : 'text-white/60 hover:text-white hover:bg-white/10 hover:translate-x-1'"
              class="relative group w-full flex items-center gap-3 min-h-11 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer"
              title="Overview"
            >
              <div v-if="activeView === 'overview'" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
              <svg class="w-5 h-5 shrink-0 transition-colors duration-200" :class="[railExpanded ? 'mx-0' : 'mx-auto', activeView === 'overview' ? 'text-cyan-400' : 'text-white/60 group-hover:text-cyan-400']" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span v-show="railExpanded" class="text-sm font-medium whitespace-nowrap">Overview</span>
            </button>

            

            <!-- My Workouts -->
            <button
              @click="activeView = 'workouts'"
              :aria-current="activeView === 'workouts' ? 'page' : undefined"
              :class="activeView === 'workouts' ? 'bg-white/10 text-white shadow-[0_0_12px_rgba(34,211,238,0.3)] border border-white/10' : 'text-white/60 hover:text-white hover:bg-white/10 hover:translate-x-1'"
              class="relative group w-full flex items-center gap-3 min-h-11 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer"
              title="My Workouts"
            >
              <div v-if="activeView === 'workouts'" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
              <svg class="w-5 h-5 shrink-0 transition-colors duration-200" :class="[railExpanded ? 'mx-0' : 'mx-auto', activeView === 'workouts' ? 'text-cyan-400' : 'text-white/60 group-hover:text-cyan-400']" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
              </svg>
              <span v-show="railExpanded" class="text-sm font-medium whitespace-nowrap">My Workouts</span>
            </button>
            <button
              @click="activeView = 'diet'"
              :aria-current="activeView === 'diet' ? 'page' : undefined"
              :class="activeView === 'diet' ? 'bg-white/10 text-white shadow-[0_0_12px_rgba(34,211,238,0.3)] border border-white/10' : 'text-white/60 hover:text-white hover:bg-white/10 hover:translate-x-1'"
              class="relative group w-full flex items-center gap-3 min-h-11 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer"
              title="Diet"
            >
              <div v-if="activeView === 'diet'" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
              <svg class="w-5 h-5 shrink-0 transition-colors duration-200" :class="[railExpanded ? 'mx-0' : 'mx-auto', activeView === 'diet' ? 'text-cyan-400' : 'text-white/60 group-hover:text-cyan-400']" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <span v-show="railExpanded" class="text-sm font-medium whitespace-nowrap">Diet</span>
            </button>

            <!-- Progress -->
            <button
              @click="activeView = 'progress'"
              :aria-current="activeView === 'progress' ? 'page' : undefined"
              :class="activeView === 'progress' ? 'bg-white/10 text-white shadow-[0_0_12px_rgba(34,211,238,0.3)] border border-white/10' : 'text-white/60 hover:text-white hover:bg-white/10 hover:translate-x-1'"
              class="relative group w-full flex items-center gap-3 min-h-11 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer"
              title="Progress"
            >
              <div v-if="activeView === 'progress'" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
              <svg class="w-5 h-5 shrink-0 transition-colors duration-200" :class="[railExpanded ? 'mx-0' : 'mx-auto', activeView === 'progress' ? 'text-cyan-400' : 'text-white/60 group-hover:text-cyan-400']" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
              <span v-show="railExpanded" class="text-sm font-medium whitespace-nowrap">Progress</span>
            </button>
          </nav>
        </div>

        <!-- Bottom: logout + reset (always visible) -->
        <div class="shrink-0 flex flex-col gap-2 px-2 py-3 border-t border-white/10">
          <!-- Logout -->
          <button
            @click="handleLogout"
            title="Log out"
            class="w-full flex items-center gap-3 min-h-11 px-3 py-2 rounded-xl text-white/40 hover:text-rose-400 transition-colors duration-200 cursor-pointer"
          >
            <svg class="w-5 h-5 shrink-0" :class="railExpanded ? 'mx-0' : 'mx-auto'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            <span v-show="railExpanded" class="text-sm whitespace-nowrap">Logout</span>
          </button>

          <!-- Reset text link (expanded only) -->
          <div v-show="railExpanded" class="text-center">
            <button
              @click="showResetModal = true"
              class="text-xs text-white/60 hover:text-white/90 transition-colors hover:underline underline-offset-2 cursor-pointer"
            >
              🌸 reset pet &amp; start over
            </button>
          </div>
        </div>
        </div><!-- end content wrapper -->
      </aside>

      <!-- MAIN CONTENT -->
      <div class="flex flex-col flex-1 min-w-0 lg:pl-16">
      <!-- Top header bar -->
      <header class=" lg:pl-16 z-40">
        <div class="flex items-center justify-between px-6 py-3">

          <!-- Left: identity -->
          <div class=" gap-2 leading-none">
            <span class="text-4xl text-gray-700 font-bold tracking-tight">Welcome Back, </span>
            <span class="text-2xl font-bold text-[#312e81] capitalize">{{ state.petName || 'Flarepup' }}!</span>
            <br><span class="text-xs text-gray-400">Let's crush today!</span>
          </div>

          <!-- Right: controls -->
          <div class="flex items-center gap-3">
            <!-- Mobile avatar -->
            <div class="lg:hidden w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span class="text-xs font-semibold text-indigo-600">{{ userInitial }}</span>
            </div>

            <!-- Desktop controls -->
            <div class="hidden lg:flex items-center gap-3">
              <!-- Notification Bell -->
              <div class="relative notif-dropdown">
                <button
                  @click="notifDropdownOpen = !notifDropdownOpen"
                  class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  :aria-expanded="notifDropdownOpen"
                  aria-haspopup="true"
                  aria-label="Notifications"
                >
                  <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  <span v-if="state.notifications.length > 0" class="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full"/>
                </button>

                <div
                  v-if="notifDropdownOpen"
                  class="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-xl border border-slate-100 z-50 overflow-hidden"
                  role="menu"
                >
                  <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <h3 class="text-sm font-semibold text-slate-800">Notifications</h3>
                    <button
                      v-if="state.notifications.length > 0"
                      @click="state.notifications.splice(0)"
                      class="text-xs text-slate-400 hover:text-rose-500 transition-colors"
                    >Clear all</button>
                  </div>
                  <div class="max-h-80 overflow-y-auto">
                    <div v-if="state.notifications.length === 0" class="px-4 py-6 text-center text-sm text-slate-400">
                      You're all caught up 🎉
                    </div>
                    <div
                      v-for="n in state.notifications"
                      :key="n.id"
                      class="flex items-start gap-3 px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                    >
                      <span class="text-lg shrink-0 mt-0.5">{{ n.emoji || '🔔' }}</span>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-slate-700 leading-tight">{{ n.title }}</p>
                        <p class="text-xs text-slate-400 leading-tight mt-0.5">{{ n.message }}</p>
                        <p class="text-[11px] text-slate-300 mt-1">{{ formatTime(n.createdAt) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Profile chip -->
              <div class="relative profile-dropdown">
                <button
                  @click="profileMenuOpen = !profileMenuOpen"
                  class="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  :aria-expanded="profileMenuOpen"
                  aria-haspopup="true"
                >
                  <div class="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span class="text-xs font-semibold text-indigo-600">{{ userInitial }}</span>
                  </div>
                  <span class="text-sm text-gray-700">{{ displayName }}</span>
                </button>

                <div
                  v-if="profileMenuOpen"
                  class="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-lg border border-slate-100 z-50 overflow-hidden"
                  role="menu"
                >
                  <div class="px-4 py-2.5 border-b border-slate-100">
                    <p class="text-xs font-medium text-slate-800 truncate">{{ displayName }}</p>
                    <p class="text-[11px] text-slate-400 truncate">{{ state.user?.email }}</p>
                  </div>
                  <button
                    @click="activeView = 'profile'; profileMenuOpen = false"
                    class="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    role="menuitem"
                  >
                    Profile
                  </button>
                  <button
                    @click="handleLogout"
                    class="w-full text-left px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors"
                    role="menuitem"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </header>
      <main class="flex-1 min-w-0 overflow-y-auto pb-20 lg:pb-0">

        <!-- Profile view -->
        <div v-if="activeView === 'profile'">
          <ProfileView />
        </div>

        <!-- Progress view -->
        <div v-if="activeView === 'progress'" class="">
          <ProgressDashboard />
        </div>

        <!-- Workouts view -->
        <div v-if="activeView === 'workouts'">
          <WorkoutsView />
        </div>

        <!-- Diet view -->
        <div v-if="activeView === 'diet'">
          <DietView />
        </div>

        <!-- Overview view -->
        <div v-if="activeView === 'overview'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-8 lg:px-12 py-4 lg:py-4 items-start max-w-400 mx-auto w-full font-sans transition-all duration-500">

          <!-- Pet Hero: full-width row -->
          <div class="col-span-full mb-2">
            <Pet />
          </div>

          <!-- Lane 1: Primary Flow (Weight, Movement, Training) -->
          <div class="flex flex-col gap-6 w-full h-fit order-1 transition-all duration-500">
            
            
            <!-- Misc Movement: Static Middle Priority -->
            <WorkoutLogger class="order-2" />
            
            <MyWorkoutsPreview 
              :class="[hasLoggedWeightToday ? 'order-first ring-2 ring-orange-100 bg-gradient-to-br from-white to-orange-50/20 shadow-2xl shadow-orange-200/30' : 'order-3 opacity-90']"
              class="transition-all duration-500"
            />
          </div>

          <!-- Lane 2: Evolve track — Col 2 (Stats) -->
          <div class="flex flex-col gap-6 w-full h-fit order-2 lg:col-start-2">

            <!-- Activity Stats card -->
            <div class="hidden md:flex flex-col gap-6">
              <div class="bg-gradient-to-br from-white to-indigo-50 rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-100/30 p-4 md:p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-200/50">
                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Activity Stats</h3>
                <!-- Today's Activity donut -->
                <div class="flex items-center gap-4 mb-4">
                  <div class="relative w-16 h-16 shrink-0">
                    <svg viewBox="0 0 64 64" class="w-16 h-16 -rotate-90" aria-hidden="true">
                      <circle cx="32" cy="32" r="26" fill="none" stroke="#e0e7ff" stroke-width="6"/>
                      <circle cx="32" cy="32" r="26" fill="none"
                        stroke="#6366f1" stroke-width="6"
                        stroke-linecap="round"
                        :stroke-dasharray="`${Math.min((totalSessionsToday / 10), 1) * 163.4} 163.4`"
                        class="transition-all duration-500"/>
                    </svg>
                    <span class="absolute inset-0 flex items-center justify-center text-sm font-bold text-indigo-600">
                      {{ totalSessionsToday }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-700">Today's Activity</p>
                    <p class="text-xs text-indigo-500 font-medium mt-0.5">{{ totalXpToday }} xp earned</p>
                    <p class="text-xs text-gray-400 mt-0.5">
                      {{ totalSessionsToday === 0 ? 'No activities yet 💪' : `${totalSessionsToday} of 10 sessions` }}
                    </p>
                  </div>
                </div>
                
                <!-- Stat pills -->
                <div class="grid grid-cols-3 gap-2">
                  <div class="bg-indigo-50 rounded-xl p-1.5 text-center">
                    <div class="flex justify-center mb-0.5"><span class="text-xs">🔥</span></div>
                    <div class="text-sm font-bold text-indigo-600">{{ state.streaks.workout.count }}</div>
                    <div class="text-[9px] text-gray-400 leading-tight mt-0.5 font-semibold uppercase">workout<br>streak</div>
                  </div>
                  <div class="bg-orange-50 rounded-xl p-1.5 text-center">
                    <div class="flex justify-center mb-0.5"><span class="text-xs">⚡</span></div>
                    <div class="text-sm font-bold text-orange-500">{{ state.calories.eaten }}</div>
                    <div class="text-[9px] text-gray-400 leading-tight mt-0.5 font-semibold uppercase">kcal<br>today</div>
                  </div>
                  <div class="bg-emerald-50 rounded-xl p-1.5 text-center">
                    <div class="flex justify-center mb-0.5"><span class="text-xs">🌿</span></div>
                    <div class="text-sm font-bold text-emerald-600">{{ state.streaks.diet.count }}</div>
                    <div class="text-[9px] text-gray-400 leading-tight mt-0.5 font-semibold uppercase">diet<br>streak</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Lane 3: Maintenance Lane — Col 3 (Weight & Diet) -->
          <div class="flex flex-col gap-6 w-full h-fit order-3 lg:col-start-3">
            <WeightLog 
              :class="[!hasLoggedWeightToday ? 'order-first' : 'order-last opacity-80 scale-[0.98]']" 
              class="transition-all duration-500"
            />
            
            <!-- Diet Habits Teaser Card -->
            <div 
              @click="activeView = 'diet'"
              class="bg-gradient-to-br from-white to-indigo-50 rounded-3xl border border-indigo-100 shadow-lg shadow-slate-200/40 p-6 cursor-pointer transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl hover:shadow-slate-200/50 group"
            >
              <div class="flex items-center justify-between mb-5">
                <h3 class="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <span class="text-xl">🥗</span> Diet
                </h3>
                <span 
                  class="text-[10px] font-bold bg-orange-100 text-orange-600 px-3 py-1 rounded-full uppercase tracking-widest transition-all duration-300"
                  :class="{ 'ring-2 ring-orange-300/60 animate-[streakGlow_1.5s_ease-in-out_infinite]': state.streaks.diet.count >= 3 }"
                >
                  {{ state.streaks.diet.count || 0 }} day streak
                </span>
              </div>

              <div class="space-y-4">
                <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                  <div 
                    class="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out delay-100"
                    :style="{ width: `${dietProgressPercent}%` }"
                  ></div>
                </div>
                
                <div class="flex justify-between items-start">
                  <div>
                    <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                      {{ completedDietHabitsCount }}/{{ DIET_HABITS.length }} habits completed
                    </p>
                    <p class="text-xs text-slate-400 mt-0.5 italic font-medium">
                      {{ encouragementText }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p v-if="dietXpEarned > 0" 
                      class="text-sm font-bold text-emerald-600 uppercase tracking-tight transition-all duration-300"
                      :class="{ 'animate-[xpPulse_1.2s_ease-in-out_infinite]': dietXpEarned > 0 }"
                    >
                      +{{ dietXpEarned }} XP today
                    </p>
                    <p v-else class="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic opacity-60">
                      0 XP
                    </p>
                  </div>
                </div>

                <!-- CTA Button -->
                <button 
                  @click.stop="activeView = 'diet'"
                  class="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold py-3 rounded-2xl shadow-lg shadow-emerald-200/50 transition-all duration-300 transform group-hover:translate-y-[-2px] active:scale-95 flex items-center justify-center gap-2"
                >
                  Open Diet Tracker
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Lane 4: Lifecycle Lane — Col 4 (Journey, Progress, Rest, Reminder) -->
          <div class="flex flex-col gap-6 w-full h-fit order-4">
            <StatsPanel />
            <TodayProgress class="mb-6" />
            
            <!-- Utility Group: Rest Day + Reminder (Stacked Vertically) -->
            <div class="flex flex-col gap-6 w-full h-fit">
              <!-- Rest Day -->
              <div :class="isRestDayActive ? 'pb-3' : 'pb-4 md:pb-6'" class="bg-gradient-to-br from-white to-indigo-50/40 rounded-3xl border border-white shadow-xl shadow-indigo-100/50 p-4 md:p-6 flex flex-col">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-sm font-semibold text-gray-700">Rest Day</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-gray-400" aria-hidden="true">
                    <path d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"/>
                  </svg>
                </div>
                <div class="flex flex-wrap gap-2 mb-4">
                  <div v-for="i in 2" :key="i"
                    :class="i <= restDaysThisWeek ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-gray-50 border-gray-200 text-gray-400'"
                    class="flex-1 rounded-xl border py-2 text-center text-[10px] font-medium transition-colors"
                  >{{ i <= restDaysThisWeek ? 'Used' : 'Avail.' }}</div>
                </div>
                
                <!-- Priority 1: Resting -->
                <div v-if="isRestDayActive" class="w-full h-8 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center gap-2 mt-auto transition-all">
                  <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Resting...</span>
                </div>

                <!-- Priority 2: Available to Log -->
                <button v-else-if="restDayAllowed" @click="handleLogRestDay"
                  class="w-full mt-auto min-h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold transition-colors cursor-pointer leading-tight px-2">
                  Log Rest
                </button>
              </div>
              <!-- Daily Reminder -->
              <ReminderSettings />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

    <ToastNotification />
    <EvolutionModal />
    <WelcomeModal v-if="showWelcome" @save="handleWelcomeSave" />
    <WeeklyReportModal />

    <!-- Reset confirmation modal -->
    <div
      v-if="showResetModal"
      class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      @click.self="showResetModal = false"
    >
      <div class="bg-white rounded-2xl p-6 shadow-lg max-w-sm w-full mx-4">
        <h2 class="font-medium text-gray-800 mb-2">Reset your progress?</h2>
        <p class="text-sm text-gray-500 mb-6">This will reset <strong>your</strong> progress, workouts, and data only. Other accounts are not affected. This cannot be undone.</p>
        <div class="flex gap-3 justify-end">
          <button @click="showResetModal = false" class="bg-indigo-50 text-indigo-600 rounded-xl px-5 py-2 text-sm font-medium hover:bg-indigo-100 transition-colors cursor-pointer">Cancel</button>
          <button @click="handleReset" class="bg-red-100 text-red-600 rounded-xl px-5 py-2 text-sm font-medium hover:bg-red-200 transition-colors cursor-pointer">Reset</button>
        </div>
      </div>
    </div>

    <!-- Mobile bottom nav (fixed) -->
    <nav
      class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-20"
      style="padding-bottom: env(safe-area-inset-bottom, 0px)"
      aria-label="Mobile navigation"
    >

      <!-- Overview -->
      <button
        @click="activeView = 'overview'"
        :class="activeView === 'overview' ? 'text-indigo-600' : 'text-slate-400'"
        class="flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors cursor-pointer"
        aria-label="Overview"
      >
        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        <span>Overview</span>
      </button>

      <!-- Progress -->
      <button
        @click="activeView = 'progress'"
        :class="activeView === 'progress' ? 'text-indigo-600' : 'text-slate-400'"
        class="flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors cursor-pointer"
        aria-label="Progress"
      >
        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
        <span>Progress</span>
      </button>

      <!-- My Workouts -->
      <button
        @click="activeView = 'workouts'"
        :class="activeView === 'workouts' ? 'text-indigo-600' : 'text-slate-400'"
        class="flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors cursor-pointer"
        aria-label="My Workouts"
      >
        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
        </svg>
        <span>Workouts</span>
      </button>

      <!-- Diet -->
      <button
        @click="activeView = 'diet'"
        :class="activeView === 'diet' ? 'text-indigo-600' : 'text-slate-400'"
        class="flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors cursor-pointer"
        aria-label="Diet"
      >
        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
        <span>Diet</span>
      </button>

      <!-- Profile placeholder -->
      <button
        class="flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium text-slate-400 transition-colors cursor-pointer"
        aria-label="Profile (coming soon)"
        title="Coming soon"
      >
        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
        <span>Profile</span>
      </button>

    </nav>

  </div>
</template>

<script setup>
import { onMounted, ref, computed, watchEffect, nextTick } from 'vue'
import AuthView from './views/AuthView.vue'
import Header from './components/Header.vue'
import DietView from './views/DietView.vue'
import ToastNotification from './components/ToastNotification.vue'
import EvolutionModal from './components/EvolutionModal.vue'
import Pet from './components/Pet.vue'
import WorkoutLogger from './components/WorkoutLogger.vue'
import DietHabits from './components/DietHabits.vue'
import CaloriesTracker from './components/CaloriesTracker.vue'
import ProteinCounter from './components/ProteinCounter.vue'
import WeightLog from './components/WeightLog.vue'
import TodayProgress from './components/TodayProgress.vue'
import MealLogger from './components/MealLogger.vue'

import MyWorkoutsPreview from './components/MyWorkoutsPreview.vue'
import StatsPanel from './components/StatsPanel.vue'
import ProgressDashboard from './components/ProgressDashboard.vue'
import WorkoutsView from './components/WorkoutsView.vue'
import ReminderSettings from './components/ReminderSettings.vue'
import ProfileView from './views/ProfileView.vue'
import WeeklyReportModal from './components/WeeklyReportModal.vue'
import WelcomeModal from './components/WelcomeModal.vue'
import { state } from './store/state.js'
import { saveState, reloadStateForUser } from './store/persistence.js'
import { createDefaultState } from './store/defaultState.js'
import { supabase } from './lib/supabase.js'
import { checkDayRollover } from './utils/dates.js'
import { scheduleReminder } from './utils/reminder.js'
import { canLogRestDay, logRestDay, getRestDaysThisWeek } from './utils/restDay.js'
import { showWeeklyReport, getThisMonday } from './utils/weeklyReport.js'
import { activeView } from './composables/useActiveView.js'
import { DIET_HABITS } from './utils/xp.js'

const timeGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const restDaysThisWeek = computed(() => getRestDaysThisWeek(state.restDays))
const restDayAllowed = computed(() => canLogRestDay(state))

const todayStr = (() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
})()

const hasLoggedWeightToday = computed(() => 
  state.weightLog.some(w => w.date === todayStr)
)

const totalSessionsToday = computed(() =>
  state.workouts.filter(w => w.date === todayStr).length
)

const totalXpToday = computed(() =>
  state.workouts.filter(w => w.date === todayStr).reduce((s, w) => s + (w.xp || 0), 0)
)
const isRestDayActive = computed(() => state.todayIsRestDay)

function handleLogRestDay() {
  logRestDay(state)
  saveState(state)
}

const todayDietHabits = computed(() => state.dietHabits[todayStr] ?? {})
const completedDietHabitsCount = computed(() => 
  DIET_HABITS.filter(h => todayDietHabits.value[h.key]).length
)
const dietProgressPercent = computed(() => (completedDietHabitsCount.value / DIET_HABITS.length) * 100)
const dietXpEarned = computed(() => 
  DIET_HABITS.reduce((sum, h) => sum + (todayDietHabits.value[h.key] ? h.xp : 0), 0)
)
const encouragementText = computed(() => {
  if (completedDietHabitsCount.value === 0) return 'Start your first healthy habit today 💪'
  if (completedDietHabitsCount.value === DIET_HABITS.length) return 'All habits complete 🎉'
  return "You're doing great — keep going!"
})

onMounted(async () => {
  checkDayRollover(state)
  if (state.reminder.enabled && Notification.permission === 'granted') {
    scheduleReminder(state.reminder.time)
  }
  const today = new Date()
  if (today.getDay() === 1) {
    const thisMonday = getThisMonday()
    if (state.lastWeeklyReportShown !== thisMonday) {
      showWeeklyReport.value = true
      state.lastWeeklyReportShown = thisMonday
    }
  }

  try {
    const { data } = await supabase.auth.getSession()
    await handleAuth(data.session)
  } catch {
    state.session = null
    state.user = null
  } finally {
    isAuthReady.value = true
  }

  supabase.auth.onAuthStateChange(async (_event, session) => {
    await handleAuth(session)
  })

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-dropdown')) {
      profileMenuOpen.value = false
    }
    if (!e.target.closest('.notif-dropdown')) {
      notifDropdownOpen.value = false
    }
  })
})

// Hydrate state BEFORE setting session so showWelcome evaluates on fully loaded state
async function handleAuth(session) {
  if (session?.user?.id) {
    reloadStateForUser(state, session.user.id)
  }
  state.session = session
  state.user = session?.user ?? null
  await nextTick()
}

// activeView is imported from composables/useActiveView.js (shared with MyWorkoutsPreview)
const showWelcome = computed(() => !!state.session?.user?.id && state.hasSeenWelcome === false)

watchEffect(() => {
  console.log('[Auth] session:', state.session?.user?.id, '| hasSeenWelcome:', state.hasSeenWelcome, '| showWelcome:', showWelcome.value)
})

function handleWelcomeSave({ name, petType }) {
  state.petName = name || 'Flarepup'
  state.petType = petType
  state.hasSeenWelcome = true
}

const isAuthReady = ref(false)
const activeRightTab = ref('diet')
const railExpanded = ref(false)
const showResetModal = ref(false)
const profileMenuOpen = ref(false)
const notifDropdownOpen = ref(false)

function formatTime(timestamp) {
  const diff = Date.now() - timestamp
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago'
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago'
  return new Date(timestamp).toLocaleDateString()
}

const displayName = computed(() =>
  state.user?.user_metadata?.name || state.user?.email?.split('@')[0] || 'User'
)
const userInitial = computed(() => displayName.value.charAt(0).toUpperCase())

async function handleLogout() {
  profileMenuOpen.value = false
  await supabase.auth.signOut().catch(() => {})
  state.user = null
  state.session = null
}

function handleReset() {
  const userId = state.session?.user?.id
  if (!userId) {
    showResetModal.value = false
    return
  }
  const savedSession = state.session
  const savedUser = state.user
  const key = `flarepup-v5-${userId}`
  localStorage.removeItem(key)
  const fresh = createDefaultState()
  fresh.hasSeenWelcome = false
  Object.assign(state, fresh)
  state.session = savedSession
  state.user = savedUser
  saveState(state)
  showResetModal.value = false
}
</script>

<style>
@keyframes xpPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.08); opacity: 0.85; }
}

@keyframes streakGlow {
  0%, 100% { box-shadow: 0 0 0px rgba(251,146,60,0.4); }
  50% { box-shadow: 0 0 10px rgba(251,146,60,0.6); }
}
</style>
