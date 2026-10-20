import type { ExamQuestion } from '../types'

/** Academic Mock Test 1 — Listening Section 4 questions (31-40): multiple choice + note completion. */
export const academicTest1ListeningSection4Questions: ExamQuestion[] = [
  {
    id: 'acad-t1-l-s4-q31',
    number: 31,
    type: 'multiple-choice',
    prompt: 'According to the lecturer, how should false positives and false negatives be regarded?',
    options: [
      'They can be eliminated by using more experienced radiologists',
      'They are unavoidable, and the question is their proportion and distribution',
      'They are acceptable only in screening programmes',
      'They indicate that the imaging equipment requires recalibration'
    ],
    answerKey: 'They are unavoidable, and the question is their proportion and distribution',
    explanation: 'The lecturer says the question is never whether a test makes mistakes, but what proportion it makes and how they are distributed.',
    evidenceQuote: 'The question is never whether a test makes mistakes; it is what proportion of mistakes it makes',
    sectionNumber: 4
  },
  {
    id: 'acad-t1-l-s4-q32',
    number: 32,
    type: 'multiple-choice',
    prompt: 'What does the lecturer say about a cautious radiologist and a relaxed one?',
    options: [
      'The cautious radiologist is always preferable',
      'The relaxed radiologist is always preferable',
      'Which is preferable depends on the prevalence of the condition and the consequences of each type of error',
      'The difference between them matters only for surgical cases'
    ],
    answerKey: 'Which is preferable depends on the prevalence of the condition and the consequences of each type of error',
    explanation: 'He says it depends entirely on what the disease is and what the consequence of missing it is.',
    evidenceQuote: 'It depends entirely on what the disease is and what the consequence of missing it is',
    sectionNumber: 4
  },
  {
    id: 'acad-t1-l-s4-q33',
    number: 33,
    type: 'multiple-choice',
    prompt: 'In the example given, if a condition affects one person in a thousand and a test is 95% accurate, how many of 1,000 people tested will receive a positive result?',
    options: [
      'About 5',
      'About 25',
      'About 50',
      'About 95'
    ],
    answerKey: 'About 50',
    explanation: 'The lecturer states that screening a thousand people yields roughly fifty positive results, of which only one is genuine.',
    evidenceQuote: 'if you screen a thousand people you will find roughly fifty positive results, and only one of those fifty will actually have the condition',
    sectionNumber: 4
  },
  {
    id: 'acad-t1-l-s4-q34',
    number: 34,
    type: 'multiple-choice',
    prompt: 'What is the base rate fallacy as described in the lecture?',
    options: [
      'The tendency to trust a test that is highly accurate overall even when the condition is rare',
      'The tendency to ignore the accuracy figures published for a test',
      'The tendency to diagnose the same condition repeatedly in one patient',
      'The tendency to apply tests to populations they were never validated in'
    ],
    answerKey: 'The tendency to trust a test that is highly accurate overall even when the condition is rare',
    explanation: 'He explains that accuracy is not the same as usefulness: a highly accurate test can be nearly useless if the condition is rare.',
    evidenceQuote: 'A test can be highly accurate overall and still be nearly useless in the population you are actually testing, if the thing you are testing for is rare',
    sectionNumber: 4
  },
  {
    id: 'acad-t1-l-s4-q35',
    number: 35,
    type: 'multiple-choice',
    prompt: 'Which three errors does the lecturer identify in early screening programmes?',
    options: [
      'Using technology validated on symptomatic patients, setting too permissive thresholds, and providing inadequate follow-up for false positives',
      'Using too many staff, setting thresholds too strictly, and providing excessive follow-up',
      'Relying on outdated equipment, ignoring false negatives, and under-training radiologists',
      'Funding programmes too early, publishing results too slowly, and confusing prevalence with accuracy'
    ],
    answerKey: 'Using technology validated on symptomatic patients, setting too permissive thresholds, and providing inadequate follow-up for false positives',
    explanation: 'He lists exactly these three mistakes in the lecture.',
    evidenceQuote: 'They adopted technologies validated on symptomatic patients ... They set thresholds for a positive result that were far too permissive ... And they did not provide adequate follow-up for the false positives',
    sectionNumber: 4
  },
  {
    id: 'acad-t1-l-s4-q36',
    number: 36,
    type: 'multiple-choice',
    prompt: 'What does the lecturer say happens when the threshold for a positive result is lowered?',
    options: [
      'True positives increase, but false positives increase faster',
      'False positives decrease while true positives stay the same',
      'Both true and false positives decrease proportionally',
      'True positives increase while the number of false positives is unaffected'
    ],
    answerKey: 'True positives increase, but false positives increase faster',
    explanation: 'He states that lowering the threshold always increases both, and the second usually increases faster.',
    evidenceQuote: 'you will always increase the number of true positives and the number of false positives, and the second usually increases faster',
    sectionNumber: 4
  },
  {
    id: 'acad-t1-l-s4-q37',
    number: 37,
    type: 'multiple-choice',
    prompt: 'Why did specificity fail to improve as detection capability improved?',
    options: [
      'Because the sensitivity of the new equipment was lower than expected',
      'Because the increase in sensitivity greatly increased the number of images humans had to read',
      'Because radiologists became less accurate as the technology improved',
      'Because the new modalities were unable to identify rare conditions'
    ],
    answerKey: 'Because the increase in sensitivity greatly increased the number of images humans had to read',
    explanation: 'He explains that greater sensitivity brought a huge increase in the number of images, and human readers have limited capacity to sustain attention.',
    evidenceQuote: 'the increase in sensitivity brought with it a huge increase in the number of images that a human being had to look at',
    sectionNumber: 4
  },
  {
    id: 'acad-t1-l-s4-q38',
    number: 38,
    type: 'multiple-choice',
    prompt: 'What did large multi-centre trials find about computer-assisted systems used as a second reader?',
    options: [
      'They significantly improved diagnostic accuracy over the radiologist alone',
      'They did not significantly improve diagnostic accuracy, but they helped with triage',
      'They replaced radiologists for routine screening in most hospitals',
      'They performed well only on scans of the chest'
    ],
    answerKey: 'They did not significantly improve diagnostic accuracy, but they helped with triage',
    explanation: 'The trials found no significant improvement in accuracy over the radiologist alone, while benefit was found in triage.',
    evidenceQuote: 'do not significantly improve diagnostic accuracy over the radiologist alone ... Where they have helped has generally been in triage',
    sectionNumber: 4
  },
  {
    id: 'acad-t1-l-s4-q39',
    number: 39,
    type: 'sentence-completion',
    prompt: 'Complete the notes on the limits of computer-assisted systems.',
    promptDetail:
      'The lecturer says the computer is poor at deciding whether a particular finding in a particular patient ______.',
    answerKey: 'matters',
    explanation: 'He contrasts the computer\'s strength at recognising examples with its weakness at judging whether a finding matters clinically.',
    evidenceQuote: 'It is poor at the thing the radiologist does, which is deciding whether this particular thing, in this particular patient, with this particular history, matters',
    sectionNumber: 4
  },
  {
    id: 'acad-t1-l-s4-q40',
    number: 40,
    type: 'sentence-completion',
    prompt: 'Complete the lecturer\'s summary of the lecture.',
    promptDetail:
      'He concludes that the ______ of the condition in the population being tested determines how useful a test is, however good the test itself is.',
    answerKey: 'prevalence',
    explanation: 'The summary states that prevalence in the population being tested determines usefulness regardless of test quality.',
    evidenceQuote: 'The prevalence of the condition in the population you are testing determines how useful your test is, regardless of how good the test is',
    sectionNumber: 4
  }
]
