import { motion } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { getTheme } from '../../data/themeWorlds'
import { getRewardById } from '../../data/rewards'
import { getMissionForDay } from '../../data/dailyMissions'
import ThemeBackground from '../ui/ThemeBackground'
import GlassCard from '../ui/GlassCard'
import GlowButton from '../ui/GlowButton'

export default function CertificateScreen() {
  const progress = useGameStore((s) => s.progress)
  const setScreen = useGameStore((s) => s.setScreen)
  const theme = getTheme(progress.themeId)
  const mission = getMissionForDay(progress.currentDay)
  const reward = getRewardById(mission?.rewardId ?? 'reward-certificate') ?? getRewardById('reward-certificate')!
  const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <ThemeBackground theme={theme}>
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-xl">
          <GlassCard className="p-10 text-center relative overflow-hidden" glow>
            <div
              className="absolute inset-0 opacity-40"
              style={{ background: `radial-gradient(circle at 50% 0%, ${theme.accent}33, transparent 60%)` }}
            />
            <div className="relative">
              <p className="text-5xl mb-4">📜</p>
              <p className="uppercase tracking-[0.3em] text-xs text-white/40 font-display mb-2">Certificate of Mastery</p>
              <h1 className="font-display text-3xl font-bold mb-6 text-shimmer">{reward.themeVariants[theme.id]}</h1>
              <p className="text-white/70 mb-1">This certifies that</p>
              <p className="font-display text-2xl font-bold mb-4" style={{ color: theme.accent }}>
                {progress.childName}
              </p>
              <p className="text-white/70 mb-6">
                has completed {progress.completedDays.length} missions in {theme.name} with dedication, focus, and a
                powered-up brain.
              </p>
              <p className="text-white/40 text-sm mb-8">{dateStr}</p>
              <GlowButton color={theme.accent} onClick={() => setScreen('mission-map')}>
                Continue the Adventure →
              </GlowButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </ThemeBackground>
  )
}
