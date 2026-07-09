import type { DifficultyBand, PlacementResult, Question } from '../types'

// ─────────────────────────────────────────────────────────────────────────
// PLACEMENT ADVENTURE
// A short, friendly 8-question check before Day 1. Nothing here is scored
// harshly or shown as "pass/fail" to the child — it just tells us where to
// start so Daniel feels confident from question one.
// ─────────────────────────────────────────────────────────────────────────

export const PLACEMENT_QUESTIONS: Question[] = [
  {
    id: 'placement-1',
    subject: 'math',
    skillId: 'math-6a-02',
    kind: 'count-objects',
    prompt: 'Count the objects. How many do you see?',
    options: [
      { id: 'a', label: '3', isCorrect: false },
      { id: 'b', label: '5', isCorrect: true },
      { id: 'c', label: '7', isCorrect: false },
      { id: 'd', label: '2', isCorrect: false },
    ],
    visual: { type: 'objects', data: '⭐⭐⭐⭐⭐' },
    hint: 'Point to each star and count out loud.',
    explanation: 'There are 5 stars.',
  },
  {
    id: 'placement-2',
    subject: 'math',
    skillId: 'math-5a-02',
    kind: 'choose-number',
    prompt: 'Which number is 7?',
    options: [
      { id: 'a', label: '7', isCorrect: true },
      { id: 'b', label: '1', isCorrect: false },
      { id: 'c', label: '9', isCorrect: false },
      { id: 'd', label: '4', isCorrect: false },
    ],
    hint: 'Look for the number that looks like a hook.',
    explanation: '7 is the number seven.',
  },
  {
    id: 'placement-3',
    subject: 'math',
    skillId: 'math-4a-02',
    kind: 'what-comes-next',
    prompt: 'What comes next? 1, 2, 3, ___',
    options: [
      { id: 'a', label: '5', isCorrect: false },
      { id: 'b', label: '4', isCorrect: true },
      { id: 'c', label: '2', isCorrect: false },
      { id: 'd', label: '9', isCorrect: false },
    ],
    hint: 'Each number is one more than the last.',
    explanation: '4 comes after 3.',
  },
  {
    id: 'placement-4',
    subject: 'math',
    skillId: 'math-2a-02',
    kind: 'addition-objects',
    prompt: '2 + 2 = ?',
    options: [
      { id: 'a', label: '3', isCorrect: false },
      { id: 'b', label: '4', isCorrect: true },
      { id: 'c', label: '5', isCorrect: false },
      { id: 'd', label: '2', isCorrect: false },
    ],
    visual: { type: 'objects', data: '⭐⭐ + ⭐⭐' },
    hint: 'Count all the stars together.',
    explanation: '2 + 2 = 4',
  },
  {
    id: 'placement-5',
    subject: 'reading',
    skillId: 'read-a1-01',
    kind: 'match-word',
    prompt: 'Read: "The dog runs fast." — which picture matches?',
    options: [
      { id: 'a', label: '🐕', isCorrect: true },
      { id: 'b', label: '🐈', isCorrect: false },
      { id: 'c', label: '🐟', isCorrect: false },
      { id: 'd', label: '🐦', isCorrect: false },
    ],
    hint: 'Look for the animal word in the sentence.',
    explanation: '"The dog runs fast" matches 🐕.',
  },
  {
    id: 'placement-6',
    subject: 'reading',
    skillId: 'read-a1-02',
    kind: 'wh-question',
    prompt: '"Daniel plays in the park after school." — WHERE does this happen?',
    options: [
      { id: 'a', label: 'the park', isCorrect: true },
      { id: 'b', label: 'the kitchen', isCorrect: false },
      { id: 'c', label: 'the car', isCorrect: false },
      { id: 'd', label: 'the pool', isCorrect: false },
    ],
    hint: 'Look for the place word in the sentence.',
    explanation: 'The answer is "the park".',
  },
  {
    id: 'placement-7',
    subject: 'reading',
    skillId: 'read-a2-01',
    kind: 'complete-sentence',
    prompt: 'The bird ___ (finish the sentence)',
    options: [
      { id: 'a', label: 'sings a song', isCorrect: true },
      { id: 'b', label: 'reads a book', isCorrect: false },
      { id: 'c', label: 'bakes a cake', isCorrect: false },
      { id: 'd', label: 'kicks the ball', isCorrect: false },
    ],
    hint: 'Which ending makes sense for a bird?',
    explanation: 'A bird sings a song.',
  },
  {
    id: 'placement-8',
    subject: 'reading',
    skillId: 'read-b1-01',
    kind: 'sentence-that-makes-sense',
    prompt: 'Which sentence makes sense?',
    options: [
      { id: 'a', label: 'The cat sleeps on the bed', isCorrect: true },
      { id: 'b', label: 'sleeps on the bed the cat', isCorrect: false },
      { id: 'c', label: 'bed the on sleeps cat', isCorrect: false },
      { id: 'd', label: 'on cat bed sleeps the', isCorrect: false },
    ],
    hint: 'The subject usually comes first.',
    explanation: '"The cat sleeps on the bed" is correct.',
  },
]

export function scorePlacement(answers: { questionId: string; correct: boolean }[]): PlacementResult {
  const mathAnswers = answers.filter((a) => PLACEMENT_QUESTIONS.find((q) => q.id === a.questionId)?.subject === 'math')
  const readingAnswers = answers.filter((a) => PLACEMENT_QUESTIONS.find((q) => q.id === a.questionId)?.subject === 'reading')

  const mathScore = mathAnswers.length ? Math.round((mathAnswers.filter((a) => a.correct).length / mathAnswers.length) * 100) : 0
  const readingScore = readingAnswers.length ? Math.round((readingAnswers.filter((a) => a.correct).length / readingAnswers.length) * 100) : 0
  const overall = Math.round((mathScore + readingScore) / 2)

  let band: DifficultyBand = 'foundation'
  let recommendation =
    'We will start at the very beginning to build rock-solid confidence before speeding up.'

  if (overall >= 90) {
    band = 'super-advanced'
    recommendation = 'Wow! Daniel is ready to start ahead of the usual pace — we will begin ' +
      'a little further along the roadmap and keep challenging him.'
  } else if (overall >= 70) {
    band = 'ahead-track'
    recommendation = 'Great foundation! We will start slightly ahead of the beginning and ramp up quickly.'
  } else if (overall >= 45) {
    band = 'getting-stronger'
    recommendation = 'Solid start! We will begin at the foundation and move up as soon as skills feel easy.'
  }

  return { band, mathScore, readingScore, recommendation }
}

/** Maps a placement band to a starting skill id for each subject. */
export function startingSkillsForBand(band: DifficultyBand): { mathSkillId: string; readingSkillId: string } {
  switch (band) {
    case 'super-advanced':
      return { mathSkillId: 'math-a-01', readingSkillId: 'read-b1-01' }
    case 'ahead-track':
      return { mathSkillId: 'math-2a-01', readingSkillId: 'read-a2-01' }
    case 'getting-stronger':
      return { mathSkillId: 'math-5a-01', readingSkillId: 'read-a1-01' }
    case 'foundation':
    default:
      return { mathSkillId: 'math-6a-01', readingSkillId: 'read-a1-01' }
  }
}
