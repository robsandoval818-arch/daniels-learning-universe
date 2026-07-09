import type { ThemeWorld, ThemeId } from '../types'
import captainCog from '../assets/characters/captain-cog.webp'
import professorBoo from '../assets/characters/professor-boo.webp'
import ember from '../assets/characters/ember.webp'
import coachNova from '../assets/characters/coach-nova.webp'
import architectMilo from '../assets/characters/architect-milo.webp'

// ─────────────────────────────────────────────────────────────────────────
// Five fully-original theme worlds. Inspired only by broad genre styles
// (rescue robots, ghost hunters, creature trainers, superheroes, building
// bricks) — no copyrighted names, logos, or characters from any franchise.
// ─────────────────────────────────────────────────────────────────────────

export const THEME_WORLDS: Record<ThemeId, ThemeWorld> = {
  'robot-rescue': {
    id: 'robot-rescue',
    name: 'Robot Rescue World',
    tagline: 'Power up elite rescue bots.',
    description:
      'Deep in Chrome Valley, a squad of friendly rescue bots need a brilliant young engineer to power them up. Every mission you solve charges their circuits a little more.',
    helperName: 'Captain Cog',
    helperEmoji: '🤖',
    helperImage: captainCog,
    gradientFrom: '#0b1220',
    gradientVia: '#132743',
    gradientTo: '#0a0f1c',
    accent: '#4fd8e8',
    glow: 'shadow-glow-cyan',
    missionVerb: 'Rescue Mission',
    currencyName: 'Power Cells',
    currencyIcon: '🔋',
    badgeName: 'Circuit Badge',
    levelUpLabel: 'SYSTEM UPGRADE!',
    progressMapLabel: 'Chrome Valley Route Map',
    bonusGameId: 'rescue-path',
    bonusGameLabel: 'Rescue Path',
  },
  'ghost-catcher': {
    id: 'ghost-catcher',
    name: 'Ghost Catcher Academy',
    tagline: 'Catch silly glowing ghosts with brainpower.',
    description:
      'Welcome to the Academy! Friendly, giggly ghosts are hiding all over Moonlight Manor. Solve missions to earn glow-traps and catch them all.',
    helperName: 'Professor Boo',
    helperEmoji: '👻',
    helperImage: professorBoo,
    gradientFrom: '#120c1f',
    gradientVia: '#241a3d',
    gradientTo: '#0c0916',
    accent: '#8b6df5',
    glow: 'shadow-glow-violet',
    missionVerb: 'Ghost Hunt',
    currencyName: 'Glow Orbs',
    currencyIcon: '🔮',
    badgeName: 'Spectral Medal',
    levelUpLabel: 'NEW GHOST RANK!',
    progressMapLabel: 'Moonlight Manor Map',
    bonusGameId: 'ghost-catch',
    bonusGameLabel: 'Ghost Catch',
  },
  'creature-quest': {
    id: 'creature-quest',
    name: 'Creature Quest League',
    tagline: 'Train friendly creatures to become champions.',
    description:
      'In the misty hills of Wildspring, tiny creatures are waiting for a trainer. Complete reading and math quests to help your creature grow strong and happy.',
    helperName: 'Ranger Wren',
    helperEmoji: '🐉',
    helperImage: ember,
    gradientFrom: '#0a1710',
    gradientVia: '#123222',
    gradientTo: '#08120d',
    accent: '#3ee0a8',
    glow: 'shadow-glow',
    missionVerb: 'Training Quest',
    currencyName: 'Spark Berries',
    currencyIcon: '🍇',
    badgeName: 'League Ribbon',
    levelUpLabel: 'CREATURE EVOLVED!',
    progressMapLabel: 'Wildspring Trail Map',
    bonusGameId: 'creature-training',
    bonusGameLabel: 'Creature Training',
  },
  'hero-training': {
    id: 'hero-training',
    name: 'Superhero Training City',
    tagline: 'Unlock real hero powers.',
    description:
      'Skyline City needs a new hero! Every mission you complete at the Academy unlocks a new superpower — speed, strength, smarts, and heart.',
    helperName: 'Coach Nova',
    helperEmoji: '🦸',
    helperImage: coachNova,
    gradientFrom: '#170a12',
    gradientVia: '#33101f',
    gradientTo: '#120810',
    accent: '#f0577a',
    glow: 'shadow-glow',
    missionVerb: 'Hero Mission',
    currencyName: 'Nova Points',
    currencyIcon: '⭐',
    badgeName: 'Hero Emblem',
    levelUpLabel: 'POWER UNLOCKED!',
    progressMapLabel: 'Skyline City Map',
    bonusGameId: 'hero-flight',
    bonusGameLabel: 'Hero Flight',
  },
  'brick-builder': {
    id: 'brick-builder',
    name: 'Brick Builder Kingdom',
    tagline: 'Earn rare bricks to build your kingdom.',
    description:
      'The Kingdom of Brickhaven is just a few bricks away from greatness. Solve missions to earn rare bricks and build castles, towers, and treasure rooms.',
    helperName: 'Architect Milo',
    helperEmoji: '🧱',
    helperImage: architectMilo,
    gradientFrom: '#181206',
    gradientVia: '#392a0d',
    gradientTo: '#120d05',
    accent: '#f5c453',
    glow: 'shadow-glow',
    missionVerb: 'Build Mission',
    currencyName: 'Golden Bricks',
    currencyIcon: '🧱',
    badgeName: 'Builder Crest',
    levelUpLabel: 'KINGDOM EXPANDED!',
    progressMapLabel: 'Brickhaven Kingdom Map',
    bonusGameId: 'brick-tower',
    bonusGameLabel: 'Brick Tower Build',
  },
}

export const THEME_LIST: ThemeWorld[] = Object.values(THEME_WORLDS)

export function getTheme(id: ThemeId | null): ThemeWorld {
  if (!id) return THEME_WORLDS['robot-rescue']
  return THEME_WORLDS[id]
}
