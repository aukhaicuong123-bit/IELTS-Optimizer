import type { SkillSubmission } from './types'

export const VOCABULARY_XP_PER_ITEM = 15
export const GRAMMAR_XP_PER_ITEM = 25
export const VOCABULARY_PROGRESS_KEY = 'ielts-optimizer-vocab-known'

export function readKnownVocabularyMap(): Record<string, boolean> {
  try {
    const raw = globalThis.localStorage?.getItem(VOCABULARY_PROGRESS_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(([, value]) => value === true)
    ) as Record<string, boolean>
  } catch {
    return {}
  }
}

export function countKnownVocabulary(): number {
  return Object.keys(readKnownVocabularyMap()).length
}

export function countCompletedGrammar(submissions: SkillSubmission[] | undefined): number {
  return (submissions || []).filter(submission => submission.skill === 'Grammar' && submission.completed).length
}

export function calculateJourneyXp(knownVocabCount: number, completedGrammarCount: number): number {
  return Math.max(0, knownVocabCount) * VOCABULARY_XP_PER_ITEM
    + Math.max(0, completedGrammarCount) * GRAMMAR_XP_PER_ITEM
}

export function calculateCourseCompletion(
  knownVocabCount: number,
  totalVocabCount: number,
  completedGrammarCount: number,
  totalGrammarCount: number
): number {
  const totalItems = Math.max(1, totalVocabCount + totalGrammarCount)
  const completedItems = Math.max(0, knownVocabCount) + Math.max(0, completedGrammarCount)
  return Math.min(100, Math.round((completedItems / totalItems) * 100))
}

