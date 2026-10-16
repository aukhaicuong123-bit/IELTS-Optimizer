import { describe, expect, it } from 'vitest'
import { heatLevel, localDate, makeErrors, mergeAttemptErrors, minutesByDate, recommendations, scoreAttempt, snapshotActiveSession, startOfLocalWeek } from './domain'
import type { ActiveSession, Attempt, Profile, StudySession } from './types'

const profile: Profile = { daysOff: [], priority: 'Reading', dailyGoalMinutes: 30 }
const attempt: Attempt = { id: 'a1', passageId: 'p', skill: 'Reading', answers: { q1: 'right', q2: 'wrong' }, score: 1, total: 2, kind: 'practice', createdAt: '2026-01-01T10:00:00Z', objectiveIds: ['main', 'detail'] }

describe('IELTS Optimizer learning domain', () => {
  it('scores answers and stores only incorrect questions', () => {
    const questions = [{ id: 'q1', type: 'multiple-choice' as const, prompt: '', options: ['right'], answer: 'right', explanation: 'x', objective: 'main' }, { id: 'q2', type: 'multiple-choice' as const, prompt: '', options: ['right', 'wrong'], answer: 'right', explanation: 'x', objective: 'detail' }]
    expect(scoreAttempt(questions, attempt.answers)).toBe(1)
    expect(makeErrors(attempt, questions)).toHaveLength(1)
    expect(makeErrors(attempt, questions)[0].objective).toBe('detail')
  })
  it('splits a cross-midnight session across both local dates', () => {
    const sessions: StudySession[] = [{ id: 's', startedAt: '2026-01-01T23:50:00', endedAt: '2026-01-02T00:20:00', minutes: 30 }]
    const map = minutesByDate(sessions)
    expect(Object.values(map).reduce((a, b) => a + b, 0)).toBeCloseTo(30)
    expect(Object.keys(map).length).toBe(2)
  })
  it('does not create phantom minutes for invalid time ranges', () => {
    const map = minutesByDate([{ id: 'bad', startedAt: 'not-a-date', endedAt: 'not-a-date', minutes: 0 }])
    expect(Object.values(map).reduce((a, b) => a + b, 0)).toBe(0)
  })
  it('uses measured active minutes instead of paused wall-clock time', () => {
    const map = minutesByDate([{ id: 'paused', startedAt: '2026-01-01T10:00:00Z', endedAt: '2026-01-01T12:00:00Z', minutes: 10 }])
    expect(Object.values(map).reduce((a, b) => a + b, 0)).toBeCloseTo(10)
  })
  it('splits recorded active intervals across local dates without counting the pause gap', () => {
    const firstStart = new Date(2026, 0, 1, 23, 59), firstEnd = new Date(2026, 0, 2, 0, 1), secondStart = new Date(2026, 0, 2, 0, 30), secondEnd = new Date(2026, 0, 2, 0, 39)
    const map = minutesByDate([{ id: 'intervals', startedAt: firstStart.toISOString(), endedAt: secondEnd.toISOString(), minutes: 11, activeIntervals: [{ startedAt: firstStart.toISOString(), endedAt: firstEnd.toISOString() }, { startedAt: secondStart.toISOString(), endedAt: secondEnd.toISOString() }] }])
    expect(map[localDate(firstStart.toISOString())]).toBeCloseTo(1)
    expect(map[localDate(secondStart.toISOString())]).toBeCloseTo(10)
  })
  it('snapshots active time into non-overlapping intervals', () => {
    const session: ActiveSession = { id: 'timer', startedAt: '2026-01-01T10:00:00Z', lastResumedAt: '2026-01-01T10:00:00Z', accumulatedSeconds: 0, paused: false }
    const first = snapshotActiveSession(session, '2026-01-01T10:00:05Z')
    const second = snapshotActiveSession(first, '2026-01-01T10:00:10Z')
    expect(second.accumulatedSeconds).toBe(10)
    expect(second.activeIntervals).toEqual([{ startedAt: '2026-01-01T10:00:00Z', endedAt: '2026-01-01T10:00:05Z' }, { startedAt: '2026-01-01T10:00:05Z', endedAt: '2026-01-01T10:00:10Z' }])
  })
  it('does not add time to a paused session or duplicate an invalid checkpoint', () => {
    const paused: ActiveSession = { id: 'timer', startedAt: '2026-01-01T10:00:00Z', lastResumedAt: '2026-01-01T10:00:00Z', accumulatedSeconds: 10, paused: true }
    expect(snapshotActiveSession(paused, '2026-01-01T11:00:00Z')).toBe(paused)
    const running: ActiveSession = { ...paused, paused: false }
    expect(snapshotActiveSession(running, 'invalid')).toBe(running)
  })
  it('aligns heatmap weeks to Sunday for every month boundary', () => {
    const start = startOfLocalWeek(new Date(2026, 2, 1))
    expect(start.getDay()).toBe(0)
    expect(start.getHours()).toBe(0)
  })
  it('maps practice intensity to a bounded heat level', () => {
    expect(heatLevel(0, profile.dailyGoalMinutes!)).toBe(0)
    expect(heatLevel(30, profile.dailyGoalMinutes!)).toBe(5)
    expect(heatLevel(120, profile.dailyGoalMinutes!)).toBe(5)
    expect(heatLevel(7.5, profile.dailyGoalMinutes!)).toBe(1)
    expect(heatLevel(15, profile.dailyGoalMinutes!)).toBe(2)
  })
  it('recommends open Error Memory before a generic activity', () => {
    const error = { id: 'e', questionId: 'q2', attemptId: 'a1', passageId: 'p', type: 'multiple-choice' as const, objective: 'detail', learnerAnswer: 'wrong', correctAnswer: 'right', explanation: 'x', createdAt: '2026-01-01T10:00:00Z', reviewCount: 0, retestAttemptIds: [] }
    const state = { difficultyId: 'reading:legacy-error:e', status: 'open' as const, occurrences: [], chronology: 'reliable' as const, durableMastery: 'not-demonstrated' as const }
    expect(recommendations(profile, [attempt], [error], [], { 'reading:legacy-error:e': state }).page).toBe('errors')
    expect(recommendations(profile, [], [], [], {}).page).toBe('practice')
  })
  it('keeps one stable error identity while recording repeated failed attempts', () => {
    const questions = [{ id: 'q2', type: 'multiple-choice' as const, prompt: 'detail?', options: ['right', 'wrong'], answer: 'right', explanation: 'x', objective: 'detail' }]
    const first = { ...attempt, answers: { q2: 'wrong' }, objectiveIds: ['detail'] }
    const initial = makeErrors(first, questions)
    const target = { difficultyId: `reading:legacy-error:${initial[0].id}`, occurrenceId: `reading:occurrence:${initial[0].id}:${initial[0].occurrences?.[0].id}` }
    const second = { ...first, id: 'a2', kind: 'retest' as const, createdAt: '2026-01-02T10:00:00Z', responseTargets: { q2: target } }
    const merged = mergeAttemptErrors(initial, second, questions)
    expect(merged).toHaveLength(1)
    expect(merged[0].attemptIds).toEqual(['a1', 'a2'])
    const passed = { ...second, id: 'a3', answers: { q2: 'right' }, responseTargets: { q2: target } }
    expect(mergeAttemptErrors(merged, passed, questions)[0].retestAttemptIds).toContain('a3')
  })
  it('does not merge an untargeted Retest into Error Memory', () => {
    const questions = [{ id: 'q2', type: 'multiple-choice' as const, prompt: 'detail?', options: ['right', 'wrong'], answer: 'right', explanation: 'x', objective: 'detail' }]
    const initial = makeErrors({ ...attempt, answers: { q2: 'wrong' }, objectiveIds: ['detail'] }, questions)
    const untargeted: Attempt = { ...attempt, id: 'untargeted', kind: 'retest', answers: { q2: 'wrong' }, objectiveIds: ['detail'] }
    expect(mergeAttemptErrors(initial, untargeted, questions)).toEqual(initial)
  })
  it('does not merge a Retest with a mismatched occurrence identity', () => {
    const questions = [{ id: 'q2', type: 'multiple-choice' as const, prompt: 'detail?', options: ['right', 'wrong'], answer: 'right', explanation: 'x', objective: 'detail' }]
    const initial = makeErrors({ ...attempt, answers: { q2: 'wrong' }, objectiveIds: ['detail'] }, questions)
    const mismatched: Attempt = { ...attempt, id: 'mismatched', kind: 'retest', answers: { q2: 'right' }, objectiveIds: ['detail'], responseTargets: { q2: { difficultyId: `reading:legacy-error:${initial[0].id}`, occurrenceId: 'reading:occurrence:other:o1' } } }
    expect(mergeAttemptErrors(initial, mismatched, questions)).toEqual(initial)
  })
})
