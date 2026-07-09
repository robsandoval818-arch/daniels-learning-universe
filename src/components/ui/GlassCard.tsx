import { motion, type HTMLMotionProps } from 'framer-motion'
import { type ReactNode } from 'react'

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
  glow?: boolean
}

export default function GlassCard({ children, className = '', glow = false, ...rest }: GlassCardProps) {
  return (
    <motion.div
      className={`glass rounded-3xl shadow-inner-glass ${glow ? 'shadow-glow' : ''} ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
