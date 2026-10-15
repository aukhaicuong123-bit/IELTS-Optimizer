import { describe, expect, it } from 'vitest'
import { passages } from './content'
import { buildReadingEvidence, deriveReadingStates, readingDifficultyId, readingOccurrenceId, targetFor } from './readingEngine'
import type { Attempt, ErrorRecord } from './types'

const error = (overrides: Partial<ErrorRecord> = {}): ErrorRecord => ({ id: 'err-urban-gardens-Identify the main idea', questionId: 'q1', attemptId: 'a1', passageId: 'urban-gardens', type: 'multiple-choice', objective: 'Identify the main idea', prompt: 'Main point?', learnerAnswer: 'wrong', correctAnswer: passages[0].questions[0].answer, explanation: 'cue', createdAt: '2026-01-01T10:00:00Z', reviewCount: 0, retestAttemptIds: [], ...overrides })
const retest = (overrides: Partial<Attempt> = {}): Attempt => ({ id: 'r1', passageId: 'urban-gardens-retest', skill: 'Reading', answers: { r1: 'It has a limited local effect.' }, score: 1, total: 1, kind: 'retest', createdAt: '2026-01-02T10:00:00Z', objectiveIds: ['Identify the main idea'], responseTargets: { r1: targetFor(error()) }, ...overrides })

describe('Reading evidence adapter', () => {
  it('reconstructs stable initial evidence from a legacy ErrorRecord', () => {
    const first = buildReadingEvidence([error()], [], passages)[0]
    const second = buildReadingEvidence([error()], [], passages)[0]
    expect(first).toEqual(second)
    expect(first.difficultyId).toBe(readingDifficultyId(error()))
    expect(first.occurrenceId).toBe(readingOccurrenceId(error()))
    expect(first.outcome).toBe('unknown')
  })
  it('resolves only the explicitly targeted equivalent Retest occurrence', () => {
    const errors = [error({ occurrences: [{ id: 'o1', attemptId: 'a1', questionId: 'q1', createdAt: '2026-01-01T10:00:00Z' }] }), error({ id: 'err-urban-gardens-Locate supporting detail', questionId: 'q4', objective: 'Locate supporting detail', type: 'multiple-choice' })]
    const attempt = retest({ answers: { r1: passages[1].questions[0].answer }, responseTargets: { r1: targetFor(errors[0]) } })
    const history: Attempt = { id: 'a1', passageId: 'urban-gardens', skill: 'Reading', answers: { q1: 'wrong' }, score: 0, total: 1, kind: 'practice', createdAt: '2026-01-01T10:00:00Z', objectiveIds: ['Identify the main idea'] }
    const result = deriveReadingStates(errors, [history, attempt], passages)
    expect(result.statesByDifficulty[readingDifficultyId(errors[0])].status).toBe('resolved')
    expect(result.statesByDifficulty[readingDifficultyId(errors[1])].status).toBe('insufficient-evidence')
  })
  it('keeps a failed Retest occurrence open', () => {
    const result = deriveReadingStates([error()], [retest({ answers: { r1: 'wrong' } })], passages)
    expect(result.statesByDifficulty[readingDifficultyId(error())].status).toBe('open')
  })
  it('does not resolve a different occurrence when target and question occurrence disagree', () => {
    const result = deriveReadingStates([error()], [retest({ responseTargets: { r1: { difficultyId: 'other', occurrenceId: 'other' } } })], passages)
    expect(result.statesByDifficulty[readingDifficultyId(error())].status).toBe('insufficient-evidence')
  })
  it('fails closed for missing or invalid timestamps', () => {
    const missing = deriveReadingStates([error()], [retest({ createdAt: '' })], passages)
    const invalid = deriveReadingStates([error({ createdAt: 'invalid' })], [retest()], passages)
    expect(missing.statesByDifficulty[readingDifficultyId(error())].status).toBe('insufficient-evidence')
    expect(invalid.statesByDifficulty[readingDifficultyId(error({ createdAt: 'invalid' }))].status).toBe('insufficient-evidence')
  })
  it('does not use legacy retestAttemptIds as passing evidence', () => {
    const legacy = error({ retestAttemptIds: ['r1'] })
    expect(deriveReadingStates([legacy], [], passages).statesByDifficulty[readingDifficultyId(legacy)].status).toBe('insufficient-evidence')
  })
  it('maps multiple Retest questions to their explicit target errors', () => {
    const errors = [error(), error({ id: 'err-urban-gardens-Distinguish explicit contradiction', questionId: 'q2', objective: 'Distinguish explicit contradiction', type: 'true-false-not-given' })]
    const attempt = retest({ answers: { r1: passages[1].questions[0].answer, r2: passages[1].questions[1].answer }, responseTargets: { r1: targetFor(errors[0]), r2: targetFor(errors[1]) } })
    const evidence = buildReadingEvidence(errors, [attempt], passages)
    expect(evidence.filter(item => item.kind === 'retest').map(item => item.occurrenceId)).toEqual([readingOccurrenceId(errors[0]), readingOccurrenceId(errors[1])])
  })
  it('keeps multiple occurrences in one ErrorRecord independent', () => {
    const record = error({ occurrences: [{ id: 'o-a', attemptId: 'a1', questionId: 'q1', createdAt: '2026-01-01T10:00:00Z' }, { id: 'o-b', attemptId: 'a2', questionId: 'q1', createdAt: '2026-01-02T10:00:00Z' }] })
    const pass = retest({ responseTargets: { r1: { difficultyId: readingDifficultyId(record), occurrenceId: 'reading:occurrence:' + record.id + ':o-a' } } })
    const history: Attempt[] = [{ id: 'a1', passageId: 'urban-gardens', skill: 'Reading', answers: { q1: 'wrong' }, score: 0, total: 1, kind: 'practice', createdAt: '2026-01-01T10:00:00Z', objectiveIds: ['Identify the main idea'] }, { id: 'a2', passageId: 'urban-gardens', skill: 'Reading', answers: { q1: 'wrong' }, score: 0, total: 1, kind: 'practice', createdAt: '2026-01-02T10:00:00Z', objectiveIds: ['Identify the main idea'] }]
    const result = deriveReadingStates([record], [...history, pass], passages)
    expect(result.statesByDifficulty[readingDifficultyId(record)].occurrences.map(item => item.status)).toEqual(['resolved', 'open'])
  })
  it('does not resolve from a parent ErrorRecord target', () => {
    const record = error({ occurrences: [{ id: 'o-a', attemptId: 'a1', questionId: 'q1', createdAt: '2026-01-01T10:00:00Z' }] })
    const pass = retest({ responseTargets: { r1: { difficultyId: readingDifficultyId(record), occurrenceId: record.id } } })
    const history: Attempt = { id: 'a1', passageId: 'urban-gardens', skill: 'Reading', answers: { q1: 'wrong' }, score: 0, total: 1, kind: 'practice', createdAt: '2026-01-01T10:00:00Z', objectiveIds: ['Identify the main idea'] }
    expect(deriveReadingStates([record], [history, pass], passages).statesByDifficulty[readingDifficultyId(record)].status).toBe('open')
  })
  it('fails closed when equivalence metadata is missing', () => {
    const original = { ...passages[0], questions: passages[0].questions.map(question => question.id === 'q1' ? { ...question, equivalenceKey: undefined } : question) }
    const result = deriveReadingStates([error()], [retest()], [original, passages[1]])
    expect(result.statesByDifficulty[readingDifficultyId(error())].status).toBe('insufficient-evidence')
  })
})
