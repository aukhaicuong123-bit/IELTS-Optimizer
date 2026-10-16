import type { Passage } from './types'

export const passages: Passage[] = [
  {
    id: 'urban-gardens',
    title: 'Why urban gardens matter',
    level: 'B2',
    minutes: 12,
    topicId: 'environment',
    topicTitle: 'Environment & Climate',
    text: `Cities are often warmer than surrounding rural areas because concrete and asphalt absorb sunlight. Urban gardens address this problem in several modest but useful ways. Plants shade surfaces, release water vapour and provide habitats for insects. Their effect is local rather than magical: a small garden cannot lower the temperature of an entire city. However, a network of gardens can improve comfort in the streets where people live and work.\n\nResearchers also point to a social benefit. When residents maintain a shared garden, they exchange knowledge and spend more time outdoors. This does not mean every garden succeeds. Projects are more likely to last when a group agrees on watering duties, chooses plants suited to the climate and measures progress realistically. The strongest projects therefore combine environmental action with a simple maintenance plan.`,
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
    text: `A city garden is not a complete answer to urban heat, but it can make a measurable difference in its immediate surroundings. Vegetation shades hard surfaces, returns moisture to the air and creates small habitats. Several gardens connected across a neighbourhood may improve comfort, while one isolated plot should not be expected to cool the whole city.\n\nCommunity projects also depend on organisation. Residents need to share watering responsibilities, select climate-appropriate plants and decide how progress will be measured. These practical arrangements can determine whether an environmental idea lasts beyond its first season.`,
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
    text: `Public libraries are changing as more information becomes available online. Their role is not simply to provide shelves of books. Many libraries now offer quiet workspaces, digital catalogues and workshops that help visitors evaluate sources. These services are particularly useful for people who have reliable internet access at home but lack guidance about which information to trust.\n\nThe change also creates practical challenges. Libraries must train staff, maintain equipment and design spaces for different kinds of users. A successful programme therefore combines technology with human support. Measuring attendance alone may show popularity, but feedback about whether visitors can use a new skill is more informative.`,
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
    text: `Cognitive psychologists have long documented the testing effect, which demonstrates that actively retrieving knowledge from memory produces more durable retention than passive rereading. In university seminar settings, students who engage in weekly low-stakes quizzes consistently outperform peers who rely strictly on highlighting lecture slides.\n\nHowever, active recall cannot occur in an intellectual vacuum. Novice learners require structured scaffolding before they can retrieve complex theoretical frameworks effectively. Without foundational schema, demanding self-testing may induce cognitive overload and frustration. Therefore, effective curriculum designers recommend an alternating schedule: introduce core definitions through guided exposition, followed promptly by spaced retrieval intervals.`,
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
    text: `The transition toward distributed remote workforces has challenged twentieth-century management paradigms that equated physical presence with productivity. In knowledge-intensive industries, asynchronous workflows allow engineers and analysts to structure their workday around biological peak energy periods rather than rigid nine-to-five schedules.\n\nYet autonomy without clarity can precipitate professional alienation. When employees lack transparent key performance indicators, they frequently overcompensate by remaining perpetually connected to chat channels, exacerbating workplace burnout. Sustainable remote operations therefore depend on documentation rather than surveillance: teams that write clear project briefs and respect communication downtime report higher retention and innovation rates.`,
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
    text: `Human alertness and metabolic functions fluctuate throughout the day in accordance with the suprachiasmatic nucleus—the master biological clock located in the hypothalamus. Natural sunlight stimulates photoreceptors in the retina, suppressing daytime melatonin secretion and synchronizing internal circadian oscillations.\n\nIn modern industrial societies, excessive exposure to short-wavelength blue light from digital displays and fluorescent office lighting after sunset disrupts this delicate synchronization. Chronic circadian misalignment correlates with diminished executive function, impaired working memory, and heightened cardiovascular risk. Sleep researchers therefore advocate for strict light hygiene: dimming ambient fixtures two hours prior to bed and securing thirty minutes of natural morning sunlight.`,
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
      }
    ]
  }
]
