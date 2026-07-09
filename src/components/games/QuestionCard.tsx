import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Question, ThemeWorld } from '../../types'
import GlassCard from '../ui/GlassCard'
import { randomEncouragement } from '../../lib/masteryEngine'
import { useAutoNarrate, useSpeakOnDemand } from '../../hooks/useSpeak'

interface QuestionCardProps {
  question: Question
  theme: ThemeWorld
  questionNumber: number
  totalQuestions: number
  onAnswer: (correct: boolean) => void
}

type Status = 'idle' | 'correct' | 'wrong-retry' | 'reveal'

function VisualBlock({ question }: { question: Question }) {
  if (!question.visual) return null
  const { type, data } = question.visual

  if (type === 'trace') {
    return (
      <div className="flex justify-center my-4">
        <div
          className="font-display font-bold text-7xl sm:text-8xl select-none"
          style={{ WebkitTextStroke: '2px rgba(255,255,255,0.5)', color: 'transparent' }}
        >
          {data}
        </div>
      </div>
    )
  }

  if (type === 'story-panel' && Array.isArray(data)) {
    return (
      <div className="flex flex-wrap justify-center gap-3 my-4">
        {data.map((panel, i) => (
          <div key={i} className="glass rounded-2xl px-4 py-3 text-sm sm:text-base max-w-[10rem] text-center">
            {panel}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex justify-center my-4">
      <div className="text-4xl sm:text-5xl tracking-wide text-center leading-relaxed break-words max-w-lg">
        {String(data)}
      </div>
    </div>
  )
}

export default function QuestionCard({ question, theme, questionNumber, totalQuestions, onAnswer }: QuestionCardProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [wrongIds, setWrongIds] = useState<string[]>([])
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    setStatus('idle')
    setSelectedId(null)
    setWrongIds([])
    setMessage('')
  }, [question.id])

  const correctOption = question.options.find((o) => o.isCorrect)
  const showHint = status === 'wrong-retry' || status === 'reveal'

  // Read the question and its choices aloud automatically whenever a new
  // question loads — the core "help him" feature for a pre/early reader.
  const choicesText = question.options.map((o) => o.label).join(', ')
  const narrationText = `${question.prompt} Your choices are: ${choicesText}.`
  useAutoNarrate(narrationText)
  const speakNow = useSpeakOnDemand()

  // Also read the encouragement + hint/explanation aloud once it appears.
  const feedbackNarration = message
    ? `${message}${showHint ? ' ' + (status === 'reveal' ? question.explanation : question.hint) : ''}`
    : ''
  useAutoNarrate(feedbackNarration)

  const handleSelect = (optionId: string, isCorrect: boolean) => {
    if (status === 'correct' || status === 'reveal') return
    setSelectedId(optionId)

    if (isCorrect) {
      setStatus('correct')
      setMessage(randomEncouragement(true))
      setTimeout(() => onAnswer(true), 1300)
      return
    }

    const newWrong = [...wrongIds, optionId]
    setWrongIds(newWrong)
    setMessage(randomEncouragement(false))

    if (newWrong.length >= 2) {
      setStatus('reveal')
      setTimeout(() => onAnswer(false), 1900)
    } else {
      setStatus('wrong-retry')
    }
  }

  return (
    <GlassCard className="p-6 sm:p-8 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-display font-semibold uppercase tracking-widest text-white/50">
            Question {questionNumber} of {totalQuestions}
          </span>
          <button
            onClick={() => speakNow(narrationText)}
            aria-label="Read question aloud"
            className="w-7 h-7 rounded-full glass flex items-center justify-center text-sm hover:bg-white/10 active:scale-95 transition"
          >
            🔊
          </button>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 w-6 rounded-full transition-colors"
              style={{ background: i < questionNumber - 1 ? theme.accent : i === questionNumber - 1 ? `${theme.accent}88` : 'rgba(255,255,255,0.12)' }}
            />
          ))}
        </div>
      </div>

      <p className="font-display text-xl sm:text-2xl font-semibold leading-snug whitespace-pre-line text-center">
        {question.prompt}
      </p>

      <VisualBlock question={question} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {question.options.map((option) => {
          const isSelected = selectedId === option.id
          const isWrongPicked = wrongIds.includes(option.id)
          const revealCorrect = status === 'reveal' && option.isCorrect
          const showAsCorrect = (status === 'correct' && isSelected) || revealCorrect

          return (
            <motion.button
              key={option.id}
              onClick={() => handleSelect(option.id, option.isCorrect)}
              disabled={status === 'correct' || status === 'reveal' || isWrongPicked}
              whileTap={{ scale: 0.97 }}
              animate={isWrongPicked && isSelected ? { x: [-6, 6, -6, 6, 0] } : {}}
              className={`rounded-2xl px-5 py-4 text-lg font-display font-semibold text-left transition-colors border
                ${showAsCorrect ? 'bg-emerald-500/25 border-emerald-400 text-emerald-100' : ''}
                ${isWrongPicked ? 'bg-rose-500/20 border-rose-400/60 text-rose-100 opacity-70' : ''}
                ${!showAsCorrect && !isWrongPicked ? 'glass border-white/10 hover:bg-white/10' : ''}
              `}
            >
              {option.label}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={message + status}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 text-center"
          >
            <p className="font-display font-semibold" style={{ color: theme.accent }}>
              {message}
            </p>
            {showHint && (
              <p className="text-white/60 text-sm mt-1">
                💡 {status === 'reveal' ? question.explanation : question.hint}
              </p>
            )}
            {status === 'reveal' && correctOption && (
              <p className="text-white/40 text-xs mt-1">The answer was "{correctOption.label}".</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}
