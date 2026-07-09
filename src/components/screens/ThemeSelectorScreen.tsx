import { motion } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { THEME_LIST } from '../../data/themeWorlds'
import type { ThemeWorld } from '../../types'
import ParticleField from '../ui/ParticleField'
import GlassCard from '../ui/GlassCard'

export default function ThemeSelectorScreen() {
  const selectTheme = useGameStore((s) => s.selectTheme)
  const setScreen = useGameStore((s) => s.setScreen)
  const settings = useGameStore((s) => s.settings)
  const placementCompleted = useGameStore((s) => s.progress.placementCompleted)

  const handlePick = (theme: ThemeWorld) => {
    if (settings.lockedThemeIds.includes(theme.id)) return
    selectTheme(theme.id)
    setScreen(placementCompleted ? 'mission-map' : 'placement')
  }

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden px-6 py-14"
      style={{
        background:
          'radial-gradient(circle at 15% -10%, rgba(139,109,245,0.20), transparent 55%), radial-gradient(circle at 90% 100%, rgba(245,196,83,0.14), transparent 50%), linear-gradient(160deg, #0a0713, #14101f, #08060d)',
      }}
    >
      <ParticleField color="#8b6df5" count={30} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.3em] text-xs text-white/40 font-display mb-3">Choose Your World</p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-shimmer">Pick an Adventure</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {THEME_LIST.map((theme, i) => {
            const locked = settings.lockedThemeIds.includes(theme.id)
            return (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <GlassCard
                  onClick={() => handlePick(theme)}
                  className={`relative overflow-hidden p-6 h-full cursor-pointer transition-transform ${locked ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:-translate-y-1'}`}
                  style={{
                    background: `radial-gradient(circle at 30% 0%, ${theme.accent}45, transparent 62%), linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`,
                    boxShadow: locked ? undefined : `0 0 0 1px ${theme.accent}30, 0 20px 45px -20px ${theme.accent}55`,
                  }}
                  whileHover={locked ? {} : { scale: 1.02 }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)` }}
                  />
                  <div
                    className={`w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center mb-4 ${locked ? '' : 'animate-float'}`}
                    style={{ background: `${theme.accent}22`, border: `2px solid ${theme.accent}70`, boxShadow: `0 0 32px -6px ${theme.accent}99` }}
                  >
                    <img src={theme.helperImage} alt={theme.helperName} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-1">{theme.name}</h3>
                  <p className="text-sm mb-4 font-semibold" style={{ color: theme.accent }}>
                    {theme.tagline}
                  </p>
                  <p className="text-xs text-white/50 leading-relaxed">{theme.description}</p>
                  {locked && (
                    <p className="mt-4 text-xs font-display font-semibold text-white/60">🔒 Locked by parent</p>
                  )}
                </GlassCard>
              </motion.div>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <button onClick={() => setScreen('home')} className="text-white/40 hover:text-white/70 text-sm font-display">
            ← Back
          </button>
        </div>
      </div>
    </div>
  )
}
