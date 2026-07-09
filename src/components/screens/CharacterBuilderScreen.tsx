import { motion } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { getTheme } from '../../data/themeWorlds'
import { REWARDS } from '../../data/rewards'
import ThemeBackground from '../ui/ThemeBackground'
import TopBar from '../ui/TopBar'
import GlassCard from '../ui/GlassCard'
import GlowButton from '../ui/GlowButton'

// The 8 "build pieces" — every non-boss, non-certificate reward. Boss and
// certificate rewards are bonus milestones, not required to complete a
// character, so daily play always keeps steady, achievable progress.
const BUILD_PIECES = REWARDS.filter((r) => r.id !== 'reward-boss' && r.id !== 'reward-certificate')

export default function CharacterBuilderScreen() {
  const progress = useGameStore((s) => s.progress)
  const setScreen = useGameStore((s) => s.setScreen)
  const theme = getTheme(progress.themeId)

  const collected = BUILD_PIECES.filter((p) => progress.unlockedRewardIds.includes(p.id))
  const percent = Math.round((collected.length / BUILD_PIECES.length) * 100)
  const isComplete = collected.length === BUILD_PIECES.length
  const remaining = BUILD_PIECES.length - collected.length

  // Progressive reveal: fully grayscale + dim + blurred at 0%, fully clear
  // and glowing at 100%.
  const grayscale = Math.max(0, 100 - percent * 1.2)
  const brightness = 0.45 + (percent / 100) * 0.65
  const blur = Math.max(0, (100 - percent) / 100) * 4

  return (
    <ThemeBackground theme={theme}>
      <TopBar theme={theme} stars={progress.stars} streak={progress.streakDays} onBack={() => setScreen('profile')} title="Build Your Character" />

      <div className="px-6 pb-16 max-w-3xl mx-auto text-center">
        <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
          Every mission you complete earns a piece of {theme.helperName}. Collect all {BUILD_PIECES.length} to fully
          power them up.
        </p>

        <GlassCard className="p-8 mb-8 relative overflow-hidden" glow={isComplete}>
          {isComplete && (
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ background: `radial-gradient(circle at 50% 40%, ${theme.accent}55, transparent 65%)` }}
            />
          )}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto mb-6 rounded-full overflow-hidden" style={{ border: `2px solid ${theme.accent}66` }}>
            <img
              src={theme.helperImage}
              alt={theme.helperName}
              className="w-full h-full object-cover transition-all duration-700"
              style={{ filter: `grayscale(${grayscale}%) brightness(${brightness}) blur(${blur}px)` }}
            />
            {!isComplete && (
              <div className="absolute inset-0 flex items-end justify-center pb-3 bg-gradient-to-t from-black/50 to-transparent">
                <span className="font-display text-xs font-semibold text-white/80">{percent}% Built</span>
              </div>
            )}
          </div>

          <p className="font-display text-xl font-bold mb-1">
            {isComplete ? `${theme.helperName} is fully powered up!` : `${theme.helperName} is coming together...`}
          </p>
          <p className="text-white/50 text-sm mb-4">
            {isComplete
              ? 'Every piece collected. A true academy champion.'
              : `${remaining} more mission reward${remaining === 1 ? '' : 's'} to go.`}
          </p>

          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden max-w-sm mx-auto">
            <motion.div
              className="h-full rounded-full"
              style={{ background: theme.accent }}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </GlassCard>

        <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-8">
          {BUILD_PIECES.map((piece, i) => {
            const unlocked = progress.unlockedRewardIds.includes(piece.id)
            return (
              <motion.div
                key={piece.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass rounded-2xl p-3 flex flex-col items-center gap-1 ${unlocked ? '' : 'opacity-35 grayscale'}`}
                style={unlocked ? { border: `1px solid ${theme.accent}66`, boxShadow: `0 0 16px -6px ${theme.accent}88` } : {}}
              >
                <span className="text-2xl">{unlocked ? piece.icon : '🔒'}</span>
                <span className="text-[10px] font-display font-semibold text-center leading-tight text-white/70">
                  {piece.themeVariants[theme.id]}
                </span>
              </motion.div>
            )
          })}
        </div>

        {!isComplete ? (
          <GlowButton size="lg" color={theme.accent} onClick={() => setScreen('mission-map')}>
            Earn Your Next Piece →
          </GlowButton>
        ) : (
          <GlowButton size="lg" color={theme.accent} onClick={() => setScreen('theme-select')}>
            Build Another World's Character →
          </GlowButton>
        )}
      </div>
    </ThemeBackground>
  )
}
