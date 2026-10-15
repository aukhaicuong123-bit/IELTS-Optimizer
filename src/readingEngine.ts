import { deriveCurrentDifficultyState } from './learningEngine'
import type { Attempt, CurrentDifficultyState, DifficultyEvidence, ErrorRecord, Passage, ReadingErrorOccurrence, ReadingOccurrenceTarget } from './types'

export const readingDifficultyId = (error: ErrorRecord) => `reading:legacy-error:${error.id}`
export const readingOccurrenceId = (error: ErrorRecord) => `reading:legacy-occurrence:${error.id}`
const validTimestamp = (value: string | undefined) => Boolean(value && Number.isFinite(Date.parse(value)))
const stableOccurrenceId = (error: ErrorRecord, occurrence: ReadingErrorOccurrence) => `reading:occurrence:${error.id}:${occurrence.id}`

const initialEvidence = (error: ErrorRecord, occurrenceId: string, occurrence?: ReadingErrorOccurrence): DifficultyEvidence => ({ id: `initial:${error.id}:${occurrenceId}`, difficultyId: readingDifficultyId(error), occurrenceId, kind: 'initial-error', outcome: 'failed', reliability: validTimestamp(occurrence?.createdAt || error.createdAt) ? 'reliable' : 'unknown', createdAt: occurrence?.createdAt || error.createdAt })
const occurrencesFor = (error: ErrorRecord): { id: string; sourceAttemptId?: string; questionId: string; createdAt?: string }[] => !error.occurrences?.length ? [{ id: readingOccurrenceId(error), questionId: error.questionId, createdAt: error.createdAt }] : error.occurrences.map(occurrence => ({ id: stableOccurrenceId(error, occurrence), sourceAttemptId: occurrence.attemptId, questionId: occurrence.questionId, createdAt: occurrence.createdAt }))

export const buildReadingEvidence = (errors: ErrorRecord[], attempts: Attempt[], passages: Passage[]): DifficultyEvidence[] => {
  const evidence: DifficultyEvidence[] = []
  const byDifficultyId = new Map(errors.map(error => [readingDifficultyId(error), error]))
  errors.forEach(error => occurrencesFor(error).forEach(occurrence => {
    const legacyFallback = !error.occurrences?.length
    const source = occurrence.sourceAttemptId ? attempts.find(attempt => attempt.id === occurrence.sourceAttemptId) : undefined
    const sourceQuestion = source && passages.find(passage => passage.id === source.passageId)?.questions.find(question => question.id === occurrence.questionId)
    const verifiedFailure = !occurrence.sourceAttemptId || Boolean(source && sourceQuestion && source.answers[occurrence.questionId] !== sourceQuestion.answer)
    evidence.push(!legacyFallback && verifiedFailure ? initialEvidence(error, occurrence.id, { id: occurrence.id, attemptId: occurrence.sourceAttemptId || error.attemptId, questionId: occurrence.questionId, createdAt: occurrence.createdAt }) : { ...initialEvidence(error, occurrence.id), reliability: 'unknown', outcome: 'unknown' })
  }))
  attempts.filter(attempt => attempt.skill === 'Reading' && attempt.kind === 'retest').forEach(attempt => {
    const passage = passages.find(item => item.id === attempt.passageId)
    if (!passage) return
    passage.questions.forEach(question => {
      const target = attempt.responseTargets?.[question.id]
      if (!target) return
      const error = byDifficultyId.get(target.difficultyId)
      const occurrence = error && occurrencesFor(error).find(item => item.id === target.occurrenceId)
      if (!error || !occurrence) return
      const originalPassage = passages.find(item => item.id === error.passageId)
      const originalQuestion = originalPassage?.questions.find(item => item.id === occurrence.questionId)
      const submitted = Object.prototype.hasOwnProperty.call(attempt.answers, question.id)
      const comparable = Boolean(originalQuestion?.equivalenceKey && originalQuestion.equivalenceKey === question.equivalenceKey && attempt.passageId !== error.passageId && question.type === error.type && question.objective === error.objective)
      const reliable = validTimestamp(attempt.createdAt) && submitted && comparable
      evidence.push({ id: `retest:${attempt.id}:${question.id}:${target.occurrenceId}`, difficultyId: target.difficultyId, occurrenceId: target.occurrenceId, kind: 'retest', outcome: submitted ? (attempt.answers[question.id] === question.answer ? 'passed' : 'failed') : 'unknown', reliability: reliable ? 'reliable' : 'unknown', resolvesOccurrenceId: target.occurrenceId, equivalentContent: comparable, createdAt: attempt.createdAt })
    })
  })
  return evidence
}

export const deriveReadingStates = (errors: ErrorRecord[], attempts: Attempt[], passages: Passage[]) => {
  const evidence = buildReadingEvidence(errors, attempts, passages)
  const difficultyIds = [...new Set(evidence.map(item => item.difficultyId))].sort((left, right) => left.localeCompare(right))
  const statesByDifficulty: Record<string, CurrentDifficultyState> = {}
  difficultyIds.forEach(difficultyId => { statesByDifficulty[difficultyId] = deriveCurrentDifficultyState(difficultyId, evidence) })
  return { evidence, statesByDifficulty }
}

export const targetFor = (error: ErrorRecord, occurrenceId?: string): ReadingOccurrenceTarget => {
  if (!error.occurrences?.length) return { difficultyId: readingDifficultyId(error), occurrenceId: readingOccurrenceId(error) }
  if (occurrenceId && error.occurrences.some(occurrence => stableOccurrenceId(error, occurrence) === occurrenceId)) return { difficultyId: readingDifficultyId(error), occurrenceId }
  // Multiple occurrences are intentionally ambiguous without an explicit target.
  // The adapter will not allow an empty target to resolve anything.
  if (error.occurrences.length > 1) return { difficultyId: readingDifficultyId(error), occurrenceId: '' }
  return { difficultyId: readingDifficultyId(error), occurrenceId: stableOccurrenceId(error, error.occurrences[0]) }
}
