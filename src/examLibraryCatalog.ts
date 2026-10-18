import { getApprovedQuestionBankItems } from './questionBankValidator'
import { SEED_QUESTION_BANK_ITEMS } from './seedQuestionBank'
import type { DifficultyBand, IELTSSkill, QuestionBankItem } from './questionBankTypes'

export type LibrarySkill = Extract<IELTSSkill, 'Reading' | 'Listening' | 'Writing' | 'Speaking'>

export interface SkillPracticePack {
  id: string
  title: string
  module: 'Academic' | 'General Training'
  skill: LibrarySkill
  topic: string
  difficulty: DifficultyBand
  year: number
  month: string
  volume: string
  questionCount: number
  itemId: string
  sourceLabel: string
  status: 'available'
}

function questionCount(item: QuestionBankItem): number {
  if ('questions' in item.payload) {
    return item.payload.questions.length
  }
  return 1
}

/**
 * The catalog is derived from approved, original content only. This keeps the
 * library honest while allowing the catalog to grow without duplicating exam
 * questions or importing third-party material.
 */
export const SKILL_PRACTICE_PACKS: SkillPracticePack[] = getApprovedQuestionBankItems(
  SEED_QUESTION_BANK_ITEMS
).map(item => ({
  id: `pack-${item.id}`,
  title: item.title,
  module: item.skill === 'Writing' && item.taskType === 'general_task1' ? 'General Training' : 'Academic',
  skill: item.skill,
  topic: item.topic,
  difficulty: item.difficulty,
  year: 2026,
  month: 'Original Content · Volume 1',
  volume: 'IELTS Optimizer Originals — Volume 1',
  questionCount: questionCount(item),
  itemId: item.id,
  sourceLabel: 'Original — IELTS Optimizer Editorial Team',
  status: 'available'
}))

export const LIBRARY_SKILLS: Array<'All' | LibrarySkill> = [
  'All',
  'Listening',
  'Reading',
  'Writing',
  'Speaking'
]
