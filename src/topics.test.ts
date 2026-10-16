import { describe, expect, it } from 'vitest'
import { TOPICS, type TopicId } from './topicData'
import { passages } from './content'

describe('IELTS Topic Organization System (ForumFlash-inspired)', () => {
  it('defines 8 core IELTS topics with authentic data', () => {
    expect(TOPICS).toHaveLength(8)
    const expectedIds: TopicId[] = [
      'education',
      'environment',
      'technology',
      'health',
      'work',
      'cities',
      'crime',
      'culture'
    ]
    TOPICS.forEach((topic, index) => {
      expect(topic.id).toBe(expectedIds[index])
      expect(topic.titleEn).toBeTruthy()
      expect(topic.titleVi).toBeTruthy()
      expect(topic.descriptionVi).toBeTruthy()
    })
  })

  it('provides rich thematic vocabulary for every topic with IPA and Vietnamese meanings', () => {
    TOPICS.forEach(topic => {
      expect(topic.vocab.length).toBeGreaterThanOrEqual(8)
      topic.vocab.forEach(item => {
        expect(item.term).toBeTruthy()
        expect(item.ipa).toMatch(/^\/.*\/$/)
        expect(item.meaningVi).toBeTruthy()
        expect(item.example).toBeTruthy()
      })
    })
  })

  it('provides advanced grammar patterns with formulas and examples for each topic', () => {
    TOPICS.forEach(topic => {
      expect(topic.grammar.length).toBeGreaterThanOrEqual(2)
      topic.grammar.forEach(rule => {
        expect(rule.formula).toBeTruthy()
        expect(rule.examples.length).toBeGreaterThanOrEqual(1)
        expect(rule.drillPrompt).toBeTruthy()
        expect(rule.sampleTransform).toBeTruthy()
      })
    })
  })

  it('provides dedicated listening, writing and speaking units per topic', () => {
    TOPICS.forEach(topic => {
      // Listening
      expect(topic.listening.audioText.length).toBeGreaterThan(50)
      expect(topic.listening.questions.length).toBeGreaterThanOrEqual(3)

      // Writing
      expect(topic.writing.task1.prompt).toBeTruthy()
      expect(topic.writing.task2.prompt).toBeTruthy()
      expect(topic.writing.task2.suggestedCollocations.length).toBeGreaterThan(0)

      // Speaking
      expect(topic.speaking.part1.length).toBeGreaterThanOrEqual(3)
      expect(topic.speaking.part2.cueCard).toBeTruthy()
      expect(topic.speaking.part2.bulletPoints.length).toBeGreaterThanOrEqual(3)
      expect(topic.speaking.part3.length).toBeGreaterThanOrEqual(2)
    })
  })

  it('associates reading passages with topics while preserving original test passages', () => {
    expect(passages[0].id).toBe('urban-gardens')
    expect(passages[1].id).toBe('urban-gardens-retest')
    expect(passages[2].id).toBe('community-libraries')

    // Confirm topic metadata exists on passages
    expect(passages[0].topicId).toBe('environment')
    expect(passages[2].topicId).toBe('technology')
  })
})
