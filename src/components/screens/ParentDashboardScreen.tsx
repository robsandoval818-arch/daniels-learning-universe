import { useMemo, useState } from 'react'
import { useGameStore } from '../../store/useGameStore'
import { getTheme } from '../../data/themeWorlds'
import { THEME_LIST } from '../../data/themeWorlds'
import { MATH_CORE_SKILLS, MATH_STRETCH_SKILLS } from '../../data/mathCurriculum'
import { READING_CORE_SKILLS, READING_STRETCH_SKILLS } from '../../data/readingCurriculum'
import { getMathSkillById } from '../../data/mathCurriculum'
import { getReadingSkillById } from '../../data/readingCurriculum'
import { accuracyOf } from '../../lib/masteryEngine'
import type { DifficultyBand } from '../../types'
import ThemeBackground from '../ui/ThemeBackground'
import GlassCard from '../ui/GlassCard'
import GlowButton from '../ui/GlowButton'
import PinPad from '../ui/PinPad'

const BAND_OPTIONS: { value: DifficultyBand; label: string }[] = [
  { value: 'foundation', label: 'Foundation' },
  { value: 'getting-stronger', label: 'Getting Stronger' },
  { value: 'ahead-track', label: 'Ahead Track' },
  { value: 'super-advanced', label: 'Super Advanced' },
]

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <GlassCard className="p-4 text-center">
      <p className="text-2xl font-display font-bold">{value}</p>
      <p className="text-[11px] text-white/50 uppercase tracking-wider mt-1">{label}</p>
    </GlassCard>
  )
}

export default function ParentDashboardScreen() {
  const progress = useGameStore((s) => s.progress)
  const settings = useGameStore((s) => s.settings)
  const parentUnlocked = useGameStore((s) => s.parentUnlocked)
  const setScreen = useGameStore((s) => s.setScreen)
  const unlockParent = useGameStore((s) => s.unlockParent)
  const lockParent = useGameStore((s) => s.lockParent)
  const setPin = useGameStore((s) => s.setPin)
  const updateSettings = useGameStore((s) => s.updateSettings)
  const setStartingLevel = useGameStore((s) => s.setStartingLevel)
  const toggleThemeLock = useGameStore((s) => s.toggleThemeLock)
  const addCustomWord = useGameStore((s) => s.addCustomWord)
  const removeCustomWord = useGameStore((s) => s.removeCustomWord)
  const addCustomMathFact = useGameStore((s) => s.addCustomMathFact)
  const resetProgress = useGameStore((s) => s.resetProgress)
  const exportProgress = useGameStore((s) => s.exportProgress)

  const theme = getTheme(progress.themeId)
  const [newPin, setNewPin] = useState('')
  const [wordInput, setWordInput] = useState('')
  const [factInput, setFactInput] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const [roadmapOpen, setRoadmapOpen] = useState(false)

  const mathAttempts = useMemo(
    () => Object.values(progress.mastery).filter((m) => MATH_CORE_SKILLS.some((s) => s.id === m.skillId)),
    [progress.mastery],
  )
  const readingAttemptsList = useMemo(
    () => Object.values(progress.mastery).filter((m) => READING_CORE_SKILLS.some((s) => s.id === m.skillId)),
    [progress.mastery],
  )

  const mathAccuracy = useMemo(() => {
    const totalAttempts = mathAttempts.reduce((sum, m) => sum + m.attempts, 0)
    const totalCorrect = mathAttempts.reduce((sum, m) => sum + m.correct, 0)
    return totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0
  }, [mathAttempts])

  const readingAccuracy = useMemo(() => {
    const totalAttempts = readingAttemptsList.reduce((sum, m) => sum + m.attempts, 0)
    const totalCorrect = readingAttemptsList.reduce((sum, m) => sum + m.correct, 0)
    return totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0
  }, [readingAttemptsList])

  const masteredSkills = Object.values(progress.mastery).filter((m) => m.status === 'mastered')
  const reviewSkills = Object.values(progress.mastery).filter((m) => m.status === 'needs-review')

  const last7Days = useMemo(() => {
    const days: { date: string; count: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const iso = d.toISOString().slice(0, 10)
      const count = progress.sessions.filter((s) => s.date === iso).reduce((sum, s) => sum + s.questionsAnswered, 0)
      days.push({ date: iso.slice(5), count })
    }
    return days
  }, [progress.sessions])

  const maxDayCount = Math.max(1, ...last7Days.map((d) => d.count))
  const currentMathSkill = getMathSkillById(progress.currentMathSkillId)
  const currentReadingSkill = getReadingSkillById(progress.currentReadingSkillId)
  const upcomingMath = MATH_CORE_SKILLS.filter((s) => s.order > (currentMathSkill?.order ?? 0)).slice(0, 3)
  const upcomingReading = READING_CORE_SKILLS.filter((s) => s.order > (currentReadingSkill?.order ?? 0)).slice(0, 3)

  const handleExport = () => {
    const data = exportProgress()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `daniels-learning-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!parentUnlocked) {
    return (
      <ThemeBackground theme={theme}>
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <PinPad onSubmit={unlockParent} />
          <button onClick={() => setScreen('home')} className="mt-6 text-white/40 hover:text-white/70 text-sm font-display">
            ← Back to Home
          </button>
        </div>
      </ThemeBackground>
    )
  }

  return (
    <ThemeBackground theme={theme} particles={false}>
      <div className="px-6 py-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="uppercase tracking-[0.3em] text-xs text-white/40 font-display mb-1">Private Academy Analytics</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">Parent Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                lockParent()
                setScreen('home')
              }}
              className="glass rounded-xl px-4 py-2 text-sm font-display hover:bg-white/10"
            >
              Lock &amp; Exit
            </button>
          </div>
        </div>

        {/* Stat overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Day Streak" value={progress.streakDays} />
          <StatCard label="Sessions" value={progress.totalSessions} />
          <StatCard label="Minutes Played" value={Math.round(progress.totalTimePlayedSeconds / 60)} />
          <StatCard label="Missions Done" value={progress.completedDays.length} />
          <StatCard label="Math Accuracy" value={`${mathAccuracy}%`} />
          <StatCard label="Reading Accuracy" value={`${readingAccuracy}%`} />
          <StatCard label="Current Math Level" value={currentMathSkill?.level ?? '—'} />
          <StatCard label="Current Reading Level" value={currentReadingSkill?.level ?? '—'} />
        </div>

        {/* 7-day chart */}
        <GlassCard className="p-6 mb-8">
          <h3 className="font-display font-semibold mb-4">Last 7 Days — Questions Answered</h3>
          <div className="flex items-end gap-3 h-32">
            {last7Days.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg"
                  style={{
                    height: `${(d.count / maxDayCount) * 100}%`,
                    minHeight: d.count > 0 ? 6 : 2,
                    background: d.count > 0 ? theme.accent : 'rgba(255,255,255,0.08)',
                  }}
                />
                <span className="text-[10px] text-white/40">{d.date}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold mb-3">Mastered Skills ({masteredSkills.length})</h3>
            {masteredSkills.length === 0 ? (
              <p className="text-white/40 text-sm">No skills mastered yet — keep practicing daily!</p>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {masteredSkills.map((m) => {
                  const skill = getMathSkillById(m.skillId) ?? getReadingSkillById(m.skillId)
                  return (
                    <li key={m.skillId} className="flex justify-between text-sm">
                      <span className="text-white/80">{skill?.skillName ?? m.skillId}</span>
                      <span className="text-emerald-400">{accuracyOf(m)}%</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-display font-semibold mb-3">Needs Review ({reviewSkills.length})</h3>
            {reviewSkills.length === 0 ? (
              <p className="text-white/40 text-sm">Nothing needs review right now. 🎉</p>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {reviewSkills.map((m) => {
                  const skill = getMathSkillById(m.skillId) ?? getReadingSkillById(m.skillId)
                  return (
                    <li key={m.skillId} className="flex justify-between text-sm">
                      <span className="text-white/80">{skill?.skillName ?? m.skillId}</span>
                      <span className="text-aurora-rose">{accuracyOf(m)}%</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </GlassCard>
        </div>

        <GlassCard className="p-6 mb-8">
          <h3 className="font-display font-semibold mb-3">Upcoming Skills</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/40 uppercase text-xs mb-2">Math</p>
              <ul className="space-y-1">
                {upcomingMath.map((s) => (
                  <li key={s.id} className="text-white/70">{s.skillName}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white/40 uppercase text-xs mb-2">Reading</p>
              <ul className="space-y-1">
                {upcomingReading.map((s) => (
                  <li key={s.id} className="text-white/70">{s.skillName}</li>
                ))}
              </ul>
            </div>
          </div>
          <button
            onClick={() => setRoadmapOpen((v) => !v)}
            className="mt-4 text-xs font-display font-semibold" style={{ color: theme.accent }}
          >
            {roadmapOpen ? 'Hide Full Roadmap ▲' : 'View Full Curriculum Roadmap ▼'}
          </button>
          {roadmapOpen && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs max-h-64 overflow-y-auto pr-2">
              <div>
                <p className="text-white/40 uppercase mb-2">Math — Core → Stretch</p>
                {[...MATH_CORE_SKILLS, ...MATH_STRETCH_SKILLS].map((s) => (
                  <p key={s.id} className={s.stage === 'stretch' ? 'text-white/30' : 'text-white/70'}>
                    {s.level}: {s.skillName}
                  </p>
                ))}
              </div>
              <div>
                <p className="text-white/40 uppercase mb-2">Reading — Core → Stretch</p>
                {[...READING_CORE_SKILLS, ...READING_STRETCH_SKILLS].map((s) => (
                  <p key={s.id} className={s.stage === 'stretch' ? 'text-white/30' : 'text-white/70'}>
                    {s.level}: {s.skillName}
                  </p>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6 mb-8">
          <h3 className="font-display font-semibold mb-3">Recent Question History</h3>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {progress.questionHistory.slice(-15).reverse().map((h) => (
              <div key={h.questionId} className="flex justify-between text-xs text-white/60 border-b border-white/5 py-1">
                <span>Day {h.day} · {h.subject}</span>
                <span>{new Date(h.timestamp).toLocaleTimeString()}</span>
                <span className={h.correct ? 'text-emerald-400' : 'text-aurora-rose'}>{h.correct ? 'Correct' : 'Missed'}</span>
              </div>
            ))}
            {progress.questionHistory.length === 0 && <p className="text-white/40 text-sm">No history yet.</p>}
          </div>
          <GlowButton size="md" variant="ghost" color={theme.accent} onClick={handleExport} className="mt-4">
            Export Progress (JSON) ⬇
          </GlowButton>
        </GlassCard>

        {/* Parent Controls */}
        <GlassCard className="p-6 mb-8">
          <h3 className="font-display font-semibold mb-4">Parent Controls</h3>

          <div className="mb-5">
            <p className="text-white/60 text-sm mb-2">Starting Level</p>
            <div className="flex flex-wrap gap-2">
              {BAND_OPTIONS.map((b) => (
                <button
                  key={b.value}
                  onClick={() => setStartingLevel(b.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-display ${settings.startingLevel === b.value ? 'text-obsidian-950' : 'glass'}`}
                  style={settings.startingLevel === b.value ? { background: theme.accent } : {}}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <p className="text-white/60 text-sm mb-2">Difficulty Adjustment</p>
            <div className="flex gap-2">
              {(['easier', 'normal', 'harder'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => updateSettings({ difficultyAdjustment: d })}
                  className={`px-4 py-2 rounded-xl text-sm font-display capitalize ${settings.difficultyAdjustment === d ? 'text-obsidian-950' : 'glass'}`}
                  style={settings.difficultyAdjustment === d ? { background: theme.accent } : {}}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <p className="text-white/60 text-sm mb-2">Daily Session Length: {settings.dailySessionMinutes} min</p>
            <input
              type="range"
              min={5}
              max={30}
              step={5}
              value={settings.dailySessionMinutes}
              onChange={(e) => updateSettings({ dailySessionMinutes: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div className="mb-5">
            <p className="text-white/60 text-sm mb-2">Theme Access</p>
            <div className="flex flex-wrap gap-2">
              {THEME_LIST.map((t) => {
                const locked = settings.lockedThemeIds.includes(t.id)
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleThemeLock(t.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-display glass ${locked ? 'opacity-50' : ''}`}
                  >
                    {t.helperEmoji} {locked ? 'Locked' : 'Unlocked'}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mb-5">
            <p className="text-white/60 text-sm mb-2">Sound, Narration &amp; Animations</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateSettings({ narrationOn: !settings.narrationOn })}
                className="px-4 py-2 rounded-xl text-sm font-display glass"
              >
                Read-Aloud: {settings.narrationOn ? 'On' : 'Off'}
              </button>
              <button
                onClick={() => updateSettings({ soundOn: !settings.soundOn })}
                className="px-4 py-2 rounded-xl text-sm font-display glass"
              >
                Sound: {settings.soundOn ? 'On' : 'Off'}
              </button>
              <button
                onClick={() => updateSettings({ animationsOn: !settings.animationsOn })}
                className="px-4 py-2 rounded-xl text-sm font-display glass"
              >
                Animations: {settings.animationsOn ? 'On' : 'Off'}
              </button>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-white/60 text-sm mb-1">Sight Words (Sight Words Sprint game)</p>
            <p className="text-white/40 text-xs mb-2">
              Add the exact words Daniel's working on — he can then play a fast, timed round to drill them.
            </p>
            <div className="flex gap-2">
              <input
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && wordInput.trim()) {
                    addCustomWord(wordInput.trim())
                    setWordInput('')
                  }
                }}
                placeholder="e.g. said"
                className="flex-1 glass rounded-xl px-3 py-2 text-sm bg-transparent outline-none"
              />
              <GlowButton
                size="md"
                color={theme.accent}
                onClick={() => {
                  if (wordInput.trim()) {
                    addCustomWord(wordInput.trim())
                    setWordInput('')
                  }
                }}
              >
                Add
              </GlowButton>
            </div>
            {settings.customWords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {settings.customWords.map((word) => (
                  <button
                    key={word}
                    onClick={() => removeCustomWord(word)}
                    className="glass rounded-full pl-3 pr-2 py-1 text-xs font-display flex items-center gap-1.5 hover:bg-rose-500/15 hover:border-rose-400/40 transition-colors"
                    title="Remove word"
                  >
                    {word}
                    <span className="text-white/40">✕</span>
                  </button>
                ))}
              </div>
            )}
            {settings.customWords.length > 0 && (
              <button
                onClick={() => setScreen('sight-words-sprint')}
                className="mt-3 text-xs font-display font-semibold"
                style={{ color: theme.accent }}
              >
                Try Sight Words Sprint →
              </button>
            )}
          </div>

          <div className="mb-5">
            <p className="text-white/60 text-sm mb-2">Add Custom Math Fact (e.g. "6 + 3 = 9")</p>
            <div className="flex gap-2">
              <input
                value={factInput}
                onChange={(e) => setFactInput(e.target.value)}
                placeholder="e.g. 6 + 3 = 9"
                className="flex-1 glass rounded-xl px-3 py-2 text-sm bg-transparent outline-none"
              />
              <GlowButton
                size="md"
                color={theme.accent}
                onClick={() => {
                  if (factInput.trim()) {
                    addCustomMathFact(factInput.trim())
                    setFactInput('')
                  }
                }}
              >
                Add
              </GlowButton>
            </div>
            {settings.customMathFacts.length > 0 && (
              <p className="text-white/40 text-xs mt-2">{settings.customMathFacts.join(' · ')}</p>
            )}
          </div>

          <div className="mb-5">
            <p className="text-white/60 text-sm mb-2">Parent PIN</p>
            <div className="flex gap-2">
              <input
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Set a 4-digit PIN"
                className="flex-1 glass rounded-xl px-3 py-2 text-sm bg-transparent outline-none"
              />
              <GlowButton
                size="md"
                color={theme.accent}
                onClick={() => {
                  if (newPin.length >= 4) {
                    setPin(newPin)
                    setNewPin('')
                  }
                }}
              >
                Save PIN
              </GlowButton>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            {!confirmReset ? (
              <button onClick={() => setConfirmReset(true)} className="text-aurora-rose text-sm font-display">
                Reset All Progress…
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-white/70 text-sm">Are you sure? This cannot be undone.</span>
                <button
                  onClick={() => {
                    resetProgress()
                    setConfirmReset(false)
                  }}
                  className="px-3 py-1.5 rounded-lg bg-aurora-rose text-white text-sm font-display"
                >
                  Yes, Reset
                </button>
                <button onClick={() => setConfirmReset(false)} className="px-3 py-1.5 rounded-lg glass text-sm font-display">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </ThemeBackground>
  )
}
