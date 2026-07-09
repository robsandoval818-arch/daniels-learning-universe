import { motion } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { getTheme } from '../../data/themeWorlds'
import ParticleField from '../ui/ParticleField'
import GlowButton from '../ui/GlowButton'
import GlassCard from '../ui/GlassCard'

export default function HomeScreen() {
  const progress = useGameStore((s) => s.progress)
  const setScreen = useGameStore((s) => s.setScreen)
  const theme = getTheme(progress.themeId)
  const hasStarted = !!progress.themeId

  const handleBegin = () => {
    if (!progress.themeId) {
      setScreen('theme-select')
    } else if (!progress.placementCompleted) {
      setScreen('placement')
    } else {
      setScreen('mission-map')
    }
  }

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-6"
      style={{
        background:
          'radial-gradient(circle at 50% 0%, rgba(245,196,83,0.22), transparent 55%), radial-gradient(circle at 85% 90%, rgba(139,109,245,0.16), transparent 50%), linear-gradient(160deg, #05060a, #0d1120, #05060a)',
      }}
    >
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-30 animate-float-slow pointer-events-none bg-[radial-gradient(circle,rgba(245,196,83,0.5),transparent_70%)]" />
      <ParticleField color="#f5c453" count={36} />

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl"
      >
        <p className="uppercase tracking-[0.3em] text-xs sm:text-sm text-white/40 font-display mb-4">
          A Private Academy Path
        </p>
        <h1 className="font-display text-5xl sm:text-7xl font-bold text-shimmer mb-4 leading-tight">
          Daniel&rsquo;s
          <br />
          Learning Universe
        </h1>
        <p className="text-white/60 text-base sm:text-lg max-w-md mx-auto mb-10">
          A daily reading &amp; math adventure, crafted just for you.
        </p>

        {hasStarted && (
          <GlassCard className="flex items-center justify-center gap-6 px-6 py-4 mb-8 mx-auto w-fit">
            <div className="text-center">
              <p className="text-2xl font-display font-bold" style={{ color: theme.accent }}>
                {progress.streakDays}
              </p>
              <p className="text-[11px] text-white/50 uppercase tracking-wider">Day Streak</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-aurora-gold">{progress.xp}</p>
              <p className="text-[11px] text-white/50 uppercase tracking-wider">XP</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-display font-bold">{theme.helperEmoji}</p>
              <p className="text-[11px] text-white/50 uppercase tracking-wider">{theme.name.split(' ')[0]}</p>
            </div>
          </GlassCard>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <GlowButton size="xl" onClick={handleBegin}>
            {hasStarted ? 'Continue Adventure ✨' : 'Begin Adventure ✨'}
          </GlowButton>
          {hasStarted && (
            <GlowButton size="lg" variant="ghost" color="#8b6df5" onClick={() => setScreen('theme-select')}>
              Change World
            </GlowButton>
          )}
        </div>

        <div className="mt-10 flex items-center justify-center gap-6 flex-wrap">
          {hasStarted && (
            <button
              onClick={() => setScreen('profile')}
              className="text-white/30 hover:text-white/60 text-xs font-display tracking-wide transition"
            >
              My Profile →
            </button>
          )}
          <button
            onClick={() => setScreen('settings')}
            className="text-white/30 hover:text-white/60 text-xs font-display tracking-wide transition"
          >
            Settings →
          </button>
          <button
            onClick={() => setScreen('parent-dashboard')}
            className="text-white/30 hover:text-white/60 text-xs font-display tracking-wide transition"
          >
            Parent Dashboard →
          </button>
        </div>
      </motion.div>
    </div>
  )
}
