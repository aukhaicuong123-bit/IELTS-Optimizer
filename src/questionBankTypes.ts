/**
 * IELTS Optimizer — Question Bank Data Contracts (Version 1)
 *
 * Designed to support all four IELTS skills (Reading, Listening, Writing, Speaking)
 * with strict provenance, lifecycle status management, and objective/equivalence tracking.
 */

export type IELTSSkill = 'Reading' | 'Listening' | 'Writing' | 'Speaking'

export type ContentStatus =
  | 'draft'
  | 'needs_review'
  | 'validated'
  | 'approved'
  | 'retired'

export type DifficultyBand =
  | 'foundation' // Band 4.0 - 5.0
  | 'intermediate' // Band 5.5 - 6.5
  | 'advanced' // Band 7.0 - 8.0
  | 'expert' // Band 8.5 - 9.0

export type ProvenanceType = 'original' | 'curated_public' | 'licensed'

export interface ContentProvenance {
  author: string
  organization?: string
  license: string // e.g., 'CC-BY-4.0', 'Original - IELTS Optimizer'
  provenanceType: ProvenanceType
  sourceReference?: string
}

// ==========================================
// Reading Skill Payload
// ==========================================

export type ReadingQuestionType =
  | 'multiple-choice'
  | 'true-false-not-given'
  | 'yes-no-not-given'
  | 'matching-headings'
  | 'summary-completion'
  | 'sentence-completion'

export interface ReadingQuestionItem {
  id: string
  type: ReadingQuestionType
  prompt: string
  options?: string[] // Required for multiple-choice
  answerKey: string | string[]
  explanation: string
  evidenceQuote: string // Must be a verbatim substring in passageText
  objective: string // e.g. 'reading:inference', 'reading:detail'
  equivalenceGroup?: string // For retesting with parallel non-identical questions
}

export interface ReadingQuestionBankPayload {
  passageTitle: string
  passageText: string
  passageWordCount?: number
  readingPassageNumber?: 1 | 2 | 3
  questions: ReadingQuestionItem[]
}

// ==========================================
// Listening Skill Payload
// ==========================================

export type ListeningQuestionType =
  | 'multiple-choice'
  | 'form-completion'
  | 'note-completion'
  | 'table-completion'
  | 'matching'

export interface ListeningQuestionItem {
  id: string
  type: ListeningQuestionType
  prompt: string
  options?: string[]
  answerKey: string | string[]
  explanation: string
  evidenceQuote: string // Must be a verbatim substring in transcript
  objective: string
  equivalenceGroup?: string
}

export interface ListeningQuestionBankPayload {
  audioPrompt: string
  transcript: string
  isSyntheticSpeech: boolean
  audioSection?: 1 | 2 | 3 | 4
  questions: ListeningQuestionItem[]
}

// ==========================================
// Writing Skill Payload
// ==========================================

export type WritingTaskType = 'academic_task1' | 'general_task1' | 'task2'

export interface WritingRubricCriteria {
  taskAchievementOrResponseCriteria: string
  coherenceAndCohesionCriteria: string
  lexicalResourceCriteria: string
  grammaticalRangeAndAccuracyCriteria: string
  bandGuidance?: Record<string, string>
}

export interface WritingQuestionBankPayload {
  prompt: string
  taskType: WritingTaskType
  minimumWordCount: number // 150 for Task 1, 250 for Task 2
  stimulusType?: 'chart' | 'graph' | 'table' | 'diagram' | 'letter_prompt' | 'essay_prompt'
  stimulusDescription?: string
  guidance?: string
  rubric: WritingRubricCriteria
  approachHints?: string[]
  modelAnswerOutline?: string[]
}

// ==========================================
// Speaking Skill Payload
// ==========================================

export type SpeakingPart = 'part1' | 'part2' | 'part3'

export interface SpeakingQuestionBankPayload {
  part: SpeakingPart
  topic: string
  mainPrompt: string
  cueCardBullets?: string[] // Required for Part 2
  followUpQuestions?: string[] // For Part 1 and Part 3
  preparationTimeSeconds?: number // 60 for Part 2
  speakingTimeSeconds?: number // 120 for Part 2
  targetSubskills: string[]
  limitationsNotice: string // Must disclose text vs audio evaluation bounds
}

// ==========================================
// Core Question Bank Item Entity
// ==========================================

export type QuestionBankPayload =
  | ReadingQuestionBankPayload
  | ListeningQuestionBankPayload
  | WritingQuestionBankPayload
  | SpeakingQuestionBankPayload

export interface QuestionBankItem<T extends QuestionBankPayload = QuestionBankPayload> {
  id: string
  schemaVersion: 1
  contentVersion: number
  skill: IELTSSkill
  taskType: string
  topic: string
  difficulty: DifficultyBand
  title: string
  instructions: string
  objectives: string[]
  status: ContentStatus
  source: ContentProvenance
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
  payload: T
  reviewedBy?: string
  reviewNotes?: string
}

export interface QuestionBankFilter {
  skill?: IELTSSkill
  taskType?: string
  topic?: string
  difficulty?: DifficultyBand
  searchTerm?: string
  objective?: string
}
