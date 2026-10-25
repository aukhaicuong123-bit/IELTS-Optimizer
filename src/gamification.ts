import type { SkillSubmission } from './types'

export const VOCABULARY_XP_PER_ITEM = 15
export const GRAMMAR_XP_PER_ITEM = 25
export const VOCABULARY_PROGRESS_KEY = 'ielts-optimizer-vocab-known'

export interface JourneySnapshot {
  knownVocabCount: number
  completedGrammarCount: number
  xp: number
  courseCompletion: number
}

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

/**
 * Keeps the persisted vocabulary map intentionally small: only genuinely known
 * items are stored. That makes the XP selector and the learner-facing state
 * identical, including when a learner moves a word back into review.
 */
export function setKnownVocabularyItem(
  knownVocabulary: Record<string, boolean>,
  wordId: string,
  isKnown: boolean
): Record<string, boolean> {
  const next = Object.fromEntries(
    Object.entries(knownVocabulary).filter(([id, value]) => id.trim().length > 0 && value === true)
  ) as Record<string, boolean>
  const normalizedId = wordId.trim()
  if (!normalizedId) return next

  if (isKnown) {
    next[normalizedId] = true
  } else {
    delete next[normalizedId]
  }
  return next
}

export function countKnownVocabulary(): number {
  return Object.keys(readKnownVocabularyMap()).length
}

export function countCompletedGrammar(submissions: SkillSubmission[] | undefined): number {
  const completedActivities = new Set<string>()
  for (const submission of submissions || []) {
    if (
      submission.skill === 'Grammar'
      && submission.completed === true
      && typeof submission.activityId === 'string'
      && submission.activityId.trim().length > 0
    ) {
      completedActivities.add(submission.activityId.trim())
    }
  }
  return completedActivities.size
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

/**
 * One read-only snapshot for the dashboard and both foundation hubs.
 * Keeping the calculation here prevents route-specific XP/rank drift.
 */
export function getJourneySnapshot(
  submissions: SkillSubmission[] | undefined,
  totalVocabCount: number,
  totalGrammarCount: number
): JourneySnapshot {
  const knownVocabCount = countKnownVocabulary()
  const completedGrammarCount = countCompletedGrammar(submissions)
  return {
    knownVocabCount,
    completedGrammarCount,
    xp: calculateJourneyXp(knownVocabCount, completedGrammarCount),
    courseCompletion: calculateCourseCompletion(
      knownVocabCount,
      totalVocabCount,
      completedGrammarCount,
      totalGrammarCount
    )
  }
}

