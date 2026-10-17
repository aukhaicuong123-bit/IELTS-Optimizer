import { describe, expect, it } from 'vitest'
import {
  getApprovedQuestionBankItems,
  isValidContentStatusTransition,
  transitionContentStatus,
  validateQuestionBankBatch,
  validateQuestionBankItem
} from './questionBankValidator'
import { SEED_QUESTION_BANK_ITEMS } from './seedQuestionBank'
import type { QuestionBankItem } from './questionBankTypes'

describe('Question Bank Data Contracts & Validation (Phase 1)', () => {
  describe('Seed dataset integrity', () => {
    it('has representative items for all 4 IELTS skills', () => {
      const skills = new Set(SEED_QUESTION_BANK_ITEMS.map(i => i.skill))
      expect(skills.has('Reading')).toBe(true)
      expect(skills.has('Listening')).toBe(true)
      expect(skills.has('Writing')).toBe(true)
      expect(skills.has('Speaking')).toBe(true)
      expect(SEED_QUESTION_BANK_ITEMS.length).toBeGreaterThanOrEqual(4)
    })

    it('validates every seed item cleanly without errors', () => {
      SEED_QUESTION_BANK_ITEMS.forEach(item => {
        const result = validateQuestionBankItem(item)
        expect(result.isValid, `Item ${item.id} had validation errors: ${result.errors.join(', ')}`).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    it('validates the entire seed batch with global uniqueness and equivalence checks', () => {
      const batchResult = validateQuestionBankBatch(SEED_QUESTION_BANK_ITEMS)
      expect(batchResult.isValid).toBe(true)
      expect(batchResult.validCount).toBe(SEED_QUESTION_BANK_ITEMS.length)
      expect(batchResult.globalErrors).toHaveLength(0)
      expect(Object.keys(batchResult.itemErrors)).toHaveLength(0)
    })

    it('documents provenance with clear reuse licenses on all seed items', () => {
      SEED_QUESTION_BANK_ITEMS.forEach(item => {
        expect(item.source.author).toBeTruthy()
        expect(item.source.license).toBeTruthy()
        expect(['original', 'curated_public', 'licensed']).toContain(item.source.provenanceType)
      })
    })
  })

  describe('Root schema & required fields validation', () => {
    it('rejects non-object inputs', () => {
      expect(validateQuestionBankItem(null).isValid).toBe(false)
      expect(validateQuestionBankItem(undefined).isValid).toBe(false)
      expect(validateQuestionBankItem('not an object').isValid).toBe(false)
    })

    it('rejects items missing mandatory root fields', () => {
      const invalidItem = {
        schemaVersion: 1,
        // missing id, title, skill, etc.
        status: 'draft'
      }
      const res = validateQuestionBankItem(invalidItem)
      expect(res.isValid).toBe(false)
      expect(res.errors.some(e => e.includes('id must be'))).toBe(true)
      expect(res.errors.some(e => e.includes('skill must be'))).toBe(true)
      expect(res.errors.some(e => e.includes('title must be'))).toBe(true)
    })

    it('rejects invalid schema version', () => {
      const base = { ...SEED_QUESTION_BANK_ITEMS[0], schemaVersion: 2 as any }
      const res = validateQuestionBankItem(base)
      expect(res.isValid).toBe(false)
      expect(res.errors.some(e => e.includes('schemaVersion must be 1'))).toBe(true)
    })

    it('rejects invalid id format', () => {
      const badId = { ...SEED_QUESTION_BANK_ITEMS[0], id: 'bad id with spaces!' }
      const res = validateQuestionBankItem(badId)
      expect(res.isValid).toBe(false)
      expect(res.errors.some(e => e.includes('id must be an alphanumeric slug'))).toBe(true)
    })

    it('rejects items missing provenance or with invalid provenance type', () => {
      const noSource = { ...SEED_QUESTION_BANK_ITEMS[0], source: null as any }
      expect(validateQuestionBankItem(noSource).isValid).toBe(false)

      const badProvenance = {
        ...SEED_QUESTION_BANK_ITEMS[0],
        source: { author: 'Someone', license: 'MIT', provenanceType: 'scraped_unauthorized' as any }
      }
      const res = validateQuestionBankItem(badProvenance)
      expect(res.isValid).toBe(false)
      expect(res.errors.some(e => e.includes("source.provenanceType must be"))).toBe(true)
    })
  })

  describe('Duplicate ID detection', () => {
    it('detects duplicate item IDs in a batch', () => {
      const item1 = { ...SEED_QUESTION_BANK_ITEMS[0] }
      const item2 = { ...SEED_QUESTION_BANK_ITEMS[1], id: item1.id }
      const batchResult = validateQuestionBankBatch([item1, item2])
      expect(batchResult.isValid).toBe(false)
      expect(Object.values(batchResult.itemErrors).flat().some(e => e.includes('Duplicate item id'))).toBe(true)
    })

    it('detects duplicate question IDs within a single item', () => {
      const item = JSON.parse(JSON.stringify(SEED_QUESTION_BANK_ITEMS[0]))
      item.payload.questions[1].id = item.payload.questions[0].id
      const res = validateQuestionBankItem(item)
      expect(res.isValid).toBe(false)
      expect(res.errors.some(e => e.includes('duplicate question id'))).toBe(true)
    })

    it('detects duplicate question IDs across different items in a batch', () => {
      const item1 = JSON.parse(JSON.stringify(SEED_QUESTION_BANK_ITEMS[0]))
      const item2 = JSON.parse(JSON.stringify(SEED_QUESTION_BANK_ITEMS[1]))
      // assign question id from item1 to item2
      item2.payload.questions[0].id = item1.payload.questions[0].id
      const batchResult = validateQuestionBankBatch([item1, item2])
      expect(batchResult.isValid).toBe(false)
      expect(Object.values(batchResult.itemErrors).flat().some(e => e.includes('Duplicate question id'))).toBe(true)
    })
  })

  describe('Answer key & grounding validation', () => {
    it('rejects multiple-choice question where answerKey does not match options', () => {
      const item = JSON.parse(JSON.stringify(SEED_QUESTION_BANK_ITEMS[0]))
      item.payload.questions[0].answerKey = 'A completely unrelated answer that is not in options'
      const res = validateQuestionBankItem(item)
      expect(res.isValid).toBe(false)
      expect(res.errors.some(e => e.includes('does not match any of the provided options'))).toBe(true)
    })

    it('rejects True/False/Not Given question with invalid answerKey', () => {
      const item = JSON.parse(JSON.stringify(SEED_QUESTION_BANK_ITEMS[0]))
      item.payload.questions[1].answerKey = 'MAYBE'
      const res = validateQuestionBankItem(item)
      expect(res.isValid).toBe(false)
      expect(res.errors.some(e => e.includes("must be 'TRUE', 'FALSE', or 'NOT GIVEN'"))).toBe(true)
    })

    it('rejects reading question when evidence quote is not found verbatim in passage', () => {
      const item = JSON.parse(JSON.stringify(SEED_QUESTION_BANK_ITEMS[0]))
      item.payload.questions[0].evidenceQuote = 'This sentence does not exist anywhere in the passage text at all.'
      const res = validateQuestionBankItem(item)
      expect(res.isValid).toBe(false)
      expect(res.errors.some(e => e.includes('not found verbatim in passageText'))).toBe(true)
    })

    it('rejects listening question when evidence quote is not found in transcript', () => {
      const item = JSON.parse(JSON.stringify(SEED_QUESTION_BANK_ITEMS[2])) // listening item
      item.payload.questions[0].evidenceQuote = 'Fabricated transcript evidence line.'
      const res = validateQuestionBankItem(item)
      expect(res.isValid).toBe(false)
      expect(res.errors.some(e => e.includes('not found in transcript'))).toBe(true)
    })
  })

  describe('Rubric & skill-specific validation', () => {
    it('rejects Writing task if any of the 4 standard IELTS criteria is missing', () => {
      const item = JSON.parse(JSON.stringify(SEED_QUESTION_BANK_ITEMS[4])) // writing item 1
      delete (item.payload.rubric as any).taskAchievementOrResponseCriteria
      const res = validateQuestionBankItem(item)
      expect(res.isValid).toBe(false)
      expect(res.errors.some(e => e.includes('must include taskAchievementOrResponseCriteria'))).toBe(true)
    })

    it('enforces word count standards for Writing tasks', () => {
      const task1Item = JSON.parse(JSON.stringify(SEED_QUESTION_BANK_ITEMS[4]))
      task1Item.payload.minimumWordCount = 100 // invalid for task 1 (requires 150)
      const res = validateQuestionBankItem(task1Item)
      expect(res.isValid).toBe(false)
      expect(res.errors.some(e => e.includes('Task 1 minimumWordCount standard is 150 words'))).toBe(true)
    })

    it('requires limitationsNotice for Speaking items to avoid false pronunciation claims', () => {
      const item = JSON.parse(JSON.stringify(SEED_QUESTION_BANK_ITEMS[6])) // speaking item 1
      delete (item.payload as any).limitationsNotice
      const res = validateQuestionBankItem(item)
      expect(res.isValid).toBe(false)
      expect(res.errors.some(e => e.includes('Speaking limitationsNotice is required'))).toBe(true)
    })

    it('requires cueCardBullets and proper timing for Speaking Part 2', () => {
      const item = JSON.parse(JSON.stringify(SEED_QUESTION_BANK_ITEMS[7])) // speaking item 2
      item.payload.cueCardBullets = [] // empty
      const res = validateQuestionBankItem(item)
      expect(res.isValid).toBe(false)
      expect(res.errors.some(e => e.includes('requires cueCardBullets with at least 2 points'))).toBe(true)
    })
  })

  describe('Equivalence metadata & cross-item consistency', () => {
    it('detects conflicting objectives across items sharing the same equivalenceGroup', () => {
      const item1 = JSON.parse(JSON.stringify(SEED_QUESTION_BANK_ITEMS[0]))
      const item2 = JSON.parse(JSON.stringify(SEED_QUESTION_BANK_ITEMS[1]))

      // Assign the same equivalence group to both questions, but with conflicting objectives
      item1.payload.questions[0].equivalenceGroup = 'eq-shared-test-group'
      item1.payload.questions[0].objective = 'reading:detail'

      item2.payload.questions[0].equivalenceGroup = 'eq-shared-test-group'
      item2.payload.questions[0].objective = 'reading:main-idea' // Conflict!

      const batchResult = validateQuestionBankBatch([item1, item2])
      expect(batchResult.isValid).toBe(false)
      expect(
        Object.values(batchResult.itemErrors).flat().some(e =>
          e.includes('has conflicting objectives: "reading:detail"')
        )
      ).toBe(true)
    })
  })

  describe('Content status lifecycle transitions', () => {
    it('allows valid transitions in sequence', () => {
      expect(isValidContentStatusTransition('draft', 'needs_review')).toBe(true)
      expect(isValidContentStatusTransition('needs_review', 'validated')).toBe(true)
      expect(isValidContentStatusTransition('validated', 'approved')).toBe(true)
      expect(isValidContentStatusTransition('approved', 'retired')).toBe(true)
      expect(isValidContentStatusTransition('retired', 'draft')).toBe(true)
    })

    it('disallows jumping from draft directly to approved without review', () => {
      expect(isValidContentStatusTransition('draft', 'approved')).toBe(false)
    })

    it('transitionContentStatus prevents approving an invalid item', () => {
      const badItem: QuestionBankItem = {
        ...SEED_QUESTION_BANK_ITEMS[0],
        status: 'validated',
        title: '' // invalid!
      }
      const transitionResult = transitionContentStatus(badItem, 'approved', { reviewer: 'Auditor' })
      expect(transitionResult.success).toBe(false)
      expect(transitionResult.error).toContain('Cannot approve invalid item')
    })

    it('transitionContentStatus successfully advances valid item', () => {
      const validItem: QuestionBankItem = {
        ...SEED_QUESTION_BANK_ITEMS[0],
        status: 'draft'
      }
      const transitionResult = transitionContentStatus(validItem, 'needs_review', {
        reviewer: 'Senior Editor',
        notes: 'Ready for editorial review'
      })
      expect(transitionResult.success).toBe(true)
      expect(transitionResult.item?.status).toBe('needs_review')
      expect(transitionResult.item?.reviewedBy).toBe('Senior Editor')
    })
  })

  describe('Learner-facing query layer: fail-closed discipline', () => {
    it('excludes draft, needs_review, validated, and retired items from learner queries', () => {
      const testItems: QuestionBankItem[] = [
        { ...SEED_QUESTION_BANK_ITEMS[0], id: 'item-draft', status: 'draft' },
        { ...SEED_QUESTION_BANK_ITEMS[1], id: 'item-review', status: 'needs_review' },
        { ...SEED_QUESTION_BANK_ITEMS[2], id: 'item-validated', status: 'validated' },
        { ...SEED_QUESTION_BANK_ITEMS[3], id: 'item-retired', status: 'retired' },
        { ...SEED_QUESTION_BANK_ITEMS[4], id: 'item-approved', status: 'approved' }
      ]

      const approved = getApprovedQuestionBankItems(testItems)
      expect(approved.map(i => i.id)).toEqual(['item-approved'])
    })

    it('fails closed when an approved item has corrupted/invalid schema', () => {
      const corruptedApprovedItem: QuestionBankItem = {
        ...SEED_QUESTION_BANK_ITEMS[0],
        id: 'corrupted-item',
        status: 'approved',
        payload: { ...SEED_QUESTION_BANK_ITEMS[0].payload, passageText: 'Too short' } as any
      }

      const result = getApprovedQuestionBankItems([corruptedApprovedItem, SEED_QUESTION_BANK_ITEMS[4]])
      // The corrupted item fails closed and is omitted
      expect(result.some(i => i.id === 'corrupted-item')).toBe(false)
      expect(result.some(i => i.id === SEED_QUESTION_BANK_ITEMS[4].id)).toBe(true)
    })

    it('filters approved items by skill, topic, and difficulty', () => {
      const readingOnly = getApprovedQuestionBankItems(SEED_QUESTION_BANK_ITEMS, { skill: 'Reading' })
      expect(readingOnly.every(i => i.skill === 'Reading')).toBe(true)
      expect(readingOnly.length).toBe(2)

      const writingOnly = getApprovedQuestionBankItems(SEED_QUESTION_BANK_ITEMS, { skill: 'Writing' })
      expect(writingOnly.every(i => i.skill === 'Writing')).toBe(true)
      expect(writingOnly.length).toBe(2)

      const advancedOnly = getApprovedQuestionBankItems(SEED_QUESTION_BANK_ITEMS, { difficulty: 'advanced' })
      expect(advancedOnly.every(i => i.difficulty === 'advanced')).toBe(true)

      const searchFiltered = getApprovedQuestionBankItems(SEED_QUESTION_BANK_ITEMS, { searchTerm: 'Bioluminescence' })
      expect(searchFiltered.length).toBe(1)
      expect(searchFiltered[0].id).toBe('reading-qb-002')
    })
  })
})
