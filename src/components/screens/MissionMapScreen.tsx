import { motion } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { getTheme } from '../../data/themeWorlds'
import { DAILY_MISSIONS } from '../../data/dailyMissions'
import ThemeBackground from '../ui/ThemeBackground'
import TopBar from '../ui/TopBar'
import GlassCard from '../ui/GlassCard'
import GlowButton from '../ui/GlowButton'

export default function MissionMapScreen() {
  const progress = useGameStore((s) => s.progress)
  const setScreen = useGameStore((s) => s.setScreen)
  const theme = getTheme(progress.themeId)

  const activeMission = DAILY_MISSIONS.find((m) => m.day === progress.currentDay) ?? DAILY_MISSIONS[0]

  const handleStart = () => {
    setScreen('reading-challenge')
  }

  return (
    <ThemeBackground theme={theme}>
      <TopBar theme={theme} stars={progress.stars} streak={progress.streakDays} onBack={() => setScreen('home')} title={theme.progressMapLabel} />

      <div className="px-6 pb-16 max-w-3xl mx-auto">
        <GlassCard className="p-6 sm:p-8 mb-8 text-center" glow>
          <p className="text-4xl mb-2">{theme.helperEmoji}</p>
          <h2 className="font-display text-xl sm:text-2xl font-bold mb-2">
            Day {activeMission.day}: {activeMission.title}
          </h2>
          <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
            {activeMission.themeIntro.replace('{helper}', theme.helperName).replace('{verb}', theme.missionVerb)}
          </p>
          <GlowButton size="xl" color={theme.accent} onClick={handleStart}>
            Start {theme.missionVerb} →
          </GlowButton>
          {activeMission.isBossDay && (
            <p className="mt-4 text-xs font-display font-semibold uppercase tracking-widest" style={{ color: theme.accent }}>
              ⚔️ Boss Challenge Day
            </p>
          )}
        </GlassCard>

        <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
          {DAILY_MISSIONS.map((mission, i) => {
            const isDone = progress.completedDays.includes(mission.day)
            const isCurrent = mission.day === progress.currentDay
            const isLocked = mission.day > progress.currentDay

            return (
              <motion.div
                key={mission.day}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.015 }}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-xs font-display font-semibold relative
                  ${isCurrent ? 'glass shadow-glow' : isDone ? 'bg-white/5 border border-white/10' : 'bg-white/[0.02] border border-white/5 opacity-40'}
                `}
                style={isCurrent ? { borderColor: theme.accent, boxShadow: `0 0 24px -6px ${theme.accent}99` } : {}}
              >
                {isDone ? '✅' : isLocked ? '🔒' : mission.isBossDay ? '⚔️' : theme.currencyIcon}
                <span className="mt-1">{mission.day}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </ThemeBackground>
  )
}
