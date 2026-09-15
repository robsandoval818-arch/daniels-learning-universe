// ─────────────────────────────────────────────────────────────────────────
// Daniel's Learning Universe — Core Data Models
// ─────────────────────────────────────────────────────────────────────────

export type Subject = 'math' | 'reading'

export type ThemeId =
  | 'robot-rescue'
  | 'ghost-catcher'
  | 'creature-quest'
  | 'hero-training'
  | 'brick-builder'

export type ScreenId =
  | 'home'
  | 'profile'
  | 'theme-select'
  | 'placement'
  | 'mission-map'
  | 'reading-challenge'
  | 'math-challenge'
  | 'bonus-game'
  | 'reward-chest'
  | 'character-builder'
  | 'certificate'
  | 'parent-dashboard'
  | 'settings'
  | 'sight-words-sprint'

export type DifficultyBand =
  | 'foundation'
  | 'getting-stronger'
  | 'ahead-track'
  | 'super-advanced'

/** A single skill node extracted & adapted from the source mastery tables. */
export interface CurriculumSkill {
  id: string
  subject: Subject
  /** Original table level this skill descends from, e.g. "6A", "5A", "A1", "D1" — for internal roadmap reference only. */
  level: string
  /** Order within the level, lower = earlier. */
  order: number
  skillName: string
  /** Internal reference note — NOT shown to the child, not a copy of any worksheet. */
  sourceReference: string
  childFriendlyExplanation: string
  prerequisites: string[]
  difficulty: 1 | 2 | 3 | 4 | 5
  masteryRule: string
  sampleQuestionIds: string[]
  questionTemplateId: string
  visualSupportType: VisualSupportType
  rewardValue: number
  /** Is this part of Daniel's active early roadmap, or a future stretch goal? */
  stage: 'core' | 'stretch'
}

export type VisualSupportType =
  | 'objects'
  | 'number-line'
  | 'picture'
  | 'trace'
  | 'sentence-blocks'
  | 'story-panel'
  | 'chart'
  | 'none'

export type QuestionKind =
  // Math modes
  | 'count-objects'
  | 'choose-number'
  | 'trace-number'
  | 'more-or-less'
  | 'what-comes-next'
  | 'number-order'
  | 'addition-objects'
  | 'subtraction-objects'
  | 'missing-number'
  | 'compare-numbers'
  | 'math-fact'
  // Reading modes
  | 'match-word'
  | 'wh-question'
  | 'complete-sentence'
  | 'tap-matching-word'
  | 'beginning-sound'
  | 'sentence-that-makes-sense'
  | 'story-order'
  | 'vocabulary-match'
  | 'correct-action'
  | 'short-comprehension'

export interface QuestionOption {
  id: string
  label: string
  isCorrect: boolean
}

export interface Question {
  id: string
  subject: Subject
  skillId: string
  kind: QuestionKind
  /** Prompt text — theme wording is layered on at render time. */
  prompt: string
  options: QuestionOption[]
  /** Optional supporting data, e.g. objects to count, sentence to complete. */
  visual?: {
    type: VisualSupportType
    data: string | number | string[]
  }
  hint: string
  explanation: string
}

export interface Mission {
  day: number
  title: string
  /** {theme} placeholders get filled with theme-specific wording. */
  themeIntro: string
  mathSkillId: string
  readingSkillId: string
  mathQuestionIds: string[]
  readingQuestionIds: string[]
  bonusGame: BonusGameId
  rewardId: string
  parentNote: string
  isBossDay: boolean
}

export type BonusGameId =
  | 'rescue-path'
  | 'ghost-catch'
  | 'creature-training'
  | 'hero-flight'
  | 'brick-tower'
  | 'treasure-chest'

export interface Reward {
  id: string
  name: string
  themeVariants: Record<ThemeId, string>
  type: 'badge' | 'collectible' | 'upgrade' | 'certificate'
  icon: string
  xp: number
}

export interface ThemeWorld {
  id: ThemeId
  name: string
  tagline: string
  description: string
  helperName: string
  helperEmoji: string
  helperImage: string
  gradientFrom: string
  gradientVia: string
  gradientTo: string
  accent: string
  glow: string
  missionVerb: string
  currencyName: string
  currencyIcon: string
  badgeName: string
  levelUpLabel: string
  progressMapLabel: string
  bonusGameId: BonusGameId
  bonusGameLabel: string
}

export interface MasteryRecord {
  skillId: string
  attempts: number
  correct: number
  lastFiveResults: boolean[]
  status: 'not-started' | 'practicing' | 'mastered' | 'needs-review'
  lastPracticed: string | null
}

export interface GameSession {
  id: string
  date: string
  day: number
  subject: Subject | 'mixed'
  questionsAnswered: number
  correctAnswers: number
  durationSeconds: number
}

export interface QuestionHistoryEntry {
  questionId: string
  skillId: string
  subject: Subject
  correct: boolean
  timestamp: string
  day: number
}

export interface ChildProgress {
  childName: string
  themeId: ThemeId | null
  placementCompleted: boolean
  placementBand: DifficultyBand | null
  currentDay: number
  currentMathSkillId: string
  currentReadingSkillId: string
  xp: number
  stars: number
  coins: number
  streakDays: number
  lastPlayedDate: string | null
  totalSessions: number
  totalTimePlayedSeconds: number
  mastery: Record<string, MasteryRecord>
  /** Per-word accuracy for the Sight Words Sprint game, keyed by the exact
   * word string (lowercased). Drives adaptive round-weighting so words
   * Daniel struggles with show up more often. */
  sightWordMastery: Record<string, MasteryRecord>
  bestSightWordStreak: number
  unlockedRewardIds: string[]
  unlockedThemeIds: ThemeId[]
  sessions: GameSession[]
  questionHistory: QuestionHistoryEntry[]
  completedDays: number[]
}

export interface ParentSettings {
  pinHash: string | null
  startingLevel: DifficultyBand
  dailySessionMinutes: number
  soundOn: boolean
  narrationOn: boolean
  animationsOn: boolean
  lockedThemeIds: ThemeId[]
  customWords: string[]
  customMathFacts: string[]
  difficultyAdjustment: 'easier' | 'normal' | 'harder'
}

export interface PlacementAnswer {
  questionId: string
  correct: boolean
}

export interface PlacementResult {
  band: DifficultyBand
  mathScore: number
  readingScore: number
  recommendation: string
}
