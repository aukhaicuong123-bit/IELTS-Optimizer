import { describe, expect, it } from 'vitest'
import { passages } from './content'
import { LISTENING_DRILLS, READING_DRILLS, SPEAKING_DRILLS, WRITING_DRILLS } from './practiceBank'

const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

describe('IELTS learning content quality', () => {
  it('keeps main Reading passages substantial and question-led', () => {
    const mainPassages = passages.filter(passage => !passage.id.includes('retest'))
    expect(mainPassages.every(passage => wordCount(passage.text) >= 280)).toBe(true)
    expect(mainPassages.every(passage => passage.questions.length >= 5)).toBe(true)
    expect(mainPassages.every(passage => passage.questions.every(question => question.explanation.length > 35))).toBe(true)
  })

  it('provides enough varied practice for each skill', () => {
    expect(READING_DRILLS.length).toBeGreaterThanOrEqual(8)
    expect(READING_DRILLS.filter(drill => wordCount(drill.text) >= 240).length).toBeGreaterThanOrEqual(3)
    expect(LISTENING_DRILLS.length).toBeGreaterThanOrEqual(6)
    expect(LISTENING_DRILLS.every(drill => drill.questions.length >= 3 && wordCount(drill.audioText) >= 80)).toBe(true)
    expect(WRITING_DRILLS.length).toBeGreaterThanOrEqual(10)
    expect(WRITING_DRILLS.every(drill => drill.structure.length >= 4 && drill.commonMistakes.length >= 3)).toBe(true)
    expect(SPEAKING_DRILLS.length).toBeGreaterThanOrEqual(8)
    expect(SPEAKING_DRILLS.every(drill => drill.questions.length >= 4 && drill.tips.length >= 3)).toBe(true)
  })
})
