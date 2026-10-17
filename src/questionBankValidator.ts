import type {
  ContentStatus,
  DifficultyBand,
  IELTSSkill,
  QuestionBankFilter,
  QuestionBankItem,
  ReadingQuestionBankPayload,
  ListeningQuestionBankPayload,
  WritingQuestionBankPayload,
  SpeakingQuestionBankPayload,
  ReadingQuestionType,
  ListeningQuestionType,
  WritingTaskType,
  SpeakingPart
} from './questionBankTypes'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings?: string[]
}

export interface BatchValidationResult {
  isValid: boolean
  itemErrors: Record<string, string[]>
  globalErrors: string[]
  validCount: number
  totalCount: number
}

const VALID_SKILLS: IELTSSkill[] = ['Reading', 'Listening', 'Writing', 'Speaking']
const VALID_DIFFICULTIES: DifficultyBand[] = ['foundation', 'intermediate', 'advanced', 'expert']
const VALID_STATUSES: ContentStatus[] = ['draft', 'needs_review', 'validated', 'approved', 'retired']
const VALID_READING_TYPES: ReadingQuestionType[] = [
  'multiple-choice',
  'true-false-not-given',
  'yes-no-not-given',
  'matching-headings',
  'summary-completion',
  'sentence-completion'
]
const VALID_LISTENING_TYPES: ListeningQuestionType[] = [
  'multiple-choice',
  'form-completion',
  'note-completion',
  'table-completion',
  'matching'
]
const VALID_WRITING_TYPES: WritingTaskType[] = ['academic_task1', 'general_task1', 'task2']
const VALID_SPEAKING_PARTS: SpeakingPart[] = ['part1', 'part2', 'part3']

/**
 * Valid lifecycle transitions for ContentStatus.
 * Unreviewed or draft items cannot jump directly to approved.
 */
export function isValidContentStatusTransition(from: ContentStatus, to: ContentStatus): boolean {
  if (from === to) return true
  const allowedMap: Record<ContentStatus, ContentStatus[]> = {
    draft: ['needs_review', 'retired'],
    needs_review: ['draft', 'validated', 'retired'],
    validated: ['needs_review', 'approved', 'retired'],
    approved: ['needs_review', 'retired'],
    retired: ['draft']
  }
  return allowedMap[from]?.includes(to) ?? false
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase()
}

/**
 * Validates a single QuestionBankItem for structural integrity,
 * answerability, answer-key validity, rubric completeness, and quote grounding.
 */
export function validateQuestionBankItem(raw: unknown): ValidationResult {
  const errors: string[] = []

  if (!raw || typeof raw !== 'object') {
    return { isValid: false, errors: ['Item must be a non-null object'] }
  }

  const item = raw as Partial<QuestionBankItem>

  // Root contract checks
  if (item.schemaVersion !== 1) {
    errors.push('schemaVersion must be 1')
  }

  if (typeof item.id !== 'string' || !/^[a-zA-Z0-9_-]{3,64}$/.test(item.id)) {
    errors.push('id must be an alphanumeric slug between 3 and 64 characters (may include _ or -)')
  }

  if (typeof item.contentVersion !== 'number' || !Number.isInteger(item.contentVersion) || item.contentVersion < 1) {
    errors.push('contentVersion must be a positive integer >= 1')
  }

  if (!item.skill || !VALID_SKILLS.includes(item.skill)) {
    errors.push(`skill must be one of: ${VALID_SKILLS.join(', ')}`)
  }

  if (typeof item.taskType !== 'string' || item.taskType.trim() === '') {
    errors.push('taskType must be a non-empty string')
  }

  if (typeof item.topic !== 'string' || item.topic.trim() === '') {
    errors.push('topic must be a non-empty string')
  }

  if (!item.difficulty || !VALID_DIFFICULTIES.includes(item.difficulty)) {
    errors.push(`difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}`)
  }

  if (typeof item.title !== 'string' || item.title.trim().length < 3) {
    errors.push('title must be a non-empty string with at least 3 characters')
  }

  if (typeof item.instructions !== 'string' || item.instructions.trim() === '') {
    errors.push('instructions must be a non-empty string')
  }

  if (!Array.isArray(item.objectives) || item.objectives.length === 0 || item.objectives.some(o => typeof o !== 'string' || o.trim() === '')) {
    errors.push('objectives must be a non-empty array of non-empty strings')
  }

  if (!item.status || !VALID_STATUSES.includes(item.status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`)
  }

  if (typeof item.createdAt !== 'string' || isNaN(Date.parse(item.createdAt))) {
    errors.push('createdAt must be a valid ISO 8601 date string')
  }

  if (typeof item.updatedAt !== 'string' || isNaN(Date.parse(item.updatedAt))) {
    errors.push('updatedAt must be a valid ISO 8601 date string')
  }

  // Provenance checks
  if (!item.source || typeof item.source !== 'object') {
    errors.push('source must be an object specifying provenance')
  } else {
    if (typeof item.source.author !== 'string' || item.source.author.trim() === '') {
      errors.push('source.author must be a non-empty string')
    }
    if (typeof item.source.license !== 'string' || item.source.license.trim() === '') {
      errors.push('source.license must be a non-empty string')
    }
    if (!['original', 'curated_public', 'licensed'].includes(item.source.provenanceType)) {
      errors.push("source.provenanceType must be 'original', 'curated_public', or 'licensed'")
    }
  }

  // Payload validations by skill
  if (!item.payload || typeof item.payload !== 'object') {
    errors.push('payload must be a non-null object')
    return { isValid: errors.length === 0, errors }
  }

  if (item.skill === 'Reading') {
    const payload = item.payload as Partial<ReadingQuestionBankPayload>
    if (typeof payload.passageTitle !== 'string' || payload.passageTitle.trim() === '') {
      errors.push('Reading payload requires a non-empty passageTitle')
    }
    if (typeof payload.passageText !== 'string' || payload.passageText.trim().split(/\s+/).length < 40) {
      errors.push('Reading payload passageText must contain at least 40 words')
    }
    if (!Array.isArray(payload.questions) || payload.questions.length === 0) {
      errors.push('Reading payload requires at least one question')
    } else {
      const normalizedPassage = normalizeWhitespace(payload.passageText || '')
      const seenQIds = new Set<string>()

      payload.questions.forEach((q, idx) => {
        const qPrefix = `Question[${idx}] (id: ${q?.id || 'unknown'}):`
        if (!q || typeof q !== 'object') {
          errors.push(`${qPrefix} must be an object`)
          return
        }
        if (typeof q.id !== 'string' || q.id.trim() === '') {
          errors.push(`${qPrefix} id is required`)
        } else if (seenQIds.has(q.id)) {
          errors.push(`${qPrefix} duplicate question id "${q.id}" within passage`)
        } else {
          seenQIds.add(q.id)
        }

        if (!q.type || !VALID_READING_TYPES.includes(q.type)) {
          errors.push(`${qPrefix} type must be one of: ${VALID_READING_TYPES.join(', ')}`)
        }

        if (typeof q.prompt !== 'string' || q.prompt.trim() === '') {
          errors.push(`${qPrefix} prompt must be a non-empty string`)
        }

        if (typeof q.objective !== 'string' || q.objective.trim() === '') {
          errors.push(`${qPrefix} objective must be specified for learning engine tracking`)
        }

        if (q.equivalenceGroup !== undefined && (typeof q.equivalenceGroup !== 'string' || q.equivalenceGroup.trim() === '')) {
          errors.push(`${qPrefix} equivalenceGroup if provided must be a non-empty string`)
        }

        // Answer key check
        const hasValidAnswerKey =
          (typeof q.answerKey === 'string' && q.answerKey.trim() !== '') ||
          (Array.isArray(q.answerKey) && q.answerKey.length > 0 && q.answerKey.every(k => typeof k === 'string' && k.trim() !== ''))

        if (!hasValidAnswerKey) {
          errors.push(`${qPrefix} answerKey must be a non-empty string or array of non-empty strings`)
        }

        // Evidence quote check
        if (typeof q.evidenceQuote !== 'string' || q.evidenceQuote.trim() === '') {
          errors.push(`${qPrefix} evidenceQuote must be a non-empty string`)
        } else {
          const normalizedQuote = normalizeWhitespace(q.evidenceQuote)
          if (!normalizedPassage.includes(normalizedQuote)) {
            errors.push(`${qPrefix} evidenceQuote "${q.evidenceQuote.slice(0, 50)}..." not found verbatim in passageText`)
          }
        }

        // Explanation check
        if (typeof q.explanation !== 'string' || q.explanation.trim() === '') {
          errors.push(`${qPrefix} explanation must be a non-empty string`)
        }

        // Multiple choice option validation
        if (q.type === 'multiple-choice') {
          if (!Array.isArray(q.options) || q.options.length < 2) {
            errors.push(`${qPrefix} multiple-choice question requires at least 2 options`)
          } else if (hasValidAnswerKey) {
            const key = Array.isArray(q.answerKey) ? q.answerKey[0] : q.answerKey
            const keyMatchesOption = q.options.some(
              opt => opt.trim().toLowerCase() === key.trim().toLowerCase() ||
                     opt.trim().toLowerCase().startsWith(key.trim().toLowerCase() + ')') ||
                     opt.trim().toLowerCase().startsWith(key.trim().toLowerCase() + '.')
            )
            if (!keyMatchesOption) {
              errors.push(`${qPrefix} multiple-choice answerKey "${key}" does not match any of the provided options`)
            }
          }
        }

        // True/False/Not Given validation
        if (q.type === 'true-false-not-given') {
          const validKeys = ['true', 'false', 'not given']
          const key = (Array.isArray(q.answerKey) ? q.answerKey[0] : q.answerKey || '').trim().toLowerCase()
          if (!validKeys.includes(key)) {
            errors.push(`${qPrefix} true-false-not-given answerKey must be 'TRUE', 'FALSE', or 'NOT GIVEN'`)
          }
        }

        // Yes/No/Not Given validation
        if (q.type === 'yes-no-not-given') {
          const validKeys = ['yes', 'no', 'not given']
          const key = (Array.isArray(q.answerKey) ? q.answerKey[0] : q.answerKey || '').trim().toLowerCase()
          if (!validKeys.includes(key)) {
            errors.push(`${qPrefix} yes-no-not-given answerKey must be 'YES', 'NO', or 'NOT GIVEN'`)
          }
        }
      })
    }
  } else if (item.skill === 'Listening') {
    const payload = item.payload as Partial<ListeningQuestionBankPayload>
    if (typeof payload.transcript !== 'string' || payload.transcript.trim().split(/\s+/).length < 25) {
      errors.push('Listening payload transcript must contain at least 25 words')
    }
    if (typeof payload.isSyntheticSpeech !== 'boolean') {
      errors.push('Listening payload isSyntheticSpeech boolean flag is required to indicate synthesis vs authentic audio')
    }
    if (!Array.isArray(payload.questions) || payload.questions.length === 0) {
      errors.push('Listening payload requires at least one question')
    } else {
      const normalizedTranscript = normalizeWhitespace(payload.transcript || '')
      const seenQIds = new Set<string>()

      payload.questions.forEach((q, idx) => {
        const qPrefix = `Listening Question[${idx}] (id: ${q?.id || 'unknown'}):`
        if (!q || typeof q !== 'object') {
          errors.push(`${qPrefix} must be an object`)
          return
        }
        if (typeof q.id !== 'string' || q.id.trim() === '') {
          errors.push(`${qPrefix} id is required`)
        } else if (seenQIds.has(q.id)) {
          errors.push(`${qPrefix} duplicate question id "${q.id}"`)
        } else {
          seenQIds.add(q.id)
        }

        if (!q.type || !VALID_LISTENING_TYPES.includes(q.type)) {
          errors.push(`${qPrefix} type must be one of: ${VALID_LISTENING_TYPES.join(', ')}`)
        }

        if (typeof q.prompt !== 'string' || q.prompt.trim() === '') {
          errors.push(`${qPrefix} prompt must be a non-empty string`)
        }

        if (typeof q.objective !== 'string' || q.objective.trim() === '') {
          errors.push(`${qPrefix} objective is required`)
        }

        if (q.equivalenceGroup !== undefined && (typeof q.equivalenceGroup !== 'string' || q.equivalenceGroup.trim() === '')) {
          errors.push(`${qPrefix} equivalenceGroup if provided must be a non-empty string`)
        }

        const hasValidAnswerKey =
          (typeof q.answerKey === 'string' && q.answerKey.trim() !== '') ||
          (Array.isArray(q.answerKey) && q.answerKey.length > 0 && q.answerKey.every(k => typeof k === 'string' && k.trim() !== ''))

        if (!hasValidAnswerKey) {
          errors.push(`${qPrefix} answerKey must be a non-empty string or array of non-empty strings`)
        }

        if (typeof q.evidenceQuote !== 'string' || q.evidenceQuote.trim() === '') {
          errors.push(`${qPrefix} evidenceQuote must be a non-empty string`)
        } else {
          const normalizedQuote = normalizeWhitespace(q.evidenceQuote)
          if (!normalizedTranscript.includes(normalizedQuote)) {
            errors.push(`${qPrefix} evidenceQuote "${q.evidenceQuote.slice(0, 50)}..." not found in transcript`)
          }
        }

        if (typeof q.explanation !== 'string' || q.explanation.trim() === '') {
          errors.push(`${qPrefix} explanation must be a non-empty string`)
        }

        if (q.type === 'multiple-choice') {
          if (!Array.isArray(q.options) || q.options.length < 2) {
            errors.push(`${qPrefix} multiple-choice requires at least 2 options`)
          } else if (hasValidAnswerKey) {
            const key = Array.isArray(q.answerKey) ? q.answerKey[0] : q.answerKey
            const keyMatchesOption = q.options.some(
              opt => opt.trim().toLowerCase() === key.trim().toLowerCase() ||
                     opt.trim().toLowerCase().startsWith(key.trim().toLowerCase() + ')') ||
                     opt.trim().toLowerCase().startsWith(key.trim().toLowerCase() + '.')
            )
            if (!keyMatchesOption) {
              errors.push(`${qPrefix} multiple-choice answerKey "${key}" does not match any option`)
            }
          }
        }
      })
    }
  } else if (item.skill === 'Writing') {
    const payload = item.payload as Partial<WritingQuestionBankPayload>
    if (typeof payload.prompt !== 'string' || payload.prompt.trim().split(/\s+/).length < 10) {
      errors.push('Writing prompt must contain at least 10 words')
    }

    if (!payload.taskType || !VALID_WRITING_TYPES.includes(payload.taskType)) {
      errors.push(`Writing taskType must be one of: ${VALID_WRITING_TYPES.join(', ')}`)
    }

    const minWords = payload.minimumWordCount
    if (typeof minWords !== 'number' || minWords < 100) {
      errors.push('Writing minimumWordCount must be a number >= 100')
    } else if (payload.taskType === 'academic_task1' || payload.taskType === 'general_task1') {
      if (minWords !== 150) {
        errors.push('Task 1 minimumWordCount standard is 150 words')
      }
    } else if (payload.taskType === 'task2') {
      if (minWords !== 250) {
        errors.push('Task 2 minimumWordCount standard is 250 words')
      }
    }

    // Rubric validation: all 4 IELTS criteria must be present
    if (!payload.rubric || typeof payload.rubric !== 'object') {
      errors.push('Writing rubric is required with all 4 IELTS assessment criteria')
    } else {
      const r = payload.rubric
      if (typeof r.taskAchievementOrResponseCriteria !== 'string' || r.taskAchievementOrResponseCriteria.trim() === '') {
        errors.push('Writing rubric must include taskAchievementOrResponseCriteria')
      }
      if (typeof r.coherenceAndCohesionCriteria !== 'string' || r.coherenceAndCohesionCriteria.trim() === '') {
        errors.push('Writing rubric must include coherenceAndCohesionCriteria')
      }
      if (typeof r.lexicalResourceCriteria !== 'string' || r.lexicalResourceCriteria.trim() === '') {
        errors.push('Writing rubric must include lexicalResourceCriteria')
      }
      if (typeof r.grammaticalRangeAndAccuracyCriteria !== 'string' || r.grammaticalRangeAndAccuracyCriteria.trim() === '') {
        errors.push('Writing rubric must include grammaticalRangeAndAccuracyCriteria')
      }
    }
  } else if (item.skill === 'Speaking') {
    const payload = item.payload as Partial<SpeakingQuestionBankPayload>
    if (!payload.part || !VALID_SPEAKING_PARTS.includes(payload.part)) {
      errors.push(`Speaking part must be one of: ${VALID_SPEAKING_PARTS.join(', ')}`)
    }
    if (typeof payload.mainPrompt !== 'string' || payload.mainPrompt.trim() === '') {
      errors.push('Speaking mainPrompt is required')
    }
    if (payload.part === 'part2') {
      if (!Array.isArray(payload.cueCardBullets) || payload.cueCardBullets.length < 2) {
        errors.push('Speaking Part 2 requires cueCardBullets with at least 2 points')
      }
      if (typeof payload.preparationTimeSeconds !== 'number' || payload.preparationTimeSeconds < 30) {
        errors.push('Speaking Part 2 requires preparationTimeSeconds >= 30')
      }
      if (typeof payload.speakingTimeSeconds !== 'number' || payload.speakingTimeSeconds < 60) {
        errors.push('Speaking Part 2 requires speakingTimeSeconds >= 60')
      }
    }
    if (!Array.isArray(payload.targetSubskills) || payload.targetSubskills.length === 0) {
      errors.push('Speaking targetSubskills must be a non-empty array')
    }
    if (typeof payload.limitationsNotice !== 'string' || payload.limitationsNotice.trim() === '') {
      errors.push('Speaking limitationsNotice is required (disclosing evaluation bounds)')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates a batch of QuestionBankItems:
 * - Validates each item individually
 * - Enforces global item ID uniqueness
 * - Enforces question ID uniqueness across all passages/tasks
 * - Enforces equivalence consistency: questions sharing an equivalenceGroup MUST target the same objective!
 */
export function validateQuestionBankBatch(items: unknown[]): BatchValidationResult {
  if (!Array.isArray(items)) {
    return {
      isValid: false,
      itemErrors: {},
      globalErrors: ['Batch must be an array of items'],
      validCount: 0,
      totalCount: 0
    }
  }

  const itemErrors: Record<string, string[]> = {}
  const globalErrors: string[] = []
  const seenItemIds = new Map<string, number>()
  const seenQuestionIds = new Map<string, string>() // questionId -> itemId
  const equivalenceObjectiveMap = new Map<string, { objective: string; itemId: string }>() // equivalenceGroup -> { objective, itemId }

  let validCount = 0

  items.forEach((raw, idx) => {
    const fallbackId = `item-index-${idx}`
    const result = validateQuestionBankItem(raw)

    const item = (raw && typeof raw === 'object' ? raw : {}) as Partial<QuestionBankItem>
    const itemId = item.id || fallbackId

    const currentItemErrors = [...result.errors]

    // Check duplicate item ID
    if (item.id) {
      if (seenItemIds.has(item.id)) {
        currentItemErrors.push(`Duplicate item id "${item.id}" (first seen at item index ${seenItemIds.get(item.id)})`)
      } else {
        seenItemIds.set(item.id, idx)
      }
    }

    // Check cross-item question IDs and equivalence consistency
    if (item.payload && typeof item.payload === 'object') {
      const questions = (item.payload as any).questions
      if (Array.isArray(questions)) {
        questions.forEach((q: any) => {
          if (q && typeof q === 'object' && typeof q.id === 'string' && q.id.trim() !== '') {
            if (seenQuestionIds.has(q.id)) {
              currentItemErrors.push(
                `Duplicate question id "${q.id}" already defined in item "${seenQuestionIds.get(q.id)}"`
              )
            } else {
              seenQuestionIds.set(q.id, itemId)
            }

            // Equivalence group check: must map to identical objective
            if (typeof q.equivalenceGroup === 'string' && q.equivalenceGroup.trim() !== '') {
              const eqGroup = q.equivalenceGroup.trim()
              const existing = equivalenceObjectiveMap.get(eqGroup)
              if (existing) {
                if (existing.objective !== q.objective) {
                  currentItemErrors.push(
                    `Equivalence group "${eqGroup}" has conflicting objectives: "${existing.objective}" (in item "${existing.itemId}") vs "${q.objective}" (in this item)`
                  )
                }
              } else {
                equivalenceObjectiveMap.set(eqGroup, { objective: q.objective, itemId })
              }
            }
          }
        })
      }
    }

    if (currentItemErrors.length > 0) {
      itemErrors[itemId] = currentItemErrors
    } else {
      validCount++
    }
  })

  return {
    isValid: Object.keys(itemErrors).length === 0 && globalErrors.length === 0,
    itemErrors,
    globalErrors,
    validCount,
    totalCount: items.length
  }
}

/**
 * Transitions the status of a QuestionBankItem following state machine rules.
 * Enforces that items cannot become 'approved' unless they pass validation!
 */
export function transitionContentStatus(
  item: QuestionBankItem,
  nextStatus: ContentStatus,
  reviewerInfo?: { reviewer: string; notes?: string }
): { success: boolean; item?: QuestionBankItem; error?: string } {
  if (!isValidContentStatusTransition(item.status, nextStatus)) {
    return {
      success: false,
      error: `Invalid transition from "${item.status}" to "${nextStatus}"`
    }
  }

  // Pre-approval gate: item must be valid before it can be approved
  if (nextStatus === 'approved') {
    const candidate: QuestionBankItem = {
      ...item,
      status: 'approved',
      updatedAt: new Date().toISOString()
    }
    const validation = validateQuestionBankItem(candidate)
    if (!validation.isValid) {
      return {
        success: false,
        error: `Cannot approve invalid item: ${validation.errors.join('; ')}`
      }
    }
  }

  const updatedItem: QuestionBankItem = {
    ...item,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
    reviewedBy: reviewerInfo?.reviewer ?? item.reviewedBy,
    reviewNotes: reviewerInfo?.notes ?? item.reviewNotes
  }

  return {
    success: true,
    item: updatedItem
  }
}

/**
 * Learner-facing access layer:
 *
 * STRICT FAIL-CLOSED RULE:
 * Only approved, validated items are exposed to learners.
 * Items that are 'draft', 'needs_review', 'validated', or 'retired'
 * are NEVER returned in learner queries.
 * Any item with an invalid schema fails closed.
 */
export function getApprovedQuestionBankItems<T extends QuestionBankItem>(
  items: T[],
  filter?: QuestionBankFilter
): T[] {
  if (!Array.isArray(items)) return []

  return items.filter(item => {
    // 1. Must be explicitly approved
    if (item.status !== 'approved') return false

    // 2. Must pass schema validation (fail closed against corrupted/tampered data)
    const validation = validateQuestionBankItem(item)
    if (!validation.isValid) return false

    // 3. Apply optional filters
    if (filter) {
      if (filter.skill && item.skill !== filter.skill) return false
      if (filter.taskType && item.taskType.toLowerCase() !== filter.taskType.toLowerCase()) return false
      if (filter.topic && item.topic.toLowerCase() !== filter.topic.toLowerCase()) return false
      if (filter.difficulty && item.difficulty !== filter.difficulty) return false
      if (filter.objective && !item.objectives.some(o => o.toLowerCase() === filter.objective!.toLowerCase())) return false

      if (filter.searchTerm) {
        const term = filter.searchTerm.toLowerCase()
        const matchesTitle = item.title.toLowerCase().includes(term)
        const matchesTopic = item.topic.toLowerCase().includes(term)
        const matchesTaskType = item.taskType.toLowerCase().includes(term)
        if (!matchesTitle && !matchesTopic && !matchesTaskType) return false
      }
    }

    return true
  })
}
