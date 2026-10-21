import { describe, expect, it } from 'vitest'
import { SKILL_LEARNING_GUIDES } from './skillLearningGuides'

describe('four-skill learning guides', () => {
  it('gives every skill a repeatable learn-practise-review routine', () => {
    for (const skill of ['Reading', 'Listening', 'Writing', 'Speaking'] as const) {
      const guide = SKILL_LEARNING_GUIDES[skill]
      expect(guide.stages).toHaveLength(3)
      expect(guide.stages.every(stage => stage.action.length > 40 && stage.evidence.length > 20)).toBe(true)
      expect(guide.selfCheck.length).toBeGreaterThanOrEqual(3)
      expect(guide.nextStep.length).toBeGreaterThan(30)
    }
  })
})
