/**
 * IELTS Optimizer — Exam Library Schema
 *
 * Structural contracts for full 4-skill mock tests (Reading, Listening, Writing, Speaking).
 * Content lives in sibling modules; this file only defines the shape of the data.
 */

export type ExamModule = 'Academic' | 'General Training'

export type ExamQuestionType =
  | 'multiple-choice'
  | 'true-false-not-given'
  | 'yes-no-not-given'
  | 'sentence-completion'
  | 'summary-completion'
  | 'matching-headings'

/**
 * A question that can be answered by selecting from a bank of options.
 * `optionLabel` is the letter shown to the learner (A, B, C, ...).
 */
export interface ExamQuestion {
  id: string
  number: number // 1 to 40 within its paper
  type: ExamQuestionType
  prompt: string
  /**
   * Secondary prompt line. Used by `summary-completion` to hold the single
   * sentence containing the blank, and by any question needing a shared
   * instruction above the prompt itself.
   */
  promptDetail?: string
  options?: string[]
  /** For matching-headings: the shared bank of candidate headings for the passage. */
  optionLabel?: string
  answerKey: string
  explanation: string
  /** Verbatim snippet from the passage/transcript that proves the answer. */
  evidenceQuote: string
  passageNumber?: 1 | 2 | 3
  sectionNumber?: 1 | 2 | 3 | 4
}

export interface ExamHeadingBankItem {
  /** Roman-numeral label shown to the learner, e.g. "vi". */
  label: string
  text: string
}

export interface ExamPassage {
  passageNumber: 1 | 2 | 3
  title: string
  wordCount: number
  text: string
  questions: ExamQuestion[]
  /**
   * Shared heading bank for `matching-headings` questions in this passage.
   * Each question in the group references an entry by its `label`.
   */
  headingBank?: ExamHeadingBankItem[]
}

export interface FullReadingPaper {
  id: string
  title: string
  timeAllowedMinutes: 60
  totalQuestions: 40
  passages: ExamPassage[]
}

export interface FullListeningSection {
  sectionNumber: 1 | 2 | 3 | 4
  title: string
  context: string
  transcript: string
  questions: ExamQuestion[]
}

export interface FullListeningPaper {
  id: string
  title: string
  timeAllowedMinutes: 30
  totalQuestions: 40
  sections: FullListeningSection[]
}

export interface FullWritingPaper {
  id: string
  title: string
  timeAllowedMinutes: 60
  task1: {
    title: string
    prompt: string
    type: 'academic_task1' | 'general_task1'
    stimulusType: 'chart' | 'diagram' | 'table' | 'letter'
    stimulusDescription: string
    minimumWords: 150
    modelAnswer?: string
  }
  task2: {
    title: string
    prompt: string
    minimumWords: 250
    modelAnswer?: string
  }
}

export interface FullSpeakingPaper {
  id: string
  title: string
  part1: {
    topic: string
    questions: string[]
    modelAnswers?: string[]
  }
  part2: {
    topic: string
    prompt: string
    cueCardBullets: string[]
    prepTimeSeconds: 60
    speakingTimeSeconds: 120
    modelAnswer?: string
  }
  part3: {
    topic: string
    questions: string[]
    modelAnswers?: string[]
  }
}

export interface FullIELTSExam {
  id: string
  code: string // e.g. "IELTS-ACTUAL-2026-VOL1-TEST1"
  title: string
  volume: string
  module: ExamModule
  difficulty: 'Standard Exam'
  completedCount: number
  averageBand: number
  reading: FullReadingPaper
  listening: FullListeningPaper
  writing: FullWritingPaper
  speaking: FullSpeakingPaper
}
