import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { getTheme } from '../../data/themeWorlds'
import { pickNextTarget, buildOptions, SPRINT_ROUND_COUNT, ROUND_SECONDS } from '../../lib/sightWordsGame'
import ThemeBackground from '../ui/ThemeBackground'
import TopBar from '../ui/TopBar'
import GlassCard from '../ui/GlassCard'
import GlowButton from '../ui/GlowButton'
import TutorCoach, { type CoachMood } from '../ui/TutorCoach'
import { useAutoNarrate } from '../../hooks/useSpeak'

type Phase = 'ready' | 'playing' | 'results'
type TileState = 'idle' | 'correct' | 'wrong' | 'reveal'

export default function SightWordsSprintScreen() {
  const progress = useGameStore((s) => s.progress)
  const settings = useGameStore((s) => s.settings)
  const setScreen = useGameStore((s) => s.setScreen)
  const recordSightWordAttempt = useGameStore((s) => s.recordSightWordAttempt)
  const completeSightWordSprint = useGameStore((s) => s.completeSightWordSprint)
  const theme = getTheme(progress.themeId)
  const words = settings.customWords

  const [phase, setPhase] = useState<Phase>('ready')
  const [round, setRound] = useState(0)
  const [target, setTarget] = useState('')
  const [options, setOptions] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [tileState, setTileState] = useState<TileState>('idle')
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const [mood, setMood] = useState<CoachMood>('idle')

  const lastTargetRef = useRef<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const narration = phase === 'playing' && tileState === 'idle' ? target : ''
  useAutoNarrate(narration)

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const startRound = (roundNum: number) => {
    const t = pickNextTarget(words, progress.sightWordMastery, lastTargetRef.current)
    lastTargetRef.current = t
    setTarget(t)
    setOptions(buildOptions(t, words))
    setSelected(null)
    setTileState('idle')
    setTimeLeft(ROUND_SECONDS)
    setMood('idle')
    setRound(roundNum)

    clearTimer()
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer()
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const finishGame = (finalCorrect: number, finalBest: number) => {
    clearTimer()
    completeSightWordSprint(finalCorrect, SPRINT_ROUND_COUNT, finalBest)
    setPhase('results')
  }

  const advance = (nextCorrect: number, nextBest: number) => {
    const nextRound = round + 1
    if (nextRound >= SPRINT_ROUND_COUNT) {
      setTimeout(() => finishGame(nextCorrect, nextBest), 900)
    } else {
      setTimeout(() => startRound(nextRound), 900)
    }
  }

  // Refs mirror the latest correct/streak counts so the setInterval
  // timeout callback and rapid taps always read up-to-date numbers
  // instead of a stale closure from when the round started.
  const correctCountRef = useRef(0)
  const bestStreakRef = useRef(0)

  const handleTimeout = () => {
    setTileState('reveal')
    setMood('thinking')
    recordSightWordAttempt(target, false)
    setStreak(0)
    advance(correctCountRef.current, bestStreakRef.current)
  }

  const handlePick = (word: string) => {
    if (tileState !== 'idle') return
    clearTimer()
    setSelected(word)
    const correct = word.toLowerCase() === target.toLowerCase()
    recordSightWordAttempt(target, correct)

    if (correct) {
      const newStreak = streak + 1
      const newBest = Math.max(bestStreak, newStreak)
      const newCorrect = correctCount + 1
      setStreak(newStreak)
      setBestStreak(newBest)
      setCorrectCount(newCorrect)
      correctCountRef.current = newCorrect
      bestStreakRef.current = newBest
      setTileState('correct')
      setMood('happy')
      advance(newCorrect, newBest)
    } else {
      setStreak(0)
      setTileState('wrong')
      setMood('encouraging')
      setTimeout(() => setTileState('reveal'), 500)
      advance(correctCountRef.current, bestStreakRef.current)
    }
  }

  const handleStart = () => {
    setCorrectCount(0)
    setStreak(0)
    setBestStreak(0)
    correctCountRef.current = 0
    bestStreakRef.current = 0
    lastTargetRef.current = null
    setPhase('playing')
    startRound(0)
  }

  const handleReplay = () => {
    setPhase('ready')
  }

  useEffect(() => () => clearTimer(), [])

  if (!words.length) {
    return (
      <ThemeBackground theme={theme}>
        <TopBar theme={theme} stars={progress.stars} streak={progress.streakDays} onBack={() => setScreen('mission-map')} title="Sight Words Sprint" />
        <div className="px-6 pb-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <GlassCard className="p-8 max-w-sm" glow>
            <p className="text-4xl mb-4">📝</p>
            <h2 className="font-display text-xl font-bold mb-2">No words yet!</h2>
            <p className="text-white/60 text-sm mb-6">
              Ask a grown-up to add a few sight words in the Parent Dashboard — then come back and sprint through them!
            </p>
            <GlowButton color={theme.accent} onClick={() => setScreen('parent-dashboard')}>
              Open Parent Dashboard →
            </GlowButton>
          </GlassCard>
        </div>
      </ThemeBackground>
    )
  }

  return (
    <ThemeBackground theme={theme}>
      <TopBar theme={theme} stars={progress.stars} streak={progress.streakDays} onBack={() => setScreen('mission-map')} title="Sight Words Sprint" />

      <div className="px-6 pb-16 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {phase === 'ready' && (
            <motion.div key="ready" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full max-w-md">
              <GlassCard className="p-8 text-center" glow>
                <div className="mb-4 flex justify-center">
                  <TutorCoach theme={theme} mood="idle" size="lg" />
                </div>
                <h2 className="font-display text-2xl font-bold mb-2">⚡ Speed Round!</h2>
                <p className="text-white/60 text-sm mb-2">
                  {words.length} word{words.length === 1 ? '' : 's'} loaded. A word flashes — tap it fast before time runs out!
                </p>
                <p className="text-white/40 text-xs mb-6">{SPRINT_ROUND_COUNT} rounds · build your streak · no penalties, just speed!</p>
                <GlowButton size="lg" color={theme.accent} onClick={handleStart}>
                  Start Sprint →
                </GlowButton>
              </GlassCard>
            </motion.div>
          )}

          {phase === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-display font-semibold uppercase tracking-widest text-white/50">
                  Round {round + 1} of {SPRINT_ROUND_COUNT}
                </span>
                <div className="flex items-center gap-2 text-sm font-display font-semibold" style={{ color: theme.accent }}>
                  🔥 Streak {streak}
                </div>
              </div>

              <GlassCard className="p-6 sm:p-8" glow>
                <div className="mb-4">
                  <TutorCoach theme={theme} mood={mood} />
                </div>

                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-6">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: theme.accent }}
                    animate={{ width: `${(timeLeft / ROUND_SECONDS) * 100}%` }}
                    transition={{ duration: 0.9, ease: 'linear' }}
                  />
                </div>

                <motion.p
                  key={target}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="font-display text-5xl sm:text-6xl font-bold text-center mb-8 select-none"
                >
                  {target}
                </motion.p>

                <div className="grid grid-cols-2 gap-3">
                  {options.map((word) => {
                    const isSelected = selected === word
                    const isTarget = word.toLowerCase() === target.toLowerCase()
                    const showCorrect = (tileState === 'correct' && isSelected) || (tileState === 'reveal' && isTarget)
                    const showWrong = tileState !== 'idle' && isSelected && !isTarget

                    return (
                      <motion.button
                        key={word}
                        onClick={() => handlePick(word)}
                        disabled={tileState !== 'idle'}
                        whileTap={{ scale: 0.95 }}
                        animate={showWrong ? { x: [-6, 6, -6, 6, 0] } : {}}
                        className={`rounded-2xl px-5 py-5 text-2xl font-display font-bold transition-colors border
                          ${showCorrect ? 'bg-emerald-500/25 border-emerald-400 text-emerald-100' : ''}
                          ${showWrong ? 'bg-rose-500/20 border-rose-400/60 text-rose-100 opacity-70' : ''}
                          ${!showCorrect && !showWrong ? 'glass border-white/10 hover:bg-white/10' : ''}
                        `}
                      >
                        {word}
                      </motion.button>
                    )
                  })}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {phase === 'results' && (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
              <GlassCard className="p-8 text-center" glow>
                <p className="text-5xl mb-4">🎉</p>
                <h2 className="font-display text-2xl font-bold mb-2">Sprint Complete!</h2>
                <div className="flex justify-center gap-4 mb-6">
                  <div className="glass rounded-2xl px-5 py-3">
                    <p className="text-xl font-display font-bold" style={{ color: theme.accent }}>
                      {correctCount}/{SPRINT_ROUND_COUNT}
                    </p>
                    <p className="text-[11px] text-white/50 uppercase">Correct</p>
                  </div>
                  <div className="glass rounded-2xl px-5 py-3">
                    <p className="text-xl font-display font-bold text-aurora-gold">🔥 {bestStreak}</p>
                    <p className="text-[11px] text-white/50 uppercase">Best Streak</p>
                  </div>
                  <div className="glass rounded-2xl px-5 py-3">
                    <p className="text-xl font-display font-bold text-aurora-gold">+{correctCount * 2}</p>
                    <p className="text-[11px] text-white/50 uppercase">XP Earned</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <GlowButton color={theme.accent} onClick={handleReplay}>
                    Sprint Again →
                  </GlowButton>
                  <button
                    onClick={() => setScreen('mission-map')}
                    className="text-white/40 hover:text-white/70 text-sm font-display"
                  >
                    Back to Missions
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeBackground>
  )
}
