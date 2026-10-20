import { describe, expect, it } from 'vitest'
import { academicTest1Reading } from './academic/reading'
import { academicTest1Listening } from './academic/listening'

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').trim()
const fragments = (q: string) => q.split('...').map(norm).filter((s) => s.length > 3)

describe('Academic Test 1 evidence integrity', () => {
  it('reading: every evidenceQuote fragment occurs in its passage text', () => {
    let missing = 0
    for (const p of academicTest1Reading.passages) {
      const t = norm(p.text)
      for (const q of p.questions) {
        for (const f of fragments(q.evidenceQuote)) {
          if (!t.includes(f)) {
            missing += 1
            console.error(`MISSING P${p.passageNumber} q${q.number}: ${f}`)
          }
        }
      }
    }
    expect(missing).toBe(0)
  })

  it('listening: every evidenceQuote fragment occurs in its section transcript', () => {
    let missing = 0
    for (const s of academicTest1Listening.sections) {
      const t = norm(s.transcript)
      for (const q of s.questions) {
        for (const f of fragments(q.evidenceQuote)) {
          if (!t.includes(f)) {
            missing += 1
            console.error(`MISSING S${s.sectionNumber} q${q.number}: ${f}`)
          }
        }
      }
    }
    expect(missing).toBe(0)
  })

  it('reading and listening each contain exactly 40 sequentially numbered questions', () => {
    const reading = academicTest1Reading.passages.flatMap((p) => p.questions).sort((a, b) => a.number - b.number)
    const listening = academicTest1Listening.sections.flatMap((s) => s.questions).sort((a, b) => a.number - b.number)
    const expected = [...Array(40)].map((_, i) => i + 1)
    expect(reading).toHaveLength(40)
    expect(listening).toHaveLength(40)
    expect(reading.map((q) => q.number)).toEqual(expected)
    expect(listening.map((q) => q.number)).toEqual(expected)
  })
})
