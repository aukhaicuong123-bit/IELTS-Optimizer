import { describe, expect, it } from 'vitest'
import { CEFR_GRAMMAR_RULES } from './data/cefrGrammarData'
import { FORUM_25_TOPICS, TOTAL_FORUM_VOCAB_COUNT } from './data/forumVocab25Topics'
import { GRAMMAR_DRILLS, VOCAB_DRILLS } from './practiceBank'

const unique = (values: string[]) => new Set(values).size === values.length

describe('expanded learning content', () => {
  it('provides a substantial vocabulary lesson bank for every topic', () => {
    expect(FORUM_25_TOPICS).toHaveLength(25)
    expect(TOTAL_FORUM_VOCAB_COUNT).toBeGreaterThanOrEqual(275)
    expect(FORUM_25_TOPICS.every(topic => topic.vocab.length >= 11)).toBe(true)
    expect(unique(FORUM_25_TOPICS.flatMap(topic => topic.vocab.map(item => item.id)))).toBe(true)
  })

  it('provides complete grammar lessons across all CEFR levels', () => {
    expect(CEFR_GRAMMAR_RULES).toHaveLength(30)
    expect(unique(CEFR_GRAMMAR_RULES.map(rule => rule.id))).toBe(true)
    expect(new Set(CEFR_GRAMMAR_RULES.map(rule => rule.cefrLevel))).toEqual(new Set(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']))
    expect(CEFR_GRAMMAR_RULES.every(rule => rule.examples.length > 0 && rule.quiz.options.length >= 4 && rule.drillPrompt.length > 0)).toBe(true)
  })

  it('expands the rotating daily exercise banks', () => {
    expect(GRAMMAR_DRILLS).toHaveLength(24)
    expect(VOCAB_DRILLS).toHaveLength(24)
    expect(unique(GRAMMAR_DRILLS.map(drill => drill.id))).toBe(true)
    expect(unique(VOCAB_DRILLS.map(drill => drill.id))).toBe(true)
  })
})
