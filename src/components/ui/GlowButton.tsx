import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface GlowButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode
  color?: string
  size?: 'md' | 'lg' | 'xl'
  variant?: 'solid' | 'ghost'
}

const sizeMap = {
  md: 'px-6 py-3 text-base rounded-2xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
  xl: 'px-10 py-5 text-xl rounded-3xl',
}

export default function GlowButton({
  children,
  color = '#f5c453',
  size = 'lg',
  variant = 'solid',
  className = '',
  ...rest
}: GlowButtonProps) {
  const solidStyle = {
    background: `linear-gradient(135deg, ${color}, ${color}cc)`,
    boxShadow: `0 8px 30px -6px ${color}80`,
    color: '#0a0c14',
  }
  const ghostStyle = {
    border: `1.5px solid ${color}88`,
    color: color,
    background: `${color}14`,
  }
  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`font-display font-semibold no-select select-none ${sizeMap[size]} ${className}`}
      style={variant === 'solid' ? solidStyle : ghostStyle}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
