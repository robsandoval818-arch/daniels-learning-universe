import { useGameStore } from '../../store/useGameStore'
import { getTheme } from '../../data/themeWorlds'
import { getMathSkillById } from '../../data/mathCurriculum'
import { getReadingSkillById } from '../../data/readingCurriculum'
import ThemeBackground from '../ui/ThemeBackground'
import TopBar from '../ui/TopBar'
import GlassCard from '../ui/GlassCard'
import GlowButton from '../ui/GlowButton'
import Badge from '../ui/Badge'
import { REWARDS } from '../../data/rewards'

export default function ProfileScreen() {
  const progress = useGameStore((s) => s.progress)
  const setScreen = useGameStore((s) => s.setScreen)
  const theme = getTheme(progress.themeId)
  const mathSkill = getMathSkillById(progress.currentMathSkillId)
  const readingSkill = getReadingSkillById(progress.currentReadingSkillId)

  const earnedRewards = REWARDS.filter((r) => progress.unlockedRewardIds.includes(r.id))

  return (
    <ThemeBackground theme={theme}>
      <TopBar theme={theme} stars={progress.stars} streak={progress.streakDays} onBack={() => setScreen('home')} title="My Profile" />
      <div className="px-6 pb-16 max-w-3xl mx-auto">
        <GlassCard className="p-8 text-center mb-8" glow>
          <div
            className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-3"
            style={{ border: `2px solid ${theme.accent}88`, boxShadow: `0 0 30px -6px ${theme.accent}99` }}
          >
            <img src={theme.helperImage} alt={theme.helperName} className="w-full h-full object-cover" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-1">{progress.childName}</h2>
          <p className="text-white/50 text-sm mb-6">Explorer of {theme.name}</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-display font-bold" style={{ color: theme.accent }}>{progress.xp}</p>
              <p className="text-[11px] text-white/50 uppercase tracking-wider">Total XP</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold" style={{ color: theme.accent }}>{progress.streakDays}</p>
              <p className="text-[11px] text-white/50 uppercase tracking-wider">Day Streak</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold" style={{ color: theme.accent }}>{progress.completedDays.length}</p>
              <p className="text-[11px] text-white/50 uppercase tracking-wider">Missions Done</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 mb-8">
          <h3 className="font-display font-semibold mb-4">Current Path</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Math</span>
              <span className="font-display font-semibold">{mathSkill?.skillName ?? '—'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Reading</span>
              <span className="font-display font-semibold">{readingSkill?.skillName ?? '—'}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 mb-8">
          <h3 className="font-display font-semibold mb-4">Collection</h3>
          {earnedRewards.length === 0 ? (
            <p className="text-white/40 text-sm">Complete your first mission to start collecting!</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {earnedRewards.map((r) => (
                <Badge key={r.id} icon={r.icon} label={r.themeVariants[theme.id]} color={theme.accent} size="sm" />
              ))}
            </div>
          )}
        </GlassCard>

        <div className="flex justify-center gap-4 flex-wrap">
          <GlowButton color={theme.accent} onClick={() => setScreen('mission-map')}>
            Continue Adventure →
          </GlowButton>
          <GlowButton variant="ghost" color={theme.accent} onClick={() => setScreen('character-builder')}>
            Build Your Character →
          </GlowButton>
          <GlowButton variant="ghost" color="#8b6df5" onClick={() => setScreen('theme-select')}>
            Change World
          </GlowButton>
        </div>
      </div>
    </ThemeBackground>
  )
}
