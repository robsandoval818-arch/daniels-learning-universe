import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { getTheme } from '../../data/themeWorlds'
import { getMissionForDay } from '../../data/dailyMissions'
import { getRewardById } from '../../data/rewards'
import ThemeBackground from '../ui/ThemeBackground'
import GlassCard from '../ui/GlassCard'
import GlowButton from '../ui/GlowButton'
import Badge from '../ui/Badge'

export default function RewardChestScreen() {
  const progress = useGameStore((s) => s.progress)
  const setScreen = useGameStore((s) => s.setScreen)
  const claimReward = useGameStore((s) => s.claimReward)
  const completeMissionDay = useGameStore((s) => s.completeMissionDay)

  const theme = getTheme(progress.themeId)
  const mission = getMissionForDay(progress.currentDay)
  const reward = getRewardById(mission?.rewardId ?? 'reward-01')
  const themeRewardName = reward ? reward.themeVariants[theme.id] : 'Mystery Reward'

  const [opened, setOpened] = useState(false)
  const [claimed, setClaimed] = useState(false)

  const handleOpen = () => {
    setOpened(true)
    if (reward) claimReward(reward.id)
    setClaimed(true)
    completeMissionDay(progress.currentDay)
  }

  const handleContinue = () => {
    if (reward?.type === 'certificate') {
      setScreen('certificate')
    } else {
      setScreen('mission-map')
    }
  }

  return (
    <ThemeBackground theme={theme}>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="uppercase tracking-[0.3em] text-xs text-white/40 font-display mb-4">{theme.progressMapLabel.split(' ')[0]} Reward</p>

        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div key="chest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              <motion.button
                onClick={handleOpen}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                whileTap={{ scale: 0.9 }}
                className="text-8xl sm:text-9xl mb-6"
              >
                🎁
              </motion.button>
              <p className="font-display text-xl font-semibold mb-2">Mission Complete!</p>
              <p className="text-white/50 text-sm mb-8">Tap the chest to reveal your reward.</p>
            </motion.div>
          ) : (
            <motion.div
              key="reward"
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14 }}
            >
              <GlassCard className="p-8 max-w-sm mx-auto" glow>
                <div className="flex justify-center mb-4">
                  <Badge icon={reward?.icon ?? '🎉'} label={themeRewardName} color={theme.accent} size="lg" />
                </div>
                <p className="font-display text-lg font-bold mb-1" style={{ color: theme.accent }}>
                  {theme.levelUpLabel}
                </p>
                <p className="text-white/60 text-sm mb-6">You unlocked the {themeRewardName}!</p>
                <div className="flex justify-center gap-4 mb-6 text-sm">
                  <div className="glass rounded-xl px-4 py-2">+{reward?.xp ?? 10} XP</div>
                  <div className="glass rounded-xl px-4 py-2">
                    +10 {theme.currencyIcon} {theme.currencyName}
                  </div>
                </div>
                {claimed && (
                  <GlowButton color={theme.accent} onClick={handleContinue} className="w-full">
                    Continue →
                  </GlowButton>
                )}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeBackground>
  )
}
