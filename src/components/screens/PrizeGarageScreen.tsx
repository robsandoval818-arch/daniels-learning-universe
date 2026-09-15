import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { getTheme } from '../../data/themeWorlds'
import { PRIZES, PRIZE_CATEGORIES } from '../../data/prizes'
import type { PrizeCategory } from '../../types'
import ThemeBackground from '../ui/ThemeBackground'
import TopBar from '../ui/TopBar'
import GlassCard from '../ui/GlassCard'
import { useAutoNarrate } from '../../hooks/useSpeak'

export default function PrizeGarageScreen() {
  const progress = useGameStore((s) => s.progress)
  const setScreen = useGameStore((s) => s.setScreen)
  const buyPrize = useGameStore((s) => s.buyPrize)
  const theme = getTheme(progress.themeId)

  const [category, setCategory] = useState<PrizeCategory>('planes')
  const [justBought, setJustBought] = useState<string | null>(null)

  const items = PRIZES.filter((p) => p.category === category)
  const ownedCount = progress.ownedPrizeIds.length

  useAutoNarrate(
    'Prize Garage! Spend your coins on planes, race cars, robots, and dinos.',
  )

  const handleBuy = (id: string, cost: number) => {
    const ok = buyPrize(id, cost)
    if (ok) {
      setJustBought(id)
      setTimeout(() => setJustBought(null), 1200)
    }
  }

  return (
    <ThemeBackground theme={theme}>
      <TopBar theme={theme} stars={progress.stars} streak={progress.streakDays} onBack={() => setScreen('mission-map')} title="Prize Garage" />

      <div className="px-6 pb-16 max-w-2xl mx-auto">
        <GlassCard className="p-5 mb-6 flex items-center justify-between" glow>
          <div>
            <p className="font-display text-sm text-white/50">Your balance</p>
            <p className="font-display text-2xl font-bold text-aurora-gold">🪙 {progress.coins}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-sm text-white/50">Collected</p>
            <p className="font-display text-lg font-bold" style={{ color: theme.accent }}>
              {ownedCount}/{PRIZES.length}
            </p>
          </div>
        </GlassCard>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {PRIZE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`shrink-0 rounded-2xl px-4 py-2.5 text-sm font-display font-semibold transition flex items-center gap-2
                ${category === c.id ? 'text-black' : 'glass text-white/60 hover:bg-white/10'}
              `}
              style={category === c.id ? { background: theme.accent } : {}}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {items.map((prize) => {
            const owned = progress.ownedPrizeIds.includes(prize.id)
            const canAfford = progress.coins >= prize.cost
            return (
              <motion.button
                key={prize.id}
                onClick={() => !owned && canAfford && handleBuy(prize.id, prize.cost)}
                disabled={owned || !canAfford}
                whileTap={owned || !canAfford ? {} : { scale: 0.95 }}
                className={`relative overflow-visible rounded-2xl p-4 flex flex-col items-center gap-2 border transition
                  ${owned ? 'bg-emerald-500/15 border-emerald-400/50' : canAfford ? 'glass border-white/10 hover:bg-white/10' : 'bg-white/[0.02] border-white/5 opacity-50'}
                `}
              >
                <span className="text-4xl">{prize.icon}</span>
                <span className="font-display text-xs font-semibold text-center">{prize.name}</span>
                {owned ? (
                  <span className="text-[11px] font-display font-semibold text-emerald-300">✓ Owned</span>
                ) : (
                  <span className="text-[11px] font-display font-semibold text-white/50">🪙 {prize.cost}</span>
                )}

                <AnimatePresence>
                  {justBought === prize.id && (
                    <motion.span
                      initial={{ opacity: 0, y: 0, scale: 0.6 }}
                      animate={{ opacity: 1, y: -24, scale: 1.2 }}
                      exit={{ opacity: 0, y: -40 }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className="absolute left-1/2 -translate-x-1/2 top-2 text-2xl pointer-events-none"
                    >
                      🎉
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>

        <p className="text-white/30 text-xs text-center mt-8">
          Earn coins by getting words right in Sight Words Sprint, or finishing daily missions.
        </p>
      </div>
    </ThemeBackground>
  )
}
