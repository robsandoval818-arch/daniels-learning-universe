import type { Mission, BonusGameId } from '../types'
import { MATH_CORE_SKILLS } from './mathCurriculum'
import { READING_CORE_SKILLS } from './readingCurriculum'
import { REWARDS } from './rewards'

// ─────────────────────────────────────────────────────────────────────────
// 30 STARTER MISSIONS
//
// Rather than hand-write 300+ static questions (error-prone and hard to
// maintain), each day pairs a math skill + reading skill from the CORE
// roadmap. Actual question content is generated fresh each time from
// src/data/questionTemplates.ts, seeded by day number — so content stays
// varied while staying perfectly aligned to the mastery roadmap. This is
// also how you add more days later (see README "Adding Curriculum").
// ─────────────────────────────────────────────────────────────────────────

const BONUS_ROTATION: BonusGameId[] = [
  'rescue-path',
  'ghost-catch',
  'creature-training',
  'hero-flight',
  'brick-tower',
  'treasure-chest',
]

const MISSION_TITLES = [
  'The First Spark',
  'Warming Up the Engines',
  'Counting Under the Stars',
  'The Whispering Clue',
  'A Steady Hand',
  'Boss Challenge: Prove Your Progress',
  'The Great Word Hunt',
  'Numbers on the Move',
  'Story Trail',
  'The Puzzle Gate',
  'Boss Challenge: Double Trouble',
  'Sound It Out',
  'Race to Ten',
  'The Mystery Sentence',
  'Shapes of Numbers',
  'Boss Challenge: The Big Test',
  'Letters and Ladders',
  'The Missing Piece',
  'Bigger and Brighter',
  'The Story Unfolds',
  'Boss Challenge: Champion Round',
  'Counting Kingdom',
  'Word Detectives',
  'Add It Up',
  'The Comparing Game',
  'Boss Challenge: Grand Trial',
  'Reading Rally',
  'Number Ninjas',
  'The Final Countdown',
  'Boss Challenge: Graduation Day',
]

function skillForDay<T>(skills: T[], day: number): T {
  // Slow, confidence-building pacing: repeat each skill ~1.5 days before
  // advancing, then clamp at the end of the available core list.
  const idx = Math.min(Math.floor((day - 1) / 1.5), skills.length - 1)
  return skills[idx]
}

function rewardForDay(day: number, isBoss: boolean): string {
  if (isBoss) return 'reward-boss'
  if (day % 7 === 0) return 'reward-certificate'
  const pool = REWARDS.filter((r) => r.type !== 'certificate' && r.id !== 'reward-boss')
  return pool[(day - 1) % pool.length].id
}

export const DAILY_MISSIONS: Mission[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1
  const isBossDay = day % 5 === 0
  const mathSkill = skillForDay(MATH_CORE_SKILLS, day)
  const readingSkill = skillForDay(READING_CORE_SKILLS, day)

  const mathQuestionIds = Array.from({ length: 5 }, (_, q) => `day${day}-math-${q + 1}`)
  const readingQuestionIds = Array.from({ length: 5 }, (_, q) => `day${day}-reading-${q + 1}`)

  return {
    day,
    title: MISSION_TITLES[i] ?? `Mission ${day}`,
    themeIntro: isBossDay
      ? "{helper} says: \"You've trained hard — today's mission proves how far you've come!\""
      : "{helper} says: \"Ready for today's {verb}? Let's power up your brain!\"",
    mathSkillId: mathSkill.id,
    readingSkillId: readingSkill.id,
    mathQuestionIds,
    readingQuestionIds,
    bonusGame: BONUS_ROTATION[(day - 1) % BONUS_ROTATION.length],
    rewardId: rewardForDay(day, isBossDay),
    parentNote: `Day ${day} focuses on "${mathSkill.skillName}" (math) and "${readingSkill.skillName}" (reading). ${
      isBossDay ? 'This is a boss review day mixing recent skills to check retention.' : 'Skill difficulty increases gradually — no need to intervene unless Daniel asks for help.'
    }`,
    isBossDay,
  }
})

export function getMissionForDay(day: number): Mission | undefined {
  return DAILY_MISSIONS.find((m) => m.day === day)
}
