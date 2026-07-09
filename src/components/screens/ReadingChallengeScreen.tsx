import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { getTheme } from '../../data/themeWorlds'
import { getMissionForDay } from '../../data/dailyMissions'
import { buildQuestionSet, buildEasierFollowUp } from '../../lib/questionGenerator'
import { getReadingSkillById } from '../../data/readingCurriculum'
import ThemeBackground from '../ui/ThemeBackground'
import TopBar from '../ui/TopBar'
import QuestionCard from '../games/QuestionCard'

export default function ReadingChallengeScreen() {
  const progress = useGameStore((s) => s.progress)
  const setScreen = useGameStore((s) => s.setScreen)
  const recordAnswer = useGameStore((s) => s.recordAnswer)
  const advanceSkillIfMastered = useGameStore((s) => s.advanceSkillIfMastered)
  const beginSession = useGameStore((s) => s.beginSession)
  const endSession = useGameStore((s) => s.endSession)

  const theme = getTheme(progress.themeId)
  const mission = getMissionForDay(progress.currentDay)
  const skillId = mission?.readingSkillId ?? progress.currentReadingSkillId
  const skill = getReadingSkillById(skillId)

  const [questions, setQuestions] = useState(() => buildQuestionSet(progress.currentDay, 'reading', skillId))
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [consecutiveWrong, setConsecutiveWrong] = useState(0)

  useEffect(() => {
    beginSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setQuestions(buildQuestionSet(progress.currentDay, 'reading', skillId))
    setIndex(0)
    setCorrectCount(0)
    setConsecutiveWrong(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.currentDay, skillId])

  if (!questions.length) {
    return (
      <ThemeBackground theme={theme}>
        <div className="min-h-screen flex items-center justify-center text-white/60">Loading mission…</div>
      </ThemeBackground>
    )
  }

  const question = questions[index]

  const handleAnswer = (correct: boolean) => {
    recordAnswer('reading', skillId, correct, progress.currentDay)
    const newCorrect = correctCount + (correct ? 1 : 0)
    setCorrectCount(newCorrect)

    // Live pacing: two wrong answers in a row swaps the *next* question for
    // an easier, confidence-building one from the previous skill — like a
    // tutor noticing frustration and quietly stepping back a level.
    const nextIndex = index + 1
    if (!correct) {
      const newStreak = consecutiveWrong + 1
      setConsecutiveWrong(newStreak)
      if (newStreak >= 2 && nextIndex < questions.length) {
        const easier = buildEasierFollowUp(progress.currentDay, 'reading', skillId, nextIndex)
        setQuestions((prev) => prev.map((q, i) => (i === nextIndex ? easier : q)))
        setConsecutiveWrong(0)
      }
    } else {
      setConsecutiveWrong(0)
    }

    if (nextIndex < questions.length) {
      setIndex(nextIndex)
    } else {
      advanceSkillIfMastered('reading')
      endSession('reading', questions.length, newCorrect)
      setScreen('math-challenge')
    }
  }

  return (
    <ThemeBackground theme={theme}>
      <TopBar theme={theme} stars={progress.stars} streak={progress.streakDays} onBack={() => setScreen('mission-map')} title="Reading Mission" />
      <div className="px-6 pb-16 flex flex-col items-center">
        {skill && (
          <p className="text-white/40 text-xs font-display uppercase tracking-widest mb-6 text-center max-w-md">
            Skill focus: {skill.skillName} — {skill.childFriendlyExplanation}
          </p>
        )}
        <AnimatePresence mode="wait">
          <motion.div key={question.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="w-full">
            <QuestionCard question={question} theme={theme} questionNumber={index + 1} totalQuestions={questions.length} onAnswer={handleAnswer} />
          </motion.div>
        </AnimatePresence>
      </div>
    </ThemeBackground>
  )
}
