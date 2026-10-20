import type { ExamQuestion } from '../types'

/** Academic Mock Test 1 — Listening Section 3 questions (21-30): gap fill + multiple choice. */
export const academicTest1ListeningSection3Questions: ExamQuestion[] = [
  {
    id: 'acad-t1-l-s3-q21',
    number: 21,
    type: 'sentence-completion',
    prompt: 'Complete the notes about the project site.',
    promptDetail: 'The original site behind the old petrol station is no longer available because of plans for ______ residential blocks.',
    answerKey: 'three',
    explanation: 'Marcus says the council has planning permission for three residential blocks on the site.',
    evidenceQuote: 'the council has planning permission for three residential blocks on it',
    sectionNumber: 3
  },
  {
    id: 'acad-t1-l-s3-q22',
    number: 22,
    type: 'sentence-completion',
    prompt: 'Complete the notes about the project site.',
    promptDetail: 'The new site is next to the allotment on ______ Road.',
    answerKey: 'Fenner',
    explanation: 'Marcus describes land next to the allotment on Fenner Road.',
    evidenceQuote: 'There\'s a piece of land next to the allotment on Fenner Road',
    sectionNumber: 3
  },
  {
    id: 'acad-t1-l-s3-q23',
    number: 23,
    type: 'sentence-completion',
    prompt: 'Complete the notes about the project budget.',
    promptDetail: 'The parish council has granted ______ pounds.',
    answerKey: '2,000',
    explanation: 'Marcus says they have two thousand from the parish council.',
    evidenceQuote: 'Two thousand from the parish council',
    sectionNumber: 3
  },
  {
    id: 'acad-t1-l-s3-q24',
    number: 24,
    type: 'sentence-completion',
    prompt: 'Complete the notes about the project budget.',
    promptDetail: 'The university will contribute towards ______ but not labour.',
    answerKey: 'materials',
    explanation: 'Marcus says the university will contribute towards materials but not labour.',
    evidenceQuote: 'The university has said they\'d contribute towards materials but not labour',
    sectionNumber: 3
  },
  {
    id: 'acad-t1-l-s3-q25',
    number: 25,
    type: 'sentence-completion',
    prompt: 'Complete the notes about raised beds.',
    promptDetail: 'Three cedar raised beds would cost ______ pounds including delivery.',
    answerKey: '540',
    explanation: 'Three beds at about a hundred and eighty each come to five hundred and forty.',
    evidenceQuote: 'Three of them, cedar, about a hundred and eighty each including delivery. So five hundred and forty',
    sectionNumber: 3
  },
  {
    id: 'acad-t1-l-s3-q26',
    number: 26,
    type: 'multiple-choice',
    prompt: 'Why does Marcus reject the idea of using only two raised beds?',
    options: [
      'Two beds would not fit on the available area of land',
      'Two beds would only allow six volunteers, rather than the twelve promised in the proposal',
      'The council permits a maximum of three beds on an allotment',
      'Two beds would cost more per bed than three'
    ],
    answerKey: 'Two beds would only allow six volunteers, rather than the twelve promised in the proposal',
    explanation: 'He explains that the proposal promises twelve weekly volunteer sessions, and twelve people need three beds so that people can rotate.',
    evidenceQuote: 'we said in the proposal we\'d run twelve weekly volunteer sessions, and with twelve people you need three beds',
    sectionNumber: 3
  },
  {
    id: 'acad-t1-l-s3-q27',
    number: 27,
    type: 'multiple-choice',
    prompt: 'What does Marcus say about the council sign?',
    options: [
      'It is unnecessary because the plot is already registered with the society',
      'It costs thirty pounds and is required regardless of the design chosen',
      'It must be replaced by a larger sign if the project expands',
      'It can be paid for from the parish council grant directly'
    ],
    answerKey: 'It costs thirty pounds and is required regardless of the design chosen',
    explanation: 'The council insists on a sign on allotment plots at about thirty pounds, and Marcus confirms it applies whichever option they choose.',
    evidenceQuote: 'The council actually insists you have a sign on allotment plots, which is about thirty pounds',
    sectionNumber: 3
  },

  {
    id: 'acad-t1-l-s3-q28',
    number: 28,
    type: 'multiple-choice',
    prompt: 'What is Marcus\'s main argument in favour of using the ground directly?',
    options: [
      'It costs significantly less than raised beds',
      'It avoids the drainage problems in the lower corner of the plot',
      'It requires less maintenance over time because there is nothing to rot or replace',
      'It allows the plot to be used more intensively'
    ],
    answerKey: 'It requires less maintenance over time because there is nothing to rot or replace',
    explanation: 'He says the real argument is not the money but maintenance: raised beds rot and must be rebuilt, whereas improved ground keeps improving.',
    evidenceQuote: 'the real argument isn\'t the money. It\'s the maintenance. Raised beds rot',
    sectionNumber: 3
  },
  {
    id: 'acad-t1-l-s3-q29',
    number: 29,
    type: 'multiple-choice',
    prompt: 'How does Marcus suggest the difference in cost should be spent?',
    options: [
      'On a larger water butt and a rainwater collection system from the shed roof',
      'On replacing the existing shed with a larger building',
      'On buying a second-hand rotavator for the volunteers',
      'On a larger number of raised beds than originally planned'
    ],
    answerKey: 'On a larger water butt and a rainwater collection system from the shed roof',
    explanation: 'He proposes spending about forty pounds on a bigger water butt and thirty-odd on a rainwater collection system from the shed roof.',
    evidenceQuote: 'spend about forty pounds on a water butt ... and then another thirty-odd on a rainwater collection system from the shed roof',
    sectionNumber: 3
  },
  {
    id: 'acad-t1-l-s3-q30',
    number: 30,
    type: 'multiple-choice',
    prompt: 'What does Marcus say about the remaining surplus in the budget?',
    options: [
      'It should be returned to the community fund, with the workshop already planned',
      'It should be used to increase the number of volunteer sessions',
      'It should be saved in case the allotment fee rises in the following year',
      'It should be spent on a second water butt before the project begins'
    ],
    answerKey: 'It should be returned to the community fund, with the workshop already planned',
    explanation: 'He proposes returning the surplus to the community fund, noting that a reviewer is more suspicious of a budget with no slack.',
    evidenceQuote: 'We say we\'re returning the surplus to the community fund and that we\'ve planned the workshop',
    sectionNumber: 3
  }
]
