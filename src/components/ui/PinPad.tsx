import { useState } from 'react'
import { motion } from 'framer-motion'
import GlowButton from './GlowButton'
import GlassCard from './GlassCard'

interface PinPadProps {
  onSubmit: (pin: string) => boolean
  title?: string
  subtitle?: string
}

export default function PinPad({ onSubmit, title = 'Parent Access', subtitle = 'Enter your PIN to continue' }: PinPadProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const handleDigit = (d: string) => {
    if (pin.length >= 6) return
    setPin((p) => p + d)
    setError(false)
  }

  const handleSubmit = () => {
    const ok = onSubmit(pin)
    if (!ok) {
      setError(true)
      setPin('')
    }
  }

  return (
    <GlassCard className="p-8 max-w-sm w-full mx-auto text-center">
      <h2 className="font-display text-2xl font-semibold mb-1">{title}</h2>
      <p className="text-white/60 text-sm mb-6">{subtitle}</p>
      <motion.div
        animate={error ? { x: [-8, 8, -8, 8, 0] } : {}}
        className="flex justify-center gap-3 mb-6"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border ${i < pin.length ? 'bg-aurora-gold border-aurora-gold' : 'border-white/30'}`}
          />
        ))}
      </motion.div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((d, i) =>
          d === '' ? (
            <div key={i} />
          ) : (
            <button
              key={i}
              onClick={() => (d === '⌫' ? setPin((p) => p.slice(0, -1)) : handleDigit(d))}
              className="glass rounded-2xl py-4 text-xl font-display font-semibold hover:bg-white/10 active:scale-95 transition"
            >
              {d}
            </button>
          ),
        )}
      </div>
      <GlowButton onClick={handleSubmit} className="w-full" disabled={pin.length === 0}>
        Unlock
      </GlowButton>
      {error && <p className="text-aurora-rose text-sm mt-3">That PIN didn't match. Try again.</p>}
    </GlassCard>
  )
}
