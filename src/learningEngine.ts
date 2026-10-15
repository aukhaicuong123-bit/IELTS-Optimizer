import type { CurrentDifficultyState, DifficultyEvidence, ErrorOccurrenceState } from './types'

const timestamp = (evidence: DifficultyEvidence) => {
  if (!evidence.createdAt) return undefined
  const value = Date.parse(evidence.createdAt)
  return Number.isFinite(value) ? value : undefined
}

const deriveOccurrence = (occurrenceId: string, events: DifficultyEvidence[]): ErrorOccurrenceState => {
  const evidenceIds = events.map(event => event.id).sort((left, right) => left.localeCompare(right))
  const reliable = events.filter(event => event.reliability === 'reliable')
  const failures = reliable.filter(event => event.outcome === 'failed')
  const passes = reliable.filter(event => event.outcome === 'passed')
  const validPasses = passes.filter(event => event.kind === 'retest' && event.resolvesOccurrenceId === occurrenceId && event.equivalentContent === true && timestamp(event) !== undefined)
  const timestamps = new Map<number, DifficultyEvidence[]>()
  reliable.forEach(event => {
    const time = timestamp(event)
    if (time !== undefined) timestamps.set(time, [...(timestamps.get(time) || []), event])
  })
  const hasTimestampConflict = [...timestamps.values()].some(group => group.some(event => event.outcome === 'failed') && group.some(event => event.outcome === 'passed'))
  const hasSameTimestampFailures = [...timestamps.values()].some(group => group.filter(event => event.outcome === 'failed').length > 1)
  const reliableTimes = reliable.map(timestamp).filter((time): time is number => time !== undefined)
  const latestTime = reliableTimes.length ? Math.max(...reliableTimes) : undefined
  const latestTimeEvents = latestTime === undefined ? [] : reliable.filter(event => timestamp(event) === latestTime)
  const hasLatestTimestampTie = latestTimeEvents.length > 1
  const chronologyAmbiguous = hasTimestampConflict || hasSameTimestampFailures || hasLatestTimestampTie

  let status: ErrorOccurrenceState['status']
  if (!reliable.length) {
    status = 'insufficient-evidence'
  } else if (failures.length) {
    const cannotOrderFailure = failures.some(failure => timestamp(failure) === undefined)
    // A pass-only occurrence cannot prove that the tracked difficulty was ever observed.
    const passTimes = validPasses.map(timestamp).filter((time): time is number => time !== undefined)
    const passTime = passTimes.length ? Math.max(...passTimes) : undefined
    const pass = passTime === undefined ? undefined : validPasses.find(candidate => timestamp(candidate) === passTime)
    const failureAtPassTime = passTime !== undefined && failures.some(failure => timestamp(failure) === passTime)
    const newerFailure = passTime !== undefined && failures.some(failure => {
      const failureTime = timestamp(failure)
      return failureTime !== undefined && failureTime > passTime
    })
    status = pass && passTime !== undefined && !cannotOrderFailure && !failureAtPassTime && !newerFailure && failures.every(failure => { const failureTime = timestamp(failure); return failureTime !== undefined && failureTime < passTime }) && !hasTimestampConflict ? 'resolved' : 'open'
  } else {
    status = failures.length ? 'open' : 'insufficient-evidence'
  }

  const latestReliable = latestTimeEvents.length === 1 ? latestTimeEvents[0] : undefined
  return { occurrenceId, status, evidenceIds, ...(latestReliable && !chronologyAmbiguous ? { latestReliableEvidenceId: latestReliable.id } : {}) }
}

export const deriveCurrentDifficultyState = (difficultyId: string, evidence: DifficultyEvidence[]): CurrentDifficultyState => {
  const matching = evidence.filter(event => event.difficultyId === difficultyId)
  const occurrenceIds = [...new Set(matching.map(event => event.occurrenceId))].sort((left, right) => left.localeCompare(right))
  const occurrences = occurrenceIds.map(occurrenceId => deriveOccurrence(occurrenceId, matching.filter(event => event.occurrenceId === occurrenceId)))
  const hasOpen = occurrences.some(occurrence => occurrence.status === 'open')
  const hasInsufficient = occurrences.some(occurrence => occurrence.status === 'insufficient-evidence')
  const status = !occurrences.length || hasInsufficient ? (hasOpen ? 'open' : 'insufficient-evidence') : hasOpen ? 'open' : 'resolved'
  const chronology = !matching.length ? 'insufficient' : occurrences.some(occurrence => !occurrence.latestReliableEvidenceId) ? 'ambiguous' : 'reliable'
  const reliable = matching.filter(event => event.reliability === 'reliable')
  const reliableTimes = reliable.map(timestamp).filter((time): time is number => time !== undefined)
  const latestTime = reliableTimes.length ? Math.max(...reliableTimes) : undefined
  const latestEvents = latestTime === undefined ? [] : reliable.filter(event => timestamp(event) === latestTime)
  return { difficultyId, status, occurrences, ...(chronology === 'reliable' && latestEvents.length === 1 ? { latestReliableEvidenceId: latestEvents[0].id } : {}), chronology, durableMastery: 'not-demonstrated' }
}
