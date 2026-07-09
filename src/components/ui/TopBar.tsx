import type { ThemeWorld } from '../../types'

interface TopBarProps {
  theme: ThemeWorld
  stars: number
  streak: number
  onBack?: () => void
  title?: string
}

export default function TopBar({ theme, stars, streak, onBack, title }: TopBarProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 sm:px-8">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="glass w-11 h-11 rounded-2xl flex items-center justify-center text-lg hover:bg-white/10 active:scale-95 transition"
            aria-label="Back"
          >
            ←
          </button>
        )}
        {title && <h1 className="font-display text-lg sm:text-xl font-semibold text-white/90">{title}</h1>}
      </div>
      <div className="flex items-center gap-3">
        <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2 text-sm font-display font-semibold">
          <span>🔥</span>
          <span>{streak}</span>
        </div>
        <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2 text-sm font-display font-semibold" style={{ color: theme.accent }}>
          <span>{theme.currencyIcon}</span>
          <span>{stars}</span>
        </div>
      </div>
    </div>
  )
}
