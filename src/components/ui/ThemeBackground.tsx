import type { ReactNode } from 'react'
import type { ThemeWorld } from '../../types'
import ParticleField from './ParticleField'

interface ThemeBackgroundProps {
  theme: ThemeWorld
  children: ReactNode
  particles?: boolean
}

export default function ThemeBackground({ theme, children, particles = true }: ThemeBackgroundProps) {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background: `radial-gradient(circle at 20% -10%, ${theme.accent}22, transparent 55%), linear-gradient(160deg, ${theme.gradientFrom}, ${theme.gradientVia}, ${theme.gradientTo})`,
      }}
    >
      <div className="absolute inset-0 bg-radial-fade" />
      {particles && <ParticleField color={theme.accent} />}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
