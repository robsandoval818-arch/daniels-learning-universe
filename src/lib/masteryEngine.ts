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

const ENCOURAGEMENT_CORRECT_NAMED = [
  'Nice one, {name}!',
  "{name}, you're on fire!",
  'That’s exactly right, {name}.',
  '{name}, your brain just leveled up!',
]

const ENCOURAGEMENT_INCORRECT = [
  "Let's solve it together.",
  'Almost! Look closely.',
  'Nice effort — try the hint below.',
  'Every great learner practices — let’s try again.',
]

const ENCOURAGEMENT_INCORRECT_NAMED = [
  'No worries, {name} — let’s look again together.',
  '{name}, you’re close. Let’s slow down and check.',
  'Good try, {name}! Tutors love questions like this — let’s break it down.',
]

/**
 * Picks an encouragement line. When a childName is supplied, has a chance
 * of using a personalized, name-referencing variant so feedback feels like
 * it's coming from someone who actually knows the kid, not a generic app.
 */
export function randomEncouragement(wasCorrect: boolean, childName?: string): string {
  const useNamed = !!childName && Math.random() < 0.5
  if (useNamed) {
    const pool = wasCorrect ? ENCOURAGEMENT_CORRECT_NAMED : ENCOURAGEMENT_INCORRECT_NAMED
    const line = pool[Math.floor(Math.random() * pool.length)]
    return line.replace('{name}', childName!)
  }
  const pool = wasCorrect ? ENCOURAGEMENT_CORRECT : ENCOURAGEMENT_INCORRECT
  return pool[Math.floor(Math.random() * pool.length)]
}

const TUTOR_HINT_LEAD_INS = [
  "Here's a clue:",
  "Let's think it through:",
  'Try this:',
  "Here's a tip:",
]

const TUTOR_EXPLANATION_LEAD_INS = [
  "Let's break it down together:",
  "Here's how to think about it:",
  'Watch this:',
  "Let's walk through it step by step:",
]

/**
 * Wraps a raw hint/explanation string in warmer, more scaffolded tutor
 * phrasing — the goal is for feedback to read like a patient person
 * teaching Daniel, not a terse system message.
 */
export function tutorFrame(kind: 'hint' | 'explanation', text: string): string {
  const pool = kind === 'hint' ? TUTOR_HINT_LEAD_INS : TUTOR_EXPLANATION_LEAD_INS
  const leadIn = pool[Math.floor(Math.random() * pool.length)]
  return `${leadIn} ${text}`
}
