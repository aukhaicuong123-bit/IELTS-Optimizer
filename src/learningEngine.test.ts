import { describe, expect, it } from 'vitest'
import { deriveCurrentDifficultyState } from './learningEngine'
import type { DifficultyEvidence } from './types'

const make = (overrides: Partial<DifficultyEvidence> = {}): DifficultyEvidence => ({ id: 'e1', difficultyId: 'reading:detail', occurrenceId: 'o1', kind: 'initial-error', outcome: 'failed', reliability: 'reliable', createdAt: '2026-01-01T10:00:00Z', ...overrides })
const state = (events: DifficultyEvidence[], difficultyId = 'reading:detail') => deriveCurrentDifficultyState(difficultyId, events)

describe('deriveCurrentDifficultyState', () => {
  it('returns insufficient evidence without matching difficulty evidence', () => expect(state([make({ difficultyId: 'listening:detail' })]).status).toBe('insufficient-evidence'))
  it('resolves a reliable failure with a valid equivalent targeted Retest pass', () => expect(state([make(), make({ id: 'e2', kind: 'retest', outcome: 'passed', resolvesOccurrenceId: 'o1', equivalentContent: true, createdAt: '2026-01-02T10:00:00Z' })]).occurrences[0].status).toBe('resolved'))
  it('reopens after a newer reliable failure', () => expect(state([make({ id: 'e1', outcome: 'failed' }), make({ id: 'e2', kind: 'retest', outcome: 'passed', resolvesOccurrenceId: 'o1', equivalentContent: true, createdAt: '2026-01-02T10:00:00Z' }), make({ id: 'e3', createdAt: '2026-01-03T10:00:00Z' })]).status).toBe('open'))
  it('keeps a historical pass behind a newer failure open', () => expect(state([make({ id: 'e1', kind: 'retest', outcome: 'passed', resolvesOccurrenceId: 'o1', equivalentContent: true }), make({ id: 'e2', createdAt: '2026-01-02T10:00:00Z' })]).occurrences[0].status).toBe('open'))
  it('does not resolve with a partial pass', () => expect(state([make(), make({ id: 'e2', kind: 'retest', outcome: 'passed', reliability: 'partial', resolvesOccurrenceId: 'o1', equivalentContent: true })]).status).toBe('open'))
  it('does not erase a known failure with unknown evidence', () => expect(state([make(), make({ id: 'e2', outcome: 'unknown', reliability: 'unknown' })]).status).toBe('open'))
  it('returns insufficient evidence for unknown-only evidence', () => expect(state([make({ outcome: 'unknown', reliability: 'unknown' })]).status).toBe('insufficient-evidence'))
  it('requires resolvesOccurrenceId', () => expect(state([make(), make({ id: 'e2', kind: 'retest', outcome: 'passed', equivalentContent: true })]).status).toBe('open'))
  it('does not resolve from a non-Retest pass', () => expect(state([make(), make({ id: 'e2', kind: 'transfer', outcome: 'passed', resolvesOccurrenceId: 'o1', equivalentContent: true })]).status).toBe('open'))
  it('does not resolve from a pass with an invalid timestamp', () => expect(state([make(), make({ id: 'e2', kind: 'retest', outcome: 'passed', resolvesOccurrenceId: 'o1', equivalentContent: true, createdAt: 'invalid' })]).status).toBe('open'))
  it('does not choose a pass over a same-timestamp failure', () => expect(state([make({ id: 'a', createdAt: '2026-01-02T10:00:00Z' }), make({ id: 'b', kind: 'retest', outcome: 'passed', resolvesOccurrenceId: 'o1', equivalentContent: true, createdAt: '2026-01-02T10:00:00Z' })]).occurrences[0].status).toBe('open'))
  it('keeps same-timestamp failures deterministic without claiming chronology', () => { const events = [make({ id: 'b' }), make({ id: 'a' })]; const first = state(events); const second = state([...events].reverse()); expect(first).toEqual(second); expect(first.chronology).toBe('ambiguous') })
  it('aggregates resolved and open occurrences as open', () => expect(state([make(), make({ id: 'e2', occurrenceId: 'o1', kind: 'retest', outcome: 'passed', resolvesOccurrenceId: 'o1', equivalentContent: true, createdAt: '2026-01-02T10:00:00Z' }), make({ id: 'e3', occurrenceId: 'o2' })]).status).toBe('open'))
  it('aggregates resolved and insufficient occurrences as insufficient evidence', () => expect(state([make(), make({ id: 'e2', occurrenceId: 'o1', kind: 'retest', outcome: 'passed', resolvesOccurrenceId: 'o1', equivalentContent: true, createdAt: '2026-01-02T10:00:00Z' }), make({ id: 'e3', occurrenceId: 'o2', outcome: 'unknown', reliability: 'unknown' })]).status).toBe('insufficient-evidence'))
  it('isolates evidence belonging to another difficulty', () => expect(state([make({ difficultyId: 'other' }), make({ id: 'e2' }), make({ id: 'e3', difficultyId: 'other', kind: 'retest', outcome: 'passed', resolvesOccurrenceId: 'o1', equivalentContent: true })]).status).toBe('open'))
  it('never establishes durable mastery from one successful Retest', () => { const result = state([make({ kind: 'retest', outcome: 'passed', resolvesOccurrenceId: 'o1', equivalentContent: true })]); expect(result.status).toBe('insufficient-evidence'); expect(result.durableMastery).toBe('not-demonstrated') })
  it('does not claim a unique latest evidence ID for same-timestamp passes', () => {
    const result = state([make({ id: 'z', kind: 'retest', outcome: 'passed', resolvesOccurrenceId: 'o1', equivalentContent: true }), make({ id: 'a', kind: 'retest', outcome: 'passed', resolvesOccurrenceId: 'o1', equivalentContent: true })])
    expect(result.status).toBe('insufficient-evidence')
    expect(result.latestReliableEvidenceId).toBeUndefined()
  })
  it('keeps same-timestamp failures deterministic without selecting chronology by ID', () => {
    const first = state([make({ id: 'z' }), make({ id: 'a' })])
    const second = state([make({ id: 'a' }), make({ id: 'z' })])
    expect(first).toEqual(second)
    expect(first.occurrences[0].evidenceIds).toEqual(['a', 'z'])
    expect(first.occurrences[0].latestReliableEvidenceId).toBeUndefined()
  })
  it('keeps conflicting same-timestamp pass and failure open', () => {
    expect(state([make({ id: 'z' }), make({ id: 'a', kind: 'retest', outcome: 'passed', resolvesOccurrenceId: 'o1', equivalentContent: true })]).status).toBe('open')
  })
  it('keeps an unresolved failure open when a later failure has no valid timestamp', () => {
    expect(state([make({ id: 'pass', kind: 'retest', outcome: 'passed', resolvesOccurrenceId: 'o1', equivalentContent: true, createdAt: '2026-01-02T10:00:00Z' }), make({ id: 'bad-failure', createdAt: undefined })]).status).toBe('open')
  })
  it('keeps an invalid-timestamp failure open without a pass', () => {
    expect(state([make({ createdAt: 'invalid' })]).status).toBe('open')
  })
  it('returns insufficient evidence for a reliable unknown without other evidence', () => {
    expect(state([make({ outcome: 'unknown' })]).status).toBe('insufficient-evidence')
  })
  it('does not let unknown evidence erase a known unresolved failure', () => {
    expect(state([make(), make({ id: 'unknown', outcome: 'unknown', reliability: 'reliable', createdAt: '2026-01-02T10:00:00Z' })]).status).toBe('open')
  })
  it('requires the Retest occurrence ID to match its evidence occurrence', () => {
    const result = state([make({ id: 'o1-failure' }), make({ id: 'o2-pass', occurrenceId: 'o2', kind: 'retest', outcome: 'passed', resolvesOccurrenceId: 'o1', equivalentContent: true, createdAt: '2026-01-02T10:00:00Z' })])
    expect(result.occurrences.find(occurrence => occurrence.occurrenceId === 'o1')?.status).toBe('open')
    expect(result.occurrences.find(occurrence => occurrence.occurrenceId === 'o2')?.status).toBe('insufficient-evidence')
  })
  it('does not resolve an occurrence from a pass without historical failure evidence', () => {
    const result = state([make({ kind: 'retest', outcome: 'passed', resolvesOccurrenceId: 'o1', equivalentContent: true })])
    expect(result.status).toBe('insufficient-evidence')
    expect(result.occurrences[0].status).toBe('insufficient-evidence')
  })
})
