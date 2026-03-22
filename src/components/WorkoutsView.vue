<template>
  <div class="p-4 lg:p-6 pb-20 max-w-6xl mx-auto bg-[radial-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-white min-h-screen">

    <!-- Header -->
    <div class="mb-2 flex flex-col gap-2">
      <button @click="activeView = 'overview'"
        class="flex items-center gap-1 text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer group w-fit">
        <svg class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>
        Back to Overview
      </button>

      <div>
        <div class="flex items-center mb-1">
          <h2 class="text-3xl font-extrabold tracking-tight text-slate-900">⚡ My Training</h2>
          <span v-if="allSessions.length" class="text-[11px] bg-slate-100 text-slate-500 opacity-50 px-2 py-0.5 rounded-full ml-2 font-medium select-none">
            {{ allSessions.length }} session{{ allSessions.length !== 1 ? 's' : '' }}
          </span>
        </div>
        
        <!-- Motivational Tip -->
        <div class="bg-slate-50 border-l-4 border-indigo-500 p-3 rounded-r-xl shadow-sm mt-4 md:mt-5 mb-10">
          <p class="text-[13px] text-slate-600 italic font-medium">
            "{{ activeTip }}"
          </p>
        </div>
      </div>
    </div>

    <!-- Category toggle -->
    <div class="flex gap-2 mb-6">
      <button v-for="cat in CATEGORIES" :key="cat.id"
        @click="state.trainingCategory = cat.id"
        :class="state.trainingCategory === cat.id
          ? (cat.id === 'calisthenics' ? 'bg-orange-600 text-white shadow-md border-orange-600 border' 
             : cat.id === 'cardio' ? 'bg-rose-500 text-white shadow-md border-rose-500 border' 
             : 'bg-indigo-600 text-white shadow-md border-indigo-600 border')
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
        <div v-if="selectedDate === todayStr()" 
          class="bg-gradient-to-br from-white to-indigo-50 rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-100/30 p-6 overflow-hidden relative transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-200/50">
      <!-- Card header -->
      <button @click="sessionFormOpen = !sessionFormOpen"
        class="w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-indigo-50/50 transition-colors">
        <div class="flex items-center gap-3">
          <div :class="[activeCategoryInfo.bg, 'transition-colors duration-300 w-8 h-8 rounded-xl flex items-center justify-center shrink-0']">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
          </div>
          <span class="text-sm font-semibold text-gray-800 transition-colors duration-300">
            Log <span :class="activeCategoryInfo.color">{{ activeCategoryInfo.label }}</span> Session
          </span>
          <span v-if="activeExerciseCount > 0" class="text-[11px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium transition-all">{{ activeExerciseCount }} exercise{{ activeExerciseCount !== 1 ? 's' : '' }}</span>
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
            <input v-model="draftSession.label" @input="isLabelDirty = true" type="text" maxlength="40"
              :placeholder="state.trainingCategory === 'cardio' ? 'e.g. Morning Run' : (state.trainingCategory === 'calisthenics' ? 'e.g. Upper Body Flow' : 'e.g. Push Day · Chest & Triceps')"
              class="w-full text-sm font-semibold text-gray-800 placeholder-gray-300 border border-indigo-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-indigo-50"/>
            
            <!-- Quick Label Pills -->
            <div v-if="state.trainingCategory === 'bodybuilding' && recentLabels.length" class="flex flex-wrap gap-2 mt-2 px-1">
              <button v-for="label in recentLabels" :key="label" @click="draftSession.label = label; isLabelDirty = true"
                class="group flex items-center text-[10px] bg-indigo-50/50 hover:bg-indigo-100/80 text-indigo-600 border border-indigo-100/50 pl-2.5 pr-1 py-1 rounded-full font-medium transition-all">
                <span>{{ label }}</span>
                <span @click.stop="removeLabel(label)" class="ml-1.5 px-0.5 text-slate-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 cursor-pointer text-xs flex items-center h-full pt-0.5" title="Hide this suggestion">×</span>
              </button>
            </div>
          </div>

          <!-- Exercise rows -->
          <div v-if="draftSession.exercises.length" class="mb-4 space-y-3">
            <div v-for="(ex, i) in draftSession.exercises" :key="i"
              :class="state.trainingCategory === 'calisthenics' ? 'flex flex-row gap-3 items-start bg-white rounded-2xl px-4 py-4 border border-indigo-100 w-full shadow-sm' : 'grid grid-cols-12 gap-4 items-start bg-white rounded-2xl px-4 py-4 border border-indigo-100 shadow-sm'">
              
              <div :class="state.trainingCategory === 'calisthenics' ? 'flex-1 min-w-[120px]' : (state.trainingCategory === 'bodybuilding' ? 'col-span-12 lg:col-span-6' : (state.trainingCategory === 'cardio' ? (isInclineExercise(ex.selectedName) ? 'col-span-12 lg:col-span-4' : 'col-span-12 lg:col-span-5') : 'col-span-12 lg:col-span-7'))">
                <div class="flex items-center justify-between mb-1.5 px-1">
                  <div class="flex items-center gap-2">
                    <label v-if="state.trainingCategory === 'bodybuilding'" class="w-28 shrink-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Part</label>
                    <label class="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Exercise</label>
                  </div>
                  <div v-if="state.trainingCategory === 'calisthenics'" class="flex items-center gap-3">
                    <label class="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" v-model="ex.isWeighted" @change="ex.isWeighted ? null : ex.weight = null" class="w-3.5 h-3.5 accent-amber-500 rounded border-gray-300 focus:ring-amber-500" />
                      <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Weighted</span>
                    </label>
                    <label v-if="ex.name === 'Custom...'" class="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" v-model="ex.isHold" class="w-3.5 h-3.5 accent-amber-500 rounded border-gray-300 focus:ring-amber-500" />
                      <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Hold Time</span>
                    </label>
                  </div>
                </div>
                
                <template v-if="state.trainingCategory === 'cardio'">
                  <div class="flex flex-col gap-2">
                    <select v-model="ex.selectedName" @change="e => handleCardioExerciseSelect(e, ex)"
                      class="text-sm border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-rose-300 bg-white w-full">
                      <option disabled value="">Select exercise</option>
                      <option v-for="opt in CARDIO_EXERCISES" :key="opt" :value="opt">{{ opt }}</option>
                    </select>
                    <input v-if="ex.selectedName === 'Custom...'" v-model="ex.name" type="text" maxlength="30" placeholder="e.g. Stairmaster"
                      class="text-sm border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-rose-300 bg-white w-full"/>
                  </div>
                </template>
                <template v-else-if="state.trainingCategory === 'calisthenics'">
                  <div class="flex flex-col gap-2">
                    <!-- Calisthenics Exercise Select -->
                    <div class="relative w-full">
                      <select v-model="ex.name" @change="ex.isHold = STATIC_HOLDS.includes(ex.name)"
                        class="text-[13px] font-medium border border-gray-200 rounded-xl px-2.5 pr-10 h-11 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white w-full appearance-none">
                        <option disabled value="">Select exercise</option>
                        <option v-for="opt in COMMON_CALISTHENICS_EXERCISES" :key="opt" :value="opt">
                          {{ STATIC_HOLDS.includes(opt) ? '⚡ ' : '' }}{{ opt }}
                        </option>
                      </select>
                      <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <input v-if="ex.name === 'Custom...'" v-model="ex.customName" type="text" maxlength="30" placeholder="e.g. Pistol Squats"
                      class="text-sm border border-gray-200 rounded-xl px-2.5 h-11 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white w-full"/>
                  </div>
                </template>
                <template v-else>
                  <div class="flex flex-col gap-2">
                    <!-- Body Building Selects -->
                    <div class="flex gap-2">
                      <div class="relative w-28 shrink-0">
                        <select v-model="ex.bodyPart" @change="ex.name = ''; focusWeight(i)"
                          class="text-[13px] font-medium border border-gray-200 rounded-lg px-2 pr-8 h-11 focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white w-full appearance-none">
                          <option value="" disabled selected>Select Part...</option>
                          <option v-for="p in BODY_PARTS" :key="p" :value="p">{{ p }}</option>
                        </select>
                        <div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      <div class="relative flex-1">
                        <select v-model="ex.name" @change="focusWeight(i)" :disabled="!ex.bodyPart"
                          class="text-[13px] font-medium border border-gray-200 rounded-lg px-2.5 pr-10 h-11 focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white w-full appearance-none disabled:opacity-50 disabled:cursor-not-allowed">
                          <option value="" disabled selected>Select Exercise...</option>
                          <option v-for="name in getFilteredExercises(ex.bodyPart)" :key="name" :value="name">{{ name }}</option>
                        </select>
                        <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <input v-if="ex.name === 'Custom...'" v-model="ex.customName" type="text" maxlength="30" placeholder="e.g. Pec Deck"
                      class="text-sm border border-gray-200 rounded-lg px-2.5 h-11 focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white w-full"/>
                  </div>
                </template>
              </div>

              <template v-if="state.trainingCategory !== 'cardio'">
                <!-- Weight -->
                <div v-if="state.trainingCategory === 'bodybuilding' || (state.trainingCategory === 'calisthenics' && ex.isWeighted)" 
                   :class="state.trainingCategory === 'calisthenics' ? 'w-24 shrink-0' : 'col-span-12 lg:col-span-2 min-w-[96px]'">
                  <label class="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5 px-1 text-center relative flex items-center justify-center gap-1">
                    Weight
                    <span v-if="state.trainingCategory === 'bodybuilding' && isPR(ex.name, ex.weight, ex.reps)" 
                      class="absolute -top-1 -right-1 text-emerald-500 animate-pulse drop-shadow-sm text-[12px]" title="Personal Record!">👑</span>
                  </label>
                  <div class="flex items-center justify-center gap-1 overflow-visible">
                    <button @click="increment(ex, 'weight', -2.5)" 
                      class="text-slate-400 hover:text-amber-600 transition-colors cursor-pointer px-1 flex-shrink-0 text-base font-bold select-none">−</button>
                    <input v-model="ex.weight" type="number" inputmode="decimal" pattern="[0-9]*" min="0" step="0.5" placeholder="kg"
                      :ref="el => { if (el) weightInputs[i] = el }"
                      class="text-[13px] border border-gray-200 rounded-lg px-0.5 py-2 focus:outline-none focus:ring-1 bg-white text-center w-full min-w-0"
                      :class="state.trainingCategory === 'calisthenics' ? 'focus:ring-amber-500' : 'focus:ring-indigo-300'"/>
                    <button @click="increment(ex, 'weight', 2.5)" 
                      class="text-slate-400 hover:text-amber-600 transition-colors cursor-pointer px-1 flex-shrink-0 text-base font-bold select-none">+</button>
                  </div>
                </div>

                <!-- Sets -->
                <div :class="state.trainingCategory === 'calisthenics' ? 'w-24 shrink-0' : (state.trainingCategory === 'bodybuilding' ? 'col-span-6 lg:col-span-2' : 'col-span-6 lg:col-span-2')">
                  <label class="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5 px-1 text-center">Sets</label>
                  <div class="flex items-center justify-center gap-1">
                    <button @click="increment(ex, 'sets', -1)" 
                      class="text-slate-400 hover:text-amber-600 transition-colors cursor-pointer px-1 flex-shrink-0 text-base font-bold select-none">−</button>
                    <input v-model="ex.sets" type="number" inputmode="numeric" pattern="[0-9]*" min="1" placeholder="3"
                      class="w-14 text-[13px] border border-gray-200 rounded-lg px-0.5 py-2 focus:outline-none focus:ring-1 bg-white text-center min-w-0"
                      :class="state.trainingCategory === 'calisthenics' ? 'focus:ring-amber-500' : 'focus:ring-indigo-300'"/>
                    <button @click="increment(ex, 'sets', 1)" 
                      class="text-slate-400 hover:text-amber-600 transition-colors cursor-pointer px-1 flex-shrink-0 text-base font-bold select-none">+</button>
                  </div>
                </div>

                <!-- Reps / Hold -->
                <div :class="state.trainingCategory === 'calisthenics' ? 'w-24 shrink-0' : (state.trainingCategory === 'bodybuilding' ? 'col-span-6 lg:col-span-2' : 'col-span-6 lg:col-span-2')">
                  <label class="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5 px-1 text-center">
                    {{ isSkillExercise(ex) ? 'HOLD (SEC)' : 'REPS' }}
                  </label>
                  <div class="flex items-center justify-center gap-1">
                    <button @click="increment(ex, 'reps', -1)" 
                      class="text-slate-400 hover:text-amber-600 transition-colors cursor-pointer px-1 flex-shrink-0 text-base font-bold select-none">−</button>
                    <input v-model="ex.reps" type="number" inputmode="numeric" pattern="[0-9]*" min="0" :placeholder="isSkillExercise(ex) ? '15' : '10'"
                      class="w-14 text-[13px] border border-gray-200 rounded-lg px-0.5 py-2 focus:outline-none focus:ring-1 bg-white text-center min-w-0"
                      :class="state.trainingCategory === 'calisthenics' ? 'focus:ring-amber-500' : 'focus:ring-indigo-300'"/>
                    <button @click="increment(ex, 'reps', 1)" 
                      class="text-slate-400 hover:text-amber-600 transition-colors cursor-pointer px-1 flex-shrink-0 text-base font-bold select-none">+</button>
                  </div>
                </div>
              </template>
              
              <template v-if="state.trainingCategory === 'cardio'">
                <!-- Duration -->
                <div :class="isInclineExercise(ex.selectedName) ? 'col-span-12 sm:col-span-6 lg:col-span-2 flex justify-center' : 'col-span-12 sm:col-span-6 lg:col-span-3 flex justify-center'">
                  <div class="flex flex-col items-center w-32 px-1">
                    <label class="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1 text-center">DURATION</label>
                    <div class="bg-white border border-slate-100 rounded-xl flex items-center justify-between p-1 w-full h-11">
                      <button type="button" @click="ex.duration = Math.max(1, (Number(ex.duration) || 1) - 5)" 
                        :class="Number(ex.duration) <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer'"
                        class="w-8 h-8 shrink-0 flex items-center justify-center bg-slate-50 rounded-lg text-slate-500">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" /></svg>
                      </button>
                      <div class="flex items-center justify-center flex-1">
                        <input v-model.number="ex.duration" type="number" inputmode="numeric" min="1"
                          class="text-sm bg-transparent border-none focus:ring-0 text-center w-8 focus:outline-none appearance-none p-0 font-medium"/>
                        <span class="text-[10px] text-slate-400 ml-1 w-6 text-left">{{ Number(ex.duration) === 1 ? 'min' : 'mins' }}</span>
                      </div>
                      <button type="button" @click="ex.duration = (Number(ex.duration) || 0) + 5" class="w-8 h-8 shrink-0 flex items-center justify-center bg-slate-50 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Incline -->
                <div v-if="isInclineExercise(ex.selectedName)" class="col-span-12 lg:col-span-3 flex justify-center">
                  <div class="flex flex-col items-center w-24">
                    <label class="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1 text-center">INCLINE (°)</label>
                    <select v-model="ex.incline"
                      class="h-11 text-sm border border-slate-100 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-rose-300 bg-white w-full text-center">
                      <option v-for="val in [0, 1, 2, 3, 4, 5, 8, 10, 12, 15]" :key="val" :value="val">{{ val }}°</option>
                    </select>
                  </div>
                </div>

                <!-- Intensity -->
                <div :class="isInclineExercise(ex.selectedName) ? 'col-span-12 sm:col-span-6 lg:col-span-2 flex justify-center' : 'col-span-12 sm:col-span-6 lg:col-span-3 flex justify-center'">
                  <div class="flex flex-col items-center w-full max-w-[120px]">
                    <label class="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1 text-center">INTENSITY</label>
                    <select v-model="ex.intensity" 
                      class="h-11 text-sm border border-slate-100 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-rose-300 bg-white w-full text-center">
                      <option disabled value="">Select</option>
                      <option v-for="int in CARDIO_INTENSITIES" :key="int" :value="int">{{ int }}</option>
                    </select>
                  </div>
                </div>
              </template>

              <!-- Delete -->
              <div :class="state.trainingCategory === 'cardio' && isInclineExercise(ex.selectedName) ? 'col-span-12 lg:col-span-1 flex justify-center pb-2 mt-4' : 'col-span-2 lg:col-span-1 flex justify-center pb-2 mt-4'">
                <button v-if="i > 0" @click="removeExercise(i)" class="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer bg-white rounded-lg border border-gray-200 p-1.5 shadow-sm" aria-label="Remove exercise">
                  <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                </button>
              </div>

            </div>
          </div>

          <button @click="addExercise"
            class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-indigo-100 font-medium text-sm transition-all duration-200 cursor-pointer mb-4 shadow-sm"
            :class="addBtnClasses">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            Add Another Exercise
          </button>

          <!-- Save error -->
          <p v-if="saveError" class="text-xs text-red-500 mb-3">{{ saveError }}</p>

          <!-- Save button -->
          <button @click="saveSession"
            :disabled="!isValidSession"
            class="w-full py-3.5 mt-2 rounded-2xl text-sm font-bold text-white hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-purple-200/50"
            :class="state.trainingCategory === 'cardio' ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-gradient-to-r from-indigo-600 to-violet-600'">
            💾 Save Session
          </button>
        </div>
      </Transition>
    </div>

    <!-- Pst Date State -->
    <div v-else class="bg-gradient-to-br from-white to-indigo-50/40 rounded-3xl border border-white shadow-xl shadow-indigo-100/50 p-8 flex flex-col items-center justify-center text-center overflow-hidden">
      <p class="text-3xl mb-3">🕰️</p>
      <p class="text-sm font-extrabold tracking-tight text-slate-900">Viewing Past Records</p>
      <p class="text-xs text-slate-500 mt-1 mb-5">Historical sessions cannot be edited directly.</p>
      <button @click="selectedDate = todayStr()" class="bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold text-sm px-6 py-2 rounded-xl shadow-sm hover:bg-indigo-100 transition-colors cursor-pointer">
        Back to Today
      </button>
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
    
    <!-- Celebration Overlay -->
    <Transition name="scale">
      <div v-if="showConfetti" class="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-6">
        <div class="bg-white px-10 py-8 rounded-[40px] shadow-2xl border-4 border-emerald-100 flex flex-col items-center gap-4 text-center">
          <span class="text-7xl">👑</span>
          <div class="space-y-1">
            <h3 class="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">New Personal Record!</h3>
            <p class="text-indigo-600 font-bold uppercase tracking-widest text-sm">Leveling up has never looked so good</p>
          </div>
        </div>
      </div>
    </Transition>

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
const TIPS = [
  "Consistency is the only 'secret' to progress.",
  "Your only competition is who you were yesterday.",
  "Slow progress is still progress.",
  "Don't stop until you're proud."
]
const CATEGORIES = [
  { id: 'bodybuilding', label: 'Body Building', emoji: '🏋️' },
  { id: 'calisthenics', label: 'Calisthenics',  emoji: '🤸' },
  { id: 'cardio',       label: 'Cardio',        emoji: '🏃' },
]

const BODY_PARTS = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Abs']
const EXERCISE_LIBRARY = {
  'Chest': ['Bench Press', 'Incline DB Press', 'Chest Flyes', 'Dips'],
  'Back': ['Pull Ups', 'Bent Over Rows', 'Lat Pulldowns', 'Deadlifts'],
  'Shoulders': ['Overhead Press', 'Lateral Raises', 'Face Pulls'],
  'Biceps': ['Hammer Curls', 'Dumbbell Curls', 'Barbell Curls'],
  'Triceps': ['Skull Crushers', 'Tricep Pushdowns', 'Overhead Extension'],
  'Quads': ['Squats', 'Leg Press', 'Leg Extensions'],
  'Hamstrings': ['Leg Curls', 'Romanian Deadlifts'],
  'Glutes': ['Hip Thrusts', 'Lunges'],
  'Calves': ['Calf Raises'],
  'Abs': ['Crunches', 'Leg Raises', 'Plank']
}
const CARDIO_EXERCISES = ['Running', 'Cycling', 'Swimming', 'Walking', 'Rowing', 'Custom...']
const CARDIO_INTENSITIES = ['Low', 'Moderate', 'High', 'Max']
const STATIC_HOLDS = ['Handstand', 'Planche', 'L-Sit', 'Front Lever', 'Back Lever', 'Human Flag']
const COMMON_CALISTHENICS_EXERCISES = [
  'Pull Ups', 'Push Ups', 'Dips', 'Muscle Ups', 'Handstand Push Ups', 'Chin Ups', 'Leg Raises', 'Plank', 
  ...STATIC_HOLDS, 
  'Custom...'
]

// ── Validation Helpers ──
function isSkillExercise(ex) {
  if (!ex || state.trainingCategory !== 'calisthenics') return false
  return ex.isHold || STATIC_HOLDS.includes(ex.name) || STATIC_HOLDS.includes(ex.customName)
}

function getFilteredExercises(bodyPart) {
  return [...(EXERCISE_LIBRARY[bodyPart] || []), 'Custom...']
}

function isInclineExercise(name) {
  return ['Running', 'Walking', 'Cycling'].includes(name)
}

// ── UI State ──
const sessionFormOpen = ref(true)
const calendarOpen    = ref(false)
const showConfetti    = ref(false)
const weightInputs    = ref([])
const activeTip       = ref(TIPS[Math.floor(Math.random() * TIPS.length)])
const saveError       = ref('')
const petMessage      = ref('')
const isCelebrating   = ref(false)
const isLabelDirty    = ref(false)
let recentlyAddedTimer = null
onUnmounted(() => clearTimeout(recentlyAddedTimer))

function increment(ex, field, amount) {
  const current = Number(ex[field]) || 0
  const newVal = current + amount
  if (newVal >= 0) {
    ex[field] = newVal
  }
}

function focusWeight(idx) {
  setTimeout(() => {
    if (weightInputs.value[idx]) {
      weightInputs.value[idx].focus()
    }
  }, 10)
}

// ── Draft session ──
const draftSession = ref({ 
  label: '', 
  exercises: [{ name: '', customName: '', selectedName: '', bodyPart: '', weight: null, sets: 1, reps: 10, duration: null, intensity: '', incline: 0, isWeighted: false, isHold: false }] 
})

function handleCardioExerciseSelect(e, ex) {
  const val = e.target.value
  if (val !== 'Custom...') {
    ex.name = val
    if (state.trainingCategory === 'cardio' && !isLabelDirty.value && val) {
      draftSession.value.label = `${val} Session`
    }
    // Remove incline if not applicable
    if (!isInclineExercise(val)) {
      ex.incline = 0
    }
  } else {
    ex.name = ''
    if (state.trainingCategory === 'cardio' && !isLabelDirty.value) {
      draftSession.value.label = `Cardio Session`
    }
  }
}

const activeCategoryInfo = computed(() => {
  switch (state.trainingCategory) {
    case 'bodybuilding': return { label: 'Body Building', color: 'text-indigo-600', bg: 'bg-indigo-500' }
    case 'calisthenics': return { label: 'Calisthenics',  color: 'text-orange-500', bg: 'bg-orange-500' }
    case 'cardio':       return { label: 'Cardio',        color: 'text-rose-500',   bg: 'bg-rose-500' }
    default:             return { label: 'New',           color: 'text-slate-800',  bg: 'bg-indigo-600' }
  }
})

const addBtnClasses = computed(() => {
  switch (state.trainingCategory) {
    case 'bodybuilding': return 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-white'
    case 'calisthenics': return 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-white'
    case 'cardio':       return 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-white'
    default:             return 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-white'
  }
})

const recentLabels = computed(() => {
  if (state.trainingCategory !== 'bodybuilding' || !state.workoutSessions) return []
  const hidden = state.hiddenLabels || []
  const bbSessions = state.workoutSessions
    .filter(s => (s.category || 'bodybuilding') === 'bodybuilding' && s.label && !hidden.includes(s.label))
    .slice(-30) // sample more to find unique ones
  
  const counts = {}
  bbSessions.forEach(s => {
    counts[s.label] = (counts[s.label] || 0) + 1
  })
  
  return Object.keys(counts)
    .sort((a, b) => counts[b] - counts[a])
    .slice(0, 3)
})

const removeLabel = (label) => {
  if (!state.hiddenLabels) state.hiddenLabels = []
  if (!state.hiddenLabels.includes(label)) {
    state.hiddenLabels.push(label)
  }
}

const isPR = (name, weight, reps) => {
  if (!name || name === 'Custom...' || !weight || !state.workoutSessions) return false
  
  const w = Number(weight) || 0
  const r = Number(reps) || 0
  if (w === 0) return false

  let maxW = 0
  let maxR = 0

  state.workoutSessions.forEach(s => {
    s.exercises.forEach(e => {
      if (e.name?.toLowerCase() === name.toLowerCase()) {
        const ew = Number(e.weight) || 0
        const er = Number(e.reps) || 0
        if (ew > maxW) {
          maxW = ew
          maxR = er
        } else if (ew === maxW && er > maxR) {
          maxR = er
        }
      }
    })
  })

  return w > maxW || (w === maxW && r > maxR)
}

const activeExerciseCount = computed(() => {
  return draftSession.value.exercises.filter(ex => {
    if (state.trainingCategory === 'calisthenics' && ex.name === 'Custom...') {
      return ex.customName && ex.customName.trim() !== ''
    }
    return ex.name && ex.name.trim() !== ''
  }).length
})

const isValidSession = computed(() => {
  if (!draftSession.value.label.trim() || activeExerciseCount.value === 0) return false
  
  if (state.trainingCategory === 'cardio') {
    return draftSession.value.exercises.every(e => 
      e.name && e.name.trim().length > 0 && Number(e.duration) > 0 && e.intensity && e.intensity.trim() !== ''
    )
  }
  if (state.trainingCategory === 'calisthenics') {
    return draftSession.value.exercises.every(e => {
      const nameValid = e.name === 'Custom...' ? (e.customName && e.customName.trim().length > 0) : (e.name && e.name.trim().length > 0)
      return nameValid && Number(e.reps) > 0
    })
  }
  return draftSession.value.exercises.every(e => e.name && e.name.trim().length > 0 && Number(e.reps) > 0)
})

function addExercise() {
  const lastEx = draftSession.value.exercises[draftSession.value.exercises.length - 1]
  draftSession.value.exercises.push({ 
    name: '', customName: '', selectedName: '', 
    bodyPart: state.trainingCategory === 'bodybuilding' ? (lastEx?.bodyPart || '') : '',
    weight: state.trainingCategory === 'bodybuilding' ? (lastEx?.weight || null) : null,
    sets: state.trainingCategory === 'bodybuilding' ? (lastEx?.sets || 1) : 1,
    reps: 10, duration: state.trainingCategory === 'cardio' ? 1 : null, intensity: '', incline: 0, isWeighted: false, isHold: false 
  })
}

function removeExercise(idx) {
  draftSession.value.exercises.splice(idx, 1)
}

function saveSession() {
  saveError.value = ''
  const exs = draftSession.value.exercises

  if (!exs.length) { saveError.value = 'Add at least one exercise.'; return }

  const invalid = state.trainingCategory === 'cardio' 
    ? exs.find(e => !e.name || e.name.trim().length === 0 || !e.duration || !e.intensity)
    : state.trainingCategory === 'calisthenics'
      ? exs.find(e => (e.name === 'Custom...' ? (!e.customName || e.customName.trim().length === 0) : (!e.name || e.name.trim().length === 0)) || e.reps === '' || e.reps === null)
      : exs.find(e => !e.name || e.name.trim().length === 0 || e.reps === '' || e.reps === null)
  
  if (invalid) { 
    saveError.value = state.trainingCategory === 'cardio'
      ? 'Each exercise needs a name, duration, and intensity.'
      : 'Each exercise needs a name and rep count.'
    return 
  }

  // Map properties based on category
  const computedExs = exs.map(e => {
    if (state.trainingCategory === 'cardio') {
      return {
        name: e.name.trim(),
        duration: Number(e.duration),
        intensity: e.intensity,
        incline: (isInclineExercise(e.selectedName) && e.incline > 0) ? Number(e.incline) : 0
      }
    } else {
      const nameValid = (state.trainingCategory === 'calisthenics' || state.trainingCategory === 'bodybuilding') && e.name === 'Custom...' 
        ? (e.customName?.trim() || 'Custom Exercise') 
        : e.name.trim()
      const isHold = state.trainingCategory === 'calisthenics' && (e.isHold || STATIC_HOLDS.includes(e.name) || STATIC_HOLDS.includes(e.customName))
      const weightVal = (state.trainingCategory === 'calisthenics' && !e.isWeighted) ? 0 : (Number(e.weight) || 0)
      const repsVal = Number(e.reps) || 0
      
      const exObj = {
        name:       nameValid,
        bodyPart:   e.bodyPart, // Add bodyPart here
        weight:     weightVal,
        sets:       Number(e.sets) || 1,
        isWeighted: e.isWeighted || false,
        isHold:     isHold,
        isPR:       state.trainingCategory !== 'cardio' ? isPR(nameValid, weightVal, repsVal) : false
      }
      if (isHold) {
        exObj.holdTime = repsVal
      } else {
        exObj.reps = repsVal
        exObj.oneRM = weightVal ? calc1RM(weightVal, repsVal) : 0
      }
      return exObj
    }
  })

  const id = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`

  state.workoutSessions.push({
    id,
    type:      state.trainingCategory === 'cardio' ? 'Cardio' : 'Strength',
    category:  state.trainingCategory,
    date:      todayStr(),
    timestamp: Date.now(),
    label:     draftSession.value.label.trim() || 'Session',
    exercises: computedExs,
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
    exercises: [{ name: '', customName: '', selectedName: '', weight: null, sets: 1, reps: 10, duration: state.trainingCategory === 'cardio' ? 1 : null, intensity: '', incline: 0, isWeighted: false, isHold: false }] 
  }
  isLabelDirty.value = false
  sessionFormOpen.value = false

  const hasAnyPR = computedExs.some(e => e.isPR)
  if (hasAnyPR) {
    showConfetti.value = true
    setTimeout(() => { showConfetti.value = false }, 2500)
    petMessage.value = "NEW RECORD! 🏆"
  } else {
    petMessage.value = "Session Saved! +XP"
  }
  
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
  // Option to keep for other UI if needed, but per request we are cleaning up logic.
  // Since the UI is gone, this is deprecated.
}
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
