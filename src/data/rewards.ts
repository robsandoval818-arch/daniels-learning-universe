import type { Reward } from '../types'

// ─────────────────────────────────────────────────────────────────────────
// Reward catalog. Each reward has a name per theme world, so the same
// underlying progress feels completely different depending on which world
// Daniel picked. No loot boxes, no randomness in what you earn — every
// mission has one guaranteed reward. Healthy by design.
// ─────────────────────────────────────────────────────────────────────────

export const REWARDS: Reward[] = [
  {
    id: 'reward-01',
    name: 'First Spark',
    type: 'badge',
    icon: '✨',
    xp: 10,
    themeVariants: {
      'robot-rescue': 'Ignition Badge',
      'ghost-catcher': 'First Glow Badge',
      'creature-quest': 'Hatchling Ribbon',
      'hero-training': 'Spark Emblem',
      'brick-builder': 'Foundation Brick',
    },
  },
  {
    id: 'reward-02',
    name: 'Steady Hands',
    type: 'upgrade',
    icon: '🛠️',
    xp: 12,
    themeVariants: {
      'robot-rescue': 'Grip Arm Upgrade',
      'ghost-catcher': 'Steady Trap Handle',
      'creature-quest': 'Balance Training',
      'hero-training': 'Precision Gloves',
      'brick-builder': 'Reinforced Brick Set',
    },
  },
  {
    id: 'reward-03',
    name: 'Bright Mind',
    type: 'collectible',
    icon: '💡',
    xp: 12,
    themeVariants: {
      'robot-rescue': 'Sensor Light',
      'ghost-catcher': 'Idea Orb',
      'creature-quest': 'Glowing Antenna',
      'hero-training': 'Thinking Cap',
      'brick-builder': 'Lantern Brick',
    },
  },
  {
    id: 'reward-04',
    name: 'Speedy Streak',
    type: 'collectible',
    icon: '⚡',
    xp: 14,
    themeVariants: {
      'robot-rescue': 'Turbo Thrusters',
      'ghost-catcher': 'Zoom Broom',
      'creature-quest': 'Wind Sprint Charm',
      'hero-training': 'Speed Boots',
      'brick-builder': 'Racer Wheels',
    },
  },
  {
    id: 'reward-05',
    name: 'Kind Heart',
    type: 'collectible',
    icon: '💛',
    xp: 14,
    themeVariants: {
      'robot-rescue': 'Rescue Heart Core',
      'ghost-catcher': 'Friendly Aura',
      'creature-quest': 'Trust Bond',
      'hero-training': 'Heart Emblem',
      'brick-builder': 'Golden Heart Tile',
    },
  },
  {
    id: 'reward-06',
    name: 'Sharp Eyes',
    type: 'upgrade',
    icon: '🔎',
    xp: 15,
    themeVariants: {
      'robot-rescue': 'Scanner Visor',
      'ghost-catcher': 'Ghost-Vision Goggles',
      'creature-quest': 'Tracker Sense',
      'hero-training': 'Hawk-Eye Mask',
      'brick-builder': 'Blueprint Lens',
    },
  },
  {
    id: 'reward-07',
    name: 'Big Voice',
    type: 'collectible',
    icon: '📣',
    xp: 15,
    themeVariants: {
      'robot-rescue': 'Signal Booster',
      'ghost-catcher': 'Echo Horn',
      'creature-quest': 'Roar Training',
      'hero-training': 'Sonic Shout',
      'brick-builder': 'Announcer Bell',
    },
  },
  {
    id: 'reward-08',
    name: 'Golden Streak',
    type: 'badge',
    icon: '🏅',
    xp: 20,
    themeVariants: {
      'robot-rescue': 'Gold Circuit Medal',
      'ghost-catcher': 'Gold Spectral Medal',
      'creature-quest': 'Gold League Ribbon',
      'hero-training': 'Gold Hero Emblem',
      'brick-builder': 'Gold Builder Crest',
    },
  },
  {
    id: 'reward-boss',
    name: 'Champion Trophy',
    type: 'badge',
    icon: '🏆',
    xp: 30,
    themeVariants: {
      'robot-rescue': 'Chrome Valley Champion',
      'ghost-catcher': 'Manor Master Ghostcatcher',
      'creature-quest': 'Wildspring League Champion',
      'hero-training': 'Skyline City Guardian',
      'brick-builder': 'Brickhaven Grand Architect',
    },
  },
  {
    id: 'reward-certificate',
    name: 'Weekly Certificate',
    type: 'certificate',
    icon: '📜',
    xp: 25,
    themeVariants: {
      'robot-rescue': 'Chrome Valley Certificate of Mastery',
      'ghost-catcher': 'Moonlight Manor Certificate of Mastery',
      'creature-quest': 'Wildspring Certificate of Mastery',
      'hero-training': 'Skyline City Certificate of Mastery',
      'brick-builder': 'Brickhaven Certificate of Mastery',
    },
  },
]

export function getRewardById(id: string): Reward | undefined {
  return REWARDS.find((r) => r.id === id)
}
