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
        background: `radial-gradient(circle at 18% -8%, ${theme.accent}3d, transparent 55%), radial-gradient(circle at 88% 92%, ${theme.accent}2e, transparent 50%), linear-gradient(160deg, ${theme.gradientFrom}, ${theme.gradientVia}, ${theme.gradientTo})`,
      }}
    >
      <div
        className="absolute -top-32 -left-24 w-[26rem] h-[26rem] rounded-full blur-3xl opacity-40 animate-float-slow pointer-events-none"
        style={{ background: `radial-gradient(circle, ${theme.accent}55, transparent 70%)` }}
      />
      <div
        className="absolute -bottom-40 -right-20 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-30 animate-float pointer-events-none"
        style={{ background: `radial-gradient(circle, ${theme.accent}44, transparent 70%)` }}
      />
      <div className="absolute inset-0 bg-radial-fade" />
      {particles && <ParticleField color={theme.accent} />}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
