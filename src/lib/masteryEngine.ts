import type { MasteryRecord } from '../types'

// ─────────────────────────────────────────────────────────────────────────
// MASTERY ENGINE
// Mirrors a worksheet-style mastery model:
//   90%+ accuracy over recent attempts  → mastered
//   70–89%                              → continue practicing
//   below 70%                           → flagged for review of an
//                                          earlier/easier skill
// Never punitive — only used to decide what to serve next and what to
// celebrate. The UI never shows a "you failed" state to the child.
// ─────────────────────────────────────────────────────────────────────────

export const WINDOW_SIZE = 5
export const MASTERY_THRESHOLD = 0.9
export const REVIEW_THRESHOLD = 0.7

export function createMasteryRecord(skillId: string): MasteryRecord {
  return {
    skillId,
    attempts: 0,
    correct: 0,
    lastFiveResults: [],
    status: 'not-started',
    lastPracticed: null,
  }
}

export function recordAttempt(record: MasteryRecord, wasCorrect: boolean): MasteryRecord {
  const lastFive = [...record.lastFiveResults, wasCorrect].slice(-WINDOW_SIZE)
  const attempts = record.attempts + 1
  const correct = record.correct + (wasCorrect ? 1 : 0)

  let status: MasteryRecord['status'] = 'practicing'
  if (lastFive.length >= 3) {
    const recentAccuracy = lastFive.filter(Boolean).length / lastFive.length
    if (recentAccuracy >= MASTERY_THRESHOLD) status = 'mastered'
    else if (recentAccuracy >= REVIEW_THRESHOLD) status = 'practicing'
    else status = 'needs-review'
  }

  return {
    ...record,
    attempts,
    correct,
    lastFiveResults: lastFive,
    status,
    lastPracticed: new Date().toISOString(),
  }
}

export function accuracyOf(record: MasteryRecord | undefined): number {
  if (!record || record.attempts === 0) return 0
  return Math.round((record.correct / record.attempts) * 100)
}

const ENCOURAGEMENT_CORRECT = [
  'Great try!',
  "You're getting stronger.",
  'Mission progress saved.',
  'You powered up your brain!',
  'Fantastic work!',
  'That was brilliant thinking!',
]

const ENCOURAGEMENT_INCORRECT = [
  "Let's solve it together.",
  'Almost! Look closely.',
  'Nice effort — try the hint below.',
  'Every great learner practices — let’s try again.',
]

export function randomEncouragement(wasCorrect: boolean): string {
  const pool = wasCorrect ? ENCOURAGEMENT_CORRECT : ENCOURAGEMENT_INCORRECT
  return pool[Math.floor(Math.random() * pool.length)]
}
