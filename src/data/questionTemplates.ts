import type { CurriculumSkill, Question, QuestionOption } from '../types'

// ─────────────────────────────────────────────────────────────────────────
// QUESTION GENERATORS — each curriculum skill points to a "template id".
// These functions procedurally build fresh, original questions from a
// seed, so every day of play feels new without hand-authoring hundreds of
// static questions. All wording, objects, and sentences below are written
// from scratch for this app.
// ─────────────────────────────────────────────────────────────────────────

// Small deterministic RNG so the same (day, slot) always produces the same
// question — good for reproducible testing & parent review.
function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function rngFor(skillId: string, seed: number) {
  let hash = 0
  for (let i = 0; i < skillId.length; i++) hash = (hash * 31 + skillId.charCodeAt(i)) | 0
  return mulberry32(hash ^ seed)
}

function randInt(rng: () => number, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]
}

function makeOptions(correct: string, distractors: string[], rng: () => number): QuestionOption[] {
  const opts: QuestionOption[] = [
    { id: 'opt-correct', label: correct, isCorrect: true },
    ...distractors.map((d, i) => ({ id: `opt-d${i}`, label: d, isCorrect: false })),
  ]
  return shuffle(opts, rng)
}

const OBJECT_EMOJI = ['⭐', '🍎', '🚀', '🐠', '🎈', '🍪', '🌟', '🧸', '🍇', '🦋']

// ── MATH GENERATORS ───────────────────────────────────────────────────────

function genCountObjects(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const max = skill.level === '6A' ? 5 : 10
  const count = randInt(rng, 1, max)
  const emoji = pick(OBJECT_EMOJI, rng)
  const distractors = shuffle(
    Array.from({ length: max + 2 }, (_, i) => i + 1).filter((n) => n !== count),
    rng,
  ).slice(0, 3)
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'math',
    skillId: skill.id,
    kind: 'count-objects',
    prompt: 'Count the objects. How many do you see?',
    options: makeOptions(String(count), distractors.map(String), rng),
    visual: { type: 'objects', data: emoji.repeat(count) },
    hint: 'Point to each one and count out loud: 1, 2, 3...',
    explanation: `There are ${count} ${emoji} in total.`,
  }
}

function genChooseNumber(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const max = skill.level === 'A' ? 100 : skill.level === '3A' ? 30 : 10
  const target = randInt(rng, 1, max)
  const distractors = shuffle(
    Array.from({ length: max }, (_, i) => i + 1).filter((n) => Math.abs(n - target) <= 5 && n !== target),
    rng,
  ).slice(0, 3)
  while (distractors.length < 3) distractors.push(randInt(rng, 1, max))
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'math',
    skillId: skill.id,
    kind: 'choose-number',
    prompt: `Which number is ${target}?`,
    options: makeOptions(String(target), distractors.map(String), rng),
    hint: 'Look carefully at how many digits and their shapes.',
    explanation: `${target} is the number ${target}.`,
  }
}

function genTraceNumber(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const target = randInt(rng, 1, 10)
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'math',
    skillId: skill.id,
    kind: 'trace-number',
    prompt: `Trace the number ${target}, then tap it below when you're done.`,
    options: makeOptions(String(target), shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], rng).filter((n) => n !== target).slice(0, 3).map(String), rng),
    visual: { type: 'trace', data: target },
    hint: 'Follow the glowing path with your finger first.',
    explanation: `Great tracing! That is the number ${target}.`,
  }
}

function genMoreOrLess(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const max = skill.level === '3A' ? 30 : 10
  const a = randInt(rng, 1, max)
  let b = randInt(rng, 1, max)
  while (b === a) b = randInt(rng, 1, max)
  const askMore = rng() > 0.5
  const answer = askMore ? Math.max(a, b) : Math.min(a, b)
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'math',
    skillId: skill.id,
    kind: 'more-or-less',
    prompt: `Which group has ${askMore ? 'MORE' : 'LESS'}: ${a} or ${b}?`,
    options: makeOptions(String(answer), [String(a === answer ? b : a)], rng),
    visual: { type: 'objects', data: `${a} vs ${b}` },
    hint: askMore ? 'The bigger number has more!' : 'The smaller number has less!',
    explanation: `${answer} is ${askMore ? 'more' : 'less'} than ${a === answer ? b : a}.`,
  }
}

function genWhatComesNext(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const start = randInt(rng, 1, 12)
  const seq = [start, start + 1, start + 2]
  const answer = start + 3
  const distractors = [answer + 1, answer - 1, answer + 2].map(String)
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'math',
    skillId: skill.id,
    kind: 'what-comes-next',
    prompt: `What comes next? ${seq.join(', ')}, ___`,
    options: makeOptions(String(answer), distractors, rng),
    visual: { type: 'number-line', data: seq.join(',') },
    hint: 'Each number is one more than the last.',
    explanation: `${answer} comes right after ${seq[2]}.`,
  }
}

function genNumberOrder(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const max = skill.level === 'A' ? 100 : 50
  const start = randInt(rng, 1, max - 5)
  const correctOrder = [start, start + 1, start + 2, start + 3]
  const shuffledDisplay = shuffle(correctOrder, rng)
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'math',
    skillId: skill.id,
    kind: 'number-order',
    prompt: `Which number comes first when putting these in order? ${shuffledDisplay.join(', ')}`,
    options: makeOptions(String(correctOrder[0]), correctOrder.slice(1).map(String), rng),
    hint: 'Find the smallest number — that comes first.',
    explanation: `In order, it's ${correctOrder.join(', ')}.`,
  }
}

function genAdditionObjects(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const max = skill.level === 'B' ? 10 : 5
  const a = randInt(rng, 1, max)
  const b = randInt(rng, 1, max - a > 0 ? max - a : 1)
  const sum = a + b
  const distractors = [sum + 1, sum - 1 > 0 ? sum - 1 : sum + 2, sum + 2].map(String)
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'math',
    skillId: skill.id,
    kind: 'addition-objects',
    prompt: `${a} + ${b} = ?`,
    options: makeOptions(String(sum), distractors, rng),
    visual: { type: 'objects', data: `${'⭐'.repeat(a)} + ${'⭐'.repeat(b)}` },
    hint: `Count all the stars together: ${a} and then ${b} more.`,
    explanation: `${a} + ${b} = ${sum}`,
  }
}

function genSubtractionObjects(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const max = skill.level === 'C' ? 20 : 10
  const a = randInt(rng, 2, max)
  const b = randInt(rng, 1, a)
  const diff = a - b
  const distractors = [diff + 1, diff + 2, Math.max(diff - 1, 0)].map(String)
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'math',
    skillId: skill.id,
    kind: 'subtraction-objects',
    prompt: `${a} - ${b} = ?`,
    options: makeOptions(String(diff), distractors, rng),
    visual: { type: 'objects', data: `${'🍪'.repeat(a)} take away ${b}` },
    hint: `Start with ${a} and cross out ${b}.`,
    explanation: `${a} - ${b} = ${diff}`,
  }
}

function genMissingNumber(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const sum = randInt(rng, 3, 10)
  const a = randInt(rng, 1, sum - 1)
  const b = sum - a
  const distractors = [b + 1, Math.max(b - 1, 0), b + 2].map(String)
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'math',
    skillId: skill.id,
    kind: 'missing-number',
    prompt: `${a} + ___ = ${sum}`,
    options: makeOptions(String(b), distractors, rng),
    hint: `Count up from ${a} until you reach ${sum}.`,
    explanation: `${a} + ${b} = ${sum}`,
  }
}

function genCompareNumbers(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const a = randInt(rng, 10, 99)
  let b = randInt(rng, 10, 99)
  while (b === a) b = randInt(rng, 10, 99)
  const symbolAnswer = a > b ? '>' : '<'
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'math',
    skillId: skill.id,
    kind: 'compare-numbers',
    prompt: `Which symbol makes this true? ${a} ___ ${b}`,
    options: makeOptions(symbolAnswer, ['=', symbolAnswer === '>' ? '<' : '>'], rng),
    hint: 'The open side of the symbol faces the bigger number.',
    explanation: `${a} ${symbolAnswer} ${b}`,
  }
}

function genMathFact(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const isMultiplication = skill.id.includes('e-01')
  const isDivision = skill.id.includes('f-01')
  if (isMultiplication) {
    const a = randInt(rng, 1, 5)
    const b = randInt(rng, 1, 5)
    const product = a * b
    return {
      id: `gen-${skill.id}-${seed}`,
      subject: 'math',
      skillId: skill.id,
      kind: 'math-fact',
      prompt: `${a} groups of ${b} — how many in total? (${a} × ${b})`,
      options: makeOptions(String(product), [product + a, product - a > 0 ? product - a : product + b, product + b].map(String), rng),
      visual: { type: 'objects', data: `${a}x${b}` },
      hint: `Add ${b} together, ${a} times.`,
      explanation: `${a} × ${b} = ${product}`,
    }
  }
  if (isDivision) {
    const b = randInt(rng, 2, 5)
    const answer = randInt(rng, 2, 5)
    const total = b * answer
    return {
      id: `gen-${skill.id}-${seed}`,
      subject: 'math',
      skillId: skill.id,
      kind: 'math-fact',
      prompt: `Share ${total} treats equally into ${b} baskets. How many in each basket?`,
      options: makeOptions(String(answer), [answer + 1, Math.max(answer - 1, 1), answer + 2].map(String), rng),
      visual: { type: 'objects', data: `${total}/${b}` },
      hint: `Try dealing them out one at a time into each basket.`,
      explanation: `${total} ÷ ${b} = ${answer}`,
    }
  }
  const max = skill.level === 'D' ? 100 : skill.level === 'C' ? 20 : 10
  const useSubtraction = rng() > 0.5
  const a = randInt(rng, 2, max)
  const b = randInt(rng, 1, useSubtraction ? a : max - a > 0 ? max - a : 1)
  const answer = useSubtraction ? a - b : a + b
  const distractors = [answer + 1, Math.max(answer - 1, 0), answer + 2].map(String)
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'math',
    skillId: skill.id,
    kind: 'math-fact',
    prompt: `${a} ${useSubtraction ? '-' : '+'} ${b} = ?`,
    options: makeOptions(String(answer), distractors, rng),
    hint: useSubtraction ? 'Count backward from the first number.' : 'Count forward from the first number.',
    explanation: `${a} ${useSubtraction ? '-' : '+'} ${b} = ${answer}`,
  }
}

// ── READING GENERATORS ────────────────────────────────────────────────────

const SIMPLE_SENTENCES = [
  { sentence: 'The dog runs fast.', who: 'The dog', what: 'runs fast', emoji: '🐕' },
  { sentence: 'The girl reads a book.', who: 'The girl', what: 'reads a book', emoji: '📖' },
  { sentence: 'The bird sings a song.', who: 'The bird', what: 'sings a song', emoji: '🐦' },
  { sentence: 'The boy kicks the ball.', who: 'The boy', what: 'kicks the ball', emoji: '⚽' },
  { sentence: 'The cat sleeps on the bed.', who: 'The cat', what: 'sleeps on the bed', emoji: '🐈' },
  { sentence: 'The fish swims in the pond.', who: 'The fish', what: 'swims in the pond', emoji: '🐟' },
  { sentence: 'The baby laughs at the puppy.', who: 'The baby', what: 'laughs at the puppy', emoji: '👶' },
  { sentence: 'The chef bakes a cake.', who: 'The chef', what: 'bakes a cake', emoji: '👨‍🍳' },
]

const WHERE_WHEN_BANK = [
  { sentence: 'Daniel plays in the park after school.', where: 'the park', when: 'after school' },
  { sentence: 'The ghosts giggle in the attic at midnight.', where: 'the attic', when: 'at midnight' },
  { sentence: 'The robot charges in the garage every night.', where: 'the garage', when: 'every night' },
  { sentence: 'The hero flies over the city at sunset.', where: 'the city', when: 'at sunset' },
]

function genMatchWord(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const item = pick(SIMPLE_SENTENCES, rng)
  const distractors = shuffle(SIMPLE_SENTENCES.filter((s) => s !== item), rng)
    .slice(0, 3)
    .map((s) => s.emoji)
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'reading',
    skillId: skill.id,
    kind: 'match-word',
    prompt: `Read: "${item.sentence}" — which picture matches?`,
    options: makeOptions(item.emoji, distractors, rng),
    hint: 'Look for the key word in the sentence.',
    explanation: `"${item.sentence}" matches ${item.emoji}.`,
  }
}

function genWhQuestion(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const askWhere = rng() > 0.5
  const item = pick(WHERE_WHEN_BANK, rng)
  const answer = askWhere ? item.where : item.when
  const wrongPool = WHERE_WHEN_BANK.filter((s) => s !== item).map((s) => (askWhere ? s.where : s.when))
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'reading',
    skillId: skill.id,
    kind: 'wh-question',
    prompt: `"${item.sentence}" — ${askWhere ? 'WHERE' : 'WHEN'} does this happen?`,
    options: makeOptions(answer, shuffle(wrongPool, rng).slice(0, 3), rng),
    hint: askWhere ? 'Look for the place in the sentence.' : 'Look for the time word in the sentence.',
    explanation: `The answer is "${answer}".`,
  }
}

function genCompleteSentence(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const item = pick(SIMPLE_SENTENCES, rng)
  const distractors = shuffle(SIMPLE_SENTENCES.filter((s) => s !== item), rng)
    .slice(0, 3)
    .map((s) => s.what)
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'reading',
    skillId: skill.id,
    kind: 'complete-sentence',
    prompt: `${item.who} ___ (finish the sentence)`,
    options: makeOptions(item.what, distractors, rng),
    hint: 'Which ending makes the sentence make sense?',
    explanation: `${item.who} ${item.what}.`,
  }
}

function genTapMatchingWord(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const item = pick(SIMPLE_SENTENCES, rng)
  const words = item.sentence.replace('.', '').split(' ')
  const target = pick(words, rng)
  const distractors = shuffle(words.filter((w) => w !== target), rng).slice(0, 3)
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'reading',
    skillId: skill.id,
    kind: 'tap-matching-word',
    prompt: `Remember this sentence: "${item.sentence}" — tap the word "${target}"`,
    options: makeOptions(target, distractors.length ? distractors : ['the', 'a', 'is'], rng),
    hint: 'Say the sentence in your head one more time.',
    explanation: `"${target}" appears in the sentence.`,
  }
}

function genSentenceThatMakesSense(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const item = pick(SIMPLE_SENTENCES, rng)
  const scrambled = `${item.what} ${item.who.toLowerCase()}`
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'reading',
    skillId: skill.id,
    kind: 'sentence-that-makes-sense',
    prompt: 'Which sentence makes sense?',
    options: makeOptions(item.sentence.replace('.', ''), [scrambled], rng),
    hint: 'The subject usually comes first — who or what is doing the action.',
    explanation: `"${item.sentence}" is correct because the subject comes first.`,
  }
}

const BEGINNING_SOUND_BANK = [
  { word: 'Sun', letter: 'S', emoji: '☀️' },
  { word: 'Moon', letter: 'M', emoji: '🌙' },
  { word: 'Tiger', letter: 'T', emoji: '🐯' },
  { word: 'Rocket', letter: 'R', emoji: '🚀' },
  { word: 'Ball', letter: 'B', emoji: '⚽' },
  { word: 'Fish', letter: 'F', emoji: '🐟' },
]

function genBeginningSound(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const item = pick(BEGINNING_SOUND_BANK, rng)
  const distractors = shuffle(BEGINNING_SOUND_BANK.filter((b) => b !== item), rng)
    .slice(0, 3)
    .map((b) => b.letter)
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'reading',
    skillId: skill.id,
    kind: 'beginning-sound',
    prompt: `${item.emoji} "${item.word}" starts with which letter?`,
    options: makeOptions(item.letter, distractors, rng),
    hint: `Say "${item.word}" slowly and listen to the very first sound.`,
    explanation: `"${item.word}" starts with the letter ${item.letter}.`,
  }
}

const STORY_SEQUENCES = [
  ['🥚 An egg sits in a nest.', '🐣 The egg cracks open.', '🐤 A little chick hops out.'],
  ['🌱 A tiny seed is planted.', '🌿 A small sprout grows.', '🌻 A tall flower blooms.'],
  ['🧺 The laundry is dirty.', '🧼 The laundry gets washed.', '👕 The laundry is folded, clean.'],
]

function genStoryOrder(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const seq = pick(STORY_SEQUENCES, rng)
  const shuffled = shuffle(seq, rng)
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'reading',
    skillId: skill.id,
    kind: 'story-order',
    prompt: `Which picture happens FIRST? ${shuffled.join(' | ')}`,
    options: makeOptions(seq[0], seq.slice(1), rng),
    visual: { type: 'story-panel', data: shuffled },
    hint: 'Think about what has to happen before the other steps.',
    explanation: `"${seq[0]}" happens first, then the rest follow in order.`,
  }
}

const VOCAB_BANK = [
  { word: 'Huge', synonym: 'Very big', antonym: 'Tiny' },
  { word: 'Happy', synonym: 'Joyful', antonym: 'Sad' },
  { word: 'Fast', synonym: 'Quick', antonym: 'Slow' },
  { word: 'Bright', synonym: 'Shiny', antonym: 'Dark' },
]

function genVocabularyMatch(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const item = pick(VOCAB_BANK, rng)
  const askSynonym = rng() > 0.5
  const answer = askSynonym ? item.synonym : item.antonym
  const wrongPool = VOCAB_BANK.filter((v) => v !== item).map((v) => (askSynonym ? v.synonym : v.antonym))
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'reading',
    skillId: skill.id,
    kind: 'vocabulary-match',
    prompt: `Which word means ${askSynonym ? 'the SAME as' : 'the OPPOSITE of'} "${item.word}"?`,
    options: makeOptions(answer, shuffle(wrongPool, rng).slice(0, 3), rng),
    hint: askSynonym ? 'Look for a word with a similar feeling.' : 'Look for a word with the opposite feeling.',
    explanation: `"${answer}" is ${askSynonym ? 'a synonym' : 'an antonym'} of "${item.word}".`,
  }
}

const ACTION_BANK = [
  { situation: 'It is raining outside and Daniel wants to stay dry.', correct: 'He brings an umbrella.', wrong: ['He brings sunglasses.', 'He brings a beach ball.'] },
  { situation: 'The robot\'s battery is low.', correct: 'It plugs in to recharge.', wrong: ['It jumps in a pool.', 'It goes to sleep in the sun.'] },
  { situation: 'A ghost is hungry for a snack.', correct: 'It looks for a glowing treat.', wrong: ['It hides under a rock.', 'It flies to the moon.'] },
]

function genCorrectAction(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const item = pick(ACTION_BANK, rng)
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'reading',
    skillId: skill.id,
    kind: 'correct-action',
    prompt: `${item.situation} What is the best thing to do?`,
    options: makeOptions(item.correct, item.wrong, rng),
    hint: 'Think about what would actually solve the problem.',
    explanation: item.correct,
  }
}

const COMPREHENSION_BANK = [
  {
    passage: 'Mia found a shiny red kite in the closet. She ran outside because the wind was strong.',
    question: 'Why did Mia go outside?',
    correct: 'Because the wind was strong',
    wrong: ['Because it was raining', 'Because she was hungry'],
  },
  {
    passage: 'The rescue bot heard a beep. A little kitten was stuck on the roof. The bot flew up to help.',
    question: 'What did the rescue bot do?',
    correct: 'It flew up to help the kitten',
    wrong: ['It went to sleep', 'It ran away'],
  },
  {
    passage: 'Every morning, the baker mixes flour and sugar. Then she puts the bread in the oven to bake.',
    question: 'What happens after the baker mixes the ingredients?',
    correct: 'She puts the bread in the oven',
    wrong: ['She eats the flour', 'She goes for a walk'],
  },
]

function genShortComprehension(skill: CurriculumSkill, seed: number): Question {
  const rng = rngFor(skill.id, seed)
  const item = pick(COMPREHENSION_BANK, rng)
  return {
    id: `gen-${skill.id}-${seed}`,
    subject: 'reading',
    skillId: skill.id,
    kind: 'short-comprehension',
    prompt: `${item.passage}\n\n${item.question}`,
    options: makeOptions(item.correct, item.wrong, rng),
    hint: 'Re-read the passage and look for the exact detail.',
    explanation: item.correct,
  }
}

// ── DISPATCH TABLE ────────────────────────────────────────────────────────

type Generator = (skill: CurriculumSkill, seed: number) => Question

export const QUESTION_GENERATORS: Record<string, Generator> = {
  'count-objects': genCountObjects,
  'choose-number': genChooseNumber,
  'trace-number': genTraceNumber,
  'more-or-less': genMoreOrLess,
  'what-comes-next': genWhatComesNext,
  'number-order': genNumberOrder,
  'addition-objects': genAdditionObjects,
  'subtraction-objects': genSubtractionObjects,
  'missing-number': genMissingNumber,
  'compare-numbers': genCompareNumbers,
  'math-fact': genMathFact,
  'match-word': genMatchWord,
  'wh-question': genWhQuestion,
  'complete-sentence': genCompleteSentence,
  'tap-matching-word': genTapMatchingWord,
  'beginning-sound': genBeginningSound,
  'sentence-that-makes-sense': genSentenceThatMakesSense,
  'story-order': genStoryOrder,
  'vocabulary-match': genVocabularyMatch,
  'correct-action': genCorrectAction,
  'short-comprehension': genShortComprehension,
}

export function generateQuestion(skill: CurriculumSkill, seed: number): Question {
  const generator = QUESTION_GENERATORS[skill.questionTemplateId] ?? genMathFact
  return generator(skill, seed)
}
