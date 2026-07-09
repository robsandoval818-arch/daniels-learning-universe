import type { Question, Subject } from '../types'
import { generateQuestion } from '../data/questionTemplates'
import { getMathSkillById } from '../data/mathCurriculum'
import { getReadingSkillById } from '../data/readingCurriculum'

/** Builds the 5 questions for a given day + subject, seeded so they're
 * stable within a single day but vary day to day. */
export function buildQuestionSet(day: number, subject: Subject, skillId: string, count = 5): Question[] {
  const skill = subject === 'math' ? getMathSkillById(skillId) : getReadingSkillById(skillId)
  if (!skill) return []
  return Array.from({ length: count }, (_, i) => generateQuestion(skill, day * 100 + i))
}
