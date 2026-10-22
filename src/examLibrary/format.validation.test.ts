import { describe, expect, it } from 'vitest'
import { IELTS_EXAM_COLLECTIONS } from '../examLibraryData'

const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

describe('IELTS exam library format contracts', () => {
  it('keeps every Academic practice paper at 3 passages and 40 questions', () => {
    for (const exam of IELTS_EXAM_COLLECTIONS) {
      expect(exam.module).toBe('Academic')
      expect(exam.reading.passages).toHaveLength(3)
      expect(exam.reading.passages.flatMap(p => p.questions)).toHaveLength(40)
      expect(exam.listening.sections).toHaveLength(4)
      expect(exam.listening.sections.flatMap(s => s.questions)).toHaveLength(40)
    }
  })

  it('uses multiple IELTS-style question formats instead of one repeated template', () => {
    for (const exam of IELTS_EXAM_COLLECTIONS) {
      const readingTypes = new Set(exam.reading.passages.flatMap(p => p.questions.map(q => q.type)))
      const listeningTypes = new Set(exam.listening.sections.flatMap(s => s.questions.map(q => q.type)))
      expect(readingTypes.size).toBeGreaterThanOrEqual(2)
      expect(listeningTypes.size).toBeGreaterThanOrEqual(2)
    }
  })

  it('keeps the Academic Reading text length within the official 2150–2750-word range', () => {
    for (const exam of IELTS_EXAM_COLLECTIONS) {
      const totalWords = exam.reading.passages.reduce((total, passage) => total + wordCount(passage.text), 0)
      expect(totalWords).toBeGreaterThanOrEqual(2150)
      expect(totalWords).toBeLessThanOrEqual(2750)
    }
  })

  it('provides a faithful visual stimulus for every Writing Task 1 paper', () => {
    for (const exam of IELTS_EXAM_COLLECTIONS) {
      const stimulus = exam.writing.task1.stimulusData
      expect(stimulus).toBeDefined()
      expect(stimulus!.categories.length).toBeGreaterThan(1)
      expect(stimulus!.series.length).toBeGreaterThan(0)
      for (const series of stimulus!.series) {
        expect(series.values).toHaveLength(stimulus!.categories.length)
        expect(series.values.every(value => Number.isFinite(value) && value >= 0)).toBe(true)
      }
    }
  })
})
