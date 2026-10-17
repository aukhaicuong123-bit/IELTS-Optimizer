import type { TopicId } from './topicData'

/* ============================================================================
 * PRACTICE BANK — IELTS Optimizer
 * A large bank of representative IELTS-style exercises organised by skill.
 * Items are rotated deterministically by date so learners get fresh practice
 * every day without running out. Extend any array to add more exercises.
 * ========================================================================== */

/* ---------- Shared types ---------- */

export type ReadingDrill = {
  id: string
  topicId: TopicId
  level: 'B2' | 'B2/C1' | 'C1'
  minutes: number
  title: string
  text: string
  questions: {
    id: string
    type: 'multiple-choice' | 'true-false-not-given'
    prompt: string
    options: string[]
    answer: string
    explanation: string
    objective: string
  }[]
}

export type ListeningDrill = {
  id: string
  topicId: TopicId
  level: string
  minutes: number
  title: string
  audioText: string
  questions: {
    id: string
    prompt: string
    options: string[]
    answer: string
    explanation: string
  }[]
}

export type WritingDrill = {
  id: string
  topicId: TopicId
  task: 'Task 1' | 'Task 2'
  minutes: number
  title: string
  prompt: string
  structure: string[]
  keyPhrases: string[]
  commonMistakes: string[]
}

export type SpeakingDrill = {
  id: string
  topicId: TopicId
  part: 'Part 1' | 'Part 2' | 'Part 3'
  minutes: number
  topic: string
  questions: string[]
  tips: string[]
}

export type GrammarDrill = {
  id: string
  category: string
  level: string
  sentence: string
  blankIndex: number
  options: string[]
  answer: string
  explanation: string
}

/* ---------- READING drills ---------- */

export const READING_DRILLS: ReadingDrill[] = [
  {
    id: 'rd-01',
    topicId: 'environment',
    level: 'B2/C1',
    minutes: 10,
    title: 'The return of the beaver',
    text: `Beavers, once hunted to extinction across much of Europe, are being reintroduced in several countries. The animals build dams that slow rivers, raise water tables and create wetlands. These wetlands filter pollutants, store carbon and support species ranging from dragonflies to water voles.\n\nFarmers are not always convinced. Slow-moving water can flood fields, and beaver dams sometimes block drainage ditches. However, a Scottish study found that managed beaver sites reduced downstream flooding by holding water higher in the catchment. Ecologists argue that well-planned reintroductions, combined with simple flow-control devices, deliver more benefits than costs.`,
    questions: [
      {
        id: 'rd-01-q1',
        type: 'multiple-choice',
        prompt: "What is the writer's main purpose in the passage?",
        options: ['To argue that beavers should be reintroduced everywhere immediately', 'To present the ecological benefits and challenges of beaver reintroduction', 'To explain how beavers build dams in detail', 'To compare beaver populations across European countries'],
        answer: 'To present the ecological benefits and challenges of beaver reintroduction',
        explanation: 'The passage balances ecological gains with farmer concerns and ends with a measured conclusion.',
        objective: 'Identify writer purpose'
      },
      {
        id: 'rd-01-q2',
        type: 'true-false-not-given',
        prompt: 'Beaver dams increase the risk of flooding downstream.',
        options: ['True', 'False', 'Not Given'],
        answer: 'False',
        explanation: 'The Scottish study found beaver sites reduced downstream flooding by holding water higher in the catchment.',
        objective: 'Distinguish explicit contradiction'
      },
      {
        id: 'rd-01-q3',
        type: 'multiple-choice',
        prompt: "Which phrase best describes the writer's attitude towards beaver reintroduction?",
        options: ['Enthusiastically supportive', 'Cautiously positive', 'Strongly opposed', 'Completely neutral'],
        answer: 'Cautiously positive',
        explanation: 'The writer acknowledges drawbacks but concludes that benefits outweigh costs when well managed.',
        objective: "Identify the writer's attitude"
      }
    ]
  },
  {
    id: 'rd-02',
    topicId: 'technology',
    level: 'B2/C1',
    minutes: 10,
    title: 'Why some cities refuse smart sensors',
    text: `Smart city projects promise traffic sensors, air-quality monitors and responsive streetlights. Yet several European cities have paused or cancelled deployments after public consultation.\n\nPrivacy is the most frequently cited concern. Residents worry that sensors collecting movement data could be repurposed for policing or advertising. Technical issues compound the problem: many sensor networks rely on proprietary platforms, making long-term maintenance expensive.\n\nPlanners now favour 'minimum viable sensing' — deploying only the sensors that solve a documented problem and deleting data as soon as it has been analysed. Early evidence suggests this narrower approach is cheaper to maintain and meets less resistance.`,
    questions: [
      {
        id: 'rd-02-q1',
        type: 'multiple-choice',
        prompt: 'Why have some cities paused smart sensor projects?',
        options: ['The sensors were too expensive to build', 'Public concern about privacy and maintenance costs', 'The technology never worked at all', 'Governments banned all surveillance equipment'],
        answer: 'Public concern about privacy and maintenance costs',
        explanation: 'The passage cites privacy fears and proprietary platform costs as the two main reasons.',
        objective: 'Locate supporting detail'
      },
      {
        id: 'rd-02-q2',
        type: 'true-false-not-given',
        prompt: '"Minimum viable sensing" has been more expensive than full deployment.',
        options: ['True', 'False', 'Not Given'],
        answer: 'False',
        explanation: 'The passage states this narrower approach is cheaper to maintain.',
        objective: 'Distinguish explicit contradiction'
      }
    ]
  },
  {
    id: 'rd-03',
    topicId: 'education',
    level: 'B2',
    minutes: 9,
    title: 'Homework debate revisited',
    text: `The value of homework has been debated for over a century. A recent meta-analysis of 80 years of studies found a modest positive correlation between homework and achievement in secondary school, but almost no benefit for primary pupils.\n\nCritics argue that homework widens inequality: students with quiet rooms, educated parents and reliable internet benefit more than those without. Supporters counter that well-designed tasks — short, practical and clearly linked to classroom work — build independent study habits.\n\nMost researchers now agree the quantity matters less than the quality. A single, meaningful task may outperform hours of repetitive worksheets.`,
    questions: [
      {
        id: 'rd-03-q1',
        type: 'multiple-choice',
        prompt: 'What does the meta-analysis suggest?',
        options: ['Homework helps all students equally at every age', 'Homework helps secondary students modestly but not primary students', 'Homework has no effect on achievement', 'Homework is harmful to all students'],
        answer: 'Homework helps secondary students modestly but not primary students',
        explanation: 'The text states a modest positive correlation in secondary school but almost no benefit for primary pupils.',
        objective: 'Interpret research findings'
      },
      {
        id: 'rd-03-q2',
        type: 'true-false-not-given',
        prompt: 'The passage claims homework is the main cause of educational inequality.',
        options: ['True', 'False', 'Not Given'],
        answer: 'False',
        explanation: 'Critics argue homework widens inequality, but the passage does not call it the main cause.',
        objective: 'Distinguish nuance from exaggeration'
      }
    ]
  },
  {
    id: 'rd-04',
    topicId: 'health',
    level: 'B2/C1',
    minutes: 10,
    title: 'The truth about hydration',
    text: `The popular advice to drink two litres of water a day has little scientific basis. Historically the figure derived from a misreading of a mid-century nutrition report, which actually included water from food.\n\nResearchers now say hydration needs vary with body size, climate and activity. For most people, drinking when thirsty and consuming water-rich foods is sufficient. Over-hydration, though rare, is dangerous: it can dilute blood sodium to life-threatening levels.\n\nAthletes training in heat still need careful fluid planning, but for office workers the emphasis has shifted from quantity to listening to the body's signals.`,
    questions: [
      {
        id: 'rd-04-q1',
        type: 'multiple-choice',
        prompt: 'Where did the two-litre recommendation originally come from?',
        options: ['A modern sports science study', 'A misreading of a mid-century nutrition report', 'Government health guidelines worldwide', 'Ancient medical texts'],
        answer: 'A misreading of a mid-century nutrition report',
        explanation: 'The passage says the figure derived from a misreading, and the report actually included water from food.',
        objective: 'Trace origin of a claim'
      },
      {
        id: 'rd-04-q2',
        type: 'true-false-not-given',
        prompt: 'Drinking too much water can be harmful.',
        options: ['True', 'False', 'Not Given'],
        answer: 'True',
        explanation: 'The text states over-hydration can dilute blood sodium to life-threatening levels.',
        objective: 'Identify explicit statement'
      }
    ]
  },
  {
    id: 'rd-05',
    topicId: 'work',
    level: 'B2/C1',
    minutes: 10,
    title: 'Four-day week trials',
    text: `Between 2022 and 2024, hundreds of companies across Europe and North America trialled a four-day working week with no cut in pay. Results from the largest coordinated trial showed revenue held steady or rose at most participating firms, and sick days fell.\n\nNot every industry can adapt equally. Hospitals, factories and shops cannot simply close for an extra day. Some trials in these sectors instead used rotating shifts, which produced smaller gains.\n\nCritics note that trials are self-selecting: companies that volunteer may already be well managed. Nonetheless, the data has pushed the four-day week from fringe idea to serious policy discussion.`,
    questions: [
      {
        id: 'rd-05-q1',
        type: 'multiple-choice',
        prompt: 'What limitation of the trials does the writer highlight?',
        options: ['Companies were forced to participate', 'Volunteering companies may already be well managed', 'Revenue always fell during the trials', 'Sick days increased significantly'],
        answer: 'Volunteering companies may already be well managed',
        explanation: 'The writer notes the trials are self-selecting, which limits how far results generalise.',
        objective: 'Identify writer criticism'
      },
      {
        id: 'rd-05-q2',
        type: 'true-false-not-given',
        prompt: 'Hospitals and factories participated in the four-day week trials without any changes.',
        options: ['True', 'False', 'Not Given'],
        answer: 'False',
        explanation: 'These sectors used rotating shifts and produced smaller gains, not unchanged schedules.',
        objective: 'Distinguish explicit contradiction'
      }
    ]
  }
]

export type VocabDrill = {
  id: string
  topicId: TopicId
  type: 'definition' | 'collocation' | 'synonym'
  prompt: string
  options: string[]
  answer: string
  note: string
}

/* ---------- LISTENING drills ---------- */

export const LISTENING_DRILLS: ListeningDrill[] = [
  {
    id: 'ld-01',
    topicId: 'education',
    level: 'Band 6.5',
    minutes: 4,
    title: 'University library orientation',
    audioText: `Welcome to the Westbridge University library. Before you begin, please note that your student card doubles as your borrowing card. Undergraduates may borrow up to eight items for two weeks each. Postgraduates may borrow twelve items for four weeks. Renewals can be done online unless another student has requested the item. The group study rooms on level two must be booked at least twenty-four hours in advance through the library app. Silent study areas are on levels three and four — please keep phones on silent. The help desk on the ground floor opens from eight in the morning until eight in the evening during term.`,
    questions: [
      { id: 'ld-01-q1', prompt: 'How many items can an undergraduate borrow at one time?', options: ['Four', 'Eight', 'Twelve', 'Unlimited'], answer: 'Eight', explanation: 'The speaker states undergraduates may borrow up to eight items.' },
      { id: 'ld-01-q2', prompt: 'How far in advance must group study rooms be booked?', options: ['One hour', 'Twelve hours', 'Twenty-four hours', 'One week'], answer: 'Twenty-four hours', explanation: 'The speaker says rooms must be booked at least twenty-four hours in advance.' },
      { id: 'ld-01-q3', prompt: 'When does the help desk close during term?', options: ['Six pm', 'Eight pm', 'Ten pm', 'Midnight'], answer: 'Eight pm', explanation: 'The help desk opens from eight am until eight pm during term.' }
    ]
  },
  {
    id: 'ld-02',
    topicId: 'work',
    level: 'Band 7.0',
    minutes: 4,
    title: 'Company restructuring announcement',
    audioText: `Good morning everyone. I want to update you on the restructuring we discussed last quarter. After careful review, leadership has decided to merge the marketing and communications teams into a single division effective from October. No redundancies are planned — all current roles will be retained, though some job titles will change. Sarah Chen will lead the combined division as Director of Brand and Communications. Monthly all-hands meetings will continue, but shift to the first Wednesday instead of the first Friday. If you have questions, please send them to the HR portal by the end of this week so we can address them in the next briefing.`,
    questions: [
      { id: 'ld-02-q1', prompt: 'Which teams are being merged?', options: ['Sales and marketing', 'Marketing and communications', 'Communications and HR', 'Sales and communications'], answer: 'Marketing and communications', explanation: 'The speaker announces marketing and communications will merge into one division.' },
      { id: 'ld-02-q2', prompt: 'What will happen to current employees?', options: ['Some will be made redundant', 'All roles will be retained', 'Everyone must reapply', 'Only managers stay'], answer: 'All roles will be retained', explanation: 'The speaker explicitly says no redundancies are planned and all roles will be retained.' },
      { id: 'ld-02-q3', prompt: 'When will the all-hands meetings now be held?', options: ['First Tuesday', 'First Wednesday', 'First Friday', 'Last Wednesday'], answer: 'First Wednesday', explanation: 'Meetings shift from the first Friday to the first Wednesday.' }
    ]
  },
  {
    id: 'ld-03',
    topicId: 'environment',
    level: 'Band 6.5',
    minutes: 4,
    title: 'Recycling scheme briefing',
    audioText: `From next month, the council is expanding kerbside recycling. In addition to paper, cardboard and plastics, residents can now leave glass bottles and tins in the same bin. Please rinse containers before recycling — food residue can contaminate an entire load. Compostable bags are accepted for garden waste, but ordinary plastic bags are not. Collections move from fortnightly to weekly for general waste, while recycling remains fortnightly. Residents who need larger bins can request one through the council website, and there is no extra charge for the first year.`,
    questions: [
      { id: 'ld-03-q1', prompt: 'What new materials can residents recycle?', options: ['Only paper', 'Glass bottles and tins', 'Food waste', 'Electronics'], answer: 'Glass bottles and tins', explanation: 'The speaker says glass bottles and tins are now accepted in addition to existing materials.' },
      { id: 'ld-03-q2', prompt: 'Why should containers be rinsed?', options: ['To reduce noise', 'Food residue can contaminate a load', 'To make bins lighter', 'Council regulations require it'], answer: 'Food residue can contaminate a load', explanation: 'Rinsing is requested because food residue can contaminate an entire load.' },
      { id: 'ld-03-q3', prompt: 'How often will general waste now be collected?', options: ['Weekly', 'Fortnightly', 'Monthly', 'Twice weekly'], answer: 'Weekly', explanation: 'General waste collections move to weekly, while recycling stays fortnightly.' }
    ]
  },
  {
    id: 'ld-04',
    topicId: 'health',
    level: 'Band 7.0',
    minutes: 4,
    title: 'Sleep research talk',
    audioText: `Today I'll share findings from our three-year sleep study. We tracked eight hundred participants using wrist accelerometers rather than self-reports, because people consistently overestimate how long they sleep. On average, participants slept six hours and forty minutes — well below the recommended seven to nine hours. Crucially, irregular sleep patterns predicted poorer health outcomes even when total sleep time was adequate. In other words, going to bed at the same time each night may matter as much as how long you sleep. We also found that weekend catch-up sleep did not fully reverse the effects of weekday deficit.`,
    questions: [
      { id: 'ld-04-q1', prompt: 'Why did researchers use wrist accelerometers?', options: ['They are cheaper than questionnaires', 'People overestimate their sleep duration', 'Participants preferred them', 'They measure brain waves'], answer: 'People overestimate their sleep duration', explanation: 'The speaker notes people consistently overestimate sleep in self-reports.' },
      { id: 'ld-04-q2', prompt: 'What did the study find about irregular sleep?', options: ['It has no health effect', 'It predicted poorer health even with adequate total sleep', 'It only affects young people', 'It improves weekend recovery'], answer: 'It predicted poorer health even with adequate total sleep', explanation: 'Irregular patterns predicted poorer outcomes even when total sleep time was adequate.' },
      { id: 'ld-04-q3', prompt: 'What happened with weekend catch-up sleep?', options: ['It fully reversed weekday deficit', 'It did not fully reverse the effects', 'It improved health dramatically', 'It was not studied'], answer: 'It did not fully reverse the effects', explanation: 'The speaker found catch-up sleep did not fully reverse weekday deficit effects.' }
    ]
  }
]

/* ---------- WRITING drills ---------- */

export const WRITING_DRILLS: WritingDrill[] = [
  {
    id: 'wd-01',
    topicId: 'environment',
    task: 'Task 2',
    minutes: 40,
    title: 'Plastic packaging ban',
    prompt: 'Some countries have banned single-use plastic packaging. Others argue this harms businesses and consumers. Discuss both views and give your own opinion.',
    structure: ['Introduction: paraphrase the topic and state your position', 'Body 1: arguments for bans — reduce waste, protect wildlife, drive innovation', 'Body 2: arguments against — cost to business, inconvenience, replacement materials may be worse', 'Conclusion: restate opinion with a balanced qualifier'],
    keyPhrases: ['proponents argue that...', 'from an economic standpoint...', 'while this position has merit,...', 'a measured approach would be to...'],
    commonMistakes: ['Only discussing one side of the argument', 'Using "Nowadays" as every sentence opener', 'Listing examples without analysis']
  },
  {
    id: 'wd-02',
    topicId: 'education',
    task: 'Task 2',
    minutes: 40,
    title: 'University education should be free',
    prompt: 'Some people believe university education should be free for all students. Others think students should pay tuition fees. Discuss both views and give your opinion.',
    structure: ['Introduction: restate debate, give your position', 'Body 1: free education — equality of opportunity, public benefit, social mobility', 'Body 2: tuition fees — funding quality, personal investment, alternative pathways', 'Conclusion: propose a middle ground if appropriate'],
    keyPhrases: ['access to higher education...', 'the burden of tuition...', 'a system of means-tested fees...', 'this is a contentious issue'],
    commonMistakes: ['Confusing "free" with "no government funding"', 'Not giving a clear opinion in a discuss-both-views question', 'Using personal anecdotes as main evidence']
  },
  {
    id: 'wd-03',
    topicId: 'technology',
    task: 'Task 2',
    minutes: 40,
    title: 'Remote work and productivity',
    prompt: 'Since the pandemic, many companies allow employees to work from home. Some studies show productivity increases, while others show it declines. Discuss both views and give your opinion.',
    structure: ['Introduction: acknowledge mixed evidence, state position', 'Body 1: productivity gains — fewer commutes, flexible hours, focused work', 'Body 2: productivity losses — isolation, blurred boundaries, communication delays', 'Conclusion: hybrid model as most effective'],
    keyPhrases: ['the evidence is mixed...', 'proponents of remote work claim...', 'critics counter that...', 'a hybrid arrangement appears to...'],
    commonMistakes: ['Repeating the same argument in both body paragraphs', 'Not using specific study references or examples', 'Writing over 350 words for Task 2']
  },
  {
    id: 'wd-04',
    topicId: 'health',
    task: 'Task 2',
    minutes: 40,
    title: 'Junk food advertising to children',
    prompt: 'Some people believe advertising of unhealthy food to children should be banned. To what extent do you agree or disagree?',
    structure: ['Introduction: state degree of agreement clearly', 'Body 1: reasons to ban — childhood obesity, persuasive power of ads, parental difficulty', 'Body 2: counterarguments — parental responsibility, freedom of choice, education as alternative', 'Conclusion: restate position with nuance'],
    keyPhrases: ['I strongly agree that...', 'while parents bear some responsibility,...', 'a total ban would be disproportionate because...', 'evidence suggests...'],
    commonMistakes: ['Agreeing "a little" without clear position', 'Focusing only on health effects, ignoring ethics of advertising to children', 'Not addressing the "to what extent" framing']
  },
  {
    id: 'wd-05',
    topicId: 'environment',
    task: 'Task 1',
    minutes: 20,
    title: 'Urban parkland changes 2000–2020',
    prompt: 'The bar chart shows the percentage of urban land devoted to parks and green space in four cities between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    structure: ['Overview: identify highest and lowest values, overall trend', "Body: describe each city's change with data", 'Compare: which city changed most, which stayed stable', 'Use approximate figures ("around", "just over")'],
    keyPhrases: ['the most striking feature is...', 'city A witnessed a dramatic rise from X to Y', 'by contrast, city B remained relatively stable', 'overall, three of the four cities increased their parkland'],
    commonMistakes: ['Writing an opinion or explanation not in the data', 'Listing every data point instead of grouping', 'Missing a clear overview paragraph']
  },
  {
    id: 'wd-06',
    topicId: 'technology',
    task: 'Task 1',
    minutes: 20,
    title: 'Household device ownership 2015–2025',
    prompt: 'The table shows the percentage of households owning three types of smart device in five European countries in 2015 and 2025. Summarise the main features and make comparisons.',
    structure: ['Overview: overall growth across all devices and countries', 'Body: group by device type or country, highlight extremes', 'Compare 2015 vs 2025 for each', 'Note any exceptions to the trend'],
    keyPhrases: ['ownership rates climbed across the board', 'the most significant increase was recorded in...', 'notably, country X was the only exception', 'by 2025, figures had roughly doubled'],
    commonMistakes: ['Trying to describe every cell of the table', 'Confusing percentage points with percentage growth', 'Not comparing countries to each other']
  }
]

/* ---------- SPEAKING drills ---------- */

export const SPEAKING_DRILLS: SpeakingDrill[] = [
  {
    id: 'sd-01',
    topicId: 'education',
    part: 'Part 1',
    minutes: 4,
    topic: 'Study habits',
    questions: ['Do you prefer studying in the morning or at night? Why?', 'How do you usually stay focused when studying?', 'Have your study habits changed since you started university?', 'Do you think taking notes by hand is better than typing?'],
    tips: ['Keep answers to 2-3 sentences — give a reason and an example', 'Use past tense when talking about changes over time', 'Vary your linking words: "actually", "these days", "the thing is"']
  },
  {
    id: 'sd-02',
    topicId: 'technology',
    part: 'Part 2',
    minutes: 3,
    topic: 'Describe a useful app you often use',
    questions: ['What the app is called', 'How you found it', 'What you use it for', 'And explain why you find it so useful'],
    tips: ['Use the 1-minute preparation time to jot key words, not full sentences', 'Cover all four bullet points — examiners score on all of them', 'Add a personal story to extend your answer naturally', 'Aim for 90-120 seconds of speaking']
  },
  {
    id: 'sd-03',
    topicId: 'environment',
    part: 'Part 3',
    minutes: 5,
    topic: 'Environmental responsibility',
    questions: ['Who should be most responsible for protecting the environment — individuals, companies, or governments?', 'Do you think people will behave more responsibly in the future?', 'How can schools teach children about environmental issues effectively?', 'Should rich countries help poorer countries fight climate change?'],
    tips: ['Part 3 requires abstract, well-developed answers (4-6 sentences)', 'Use hedging language: "It could be argued that...", "There seems to be a trend towards..."', 'Compare and contrast viewpoints before giving your own']
  },
  {
    id: 'sd-04',
    topicId: 'work',
    part: 'Part 1',
    minutes: 4,
    topic: 'Work and careers',
    questions: ['What do you do for a living? / What are you studying?', 'What do you enjoy most about your work or studies?', 'Do you think you will do the same job in ten years?', 'How important is work-life balance to you?'],
    tips: ['Part 1 answers should sound natural and conversational', 'If you are a student, say what you study and why you chose it', 'Use "I\'d imagine..." or "Hopefully..." for speculative answers about the future']
  }
]

/* ---------- GRAMMAR drills ---------- */

export const GRAMMAR_DRILLS: GrammarDrill[] = [
  { id: 'gd-01', category: 'Articles', level: 'Band 6.0', sentence: 'She is ____ most experienced doctor in the department.', blankIndex: 8, options: ['a', 'an', 'the', '(no article)'], answer: 'the', explanation: 'Superlative adjectives take "the" — "the most experienced".' },
  { id: 'gd-02', category: 'Conditionals', level: 'Band 6.5', sentence: 'If I ____ more time, I would learn a third language.', blankIndex: 3, options: ['have', 'had', 'will have', 'would have'], answer: 'had', explanation: 'Second conditional: If + past simple, would + base verb.' },
  { id: 'gd-03', category: 'Relative clauses', level: 'Band 7.0', sentence: 'The researcher ____ findings were published last week won an award.', blankIndex: 9, options: ['who', 'whose', 'which', 'that'], answer: 'whose', explanation: '"Whose" shows possession — the findings belong to the researcher.' },
  { id: 'gd-04', category: 'Passive voice', level: 'Band 6.5', sentence: 'The new policy ____ implemented next January.', blankIndex: 6, options: ['is', 'will be', 'was', 'has been'], answer: 'will be', explanation: 'Future passive: will be + past participle.' },
  { id: 'gd-05', category: 'Reported speech', level: 'Band 7.0', sentence: 'She said she ____ tired after the long meeting.', blankIndex: 5, options: ['is', 'was', 'will be', 'has been'], answer: 'was', explanation: 'Reported speech backshifts present simple to past simple after a past reporting verb.' },
  { id: 'gd-06', category: 'Gerunds and infinitives', level: 'Band 6.5', sentence: 'I look forward to ____ from you soon.', blankIndex: 6, options: ['hear', 'hearing', 'heard', 'have heard'], answer: 'hearing', explanation: '"Look forward to" is followed by a gerund; "to" here is a preposition, not part of an infinitive.' },
  { id: 'gd-07', category: 'Comparatives', level: 'Band 6.0', sentence: 'This route is ____ than the highway during rush hour.', blankIndex: 6, options: ['fast', 'faster', 'fastest', 'more fast'], answer: 'faster', explanation: 'Short adjectives form comparatives with -er, not "more".' },
  { id: 'gd-08', category: 'Modals', level: 'Band 7.0', sentence: 'You ____ have told me earlier — I waited two hours.', blankIndex: 3, options: ['must', 'should', 'can', 'would'], answer: 'should', explanation: '"Should have + past participle" expresses criticism of past behaviour.' },
  { id: 'gd-09', category: 'Linking words', level: 'Band 6.5', sentence: '____ the heavy rain, the match continued as scheduled.', blankIndex: 0, options: ['Despite', 'Although', 'However', 'In spite'], answer: 'Despite', explanation: '"Despite" is followed by a noun or gerund; "although" needs a clause. "In spite" needs "of".' },
  { id: 'gd-10', category: 'Quantifiers', level: 'Band 6.0', sentence: 'There were ____ people at the event than expected.', blankIndex: 6, options: ['less', 'fewer', 'lesser', 'few'], answer: 'fewer', explanation: '"Fewer" is used with countable nouns; "less" with uncountable nouns.' },
  { id: 'gd-11', category: 'Tenses', level: 'Band 7.0', sentence: 'By next year, she ____ her degree.', blankIndex: 5, options: ['finishes', 'will finish', 'will have finished', 'is finishing'], answer: 'will have finished', explanation: 'Future perfect: by + future time, will have + past participle.' },
  { id: 'gd-12', category: 'Subject-verb agreement', level: 'Band 6.5', sentence: 'Neither the teacher nor the students ____ aware of the change.', blankIndex: 8, options: ['was', 'were', 'is', 'has been'], answer: 'were', explanation: 'With "neither...nor", the verb agrees with the nearer subject — "students" is plural.' }
]

/* ---------- VOCABULARY drills ---------- */

export const VOCAB_DRILLS: VocabDrill[] = [
  { id: 'vd-01', topicId: 'environment', type: 'definition', prompt: 'A process that naturally removes contaminants from soil or water', options: ['Erosion', 'Remediation', 'Sedimentation', 'Combustion'], answer: 'Remediation', note: 'Environmental remediation — cleanup of polluted sites.' },
  { id: 'vd-02', topicId: 'environment', type: 'collocation', prompt: 'Complete: "____ emissions"', options: ['Cut', 'Reduce', 'Lower', 'Decrease'], answer: 'Reduce', note: '"Reduce emissions" is the standard IELTS collocation.' },
  { id: 'vd-03', topicId: 'technology', type: 'synonym', prompt: '"Innovative" is closest in meaning to:', options: ['Traditional', 'Groundbreaking', 'Expensive', 'Simple'], answer: 'Groundbreaking', note: 'Use "groundbreaking" or "cutting-edge" for high band scores.' },
  { id: 'vd-04', topicId: 'technology', type: 'collocation', prompt: 'Complete: "____ data breach"', options: ['Do', 'Make', 'Commit', 'Commit a'], answer: 'Commit a', note: '"Commit a data breach" — "commit" collocates with crimes and breaches.' },
  { id: 'vd-05', topicId: 'education', type: 'definition', prompt: 'The process of learning something so well that it becomes automatic', options: ['Memorisation', 'Internalisation', 'Visualisation', 'Synchronisation'], answer: 'Internalisation', note: 'Internalisation of knowledge — high band vocabulary.' },
  { id: 'vd-06', topicId: 'education', type: 'collocation', prompt: 'Complete: "____ a curriculum"', options: ['Do', 'Design', 'Make', 'Create up'], answer: 'Design', note: '"Design a curriculum" — teachers design, not make, curricula.' },
  { id: 'vd-07', topicId: 'health', type: 'definition', prompt: 'A widespread disease affecting many people in a country or the world', options: ['Endemic', 'Epidemic', 'Chronic', 'Acute'], answer: 'Epidemic', note: 'Epidemic (widespread in a region) vs pandemic (global).' },
  { id: 'vd-08', topicId: 'health', type: 'collocation', prompt: 'Complete: "____ a disease"', options: ['Do', 'Treat', 'Heal up', 'Cure of'], answer: 'Treat', note: '"Treat a disease" (ongoing) vs "cure a disease" (permanent result).' },
  { id: 'vd-09', topicId: 'work', type: 'definition', prompt: 'The ability to make good decisions and manage yourself effectively', options: ['Autonomy', 'Seniority', 'Sobriety', 'Multiplicity'], answer: 'Autonomy', note: 'Workplace autonomy — valued highly in modern organisations.' },
  { id: 'vd-10', topicId: 'work', type: 'collocation', prompt: 'Complete: "____ a deadline"', options: ['Do', 'Hit', 'Catch', 'Take'], answer: 'Hit', note: '"Hit / meet / miss a deadline" are the standard collocations.' },
  { id: 'vd-11', topicId: 'cities', type: 'definition', prompt: 'The arrangement of buildings, streets and spaces in a city', options: ['Infrastructure', 'Urban planning', 'Logistics', 'Topography'], answer: 'Urban planning', note: 'Urban planning / urban design — city layout topics.' },
  { id: 'vd-12', topicId: 'culture', type: 'synonym', prompt: '"Heritage" is closest in meaning to:', options: ['Inheritance', 'Invention', 'Insurrection', 'Interference'], answer: 'Inheritance', note: 'Cultural heritage is inherited traditions and artefacts.' }
]

/* ============================================================================
 * DAILY ROTATION HELPERS
 * Deterministic rotation by date so each day gets a fresh, stable selection.
 * ========================================================================== */

/** Day-of-year (1-based) for deterministic daily selection */
export function dayOfYear(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / 86_400_000)
}

/** Pick `count` items starting from today's offset in the bank */
export function dailySelection<T>(bank: T[], count: number, offset = dayOfYear()): T[] {
  if (bank.length === 0) return []
  const result: T[] = []
  for (let i = 0; i < Math.min(count, bank.length); i++) {
    result.push(bank[(offset + i) % bank.length])
  }
  return result
}
