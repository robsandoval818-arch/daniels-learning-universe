import type { Question, Subject } from '../types'
import { generateQuestion } from '../data/questionTemplates'
import { getMathSkillById, getPreviousMathSkill } from '../data/mathCurriculum'
import { getReadingSkillById, getPreviousReadingSkill } from '../data/readingCurriculum'

/** Builds the 5 questions for a given day + subject, seeded so they're
 * stable within a single day but vary day to day. */
export function buildQuestionSet(day: number, subject: Subject, skillId: string, count = 5): Question[] {
  const skill = subject === 'math' ? getMathSkillById(skillId) : getReadingSkillById(skillId)
  if (!skill) return []
  return Array.from({ length: count }, (_, i) => generateQuestion(skill, day * 100 + i))
}

/**
 * Live difficulty adaptation: when a session shows signs of struggle
 * (two-in-a-row wrong), the tutor should quietly slot in an easier,
 * confidence-building question from the previous skill in the curriculum
 * instead of grinding forward at the same difficulty. Falls back to a
 * freshly-reseeded question at the same skill if there's no easier skill
 * to step back to (e.g. already at the very first skill).
 */
export function buildEasierFollowUp(day: number, subject: Subject, skillId: string, seed: number): Question {
  const easierSkill =
    subject === 'math' ? getPreviousMathSkill(skillId) : getPreviousReadingSkill(skillId)
  const fallbackSkill = subject === 'math' ? getMathSkillById(skillId) : getReadingSkillById(skillId)
  const skill = easierSkill ?? fallbackSkill!
  return generateQuestion(skill, day * 1000 + seed)
}
