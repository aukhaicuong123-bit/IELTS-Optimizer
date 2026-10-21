import type { Passage } from './types'

export const passages: Passage[] = [
  {
    id: 'urban-gardens',
    title: 'Why urban gardens matter',
    level: 'B2',
    minutes: 12,
    topicId: 'environment',
    topicTitle: 'Environment & Climate',
    text: `Cities are often warmer than surrounding rural areas because concrete and asphalt absorb sunlight. Urban gardens address this problem in several modest but useful ways. Plants shade surfaces, release water vapour and provide habitats for insects. Their effect is local rather than magical: a small garden cannot lower the temperature of an entire city. However, a network of gardens can improve comfort in the streets where people live and work.

Researchers also point to a social benefit. When residents maintain a shared garden, they exchange knowledge and spend more time outdoors. This does not mean every garden succeeds. Projects are more likely to last when a group agrees on watering duties, chooses plants suited to the climate and measures progress realistically. The strongest projects therefore combine environmental action with a simple maintenance plan.

The choice of location matters as much as the number of plants. A garden beside a school may provide shade at a busy pedestrian route, while a plot hidden behind a fence may deliver ecological value but little public comfort. Some councils have therefore begun mapping areas with few trees, high surface temperatures and large numbers of older residents. This approach directs limited funding towards neighbourhoods where cooling and access to green space are most urgently needed.

There are trade-offs. In dry climates, poorly selected vegetation can increase demand for irrigation, and raised beds may compete with space needed for drainage during heavy rain. Community gardens can also become exclusive if membership fees, complicated rules or unclear ownership discourage renters and recent arrivals. Designers increasingly treat residents as partners: they test planting schemes, publish maintenance responsibilities and review water use at the end of each season. In this view, the success of an urban garden is not measured by its appearance alone, but by whether it remains useful, affordable and cared for over time.`,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        prompt: 'What is the main point of the passage?',
        options: [
          'Urban gardens solve every climate problem.',
          'Urban gardens offer local environmental and social benefits when planned well.',
          'Cities should replace all concrete with plants.',
          'Researchers disagree about urban gardens.'
        ],
        answer: 'Urban gardens offer local environmental and social benefits when planned well.',
        explanation: 'The passage describes local cooling, habitat and social benefits, then stresses realistic planning.',
        objective: 'Identify the main idea',
        equivalenceKey: 'urban-gardens:main-idea'
      },
      {
        id: 'q2',
        type: 'true-false-not-given',
        prompt: 'A single urban garden can cool an entire city.',
        options: ['True', 'False', 'Not Given'],
        answer: 'False',
        explanation: 'The text explicitly says a small garden cannot lower the temperature of an entire city.',
        objective: 'Distinguish explicit contradiction',
        equivalenceKey: 'urban-gardens:contradiction'
      },
      {
        id: 'q3',
        type: 'true-false-not-given',
        prompt: 'Successful projects always use plants native to the region.',
        options: ['True', 'False', 'Not Given'],
        answer: 'Not Given',
        explanation: 'The text says plants should be suited to the climate, but does not say they must be native.',
        objective: 'Recognise missing information',
        equivalenceKey: 'urban-gardens:missing-information'
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        prompt: 'Which factor does the passage associate with long-term success?',
        options: [
          'A large advertising budget',
          'A shared maintenance plan',
          'Removing all insects',
          'Building taller streets'
        ],
        answer: 'A shared maintenance plan',
        explanation: 'The final sentence links strong projects with environmental action and a simple maintenance plan.',
        objective: 'Locate supporting detail',
        equivalenceKey: 'urban-gardens:supporting-detail'
      },
      {
        id: 'q5',
        type: 'multiple-choice',
        prompt: 'What could make a garden less sustainable in a dry climate?',
        options: ['A need for constant irrigation', 'A shared watering rota', 'A public review of water use', 'Plants suited to the climate'],
        answer: 'A need for constant irrigation',
        explanation: 'The passage warns that poorly selected vegetation can increase demand for irrigation in dry climates.',
        objective: 'Infer a practical consequence'
      },
      {
        id: 'q6',
        type: 'true-false-not-given',
        prompt: 'Community gardens can become exclusive if their rules discourage some residents from participating.',
        options: ['True', 'False', 'Not Given'],
        answer: 'True',
        explanation: 'The passage says membership fees, complicated rules or unclear ownership can discourage renters and recent arrivals.',
        objective: 'Match a paraphrased claim'
      }
    ]
  },
  {
    id: 'urban-gardens-retest',
    title: 'Retest: urban garden evidence',
    level: 'B2',
    minutes: 8,
    topicId: 'environment',
    topicTitle: 'Environment & Climate',
    text: `A city garden is not a complete answer to urban heat, but it can make a measurable difference in its immediate surroundings. Vegetation shades hard surfaces, returns moisture to the air and creates small habitats. Several gardens connected across a neighbourhood may improve comfort, while one isolated plot should not be expected to cool the whole city.

Community projects also depend on organisation. Residents need to share watering responsibilities, select climate-appropriate plants and decide how progress will be measured. These practical arrangements can determine whether an environmental idea lasts beyond its first season.

The most useful measurements are often simple. Volunteers can compare surface temperatures in a planted area and a nearby paved area, record how much water is used and ask residents which spaces they actually visit. Such evidence prevents organisers from claiming city-wide benefits from a project that has only been assessed at one site. It can also reveal unintended costs: a garden that needs constant watering may be unsuitable for a dry district.

Long-term access is another concern. If a project is managed only by homeowners, tenants and people with irregular working hours may have little say in its design. Clear membership rules, shared tools and occasional open meetings can make participation broader. The central lesson is therefore practical rather than idealistic: a garden works best when its environmental ambition is matched by a realistic plan for care and measurement.`,
    questions: [
      {
        id: 'r1',
        type: 'multiple-choice',
        prompt: 'How does the passage describe the likely impact of one isolated garden?',
        options: [
          'It cools the whole city.',
          'It has a limited local effect.',
          'It has no environmental effect.',
          'It always fails without funding.'
        ],
        answer: 'It has a limited local effect.',
        explanation: 'The passage says one isolated plot should not be expected to cool the whole city.',
        objective: 'Identify the main idea',
        equivalenceKey: 'urban-gardens:main-idea'
      },
      {
        id: 'r2',
        type: 'true-false-not-given',
        prompt: 'Several connected gardens may improve comfort in a neighbourhood.',
        options: ['True', 'False', 'Not Given'],
        answer: 'True',
        explanation: 'The passage directly says several gardens connected across a neighbourhood may improve comfort.',
        objective: 'Distinguish explicit contradiction',
        equivalenceKey: 'urban-gardens:contradiction'
      },
      {
        id: 'r3',
        type: 'true-false-not-given',
        prompt: 'The passage states that every project receives public funding.',
        options: ['True', 'False', 'Not Given'],
        answer: 'Not Given',
        explanation: 'Funding is not discussed; the passage focuses on organisation and maintenance.',
        objective: 'Recognise missing information',
        equivalenceKey: 'urban-gardens:missing-information'
      },
      {
        id: 'r4',
        type: 'multiple-choice',
        prompt: 'What can determine whether a project lasts?',
        options: [
          'The height of nearby buildings',
          'Practical maintenance arrangements',
          'The number of insects present',
          'The age of the garden'
        ],
        answer: 'Practical maintenance arrangements',
        explanation: 'The final paragraph connects shared duties, plant choice and measurement with project longevity.',
        objective: 'Locate supporting detail',
        equivalenceKey: 'urban-gardens:supporting-detail'
      }
    ]
  },
  {
    id: 'community-libraries',
    title: 'Libraries and digital access',
    level: 'B2',
    minutes: 14,
    topicId: 'technology',
    topicTitle: 'Technology & Digital Life',
    text: `Public libraries are changing as more information becomes available online. Their role is not simply to provide shelves of books. Many libraries now offer quiet workspaces, digital catalogues and workshops that help visitors evaluate sources. These services are particularly useful for people who have reliable internet access at home but lack guidance about which information to trust.

The change also creates practical challenges. Libraries must train staff, maintain equipment and design spaces for different kinds of users. A successful programme therefore combines technology with human support. Measuring attendance alone may show popularity, but feedback about whether visitors can use a new skill is more informative.

Digital inclusion is not limited to providing a computer. A visitor may need help completing an online form, recognising a misleading headline, protecting a password or finding a reliable government source. Staff members consequently act less like technical repair workers and more like patient intermediaries between institutions and the public. This role is difficult to automate because the same task can be straightforward for one visitor and intimidating for another.

Libraries must also decide how much data to collect. Counting log-ins and workshop registrations can help managers plan staffing, but detailed tracking may make users reluctant to seek assistance. Some services now use anonymous feedback cards or short skills checks instead of storing individual browsing histories. The aim is to learn whether support changed what a person could do, while preserving the trust that makes a public library feel safe.

The strongest programmes are therefore evaluated in stages. Managers first record participation, then ask users to demonstrate a skill, such as comparing two sources or applying for a service online. They may later check whether the skill is still being used. This broader definition of success recognises that a library is not merely a place where information is stored; it is a civic classroom where people learn to use information responsibly.`,
    questions: [
      {
        id: 'l1',
        type: 'multiple-choice',
        prompt: 'What change in libraries is emphasised?',
        options: [
          'They are removing all printed books.',
          'They combine information access with guidance and support.',
          'They only serve people without internet.',
          'They measure success only by attendance.'
        ],
        answer: 'They combine information access with guidance and support.',
        explanation: 'The passage describes digital services, workshops and human support rather than a simple shift away from books.',
        objective: 'Identify the main idea'
      },
      {
        id: 'l2',
        type: 'true-false-not-given',
        prompt: 'Every library visitor lacks internet access at home.',
        options: ['True', 'False', 'Not Given'],
        answer: 'False',
        explanation: 'The text says many useful services are for people who do have reliable internet access at home.',
        objective: 'Distinguish explicit contradiction'
      },
      {
        id: 'l3',
        type: 'true-false-not-given',
        prompt: 'The passage says attendance is the best measure of learning.',
        options: ['True', 'False', 'Not Given'],
        answer: 'False',
        explanation: 'It contrasts attendance with more informative feedback about whether a skill can be used.',
        objective: 'Locate supporting detail'
      },
      {
        id: 'l4',
        type: 'multiple-choice',
        prompt: 'What does a successful programme combine?',
        options: [
          'Technology and human support',
          'Popularity and advertising',
          'Books and silence',
          'Equipment and larger buildings'
        ],
        answer: 'Technology and human support',
        explanation: 'The final paragraph explicitly states that successful programmes combine technology with human support.',
        objective: 'Locate supporting detail'
      },
      {
        id: 'l5',
        type: 'multiple-choice',
        prompt: 'Why might libraries avoid storing detailed browsing histories?',
        options: ['They want to preserve users’ trust and privacy.', 'They have no computers available.', 'Attendance would become impossible to measure.', 'Staff cannot teach digital skills.'],
        answer: 'They want to preserve users’ trust and privacy.',
        explanation: 'The passage explains that detailed tracking may make users reluctant to seek assistance.',
        objective: 'Identify a reason'
      },
      {
        id: 'l6',
        type: 'true-false-not-given',
        prompt: 'The passage suggests that a library should measure whether visitors can use a skill, not only whether they attended.',
        options: ['True', 'False', 'Not Given'],
        answer: 'True',
        explanation: 'It explicitly presents skill demonstrations and later checks as more informative than attendance alone.',
        objective: 'Identify an extended supporting idea'
      }
    ]
  },
  {
    id: 'active-recall-languages',
    title: 'Active recall and cognitive load in university studies',
    level: 'B2 / C1',
    minutes: 15,
    topicId: 'education',
    topicTitle: 'Education & Learning',
    text: `Cognitive psychologists have long documented the testing effect, which demonstrates that actively retrieving knowledge from memory produces more durable retention than passive rereading. In university seminar settings, students who engage in weekly low-stakes quizzes consistently outperform peers who rely strictly on highlighting lecture slides.

However, active recall cannot occur in an intellectual vacuum. Novice learners require structured scaffolding before they can retrieve complex theoretical frameworks effectively. Without foundational schema, demanding self-testing may induce cognitive overload and frustration. Therefore, effective curriculum designers recommend an alternating schedule: introduce core definitions through guided exposition, followed promptly by spaced retrieval intervals.

The timing of those intervals matters. A student who answers the same question immediately after reading may experience fluency without developing durable memory, because the wording is still familiar. A second attempt after a short delay is more revealing: partial forgetting creates a productive difficulty, while feedback prevents an incorrect answer from becoming established. Spacing should then widen gradually, from the same day to several days and finally to a weekly review.

The quality of a retrieval question is equally important. Questions that ask learners to reproduce a definition can check basic recall, but they do not necessarily show whether a concept can be applied. More demanding prompts ask students to compare theories, predict an outcome or explain why an example does not fit. Instructors can sequence these tasks so that learners move from recognition to production and then to transfer.

There is a danger in treating every quiz result as a final judgement. Low scores may indicate unfamiliar terminology, poor question design or an overloaded schedule rather than an inability to learn. Useful feedback identifies the missing step and gives the learner another opportunity to retrieve the idea after correction. In this model, testing is not simply an assessment placed at the end of teaching; it is part of the teaching itself.`,
    questions: [
      {
        id: 'edu-q1',
        type: 'multiple-choice',
        prompt: 'According to the passage, what is the primary finding of the testing effect?',
        options: [
          'Highlighting notes is the most efficient revision strategy.',
          'Actively retrieving information creates longer-lasting memory than passive rereading.',
          'Weekly quizzes cause excessive anxiety and lower student confidence.',
          'Cognitive load decreases when tests are postponed.'
        ],
        answer: 'Actively retrieving information creates longer-lasting memory than passive rereading.',
        explanation: 'The opening sentence states that "actively retrieving knowledge from memory produces more durable retention than passive rereading."',
        objective: 'Identify the main idea'
      },
      {
        id: 'edu-q2',
        type: 'true-false-not-given',
        prompt: 'Novice learners can perform self-testing without any prior instructional scaffolding.',
        options: ['True', 'False', 'Not Given'],
        answer: 'False',
        explanation: 'The passage argues that "Novice learners require structured scaffolding before they can retrieve complex theoretical frameworks effectively."',
        objective: 'Distinguish explicit contradiction'
      },
      {
        id: 'edu-q3',
        type: 'multiple-choice',
        prompt: 'What alternating strategy is recommended by curriculum designers?',
        options: [
          'Rereading slides followed by long summer breaks.',
          'Guided exposition of core definitions followed by spaced retrieval intervals.',
          'Solely administering unannounced oral exams.',
          'Eliminating textbook readings entirely.'
        ],
        answer: 'Guided exposition of core definitions followed by spaced retrieval intervals.',
        explanation: 'The conclusion specifies: "introduce core definitions through guided exposition, followed promptly by spaced retrieval intervals."',
        objective: 'Locate supporting detail'
      },
      {
        id: 'edu-q4',
        type: 'multiple-choice',
        prompt: 'Why can an immediate repeat quiz give a misleading impression?',
        options: ['The wording may still feel familiar.', 'The learner has forgotten every definition.', 'Feedback is impossible after a quiz.', 'Spaced practice prevents any retrieval.'],
        answer: 'The wording may still feel familiar.',
        explanation: 'The passage says immediate success can reflect fluency caused by familiarity rather than durable memory.',
        objective: 'Understand a contrast'
      },
      {
        id: 'edu-q5',
        type: 'true-false-not-given',
        prompt: 'The passage argues that every low quiz score proves that a learner cannot master the topic.',
        options: ['True', 'False', 'Not Given'],
        answer: 'False',
        explanation: 'Low scores may reflect terminology, question design or workload; the text rejects treating them as final judgements.',
        objective: 'Recognise a qualified claim'
      }
    ]
  },
  {
    id: 'remote-work-dynamics',
    title: 'Organizational autonomy in distributed teams',
    level: 'B2 / C1',
    minutes: 15,
    topicId: 'work',
    topicTitle: 'Work & Employment',
    text: `The transition toward distributed remote workforces has challenged twentieth-century management paradigms that equated physical presence with productivity. In knowledge-intensive industries, asynchronous workflows allow engineers and analysts to structure their workday around biological peak energy periods rather than rigid nine-to-five schedules.

Yet autonomy without clarity can precipitate professional alienation. When employees lack transparent key performance indicators, they frequently overcompensate by remaining perpetually connected to chat channels, exacerbating workplace burnout. Sustainable remote operations therefore depend on documentation rather than surveillance: teams that write clear project briefs and respect communication downtime report higher retention and innovation rates.

The practical difficulty is coordination. A team can work asynchronously only when colleagues know which decisions have been made, which tasks are blocked and when a response is genuinely required. Shared decision logs, predictable handover notes and explicit response windows reduce the need for everyone to be available at once. They also make work more visible without measuring activity through keyboard time or green status indicators.

Remote arrangements are not equally convenient for every employee. People living in crowded homes may have less control over noise, while new staff may struggle to learn informal procedures that would be obvious in an office. Managers can address part of this gap with regular mentoring, optional co-working days and written explanations of norms. These measures do not remove the need for individual responsibility, but they prevent flexibility from becoming a benefit available only to the most experienced workers.

Evidence from distributed teams is also difficult to interpret. A short-term rise in output may reflect extra hours rather than improved productivity, and a fall in meetings may simply hide unresolved problems. Managers therefore need several indicators: completed work against agreed standards, staff wellbeing, employee turnover and the quality of collaboration. The most sustainable model treats location as one design choice among many, not as a substitute for clear goals and humane working practices.`,
    questions: [
      {
        id: 'wrk-q1',
        type: 'multiple-choice',
        prompt: 'What advantage of asynchronous work is highlighted in the text?',
        options: [
          'It eliminates the need for written communication.',
          'It allows professionals to work during their biological peak energy hours.',
          'It requires managers to monitor keystrokes continuously.',
          'It guarantees automatic promotions within six months.'
        ],
        answer: 'It allows professionals to work during their biological peak energy hours.',
        explanation: 'The passage explains that "asynchronous workflows allow engineers and analysts to structure their workday around biological peak energy periods."',
        objective: 'Identify the main idea'
      },
      {
        id: 'wrk-q2',
        type: 'true-false-not-given',
        prompt: 'Employees never experience burnout when working from home.',
        options: ['True', 'False', 'Not Given'],
        answer: 'False',
        explanation: 'The passage explicitly states that workers "frequently overcompensate by remaining perpetually connected to chat channels, exacerbating workplace burnout."',
        objective: 'Distinguish explicit contradiction'
      },
      {
        id: 'wrk-q3',
        type: 'multiple-choice',
        prompt: 'What operational approach is linked to higher retention in distributed teams?',
        options: [
          'Constant video monitoring and time-tracking software.',
          'Clear project briefs and respected communication downtime.',
          'Mandatory daily morning commutes to suburban hubs.',
          'Eliminating all performance evaluations.'
        ],
        answer: 'Clear project briefs and respected communication downtime.',
        explanation: 'The text concludes that "teams that write clear project briefs and respect communication downtime report higher retention and innovation rates."',
        objective: 'Locate supporting detail'
      },
      {
        id: 'wrk-q4',
        type: 'multiple-choice',
        prompt: 'Which practice can reduce the need for everyone to be available at the same time?',
        options: ['Shared decision logs and handover notes', 'More keyboard monitoring', 'Removing all performance goals', 'Longer compulsory commutes'],
        answer: 'Shared decision logs and handover notes',
        explanation: 'The passage identifies decision logs, handovers and response windows as coordination tools.',
        objective: 'Locate a proposed solution'
      },
      {
        id: 'wrk-q5',
        type: 'true-false-not-given',
        prompt: 'A short-term increase in output necessarily proves that remote work improved productivity.',
        options: ['True', 'False', 'Not Given'],
        answer: 'False',
        explanation: 'The passage warns that a short-term rise may reflect extra hours rather than improved productivity.',
        objective: 'Distinguish evidence from conclusion'
      }
    ]
  },
  {
    id: 'circadian-rhythms-sleep',
    title: 'Circadian rhythms and cognitive peak performance',
    level: 'B2 / C1',
    minutes: 14,
    topicId: 'health',
    topicTitle: 'Health & Well-being',
    text: `Human alertness and metabolic functions fluctuate throughout the day in accordance with the suprachiasmatic nucleus—the master biological clock located in the hypothalamus. Natural sunlight stimulates photoreceptors in the retina, suppressing daytime melatonin secretion and synchronizing internal circadian oscillations.

In modern industrial societies, excessive exposure to short-wavelength blue light from digital displays and fluorescent office lighting after sunset disrupts this delicate synchronization. Chronic circadian misalignment correlates with diminished executive function, impaired working memory, and heightened cardiovascular risk. Sleep researchers therefore advocate for strict light hygiene: dimming ambient fixtures two hours prior to bed and securing thirty minutes of natural morning sunlight.

Individual timing preferences complicate the picture. Some people naturally become alert early in the morning, whereas others reach their strongest concentration later in the day. These chronotypes do not make a stable sleep schedule irrelevant, but they suggest that schools and workplaces should avoid assuming that one starting time suits everyone. A late chronotype forced to begin work before dawn may accumulate sleep debt even if the official schedule appears reasonable.

Light is only one signal. Meal timing, physical activity and social routines also help the body predict when to be awake and when to rest. Travellers who cross time zones often feel tired because these signals temporarily disagree: the clock says morning while the body is still responding to the previous evening. Gradually shifting bedtime before departure and seeking daylight after arrival can reduce, though not instantly eliminate, this mismatch.

Researchers caution that correlation is not proof that blue light alone causes every health problem associated with poor sleep. Screen use may also delay bedtime by replacing rest with work or entertainment. The most defensible advice is therefore behavioural: protect a consistent sleep opportunity, obtain outdoor light early in the day, reduce bright light before bed and observe which changes improve alertness. Such habits address the wider rhythm rather than treating a single lamp or device as the sole cause.`,
    questions: [
      {
        id: 'hlth-q1',
        type: 'multiple-choice',
        prompt: 'How does natural morning sunlight influence circadian rhythm?',
        options: [
          'It accelerates melatonin production immediately.',
          'It suppresses daytime melatonin secretion and synchronizes the biological clock.',
          'It lowers body temperature to promote drowsiness.',
          'It permanently eliminates the need for nighttime sleep.'
        ],
        answer: 'It suppresses daytime melatonin secretion and synchronizes the biological clock.',
        explanation: 'The text states that natural sunlight "suppresses daytime melatonin secretion and synchronizes internal circadian oscillations."',
        objective: 'Identify the main idea'
      },
      {
        id: 'hlth-q2',
        type: 'true-false-not-given',
        prompt: 'Chronic circadian misalignment has no impact on human working memory.',
        options: ['True', 'False', 'Not Given'],
        answer: 'False',
        explanation: 'The author notes that "Chronic circadian misalignment correlates with diminished executive function, impaired working memory, and heightened cardiovascular risk."',
        objective: 'Distinguish explicit contradiction'
      },
      {
        id: 'hlth-q3',
        type: 'multiple-choice',
        prompt: 'What ambient light practice do researchers recommend before bedtime?',
        options: [
          'Increasing screen brightness to maintain focus.',
          'Dimming ambient fixtures two hours prior to sleep.',
          'Staring at blue LED lamps for 15 minutes.',
          'Keeping fluorescent ceiling bulbs illuminated all night.'
        ],
        answer: 'Dimming ambient fixtures two hours prior to sleep.',
        explanation: 'The final sentence advises "dimming ambient fixtures two hours prior to bed and securing thirty minutes of natural morning sunlight."',
        objective: 'Locate supporting detail'
      },
      {
        id: 'hlth-q4',
        type: 'multiple-choice',
        prompt: 'Why does the writer mention people with different chronotypes?',
        options: ['To show that one official starting time may not suit everyone', 'To prove that sleep schedules are irrelevant', 'To recommend working only at night', 'To show that sunlight has no biological effect'],
        answer: 'To show that one official starting time may not suit everyone',
        explanation: 'The chronotype paragraph explains why fixed schedules can create sleep debt for some people.',
        objective: 'Identify the function of an example'
      },
      {
        id: 'hlth-q5',
        type: 'true-false-not-given',
        prompt: 'The writer claims that blue light alone is responsible for every health problem linked to poor sleep.',
        options: ['True', 'False', 'Not Given'],
        answer: 'False',
        explanation: 'The final paragraph explicitly cautions that screen use may delay bedtime and that correlation is not proof of a single cause.',
        objective: 'Recognise a limitation'
      }
    ]
  }
]
