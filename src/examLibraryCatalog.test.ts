import { describe, expect, it } from 'vitest'
import { IELTS_EXAM_COLLECTIONS } from './examLibraryData'
import { SKILL_PRACTICE_PACKS } from './examLibraryCatalog'

describe('Exam library catalog', () => {
  it('keeps the complete exam metadata discoverable', () => {
    expect(IELTS_EXAM_COLLECTIONS.length).toBeGreaterThan(0)
    IELTS_EXAM_COLLECTIONS.forEach(exam => {
      expect(exam.year).toBeGreaterThanOrEqual(2020)
      expect(exam.month).toBeTruthy()
      expect(exam.skills).toEqual(expect.arrayContaining(['Reading', 'Listening', 'Writing', 'Speaking']))
      expect(exam.sourceLabel).toContain('Original')
      expect(exam.status).toBe('available')
    })
  })

  it('exposes approved original packs across all four IELTS skills', () => {
    expect(SKILL_PRACTICE_PACKS.length).toBeGreaterThanOrEqual(16)
    expect(new Set(SKILL_PRACTICE_PACKS.map(pack => pack.skill))).toEqual(
      new Set(['Reading', 'Listening', 'Writing', 'Speaking'])
    )
    SKILL_PRACTICE_PACKS.forEach(pack => {
      expect(pack.questionCount).toBeGreaterThan(0)
      expect(pack.sourceLabel).toContain('Original')
      expect(pack.status).toBe('available')
    })
  })
})
