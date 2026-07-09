import { useGameStore } from '../../store/useGameStore'
import { getTheme } from '../../data/themeWorlds'
import ThemeBackground from '../ui/ThemeBackground'
import TopBar from '../ui/TopBar'
import GlassCard from '../ui/GlassCard'
import GlowButton from '../ui/GlowButton'

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-white/80">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-14 h-8 rounded-full flex items-center px-1 transition-colors ${value ? 'bg-aurora-gold justify-end' : 'bg-white/10 justify-start'}`}
      >
        <span className="w-6 h-6 rounded-full bg-white block" />
      </button>
    </div>
  )
}

export default function SettingsScreen() {
  const progress = useGameStore((s) => s.progress)
  const settings = useGameStore((s) => s.settings)
  const setScreen = useGameStore((s) => s.setScreen)
  const updateSettings = useGameStore((s) => s.updateSettings)
  const theme = getTheme(progress.themeId)

  return (
    <ThemeBackground theme={theme}>
      <TopBar theme={theme} stars={progress.stars} streak={progress.streakDays} onBack={() => setScreen('home')} title="Settings" />
      <div className="px-6 pb-16 max-w-xl mx-auto">
        <GlassCard className="p-6 mb-6">
          <h3 className="font-display font-semibold mb-2">Play Preferences</h3>
          <ToggleRow
            label="Read-Aloud Narration"
            value={settings.narrationOn}
            onChange={(v) => updateSettings({ narrationOn: v })}
          />
          <ToggleRow label="Sound Effects" value={settings.soundOn} onChange={(v) => updateSettings({ soundOn: v })} />
          <ToggleRow label="Animations" value={settings.animationsOn} onChange={(v) => updateSettings({ animationsOn: v })} />
        </GlassCard>

        <GlassCard className="p-6 mb-6">
          <h3 className="font-display font-semibold mb-2">Grown-Up Controls</h3>
          <p className="text-white/50 text-sm mb-4">
            Adjust starting level, session length, custom words, curriculum, and view detailed analytics.
          </p>
          <GlowButton color={theme.accent} onClick={() => setScreen('parent-dashboard')}>
            Open Parent Dashboard →
          </GlowButton>
        </GlassCard>

        <p className="text-center text-white/25 text-xs">Daniel&rsquo;s Learning Universe — private build, v1.0</p>
      </div>
    </ThemeBackground>
  )
}
