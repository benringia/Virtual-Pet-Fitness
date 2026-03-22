<template>
  <div class="min-h-screen bg-[#f8f8ff] flex flex-col md:pt-0">
    <!-- Mobile Top Bar (Indigo Branding) -->
    <div class="md:hidden sticky top-0 left-0 right-0 h-14 bg-indigo-600 z-50 flex items-center justify-center shadow-lg">
      <div class="bg-indigo-500/30 p-2 rounded-xl ">
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

    <div class="flex flex-1 overflow-hidden w-full">

      <!-- LEFT SIDEBAR (desktop only) — rail nav -->
      <aside
        @mouseenter="railExpanded = true"
        @mouseleave="railExpanded = false"
        :class="railExpanded ? 'w-60' : 'w-16'"
        class="hidden lg:flex flex-col shrink-0 bg-indigo-600 border-r border-indigo-500 fixed left-0 top-0 h-screen overflow-hidden transition-all duration-300 ease-in-out z-30"
      >
        <!-- Top: logo + nav -->
        <div class="flex flex-col flex-1 p-2 pt-4 gap-1">

          <!-- Logo -->
          <div class="w-full flex items-center gap-3 min-h-11 px-3 py-2 overflow-hidden">
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
              :class="activeView === 'overview' ? 'bg-white/20 text-white' : 'text-white hover:bg-white/10'"
              class="w-full flex items-center gap-3 min-h-11 px-3 py-2 rounded-xl transition-colors duration-200 cursor-pointer"
              title="Overview"
            >
              <svg class="w-5 h-5 shrink-0 text-white" :class="railExpanded ? 'mx-0' : 'mx-auto'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span v-show="railExpanded" class="text-sm font-medium whitespace-nowrap text-white">Overview</span>
            </button>

            <!-- Progress -->
            <button
              @click="activeView = 'progress'"
              :aria-current="activeView === 'progress' ? 'page' : undefined"
              :class="activeView === 'progress' ? 'bg-white/20 text-white' : 'text-white hover:bg-white/10'"
              class="w-full flex items-center gap-3 min-h-11 px-3 py-2 rounded-xl transition-colors duration-200 cursor-pointer"
              title="Progress"
            >
              <svg class="w-5 h-5 shrink-0 text-white" :class="railExpanded ? 'mx-0' : 'mx-auto'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
              <span v-show="railExpanded" class="text-sm font-medium whitespace-nowrap text-white">Progress</span>
            </button>

            <!-- My Workouts -->
            <button
              @click="activeView = 'workouts'"
              :aria-current="activeView === 'workouts' ? 'page' : undefined"
              :class="activeView === 'workouts' ? 'bg-white/20 text-white' : 'text-white hover:bg-white/10'"
              class="w-full flex items-center gap-3 min-h-11 px-3 py-2 rounded-xl transition-colors duration-200 cursor-pointer"
              title="My Workouts"
            >
              <svg class="w-5 h-5 shrink-0 text-white" :class="railExpanded ? 'mx-0' : 'mx-auto'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
              </svg>
              <span v-show="railExpanded" class="text-sm font-medium whitespace-nowrap text-white">My Workouts</span>
            </button>
          </nav>
        </div>

        <!-- Bottom: logout + reset -->
        <div class="p-2 flex flex-col gap-2 pb-4">
          <!-- Logout placeholder -->
          <button
            title="Coming soon"
            class="w-full flex items-center gap-3 min-h-11 px-3 py-2 rounded-xl text-white/60 hover:text-white transition-colors duration-200 cursor-pointer"
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
      </aside>

      <!-- MAIN CONTENT -->
      <div class="flex flex-col flex-1 min-w-0 lg:pl-16">
      <!-- Top header bar -->
      <header class="flex items-center justify-between px-4 md:px-8 lg:px-12 py-3 sticky top-0 z-10 max-w-[95%] xl:max-w-[1600px] mx-auto w-full">
        <!-- Left: Page title -->
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-widest font-medium">{{ timeGreeting }}</p>
          <h1 class="text-2xl font-bold text-gray-800 leading-tight lg:text-xl">
            Welcome back, <span class="text-indigo-600 capitalize">{{ state.petName || 'Flarepup' }}</span> 👋
          </h1>
        </div>
        <!-- Center: Search bar (placeholder, desktop only) -->
        <div class="hidden lg:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 w-64">
          <svg class="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Search..." class="bg-transparent text-xs text-gray-500 placeholder-gray-400 outline-none w-full" disabled/>
        </div>
        <!-- Right: mobile avatar + desktop controls -->
        <div class="flex items-center gap-3">
          <!-- Mobile-only profile avatar placeholder -->
          <div class="lg:hidden w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center" title="Coming soon">
            <span class="text-sm font-semibold text-slate-500">{{ (state.petName || 'F')[0].toUpperCase() }}</span>
          </div>
          <!-- Desktop: Notification + Avatar -->
          <div class="hidden lg:flex items-center gap-3">
            <button class="relative p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" title="Coming soon">
              <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"/>
            </button>
            <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-xl px-2 py-1 transition-colors" title="Coming soon">
              <div class="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                <span class="text-xs font-semibold text-indigo-600">{{ (state.petName || 'F')[0].toUpperCase() }}</span>
              </div>
              <span class="text-xs font-medium text-gray-700">{{ state.petName || 'Flarepup' }}</span>
            </div>
          </div>
        </div>
      </header>
      <main class="flex-1 min-w-0 overflow-y-auto pb-20 lg:pb-0">

        <!-- Progress view -->
        <div v-if="activeView === 'progress'" class="p-4 lg:p-6">
          <ProgressDashboard />
        </div>

        <!-- Workouts view -->
        <div v-if="activeView === 'workouts'">
          <WorkoutsView />
        </div>

        <!-- Overview view -->
        <div v-if="activeView === 'overview'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-8 lg:px-12 py-4 lg:py-6 items-start max-w-[95%] xl:max-w-[1600px] mx-auto w-full font-sans transition-all duration-500">
          
          <!-- Lane 1: Primary Flow (Weight, Movement, Training) -->
          <div class="flex flex-col gap-6 w-full h-fit order-1 transition-all duration-500">
            
            
            <!-- Misc Movement: Static Middle Priority -->
            <WorkoutLogger class="order-2" />
            
            <MyWorkoutsPreview 
              :class="[hasLoggedWeightToday ? 'order-first ring-2 ring-orange-100 bg-gradient-to-br from-white to-orange-50/20 shadow-2xl shadow-orange-200/30' : 'order-3 opacity-90']"
              class="transition-all duration-500"
            />
          </div>

          <!-- Lane 2: Evolve track — Col 2 (Pet & Stats) -->
          <div class="flex flex-col gap-6 w-full h-fit order-2 lg:col-start-2">
            <Pet />
            
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
              :class="[!hasLoggedWeightToday ? 'order-first ring-2 ring-indigo-500/10' : 'order-last opacity-80 scale-[0.98]']" 
              class="transition-all duration-500"
            />
            
            <!-- Diet Habits (Restored Tabbed Panel) -->
            <div class="bg-gradient-to-br from-white to-indigo-50 rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-100/30 p-4 md:p-6 overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-200/50">
              <div class="flex border-b border-gray-100 px-2">
                <button
                  v-for="tab in [
                    { id: 'diet',     label: 'Diet' },
                    { id: 'meals',    label: 'Meals' },
                    { id: 'calories', label: 'Cals' },
                    { id: 'protein',  label: 'Protein' },
                  ]"
                  :key="tab.id"
                  @click="activeRightTab = tab.id"
                  :class="activeRightTab === tab.id
                    ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold'
                    : 'border-b-2 border-transparent text-gray-400 hover:text-gray-600'"
                  class="flex-1 text-[10px] font-bold uppercase tracking-wider py-3 px-1 transition-colors -mb-px cursor-pointer"
                >{{ tab.label }}</button>
              </div>
              <div class="min-h-[300px]">
                <div v-show="activeRightTab === 'diet'"><DietHabits /></div>
                <div v-show="activeRightTab === 'meals'"><MealLogger /></div>
                <div v-show="activeRightTab === 'calories'"><CaloriesTracker /></div>
                <div v-show="activeRightTab === 'protein'"><ProteinCounter /></div>
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
    <WeeklyReportModal />

    <!-- Reset confirmation modal -->
    <div
      v-if="showResetModal"
      class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      @click.self="showResetModal = false"
    >
      <div class="bg-white rounded-2xl p-6 shadow-lg max-w-sm w-full mx-4">
        <h2 class="font-medium text-gray-800 mb-2">Reset everything?</h2>
        <p class="text-sm text-gray-500 mb-6">This will erase all your progress, workouts, and data. This cannot be undone.</p>
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
import { onMounted, ref, computed } from 'vue'
import Header from './components/Header.vue'
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
import WeeklyReportModal from './components/WeeklyReportModal.vue'
import { state } from './store/state.js'
import { resetState, saveState } from './store/persistence.js'
import { checkDayRollover } from './utils/dates.js'
import { scheduleReminder } from './utils/reminder.js'
import { canLogRestDay, logRestDay, getRestDaysThisWeek } from './utils/restDay.js'
import { showWeeklyReport, getThisMonday } from './utils/weeklyReport.js'
import { activeView } from './composables/useActiveView.js'

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

onMounted(() => {
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
})

// activeView is imported from composables/useActiveView.js (shared with MyWorkoutsPreview)
const activeRightTab = ref('diet')
const railExpanded = ref(false)
const showResetModal = ref(false)

function handleReset() {
  resetState(state)
  showResetModal.value = false
}
</script>
