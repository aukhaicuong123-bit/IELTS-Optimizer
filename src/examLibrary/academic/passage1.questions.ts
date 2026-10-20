import type { ExamQuestion } from '../types'

/** Academic Mock Test 1 - Passage 1 questions (1-13): TFNG (1-7) + MCQ (8-13). */
export const passage1Questions: ExamQuestion[] = [
  {
    id: 'acad-t1-p1-q1',
    number: 1,
    type: 'true-false-not-given',
    prompt: 'Temperatures inside built-up areas are consistently higher than in surrounding countryside.',
    answerKey: 'TRUE',
    explanation: 'The opening paragraph states this pattern has been revealed by measurements across three continents.',
    evidenceQuote: 'within built-up areas, temperatures run consistently higher than in the surrounding countryside',
    passageNumber: 1
  },
  {
    id: 'acad-t1-p1-q2',
    number: 2,
    type: 'true-false-not-given',
    prompt: 'The urban heat island was given its current name in the nineteenth century.',
    answerKey: 'FALSE',
    explanation: 'The nineteenth century saw the first systematic description; the name and modern study belong to the last forty years.',
    evidenceQuote: 'Only in the last forty years, however, did it acquire its current name, the urban heat island',
    passageNumber: 1
  },
  {
    id: 'acad-t1-p1-q3',
    number: 3,
    type: 'true-false-not-given',
    prompt: 'A park is always cooler than the residential block immediately beside it.',
    answerKey: 'FALSE',
    explanation: 'The text says the pattern is a patchwork and that a paved square in the sun can be warmer than a shaded low-rise block.',
    evidenceQuote: 'A park is cooler than the street beside it; a paved square in the sun can be several degrees warmer than a low-rise residential block shaded by trees',
    passageNumber: 1
  },
  {
    id: 'acad-t1-p1-q4',
    number: 4,
    type: 'true-false-not-given',
    prompt: 'Vegetated soil cools the surrounding environment by releasing water vapour.',
    answerKey: 'TRUE',
    explanation: 'This is the third mechanism, evapotranspiration.',
    evidenceQuote: 'Vegetated soil releases water vapour into the air as it warms, and this process cools the surrounding environment',
    passageNumber: 1
  },
  {
    id: 'acad-t1-p1-q5',
    number: 5,
    type: 'true-false-not-given',
    prompt: 'A single large office block can release as much heat as several hundred tonnes per day.',
    answerKey: 'TRUE',
    explanation: 'The fourth mechanism gives exactly this figure for a large office block in a hot climate.',
    evidenceQuote: 'can add to the surrounding air the equivalent of several hundred tonnes of heat per day',
    passageNumber: 1
  },
  {
    id: 'acad-t1-p1-q6',
    number: 6,
    type: 'true-false-not-given',
    prompt: 'The cooling effect of street trees is equally strong in all weather conditions.',
    answerKey: 'FALSE',
    explanation: 'The effect holds in dry weather and rain but weakens if the canopy is sparse or the planting is young.',
    evidenceQuote: 'the effect holds in dry weather and in the rain, though it weakens considerably if the tree canopy is sparse',
    passageNumber: 1
  },
  {
    id: 'acad-t1-p1-q7',
    number: 7,
    type: 'true-false-not-given',
    prompt: 'A government minister has announced a national plan to plant ten million trees.',
    answerKey: 'NOT GIVEN',
    explanation: 'The passage discusses advice to planners and general research findings, but names no specific government announcement or figure.',
    evidenceQuote: 'treat the temperature of a city as a matter of long-term planning rather than emergency response',
    passageNumber: 1
  },
  {
    id: 'acad-t1-p1-q8',
    number: 8,
    type: 'multiple-choice',
    prompt: 'Why does the writer say the name "urban heat island" is slightly misleading?',
    options: [
      'It suggests one dome of hot air, but the reality is a patchwork that varies street by street',
      'It is a term borrowed from a nineteenth-century German text and was never accurate',
      'It describes only the effect of waste heat and ignores the effect of dark surfaces',
      'It is used by meteorologists but has never been accepted by city planners'
    ],
    answerKey: 'It suggests one dome of hot air, but the reality is a patchwork that varies street by street',
    explanation: 'Paragraph 2 explains the name suggests a single dome of hot air, whereas the pattern is actually a patchwork.',
    evidenceQuote: 'it suggests a single dome of hot air sitting over a city. In reality the pattern is a patchwork',
    passageNumber: 1
  },
  {
    id: 'acad-t1-p1-q9',
    number: 9,
    type: 'multiple-choice',
    prompt: 'Which mechanism distinguishes a modern heat island from the warmth of a nineteenth-century city?',
    options: [
      'The reduced airflow between closely packed buildings',
      'The absorption of sunlight by asphalt and roofing tiles',
      'The waste heat released by human activity',
      'The reduction in evapotranspiration caused by paving'
    ],
    answerKey: 'The waste heat released by human activity',
    explanation: 'The fourth mechanism is described as the one that distinguishes a modern heat island from the smaller self-sustaining warmth of a nineteenth-century city.',
    evidenceQuote: 'This is the mechanism that distinguishes a modern heat island from the smaller, self-sustaining warmth of a nineteenth-century city',
    passageNumber: 1
  },
  {
    id: 'acad-t1-p1-q10',
    number: 10,
    type: 'multiple-choice',
    prompt: 'What does the passage say about the difference in temperature between shaded air and sun-heated surfaces?',
    options: [
      'It is usually about five degrees',
      'It can be twenty degrees or more',
      'It never exceeds ten degrees in dry weather',
      'It is greater in winter than in summer'
    ],
    answerKey: 'It can be twenty degrees or more',
    explanation: 'The first mechanism states that a shaded air temperature and a surface temperature can differ by twenty degrees or more.',
    evidenceQuote: 'a shaded air temperature and a surface temperature can differ by twenty degrees or more',
    passageNumber: 1
  },
  {
    id: 'acad-t1-p1-q11',
    number: 11,
    type: 'multiple-choice',
    prompt: 'According to the passage, the most effective interventions are those which',
    options: [
      'use reflective paint on the roofs of municipal buildings',
      'address the structure of the city rather than its surface',
      'install fountains and shaded areas in public squares',
      'increase the number of trees planted in public parks'
    ],
    answerKey: 'address the structure of the city rather than its surface',
    explanation: 'The writer says the most effective interventions address the structure of the city itself rather than the surface of it.',
    evidenceQuote: 'the most effective interventions are those which address the structure of the city itself rather than the surface of it',
    passageNumber: 1
  },
  {
    id: 'acad-t1-p1-q12',
    number: 12,
    type: 'multiple-choice',
    prompt: 'Which statement about the relative city-countryside temperature difference does the writer support?',
    options: [
      'It has increased in every city as farmland has been built on',
      'It is shrinking in some cities as surrounding farmland is developed',
      'It remains identical in all cities regardless of development',
      'It has been measured only in European cities'
    ],
    answerKey: 'It is shrinking in some cities as surrounding farmland is developed',
    explanation: 'The cautious group of researchers notes the relative difference has been shrinking in some cities as surrounding farmland has been replaced by development.',
    evidenceQuote: 'the relative difference between city and countryside has been shrinking in some cities as surrounding farmland has been replaced by development',
    passageNumber: 1
  },
  {
    id: 'acad-t1-p1-q13',
    number: 13,
    type: 'multiple-choice',
    prompt: 'Which group does the World Health Organization identify as most at risk from heat exposure?',
    options: [
      'Children who play outdoors during school holidays',
      'Elderly people, those with chronic conditions and people in poorly insulated housing',
      'Commuters who travel through the commercial district at midday',
      'Visitors from cooler countries during the summer season'
    ],
    answerKey: 'Elderly people, those with chronic conditions and people in poorly insulated housing',
    explanation: 'The passage lists exactly these three groups as carrying the highest risk.',
    evidenceQuote: 'the risk is highest among elderly people, those with chronic conditions, and people who live in poorly insulated housing',
    passageNumber: 1
  }
]
