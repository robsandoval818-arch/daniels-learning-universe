import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { getTheme } from '../../data/themeWorlds'
import { getMissionForDay } from '../../data/dailyMissions'
import type { BonusGameId } from '../../types'
import ThemeBackground from '../ui/ThemeBackground'
import TopBar from '../ui/TopBar'
import GlassCard from '../ui/GlassCard'
import GlowButton from '../ui/GlowButton'

const BONUS_COPY: Record<BonusGameId, { title: string; instructions: string; tileEmoji: string }> = {
  'rescue-path': { title: 'Rescue Path', instructions: 'Tap every glowing light to guide the rescue bot home!', tileEmoji: '🔆' },
  'ghost-catch': { title: 'Ghost Catch', instructions: 'Tap every giggling ghost before they float away!', tileEmoji: '👻' },
  'creature-training': { title: 'Creature Training', instructions: 'Tap every snack to feed your creature!', tileEmoji: '🍇' },
  'hero-flight': { title: 'Hero Flight', instructions: 'Tap every star to boost your hero through the sky!', tileEmoji: '⭐' },
  'brick-tower': { title: 'Brick Tower Build', instructions: 'Tap every brick to build your tower tall!', tileEmoji: '🧱' },
  'treasure-chest': { title: 'Treasure Chest', instructions: 'Tap every gem to fill the treasure chest!', tileEmoji: '💎' },
}

export default function BonusGameScreen() {
  const progress = useGameStore((s) => s.progress)
  const setScreen = useGameStore((s) => s.setScreen)
  const theme = getTheme(progress.themeId)
  const mission = getMissionForDay(progress.currentDay)
  const bonusId = mission?.bonusGame ?? theme.bonusGameId
  const copy = BONUS_COPY[bonusId]

  const tiles = useMemo(() => Array.from({ length: 9 }, (_, i) => i), [progress.currentDay])
  const [tapped, setTapped] = useState<number[]>([])
  const complete = tapped.length === tiles.length

  const handleTap = (id: number) => {
    if (tapped.includes(id)) return
    setTapped((prev) => [...prev, id])
  }

  return (
    <ThemeBackground theme={theme}>
      <TopBar theme={theme} stars={progress.stars} streak={progress.streakDays} onBack={() => setScreen('mission-map')} title="Bonus Mini-Game" />
      <div className="px-6 pb-16 flex flex-col items-center">
        <div className="text-center mb-6 max-w-md">
          <h2 className="font-display text-2xl font-bold mb-2">{copy.title}</h2>
          <p className="text-white/60 text-sm">{copy.instructions}</p>
        </div>

        <GlassCard className="p-6 sm:p-8 w-full max-w-md">
          <div className="grid grid-cols-3 gap-4">
            {tiles.map((id) => {
              const isTapped = tapped.includes(id)
              return (
                <motion.button
                  key={id}
                  onClick={() => handleTap(id)}
                  whileTap={{ scale: 0.9 }}
                  animate={isTapped ? { scale: [1, 1.3, 0.9], opacity: [1, 1, 0.25] } : { opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="aspect-square rounded-2xl flex items-center justify-center text-3xl glass"
                  style={isTapped ? {} : { boxShadow: `0 0 20px -4px ${theme.accent}77` }}
                  disabled={isTapped}
                >
                  {isTapped ? '✨' : copy.tileEmoji}
                </motion.button>
              )
            })}
          </div>
        </GlassCard>

        <AnimatePresence>
          {complete && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center">
              <p className="font-display text-xl font-bold mb-4" style={{ color: theme.accent }}>
                Bonus Complete! 🎉
              </p>
              <GlowButton size="lg" color={theme.accent} onClick={() => setScreen('reward-chest')}>
                Open Your Reward →
              </GlowButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeBackground>
  )
}
