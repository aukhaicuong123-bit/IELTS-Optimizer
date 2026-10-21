import { describe, expect, it } from 'vitest'
import { IELTS_SKILL_CURRICULUM } from './skillCurriculum'
import { SKILL_MODEL_CONTENT } from './skillModelContent'

describe('shared four-skill structure and model content', () => {
  it('uses the same exam metadata shape for all four skills', () => {
    for (const skill of ['Reading', 'Listening', 'Writing', 'Speaking'] as const) {
      const meta = IELTS_SKILL_CURRICULUM[skill]
      expect(meta.format.length).toBeGreaterThan(15)
      expect(meta.duration.length).toBeGreaterThan(3)
      expect(meta.scoring).toHaveLength(4)
      expect(meta.qualityNote.length).toBeGreaterThan(50)
    }
  })

  it('provides annotated models for the core topic curriculum', () => {
    const topicsWithModels = Object.values(SKILL_MODEL_CONTENT)
    expect(topicsWithModels.length).toBeGreaterThanOrEqual(8)
    expect(topicsWithModels.every(content => content.writingTask2?.text && content.speakingPart2?.text)).toBe(true)
    expect(topicsWithModels.every(content => (content.writingTask2?.notes.length || 0) >= 3 && (content.speakingPart2?.notes.length || 0) >= 3)).toBe(true)
  })
})
