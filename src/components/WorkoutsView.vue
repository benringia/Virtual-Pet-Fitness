<template>
  <div class="p-4 lg:p-6">

    <!-- Header -->
    <div class="flex items-center justify-between mb-5">
      <div>
        <h2 class="text-xl font-bold text-gray-800">My Training</h2>
        <p class="text-xs text-gray-400 mt-0.5">
          <span v-if="recentSessions.length">{{ recentSessions.length }} session{{ recentSessions.length !== 1 ? 's' : '' }} logged</span>
          <span v-else>No sessions yet — start below</span>
        </p>
      </div>
      <button @click="activeView = 'tracker'"
        class="flex items-center gap-1.5 text-xs font-medium text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-colors cursor-pointer">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>
        Back to Tracker
      </button>
    </div>

    <!-- Category toggle -->
    <div class="flex gap-2 mb-5">
      <button v-for="cat in CATEGORIES" :key="cat.id"
        @click="state.trainingCategory = cat.id"
        :class="state.trainingCategory === cat.id
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer">
        <span>{{ cat.emoji }}</span><span>{{ cat.label }}</span>
      </button>
    </div>

    <!-- ════════════════════════════════════════════
         LOG NEW SESSION CARD
    ════════════════════════════════════════════ -->
    <div class="bg-white rounded-2xl border border-indigo-100 shadow-sm mb-5 overflow-hidden">
      <!-- Card header -->
      <button @click="sessionFormOpen = !sessionFormOpen"
        class="w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-indigo-50/50 transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
          </div>
          <span class="text-sm font-bold text-gray-800">Log New Session</span>
          <span v-if="draftSession.exercises.length" class="text-[11px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{{ draftSession.exercises.length }} exercise{{ draftSession.exercises.length !== 1 ? 's' : '' }}</span>
        </div>
        <svg class="w-4 h-4 text-gray-400 transition-transform" :class="sessionFormOpen ? 'rotate-180' : ''" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
        </svg>
      </button>

      <!-- Form body -->
      <Transition name="slide-down">
        <div v-if="sessionFormOpen" class="px-5 pb-5 border-t border-indigo-50">

          <!-- Session label -->
          <div class="mt-4 mb-4">
            <label class="block text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1.5">Session Label</label>
            <input v-model="draftSession.label" type="text" maxlength="40"
              placeholder="e.g. Push Day · Chest & Triceps"
              class="w-full text-sm font-semibold text-gray-800 placeholder-gray-300 border border-indigo-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-indigo-50/30"/>
          </div>

          <!-- Exercise rows -->
          <div v-if="draftSession.exercises.length" class="mb-3 space-y-2">
            <div class="grid text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1"
              :style="state.trainingCategory === 'calisthenics' ? 'grid-template-columns: 1fr 5rem 4rem 2rem' : 'grid-template-columns: 1fr 5rem 4rem 4rem 2rem'">
              <span class="pl-1">Exercise</span>
              <span class="text-center">{{ state.trainingCategory === 'calisthenics' ? '+kg opt.' : 'Weight' }}</span>
              <span class="text-center">Sets</span>
              <span class="text-center">Reps</span>
              <span/>
            </div>
            <div v-for="(ex, i) in draftSession.exercises" :key="i"
              class="grid items-center gap-1.5 bg-gray-50 rounded-xl px-2 py-1.5"
              :style="state.trainingCategory === 'calisthenics' ? 'grid-template-columns: 1fr 5rem 4rem 4rem 2rem' : 'grid-template-columns: 1fr 5rem 4rem 4rem 2rem'">
              <input v-model="ex.name" type="text" maxlength="30" placeholder="Bench Press"
                class="min-h-10 text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white w-full"/>
              <input v-model="ex.weight" type="number" inputmode="decimal" min="0" step="0.5"
                :placeholder="state.trainingCategory === 'calisthenics' ? '0' : 'kg'"
                class="min-h-10 text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white text-center w-full"/>
              <input v-model="ex.sets" type="number" inputmode="numeric" min="1" placeholder="3"
                class="min-h-10 text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white text-center w-full"/>
              <input v-model="ex.reps" type="number" inputmode="numeric" min="1" placeholder="10"
                class="min-h-10 text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white text-center w-full"/>
              <button @click="removeExercise(i)" class="text-gray-300 hover:text-red-400 transition-colors cursor-pointer flex items-center justify-center" aria-label="Remove exercise">
                <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
              </button>
            </div>
          </div>

          <!-- Add exercise button -->
          <button @click="addExercise"
            class="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-indigo-200 text-indigo-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 text-xs font-medium transition-all cursor-pointer mb-4">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            Add Exercise to Session
          </button>

          <!-- Save error -->
          <p v-if="saveError" class="text-xs text-red-500 mb-3">{{ saveError }}</p>

          <!-- Save button -->
          <button @click="saveSession"
            :disabled="!draftSession.exercises.length"
            class="w-full py-3 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
            💾 Save Session
          </button>
        </div>
      </Transition>
    </div>

    <!-- ════════════════════════════════════════════
         CALENDAR (collapsible, compact)
    ════════════════════════════════════════════ -->
    <div class="mb-5">
      <button @click="calendarOpen = !calendarOpen"
        class="flex items-center gap-2 text-xs font-medium text-indigo-500 hover:text-indigo-700 mb-2 cursor-pointer transition-colors">
        <svg class="w-3.5 h-3.5 transition-transform" :class="calendarOpen ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
        {{ calendarOpen ? 'Hide' : 'Show' }} Calendar
      </button>
      <Transition name="slide-down">
        <WorkoutCalendar v-if="calendarOpen"
          :workoutSets="state.workoutSets ?? []"
          :workoutSessions="state.workoutSessions ?? []" />
      </Transition>
    </div>

    <!-- ════════════════════════════════════════════
         WORKOUT TYPE ACCORDIONS (read-only summary)
    ════════════════════════════════════════════ -->
    <div class="mb-3 flex items-center gap-1.5 px-1">
      <svg class="w-4 h-4 text-indigo-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
      <span class="text-[10px] font-semibold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full">Workout Types</span>
    </div>

    <div class="columns-1 lg:columns-2 gap-4 mb-6">

      <div v-for="wt in visibleTypes" :key="wt.id"
        class="break-inside-avoid mb-4 rounded-2xl border bg-white shadow-sm overflow-hidden transition-all"
        :class="openWorkout === wt.id ? 'border-indigo-100 border-l-4' : 'border-gray-100'"
        :style="openWorkout === wt.id ? { borderLeftColor: wt.color } : {}">

        <!-- Accordion header -->
        <div class="flex items-center" :class="openWorkout === wt.id ? 'bg-indigo-50/50' : 'bg-white'">
          <button class="flex-1 flex items-center gap-2 px-4 py-3 min-h-11 cursor-pointer" @click="toggleAccordion(wt.id)">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" :class="WORKOUT_META[wt.name]?.dot" :style="!WORKOUT_META[wt.name] ? { backgroundColor: wt.color } : {}"/>
            <span class="text-sm font-semibold text-gray-700 capitalize">{{ wt.name }}</span>
            <span class="text-[11px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-medium ml-1">{{ sessionCounts[wt.name] ?? 0 }}</span>
            <svg class="w-4 h-4 text-gray-400 ml-auto transition-transform" :class="{ 'rotate-180': openWorkout === wt.id }" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
            </svg>
          </button>
          <button v-if="!DEFAULT_TYPE_IDS.includes(wt.id)" @click="confirmDeleteId = confirmDeleteId === wt.id ? null : wt.id"
            class="pr-3 pl-1 py-3 cursor-pointer text-gray-300 hover:text-red-400 transition-colors" aria-label="Remove type">
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
          </button>
        </div>

        <!-- Delete confirm -->
        <div v-if="confirmDeleteId === wt.id" class="bg-red-50 px-4 py-2 flex items-center gap-2 border-t border-red-100">
          <span class="text-xs text-red-700 flex-1">Remove {{ wt.name }}?</span>
          <button @click="removeWorkoutType(wt.id)" class="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-2.5 py-1 rounded-full cursor-pointer">Remove</button>
          <button @click="confirmDeleteId = null" class="text-xs font-medium text-gray-500 px-2.5 py-1 rounded-full cursor-pointer">Keep</button>
        </div>

        <!-- Accordion body — read-only last-session summary -->
        <div v-if="openWorkout === wt.id" class="border-t border-indigo-50 px-4 py-4 bg-white">
          <template v-if="DEFAULT_TYPE_IDS.includes(wt.id)">
            <!-- Default types: show WORKOUT_SUBTYPES reference + XP today -->
            <div class="mb-3">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-gray-500">XP today</span>
                <span class="text-xs font-semibold text-indigo-600">{{ todayXP[wt.name] ?? 0 }} / {{ WORKOUT_CAP }}</span>
              </div>
              <div class="w-full bg-indigo-100 rounded-full h-1.5">
                <div class="bg-indigo-500 h-1.5 rounded-full" :style="{ width: Math.min(((todayXP[wt.name] ?? 0) / WORKOUT_CAP) * 100, 100) + '%' }"/>
              </div>
            </div>
            <p class="text-[11px] text-gray-400 mb-2 font-medium uppercase tracking-widest">Subtypes</p>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="sub in (WORKOUT_SUBTYPES[wt.name] ?? [])" :key="sub.label"
                class="text-[11px] px-2.5 py-1 bg-indigo-50 text-indigo-500 rounded-full border border-indigo-100">
                {{ sub.label }} +{{ sub.xp }}
              </span>
            </div>
            <p class="text-[11px] text-gray-300 mt-3 italic">Use the session logger above to record sets.</p>
          </template>

          <template v-else>
            <!-- User-defined types: show subtypes + last session -->
            <div v-if="(wt.subtypes ?? []).length">
              <p class="text-[11px] text-gray-400 mb-2 uppercase tracking-widest font-medium">Subtypes</p>
              <div class="flex flex-wrap gap-1.5 mb-3">
                <span v-for="sub in wt.subtypes" :key="sub.label"
                  class="text-[11px] px-2.5 py-1 bg-indigo-50 text-indigo-500 rounded-full border border-indigo-100">
                  {{ sub.label }} +{{ sub.xp }}
                </span>
              </div>
            </div>
            <p v-else class="text-xs text-gray-400 italic mb-2">No subtypes — add one below</p>

            <!-- Add subtype inline -->
            <div v-if="showSubForm === wt.id" class="mt-2 flex items-end gap-2">
              <div class="flex flex-col flex-1">
                <input v-model="newSubName" @keydown.enter="addSubtype(wt)" type="text" maxlength="30" placeholder="subtype name"
                  class="text-xs border border-indigo-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-300"/>
              </div>
              <input v-model.number="newSubXp" type="number" min="5" max="80"
                class="w-14 text-xs border border-indigo-100 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-1 focus:ring-indigo-300"/>
              <button @click="addSubtype(wt)" class="bg-indigo-600 text-white text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer">Add</button>
            </div>
            <p v-if="subError && showSubForm === wt.id" class="text-xs text-red-500 mt-1">{{ subError }}</p>
            <button v-if="(wt.subtypes ?? []).length < 8" @click="toggleSubForm(wt.id)"
              class="mt-1 text-xs text-gray-400 hover:text-indigo-400 transition-colors cursor-pointer underline-offset-2 hover:underline">
              <span v-if="showSubForm !== wt.id">+ add subtype</span>
              <span v-else>cancel</span>
            </button>
          </template>
        </div>
      </div>

      <!-- Show/hide inactive -->
      <div v-if="inactiveTypeCount > 0" class="break-inside-avoid mb-4">
        <button @click="showAllTypes = !showAllTypes"
          class="w-full text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 cursor-pointer px-4 py-2 rounded-full text-center transition-colors">
          {{ showAllTypes ? 'Hide inactive types ▴' : `Show ${inactiveTypeCount} more ▾` }}
        </button>
      </div>

      <!-- Add custom type -->
      <div v-if="!showAddForm" class="break-inside-avoid mb-4">
        <button @click="showAddForm = true"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-indigo-200 text-indigo-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer text-sm font-medium">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"/></svg>
          Add a custom workout type
        </button>
      </div>

      <div v-if="showAddForm" class="break-inside-avoid bg-white border border-indigo-100 rounded-xl p-4 mb-4">
        <p class="text-xs text-indigo-500 uppercase tracking-widest mb-2">New workout type</p>
        <input v-model="newTypeName" @keydown.enter="addWorkoutType" type="text" maxlength="30" placeholder="e.g. Cycling"
          class="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
        <p v-if="addError" class="text-xs text-red-500 mb-2">{{ addError }}</p>
        <div class="flex gap-2 mb-3">
          <button v-for="c in COLOR_SWATCHES" :key="c" @click="newTypeColor = c"
            :style="{ backgroundColor: c }"
            :class="newTypeColor === c ? 'ring-2 ring-offset-1 ring-indigo-500' : ''"
            class="w-5 h-5 rounded-full cursor-pointer"/>
        </div>
        <div class="flex gap-2">
          <button @click="addWorkoutType" class="text-sm px-4 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer font-medium">Add</button>
          <button @click="cancelAdd" class="text-sm px-4 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer">Cancel</button>
        </div>
      </div>

    </div>

    <!-- ════════════════════════════════════════════
         RECENT SESSIONS TABLE
    ════════════════════════════════════════════ -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-3 px-1">
        <svg class="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"/></svg>
        <span class="text-[10px] font-semibold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full">Recent Sessions</span>
        <span v-if="allSessions.length > 10" class="text-[10px] text-gray-400">Showing last 10 of {{ allSessions.length }}</span>
      </div>

      <div v-if="recentSessions.length === 0"
        class="bg-white border border-dashed border-gray-200 rounded-2xl px-6 py-8 text-center">
        <p class="text-3xl mb-2">🏋️</p>
        <p class="text-sm font-medium text-gray-500">No sessions yet</p>
        <p class="text-xs text-gray-400 mt-1">Log your first session using the form above.</p>
      </div>

      <div v-else class="space-y-3">
        <div v-for="sess in recentSessions" :key="sess.id"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <!-- Session header -->
          <div class="flex items-center justify-between px-4 py-3 bg-indigo-50/40 border-b border-indigo-50">
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-gray-800">{{ sess.label || 'Untitled Session' }}</span>
              <span class="text-[10px] bg-white border border-indigo-100 text-indigo-400 px-2 py-0.5 rounded-full font-medium">{{ formatDate(sess.date) }}</span>
            </div>
            <button @click="deleteSession(sess.id)" class="text-gray-300 hover:text-red-400 transition-colors cursor-pointer" aria-label="Delete session">
              <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
            </button>
          </div>
          <!-- Exercise rows -->
          <div class="divide-y divide-gray-50">
            <div v-for="ex in sess.exercises" :key="ex.name" class="flex items-center justify-between px-4 py-2.5">
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <span class="text-sm font-medium text-gray-700 truncate">{{ ex.name }}</span>
                <span class="text-[11px] text-gray-400 shrink-0">
                  {{ ex.weight ? `${ex.weight} kg ×` : '' }} {{ ex.sets }} sets × {{ ex.reps }} reps
                </span>
              </div>
              <div class="flex items-center gap-1.5 shrink-0 ml-2">
                <span v-if="ex.oneRM" class="text-[11px] font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                  1RM ~{{ Math.round(ex.oneRM) }} kg
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { state } from '../store/state.js'
import { WORKOUT_SUBTYPES, WORKOUT_META, WORKOUT_CAP, addXP } from '../utils/xp.js'
import { todayStr, maybeSetStartDate } from '../utils/dates.js'
import { updateWorkoutStreak } from '../utils/streaks.js'
import { setMood } from '../utils/pet.js'
import { computeMood, willStreakBreak } from '../utils/mood.js'
import { triggerAchievement } from '../utils/achievements.js'
import { activeView } from '../composables/useActiveView.js'
import { calc1RM } from '../utils/workoutMath.js'
import WorkoutCalendar from './WorkoutCalendar.vue'

// ── Constants ──
const DEFAULT_TYPE_IDS = ['strength', 'walking', 'boxing', 'tennis']
const COLOR_SWATCHES   = ['#f472b6', '#60a5fa', '#f87171', '#4ade80', '#fb923c', '#a78bfa']
const CATEGORIES = [
  { id: 'bodybuilding', label: 'Body Building', emoji: '🏋️' },
  { id: 'calisthenics', label: 'Calisthenics',  emoji: '🤸' },
]

// ── UI State ──
const sessionFormOpen = ref(true)
const calendarOpen    = ref(false)
const openWorkout     = ref(null)
const showAddForm     = ref(false)
const newTypeName     = ref('')
const newTypeColor    = ref('#f472b6')
const addError        = ref('')
const confirmDeleteId = ref(null)
const newSubName      = ref('')
const newSubXp        = ref(20)
const subError        = ref('')
const showSubForm     = ref(null)
const showAllTypes    = ref(false)
const saveError       = ref('')
let recentlyAddedTimer = null
onUnmounted(() => clearTimeout(recentlyAddedTimer))

// ── Draft session ──
const draftSession = ref({ label: '', exercises: [] })

function addExercise() {
  draftSession.value.exercises.push({ name: '', weight: '', sets: 1, reps: '' })
}

function removeExercise(idx) {
  draftSession.value.exercises.splice(idx, 1)
}

function saveSession() {
  saveError.value = ''
  const exs = draftSession.value.exercises

  if (!exs.length) { saveError.value = 'Add at least one exercise.'; return }

  const valid = exs.filter(e => e.name.trim() && Number(e.reps) > 0)
  if (!valid.length) { saveError.value = 'Each exercise needs a name and rep count.'; return }

  // Compute 1RM for each exercise
  const computed = valid.map(e => ({
    name:   e.name.trim(),
    weight: Number(e.weight) || 0,
    sets:   Number(e.sets)   || 1,
    reps:   Number(e.reps),
    oneRM:  e.weight ? calc1RM(Number(e.weight), Number(e.reps)) : 0,
  }))

  const id = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`

  if (!state.workoutSessions) state.workoutSessions = []
  state.workoutSessions.push({
    id,
    date:      todayStr(),
    label:     draftSession.value.label.trim() || 'Session',
    exercises: computed,
  })

  // XP & streak (once per session)
  maybeSetStartDate(state)
  const broke = willStreakBreak(state)
  state.workouts.push({ type: 'Strength', name: draftSession.value.label || 'Session', xp: 30, date: todayStr() })
  addXP(state, 30)
  updateWorkoutStreak(state)
  setMood('workout')
  state.petMood = computeMood(state, { streakBroke: broke })
  if (state.workouts.length === 1) triggerAchievement('workout', '🏋️', 'First session!', 'Your journey begins', 'session-first')

  draftSession.value = { label: '', exercises: [] }
  sessionFormOpen.value = false
}

function deleteSession(id) {
  state.workoutSessions = (state.workoutSessions ?? []).filter(s => s.id !== id)
}

// ── Computed ──
const today = todayStr()

const allSessions = computed(() =>
  [...(state.workoutSessions ?? [])].sort((a, b) => b.timestamp - a.timestamp || b.date.localeCompare(a.date))
)
const recentSessions = computed(() => allSessions.value.slice(0, 10))

const todayXP = computed(() => {
  const totals = {}
  for (const wt of state.workoutTypes) totals[wt.name] = 0
  for (const w of state.workouts) if (w.date === today && w.type in totals) totals[w.type] += w.xp
  return totals
})

const sessionCounts = computed(() => {
  const counts = {}
  for (const wt of state.workoutTypes) counts[wt.name] = 0
  for (const w of state.workouts) if (w.type in counts) counts[w.type]++
  return counts
})

const inactiveTypeCount = computed(() =>
  state.workoutTypes.filter(wt => DEFAULT_TYPE_IDS.includes(wt.id) && (sessionCounts.value[wt.name] ?? 0) === 0).length
)

const visibleTypes = computed(() => {
  if (showAllTypes.value) return state.workoutTypes
  return state.workoutTypes.filter(wt => !DEFAULT_TYPE_IDS.includes(wt.id) || (sessionCounts.value[wt.name] ?? 0) > 0)
})

// ── Helpers ──
function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function slugify(name) { return name.toLowerCase().replace(/\s+/g, '-') }

function toggleAccordion(id) {
  openWorkout.value = openWorkout.value === id ? null : id
  showSubForm.value = null; subError.value = ''; newSubName.value = ''; newSubXp.value = 20
}

function addWorkoutType() {
  const name = newTypeName.value.trim()
  if (!name) { addError.value = 'Name is required'; return }
  if (state.workoutTypes.some(wt => wt.name.toLowerCase() === name.toLowerCase())) { addError.value = 'Already exists'; return }
  const newId = slugify(name)
  state.workoutTypes.push({ id: newId, name, color: newTypeColor.value, sessions: [], subtypes: [] })
  showAllTypes.value = true
  addXP(state, 5)
  newTypeName.value = ''; newTypeColor.value = '#f472b6'; addError.value = ''; showAddForm.value = false
}

function cancelAdd() { newTypeName.value = ''; newTypeColor.value = '#f472b6'; addError.value = ''; showAddForm.value = false }

function removeWorkoutType(id) {
  state.workoutTypes = state.workoutTypes.filter(wt => wt.id !== id)
  if (openWorkout.value === id) openWorkout.value = null
  confirmDeleteId.value = null
}

function addSubtype(wt) {
  const name = newSubName.value.trim(); const xp = Number(newSubXp.value)
  if (!name) { subError.value = 'Name required'; return }
  if (xp < 5 || xp > 80) { subError.value = 'XP must be 5–80'; return }
  const existing = wt.subtypes ?? []
  if (existing.length >= 8) { subError.value = 'Max 8'; return }
  if (existing.some(s => s.label.toLowerCase() === name.toLowerCase())) { subError.value = 'Already exists'; return }
  wt.subtypes = [...existing, { label: name, xp }]
  newSubName.value = ''; newSubXp.value = 20; subError.value = ''; showSubForm.value = null
}

function toggleSubForm(id) { showSubForm.value = showSubForm.value === id ? null : id; if (!showSubForm.value) subError.value = '' }
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
