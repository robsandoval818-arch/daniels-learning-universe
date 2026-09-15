import type { Prize, PrizeCategory } from '../types'

// ─────────────────────────────────────────────────────────────────────────
// PRIZE GARAGE catalog — what Daniel's coins are actually for. Four
// categories, three tiers of cost each, so there's always something just
// out of reach to keep saving toward. No randomness (no loot boxes) — he
// picks exactly what he wants and buys it the moment he can afford it.
// ─────────────────────────────────────────────────────────────────────────

export const PRIZES: Prize[] = [
  // Planes
  { id: 'plane-01', name: 'Biplane', category: 'planes', icon: '🛩️', cost: 30 },
  { id: 'plane-02', name: 'Jet Cruiser', category: 'planes', icon: '✈️', cost: 60 },
  { id: 'plane-03', name: 'Rocket Plane', category: 'planes', icon: '🚀', cost: 100 },

  // Race cars
  { id: 'car-01', name: 'Speedster', category: 'cars', icon: '🏎️', cost: 30 },
  { id: 'car-02', name: 'Rally Car', category: 'cars', icon: '🚗', cost: 60 },
  { id: 'car-03', name: 'Champion Racer', category: 'cars', icon: '🏁', cost: 100 },

  // Robots
  { id: 'robot-01', name: 'Mini Bot', category: 'robots', icon: '🤖', cost: 30 },
  { id: 'robot-02', name: 'Battle Bot', category: 'robots', icon: '🦾', cost: 60 },
  { id: 'robot-03', name: 'Mega Bot', category: 'robots', icon: '👾', cost: 100 },

  // Dinos
  { id: 'dino-01', name: 'Baby Dino', category: 'dinos', icon: '🦕', cost: 30 },
  { id: 'dino-02', name: 'T-Rex', category: 'dinos', icon: '🦖', cost: 60 },
  { id: 'dino-03', name: 'Dino King', category: 'dinos', icon: '🐉', cost: 100 },
]

export const PRIZE_CATEGORIES: { id: PrizeCategory; label: string; icon: string }[] = [
  { id: 'planes', label: 'Planes', icon: '✈️' },
  { id: 'cars', label: 'Race Cars', icon: '🏎️' },
  { id: 'robots', label: 'Robots', icon: '🤖' },
  { id: 'dinos', label: 'Dinos', icon: '🦖' },
]

export function getPrizeById(id: string): Prize | undefined {
  return PRIZES.find((p) => p.id === id)
}
