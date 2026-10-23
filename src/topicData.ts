/**
 * IELTS Optimizer — Canonical Topic Data & Lexicon
 * Content model for the IELTS Optimizer study journey.
 * Covers core IELTS topics with authentic vocabulary, collocations, grammar patterns,
 * listening passages, writing prompts, and speaking cue cards.
 */

import { ADDITIONAL_17_TOPICS } from './data/additionalTopicsData'

export type TopicId =
  | 'education'
  | 'environment'
  | 'technology'
  | 'health'
  | 'work'
  | 'cities'
  | 'crime'
  | 'culture'
  | 'travel'
  | 'globalization'
  | 'media'
  | 'science'
  | 'economy'
  | 'society'
  | 'energy'
  | 'transport'
  | 'psychology'
  | 'food'
  | 'space'
  | 'sports'
  | 'language'
  | 'history'
  | 'business'
  | 'wildlife'
  | 'generation'

export type VocabItem = {
  id: string
  term: string
  ipa: string
  type: 'Academic Word' | 'Collocation · IELTS' | 'Idiom' | 'Phrasal Verb'
  meaningVi: string
  example: string
  collocations: string[]
}

export type GrammarRule = {
  id: string
  title: string
  level: 'Band 6.5+' | 'Band 7.0+' | 'Band 7.5+' | 'Band 8.0+'
  explanationVi: string
  formula: string
  examples: string[]
  drillPrompt: string
  sampleTransform: string
}

export type ListeningTopicUnit = {
  id: string
  title: string
  level: string
  durationMinutes: number
  audioText: string
  questions: {
    id: string
    prompt: string
    options: string[]
    answer: string
    explanation: string
  }[]
}

export type WritingChartData = {
  visualization: 'bar' | 'line' | 'table' | 'scatter' | 'pie' | 'stacked'
  unit: string
  categories: string[]
  series: { label: string; values: number[] }[]
}

// Accept both the original canonical format and the expanded AI Studio format.
export type WritingTopicUnit = {
  task1?: { title: string; prompt: string; chartType: string; suggestedCollocations: string[]; chartData?: WritingChartData }
  task2?: { title: string; prompt: string; essayType: string; suggestedCollocations: string[]; outlineIdeas: string[] }
  task1Prompt?: string
  task2Prompt?: string
  sampleBand8?: string
}

export type SpeakingTopicUnit = {
  part1: string[]
  part2: { cueCard: string; bulletPoints: string[]; followUp: string }
  part3: string[]
  collocations?: string[]
}

export type TopicDefinition = {
  id: TopicId
  titleEn: string
  titleVi: string
  accent: string
  badgeColor: string
  icon: string
  descriptionVi: string
  vocab: VocabItem[]
  grammar: GrammarRule[]
  listening: ListeningTopicUnit
  writing: WritingTopicUnit
  speaking: SpeakingTopicUnit
  // AI Studio extension fields (optional)
  sampleBand8?: string
}

const CORE_8_TOPICS: TopicDefinition[] = [
  {
    id: 'education',
    titleEn: 'Education & Learning',
    titleVi: 'Giáo dục & Học tập',
    accent: '#5eead4',
    badgeColor: '#134e48',
    icon: 'GraduationCap',
    descriptionVi: 'Hệ thống giáo dục, phương pháp học tập, phát triển kỹ năng và giáo dục đại học.',
    vocab: [
      {
        id: 'edu-1',
        term: 'early childhood education',
        ipa: '/ˈɜːli ˈtʃaɪldhʊd ˌedʒuˈkeɪʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'giáo dục mầm non, giai đoạn đầu đời',
        example: 'High-quality early childhood education lays the cognitive foundation for lifelong learning.',
        collocations: ['subsidised early childhood education', 'invest in early childhood education']
      },
      {
        id: 'edu-2',
        term: 'curriculum reform',
        ipa: '/kəˈrɪkjələm rɪˈfɔːm/',
        type: 'Collocation · IELTS',
        meaningVi: 'cải cách chương trình giảng dạy',
        example: 'Educators argue that curriculum reform must prioritise critical thinking over rote memorisation.',
        collocations: ['undertake curriculum reform', 'comprehensive curriculum reform']
      },
      {
        id: 'edu-3',
        term: 'holistic development',
        ipa: '/həʊˈlɪstɪk dɪˈveləpmənt/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự phát triển toàn diện (thể chất, tinh thần, trí tuệ)',
        example: 'Modern pedagogical frameworks foster holistic development rather than purely academic scores.',
        collocations: ['promote holistic development', 'nurture holistic development']
      },
      {
        id: 'edu-4',
        term: 'rote learning',
        ipa: '/rəʊt ˈlɜːnɪŋ/',
        type: 'Collocation · IELTS',
        meaningVi: 'học vẹt, học thuộc lòng máy móc',
        example: 'Rote learning fails to equip university graduates with adaptable problem-solving skills.',
        collocations: ['rely on rote learning', 'shift away from rote learning']
      },
      {
        id: 'edu-5',
        term: 'tertiary education',
        ipa: '/ˈtɜːʃəri ˌedʒuˈkeɪʃn/',
        type: 'Academic Word',
        meaningVi: 'giáo dục bậc đại học/cao đẳng',
        example: 'Equal access to tertiary education is vital for reducing socio-economic disparities.',
        collocations: ['pursue tertiary education', 'free tertiary education']
      },
      {
        id: 'edu-6',
        term: 'pedagogical approach',
        ipa: '/ˌpedəˈɡɒdʒɪkl əˈprəʊtʃ/',
        type: 'Collocation · IELTS',
        meaningVi: 'phương pháp tiếp cận sư phạm',
        example: 'The school adopted an inquiry-based pedagogical approach to engage disaffected students.',
        collocations: ['innovative pedagogical approach', 'traditional pedagogical approach']
      },
      {
        id: 'edu-7',
        term: 'vocational training',
        ipa: '/vəʊˈkeɪʃənl ˈtreɪnɪŋ/',
        type: 'Collocation · IELTS',
        meaningVi: 'đào tạo nghề thực hành',
        example: 'Governments should allocate more funding to vocational training alongside university degrees.',
        collocations: ['vocational training programmes', 'practical vocational training']
      },
      {
        id: 'edu-8',
        term: 'broaden one’s horizons',
        ipa: '/ˈbrɔːdn wʌnz həˈraɪznz/',
        type: 'Idiom',
        meaningVi: 'mở rộng tầm nhìn, hiểu biết',
        example: 'Studying abroad enables undergraduates to broaden their horizons and embrace cultural diversity.',
        collocations: ['intellectually broaden one’s horizons']
      }
    ],
    grammar: [
      {
        id: 'gram-edu-1',
        title: 'Negative Inversion for Academic Emphasis',
        level: 'Band 7.5+',
        explanationVi: 'Đảo ngữ với từ phủ định để tăng tính học thuật và nhấn mạnh trong IELTS Writing & Speaking.',
        formula: 'Not only + Auxiliary + Subject + Verb, but Subject also + Verb / Under no circumstances should + Subject + Verb',
        examples: [
          'Not only does tertiary education foster critical thinking, but it also elevates lifelong earnings.',
          'Under no circumstances should schools eliminate arts and humanities in favor of purely technical subjects.'
        ],
        drillPrompt: 'Transform this sentence using "Not only": Education provides career skills. It also instills civic responsibility.',
        sampleTransform: 'Not only does education provide career skills, but it also instills civic responsibility.'
      },
      {
        id: 'gram-edu-2',
        title: 'Cleft Sentences for Focused Arguments',
        level: 'Band 8.0+',
        explanationVi: 'Câu chẻ (It is ... that / What ... is) để làm nổi bật nhân tố cốt lõi trong lập luận.',
        formula: 'It is + Noun/Phrase + that + Clause / What + Clause + is + Noun/Clause',
        examples: [
          'It is the teacher’s mentorship that transforms a dry curriculum into an inspiring journey.',
          'What modern schools urgently require is a balance between digital tools and human empathy.'
        ],
        drillPrompt: 'Transform using "What... is": Hands-on experience matters most for engineering graduates.',
        sampleTransform: 'What matters most for engineering graduates is hands-on practical experience.'
      }
    ],
    listening: {
      id: 'lis-edu-1',
      title: 'University Academic Advising Seminar',
      level: 'B2 / Band 6.5',
      durationMinutes: 4,
      audioText: `Good morning, new undergraduates, and welcome to the Academic Support Center. Today I want to clarify how credit accumulation works across our three academic terms. Each student is required to complete sixty credits per year, divided between core modules and elective research projects. Elective registration opens this Friday at nine in the morning on the student portal. If you plan to apply for an international exchange programme in your second year, you must register for at least one foreign language module this semester. Lastly, peer tutoring sessions take place every Tuesday and Thursday afternoon in room four hundred and two.`,
      questions: [
        {
          id: 'lis-q1',
          prompt: 'How many credits must students complete each academic year?',
          options: ['30 credits', '60 credits', '90 credits', '120 credits'],
          answer: '60 credits',
          explanation: 'The advisor states: "Each student is required to complete sixty credits per year."'
        },
        {
          id: 'lis-q2',
          prompt: 'When does elective course registration open?',
          options: ['Monday morning', 'Wednesday afternoon', 'Friday at 9:00 AM', 'Next week'],
          answer: 'Friday at 9:00 AM',
          explanation: 'The speaker explicitly notes: "Elective registration opens this Friday at nine in the morning."'
        },
        {
          id: 'lis-q3',
          prompt: 'What prerequisite is required for the second-year international exchange programme?',
          options: ['Top 5% GPA', 'One foreign language module this semester', 'A faculty recommendation letter', '100 volunteer hours'],
          answer: 'One foreign language module this semester',
          explanation: 'The advisor says: "you must register for at least one foreign language module this semester."'
        }
      ]
    },
    writing: {
      task1: {
        title: 'Task 1: University Enrollment by Field of Study',
        prompt: 'The bar chart illustrates the percentage of university students enrolled in STEM, Humanities, and Business courses across four countries in 2024.',
        chartType: 'Comparative Bar Chart',
        suggestedCollocations: ['account for the majority', 'a negligible proportion', 'stand at approximately', 'experience an upward trajectory'],
        chartData: { visualization: 'bar', unit: '% of students', categories: ['Country A', 'Country B', 'Country C', 'Country D'], series: [{ label: 'STEM', values: [42, 35, 51, 38] }, { label: 'Humanities', values: [28, 34, 22, 31] }, { label: 'Business', values: [30, 31, 27, 31] }] }
      },
      task2: {
        title: 'Task 2: Free University Tuition vs Personal Investment',
        prompt: 'Some people argue that tertiary education should be fully funded by governments for all citizens, while others believe students should pay for their own higher education. Discuss both views and give your opinion.',
        essayType: 'Discussion & Opinion Essay',
        suggestedCollocations: ['tertiary education', 'curriculum reform', 'socio-economic mobility', 'fiscal burden', 'equitable access'],
        outlineIdeas: [
          'Body 1 (State funded): Education is a public good; boosts national innovation; eliminates generational poverty.',
          'Body 2 (Tuition paid): Heavy fiscal pressure on taxpayers; graduates earn significantly higher lifetime wages; ensures student commitment.'
        ]
      }
    },
    speaking: {
      part1: [
        'What was your favorite subject when you were in secondary school?',
        'Do you think technology has made learning easier or more distracting?',
        'Would you like to take up any new course in the future?'
      ],
      part2: {
        cueCard: 'Describe a memorable teacher or mentor who influenced your education.',
        bulletPoints: [
          'Who this person was and what subject they taught',
          'How their teaching style differed from conventional teachers',
          'What valuable lesson or skill you acquired from them',
          'And explain why their guidance had such a lasting impact on your life.'
        ],
        followUp: 'Do you still keep in touch with this mentor?'
      },
      part3: [
        'How should schools assess student performance beyond standardized examinations?',
        'Do you believe universities will be replaced by online micro-credentials in the coming decades?'
      ],
      collocations: ['foster critical thinking', 'broaden one’s horizons', 'inspirational mentor', 'interactive pedagogical methods']
    }
  },
  {
    id: 'environment',
    titleEn: 'Environment & Climate',
    titleVi: 'Môi trường & Khí hậu',
    accent: '#86efac',
    badgeColor: '#14532d',
    icon: 'Leaf',
    descriptionVi: 'Biến đổi khí hậu, năng lượng tái tạo, bảo tồn đa dạng sinh học và phát triển bền vững.',
    vocab: [
      {
        id: 'env-1',
        term: 'carbon footprint',
        ipa: '/ˈkɑːbən ˈfʊtprɪnt/',
        type: 'Collocation · IELTS',
        meaningVi: 'dấu chân carbon (lượng khí thải nhà kính cá nhân/tổ chức)',
        example: 'Commuters can substantially shrink their carbon footprint by switching to electrified public transit.',
        collocations: ['reduce carbon footprint', 'offset carbon footprint']
      },
      {
        id: 'env-2',
        term: 'biodiversity conservation',
        ipa: '/ˌbaɪəʊdaɪˈvɜːsəti ˌkɒnsəˈveɪʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'bảo tồn đa dạng sinh học',
        example: 'The wetland reserve serves as a benchmark for biodiversity conservation in coastal regions.',
        collocations: ['prioritise biodiversity conservation', 'threat to biodiversity conservation']
      },
      {
        id: 'env-3',
        term: 'renewable energy transition',
        ipa: '/rɪˈnjuːəbl ˈenədʒi trænˈzɪʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'quá trình chuyển dịch sang năng lượng tái tạo',
        example: 'Subsidies on wind and solar power accelerate the national renewable energy transition.',
        collocations: ['speed up renewable energy transition', 'just renewable energy transition']
      },
      {
        id: 'env-4',
        term: 'ecological degradation',
        ipa: '/ˌiːkəˈlɒdʒɪkl ˌdeɡrəˈdeɪʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự suy thoái sinh thái',
        example: 'Unregulated industrial waste has caused severe ecological degradation in downstream river systems.',
        collocations: ['halt ecological degradation', 'irreversible ecological degradation']
      },
      {
        id: 'env-5',
        term: 'sustainable agriculture',
        ipa: '/səˈsteɪnəbl ˈæɡrɪkʌltʃə/',
        type: 'Collocation · IELTS',
        meaningVi: 'nông nghiệp bền vững',
        example: 'Crop rotation and drip irrigation are core tenets of sustainable agriculture in arid zones.',
        collocations: ['adopt sustainable agriculture', 'promote sustainable agriculture']
      },
      {
        id: 'env-6',
        term: 'greenhouse gas emissions',
        ipa: '/ˈɡriːnhaʊs ɡæs ɪˈmɪʃnz/',
        type: 'Collocation · IELTS',
        meaningVi: 'khí thải nhà kính',
        example: 'International treaties compel signatory nations to cut greenhouse gas emissions by fifty percent.',
        collocations: ['curb greenhouse gas emissions', 'cap greenhouse gas emissions']
      },
      {
        id: 'env-7',
        term: 'deforestation',
        ipa: '/diːˌfɒrɪˈsteɪʃn/',
        type: 'Academic Word',
        meaningVi: 'nạn phá rừng',
        example: 'Rampant deforestation compromises natural carbon sinks and accelerates soil erosion.',
        collocations: ['combat deforestation', 'widespread deforestation']
      },
      {
        id: 'env-8',
        term: 'the tip of the iceberg',
        ipa: '/ðə tɪp əv ði ˈaɪsbɜːɡ/',
        type: 'Idiom',
        meaningVi: 'chỉ là phần nổi của tảng băng chìm (vấn đề sâu rộng hơn)',
        example: 'The recent heatwaves are merely the tip of the iceberg of impending global climate turbulence.',
        collocations: ['just the tip of the iceberg']
      }
    ],
    grammar: [
      {
        id: 'gram-env-1',
        title: 'Mixed & Inverted Conditionals for Future Environmental Scenarios',
        level: 'Band 7.5+',
        explanationVi: 'Câu điều kiện đảo ngữ (Were it not for... / Had nations acted...) để mô tả các kịch bản khí hậu giả định.',
        formula: 'Were + Subject + to Verb, Clause / Had + Subject + Past Participle, Subject would have + Past Participle',
        examples: [
          'Were governments to impose a progressive carbon tax, corporations would swiftly pivot to clean energy.',
          'Had international agreements been strictly enforced twenty years ago, global temperature anomalies would be far milder today.'
        ],
        drillPrompt: 'Transform using "Were nations to...": If nations phase out fossil fuels, atmospheric pollution will decline drastically.',
        sampleTransform: 'Were nations to phase out fossil fuels, atmospheric pollution would decline drastically.'
      },
      {
        id: 'gram-env-2',
        title: 'Impersonal Passive Constructions for Scientific Evidence',
        level: 'Band 7.0+',
        explanationVi: 'Cấu trúc bị động khách quan (It is estimated that... / Evidence is widely believed to...) thể hiện tính trung lập học thuật.',
        formula: 'It is widely acknowledged / projected / estimated that + Clause',
        examples: [
          'It is widely acknowledged that urban heat islands exacerbate respiratory illnesses during summer months.',
          'Rising sea levels are projected to displace millions of coastal inhabitants by mid-century.'
        ],
        drillPrompt: 'Transform into impersonal passive: Scientists believe that microplastics have infiltrated polar ice caps.',
        sampleTransform: 'It is widely believed that microplastics have infiltrated polar ice caps.'
      }
    ],
    listening: {
      id: 'lis-env-1',
      title: 'Urban Canopy and Microclimate Management',
      level: 'B2 / Band 6.5',
      durationMinutes: 4,
      audioText: `Welcome to the Municipal Environmental Forum. Today’s briefing highlights our ten-year urban greening roadmap. Satellite thermography demonstrates that downtown concrete zones reach surface temperatures up to eight degrees higher than surrounding suburbs. To counter this urban heat island effect, city council has committed to planting thirty thousand drought-tolerant trees along transit corridors. Additionally, starting next fiscal year, commercial buildings exceeding five stories will receive property tax credits if green roofs or vertical gardens cover at least thirty percent of their rooftop area.`,
      questions: [
        {
          id: 'lis-env-q1',
          prompt: 'By how many degrees can downtown surface temperatures exceed surrounding suburbs?',
          options: ['2 degrees', '5 degrees', 'Up to 8 degrees', '12 degrees'],
          answer: 'Up to 8 degrees',
          explanation: 'The speaker notes: "downtown concrete zones reach surface temperatures up to eight degrees higher."'
        },
        {
          id: 'lis-env-q2',
          prompt: 'How many trees will be planted along transit corridors?',
          options: ['3,000', '15,000', '30,000', '50,000'],
          answer: '30,000',
          explanation: 'The speaker states: "committed to planting thirty thousand drought-tolerant trees."'
        },
        {
          id: 'lis-env-q3',
          prompt: 'What incentive is offered to commercial buildings with green roofs?',
          options: ['Free solar panels', 'Property tax credits', 'Fast-track permits', 'Cash rebates'],
          answer: 'Property tax credits',
          explanation: 'The speaker clarifies that commercial buildings "will receive property tax credits if green roofs... cover at least thirty percent."'
        }
      ]
    },
    writing: {
      task1: {
        title: 'Task 1: Renewable Energy Share by Source (2010 - 2024)',
        prompt: 'The line graph shows the proportion of electricity generated from wind, solar, hydro, and fossil fuels in a European country between 2010 and 2024.',
        chartType: 'Trends Line Graph',
        suggestedCollocations: ['exponential surge', 'overtake conventional sources', 'plateau at', 'dramatic decline'],
        chartData: { visualization: 'line', unit: '% of generation', categories: ['2010', '2014', '2018', '2022', '2024'], series: [{ label: 'Wind', values: [8, 14, 22, 31, 35] }, { label: 'Solar', values: [2, 6, 15, 25, 30] }, { label: 'Hydro', values: [24, 23, 22, 21, 20] }, { label: 'Fossil fuels', values: [66, 57, 41, 23, 15] }] }
      },
      task2: {
        title: 'Task 2: Individual Lifestyle Changes vs Government Environmental Mandates',
        prompt: 'Some believe that environmental preservation depends primarily on individual consumer choices, while others argue that only strict government legislation can avert ecological catastrophe. Discuss both sides and give your view.',
        essayType: 'Discussion & Opinion Essay',
        suggestedCollocations: ['carbon footprint', 'ecological degradation', 'legislative mandates', 'consumer conscientiousness', 'systemic transition'],
        outlineIdeas: [
          'Body 1 (Individual responsibility): Grassroots demand drives ethical markets; waste sorting and reduced consumption make direct local impacts.',
          'Body 2 (Government intervention): Corporations generate the vast majority of emissions; subsidies, carbon caps, and penalties enforce systemic compliance.'
        ]
      }
    },
    speaking: {
      part1: [
        'How often do you spend time in parks or nature reserves?',
        'Does your neighborhood have good recycling facilities?',
        'What small habits do you practice to save water or energy at home?'
      ],
      part2: {
        cueCard: 'Describe an environmental law or initiative you think should be implemented in your hometown.',
        bulletPoints: [
          'What the proposed initiative is',
          'Who would be responsible for enforcing or participating in it',
          'What practical challenges might arise during implementation',
          'And explain how this measure would improve local environmental quality.'
        ],
        followUp: 'Do you think young people are more passionate about this than older generations?'
      },
      part3: [
        'Why do developing and developed nations often disagree on emissions targets?',
        'Can technological innovation solve the climate crisis without changes in human consumer behavior?'
      ],
      collocations: ['curb greenhouse gas emissions', 'biodiversity conservation', 'renewable energy transition', 'eco-conscious consumers']
    }
  },
  {
    id: 'technology',
    titleEn: 'Technology & Digital Life',
    titleVi: 'Công nghệ & Đời sống số',
    accent: '#38bdf8',
    badgeColor: '#075985',
    icon: 'Cpu',
    descriptionVi: 'Trí tuệ nhân tạo, tự động hóa, an ninh mạng, quyền riêng tư dữ liệu và tác động xã hội số.',
    vocab: [
      {
        id: 'tech-1',
        term: 'artificial intelligence integration',
        ipa: '/ˌɑːtɪˈfɪʃl ɪnˈtelɪdʒəns ˌɪntɪˈɡreɪʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự tích hợp trí tuệ nhân tạo vào quy trình',
        example: 'Widespread artificial intelligence integration has streamlined diagnostics in medical imaging.',
        collocations: ['accelerate AI integration', 'seamless AI integration']
      },
      {
        id: 'tech-2',
        term: 'algorithmic bias',
        ipa: '/ˌælɡəˈrɪðmɪk ˈbaɪəs/',
        type: 'Collocation · IELTS',
        meaningVi: 'thiên kiến thuật toán (sự sai lệch có hại của AI)',
        example: 'Without rigorous testing, algorithmic bias can reinforce historical disparities in recruitment tools.',
        collocations: ['mitigate algorithmic bias', 'perpetuate algorithmic bias']
      },
      {
        id: 'tech-3',
        term: 'data privacy safeguards',
        ipa: '/ˈdeɪtə ˈprɪvəsi ˈseɪfɡɑːdz/',
        type: 'Collocation · IELTS',
        meaningVi: 'các biện pháp bảo vệ quyền riêng tư dữ liệu',
        example: 'Stricter data privacy safeguards are necessary to prevent the unconsented harvesting of personal metrics.',
        collocations: ['implement data privacy safeguards', 'strengthen data privacy safeguards']
      },
      {
        id: 'tech-4',
        term: 'digital divide',
        ipa: '/ˈdɪdʒɪtl dɪˈvaɪd/',
        type: 'Collocation · IELTS',
        meaningVi: 'khoảng cách số (sự chênh lệch cơ hội tiếp cận công nghệ)',
        example: 'The digital divide leaves rural schoolchildren at a pronounced disadvantage during remote schooling.',
        collocations: ['bridge the digital divide', 'widen the digital divide']
      },
      {
        id: 'tech-5',
        term: 'automation',
        ipa: '/ˌɔːtəˈmeɪʃn/',
        type: 'Academic Word',
        meaningVi: 'tự động hóa',
        example: 'Robotic automation in manufacturing has increased productivity while displacing routine assembly jobs.',
        collocations: ['industrial automation', 'workplace automation']
      },
      {
        id: 'tech-6',
        term: 'cybersecurity resilience',
        ipa: '/ˌsaɪbəsɪˈkjʊərəti rɪˈzɪliəns/',
        type: 'Collocation · IELTS',
        meaningVi: 'khả năng chống chịu và phục hồi an ninh mạng',
        example: 'Financial institutions must continuously upgrade their cybersecurity resilience against ransomware.',
        collocations: ['bolster cybersecurity resilience', 'test cybersecurity resilience']
      },
      {
        id: 'tech-7',
        term: 'ubiquitous computing',
        ipa: '/juːˈbɪkwɪtəs kəmˈpjuːtɪŋ/',
        type: 'Collocation · IELTS',
        meaningVi: 'điện toán phổ biến (thiết bị số hiện diện khắp nơi)',
        example: 'Ubiquitous computing enables smart home devices to anticipate user preferences seamlessly.',
        collocations: ['era of ubiquitous computing']
      },
      {
        id: 'tech-8',
        term: 'a double-edged sword',
        ipa: '/ə ˌdʌbl edʒd ˈsɔːd/',
        type: 'Idiom',
        meaningVi: 'con dao hai lưỡi (mang cả lợi ích lẫn rủi ro lớn)',
        example: 'Social networking algorithms are a double-edged sword: they connect communities while fueling polarization.',
        collocations: ['prove to be a double-edged sword']
      }
    ],
    grammar: [
      {
        id: 'gram-tech-1',
        title: 'Participle Clauses for Concise Technological Exposition',
        level: 'Band 7.5+',
        explanationVi: 'Mệnh đề phân từ (Present/Past Participle) giúp câu văn gọn gàng, học thuật và nối mạch nguyên nhân - kết quả mượt mà.',
        formula: 'Having + Past Participle, Subject + Verb / Present Participle (-ing), Subject + Verb',
        examples: [
          'Having automated redundant data entry, software engineers now concentrate on high-level architecture.',
          'Facilitating instant cross-border communication, cloud platforms have transformed international commerce.'
        ],
        drillPrompt: 'Combine using a participle clause: Smartphones give users constant internet access. They have drastically shortened human attention spans.',
        sampleTransform: 'Giving users constant internet access, smartphones have drastically shortened human attention spans.'
      },
      {
        id: 'gram-tech-2',
        title: 'Nominalisation to Elevate Academic Register',
        level: 'Band 8.0+',
        explanationVi: 'Danh từ hóa (biến động từ/tính từ thành danh từ) giúp giảm phong cách đàm thoại, tăng độ trang trọng trong IELTS Task 2.',
        formula: 'Verb/Adj phrase → Complex Abstract Noun Phrase (e.g. "Because AI is developing rapidly" → "The rapid proliferation of artificial intelligence")',
        examples: [
          'The rapid proliferation of algorithmic feeds has altered adolescent social interactions.',
          'The vulnerability of municipal networks necessitates continuous defensive audits.'
        ],
        drillPrompt: 'Nominalize: "Because companies rely heavily on cloud servers, security breaches cause huge damage."',
        sampleTransform: 'Heavy corporate reliance on cloud infrastructure compounds the damage caused by security breaches.'
      }
    ],
    listening: {
      id: 'lis-tech-1',
      title: 'Workplace Cybersecurity Protocols Briefing',
      level: 'B2 / Band 6.5',
      durationMinutes: 4,
      audioText: `Attention all project leads, this is an update regarding our multi-factor authentication protocol rollout. Commencing next Monday, single-password access to the cloud repository will be disabled. All personnel must install the corporate authenticator app onto their registered devices. Phishing simulation tests will also run quarterly without prior notification. Any employee who inadvertently clicks a simulated suspicious link will be assigned a mandatory forty-five-minute refresher module on social engineering defense.`,
      questions: [
        {
          id: 'lis-tech-q1',
          prompt: 'When will single-password access to the cloud repository be terminated?',
          options: ['Immediately today', 'Next Monday', 'At the end of the quarter', 'In 45 days'],
          answer: 'Next Monday',
          explanation: 'The speaker states: "Commencing next Monday, single-password access... will be disabled."'
        },
        {
          id: 'lis-tech-q2',
          prompt: 'How often will phishing simulation tests be conducted?',
          options: ['Monthly', 'Quarterly', 'Twice a year', 'Annually'],
          answer: 'Quarterly',
          explanation: 'The manager confirms: "Phishing simulation tests will also run quarterly without prior notification."'
        },
        {
          id: 'lis-tech-q3',
          prompt: 'What happens if an employee fails a simulated phishing check?',
          options: ['Loss of security clearance', 'A written reprimand', 'A mandatory 45-minute refresher module', 'A pay deduction'],
          answer: 'A mandatory 45-minute refresher module',
          explanation: 'The speaker clarifies that they "will be assigned a mandatory forty-five-minute refresher module."'
        }
      ]
    },
    writing: {
      task1: {
        title: 'Task 1: AI Adoption Rates Across Industries (2020 - 2025)',
        prompt: 'The table compares the proportion of businesses utilizing AI automated systems in Healthcare, Finance, Logistics, and Education over a five-year period.',
        chartType: 'Comparative Data Table',
        suggestedCollocations: ['lead the cohort', 'surpass the threshold', 'a fourfold increase', 'remain relatively stagnant'],
        chartData: { visualization: 'table', unit: '% of businesses', categories: ['2020', '2021', '2022', '2023', '2024'], series: [{ label: 'Healthcare', values: [18, 24, 31, 39, 47] }, { label: 'Finance', values: [26, 34, 43, 51, 61] }, { label: 'Logistics', values: [12, 20, 29, 38, 49] }, { label: 'Education', values: [8, 13, 19, 25, 32] }] }
      },
      task2: {
        title: 'Task 2: AI Automation and the Future of Human Labor',
        prompt: 'Some analysts predict that artificial intelligence will create more employment opportunities than it eliminates, while others fear mass technological unemployment. Discuss both views and give your opinion.',
        essayType: 'Discussion & Opinion Essay',
        suggestedCollocations: ['artificial intelligence integration', 'automation', 'digital divide', 'displace routine labor', 'cognitive tasks'],
        outlineIdeas: [
          'Body 1 (Job destruction): Routine physical and administrative jobs automated rapidly; retraining older workers is slow and costly.',
          'Body 2 (Job creation): Emergence of prompt engineering, ethics compliance, robotics maintenance; historic tech shifts expanded overall wealth.'
        ]
      }
    },
    speaking: {
      part1: [
        'How much time do you spend using screens each day?',
        'Do you prefer physical books or reading on electronic devices?',
        'What is your most frequently used mobile application?'
      ],
      part2: {
        cueCard: 'Describe an electronic device or application that saves you time.',
        bulletPoints: [
          'What the device or app is and how long you have used it',
          'What specific tasks you use it to accomplish',
          'How it compares to traditional manual methods',
          'And explain how this tool has changed your daily productivity.'
        ],
        followUp: 'Would you feel stressed if you had to manage without it for a week?'
      },
      part3: [
        'Do you think artificial intelligence will ever exhibit genuine human creativity?',
        'How can governments prevent algorithms from deepening social inequality?'
      ],
      collocations: ['a double-edged sword', 'digital divide', 'algorithmic bias', 'streamline daily workflows']
    }
  },
  {
    id: 'health',
    titleEn: 'Health & Well-being',
    titleVi: 'Sức khỏe & Lối sống',
    accent: '#f472b6',
    badgeColor: '#831843',
    icon: 'HeartPulse',
    descriptionVi: 'Y tế cộng đồng, thói quen sinh hoạt, dinh dưỡng, sức khỏe tâm thần và y tế dự phòng.',
    vocab: [
      {
        id: 'hlth-1',
        term: 'preventive healthcare',
        ipa: '/prɪˈventɪv ˈhelθkeə/',
        type: 'Collocation · IELTS',
        meaningVi: 'y tế dự phòng (phòng ngừa trước khi phát bệnh)',
        example: 'Allocating resources to preventive healthcare yields greater economic returns than treating chronic ailments.',
        collocations: ['invest in preventive healthcare', 'prioritise preventive healthcare']
      },
      {
        id: 'hlth-2',
        term: 'sedentary lifestyle',
        ipa: '/ˈsedntri ˈlaɪfstaɪl/',
        type: 'Collocation · IELTS',
        meaningVi: 'lối sống ít vận động, ngồi nhiều',
        example: 'Prolonged desk work fosters a sedentary lifestyle, increasing cardiovascular vulnerability.',
        collocations: ['lead a sedentary lifestyle', 'combat a sedentary lifestyle']
      },
      {
        id: 'hlth-3',
        term: 'dietary habits',
        ipa: '/ˈdaɪətəri ˈhæbɪts/',
        type: 'Collocation · IELTS',
        meaningVi: 'thói quen ăn uống, chế độ dinh dưỡng',
        example: 'Early nutritional literacy helps children cultivate wholesome dietary habits into adulthood.',
        collocations: ['unhealthy dietary habits', 'modify dietary habits']
      },
      {
        id: 'hlth-4',
        term: 'mental well-being',
        ipa: '/ˈmentl ˈwel biːɪŋ/',
        type: 'Collocation · IELTS',
        meaningVi: 'sức khỏe tinh thần, trạng thái an lạc nội tâm',
        example: 'Workplace mindfulness initiatives have a measurable positive effect on employee mental well-being.',
        collocations: ['nurture mental well-being', 'safeguard mental well-being']
      },
      {
        id: 'hlth-5',
        term: 'chronic illness',
        ipa: '/ˈkrɒnɪk ˈɪlnəs/',
        type: 'Collocation · IELTS',
        meaningVi: 'bệnh mãn tính kéo dài',
        example: 'Diabetes and hypertension are chronic illnesses that burden public healthcare expenditures.',
        collocations: ['manage chronic illness', 'prevent chronic illness']
      },
      {
        id: 'hlth-6',
        term: 'circadian rhythm',
        ipa: '/sɜːˈkeɪdiən ˈrɪðəm/',
        type: 'Academic Word',
        meaningVi: 'nhịp sinh học 24 giờ của cơ thể',
        example: 'Blue light emissions from screens disrupt the human circadian rhythm, impairing deep restorative sleep.',
        collocations: ['disrupt the circadian rhythm', 'align with the circadian rhythm']
      },
      {
        id: 'hlth-7',
        term: 'life expectancy',
        ipa: '/ˈlaɪf ɪkˌspektənsi/',
        type: 'Collocation · IELTS',
        meaningVi: 'tuổi thọ trung bình',
        example: 'Sanitation advances and vaccination programs drastically improved global life expectancy in the twentieth century.',
        collocations: ['average life expectancy', 'boost life expectancy']
      },
      {
        id: 'hlth-8',
        term: 'prevention is better than cure',
        ipa: '/prɪˈvenʃn ɪz ˈbetə ðən kjʊə/',
        type: 'Idiom',
        meaningVi: 'phòng bệnh hơn chữa bệnh',
        example: 'Public health ministers insist that prevention is better than cure when combating metabolic disorders.',
        collocations: ['embody the principle that prevention is better than cure']
      }
    ],
    grammar: [
      {
        id: 'gram-hlth-1',
        title: 'The Subjunctive Register for Policy Recommendations',
        level: 'Band 8.0+',
        explanationVi: 'Thể giả định (Subjunctive: It is essential/crucial that + Subject + bare infinitive) thể hiện tính chuẩn mực học thuật trong đề xuất y tế.',
        formula: 'It is essential / imperative / crucial that + Subject + (should) be / do',
        examples: [
          'It is imperative that municipal leaders expand accessible green spaces for outdoor recreation.',
          'Medical associations recommend that processed sugars be taxed at higher rates.'
        ],
        drillPrompt: 'Rewrite using the subjunctive: "The government must ensure hospitals have adequate emergency reserves."',
        sampleTransform: 'It is crucial that the government ensure hospitals possess adequate emergency reserves.'
      },
      {
        id: 'gram-hlth-2',
        title: 'Proportional Comparison (The more..., the more...)',
        level: 'Band 7.0+',
        explanationVi: 'Cấu trúc so sánh đồng tiến để diễn đạt mối tương quan mật thiết giữa thói quen và kết quả sức khỏe.',
        formula: 'The + comparative + Subject + Verb, the + comparative + Subject + Verb',
        examples: [
          'The more sedentary an individual’s routine becomes, the greater their risk of metabolic syndrome.',
          'The earlier preventive health habits are ingrained, the longer one’s healthy lifespan extends.'
        ],
        drillPrompt: 'Combine: "When people sleep less, their immune resistance becomes weaker."',
        sampleTransform: 'The less sleep individuals obtain, the weaker their immune resistance becomes.'
      }
    ],
    listening: {
      id: 'lis-hlth-1',
      title: 'Community Nutrition & Active Living Workshop',
      level: 'B2 / Band 6.5',
      durationMinutes: 4,
      audioText: `Good evening everyone. Welcome to the Community Health Outreach seminar. Today we are addressing the rising incidence of adult-onset diabetes in metropolitan districts. Our clinical trial tracking four hundred local residents found that thirty minutes of brisk walking five days per week lowered fasting blood glucose by eighteen percent. Furthermore, replacing sugary carbonated beverages with unflavored sparkling water resulted in an average weight reduction of three kilograms over three months. Registration for our free weekend walking club opens at the front desk after this presentation.`,
      questions: [
        {
          id: 'lis-hlth-q1',
          prompt: 'What physical activity routine was recommended in the clinical trial?',
          options: ['60 minutes of running daily', '30 minutes of brisk walking 5 days a week', 'Weightlifting twice weekly', 'Yoga on weekends'],
          answer: '30 minutes of brisk walking 5 days a week',
          explanation: 'The presenter notes: "thirty minutes of brisk walking five days per week lowered fasting blood glucose."'
        },
        {
          id: 'lis-hlth-q2',
          prompt: 'By what percentage did fasting blood glucose decline?',
          options: ['8 percent', '12 percent', '18 percent', '25 percent'],
          answer: '18 percent',
          explanation: 'The speaker explicitly states it "lowered fasting blood glucose by eighteen percent."'
        },
        {
          id: 'lis-hlth-q3',
          prompt: 'What average weight loss was observed from replacing sugary drinks with water?',
          options: ['1 kilogram', '3 kilograms', '5 kilograms', '7 kilograms'],
          answer: '3 kilograms',
          explanation: 'The speaker quotes: "an average weight reduction of three kilograms over three months."'
        }
      ]
    },
    writing: {
      task1: {
        title: 'Task 1: Healthcare Spending vs Life Expectancy',
        prompt: 'The scatter plot illustrates healthcare expenditure per capita and average life expectancy across twelve OECD nations in 2023.',
        chartType: 'Correlation Scatter Plot',
        suggestedCollocations: ['positive correlation', 'diminishing returns', 'outlier nation', 'significant expenditure gap'],
        chartData: { visualization: 'scatter', unit: 'USD per capita / years', categories: ['900', '1400', '1900', '2400', '2900', '3400'], series: [{ label: 'Life expectancy', values: [71, 74, 76, 78, 80, 81] }] }
      },
      task2: {
        title: 'Task 2: Junk Food Taxation vs Personal Freedom',
        prompt: 'In many countries, governments are contemplating heavy taxes on fast food and sugary snacks to curb obesity. Some contend this penalizes consumers unfairly. Discuss both views and give your opinion.',
        essayType: 'Discussion & Opinion Essay',
        suggestedCollocations: ['preventive healthcare', 'sedentary lifestyle', 'dietary habits', 'fiscal deterrent', 'public healthcare burden'],
        outlineIdeas: [
          'Body 1 (Opposing tax): Free consumer choice; low-income households depend on cheap calories; regressive financial burden.',
          'Body 2 (Supporting tax): Obesity imposes immense strain on public hospitals; similar tobacco excise successfully reduced smoking; revenue can subsidize fresh produce.'
        ]
      }
    },
    speaking: {
      part1: [
        'Do you consider yourself an active person?',
        'How many hours of sleep do you typically get each night?',
        'What healthy dish can you prepare by yourself?'
      ],
      part2: {
        cueCard: 'Describe a healthy habit or lifestyle change you recently adopted.',
        bulletPoints: [
          'What the habit or change is and when you initiated it',
          'What motivated you to make this adjustment',
          'How difficult it was to maintain at the beginning',
          'And explain how this practice has enhanced your daily well-being.'
        ],
        followUp: 'Have any of your friends or family followed your example?'
      },
      part3: [
        'Should physical fitness be a mandatory graduation requirement for university students?',
        'How does modern urban architecture encourage or discourage active daily movement?'
      ],
      collocations: ['sedentary lifestyle', 'circadian rhythm', 'mental well-being', 'prevention is better than cure']
    }
  },
  {
    id: 'work',
    titleEn: 'Work & Employment',
    titleVi: 'Việc làm & Kinh tế',
    accent: '#fbbf24',
    badgeColor: '#78350f',
    icon: 'Briefcase',
    descriptionVi: 'Thị trường lao động, làm việc từ xa, cân bằng công việc - cuộc sống và kinh tế tri thức.',
    vocab: [
      {
        id: 'work-1',
        term: 'work-life balance',
        ipa: '/wɜːk laɪf ˈbæləns/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự cân bằng giữa công việc và đời sống cá nhân',
        example: 'Flexible scheduling empowers employees to sustain a wholesome work-life balance.',
        collocations: ['maintain work-life balance', 'compromise work-life balance']
      },
      {
        id: 'work-2',
        term: 'remote workforce',
        ipa: '/rɪˈməʊt ˈwɜːkfɔːs/',
        type: 'Collocation · IELTS',
        meaningVi: 'lực lượng lao động làm việc từ xa',
        example: 'Managing a distributed remote workforce requires transparent asynchronous communication protocols.',
        collocations: ['coordinate a remote workforce', 'global remote workforce']
      },
      {
        id: 'work-3',
        term: 'job satisfaction',
        ipa: '/dʒɒb ˌsætɪsˈfækʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'mức độ hài lòng với công việc',
        example: 'Autonomy and peer recognition correlate more strongly with job satisfaction than salary alone.',
        collocations: ['enhance job satisfaction', 'derive job satisfaction']
      },
      {
        id: 'work-4',
        term: 'professional development',
        ipa: '/prəˈfeʃənl dɪˈveləpmənt/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự phát triển kỹ năng chuyên môn liên tục',
        example: 'Firms that fund ongoing professional development experience lower annual staff turnover.',
        collocations: ['invest in professional development', 'opportunities for professional development']
      },
      {
        id: 'work-5',
        term: 'gig economy',
        ipa: '/ɡɪɡ ɪˈkɒnəmi/',
        type: 'Collocation · IELTS',
        meaningVi: 'nền kinh tế việc làm tự do / thời vụ',
        example: 'While the gig economy offers flexible hours, it frequently lacks healthcare and pension protections.',
        collocations: ['participate in the gig economy', 'expand the gig economy']
      },
      {
        id: 'work-6',
        term: 'burnout',
        ipa: '/ˈbɜːnaʊt/',
        type: 'Academic Word',
        meaningVi: 'hội chứng kiệt sức vì công việc quá tải',
        example: 'Excessive overtime and relentless deadlines are leading catalysts of professional burnout.',
        collocations: ['suffer from burnout', 'prevent workplace burnout']
      },
      {
        id: 'work-7',
        term: 'career advancement',
        ipa: '/kəˈrɪər ədˈvɑːnsmənt/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự thăng tiến trong sự nghiệp',
        example: 'Mentorship programs provide structured pathways for career advancement for underrepresented staff.',
        collocations: ['achieve career advancement', 'barriers to career advancement']
      },
      {
        id: 'work-8',
        term: 'climb the corporate ladder',
        ipa: '/klaɪm ðə ˈkɔːpərət ˈlædə/',
        type: 'Idiom',
        meaningVi: 'thăng tiến từng nấc thang danh vọng doanh nghiệp',
        example: 'Many ambitious young graduates prioritize climbing the corporate ladder above personal hobbies.',
        collocations: ['determined to climb the corporate ladder']
      }
    ],
    grammar: [
      {
        id: 'gram-work-1',
        title: 'Relative Clauses with Prepositional Fronting',
        level: 'Band 7.5+',
        explanationVi: 'Mệnh đề quan hệ đi kèm giới từ đảo lên trước đại từ quan hệ (in which, under which, by means of which) tạo độ trang trọng cao.',
        formula: 'Noun + Preposition + which/whom + Subject + Verb',
        examples: [
          'Remote work introduces conditions under which employees exercise unprecedented autonomy.',
          'Mentorship establishes a framework within which junior specialists can safely experiment.'
        ],
        drillPrompt: 'Combine: "Modern firms operate in complex environments. Disruption is frequent in these environments."',
        sampleTransform: 'Modern firms operate in complex environments within which disruption is frequent.'
      },
      {
        id: 'gram-work-2',
        title: 'Concession Clauses with "Notwithstanding" & "Albeit"',
        level: 'Band 8.0+',
        explanationVi: 'Mệnh đề nhượng bộ nâng cao thể hiện sự nhìn nhận đa chiều và sắc sảo trong IELTS Writing Task 2.',
        formula: 'Notwithstanding + Noun Phrase, Clause / Clause, albeit + Adjective/Adverb',
        examples: [
          'Notwithstanding occasional feelings of isolation, telecommuters report higher overall productivity.',
          'The team achieved their annual target, albeit at the expense of considerable overtime.'
        ],
        drillPrompt: 'Rewrite using "Notwithstanding": Although there are initial training costs, automation raises profitability.',
        sampleTransform: 'Notwithstanding initial training expenditures, automation substantially enhances profitability.'
      }
    ],
    listening: {
      id: 'lis-work-1',
      title: 'Human Resources Hybrid Work Policy Announcement',
      level: 'B2 / Band 6.5',
      durationMinutes: 4,
      audioText: `Good morning team members. I am pleased to present the framework for our permanent hybrid working model. Effective November first, full-time staff may work remotely up to two days per week, with Wednesday designated as a mandatory anchor day when all departments gather in person for collaborative brainstorming. To equip home offices ergonomically, each employee will be eligible for a one-time setup stipend of five hundred dollars, claimable through the expense portal before the end of the current quarter.`,
      questions: [
        {
          id: 'lis-work-q1',
          prompt: 'How many days per week are employees permitted to work remotely?',
          options: ['One day', 'Up to two days', 'Up to four days', 'Full-time permanently'],
          answer: 'Up to two days',
          explanation: 'The HR manager states: "full-time staff may work remotely up to two days per week."'
        },
        {
          id: 'lis-work-q2',
          prompt: 'Which day is designated as the mandatory in-person anchor day?',
          options: ['Monday', 'Wednesday', 'Friday', 'Thursday'],
          answer: 'Wednesday',
          explanation: 'The announcement specifies: "with Wednesday designated as a mandatory anchor day."'
        },
        {
          id: 'lis-work-q3',
          prompt: 'What is the amount of the one-time home office equipment stipend?',
          options: ['$250', '$500', '$750', '$1,000'],
          answer: '$500',
          explanation: 'The speaker quotes: "a one-time setup stipend of five hundred dollars."'
        }
      ]
    },
    writing: {
      task1: {
        title: 'Task 1: Employment Distribution by Sector (2000 vs 2024)',
        prompt: 'The pie charts illustrate the proportion of workers employed in Agriculture, Manufacturing, Services, and the Digital Sector in 2000 and 2024.',
        chartType: 'Comparative Pie Charts',
        suggestedCollocations: ['command the largest share', 'shrink substantially', 'quadruple in volume', 'marginal contraction'],
        chartData: { visualization: 'pie', unit: '% of workforce', categories: ['Agriculture', 'Manufacturing', 'Services', 'Digital'], series: [{ label: '2000', values: [28, 32, 35, 5] }, { label: '2024', values: [10, 22, 48, 20] }] }
      },
      task2: {
        title: 'Task 2: The Four-Day Work Week Trial',
        prompt: 'Several countries and multinational corporations are trialing a four-day work week with no reduction in salary. Proponents argue this improves employee well-being and productivity, while opponents claim it harms customer responsiveness. Discuss both views and give your opinion.',
        essayType: 'Discussion & Opinion Essay',
        suggestedCollocations: ['work-life balance', 'job satisfaction', 'burnout', 'productivity paradox', 'operational continuity'],
        outlineIdeas: [
          'Body 1 (Benefits): Lower absenteeism and burnout; reduced commute emissions; focused working hours eliminate trivial meetings.',
          'Body 2 (Challenges): Service industries require round-the-clock staffing; potential overtime on remaining work days; client communication delays.'
        ]
      }
    },
    speaking: {
      part1: [
        'Do you currently study or are you working?',
        'What kind of work environment do you feel most productive in?',
        'Do you prefer collaborating in a team or completing tasks independently?'
      ],
      part2: {
        cueCard: 'Describe a challenging project or job task you successfully completed.',
        bulletPoints: [
          'What the project or task entailed',
          'What obstacles or time pressures you faced',
          'How you cooperated with others or solved difficulties',
          'And explain how you felt when the work was delivered.'
        ],
        followUp: 'Would you tackle a similar challenge in the same way again?'
      },
      part3: [
        'How has the rise of telecommuting changed the relationship between employer and employee?',
        'Do you believe job loyalty to a single company for decades is now obsolete?'
      ],
      collocations: ['work-life balance', 'climb the corporate ladder', 'professional development', 'gig economy']
    }
  },
  {
    id: 'cities',
    titleEn: 'Cities & Urban Life',
    titleVi: 'Đô thị & Phát triển',
    accent: '#a78bfa',
    badgeColor: '#4c1d95',
    icon: 'Building2',
    descriptionVi: 'Quy hoạch đô thị, giao thông công cộng, nhà ở, hạ tầng thông minh và đời sống thành thị.',
    vocab: [
      {
        id: 'city-1',
        term: 'urban sprawl',
        ipa: '/ˈɜːbən sprɔːl/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự mở rộng đô thị tràn lan, thiếu kiểm soát',
        example: 'Uncontrolled urban sprawl swallows fertile agricultural land and inflates infrastructure costs.',
        collocations: ['curb urban sprawl', 'consequences of urban sprawl']
      },
      {
        id: 'city-2',
        term: 'transit-oriented development',
        ipa: '/ˈtrænzɪt ˌɔːriəntɪd dɪˈveləpmənt/',
        type: 'Collocation · IELTS',
        meaningVi: 'phát triển đô thị lấy giao thông công cộng làm trọng tâm (TOD)',
        example: 'Transit-oriented development clusters apartments and grocery stores within walking distance of metro hubs.',
        collocations: ['implement transit-oriented development', 'principles of transit-oriented development']
      },
      {
        id: 'city-3',
        term: 'affordable housing shortage',
        ipa: '/əˈfɔːdəbl ˈhaʊzɪŋ ˈʃɔːtɪdʒ/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự khan hiếm nhà ở giá phải chăng',
        example: 'Soaring land values have precipitated a severe affordable housing shortage in metropolitan centers.',
        collocations: ['tackle affordable housing shortage', 'exacerbate affordable housing shortage']
      },
      {
        id: 'city-4',
        term: 'pedestrianized zone',
        ipa: '/pəˈdestriənaɪzd zəʊn/',
        type: 'Collocation · IELTS',
        meaningVi: 'khu phố đi bộ (cấm xe cơ giới)',
        example: 'Converting historic city streets into pedestrianized zones boosts foot traffic for local shopkeepers.',
        collocations: ['designate pedestrianized zones', 'thriving pedestrianized zone']
      },
      {
        id: 'city-5',
        term: 'traffic congestion',
        ipa: '/ˈtræfɪk kənˈdʒestʃən/',
        type: 'Collocation · IELTS',
        meaningVi: 'ùn tắc giao thông đô thị',
        example: 'Congestion pricing schemes aim to alleviate gridlock and traffic congestion during morning rush hours.',
        collocations: ['ease traffic congestion', 'chronic traffic congestion']
      },
      {
        id: 'city-6',
        term: 'gentrification',
        ipa: '/ˌdʒentrɪfɪˈkeɪʃn/',
        type: 'Academic Word',
        meaningVi: 'sự chỉnh trang đô thị (dẫn đến tăng giá nhà và đẩy cư dân cũ đi)',
        example: 'Gentrification revitalizes decaying neighborhoods but frequently displaces lower-income heritage residents.',
        collocations: ['rapid gentrification', 'wave of gentrification']
      },
      {
        id: 'city-7',
        term: 'green infrastructure',
        ipa: '/ɡriːn ˈɪnfrəstrʌktʃə/',
        type: 'Collocation · IELTS',
        meaningVi: 'hạ tầng xanh (công viên, mái nhà xanh, hành lang nước)',
        example: 'Permeable pavements and rain gardens constitute vital green infrastructure for flood resilience.',
        collocations: ['invest in green infrastructure', 'integrate green infrastructure']
      },
      {
        id: 'city-8',
        term: 'concrete jungle',
        ipa: '/ˈkɒŋkriːt ˈdʒʌŋɡl/',
        type: 'Idiom',
        meaningVi: 'rừng bê tông (thành phố ngột ngạt thiếu cây xanh)',
        example: 'Architects are determined to prevent the capital from deteriorating into an impersonal concrete jungle.',
        collocations: ['escape the concrete jungle']
      }
    ],
    grammar: [
      {
        id: 'gram-city-1',
        title: 'Fronted Adverbials of Place & Movement',
        level: 'Band 7.5+',
        explanationVi: 'Trạng từ chỉ nơi chốn đặt đầu câu đảo ngữ để tạo tính miêu tả sống động trong IELTS Writing & Speaking.',
        formula: 'Prepositional phrase of location + Verb + Subject',
        examples: [
          'Along the riverbanks now stand landscaped promenades replacing dilapidated industrial warehouses.',
          'At the heart of the transit-oriented development lies an integrated multimodal transportation terminal.'
        ],
        drillPrompt: 'Invert: Modern metro stations lie beneath the historical city center.',
        sampleTransform: 'Beneath the historical city center lie modern metro stations.'
      },
      {
        id: 'gram-city-2',
        title: 'Complex Comparison with "By Far" & "Nowhere Near"',
        level: 'Band 7.0+',
        explanationVi: 'Cấu trúc so sánh chênh lệch lớn phục vụ viết Task 1 và nhấn mạnh luận điểm Task 2.',
        formula: 'Subject + Verb + by far the + superlative / nowhere near as + adjective + as',
        examples: [
          'Subway systems are by far the most energy-efficient mechanism for moving millions of daily commuters.',
          'Bicycle lane connectivity in suburban fringes is nowhere near as comprehensive as in inner-city wards.'
        ],
        drillPrompt: 'Express using "nowhere near as": Private cars are much less efficient than light rail.',
        sampleTransform: 'Private cars are nowhere near as efficient as light rail networks.'
      }
    ],
    listening: {
      id: 'lis-city-1',
      title: 'City Planning Council: Light Rail Extension Project',
      level: 'B2 / Band 6.5',
      durationMinutes: 4,
      audioText: `Good afternoon residents. This hearing details Phase Three of our light rail transit expansion into the northern suburbs. Construction is slated to begin in March, with an anticipated twelve-month timeline. The new six-kilometer route will feature five stations, each outfitted with secure bicycle lockers and electric vehicle charging bays. Fares will be fully integrated with existing bus ticketing, meaning riders will pay no surcharge when transferring between modes within a ninety-minute transit window.`,
      questions: [
        {
          id: 'lis-city-q1',
          prompt: 'What is the projected duration of the construction phase?',
          options: ['6 months', '12 months', '18 months', '24 months'],
          answer: '12 months',
          explanation: 'The city representative specifies: "with an anticipated twelve-month timeline."'
        },
        {
          id: 'lis-city-q2',
          prompt: 'How many new stations will be built along the six-kilometer route?',
          options: ['Three', 'Four', 'Five', 'Six'],
          answer: 'Five',
          explanation: 'The speaker explicitly announces: "The new six-kilometer route will feature five stations."'
        },
        {
          id: 'lis-city-q3',
          prompt: 'Within what transfer window are riders exempt from additional transfer fees?',
          options: ['45 minutes', '60 minutes', '90 minutes', 'Two hours'],
          answer: '90 minutes',
          explanation: 'The official states: "when transferring between modes within a ninety-minute transit window."'
        }
      ]
    },
    writing: {
      task1: {
        title: 'Task 1: Commuter Transit Modes in Capital City (2015 - 2025)',
        prompt: 'The stacked bar chart depicts the percentage breakdown of daily commutes made by private car, bicycle, bus, and metro across four capital cities.',
        chartType: 'Stacked Bar Chart',
        suggestedCollocations: ['account for an overwhelming share', 'a threefold surge', 'surpass car usage', 'marginal adoption'],
        chartData: { visualization: 'stacked', unit: '% of daily commutes', categories: ['2015', '2020', '2025'], series: [{ label: 'Private car', values: [52, 45, 38] }, { label: 'Bicycle', values: [8, 11, 15] }, { label: 'Bus', values: [24, 25, 26] }, { label: 'Metro', values: [16, 19, 21] }] }
      },
      task2: {
        title: 'Task 2: High-Density Vertical Cities vs Suburban Expansion',
        prompt: 'To accommodate growing urban populations, some urbanists champion high-density vertical development with high-rise apartment towers, while others favor outward suburban expansion with single-family houses. Discuss both views and give your opinion.',
        essayType: 'Discussion & Opinion Essay',
        suggestedCollocations: ['urban sprawl', 'transit-oriented development', 'affordable housing shortage', 'green infrastructure', 'compact city'],
        outlineIdeas: [
          'Body 1 (High-rise density): Minimizes infrastructure cost; preserves surrounding agricultural wilderness; makes metro transit economically feasible.',
          'Body 2 (Suburban housing): Greater living space for families; privacy and yards; reduced feeling of claustrophobia in high-density concrete jungles.'
        ]
      }
    },
    speaking: {
      part1: [
        'Do you live in a house or an apartment building?',
        'What is your favorite neighborhood in your city and why?',
        'How do you usually commute around your hometown?'
      ],
      part2: {
        cueCard: 'Describe a city you have visited that impressed you with its public infrastructure.',
        bulletPoints: [
          'Where this city is and when you traveled there',
          'What aspects of its urban design or transport stood out',
          'How citizens utilized public spaces and transit',
          'And explain why you believe this city serves as a role model for other urban centers.'
        ],
        followUp: 'Would you consider relocating there permanently?'
      },
      part3: [
        'How can cities preserve historical cultural landmarks while modernizing high-density infrastructure?',
        'Do you believe private cars should be banned from all metropolitan city centers?'
      ],
      collocations: ['urban sprawl', 'pedestrianized zone', 'concrete jungle', 'green infrastructure']
    }
  },
  {
    id: 'crime',
    titleEn: 'Crime & Justice',
    titleVi: 'Tội phạm & Pháp luật',
    accent: '#f87171',
    badgeColor: '#7f1d1d',
    icon: 'Scale',
    descriptionVi: 'Phòng chống tội phạm, hệ thống tư pháp, cải tạo phạm nhân và nguyên nhân xã hội.',
    vocab: [
      {
        id: 'crm-1',
        term: 'rehabilitation programme',
        ipa: '/ˌriːəˌbɪlɪˈteɪʃn ˈprəʊɡræm/',
        type: 'Collocation · IELTS',
        meaningVi: 'chương trình cải tạo, phục hồi nhân phẩm phạm nhân',
        example: 'Effective rehabilitation programmes equip former offenders with marketable carpentry and welding skills.',
        collocations: ['participate in rehabilitation programmes', 'vocational rehabilitation programme']
      },
      {
        id: 'crm-2',
        term: 'recidivism rate',
        ipa: '/rɪˈsɪdɪvɪzəm reɪt/',
        type: 'Collocation · IELTS',
        meaningVi: 'tỷ lệ tái phạm tội',
        example: 'Community-based restorative justice courts have produced a notable reduction in recidivism rates.',
        collocations: ['lower recidivism rate', 'high recidivism rate']
      },
      {
        id: 'crm-3',
        term: 'deterrent effect',
        ipa: '/dɪˈterənt ɪˈfekt/',
        type: 'Collocation · IELTS',
        meaningVi: 'tác dụng răn đe, ngăn chặn hành vi vi phạm',
        example: 'Criminologists debate whether harsher custodial sentences exert a meaningful deterrent effect on youth crime.',
        collocations: ['act as a deterrent', 'strong deterrent effect']
      },
      {
        id: 'crm-4',
        term: 'custodial sentence',
        ipa: '/kʌˈstəʊdiəl ˈsentəns/',
        type: 'Collocation · IELTS',
        meaningVi: 'án tù giam',
        example: 'First-time non-violent offenders often receive community service orders rather than a custodial sentence.',
        collocations: ['serve a custodial sentence', 'hand down a custodial sentence']
      },
      {
        id: 'crm-5',
        term: 'social reintegration',
        ipa: '/ˈsəʊʃl ˌriːɪntɪˈɡreɪʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự tái hòa nhập xã hội',
        example: 'Criminal record disclosure laws can unintentionally obstruct social reintegration and stable employment.',
        collocations: ['facilitate social reintegration', 'smooth social reintegration']
      },
      {
        id: 'crm-6',
        term: 'juvenile delinquency',
        ipa: '/ˈdʒuːvənaɪl dɪˈlɪŋkwənsi/',
        type: 'Collocation · IELTS',
        meaningVi: 'tội phạm vị thành niên',
        example: 'Investing in after-school athletic leagues is a verified intervention against juvenile delinquency.',
        collocations: ['stem juvenile delinquency', 'roots of juvenile delinquency']
      },
      {
        id: 'crm-7',
        term: 'community service order',
        ipa: '/kəˈmjuːnəti ˈsɜːvɪs ˈɔːdə/',
        type: 'Collocation · IELTS',
        meaningVi: 'lao động công ích phục vụ cộng đồng',
        example: 'Perpetrators of minor vandalism were sentenced to two hundred hours of community service.',
        collocations: ['perform community service', 'mandate community service']
      },
      {
        id: 'crm-8',
        term: 'an eye for an eye',
        ipa: '/ən aɪ fər ən aɪ/',
        type: 'Idiom',
        meaningVi: 'ăn miếng trả miếng, nợ máu trả máu (hình phạt báo thù)',
        example: 'Progressive legal systems reject an eye for an eye approach in favor of restorative restitution.',
        collocations: ['reject the notion of an eye for an eye']
      }
    ],
    grammar: [
      {
        id: 'gram-crm-1',
        title: 'Modal Verbs of Obligation with Perfect Infinitives',
        level: 'Band 7.5+',
        explanationVi: 'Động từ khuyết thiếu quá khứ (Should have / Could have / Ought to have) để phân tích phê phán các chính sách tư pháp trong quá khứ.',
        formula: 'Subject + should / ought to have + Past Participle',
        examples: [
          'Governments ought to have allocated more funds to mental healthcare before closing community support centers.',
          'Judges could have utilized electronic monitoring instead of imposing custodial detention.'
        ],
        drillPrompt: 'Formulate a critical sentence: "Authorities failed to address youth unemployment, which caused crime to spike."',
        sampleTransform: 'Authorities should have addressed youth unemployment to avert the subsequent surge in petty offenses.'
      },
      {
        id: 'gram-crm-2',
        title: 'Emphatic "Do/Does/Did" for Nuanced Rebuttals',
        level: 'Band 7.0+',
        explanationVi: 'Trợ động từ nhấn mạnh (do/does/did + verb) dùng để công nhận một phần sự thật trước khi đưa ra phản đề sâu sắc.',
        formula: 'While X does + Verb, Y + Verb',
        examples: [
          'While surveillance cameras do deter opportunistic theft, they do not resolve the root socioeconomic drivers of organized crime.',
          'Harsh sentencing does satisfy public demand for retribution, yet it fails to suppress recidivism.'
        ],
        drillPrompt: 'Express contrast using emphatic "do": "Imprisonment protects society temporarily, but it fails to reform offenders."',
        sampleTransform: 'While imprisonment does provide temporary societal protection, it fails to rehabilitate perpetrators.'
      }
    ],
    listening: {
      id: 'lis-crm-1',
      title: 'Restorative Justice Pilot Program Review',
      level: 'B2 / Band 6.5',
      durationMinutes: 4,
      audioText: `Good morning colleagues. Today we evaluate the two-year findings from the restorative justice pilot implemented across four regional courts. Under this initiative, non-violent property crime perpetrators met with consenting victims in guided mediation conferences. Over the evaluation window, eighty-two percent of participating victims reported feeling genuine resolution. More crucially, the two-year recidivism rate for offenders in the mediation group stood at twelve percent, compared to twenty-nine percent among individuals sentenced through standard punitive trial tracks.`,
      questions: [
        {
          id: 'lis-crm-q1',
          prompt: 'What category of crime was included in the pilot initiative?',
          options: ['Violent assault', 'Non-violent property crime', 'Corporate tax fraud', 'Traffic violations'],
          answer: 'Non-violent property crime',
          explanation: 'The speaker states: "Under this initiative, non-violent property crime perpetrators met with consenting victims."'
        },
        {
          id: 'lis-crm-q2',
          prompt: 'What proportion of participating victims reported a feeling of resolution?',
          options: ['50 percent', '68 percent', '82 percent', '95 percent'],
          answer: '82 percent',
          explanation: 'The evaluator notes: "eighty-two percent of participating victims reported feeling genuine resolution."'
        },
        {
          id: 'lis-crm-q3',
          prompt: 'What was the two-year recidivism rate for the mediation cohort versus standard trials?',
          options: ['5% vs 15%', '12% vs 29%', '20% vs 40%', '10% vs 50%'],
          answer: '12% vs 29%',
          explanation: 'The speaker explicitly reports: "twelve percent, compared to twenty-nine percent among individuals sentenced through standard punitive trial tracks."'
        }
      ]
    },
    writing: {
      task1: {
        title: 'Task 1: Crime Rates by Category Over Two Decades',
        prompt: 'The multi-line chart illustrates reported incidents of burglary, cyber fraud, vehicle theft, and violent assault per 100,000 citizens from 2004 to 2024.',
        chartType: 'Longitudinal Trend Chart',
        suggestedCollocations: ['exhibit a precipitous decline', 'a steady downward trajectory', 'a tenfold escalation', 'remain virtually unchanged'],
        chartData: { visualization: 'line', unit: 'incidents per 100,000', categories: ['2004', '2009', '2014', '2019', '2024'], series: [{ label: 'Burglary', values: [620, 540, 410, 300, 220] }, { label: 'Cyber fraud', values: [35, 90, 180, 330, 510] }, { label: 'Vehicle theft', values: [280, 260, 240, 230, 225] }, { label: 'Violent assault', values: [110, 120, 118, 125, 122] }] }
      },
      task2: {
        title: 'Task 2: Rehabilitation vs Punitive Prison Sentences',
        prompt: 'Many believe that the chief purpose of prisons should be the education and vocational rehabilitation of prisoners. Others insist that severe punishment and isolation from society are the only ways to prevent crime. Discuss both views and give your opinion.',
        essayType: 'Discussion & Opinion Essay',
        suggestedCollocations: ['rehabilitation programme', 'recidivism rate', 'deterrent effect', 'custodial sentence', 'social reintegration'],
        outlineIdeas: [
          'Body 1 (Punitive deterrence): Upholds moral justice for victims; incapacitates dangerous individuals; serves as an unmistakable warning to potential wrongdoers.',
          'Body 2 (Rehabilitation focus): Most prisoners eventually rejoin society; without education, they revert to criminal networks; lowers long-term recidivism.'
        ]
      }
    },
    speaking: {
      part1: [
        'Do you feel safe walking in your neighborhood at night?',
        'Do you enjoy watching legal crime dramas or detective stories?',
        'What should citizens do if they lose personal property in a public place?'
      ],
      part2: {
        cueCard: 'Describe a rule or regulation at your school or workplace that you found helpful.',
        bulletPoints: [
          'What the rule or regulation was',
          'Why management or faculty introduced it',
          'How people reacted when it was initially established',
          'And explain how this rule maintained fairness and harmony.'
        ],
        followUp: 'Was anyone ever penalized for breaking it?'
      },
      part3: [
        'Why do people commit cybercrimes despite stringent electronic monitoring?',
        'Should juvenile offenders be tried in the same court system as adults?'
      ],
      collocations: ['rehabilitation programme', 'deterrent effect', 'an eye for an eye', 'social reintegration']
    }
  },
  {
    id: 'culture',
    titleEn: 'Culture & Heritage',
    titleVi: 'Văn hóa & Di sản',
    accent: '#f59e0b',
    badgeColor: '#78350f',
    icon: 'Palette',
    descriptionVi: 'Bảo tồn di sản, giao thoa văn hóa, nghệ thuật truyền thống, ngôn ngữ bản địa và toàn cầu hóa.',
    vocab: [
      {
        id: 'cul-1',
        term: 'cultural preservation',
        ipa: '/ˈkʌltʃərəl ˌprezəˈveɪʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự bảo tồn và gìn giữ văn hóa truyền thống',
        example: 'State subsidies for indigenous craft guilds are instrumental for enduring cultural preservation.',
        collocations: ['champion cultural preservation', 'imperative of cultural preservation']
      },
      {
        id: 'cul-2',
        term: 'cultural homogenization',
        ipa: '/ˈkʌltʃərəl həˌmɒdʒənaɪˈzeɪʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự đồng nhất hóa văn hóa (mất đi bản sắc riêng do toàn cầu hóa)',
        example: 'Critics warn that global corporate franchises cause cultural homogenization in historic commercial districts.',
        collocations: ['resist cultural homogenization', 'threat of cultural homogenization']
      },
      {
        id: 'cul-3',
        term: 'intangible heritage',
        ipa: '/ɪnˈtændʒəbl ˈherɪtɪdʒ/',
        type: 'Collocation · IELTS',
        meaningVi: 'di sản văn hóa phi vật thể (dân ca, lễ hội, bí quyết nghề)',
        example: 'Oral storytelling and traditional puppetry are officially recognized as vital intangible heritage.',
        collocations: ['safeguard intangible heritage', 'UNESCO intangible heritage']
      },
      {
        id: 'cul-4',
        term: 'endangered language',
        ipa: '/ɪnˈdeɪndʒəd ˈlæŋɡwɪdʒ/',
        type: 'Collocation · IELTS',
        meaningVi: 'ngôn ngữ có nguy cơ biến mất',
        example: 'Linguists record conversational audio to preserve endangered languages before their final fluent speakers pass away.',
        collocations: ['revitalize endangered languages', 'archive endangered languages']
      },
      {
        id: 'cul-5',
        term: 'multiculturalism',
        ipa: '/ˌmʌltiˈkʌltʃərəˌlɪzəm/',
        type: 'Academic Word',
        meaningVi: 'chủ nghĩa đa văn hóa (sự cùng tồn tại hài hòa của nhiều văn hóa)',
        example: 'Metropolitan centers thrive on multiculturalism, which fosters artistic fusion and culinary innovation.',
        collocations: ['celebrate multiculturalism', 'embrace multiculturalism']
      },
      {
        id: 'cul-6',
        term: 'cross-cultural communication',
        ipa: '/ˌkrɒs ˈkʌltʃərəl kəˌmjuːnɪˈkeɪʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'giao tiếp và thấu hiểu liên văn hóa',
        example: 'Diplomats undergo rigorous training in cross-cultural communication to avert unintentional diplomatic offenses.',
        collocations: ['master cross-cultural communication', 'effective cross-cultural communication']
      },
      {
        id: 'cul-7',
        term: 'historical artifact',
        ipa: '/hɪˈstɒrɪkl ˈɑːtɪfækt/',
        type: 'Collocation · IELTS',
        meaningVi: 'hiện vật lịch sử, cổ vật',
        example: 'International repatriation treaties require colonial museums to return sacred historical artifacts to indigenous origins.',
        collocations: ['unearth historical artifacts', 'repatriate historical artifacts']
      },
      {
        id: 'cul-8',
        term: 'when in Rome, do as the Romans do',
        ipa: '/wen ɪn rəʊm duː æz ðə ˈrəʊmənz duː/',
        type: 'Idiom',
        meaningVi: 'nhập gia tùy tục (tôn trọng phong tục tập quán sở tại)',
        example: 'Seasoned travelers heed the proverb: when in Rome, do as the Romans do, observing modest dining etiquettes.',
        collocations: ['follow the advice: when in Rome, do as the Romans do']
      }
    ],
    grammar: [
      {
        id: 'gram-cul-1',
        title: 'Compound Noun Pre-modification for Rich Cultural Descriptions',
        level: 'Band 7.5+',
        explanationVi: 'Sử dụng cụm danh từ ghép có cấu trúc tính từ hóa (Hyphenated Pre-modifiers) để mô tả tinh tế đặc điểm di sản.',
        formula: 'Hyphenated Adjective-Noun / Participle + Head Noun (e.g. community-led heritage-conservation initiative)',
        examples: [
          'The state launched a community-led heritage-conservation initiative to protect ancient terracotta temples.',
          'Decades of unchecked urban expansion threaten time-honored artisanal traditions.'
        ],
        drillPrompt: 'Combine into pre-modified noun phrase: "A workshop that is funded by the government and teaches how to weave by hand."',
        sampleTransform: 'A government-funded hand-weaving workshop'
      },
      {
        id: 'gram-cul-2',
        title: 'Correlative Conjunctions (Whether... or / Neither... nor)',
        level: 'Band 7.0+',
        explanationVi: 'Liên từ tương quan tạo thế cân bằng trong câu, giúp lập luận phân tích văn hóa mang tính toàn diện.',
        formula: 'Whether + Subject + Verb or + Subject + Verb / Neither + Noun nor + Noun',
        examples: [
          'Whether historical artifacts reside in foreign museums or local heritage galleries, rigorous archival conservation remains imperative.',
          'Neither commercial commercialization nor total tourist bans offer a sustainable pathway for sacred heritage sites.'
        ],
        drillPrompt: 'Combine with "Neither... nor": Folk dances should not be forgotten. Traditional folk songs should also not be forgotten.',
        sampleTransform: 'Neither folk dances nor traditional folk songs should be relegated to oblivion.'
      }
    ],
    listening: {
      id: 'lis-cul-1',
      title: 'Museum Exhibition Tour: Indigenous Art & Textiles',
      level: 'B2 / Band 6.5',
      durationMinutes: 4,
      audioText: `Welcome patrons to the National Gallery of Cultural Heritage. This afternoon’s guided tour explores our newly restored Highland Textile Pavilion. On display are hand-woven tapestries dating from the fourteenth to eighteenth centuries, rendered entirely with natural indigo and turmeric vegetable dyes. Visitors are kindly requested not to use flash photography, as intense illumination degrades historical fiber pigments. Guided audio headsets are available in six languages at the gallery reception, and our curators will host a live weaving demonstration at three-thirty in the courtyard.`,
      questions: [
        {
          id: 'lis-cul-q1',
          prompt: 'What natural dyes were utilized in the textile collection?',
          options: ['Synthetic minerals', 'Indigo and turmeric vegetable dyes', 'Crushed beetle carmine', 'Imported chemical dyes'],
          answer: 'Indigo and turmeric vegetable dyes',
          explanation: 'The guide explains: "rendered entirely with natural indigo and turmeric vegetable dyes."'
        },
        {
          id: 'lis-cul-q2',
          prompt: 'Why is flash photography prohibited in the gallery?',
          options: ['It distracts other visitors', 'It damages historical fiber pigments', 'It is copyrighted material', 'Security cameras glitch'],
          answer: 'It damages historical fiber pigments',
          explanation: 'The guide clarifies: "as intense illumination degrades historical fiber pigments."'
        },
        {
          id: 'lis-cul-q3',
          prompt: 'At what time does the live weaving demonstration take place?',
          options: ['1:00 PM', '2:15 PM', '3:30 PM', '4:45 PM'],
          answer: '3:30 PM',
          explanation: 'The speaker concludes: "curators will host a live weaving demonstration at three-thirty in the courtyard."'
        }
      ]
    },
    writing: {
      task1: {
        title: 'Task 1: Annual Attendance at National Cultural Venues',
        prompt: 'The bar chart compares annual visitor numbers to Art Galleries, History Museums, Theatres, and Historic Castles from 2018 to 2024.',
        chartType: 'Multi-category Bar Chart',
        suggestedCollocations: ['remain the preeminent destination', 'witness a marked resurgence', 'outnumber by a wide margin', 'modest foot traffic'],
        chartData: { visualization: 'bar', unit: 'thousand visitors', categories: ['2018', '2020', '2022', '2024'], series: [{ label: 'Art galleries', values: [210, 130, 190, 240] }, { label: 'History museums', values: [180, 120, 165, 205] }, { label: 'Theatres', values: [260, 95, 210, 275] }, { label: 'Historic castles', values: [145, 100, 135, 155] }] }
      },
      task2: {
        title: 'Task 2: Government Funding for Fine Arts vs Practical Services',
        prompt: 'Some people argue that national governments should allocate public money to support museums, theater, and traditional arts, while others believe that all public funds should be directed to healthcare and infrastructure. Discuss both views and give your opinion.',
        essayType: 'Discussion & Opinion Essay',
        suggestedCollocations: ['cultural preservation', 'intangible heritage', 'cultural homogenization', 'civic identity', 'fiscal prioritization'],
        outlineIdeas: [
          'Body 1 (Practical services first): Healthcare saves lives; transport infrastructure powers economic productivity; arts are non-essential luxuries during recessions.',
          'Body 2 (Arts funding): Arts define national identity and social cohesion; historical heritage drives cultural tourism; preserving traditions prevents global cultural homogenization.'
        ]
      }
    },
    speaking: {
      part1: [
        'Do you enjoy visiting museums and art exhibitions?',
        'What traditional festival in your country do you celebrate with family?',
        'Have you ever tried traditional handicrafts such as pottery or embroidery?'
      ],
      part2: {
        cueCard: 'Describe a traditional festival or cultural celebration you attended.',
        bulletPoints: [
          'What the celebration was and where it occurred',
          'Who you accompanied and what activities took place',
          'What traditional foods or garments were showcased',
          'And explain why this occasion remains vivid in your memory.'
        ],
        followUp: 'Has the way people celebrate this festival changed over recent years?'
      },
      part3: [
        'How can schools cultivate appreciation for traditional music among young people?',
        'Does the rise of global streaming platforms endanger localized cinematic storytelling?'
      ],
      collocations: ['cultural preservation', 'intangible heritage', 'multiculturalism', 'when in Rome, do as the Romans do']
    }
  }
]

export const TOPICS: TopicDefinition[] = CORE_8_TOPICS
