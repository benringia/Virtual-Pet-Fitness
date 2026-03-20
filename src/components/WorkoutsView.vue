<template>
  <div class="p-4 lg:p-6 pb-20 max-w-6xl mx-auto bg-[radial-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-white min-h-screen">

    <!-- Header -->
    <div class="flex items-center justify-between mb-5">
      <div>
        <h2 class="text-xl font-extrabold tracking-tight text-slate-900">My Training</h2>
        <p class="text-xs text-gray-400 mt-0.5">
          <span v-if="allSessions.length">{{ allSessions.length }} session{{ allSessions.length !== 1 ? 's' : '' }} logged</span>
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
          ? (cat.id === 'calisthenics' ? 'bg-amber-600 text-white shadow-md border-amber-600 border' : 'bg-indigo-600 text-white shadow-md border-indigo-600 border')
          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer">
        <span>{{ cat.emoji }}</span><span>{{ cat.label }}</span>
      </button>
    </div>

    <!-- ════════════════════════════════════════════
         TWO COLUMN LAYOUT
    ════════════════════════════════════════════ -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

      <!-- LEFT COLUMN -->
      <div class="lg:col-span-7 space-y-6">

        <PetMiniWidget :isCelebrating="isCelebrating" :message="petMessage" />

        <!-- ════════════════════════════════════════════
             LOG NEW SESSION CARD
        ════════════════════════════════════════════ -->
        <div v-if="selectedDate === todayStr()" class="bg-white/70 backdrop-blur-lg rounded-3xl border-0 shadow-xl shadow-slate-200/50 overflow-hidden relative shadow-[0_0_15px_rgba(79,70,229,0.1)]">
      <!-- Card header -->
      <button @click="sessionFormOpen = !sessionFormOpen"
        class="w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-indigo-50/50 transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
          </div>
          <span class="text-sm font-bold text-gray-800">Log New Session</span>
          <span v-if="activeExerciseCount > 0" class="text-[11px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{{ activeExerciseCount }} exercise{{ activeExerciseCount !== 1 ? 's' : '' }}</span>
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
            <label class="block text-[10px] font-semibold uppercase tracking-widest text-indigo-500 mb-1.5">Session Label</label>
            <input v-model="draftSession.label" type="text" maxlength="40"
              :placeholder="state.trainingCategory === 'calisthenics' ? 'e.g. Upper Body Flow' : 'e.g. Push Day · Chest & Triceps'"
              class="w-full text-sm font-semibold text-gray-800 placeholder-gray-300 border border-indigo-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-indigo-50/30"/>
          </div>

          <!-- Exercise rows -->
          <div v-if="draftSession.exercises.length" class="mb-4 space-y-3">
            <div v-for="(ex, i) in draftSession.exercises" :key="i"
              class="grid grid-cols-12 gap-2 items-end bg-slate-50/50 rounded-2xl px-4 py-4 border border-slate-100/50">
              
              <!-- Exercise Name -->
              <div :class="state.trainingCategory === 'bodybuilding' ? 'col-span-12 lg:col-span-5' : 'col-span-12 lg:col-span-7'">
                <label class="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5 px-1">Exercise</label>
                <input v-model="ex.name" type="text" maxlength="30" :placeholder="state.trainingCategory === 'calisthenics' ? 'e.g. Muscle Up' : 'e.g. Bench Press'"
                  class="text-sm border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white w-full"/>
              </div>

              <!-- Weight -->
              <div v-if="state.trainingCategory === 'bodybuilding'" class="col-span-4 lg:col-span-2">
                <label class="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5 px-1 text-center">Weight</label>
                <input v-model="ex.weight" type="number" inputmode="decimal" min="0" step="0.5" placeholder="kg"
                  class="text-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white text-center w-full"/>
              </div>

              <!-- Sets -->
              <div :class="state.trainingCategory === 'bodybuilding' ? 'col-span-3 lg:col-span-2' : 'col-span-5 lg:col-span-2'">
                <label class="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5 px-1 text-center">Sets</label>
                <input v-model="ex.sets" type="number" inputmode="numeric" min="1" placeholder="3"
                  class="text-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white text-center w-full"/>
              </div>

              <!-- Reps -->
              <div :class="state.trainingCategory === 'bodybuilding' ? 'col-span-3 lg:col-span-2' : 'col-span-5 lg:col-span-2'">
                <label class="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5 px-1 text-center">Reps</label>
                <input v-model="ex.reps" type="number" inputmode="numeric" min="0" placeholder="10"
                  class="text-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white text-center w-full"/>
              </div>

              <!-- Delete -->
              <div class="col-span-2 lg:col-span-1 flex justify-center pb-2">
                <button v-if="i > 0" @click="removeExercise(i)" class="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer bg-white rounded-lg border border-gray-200 p-1.5 shadow-sm" aria-label="Remove exercise">
                  <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                </button>
              </div>

            </div>
          </div>

          <!-- Add exercise button -->
          <button @click="addExercise"
            class="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-indigo-200 text-indigo-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 text-xs font-medium transition-all cursor-pointer mb-4">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            Add Another Exercise
          </button>

          <!-- Save error -->
          <p v-if="saveError" class="text-xs text-red-500 mb-3">{{ saveError }}</p>

          <!-- Save button -->
          <button @click="saveSession"
            :disabled="!isValidSession"
            class="w-full py-3.5 mt-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed shadow-sm">
            💾 Save Session
          </button>
        </div>
      </Transition>
    </div>

    <!-- Pst Date State -->
    <div v-else class="bg-white/70 backdrop-blur-lg rounded-3xl border-0 shadow-xl shadow-slate-200/50 p-8 flex flex-col items-center justify-center text-center overflow-hidden">
      <p class="text-3xl mb-3">🕰️</p>
      <p class="text-sm font-extrabold tracking-tight text-slate-900">Viewing Past Records</p>
      <p class="text-xs text-slate-500 mt-1 mb-5">Historical sessions cannot be edited directly.</p>
      <button @click="selectedDate = todayStr()" class="bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold text-sm px-6 py-2 rounded-xl shadow-sm hover:bg-indigo-100 transition-colors cursor-pointer">
        Back to Today
      </button>
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
            <p class="text-[11px] text-gray-300 mt-3 italic mb-2">Use the session logger above to record sets.</p>
            
            <div v-if="lastTypeSession[wt.name]" class="mt-4 border-t border-gray-50 pt-3">
              <p class="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-2">Last Session</p>
              <div class="bg-gray-50 rounded-xl p-3 border-l-4" :class="getCategory(lastTypeSession[wt.name]) === 'calisthenics' ? 'border-amber-400' : 'border-indigo-400'">
                <p class="text-sm font-bold text-gray-700 mb-1">{{ lastTypeSession[wt.name].label || 'Untitled' }} <span class="text-[10px] font-normal text-gray-400 ml-1">{{ formatDate(lastTypeSession[wt.name].date) }}</span></p>
                <div class="space-y-1">
                  <div v-for="ex in lastTypeSession[wt.name].exercises" :key="ex.name" class="flex justify-between text-xs text-gray-600">
                    <span class="truncate pr-2 font-bold">{{ ex.name }}</span>
                    <span class="shrink-0">
                      <template v-if="ex.weight > 0">{{ ex.weight }}kg × {{ ex.sets }} sets × {{ ex.reps }} reps</template>
                      <template v-else-if="ex.sets > 1">{{ ex.sets }} sets × {{ ex.reps }} reps</template>
                      <template v-else>{{ ex.reps }} reps</template>
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
            
            <div v-if="lastTypeSession[wt.name]" class="mt-4 border-t border-gray-50 pt-3">
              <p class="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-2">Last Session</p>
              <div class="bg-gray-50 rounded-xl p-3 border-l-4" :class="getCategory(lastTypeSession[wt.name]) === 'calisthenics' ? 'border-amber-400' : 'border-indigo-400'">
                <p class="text-sm font-bold text-gray-700 mb-1">{{ lastTypeSession[wt.name].label || 'Untitled' }} <span class="text-[10px] font-normal text-gray-400 ml-1">{{ formatDate(lastTypeSession[wt.name].date) }}</span></p>
                <div class="space-y-1">
                  <div v-for="ex in lastTypeSession[wt.name].exercises" :key="ex.name" class="flex justify-between text-xs text-gray-600">
                    <span class="truncate pr-2 font-bold">{{ ex.name }}</span>
                    <span class="shrink-0">
                      <template v-if="ex.weight > 0">{{ ex.weight }}kg × {{ ex.sets }} sets × {{ ex.reps }} reps</template>
                      <template v-else-if="ex.sets > 1">{{ ex.sets }} sets × {{ ex.reps }} reps</template>
                      <template v-else>{{ ex.reps }} reps</template>
                    </span>
                  </div>
                </div>
              </div>
            </div>
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

      </div> <!-- End Left Column -->

      <!-- RIGHT COLUMN -->
      <div class="lg:col-span-5 lg:sticky lg:top-6 self-start space-y-6">

        <!-- ════════════════════════════════════════════
             DAILY BRIEF
        ════════════════════════════════════════════ -->
        <DailyBrief
          :sessionsForSelectedDate="sessionsForSelectedDate"
          :workoutSessions="state.workoutSessions ?? []"
          :workoutSets="state.workoutSets ?? []"
          @delete-session="deleteSession"
          @update-session="updateSession"
        />

      </div> <!-- End Right Column -->
    </div> <!-- End Main Grid -->

  </div><!-- End Main Wrapper -->
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
import { selectedDate } from '../composables/useSelectedDate.js'
import { calc1RM } from '../utils/workoutMath.js'
import PetMiniWidget from './PetMiniWidget.vue'
import DailyBrief from './DailyBrief.vue'

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
const petMessage      = ref('')
const isCelebrating   = ref(false)
let recentlyAddedTimer = null
onUnmounted(() => clearTimeout(recentlyAddedTimer))

// ── Draft session ──
const draftSession = ref({ 
  label: '', 
  exercises: [{ name: '', weight: null, sets: 1, reps: 10 }] 
})

const activeExerciseCount = computed(() => {
  return draftSession.value.exercises.filter(ex => ex.name && ex.name.trim() !== '').length
})

const isValidSession = computed(() => {
  if (!draftSession.value.label.trim() || activeExerciseCount.value === 0) return false
  return draftSession.value.exercises.every(e => e.name.trim().length > 0 && Number(e.reps) > 0)
})

function addExercise() {
  draftSession.value.exercises.push({ name: '', weight: null, sets: 1, reps: 10 })
}

function removeExercise(idx) {
  draftSession.value.exercises.splice(idx, 1)
}

function saveSession() {
  saveError.value = ''
  const exs = draftSession.value.exercises

  if (!exs.length) { saveError.value = 'Add at least one exercise.'; return }

  const invalid = exs.find(e => e.name.trim().length === 0 || e.reps === '' || e.reps === null)
  if (invalid) { 
    saveError.value = 'Each exercise needs a name and rep count.'
    return 
  }

  // Compute 1RM for each exercise
  const computed = exs.map(e => ({
    name:   e.name.trim(),
    weight: Number(e.weight) || 0,
    sets:   Number(e.sets)   || 1,
    reps:   Number(e.reps)   || 0,
    oneRM:  Number(e.weight) ? calc1RM(Number(e.weight), Number(e.reps) || 0) : 0,
  }))

  const id = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`

  state.workoutSessions.push({
    id,
    type:      'Strength',
    category:  state.trainingCategory,
    date:      todayStr(),
    timestamp: Date.now(),
    label:     draftSession.value.label.trim() || 'Session',
    exercises: computed,
  })

  // XP & streak (once per session)
  maybeSetStartDate(state)
  const broke = willStreakBreak(state)

  const currentXP = todayXP.value['Strength'] || 0
  const xpAvailable = Math.max(0, WORKOUT_CAP - currentXP)
  const xpAward = Math.min(30, xpAvailable)

  if (xpAward > 0) {
    state.workouts.push({ type: 'Strength', name: draftSession.value.label || 'Session', xp: xpAward, date: todayStr() })
    addXP(state, xpAward)
  }

  updateWorkoutStreak(state)
  setMood('workout')
  state.petMood = computeMood(state, { streakBroke: broke })
  if (state.workouts.length === 1) triggerAchievement('workout', '🏋️', 'First session!', 'Your journey begins', 'session-first')

  draftSession.value = { 
    label: '', 
    exercises: [{ name: '', weight: null, sets: 1, reps: 10 }] 
  }
  sessionFormOpen.value = false

  let isPR = false
  computed.forEach(c => {
    if (c.oneRM > 0) {
      const maxPast = Math.max(0, ...state.workoutSessions
        .filter(s => s.id !== id)
        .flatMap(s => s.exercises)
        .filter(e => e.name.toLowerCase() === c.name.toLowerCase())
        .map(e => e.oneRM))
      
      if (maxPast > 0 && c.oneRM > maxPast) isPR = true
    }
  })

  petMessage.value = isPR ? "NEW RECORD! 🏆" : "Session Saved! +XP"
  isCelebrating.value = true
  setTimeout(() => {
    petMessage.value = ''
    isCelebrating.value = false
  }, 3500)
}

function deleteSession(id) {
  state.workoutSessions = (state.workoutSessions ?? []).filter(s => s.id !== id)
}

function updateSession(updated) {
  if (!state.workoutSessions) return
  const idx = state.workoutSessions.findIndex(s => s.id === updated.id)
  if (idx > -1) state.workoutSessions[idx] = updated
}

// ── Computed ──
const today = todayStr()
const isToday = computed(() => selectedDate.value === today)

const allSessions = computed(() =>
  [...(state.workoutSessions ?? [])].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0) || b.date.localeCompare(a.date))
)

const sessionsForSelectedDate = computed(() => {
  if (!selectedDate.value) return allSessions.value
  return allSessions.value.filter(s => s.date === selectedDate.value)
})

const sessionHeader = computed(() => {
  if (isToday.value) return "Today's Training"
  if (selectedDate.value > today) return "Planned Sessions"
  return "Previous Training"
})

const lastTypeSession = computed(() => {
  const map = {}
  for (const wt of state.workoutTypes) {
    const t = wt.name.toLowerCase()
    map[wt.name] = allSessions.value.find(s => 
      s.type?.toLowerCase() === t || s.label.toLowerCase().includes(t) || s.exercises.some(e => e.name.toLowerCase().includes(t))
    )
  }
  return map
})

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
function getCategory(sess) {
  if (sess.category) return sess.category
  return (!sess.exercises[0]?.weight || sess.exercises[0]?.weight === 0) ? 'calisthenics' : 'bodybuilding'
}

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
