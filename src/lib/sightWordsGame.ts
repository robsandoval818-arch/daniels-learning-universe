import type { MasteryRecord } from '../types'

// ─────────────────────────────────────────────────────────────────────────
// SIGHT WORDS SPRINT — round-building logic
// The word list is 100% parent-controlled (settings.customWords). This
// module never invents target words; it only decides which parent-entered
// word to drill next (weighted toward ones Daniel struggles with) and
// which wrong-answer tiles to show alongside it.
// ─────────────────────────────────────────────────────────────────────────

// A small, generic pool used ONLY to pad out multiple-choice decoys when
// the parent's word list is short (e.g. just 1–2 words) — these are never
// shown as the correct answer, never scored, and never saved to progress.
const FILLER_DECOYS = [
  'cat', 'dog', 'sun', 'run', 'big', 'red', 'yes', 'go', 'up', 'see',
  'bed', 'hop', 'hat', 'fun', 'wet', 'top', 'six', 'hen', 'jam', 'lap',
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Picks the next word to drill, weighting toward words Daniel hasn't
 * mastered yet (not-started / needs-review / practicing get more turns
 * than ones already at "mastered"), while avoiding immediate repeats.
 */
export function pickNextTarget(
  words: string[],
  mastery: Record<string, MasteryRecord>,
  lastTarget: string | null,
): string {
  const pool = words.length > 1 && lastTarget ? words.filter((w) => w !== lastTarget) : words
  const candidates = pool.length ? pool : words

  const weighted: string[] = []
  for (const word of candidates) {
    const status = mastery[word.toLowerCase()]?.status ?? 'not-started'
    const weight = status === 'mastered' ? 1 : status === 'practicing' ? 3 : status === 'needs-review' ? 4 : 3
    for (let i = 0; i < weight; i++) weighted.push(word)
  }
  return weighted[Math.floor(Math.random() * weighted.length)]
}

/** Builds the 4 answer tiles (1 correct + 3 decoys), shuffled. */
export function buildOptions(target: string, words: string[], count = 4): string[] {
  const sameCaseFilter = (w: string) => w.toLowerCase() !== target.toLowerCase()
  const otherWords = shuffle(words.filter(sameCaseFilter))
  const decoys: string[] = []

  for (const w of otherWords) {
    if (decoys.length >= count - 1) break
    decoys.push(w)
  }

  if (decoys.length < count - 1) {
    const filler = shuffle(FILLER_DECOYS.filter((w) => w.toLowerCase() !== target.toLowerCase() && !decoys.includes(w)))
    for (const w of filler) {
      if (decoys.length >= count - 1) break
      decoys.push(w)
    }
  }

  return shuffle([target, ...decoys])
}

export const SPRINT_ROUND_COUNT = 10
export const ROUND_SECONDS = 6
/** How long the word is shown + read aloud before it disappears and the
 * answer tiles appear. This is what makes it a real recognition test
 * instead of a shape-matching game — the word is gone by the time he has
 * to pick it. */
export const FLASH_MS = 1700
