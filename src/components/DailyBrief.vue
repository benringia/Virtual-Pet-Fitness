<template>
  <div class="p-5 bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-2xl shadow-indigo-100/20">
    
    <!-- Header: Horizontal Calendar / Daily Slider -->
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
        <svg class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
        Daily Brief
      </h3>
      <button @click="showFullMonth = !showFullMonth" class="text-[10px] font-semibold text-indigo-500 hover:text-indigo-700 uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1 bg-indigo-50/50 hover:bg-indigo-100 px-3 py-1.5 rounded-full">
        {{ showFullMonth ? 'Hide Month' : 'Full Month' }}
      </button>
    </div>

    <!-- Calendar Expander -->
    <div v-show="showFullMonth" class="mb-6 bg-white/50 backdrop-blur-md rounded-3xl p-3 border border-indigo-50/50 shadow-inner">
      <WorkoutCalendar :workoutSets="workoutSets" :workoutSessions="workoutSessions" />
    </div>

    <!-- Horizontal Week -->
    <div v-show="!showFullMonth" class="flex justify-between items-center mb-6 px-1">
      <button v-for="day in weekDays" :key="day.date" @click="selectedDate = day.date"
        class="flex flex-col items-center justify-center w-[46px] h-14 rounded-2xl transition-all cursor-pointer relative"
        :class="day.date === selectedDate ? 'bg-indigo-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.3)] scale-105' : 'bg-transparent text-slate-400 hover:bg-white/60'">
        <span class="text-[9px] font-bold uppercase tracking-wider mb-0.5" :class="day.date === selectedDate ? 'text-indigo-200' : 'text-slate-400'">{{ day.dayName }}</span>
        <span class="text-sm font-bold" :class="day.date === selectedDate ? 'text-white' : 'text-slate-700'">{{ day.dayNumber }}</span>
        
        <!-- Activity Dot -->
        <span v-if="datesWithActivity.has(day.date)" class="absolute bottom-1 w-1 h-1 rounded-full"
          :class="day.date === selectedDate ? 'bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]' : 'bg-indigo-400 shadow-[0_0_4px_rgba(129,140,248,0.5)]'"></span>
      </button>
    </div>

    <!-- Session Display -->
    <div v-if="sessionsForSelectedDate.length === 0" class="text-center py-10 bg-white/50 rounded-3xl border border-dashed border-slate-200 shadow-inner">
      <p class="text-3xl mb-3">🧘‍♂️</p>
      <p class="text-sm font-semibold text-slate-500">Rest Day</p>
      <p class="text-[11px] text-slate-400 mt-1" v-if="selectedDate === todayStr()">No sessions logged for today.</p>
    </div>

    <div v-else class="relative">
      <div 
        ref="scrollContainer" 
        @scroll="handleScroll"
        class="flex flex-col gap-4 scrollbar-thin scrollbar-thumb-slate-200 pb-6 transition-all duration-300"
        :class="[
          sessionsForSelectedDate.length > 1 ? 'max-h-[480px] overflow-y-auto snap-y snap-proximity scroll-smooth' : 'h-auto',
          editingSessionId ? 'overflow-hidden' : ''
        ]"
      >
        <div v-for="sess in sessionsForSelectedDate" :key="sess.id" class="relative overflow-hidden p-5 pl-6 rounded-3xl border border-white transition-all duration-300 shadow-sm"
          :class="[
            sessionsForSelectedDate.length > 1 ? 'snap-start shrink-0' : '',
            getCategory(sess) === 'calisthenics' ? 'bg-amber-50/30' : 'bg-indigo-50/30', 
            editingSessionId === sess.id ? 'ring-2 ring-indigo-200 scale-[1.01]' : ''
          ]">
        
        <!-- Accent Bar -->
        <div class="absolute inset-y-5 left-2.5 w-[3px] rounded-full" 
          :class="[
            getCategory(sess) === 'calisthenics' ? 'bg-gradient-to-b from-amber-400 to-orange-500' : 'bg-gradient-to-b from-indigo-500 to-violet-500',
            isPastDate ? 'opacity-60' : ''
          ]"></div>
          
        <!-- Date Label Top & Actions -->
        <div class="flex items-start justify-between mb-3">
          <p class="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 mt-1">
            {{ formatLongDate(sess.date) }}
          </p>
          
          <div class="flex items-center gap-2">
            <!-- Edit Actions -->
            <template v-if="!isPastDate">
              <template v-if="editingSessionId === sess.id">
                <button @click="cancelEdit()" class="text-[10px] font-semibold text-slate-400 hover:text-slate-600 uppercase tracking-widest cursor-pointer px-1">
                  Cancel
                </button>
              </template>
              <template v-else>
                <button @click="startEdit(sess)" class="text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer p-1" aria-label="Edit session">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                </button>
                <button @click="!isPastDate && $emit('delete-session', sess.id)" class="text-slate-300 hover:text-red-400 transition-colors cursor-pointer p-1" aria-label="Delete session">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                </button>
              </template>
            </template>
            <template v-else>
              <svg class="text-slate-200 w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd"/></svg>
            </template>
          </div>
        </div>

        <!-- Title block & Ribbon in flex -->
        <div class="flex justify-between items-start mb-3 gap-3">
          
          <h3 v-if="editingSessionId !== sess.id" class="text-sm font-semibold text-slate-900 tracking-tight capitalize flex-1 truncate">{{ sess.label || 'Untitled Session' }}</h3>
          <input v-else v-model="editDraft.label" type="text" placeholder="Session Name"
            class="block flex-1 text-sm font-semibold capitalize bg-white/50 border border-slate-100 rounded-xl px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-300 text-slate-900 min-w-0"/>
          
          <!-- Ribbon (Stats) -->
          <div class="flex items-center gap-1.5 shrink-0 border border-slate-100/50 bg-transparent px-3 py-1 rounded-xl">
            <span class="text-[9px] font-semibold uppercase tracking-wider" :class="getCategory(sess) === 'calisthenics' ? 'text-amber-600' : 'text-indigo-600'">
              {{ getCategory(sess) === 'calisthenics' ? '🤸 Cali' : '🏋️ BB' }}
            </span>
            <span class="w-1 h-1 rounded-full bg-slate-200"></span>
            <span class="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
              <template v-if="editingSessionId === sess.id">
                {{ getCategory(sess) === 'bodybuilding' ? `Vol: ${editDraft.exercises.reduce((acc, e) => acc + ((Number(e.weight)||0) * Number(e.reps) * Number(e.sets)), 0)} KG` : `Reps: ${editDraft.exercises.reduce((acc, e) => acc + (Number(e.reps) * Number(e.sets)), 0)}` }}
              </template>
              <template v-else>
                {{ getCategory(sess) === 'bodybuilding' ? `Vol: ${sess.exercises.reduce((acc, e) => acc + (e.weight * Number(e.reps) * Number(e.sets)), 0)} KG` : `Reps: ${sess.exercises.reduce((acc, e) => acc + (Number(e.reps) * Number(e.sets)), 0)}` }}
              </template>
            </span>
            <span class="w-1 h-1 rounded-full bg-slate-200"></span>
            <span class="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
              {{ editingSessionId === sess.id ? editDraft.exercises.length : sess.exercises.length }} EX
            </span>
          </div>
        </div>

        <!-- Exercises List Loop -->
        <div class="space-y-2 border-t border-slate-200/40 pt-4">
          <template v-if="editingSessionId === sess.id">
            <!-- EDITING EXERCISES -->
            <div v-for="(ex, idx) in editDraft.exercises" :key="'edit-'+idx" class="flex flex-col gap-1.5 bg-white/40 p-2.5 rounded-xl border border-slate-100 shadow-sm relative pr-10">
              <button @click="removeExercise(idx)" class="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-400 hover:text-red-400 hover:bg-white hover:border-red-200 transition-all font-semibold cursor-pointer shrink-0">
                <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
              </button>

              <input v-model="ex.name" type="text" placeholder="e.g. Pull Ups"
                class="block w-full text-[13px] text-slate-700 font-medium capitalize bg-slate-50/50 border border-slate-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-300"/>
              
              <div class="grid grid-cols-3 gap-2 mt-1 pr-1">
                <div v-if="getCategory(editDraft) === 'bodybuilding'" class="flex flex-col">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">WEIGHT</span>
                  <input v-model="ex.weight" type="number" placeholder="kg" class="w-full text-[11px] font-normal uppercase bg-slate-50/50 border border-slate-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-300 text-center"/>
                </div>
                <div class="flex flex-col">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">SETS</span>
                  <input v-model="ex.sets" type="number" placeholder="0" class="w-full text-[11px] font-normal uppercase bg-slate-50/50 border border-slate-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-300 text-center"/>
                </div>
                <div class="flex flex-col">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">REPS</span>
                  <input v-model="ex.reps" type="number" placeholder="0" class="w-full text-[11px] font-normal uppercase bg-slate-50/50 border border-slate-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-300 text-center"/>
                </div>
              </div>
              <div class="mt-0.5 flex justify-end">
                <span class="text-[9px] font-semibold text-indigo-500 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm whitespace-nowrap">
                  1RM <span class="text-[9px] font-normal opacity-70">~</span>{{ Math.round(calc1RM(Number(ex.weight)||0, Number(ex.reps)||0)) }}KG
                </span>
              </div>
            </div>

            <!-- Add Exercise Ghost Button -->
            <button @click="addExercise" class="w-full mt-2 py-2 rounded-xl border border-dashed border-indigo-200 text-indigo-500 hover:bg-white text-[11px] font-semibold transition-all cursor-pointer">
              + Add Exercise
            </button>
            <p v-if="editError" class="text-[10px] text-red-500 font-semibold mb-2">{{ editError }}</p>

            <button @click="isValidEdit && saveEdit()" :disabled="!isValidEdit"
              class="w-full mt-3 py-2 text-[12px] font-medium text-white rounded-xl shadow-sm transition-all"
              :class="isValidEdit ? 'bg-gradient-to-r from-indigo-500 to-violet-500 hover:scale-[1.02] cursor-pointer' : 'bg-slate-300 opacity-50 cursor-not-allowed'">
              Save Changes
            </button>
          </template>

          <template v-else>
            <!-- NON-EDITING LIST -->
            <div v-for="ex in sess.exercises" :key="ex.name" class="flex flex-col gap-0.5">
              <div class="flex items-center justify-between">
                <span class="text-[13px] font-medium text-slate-700 capitalize line-clamp-1 pr-2">{{ ex.name }}</span>
                <span v-if="ex.oneRM > 0" class="text-[9px] font-semibold text-indigo-500 bg-white px-2 py-0.5 rounded-lg border border-slate-100 shadow-sm shrink-0">
                  1RM <span class="text-[9px] font-normal opacity-70">~</span>{{ Math.round(ex.oneRM) }}KG
                </span>
              </div>
              <span class="text-[10px] font-normal text-slate-400 uppercase tracking-wide">
                <template v-if="getCategory(sess) === 'calisthenics'">
                  <template v-if="ex.weight > 0">{{ ex.weight }}KG • {{ ex.sets }} SETS • {{ ex.reps }} REPS</template>
                  <template v-else-if="ex.sets > 1">{{ ex.sets }} SETS • {{ ex.reps }} REPS</template>
                  <template v-else>{{ ex.reps }} REPS</template>
                </template>
                <template v-else>
                  {{ ex.weight || 0 }}KG • {{ ex.sets }} SETS • {{ ex.reps }} REPS
                </template>
              </span>
            </div>
          </template>
        </div> <!-- End Exercises List Loop -->
        </div> <!-- End sess loop -->
      </div> <!-- End scroll container -->

      <!-- Pagination Dots -->
      <div v-if="sessionsForSelectedDate.length > 1" class="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1.5 pb-1">
        <span v-for="(_, i) in sessionsForSelectedDate" :key="i"
          class="w-1.5 h-1.5 rounded-full transition-colors"
          :class="i === activeSessionIndex ? 'bg-indigo-600' : 'bg-slate-300'">
        </span>
      </div>
      
      <!-- Scroll Hint Fade -->
      <div v-if="sessionsForSelectedDate.length > 1 && !editingSessionId" class="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white/80 to-transparent pointer-events-none rounded-b-[2.5rem]"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import WorkoutCalendar from './WorkoutCalendar.vue'
import { selectedDate } from '../composables/useSelectedDate.js'
import { todayStr } from '../utils/dates.js'
import { calc1RM } from '../utils/workoutMath.js'

const props = defineProps({
  sessionsForSelectedDate: { type: Array, required: true },
  workoutSessions: { type: Array, required: true },
  workoutSets: { type: Array, required: true },
})

const emit = defineEmits(['delete-session', 'update-session'])

const showFullMonth = ref(false)

const getCategory = (sess) => sess.category || 'bodybuilding'

const formatLongDate = (dateString) => {
  if (!dateString) return ''
  const [y, m, d] = dateString.split('-')
  const date = new Date(y, m - 1, d)
  const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  return formatter.format(date)
}

const datesWithActivity = computed(() => {
  const s = new Set()
  for (const ws of props.workoutSets) if (ws.date) s.add(ws.date)
  for (const ws of props.workoutSessions) if (ws.date) s.add(ws.date)
  return s
})

const weekDays = computed(() => {
  const spl = selectedDate.value.split('-')
  const base = new Date(spl[0], Number(spl[1]) - 1, spl[2])
  
  const dayOfWeek = base.getDay()
  const sun = new Date(base)
  sun.setDate(base.getDate() - dayOfWeek)
  
  const arr = []
  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  for (let i = 0; i < 7; i++) {
    const d = new Date(sun)
    d.setDate(sun.getDate() + i)
    
    arr.push({
      date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      dayName: shortDays[i],
      dayNumber: String(d.getDate())
    })
  }
  return arr
})

const isPastDate = computed(() => selectedDate.value < todayStr())

// ── Editing State ──
const editingSessionId = ref(null)
const editDraft = ref(null)
const editError = ref('')

function startEdit(sess) {
  if (isPastDate.value) return
  editError.value = ''
  editingSessionId.value = sess.id
  editDraft.value = JSON.parse(JSON.stringify(sess)) // Deep clone array of exercises
}

function cancelEdit() {
  editingSessionId.value = null
  editDraft.value = null
  editError.value = ''
}

const isValidEdit = computed(() => {
  if (!editDraft.value || !editDraft.value.label.trim() || editDraft.value.exercises.length === 0) return false
  return !editDraft.value.exercises.some(e => !e.name.trim() || Number(e.reps) <= 0)
})

function addExercise() {
  editDraft.value.exercises.push({ name: '', weight: '', sets: '', reps: '' })
}

function removeExercise(idx) {
  editDraft.value.exercises.splice(idx, 1)
}

function saveEdit() {
  editError.value = ''
  
  if (!editDraft.value.label.trim()) {
    editError.value = 'Session name is required.'
    return
  }
  
  if (editDraft.value.exercises.length === 0) {
    editError.value = 'Add at least one exercise.'
    return
  }

  const invalid = editDraft.value.exercises.some(e => !e.name.trim() || Number(e.reps) <= 0)
  if (invalid) {
    editError.value = 'Exercises need a name and reps.'
    return
  }

  // Recalculate 1RM for all payload objects
  editDraft.value.exercises.forEach(e => {
    e.weight = Number(e.weight) || 0
    e.sets = Number(e.sets) || 1
    e.reps = Number(e.reps) || 0
    e.oneRM = e.weight ? calc1RM(e.weight, e.reps) : 0
  })

  // Submit via emit to parent App flow
  emit('update-session', editDraft.value)
  
  cancelEdit() // Return to read mode
}

// ── Scrolling State ──
const scrollContainer = ref(null)
const activeSessionIndex = ref(0)

function handleScroll() {
  if (!scrollContainer.value || props.sessionsForSelectedDate.length <= 1) return
  const el = scrollContainer.value
  const itemHeight = el.scrollHeight / props.sessionsForSelectedDate.length
  activeSessionIndex.value = Math.round(el.scrollTop / itemHeight)
}

watch(() => selectedDate.value, () => {
  activeSessionIndex.value = 0
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = 0
  }
})
</script>
