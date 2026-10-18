/* ============================================================================
 * QUESTION BANK — Data Contracts & Quality Validation (Phase 1)
 * IELTS Optimizer
 *
 * Versioned contracts for learner-facing question items. This module is
 * deliberately decoupled from localStorage / persistence so a database can
 * be added later without changing these types or validators.
 *
 * Rules:
 *  - Only items with status === 'approved' may be exposed to learners.
 *  - Invalid items fail closed (validation returns errors, never silently pass).
 *  - Seed data is original, 1–2 items per IELTS skill, documented reuse.
 * ========================================================================== */

import type { Skill } from './types'

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type QuestionStatus = 'draft' | 'needs_review' | 'validated' | 'approved' | 'retired'

export type QuestionSource = {
  author?: string
  license?: 'original' | 'cc-by' | 'cc-by-sa' | 'public-domain' | 'other'
  url?: string
  note?: string
}

export type QuestionTaskType =
  | 'multiple-choice'
  | 'true-false-not-given'
  | 'gap-fill'
  | 'essay'
  | 'cue-card'
  | 'short-answer'
  | 'matching'

export type QuestionDifficulty = 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export interface QuestionBankItem {
  id: string
  contentVersion: string
  status: QuestionStatus
  skill: Skill
  taskType: QuestionTaskType
  difficulty: QuestionDifficulty
  prompt: string
  options?: string[]
  answer?: string | string[]
  rubric?: string
  explanation?: string
  objective?: string
  equivalenceKey?: string
  topicId?: string
  source?: QuestionSource
  objectives?: string[]
  createdAt: string
  updatedAt: string
  generationMethod: 'human' | 'ai-assisted' | 'ai-generated'
}
/**
 * Validate a single QuestionBankItem against the data contract.
 * `existingIds` is used to detect duplicate IDs within a batch.
 * Returns { valid: boolean, errors: string[] }.
 */
export function validateQuestionBankItem(
  item: QuestionBankItem,
  existingIds: string[] = [],
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Required scalar fields
  if (!item.id) errors.push('id is required')
  else if (existingIds.includes(item.id)) {
    errors.push(`duplicate id: ${item.id}`)
  }
  if (!item.contentVersion) errors.push('contentVersion is required')
  if (!item.status) errors.push('status is required')
  if (!item.skill) errors.push('skill is required')
  if (!item.taskType) errors.push('taskType is required')
  if (!item.difficulty) errors.push('difficulty is required')
  if (!item.prompt) errors.push('prompt is required')
  if (!item.createdAt) errors.push('createdAt is required')
  if (!item.updatedAt) errors.push('updatedAt is required')
  if (!item.generationMethod) errors.push('generationMethod is required')

  // Enum validation
  if (item.status && !VALID_STATUSES.includes(item.status)) {
    errors.push(`invalid status: ${item.status}`)
  }
  if (item.skill && !VALID_SKILLS.includes(item.skill)) {
    errors.push(`invalid skill: ${item.skill}`)
  }

  // Answer key / rubric validation by task type
  if (TYPES_REQUIRING_SINGLE_ANSWER.includes(item.taskType)) {
    if (!item.options || item.options.length < 2) {
      errors.push(`${item.taskType} requires at least 2 options`)
    }
    if (item.answer === undefined || item.answer === '') {
      errors.push(`${item.taskType} requires a single answer key`)
    }
    if (
      typeof item.answer === 'string' &&
      item.options &&
      !item.options.includes(item.answer)
    ) {
      errors.push(`answer key not found in options for item ${item.id}`)
    }
  }

  if (TYPES_REQUIRING_RUBRIC.includes(item.taskType)) {
    if (!item.rubric) {
      errors.push(`${item.taskType} requires a rubric`)
    }
  }

  // Equivalence metadata must be a string when present
  if (item.equivalenceKey !== undefined && typeof item.equivalenceKey !== 'string') {
    errors.push('equivalenceKey must be a string')
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Status transition guard. Drafts cannot jump straight to approved;
 * retired is terminal.
 */
export function canTransitionStatus(
  from: QuestionStatus,
  to: QuestionStatus,
): boolean {
  const allowed: Record<QuestionStatus, QuestionStatus[]> = {
    draft: ['needs_review', 'retired'],
    needs_review: ['validated', 'draft', 'retired'],
    validated: ['approved', 'needs_review', 'retired'],
    approved: ['retired', 'validated'],
    retired: [],
  }
  return allowed[from]?.includes(to) ?? false
}

/**
 * Learner-facing filter: only approved items are exposed.
 * Invalid or unreviewed items fail closed (are excluded).
 */
export function isApproved(item: QuestionBankItem): boolean {
  return item.status === 'approved'
}

export function filterApproved(items: QuestionBankItem[]): QuestionBankItem[] {
  return items.filter(isApproved)
}

const VALID_STATUSES: QuestionStatus[] = [
  'draft',
  'needs_review',
  'validated',
  'approved',
  'retired',
]

const VALID_SKILLS: Skill[] = [
  'Reading',
  'Listening',
  'Writing',
  'Speaking',
  'Vocabulary',
  'Grammar',
]

const TYPES_REQUIRING_SINGLE_ANSWER: QuestionTaskType[] = [
  'multiple-choice',
  'true-false-not-given',
]

const TYPES_REQUIRING_RUBRIC: QuestionTaskType[] = ['essay', 'cue-card']

/* ------------------------------------------------------------------ */
/* Seed data — original, 1–2 items per skill                          */
/* ------------------------------------------------------------------ */

export const QUESTION_BANK_SEED: QuestionBankItem[] = [
  // Reading — approved
  {
    id: 'qb-rd-001',
    contentVersion: '1.0.0',
    status: 'approved',
    skill: 'Reading',
    taskType: 'multiple-choice',
    difficulty: 'B2',
    prompt: 'What is the main benefit of urban gardens described in the passage?',
    options: [
      'They cool entire cities',
      'They provide local cooling and social benefits',
      'They eliminate all concrete',
      'They require no maintenance',
    ],
    answer: 'They provide local cooling and social benefits',
    explanation:
      'The passage states urban gardens offer local environmental and social benefits when planned well.',
    objective: 'Identify main idea',
    equivalenceKey: 'qb-rd-001:main-idea',
    topicId: 'environment',
    source: { author: 'IELTS Optimizer Team', license: 'original' },
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
    generationMethod: 'human',
  },
  // Reading — draft (intentionally unapproved, must be excluded from learner queries)
  {
    id: 'qb-rd-002',
    contentVersion: '1.0.0',
    status: 'draft',
    skill: 'Reading',
    taskType: 'true-false-not-given',
    difficulty: 'B1',
    prompt: 'Urban gardens can cool an entire city by themselves.',
    options: ['True', 'False', 'Not Given'],
    answer: 'False',
    explanation: 'Draft item pending review.',
    objective: 'Recognise explicit contradiction',
    equivalenceKey: 'qb-rd-002:contradiction',
    topicId: 'environment',
    source: { author: 'IELTS Optimizer Team', license: 'original' },
    createdAt: '2026-01-11T00:00:00Z',
    updatedAt: '2026-01-11T00:00:00Z',
    generationMethod: 'human',
  },
  // Listening — approved
  {
    id: 'qb-ls-001',
    contentVersion: '1.0.0',
    status: 'approved',
    skill: 'Listening',
    taskType: 'multiple-choice',
    difficulty: 'B2',
    prompt: 'What does the speaker recommend before bedtime?',
    options: [
      'Increase screen brightness',
      'Dim ambient fixtures two hours prior to sleep',
      'Stare at blue LED lamps',
      'Keep fluorescent bulbs on all night',
    ],
    answer: 'Dim ambient fixtures two hours prior to sleep',
    explanation: 'The speaker advises dimming ambient fixtures two hours before bed.',
    objective: 'Locate supporting detail',
    equivalenceKey: 'qb-ls-001:bedtime-light',
    topicId: 'health',
    source: { author: 'IELTS Optimizer Team', license: 'original' },
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
    generationMethod: 'human',
  },
  // Writing — approved
  {
    id: 'qb-wr-001',
    contentVersion: '1.0.0',
    status: 'approved',
    skill: 'Writing',
    taskType: 'essay',
    difficulty: 'B2',
    prompt:
      'Some people believe governments should tax junk food to reduce obesity. Discuss both views and give your opinion.',
    rubric:
      'Task response: addresses both views and gives clear opinion. Coherence: logical paragraphing. Lexical resource: varied vocabulary. Grammar: accurate structures.',
    explanation:
      'A band 7 response introduces the issue, discusses opposing views, and concludes with a reasoned opinion.',
    objective: 'Discussion & opinion essay',
    topicId: 'health',
    source: { author: 'IELTS Optimizer Team', license: 'original' },
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
    generationMethod: 'human',
  },
  // Speaking — approved
  {
    id: 'qb-sp-001',
    contentVersion: '1.0.0',
    status: 'approved',
    skill: 'Speaking',
    taskType: 'cue-card',
    difficulty: 'B1',
    prompt: 'Describe a healthy habit you recently adopted.',
    rubric:
      'Fluency: speak continuously for 1-2 minutes. Lexical resource: health-related vocabulary. Grammar: past and present tenses. Pronunciation: clear intonation.',
    explanation:
      'Candidates should describe what the habit is, why they started, and how it affects them.',
    objective: 'Part 2 cue card response',
    topicId: 'health',
    source: { author: 'IELTS Optimizer Team', license: 'original' },
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
    generationMethod: 'human',
  },
  // Vocabulary — approved
  {
    id: 'qb-vo-001',
    contentVersion: '1.0.0',
    status: 'approved',
    skill: 'Vocabulary',
    taskType: 'multiple-choice',
    difficulty: 'B2',
    prompt: 'Complete the collocation: "____ a deadline"',
    options: ['Do', 'Hit', 'Catch', 'Take'],
    answer: 'Hit',
    explanation: '“Hit a deadline” and “meet a deadline” are standard IELTS collocations.',
    objective: 'Collocation recognition',
    topicId: 'work',
    source: { author: 'IELTS Optimizer Team', license: 'original' },
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
    generationMethod: 'human',
  },
  // Grammar — approved
  {
    id: 'qb-gr-001',
    contentVersion: '1.0.0',
    status: 'approved',
    skill: 'Grammar',
    taskType: 'gap-fill',
    difficulty: 'B1',
    prompt: 'If she ______ harder, she would pass the exam.',
    options: ['studies', 'studied', 'will study', 'has studied'],
    answer: 'studied',
    explanation:
      'Second conditional uses past simple in the if-clause: “If she studied harder…”',
    objective: 'Second conditional',
    topicId: 'education',
    source: { author: 'IELTS Optimizer Team', license: 'original' },
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
    generationMethod: 'human',
  },
]