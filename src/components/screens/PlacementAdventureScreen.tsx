import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { getTheme } from '../../data/themeWorlds'
import { PLACEMENT_QUESTIONS, scorePlacement } from '../../lib/placementTest'
import type { PlacementResult } from '../../types'
import ThemeBackground from '../ui/ThemeBackground'
import QuestionCard from '../games/QuestionCard'
import GlassCard from '../ui/GlassCard'
import GlowButton from '../ui/GlowButton'
import { useAutoNarrate } from '../../hooks/useSpeak'

const BAND_LABEL: Record<string, string> = {
  foundation: 'Foundation',
  'getting-stronger': 'Getting Stronger',
  'ahead-track': 'Ahead Track',
  'super-advanced': 'Super Advanced',
}

export default function PlacementAdventureScreen() {
  const progress = useGameStore((s) => s.progress)
  const setScreen = useGameStore((s) => s.setScreen)
  const completePlacement = useGameStore((s) => s.completePlacement)
  const theme = getTheme(progress.themeId)

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<{ questionId: string; correct: boolean }[]>([])
  const [result, setResult] = useState<PlacementResult | null>(null)

  const question = PLACEMENT_QUESTIONS[index]

  // Note: the question itself is narrated by QuestionCard once it mounts;
  // we only narrate the final result summary here to avoid two lines of
  // speech competing for the same moment.
  useAutoNarrate(result ? result.recommendation : null)

  const handleAnswer = (correct: boolean) => {
    const nextAnswers = [...answers, { questionId: question.id, correct }]
    setAnswers(nextAnswers)
    if (index + 1 < PLACEMENT_QUESTIONS.length) {
      setIndex(index + 1)
    } else {
      setResult(scorePlacement(nextAnswers))
    }
  }

  const handleContinue = () => {
    if (!result) return
    completePlacement(result.band, result.mathScore, result.readingScore)
    setScreen('mission-map')
  }

  return (
    <ThemeBackground theme={theme}>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center mb-8">
          <p className="uppercase tracking-[0.3em] text-xs text-white/40 font-display mb-2">Placement Adventure</p>
          <div
            className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3"
            style={{ border: `2px solid ${theme.accent}88`, boxShadow: `0 0 30px -6px ${theme.accent}99` }}
          >
            <img src={theme.helperImage} alt={theme.helperName} className="w-full h-full object-cover" />
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold">{theme.helperName} wants to meet you!</h1>
          <p className="text-white/50 text-sm mt-2 max-w-md mx-auto">
            A few quick questions so we start at exactly the right spot — no pressure, just have fun!
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key={question.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="w-full">
              <QuestionCard
                question={question}
                theme={theme}
                questionNumber={index + 1}
                totalQuestions={PLACEMENT_QUESTIONS.length}
                onAnswer={handleAnswer}
              />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg"
            >
              <GlassCard className="p-8 text-center" glow>
                <p className="text-5xl mb-4">🎉</p>
                <h2 className="font-display text-2xl font-bold mb-2">Placement Complete!</h2>
                <p className="text-white/60 text-sm mb-6">{result.recommendation}</p>
                <div className="flex justify-center gap-4 mb-6">
                  <div className="glass rounded-2xl px-5 py-3">
                    <p className="text-xl font-display font-bold" style={{ color: theme.accent }}>
                      {result.mathScore}%
                    </p>
                    <p className="text-[11px] text-white/50 uppercase">Math</p>
                  </div>
                  <div className="glass rounded-2xl px-5 py-3">
                    <p className="text-xl font-display font-bold" style={{ color: theme.accent }}>
                      {result.readingScore}%
                    </p>
                    <p className="text-[11px] text-white/50 uppercase">Reading</p>
                  </div>
                </div>
                <div className="glass inline-block rounded-full px-5 py-2 mb-6 font-display font-semibold text-sm" style={{ color: theme.accent }}>
                  Starting Path: {BAND_LABEL[result.band]}
                </div>
                <div>
                  <GlowButton onClick={handleContinue} color={theme.accent} size="lg">
                    Start Day 1 →
                  </GlowButton>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeBackground>
  )
}
