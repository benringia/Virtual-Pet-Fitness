/**
 * Reactive workout math utilities.
 * All values are computed on demand — nothing is stored to state.
 */

/** Epley formula: estimated 1-Rep Max */
export const calc1RM = (w, r) => w * (1 + r / 30)

/** Total volume: sum of (weight × reps) across all sets */
export const calcVolume = (sets) =>
  sets.reduce((acc, s) => acc + (Number(s.weight || 0) * s.reps), 0)

/** Total reps across all sets (calisthenics) */
export const calcTotalReps = (sets) =>
  sets.reduce((acc, s) => acc + s.reps, 0)
