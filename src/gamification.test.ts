import { describe, expect, it } from 'vitest'
import {
  calculateCourseCompletion,
  calculateJourneyXp,
  countCompletedGrammar,
  GRAMMAR_XP_PER_ITEM,
  VOCABULARY_XP_PER_ITEM
} from './gamification'
import type { SkillSubmission } from './types'

describe('journey progression selectors', () => {
  it('keeps the published XP weights stable', () => {
    expect(calculateJourneyXp(2, 3)).toBe(2 * VOCABULARY_XP_PER_ITEM + 3 * GRAMMAR_XP_PER_ITEM)
  })

  it('counts only completed grammar evidence used by every journey view', () => {
    const submissions: SkillSubmission[] = [
      { id: 'g1', skill: 'Grammar', activityId: 'grammar-rule-1', response: 'x', createdAt: '2026-01-01', feedbackMode: 'self-review', completed: true },
      { id: 'g2', skill: 'Grammar', activityId: 'grammar-rule-2', response: 'x', createdAt: '2026-01-02', feedbackMode: 'self-review', completed: false },
      { id: 'r1', skill: 'Reading', activityId: 'reading-1', response: 'x', createdAt: '2026-01-03', feedbackMode: 'self-review', completed: true }
    ]
    expect(countCompletedGrammar(submissions)).toBe(1)
  })

  it('bounds course completion and protects empty totals', () => {
    expect(calculateCourseCompletion(10, 10, 10, 10)).toBe(100)
    expect(calculateCourseCompletion(0, 0, 0, 0)).toBe(0)
    expect(calculateCourseCompletion(-4, 10, 0, 10)).toBe(0)
  })
})

