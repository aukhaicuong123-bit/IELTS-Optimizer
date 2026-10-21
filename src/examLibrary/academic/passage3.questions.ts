import type { ExamQuestion } from '../types'

/** Academic Mock Test 1 - Passage 3 questions (27-40): summary completion (27-32) + MCQ (33-40). */
export const passage3Questions: ExamQuestion[] = [
  {
    id: 'acad-t1-p3-q27',
    number: 27,
    type: 'summary-completion',
    prompt: 'Complete the summary of research on sleep.',
    promptDetail:
      'For most of human history, sleep was regarded as a daily ______ to activity rather than a physiological process worth studying.',
    answerKey: 'interruption',
    explanation: 'The opening paragraph calls sleep a daily interruption to activity.',
    evidenceQuote: 'a daily interruption to activity',
    passageNumber: 3
  },
  {
    id: 'acad-t1-p3-q28',
    number: 28,
    type: 'summary-completion',
    prompt: 'Complete the summary of research on sleep.',
    promptDetail:
      'The important discovery came from an ______ in laboratory routine: a researcher noticed that the brain waves of sleeping animals changed sharply and repeatedly.',
    answerKey: 'accident',
    explanation: 'The passage describes the discovery as coming from an accident of laboratory routine.',
    evidenceQuote: 'The discovery that transformed the field came from an accident of laboratory routine',
    passageNumber: 3
  },
  {
    id: 'acad-t1-p3-q29',
    number: 29,
    type: 'summary-completion',
    prompt: 'Complete the summary of research on sleep.',
    promptDetail:
      'Sleep is a sequence of distinct stages that alternate over the night, and the cycle is ______ across the night: early cycles contain more deep sleep, later ones more shallow, rapid-eye-movement sleep.',
    answerKey: 'uneven',
    explanation: 'The passage states the cycle is uneven across the night.',
    evidenceQuote: 'The cycle is also uneven across the night',
    passageNumber: 3
  },
  {
    id: 'acad-t1-p3-q30',
    number: 30,
    type: 'summary-completion',
    prompt: 'Complete the summary of research on sleep.',
    promptDetail:
      'The deep stage of sleep appears to serve a mainly ______ purpose, repairing tissue damage and raising the concentration of growth hormone.',
    answerKey: 'physical',
    explanation: 'The text says the function of the deep stage is now thought to be primarily physical.',
    evidenceQuote: 'The function of the deep stage is now thought to be primarily physical',
    passageNumber: 3
  },
  {
    id: 'acad-t1-p3-q31',
    number: 31,
    type: 'summary-completion',
    prompt: 'Complete the summary of research on sleep.',
    promptDetail:
      'The distinguishing feature of the rapid-eye-movement stage is not that dreams occur there, but that the sleeper is more likely to ______ and report them.',
    answerKey: 'wake',
    explanation: 'The passage says the rapid eye movement stage makes the sleeper more likely to wake and report dreams.',
    evidenceQuote: 'the sleeper is more likely to wake and report them',
    passageNumber: 3
  },
  {
    id: 'acad-t1-p3-q32',
    number: 32,
    type: 'summary-completion',
    prompt: 'Complete the summary of research on sleep.',
    promptDetail:
      'In experiments with restricted sleep, performance kept declining across the whole period and did not recover on the ______ night of normal sleep.',
    answerKey: 'first',
    explanation: 'The passage states performance did not recover on the first night of normal sleep.',
    evidenceQuote: 'did not recover on the first night of normal sleep',
    passageNumber: 3
  },
  {
    id: 'acad-t1-p3-q33',
    number: 33,
    type: 'multiple-choice',
    prompt: 'What was the significance of the brain-wave observation first noticed in the 1950s?',
    options: [
      'It showed that sleeping animals were completely inactive',
      'It showed that the sleeping brain was active and organised, not at rest',
      'It identified the hormone responsible for deep sleep',
      'It confirmed that dreams occur only in one stage of sleep'
    ],
    answerKey: 'It showed that the sleeping brain was active and organised, not at rest',
    explanation: 'The passage says it became clear the sleeping brain was not resting at all but doing something elaborate in a structured way.',
    evidenceQuote: 'it became clear that the sleeping brain was not resting at all. It was doing something elaborate',
    passageNumber: 3
  },
  {
    id: 'acad-t1-p3-q34',
    number: 34,
    type: 'multiple-choice',
    prompt: 'According to the passage, in what way do the early and later cycles of the night differ?',
    options: [
      'Early cycles contain more deep sleep and later cycles contain more rapid-eye-movement sleep',
      'Early cycles contain more rapid-eye-movement sleep and later cycles contain more deep sleep',
      'Each cycle contains the same proportion of every stage',
      'Only the first cycle of the night contains deep sleep'
    ],
    answerKey: 'Early cycles contain more deep sleep and later cycles contain more rapid-eye-movement sleep',
    explanation: 'The passage says the early cycles contain proportionally more of the deepest stage, while later cycles contain more of the shallower eye-movement stage.',
    evidenceQuote: 'The early cycles contain proportionally more of the deepest stage of sleep; later cycles contain proportionally more of the shallower stage in which the eyes move rapidly',
    passageNumber: 3
  },
  {
    id: 'acad-t1-p3-q35',
    number: 35,
    type: 'multiple-choice',
    prompt: 'Why does the writer say that the popular claim about dreams has been complicated?',
    options: [
      'Because dreams have now been found to occur only during deep sleep',
      'Because vivid dream reports can be recalled from deep sleep as well as from the eye-movement stage',
      'Because the brain is inactive during the eye-movement stage',
      'Because most people report no dreams at all'
    ],
    answerKey: 'Because vivid dream reports can be recalled from deep sleep as well as from the eye-movement stage',
    explanation: 'The passage notes a striking asymmetry: vivid dream reports can be recalled from almost any point in the night, including deep sleep.',
    evidenceQuote: 'Vivid reports of dreams can be recalled from almost any point in the night, including periods of deep sleep',
    passageNumber: 3
  },
  {
    id: 'acad-t1-p3-q36',
    number: 36,
    type: 'multiple-choice',
    prompt: 'What does the passage say about people who have been awake for a long time?',
    options: [
      'They usually overestimate how much their performance has declined',
      'They generally do not realise how much their performance has deteriorated',
      'They judge their performance accurately in most situations',
      'They are unable to judge performance at all'
    ],
    answerKey: 'They generally do not realise how much their performance has deteriorated',
    explanation: 'The passage says such people frequently do not perceive how badly their performance has deteriorated.',
    evidenceQuote: 'frequently do not perceive how badly their performance has deteriorated',
    passageNumber: 3
  },
  {
    id: 'acad-t1-p3-q37',
    number: 37,
    type: 'multiple-choice',
    prompt: 'How does the evidence on recovery from sleep restriction contrast with the traditional assumption in safety regulation?',
    options: [
      'Recovery is slower than the rate of loss, and one night of sleep does not undo several nights of restriction',
      'Recovery is faster than the rate of loss when a fixed rest period is taken',
      'Performance returns to baseline after a single good night of sleep',
      'The two are identical, since both proceed at the same rate'
    ],
    answerKey: 'Recovery is slower than the rate of loss, and one night of sleep does not undo several nights of restriction',
    explanation: 'The passage contrasts the traditional assumption of immediate restoration with evidence that recovery is slower than the loss.',
    evidenceQuote: 'recovery is slower than the loss is slow, and a single night of sleep does not undo the accumulated deficit',
    passageNumber: 3
  },
  {
    id: 'acad-t1-p3-q38',
    number: 38,
    type: 'multiple-choice',
    prompt: 'What is the main difference between the two accounts of why sleep might be needed?',
    options: [
      'One argues sleep consolidates memories; the other argues it maintains the systems that support waking cognition',
      'One argues sleep is unnecessary; the other argues it is essential',
      'One argues sleep has no function; the other argues it has only a physical function',
      'One argues sleep helps physical repair; the other argues it prevents dreams'
    ],
    answerKey: 'One argues sleep consolidates memories; the other argues it maintains the systems that support waking cognition',
    explanation: 'The passage sets the memory-consolidation account against the metabolic and immunological maintenance account.',
    evidenceQuote: 'The alternative account, that sleep serves primarily to maintain the metabolic and immunological systems that support wakeful cognition',
    passageNumber: 3
  },
  {
    id: 'acad-t1-p3-q39',
    number: 39,
    type: 'multiple-choice',
    prompt: 'Why does the writer describe the evidence for memory consolidation as strong at one level but weak at another?',
    options: [
      'Because correlations between sleep and memory are clear, but the underlying mechanism remains unresolved',
      'Because experimental data are plentiful but contradictory',
      'Because animal studies and human studies give opposite results',
      'Because the effect has only ever been studied in laboratory animals'
    ],
    answerKey: 'Because correlations between sleep and memory are clear, but the underlying mechanism remains unresolved',
    explanation: 'The passage says the evidence is substantial at the level of correlation and less substantial at the level of mechanism.',
    evidenceQuote: 'substantial at the level of correlation',
    passageNumber: 3
  },
  {
    id: 'acad-t1-p3-q40',
    number: 40,
    type: 'multiple-choice',
    prompt: 'Which statement best captures the writer\'s overall conclusion about sleep?',
    options: [
      'Sleep remains a poorly understood process with no firm scientific basis',
      'Whatever the function of sleep, the brain does none of it passively',
      'The main purpose of sleep has now been established by experiment',
      'Dreams are the central purpose of sleep and are well documented'
    ],
    answerKey: 'Whatever the function of sleep, the brain does none of it passively',
    explanation: 'The final sentence states that whatever sleep is for, the brain does none of it in an idle fashion.',
    evidenceQuote: 'whatever sleep is for, the brain does none of it in an idle fashion',
    passageNumber: 3
  },
]
