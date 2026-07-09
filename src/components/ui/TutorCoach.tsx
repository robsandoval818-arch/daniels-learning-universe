import { motion, AnimatePresence, type TargetAndTransition } from 'framer-motion'
import type { ThemeWorld } from '../../types'

export type CoachMood = 'idle' | 'thinking' | 'happy' | 'encouraging'

interface TutorCoachProps {
  theme: ThemeWorld
  mood: CoachMood
  message?: string
  size?: 'md' | 'lg'
}

const MOOD_ANIMATION: Record<CoachMood, TargetAndTransition> = {
  idle: { y: [0, -8, 0], rotate: [0, 1, -1, 0] },
  thinking: { rotate: [0, -4, 4, -4, 0] },
  happy: { scale: [1, 1.12, 1], y: [0, -14, 0] },
  encouraging: { x: [0, -3, 3, -3, 0] },
}

const MOOD_RING: Record<CoachMood, string> = {
  idle: '',
  thinking: 'ring-2 ring-white/30',
  happy: 'ring-4',
  encouraging: 'ring-2',
}

/**
 * A persistent "coach" presence — the theme's helper character stays
 * visible during questions (not just intro/reward screens) and reacts to
 * right/wrong answers, so it reads as a tutor sitting alongside Daniel
 * rather than a static quiz UI.
 */
export default function TutorCoach({ theme, mood, message, size = 'md' }: TutorCoachProps) {
  const dims = size === 'lg' ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-14 h-14 sm:w-16 sm:h-16'

  return (
    <div className="flex items-start gap-3">
      <motion.div
        key={mood}
        animate={MOOD_ANIMATION[mood]}
        transition={{
          duration: mood === 'happy' ? 0.6 : mood === 'encouraging' ? 0.5 : 3,
          repeat: mood === 'idle' ? Infinity : 0,
          ease: 'easeInOut',
        }}
        className={`relative shrink-0 ${dims} rounded-full overflow-hidden ${MOOD_RING[mood]}`}
        style={{
          boxShadow: `0 0 24px -4px ${theme.accent}aa`,
          border: `2px solid ${theme.accent}88`,
        }}
      >
        <img src={theme.helperImage} alt={theme.helperName} className="w-full h-full object-cover" />
      </motion.div>

      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, x: -8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative glass rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-xs sm:max-w-sm mt-1"
            style={{ borderColor: `${theme.accent}55` }}
          >
            <p className="text-xs font-display font-semibold mb-0.5" style={{ color: theme.accent }}>
              {theme.helperName}
            </p>
            <p className="text-sm text-white/85 leading-snug whitespace-pre-line">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
