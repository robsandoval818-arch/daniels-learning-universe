import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { safeStorage } from '../lib/safeStorage'
import type {
  ChildProgress,
  ParentSettings,
  ScreenId,
  ThemeId,
  DifficultyBand,
  MasteryRecord,
  GameSession,
  QuestionHistoryEntry,
  Subject,
} from '../types'
import { createMasteryRecord, recordAttempt } from '../lib/masteryEngine'
import { startingSkillsForBand } from '../lib/placementTest'
import { getNextMathSkill } from '../data/mathCurriculum'
import { getNextReadingSkill } from '../data/readingCurriculum'
import { hashPin } from '../lib/pin'

const STORAGE_KEY = 'dlu-progress-v1'

function defaultProgress(): ChildProgress {
  return {
    childName: 'Daniel',
    themeId: null,
    placementCompleted: false,
    placementBand: null,
    currentDay: 1,
    currentMathSkillId: 'math-6a-01',
    currentReadingSkillId: 'read-a1-01',
    xp: 0,
    stars: 0,
    coins: 0,
    streakDays: 0,
    lastPlayedDate: null,
    totalSessions: 0,
    totalTimePlayedSeconds: 0,
    mastery: {},
    sightWordMastery: {},
    bestSightWordStreak: 0,
    unlockedRewardIds: [],
    ownedPrizeIds: [],
    unlockedThemeIds: ['robot-rescue', 'ghost-catcher', 'creature-quest', 'hero-training', 'brick-builder'],
    sessions: [],
    questionHistory: [],
    completedDays: [],
  }
}

function defaultSettings(): ParentSettings {
  return {
    pinHash: null,
    startingLevel: 'foundation',
    dailySessionMinutes: 15,
    soundOn: true,
    narrationOn: true,
    animationsOn: true,
    lockedThemeIds: [],
    customWords: [],
    customMathFacts: [],
    difficultyAdjustment: 'normal',
  }
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

interface GameStore {
  screen: ScreenId
  progress: ChildProgress
  settings: ParentSettings
  parentUnlocked: boolean
  sessionStartedAt: number | null

  setScreen: (screen: ScreenId) => void
  selectTheme: (themeId: ThemeId) => void
  beginSession: () => void
  endSession: (subject: Subject | 'mixed', questionsAnswered: number, correctAnswers: number) => void

  completePlacement: (band: DifficultyBand, mathScore: number, readingScore: number) => void

  recordAnswer: (subject: Subject, skillId: string, correct: boolean, day: number) => void
  advanceSkillIfMastered: (subject: Subject) => void
  completeMissionDay: (day: number) => void
  claimReward: (rewardId: string) => void

  unlockParent: (pin: string) => boolean
  lockParent: () => void
  setPin: (pin: string) => void
  updateSettings: (partial: Partial<ParentSettings>) => void
  setStartingLevel: (band: DifficultyBand) => void
  toggleThemeLock: (themeId: ThemeId) => void
  addCustomWord: (word: string) => void
  removeCustomWord: (word: string) => void
  addCustomMathFact: (fact: string) => void

  recordSightWordAttempt: (word: string, correct: boolean) => void
  completeSightWordSprint: (wordsCorrect: number, wordsTotal: number, bestStreak: number) => void

  /** Returns true if the purchase went through (enough coins, not already owned). */
  buyPrize: (prizeId: string, cost: number) => boolean

  resetProgress: () => void
  exportProgress: () => string
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      screen: 'home',
      progress: defaultProgress(),
      settings: defaultSettings(),
      parentUnlocked: false,
      sessionStartedAt: null,

      setScreen: (screen) => set({ screen }),

      selectTheme: (themeId) =>
        set((state) => ({
          progress: { ...state.progress, themeId },
        })),

      beginSession: () => set({ sessionStartedAt: Date.now() }),

      endSession: (subject, questionsAnswered, correctAnswers) =>
        set((state) => {
          const durationSeconds = state.sessionStartedAt
            ? Math.round((Date.now() - state.sessionStartedAt) / 1000)
            : 0
          const session: GameSession = {
            id: `session-${Date.now()}`,
            date: todayISO(),
            day: state.progress.currentDay,
            subject,
            questionsAnswered,
            correctAnswers,
            durationSeconds,
          }
          const lastPlayed = state.progress.lastPlayedDate
          const isNewDay = lastPlayed !== todayISO()
          const isConsecutive =
            lastPlayed &&
            new Date(todayISO()).getTime() - new Date(lastPlayed).getTime() === 86400000
          const streakDays = isNewDay ? (isConsecutive ? state.progress.streakDays + 1 : 1) : state.progress.streakDays

          return {
            sessionStartedAt: null,
            progress: {
              ...state.progress,
              sessions: [...state.progress.sessions, session],
              totalSessions: state.progress.totalSessions + 1,
              totalTimePlayedSeconds: state.progress.totalTimePlayedSeconds + durationSeconds,
              lastPlayedDate: todayISO(),
              streakDays,
            },
          }
        }),

      completePlacement: (band, _mathScore, _readingScore) =>
        set((state) => {
          const starting = startingSkillsForBand(band)
          return {
            progress: {
              ...state.progress,
              placementCompleted: true,
              placementBand: band,
              currentMathSkillId: starting.mathSkillId,
              currentReadingSkillId: starting.readingSkillId,
            },
            settings: { ...state.settings, startingLevel: band },
          }
        }),

      recordAnswer: (subject, skillId, correct, day) =>
        set((state) => {
          const existing = state.progress.mastery[skillId] ?? createMasteryRecord(skillId)
          const updated: MasteryRecord = recordAttempt(existing, correct)
          const historyEntry: QuestionHistoryEntry = {
            questionId: `${skillId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            skillId,
            subject,
            correct,
            timestamp: new Date().toISOString(),
            day,
          }
          return {
            progress: {
              ...state.progress,
              mastery: { ...state.progress.mastery, [skillId]: updated },
              questionHistory: [...state.progress.questionHistory.slice(-199), historyEntry],
              xp: state.progress.xp + (correct ? 2 : 1),
              stars: state.progress.stars + (correct ? 1 : 0),
            },
          }
        }),

      advanceSkillIfMastered: (subject) =>
        set((state) => {
          if (subject === 'math') {
            const record = state.progress.mastery[state.progress.currentMathSkillId]
            if (record?.status === 'mastered') {
              const next = getNextMathSkill(state.progress.currentMathSkillId)
              if (next) return { progress: { ...state.progress, currentMathSkillId: next.id } }
            }
          } else {
            const record = state.progress.mastery[state.progress.currentReadingSkillId]
            if (record?.status === 'mastered') {
              const next = getNextReadingSkill(state.progress.currentReadingSkillId)
              if (next) return { progress: { ...state.progress, currentReadingSkillId: next.id } }
            }
          }
          return {}
        }),

      completeMissionDay: (day) =>
        set((state) => ({
          progress: {
            ...state.progress,
            currentDay: Math.max(state.progress.currentDay, day + 1),
            completedDays: state.progress.completedDays.includes(day)
              ? state.progress.completedDays
              : [...state.progress.completedDays, day],
          },
        })),

      claimReward: (rewardId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            unlockedRewardIds: state.progress.unlockedRewardIds.includes(rewardId)
              ? state.progress.unlockedRewardIds
              : [...state.progress.unlockedRewardIds, rewardId],
            coins: state.progress.coins + 10,
          },
        })),

      unlockParent: (pin) => {
        const { settings } = get()
        if (!settings.pinHash) {
          set({ parentUnlocked: true })
          return true
        }
        const ok = hashPin(pin) === settings.pinHash
        if (ok) set({ parentUnlocked: true })
        return ok
      },

      lockParent: () => set({ parentUnlocked: false }),

      setPin: (pin) =>
        set((state) => ({ settings: { ...state.settings, pinHash: hashPin(pin) } })),

      updateSettings: (partial) =>
        set((state) => ({ settings: { ...state.settings, ...partial } })),

      setStartingLevel: (band) =>
        set((state) => {
          const starting = startingSkillsForBand(band)
          return {
            settings: { ...state.settings, startingLevel: band },
            progress: {
              ...state.progress,
              currentMathSkillId: starting.mathSkillId,
              currentReadingSkillId: starting.readingSkillId,
            },
          }
        }),

      toggleThemeLock: (themeId) =>
        set((state) => {
          const locked = state.settings.lockedThemeIds.includes(themeId)
          return {
            settings: {
              ...state.settings,
              lockedThemeIds: locked
                ? state.settings.lockedThemeIds.filter((t) => t !== themeId)
                : [...state.settings.lockedThemeIds, themeId],
            },
          }
        }),

      addCustomWord: (word) =>
        set((state) => {
          const trimmed = word.trim()
          if (!trimmed || state.settings.customWords.some((w) => w.toLowerCase() === trimmed.toLowerCase())) {
            return {}
          }
          return {
            settings: { ...state.settings, customWords: [...state.settings.customWords, trimmed] },
          }
        }),

      removeCustomWord: (word) =>
        set((state) => ({
          settings: { ...state.settings, customWords: state.settings.customWords.filter((w) => w !== word) },
        })),

      addCustomMathFact: (fact) =>
        set((state) => ({
          settings: { ...state.settings, customMathFacts: [...state.settings.customMathFacts, fact] },
        })),

      recordSightWordAttempt: (word, correct) =>
        set((state) => {
          const key = word.toLowerCase()
          const existing = state.progress.sightWordMastery[key] ?? createMasteryRecord(key)
          const updated: MasteryRecord = recordAttempt(existing, correct)
          return {
            progress: {
              ...state.progress,
              sightWordMastery: { ...state.progress.sightWordMastery, [key]: updated },
              // Instant payout the moment he gets one right — the whole
              // point is that the reward lands with the tap, not minutes
              // later when the round finally ends.
              xp: state.progress.xp + (correct ? 2 : 0),
              coins: state.progress.coins + (correct ? 1 : 0),
              stars: state.progress.stars + (correct ? 1 : 0),
            },
          }
        }),

      // Per-word rewards are already paid out live in recordSightWordAttempt
      // above, so this is just a flat "you finished the sprint" bonus on
      // top — not a re-award of the same words.
      completeSightWordSprint: (_wordsCorrect, _wordsTotal, bestStreak) =>
        set((state) => ({
          progress: {
            ...state.progress,
            coins: state.progress.coins + 5,
            bestSightWordStreak: Math.max(state.progress.bestSightWordStreak, bestStreak),
          },
        })),

      buyPrize: (prizeId, cost) => {
        const { progress } = get()
        if (progress.ownedPrizeIds.includes(prizeId) || progress.coins < cost) return false
        set((state) => ({
          progress: {
            ...state.progress,
            coins: state.progress.coins - cost,
            ownedPrizeIds: [...state.progress.ownedPrizeIds, prizeId],
          },
        }))
        return true
      },

      resetProgress: () => set({ progress: defaultProgress(), screen: 'home' }),

      exportProgress: () => {
        const { progress } = get()
        return JSON.stringify(progress, null, 2)
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ progress: state.progress, settings: state.settings }),
    },
  ),
)
