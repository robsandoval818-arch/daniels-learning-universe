import { motion } from 'framer-motion'

interface BadgeProps {
  icon: string
  label: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'w-14 h-14 text-xl', md: 'w-20 h-20 text-3xl', lg: 'w-28 h-28 text-5xl' }

export default function Badge({ icon, label, color = '#f5c453', size = 'md' }: BadgeProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
    >
      <div
        className={`glass flex items-center justify-center rounded-full ${sizeMap[size]}`}
        style={{ boxShadow: `0 0 30px -4px ${color}88`, border: `1.5px solid ${color}66` }}
      >
        <span>{icon}</span>
      </div>
      <p className="text-xs font-display font-semibold text-white/80 text-center max-w-[7rem]">{label}</p>
    </motion.div>
  )
}
