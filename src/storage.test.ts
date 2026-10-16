import { beforeEach, describe, expect, it } from 'vitest'
import { clearStore, loadStore, saveStore } from './storage'

const data = new Map<string, string>()
const memoryStorage: Storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key), clear: () => data.clear(), key: index => [...data.keys()][index] ?? null, get length() { return data.size } }

beforeEach(() => { data.clear(); globalThis.localStorage = memoryStorage })

describe('storage migration and deletion', () => {
  it('reads legacy history without rewriting storage during load', () => {
    data.set('optistudy-store-v1', JSON.stringify({ version: 1, attempts: [{ id: 'old' }], profile: { priority: 'Reading', daysOff: [] } }))
    const store = loadStore()
    expect(store.attempts[0].id).toBe('old')
    expect(data.has('ielts-optimizer-store-v1')).toBe(false)
  })
  it('preserves corrupt raw data and does not autosave an empty replacement', () => {
    data.set('ielts-optimizer-store-v1', '{broken')
    const store = loadStore()
    expect(store.attempts).toEqual([])
    expect(store.recoveryState?.raw).toBe('{broken')
    expect(data.get('ielts-optimizer-store-v1')).toBe('{broken')
  })
  it('clears both current and legacy keys', () => {
    data.set('ielts-optimizer-store-v1', '{}'); data.set('optistudy-store-v1', '{}'); data.set('ielts-optimizer-vocab-known', '{}')
    expect(clearStore()).toEqual({ ok: true, failedKeys: [] })
    expect(data.size).toBe(0)
  })
  it('reports storage write failures without hiding them', () => {
    const failingStorage = { ...memoryStorage, setItem: () => { throw new Error('quota') } } as Storage
    globalThis.localStorage = failingStorage
    expect(saveStore({ version: 1, profile: { daysOff: [], priority: 'Reading' }, attempts: [], errors: [], sessions: [], plan: [] })).toBe(false)
  })
  it('pauses a recovered timer instead of counting closed-tab time', () => {
    data.set('ielts-optimizer-store-v1', JSON.stringify({ version: 1, activeSession: { id: 's', startedAt: '2026-01-01T10:00:00Z', lastResumedAt: '2026-01-01T10:00:00Z', accumulatedSeconds: 30, paused: false } }))
    const store = loadStore()
    expect(store.activeSession?.paused).toBe(true)
    expect(store.activeSession?.accumulatedSeconds).toBe(30)
  })
  it('preserves learner-added study destinations during recovery', () => {
    data.set('ielts-optimizer-store-v1', JSON.stringify({ version: 1, studyDestinations: [{ id: 'd1', name: 'British Council', kind: 'website' }], activeSession: { id: 's', startedAt: '2026-01-01T10:00:00Z', lastResumedAt: '2026-01-01T10:00:00Z', accumulatedSeconds: 90, paused: false, destinationId: 'd1' } }))
    const store = loadStore()
    expect(store.studyDestinations?.[0].name).toBe('British Council')
    expect(store.activeSession?.destinationId).toBe('d1')
  })
  it('recovers drafts and submissions without dropping older history', () => {
    data.set('ielts-optimizer-store-v1', JSON.stringify({ version: 1, attempts: [{ id: 'old' }], drafts: [{ id: 'd1', skill: 'Writing', activityId: 'writing-academic-task-2', content: 'draft', updatedAt: '2026-01-01T10:00:00Z' }], submissions: [{ id: 'sub1', skill: 'Writing', activityId: 'writing-academic-task-2', response: 'saved', createdAt: '2026-01-01T10:00:00Z', feedbackMode: 'self-review', completed: true }] }))
    const store = loadStore()
    expect(store.attempts[0].id).toBe('old')
    expect(store.drafts?.[0].content).toBe('draft')
    expect(store.submissions?.[0].id).toBe('sub1')
  })
})
