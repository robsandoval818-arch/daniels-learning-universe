import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface ParticleFieldProps {
  count?: number
  color?: string
}

/** Soft floating particles for a cinematic, premium background feel. */
export default function ParticleField({ count = 24, color = '#f5c453' }: ParticleFieldProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1.5,
        duration: Math.random() * 8 + 8,
        delay: Math.random() * 6,
        opacity: Math.random() * 0.5 + 0.15,
      })),
    [count],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: color,
            opacity: p.opacity,
            filter: `blur(${p.size > 3 ? 1 : 0}px)`,
          }}
          animate={{ y: [0, -30, 0], opacity: [p.opacity, p.opacity * 1.6, p.opacity] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
