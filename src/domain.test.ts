import { describe, expect, it } from 'vitest'
import { heatLevel, makeErrors, mergeAttemptErrors, minutesByDate, recommendations, scoreAttempt, startOfLocalWeek } from './domain'
import type { Attempt, Profile, StudySession } from './types'

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
    expect(recommendations(profile, [attempt], [error], []).page).toBe('errors')
    expect(recommendations(profile, [], [], []).page).toBe('practice')
  })
  it('keeps one stable error identity while recording repeated failed attempts', () => {
    const questions = [{ id: 'q2', type: 'multiple-choice' as const, prompt: 'detail?', options: ['right', 'wrong'], answer: 'right', explanation: 'x', objective: 'detail' }]
    const first = { ...attempt, answers: { q2: 'wrong' }, objectiveIds: ['detail'] }
    const second = { ...first, id: 'a2', kind: 'retest' as const, createdAt: '2026-01-02T10:00:00Z' }
    const initial = makeErrors(first, questions)
    const merged = mergeAttemptErrors(initial, second, questions)
    expect(merged).toHaveLength(1)
    expect(merged[0].attemptIds).toEqual(['a1', 'a2'])
    const passed = { ...second, id: 'a3', answers: { q2: 'right' } }
    expect(mergeAttemptErrors(merged, passed, questions)[0].retestAttemptIds).toContain('a3')
  })
})
