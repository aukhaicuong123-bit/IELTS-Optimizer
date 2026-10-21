/**
 * CEFR Grammar Curriculum (A1 to C2)
 * Inspired by ForumFlash (https://www.forumflashstudy.com/#study)
 * Structured with visual sentence formula breakdown, IELTS application, common traps,
 * and integrated interactive checks across 6 CEFR tiers.
 */

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export interface VisualFormulaToken {
  role: string
  token: string
  tag: string
  color: string
}

export interface CefrGrammarRule {
  id: string
  title: string
  cefrLevel: CefrLevel
  category: string
  descriptionVi: string
  formula: string
  formulaTokens: VisualFormulaToken[]
  explanationVi: string
  ieltsUsageNote: string
  examples: string[]
  commonMistakes: {
    wrong: string
    correct: string
    note: string
  }[]
  quiz: {
    prompt: string
    options: string[]
    answer: string
    explanation: string
  }
  drillPrompt: string
  sampleTransform: string
}

export const CEFR_GRAMMAR_RULES: CefrGrammarRule[] = [
  // ===================== A1: NỀN TẢNG (4 BÀI) =====================
  {
    id: 'cefr-a1-01',
    title: 'To Be & Subject Pronouns (Đại từ & Động từ To Be)',
    cefrLevel: 'A1',
    category: 'Sentence Basics',
    descriptionVi: 'Cấu trúc câu cơ bản nhất với đại từ nhân xưng và động từ to be để miêu tả định danh và tính chất.',
    formula: 'Subject (I/You/He/She/It/We/They) + To Be (am/is/are) + Complement / Adjective',
    formulaTokens: [
      { role: 'Chủ ngữ', token: 'She', tag: 'S', color: '#15803d' },
      { role: 'Động từ to be', token: 'is', tag: 'V (be)', color: '#0f766e' },
      { role: 'Bổ ngữ', token: 'an IELTS candidate', tag: 'C', color: '#1d4ed8' }
    ],
    explanationVi: 'Động từ to be biến đổi theo ngôi chủ ngữ: I + am, He/She/It + is, You/We/They + are. Trong bài thi IELTS, việc nhầm lẫn số ít/số nhiều ở to be là lỗi cơ bản cần tránh tuyệt đối.',
    ieltsUsageNote: 'Dùng trong Speaking Part 1 khi giới thiệu bản thân, nghề nghiệp, nơi sống và sở thích.',
    examples: [
      'Higher education is essential for career progression in modern society.',
      'Renewable energy sources are becoming increasingly cost-effective.'
    ],
    commonMistakes: [
      {
        wrong: 'Online learning are very convenient.',
        correct: 'Online learning is very convenient.',
        note: 'Gerund (V-ing) làm chủ ngữ luôn chia động từ số ít.'
      }
    ],
    quiz: {
      prompt: 'Complete: "Public transport in metropolitan areas ____ crucial for reducing emissions."',
      options: ['are', 'is', 'be', 'being'],
      answer: 'is',
      explanation: 'Chủ ngữ "Public transport" là danh từ không đếm được, động từ to be chia ở ngôi số ít là "is".'
    },
    drillPrompt: 'Viết một câu miêu tả môi trường sống hoặc việc học của bạn sử dụng động từ "to be" chính xác.',
    sampleTransform: 'Balancing academic study and part-time employment is challenging yet rewarding.'
  },
  {
    id: 'cefr-a1-02',
    title: 'Present Simple & S-V-O Structure (Hiện tại đơn & Cấu trúc S-V-O)',
    cefrLevel: 'A1',
    category: 'Tenses',
    descriptionVi: 'Cấu trúc câu khẳng định Chủ ngữ - Động từ - Tân ngữ diễn tả chân lý, quy luật và thói quen.',
    formula: 'Subject (S) + Verb (V / V-s/es) + Object (O)',
    formulaTokens: [
      { role: 'Chủ ngữ', token: 'The government', tag: 'S', color: '#15803d' },
      { role: 'Động từ', token: 'funds', tag: 'V', color: '#0f766e' },
      { role: 'Tân ngữ', token: 'scientific research', tag: 'O', color: '#1d4ed8' }
    ],
    explanationVi: 'Với chủ ngữ ngôi thứ ba số ít (he, she, it, danh từ số ít), động từ thêm -s hoặc -es. Cấu trúc S-V-O là xương sống của tiếng Anh học thuật.',
    ieltsUsageNote: 'Sử dụng xuyên suốt trong IELTS Writing Task 2 khi trình bày quan điểm chung và các sự thật khách quan.',
    examples: [
      'Technological innovation shapes how humans communicate globally.',
      'Strict environmental regulations encourage factories to adopt green practices.'
    ],
    commonMistakes: [
      {
        wrong: 'The researcher study climate change patterns.',
        correct: 'The researcher studies climate change patterns.',
        note: '"The researcher" là danh từ số ít nên động từ cần chia "studies".'
      }
    ],
    quiz: {
      prompt: 'Choose the correct form: "Excessive screen time ____ sleep quality among teenagers."',
      options: ['affect', 'affects', 'affecting', 'is affect'],
      answer: 'affects',
      explanation: 'Chủ ngữ "Excessive screen time" là danh từ không đếm được, động từ hiện tại đơn thêm "s".'
    },
    drillPrompt: 'Viết câu khẳng định S-V-O về tác động của công nghệ đối với học sinh.',
    sampleTransform: 'Modern technology improves students’ access to educational materials.'
  },
  {
    id: 'cefr-a1-03',
    title: 'Articles: A, An & The (Mạo từ xác định & Không xác định)',
    cefrLevel: 'A1',
    category: 'Determiners',
    descriptionVi: 'Quy tắc sử dụng mạo từ a/an với danh từ đếm được số ít và "the" với danh từ đã xác định hoặc duy nhất.',
    formula: 'a/an + Countable Singular Noun  |  the + Specific Noun / Superlative',
    formulaTokens: [
      { role: 'Mạo từ xác định', token: 'The', tag: 'Article', color: '#0f766e' },
      { role: 'Danh từ cụ thể', token: 'Internet', tag: 'Noun', color: '#15803d' },
      { role: 'Vị ngữ', token: 'revolutionized global connectivity.', tag: 'Predicate', color: '#1d4ed8' }
    ],
    explanationVi: 'Dùng "a/an" khi đề cập lần đầu, "the" khi người nghe/đọc đã biết rõ đối tượng, trước so sánh nhất, hoặc trước các thực thể duy nhất (the sun, the government).',
    ieltsUsageNote: 'Mạo từ là lỗi ngữ pháp thường gặp nhất của thí sinh Việt Nam làm mất điểm Grammatical Accuracy.',
    examples: [
      'The university offers an exceptional curriculum for postgraduate scholars.',
      'Solar energy is the most reliable alternative in tropical territories.'
    ],
    commonMistakes: [
      {
        wrong: 'She is student at Oxford University.',
        correct: 'She is a student at Oxford University.',
        note: 'Danh từ đếm được số ít chỉ nghề nghiệp luôn cần có mạo từ "a/an".'
      }
    ],
    quiz: {
      prompt: 'Choose the correct article: "Education plays ____ indispensable role in poverty reduction."',
      options: ['a', 'an', 'the', '(no article)'],
      answer: 'an',
      explanation: '"Indispensable" bắt đầu bằng nguyên âm [ɪ], danh từ số ít nên dùng "an".'
    },
    drillPrompt: 'Viết câu sử dụng mạo từ xác định "the" trước dạng so sánh nhất trong chủ đề đô thị.',
    sampleTransform: 'Tokyo is the most populous metropolitan agglomeration on the globe.'
  },
  {
    id: 'cefr-a1-04',
    title: 'Prepositions of Time & Place: In, On, At (Giới từ thời gian & Nơi chốn)',
    cefrLevel: 'A1',
    category: 'Prepositions',
    descriptionVi: 'Phân biệt giới từ thời gian và không gian: in (năm, tháng, quốc gia), on (ngày, đường phố), at (giờ giấc, địa điểm cụ thể).',
    formula: 'in + Year / Month / City  |  on + Day / Specific Date  |  at + Exact Time / Specific Point',
    formulaTokens: [
      { role: 'Cụm giới từ', token: 'In 2020,', tag: 'Prep + Time', color: '#0f766e' },
      { role: 'Chủ ngữ', token: 'electric car sales', tag: 'S', color: '#15803d' },
      { role: 'Động từ', token: 'surged', tag: 'V', color: '#1d4ed8' }
    ],
    explanationVi: 'Trong Task 1 miêu tả biểu đồ: "in 2015", "from 2000 to 2010", "at the end of the period". Dùng sai giới từ khiến câu văn bị mất tự nhiên.',
    ieltsUsageNote: 'Đặc biệt quan trọng trong IELTS Writing Task 1 khi nêu các mốc thời gian và điểm số liệu.',
    examples: [
      'In the twenty-first century, renewable technology experienced exponential growth.',
      'At 45%, the literacy rate reached its highest plateau in 2018.'
    ],
    commonMistakes: [
      {
        wrong: 'The proportion peaked on 2015.',
        correct: 'The proportion peaked in 2015.',
        note: 'Trước năm (year) luôn dùng giới từ "in", không dùng "on".'
      }
    ],
    quiz: {
      prompt: 'Complete: "The conference convenes ____ Monday morning ____ 9 AM."',
      options: ['on / at', 'in / on', 'at / in', 'on / in'],
      answer: 'on / at',
      explanation: 'Trước ngày trong tuần dùng "on", trước giờ cụ thể dùng "at".'
    },
    drillPrompt: 'Viết câu miêu tả mốc số liệu biểu đồ Task 1 sử dụng "in" và "at".',
    sampleTransform: 'In 2021, the unemployment figure bottomed out at approximately 3.2%.'
  },

  // ===================== A2: CƠ BẢN (4 BÀI) =====================
  {
    id: 'cefr-a2-01',
    title: 'Past Simple & Irregular Verbs (Quá khứ đơn & Động từ bất quy tắc)',
    cefrLevel: 'A2',
    category: 'Tenses',
    descriptionVi: 'Diễn tả hành động đã xảy ra và kết thúc hoàn toàn tại một thời điểm xác định trong quá khứ.',
    formula: 'Subject + Verb-ed / V2 + Time Expression (in 2010, last year, previously)',
    formulaTokens: [
      { role: 'Chủ ngữ', token: 'The city', tag: 'S', color: '#15803d' },
      { role: 'Động từ V2', token: 'implemented', tag: 'V2', color: '#0f766e' },
      { role: 'Tân ngữ & Thời gian', token: 'a recycling scheme in 2020', tag: 'O + Adv', color: '#1d4ed8' }
    ],
    explanationVi: 'Động từ có quy tắc thêm -ed (watch -> watched), động từ bất quy tắc dùng cột 2 (begin -> began, rise -> rose, see -> saw).',
    ieltsUsageNote: 'Tối quan trọng cho IELTS Writing Task 1 khi phân tích biểu đồ có các mốc thời gian trong quá khứ.',
    examples: [
      'Between 2000 and 2015, the proportion of car owners rose dramatically from 25% to 68%.',
      'The government established the national park in 1995 to preserve local biodiversity.'
    ],
    commonMistakes: [
      {
        wrong: 'In 2010, the figure was increased significantly.',
        correct: 'In 2010, the figure increased significantly.',
        note: '"Increase" là nội động từ diễn tả sự gia tăng tự thân, không dùng bị động "was increased".'
      }
    ],
    quiz: {
      prompt: 'Select the correct sentence for IELTS Task 1 trend analysis:',
      options: [
        'The birth rate fell gradually between 1990 and 2005.',
        'The birth rate was falled gradually between 1990 and 2005.',
        'The birth rate fall gradually between 1990 and 2005.',
        'The birth rate had fell gradually between 1990 and 2005.'
      ],
      answer: 'The birth rate fell gradually between 1990 and 2005.',
      explanation: 'Quá khứ của "fall" là "fell", dùng quá khứ đơn miêu tả diễn biến đã kết thúc trong quá khứ.'
    },
    drillPrompt: 'Viết một câu miêu tả sự thay đổi số liệu trong quá khứ từ biểu đồ Task 1.',
    sampleTransform: 'The consumption of renewable energy experienced a steady upward trend over the decade.'
  },
  {
    id: 'cefr-a2-02',
    title: 'Comparatives & Modifiers (Cấu trúc so sánh hơn & Trạng từ bổ trợ)',
    cefrLevel: 'A2',
    category: 'Modifiers',
    descriptionVi: 'So sánh giữa các nhóm đối tượng, xu hướng hoặc mức độ trong bài thi Writing và Speaking.',
    formula: 'Short adj + -er / more + Long adj + than  |  significantly / considerably / far + more',
    formulaTokens: [
      { role: 'Chủ ngữ A', token: 'Solar energy', tag: 'S1', color: '#15803d' },
      { role: 'Cấu trúc so sánh', token: 'is far more sustainable than', tag: 'Comp', color: '#0f766e' },
      { role: 'Đối tượng B', token: 'fossil fuels', tag: 'S2', color: '#1d4ed8' }
    ],
    explanationVi: 'Tính từ ngắn thêm -er, tính từ dài dùng "more + adj". Dùng trạng từ mức độ như "far / significantly / considerably more" để nâng band điểm.',
    ieltsUsageNote: 'Bắt buộc dùng trong Writing Task 1 để đối chiếu số liệu giữa các nước hoặc danh mục.',
    examples: [
      'Expenditure on healthcare was significantly higher than spending on education.',
      'Electric vehicles are substantially quieter and more eco-friendly than conventional cars.'
    ],
    commonMistakes: [
      {
        wrong: 'Online classes are more cheaper than traditional university courses.',
        correct: 'Online classes are cheaper than traditional university courses.',
        note: 'Tránh dùng thừa "more" trước tính từ ngắn đã có đuôi "-er".'
      }
    ],
    quiz: {
      prompt: 'Complete: "Public spending on green transport was ____ higher in 2022 than in 2010."',
      options: ['considerably', 'more', 'very much', 'so'],
      answer: 'considerably',
      explanation: '"Considerably higher" là collocation học thuật chuẩn xác để nhấn mạnh chênh lệch lớn trong IELTS.'
    },
    drillPrompt: 'Viết một câu so sánh hai hình thức giao thông hoặc học tập sử dụng "significantly more... than".',
    sampleTransform: 'Commuting by metro is significantly faster and less stressful than driving during rush hours.'
  },
  {
    id: 'cefr-a2-03',
    title: 'Future Forms: Will vs Be Going To (Các dạng thức tương lai)',
    cefrLevel: 'A2',
    category: 'Tenses',
    descriptionVi: 'Phân biệt dự đoán dựa trên lập luận / quyết định tức thì (will) và kế hoạch có sẵn / bằng chứng hiện tại (be going to).',
    formula: 'Subject + will + V-bare  |  Subject + am/is/are + going to + V-bare',
    formulaTokens: [
      { role: 'Chủ ngữ', token: 'Artificial intelligence', tag: 'S', color: '#15803d' },
      { role: 'Dự đoán tương lai', token: 'will transform', tag: 'will + V', color: '#0f766e' },
      { role: 'Tân ngữ', token: 'the future employment market.', tag: 'O', color: '#1d4ed8' }
    ],
    explanationVi: 'Trong văn phong học thuật Writing Task 2, "will" kết hợp với các trạng từ như "inevitably", "undoubtedly", "likely" để tạo câu dự báo xu thế khách quan.',
    ieltsUsageNote: 'Sử dụng ở phần Conclusion hoặc câu đề xuất giải pháp tương lai trong Task 2.',
    examples: [
      'Automation will inevitably eliminate repetitive manual manufacturing occupations.',
      'Rising sea levels are going to displace millions of coastal inhabitants by 2050.'
    ],
    commonMistakes: [
      {
        wrong: 'In the future, technology will to replace all teachers.',
        correct: 'In the future, technology will replace all teachers.',
        note: 'Sau modal "will", động từ luôn ở dạng nguyên mẫu không "to".'
      }
    ],
    quiz: {
      prompt: 'Choose the most academic future phrasing:',
      options: [
        'Urban density will likely increase over the coming two decades.',
        'Urban density is will increase over the coming two decades.',
        'Urban density will to increase over the coming two decades.',
        'Urban density will increasing over the coming two decades.'
      ],
      answer: 'Urban density will likely increase over the coming two decades.',
      explanation: '"Will likely + V-bare" là cấu trúc học thuật chuẩn mực để diễn đạt xu hướng tương lai có xác suất cao.'
    },
    drillPrompt: 'Viết câu dự đoán sự phát triển của xe điện trong 20 năm tới.',
    sampleTransform: 'Electric automobiles will undoubtedly dominate urban road transit networks by the year 2040.'
  },
  {
    id: 'cefr-a2-04',
    title: 'Adverbs of Frequency & Degree (Trạng từ tần suất & Mức độ)',
    cefrLevel: 'A2',
    category: 'Adverbs',
    descriptionVi: 'Vị trí và cách dùng của trạng từ tần suất (often, frequently, rarely) và trạng từ mức độ (substantially, remarkably).',
    formula: 'Subject + Adverb + Main Verb  |  Subject + To Be + Adverb',
    formulaTokens: [
      { role: 'Chủ ngữ', token: 'Commuters', tag: 'S', color: '#15803d' },
      { role: 'Trạng từ tần suất', token: 'frequently', tag: 'Adv', color: '#0f766e' },
      { role: 'Vị ngữ', token: 'encounter severe delays during rush hours.', tag: 'VP', color: '#1d4ed8' }
    ],
    explanationVi: 'Trạng từ đứng trước động từ thường, đứng sau động từ to be và trợ động từ. Trong IELTS, các từ như "frequently", "seldom", "predominantly" thay thế từ bình dân.',
    ieltsUsageNote: 'Dùng để điều tiết tính khái quát (hedging), tránh khẳng định cực đoan 100%.',
    examples: [
      'Young professionals frequently change employers to accelerate career advancement.',
      'Water quality is remarkably superior in rural mountainous settlements.'
    ],
    commonMistakes: [
      {
        wrong: 'They travel frequently by train during the week.',
        correct: 'They frequently travel by train during the week.',
        note: 'Trạng từ tần suất đứng trước động từ chính "travel".'
      }
    ],
    quiz: {
      prompt: 'Select the sentence with natural academic word order:',
      options: [
        'Policymakers seldom consider the indirect ecological consequences.',
        'Policymakers consider seldom the indirect ecological consequences.',
        'Seldom policymakers consider the indirect ecological consequences without inversion.',
        'Policymakers consider the indirect ecological consequences seldom.'
      ],
      answer: 'Policymakers seldom consider the indirect ecological consequences.',
      explanation: 'Trạng từ "seldom" đứng ngay trước động từ chính "consider".'
    },
    drillPrompt: 'Viết câu sử dụng "predominantly" miêu tả nguồn năng lượng của một quốc gia.',
    sampleTransform: 'Developing nations predominantly rely on fossil fuel combustion for industrial baseline power.'
  },

  // ===================== B1: TRUNG CẤP (4 BÀI) =====================
  {
    id: 'cefr-b1-01',
    title: 'Present Perfect & Trends (Hiện tại hoàn thành & Xu hướng)',
    cefrLevel: 'B1',
    category: 'Tenses',
    descriptionVi: 'Diễn tả hành động bắt đầu trong quá khứ kéo dài đến hiện tại hoặc sự kiện để lại kết quả rõ rệt.',
    formula: 'Subject + have / has + Past Participle (V3/ed) + (since / for / over the past decades)',
    formulaTokens: [
      { role: 'Chủ ngữ', token: 'Automation', tag: 'S', color: '#15803d' },
      { role: 'Trợ ĐT + V3', token: 'has transformed', tag: 'have + V3', color: '#0f766e' },
      { role: 'Tân ngữ', token: 'the manufacturing industry', tag: 'O', color: '#1d4ed8' }
    ],
    explanationVi: 'Dùng "has" cho ngôi thứ ba số ít, "have" cho các ngôi còn lại. Cực kỳ phổ biến với các cụm: "In recent years", "Over the last decade", "Since the beginning of the century".',
    ieltsUsageNote: 'Mở bài (Introduction) và câu chủ đề (Topic sentence) trong IELTS Writing Task 2.',
    examples: [
      'In recent years, remote working has gained immense popularity across multiple industries.',
      'Urbanization has placed severe pressure on municipal infrastructure in developing nations.'
    ],
    commonMistakes: [
      {
        wrong: 'In recent years, the rate increased drastically.',
        correct: 'In recent years, the rate has increased drastically.',
        note: 'Với cụm "in recent years", hành động gắn liền với hiện tại nên dùng hiện tại hoàn thành.'
      }
    ],
    quiz: {
      prompt: 'Choose the correct tense: "Over the last five years, social media platforms ____ young people’s communication."',
      options: ['revolutionized', 'have revolutionized', 'had revolutionized', 'are revolutionizing'],
      answer: 'have revolutionized',
      explanation: 'Cụm thời gian "Over the last five years" chỉ giai đoạn kéo dài đến nay -> dùng Present Perfect.'
    },
    drillPrompt: 'Viết câu mở đoạn Writing Task 2 bắt đầu bằng "Over the past few decades, ..."',
    sampleTransform: 'Over the past few decades, globalization has reshaped consumer behavior across developing economies.'
  },
  {
    id: 'cefr-b1-02',
    title: 'Conditionals Type 1 & 2 (Câu điều kiện loại 1 & 2)',
    cefrLevel: 'B1',
    category: 'Conditionals',
    descriptionVi: 'Giả định điều kiện có thể xảy ra ở hiện tại/tương lai (Loại 1) hoặc điều kiện không có thật/giả định chính sách (Loại 2).',
    formula: 'Type 1: If + S + V(pres), S + will/can + V-inf  |  Type 2: If + S + V(past), S + would + V-inf',
    formulaTokens: [
      { role: 'Mệnh đề If', token: 'If governments invested in green tech,', tag: 'If-clause', color: '#15803d' },
      { role: 'Chủ ngữ chính', token: 'carbon emissions', tag: 'S', color: '#0f766e' },
      { role: 'Vị ngữ chính', token: 'would decline substantially.', tag: 'would + V', color: '#1d4ed8' }
    ],
    explanationVi: 'Trong câu điều kiện loại 2, động từ "be" chia thành "were" cho tất cả các ngôi trong văn phong học thuật trang trọng (e.g., "If higher education were free...").',
    ieltsUsageNote: 'Dùng khi đề xuất giải pháp chính sách (Solutions) hoặc phân tích tác động giả định trong Writing Task 2.',
    examples: [
      'If cities implement congestion charges, traffic jams will diminish noticeably.',
      'If governments subsidized public transport, more commuters would abandon private vehicles.'
    ],
    commonMistakes: [
      {
        wrong: 'If the government will subsidize renewable energy, emissions would drop.',
        correct: 'If the government subsidized renewable energy, emissions would drop.',
        note: 'Mệnh đề If không dùng "will/would"; câu điều kiện loại 2 dùng quá khứ đơn ở vế If.'
      }
    ],
    quiz: {
      prompt: 'Complete: "If authorities ____ harsher penalties for littering, urban areas would be cleaner."',
      options: ['impose', 'imposed', 'will impose', 'would impose'],
      answer: 'imposed',
      explanation: 'Vế chính dùng "would be", đây là câu điều kiện loại 2 nên vế If dùng quá khứ đơn "imposed".'
    },
    drillPrompt: 'Viết câu điều kiện loại 2 đề xuất một giải pháp cho ô nhiễm môi trường.',
    sampleTransform: 'If fossil fuels were heavily taxed, businesses would transition to green energy alternatives.'
  },
  {
    id: 'cefr-b1-03',
    title: 'Modal Verbs of Deduction & Recommendation (Động từ khiếm khuyết)',
    cefrLevel: 'B1',
    category: 'Modals',
    descriptionVi: 'Sử dụng should, must, might, could để đưa ra khuyến nghị chính sách hoặc suy luận mức độ khả thi.',
    formula: 'Subject + should / must / might / could + V-bare',
    formulaTokens: [
      { role: 'Chủ ngữ', token: 'Municipal authorities', tag: 'S', color: '#15803d' },
      { role: 'Khuyến nghị modal', token: 'should prioritize', tag: 'should + V', color: '#0f766e' },
      { role: 'Tân ngữ', token: 'pedestrianized infrastructure.', tag: 'O', color: '#1d4ed8' }
    ],
    explanationVi: '"Must" thể hiện sự bắt buộc tuyệt đối, "should / ought to" thể hiện khuyến nghị đạo đức/chính sách, "might / could" thể hiện khả năng phán đoán cẩn trọng.',
    ieltsUsageNote: 'Cần thiết trong phần Body Paragraph 2 khi đưa ra giải pháp giải quyết vấn đề.',
    examples: [
      'Schools ought to incorporate financial literacy into core secondary curricula.',
      'Unchecked industrial automation might exacerbate localized unemployment disparities.'
    ],
    commonMistakes: [
      {
        wrong: 'Governments should to ban petrol vehicles.',
        correct: 'Governments should ban petrol vehicles.',
        note: 'Sau modal verbs (should/must/can/might), động từ không có "to".'
      }
    ],
    quiz: {
      prompt: 'Complete the policy suggestion: "To mitigate plastic pollution, supermarkets ____ charge for single-use bags."',
      options: ['should', 'should to', 'must to', 'are should'],
      answer: 'should',
      explanation: 'Sau "should" dùng động từ nguyên mẫu không "to": "should charge".'
    },
    drillPrompt: 'Viết câu khuyến nghị sử dụng "ought to" về việc bảo tồn năng lượng.',
    sampleTransform: 'Households ought to embrace energy-efficient appliances to curb greenhouse emissions.'
  },
  {
    id: 'cefr-b1-04',
    title: 'Gerunds & Infinitives (Danh động từ & Động từ nguyên mẫu có To)',
    cefrLevel: 'B1',
    category: 'Verb Complements',
    descriptionVi: 'Phân biệt động từ đi kèm V-ing (enjoy, avoid, consider) và động từ đi kèm To-V (decide, manage, struggle, strive).',
    formula: 'Verb + V-ing (Gerund)  vs  Verb + to-V (Infinitive)',
    formulaTokens: [
      { role: 'Chủ ngữ', token: 'Many nations', tag: 'S', color: '#15803d' },
      { role: 'Động từ chính', token: 'strive to reduce', tag: 'V + to-V', color: '#0f766e' },
      { role: 'Tân ngữ', token: 'dependence on imported petroleum.', tag: 'O', color: '#1d4ed8' }
    ],
    explanationVi: 'Các cấu trúc cố định trong IELTS: "look forward to + V-ing", "contribute to + V-ing", "strive to + V-bare", "fail to + V-bare". Nhầm lẫn to là giới từ hay to-infinitive là bẫy phổ biến.',
    ieltsUsageNote: 'Giúp câu văn trôi chảy và thể hiện sự tinh tế trong việc kết hợp động từ.',
    examples: [
      'Policymakers must avoid implementing short-sighted fiscal remedies.',
      'Developing economies continue to struggle to modernize rural healthcare infrastructure.'
    ],
    commonMistakes: [
      {
        wrong: 'Urban planners look forward to improve traffic flow.',
        correct: 'Urban planners look forward to improving traffic flow.',
        note: 'Trong cụm "look forward to", "to" là giới từ nên theo sau là V-ing.'
      }
    ],
    quiz: {
      prompt: 'Select the correct form: "Subsidizing green transport contributes to ____ urban air quality."',
      options: ['improve', 'improving', 'to improve', 'improved'],
      answer: 'improving',
      explanation: '"Contribute to" đi kèm với danh động từ (Gerund V-ing).'
    },
    drillPrompt: 'Viết câu sử dụng "avoid + V-ing" về thói quen chi tiêu.',
    sampleTransform: 'Young consumers should avoid accumulating high-interest credit card debt for discretionary luxuries.'
  },

  // ===================== B2: NÂNG CAO (4 BÀI) =====================
  {
    id: 'cefr-b2-01',
    title: 'Passive Voice in Academic Writing (Câu bị động học thuật)',
    cefrLevel: 'B2',
    category: 'Voice',
    descriptionVi: 'Chuyển trọng tâm từ người thực hiện hành động sang kết quả nghiên cứu, quy trình và chính sách khách quan.',
    formula: 'Subject (Patient) + Be (chia theo thì) + Past Participle (V3/ed) + (by Agent)',
    formulaTokens: [
      { role: 'Đối tượng chịu tác động', token: 'Strict environmental policies', tag: 'Subject', color: '#15803d' },
      { role: 'Động từ bị động', token: 'must be enforced', tag: 'Mod + be + V3', color: '#0f766e' },
      { role: 'Mục đích / Tác nhân', token: 'to combat climate change.', tag: 'Complement', color: '#1d4ed8' }
    ],
    explanationVi: 'Văn phong IELTS Academic ưa chuộng câu bị động vì nó mang tính trung lập, khoa học và khách quan, tránh lạm dụng đại từ ngôi thứ nhất "I / we / people".',
    ieltsUsageNote: 'Dùng trong Writing Task 1 (Process diagrams) và Writing Task 2 (chính sách, kết luận khoa học).',
    examples: [
      'It is widely acknowledged that vocational training should be prioritised in rural communities.',
      'During the distillation phase, water is heated until steam is produced and subsequently cooled.'
    ],
    commonMistakes: [
      {
        wrong: 'A new highway was constructed by the government last year was praised.',
        correct: 'A new highway constructed by the government last year was praised.',
        note: 'Tránh lỗi hai động từ chính cùng xuất hiện mà không có liên từ; sử dụng mệnh đề quan hệ rút gọn.'
      }
    ],
    quiz: {
      prompt: 'Choose the most academic phrasing:',
      options: [
        'People should implement renewable energy measures immediately.',
        'Renewable energy measures should be implemented without delay.',
        'They should be implementing renewable energy measures soon.',
        'We need to implement renewable energy measures now.'
      ],
      answer: 'Renewable energy measures should be implemented without delay.',
      explanation: 'Câu bị động trang trọng mang tính học thuật cao, loại bỏ đại từ chủ quan "people/we/they".'
    },
    drillPrompt: 'Chuyển câu sau sang bị động học thuật: "Governments should allocate more funds to public schools."',
    sampleTransform: 'Substantially greater financial resources should be allocated to public educational institutions.'
  },
  {
    id: 'cefr-b2-02',
    title: 'Relative Clauses (Mệnh đề quan hệ xác định & không xác định)',
    cefrLevel: 'B2',
    category: 'Complex Sentences',
    descriptionVi: 'Kết nối thông tin chi tiết vào một câu phức mượt mà, giúp tăng tiêu chí Grammatical Range & Accuracy.',
    formula: 'Main clause + [who / which / whose / where / that] + Subordinate clause',
    formulaTokens: [
      { role: 'Mệnh đề chính', token: 'Students', tag: 'Subject', color: '#15803d' },
      { role: 'Mệnh đề quan hệ', token: 'who engage in extracurricular activities', tag: 'Rel Clause', color: '#0f766e' },
      { role: 'Vị ngữ chính', token: 'tend to develop stronger leadership skills.', tag: 'Main Predicate', color: '#1d4ed8' }
    ],
    explanationVi: 'Mệnh đề quan hệ không xác định (non-defining) có dấu phẩy hai đầu và không dùng "that", bổ sung thông tin phụ cho danh từ riêng hoặc danh từ đã xác định.',
    ieltsUsageNote: 'Tạo câu phức đạt chuẩn Band 7.0+ trong cả Writing Task 1 và Task 2.',
    examples: [
      'Individuals whose diets consist largely of processed foods face elevated risks of chronic illnesses.',
      'Urban green spaces, which provide mental health benefits, are frequently overlooked by planners.'
    ],
    commonMistakes: [
      {
        wrong: 'The policy, that was introduced in 2018, significantly reduced road accidents.',
        correct: 'The policy, which was introduced in 2018, significantly reduced road accidents.',
        note: 'Không dùng "that" trong mệnh đề quan hệ không xác định (có dấu phẩy).'
      }
    ],
    quiz: {
      prompt: 'Select the correct relative pronoun: "The research team, ____ paper was acclaimed internationally, received a grant."',
      options: ['who', 'whose', 'whom', 'which'],
      answer: 'whose',
      explanation: '"Whose paper" chỉ quyền sở hữu (bài báo của nhóm nghiên cứu).'
    },
    drillPrompt: 'Viết một câu ghép dùng mệnh đề quan hệ non-defining (có dấu phẩy) về ô nhiễm không khí.',
    sampleTransform: 'Vehicle exhaust emissions, which contain toxic particulate matter, pose a severe threat to public health.'
  },
  {
    id: 'cefr-b2-03',
    title: 'Conditionals Type 3 & Mixed (Câu điều kiện loại 3 & Hỗn hợp)',
    cefrLevel: 'B2',
    category: 'Conditionals',
    descriptionVi: 'Giả định điều trái ngược với quá khứ (Loại 3) hoặc hành động quá khứ để lại kết quả trái ngược ở hiện tại (Mixed).',
    formula: 'Type 3: If + S + had + V3, S + would have + V3  |  Mixed: If + S + had + V3, S + would + V-inf (now)',
    formulaTokens: [
      { role: 'Mệnh đề quá khứ', token: 'If authorities had regulated emissions earlier,', tag: 'If + had + V3', color: '#15803d' },
      { role: 'Chủ ngữ', token: 'metropolitan air quality', tag: 'S', color: '#0f766e' },
      { role: 'Kết quả hiện tại', token: 'would be far healthier today.', tag: 'would + V', color: '#1d4ed8' }
    ],
    explanationVi: 'Câu điều kiện hỗn hợp là tiêu chí đắt giá để chứng minh năng lực ngữ pháp Band 7.5+ trong phần phân tích nguyên nhân - hậu quả lịch sử.',
    ieltsUsageNote: 'Phân tích các cơ hội đã bỏ lỡ và bài học kinh nghiệm trong quá khứ ở Task 2.',
    examples: [
      'Had early warning systems functioned, hundreds of casualties would have been prevented.',
      'If the city had invested in light rail a decade ago, commuters would not endure gridlock today.'
    ],
    commonMistakes: [
      {
        wrong: 'If the government would have acted sooner, the catastrophe would be avoided.',
        correct: 'If the government had acted sooner, the catastrophe would have been avoided.',
        note: 'Mệnh đề If loại 3 dùng "had + V3", không dùng "would have".'
      }
    ],
    quiz: {
      prompt: 'Complete the mixed conditional: "If the vaccine ____ developed earlier, thousands of lives would be saved today."',
      options: ['had been', 'was', 'would be', 'has been'],
      answer: 'had been',
      explanation: 'Điều kiện xảy ra trong quá khứ dẫn đến kết quả ở hiện tại -> Vế If dùng Past Perfect Passive "had been".'
    },
    drillPrompt: 'Viết một câu điều kiện hỗn hợp về việc quy hoạch đô thị trong quá khứ.',
    sampleTransform: 'If urban planners had integrated pedestrian corridors decades ago, cities would be far more liveable today.'
  },
  {
    id: 'cefr-b2-04',
    title: 'Academic Reported Speech & Neutral Attribution (Câu gián tiếp học thuật)',
    cefrLevel: 'B2',
    category: 'Reporting Verbs',
    descriptionVi: 'Sử dụng các động từ tường thuật học thuật (asserted, claimed, maintained, demonstrated) thay thế "said / told".',
    formula: 'Scholars / Proponents + [assert / contend / argue] + that + Clause',
    formulaTokens: [
      { role: 'Chủ thể học thuật', token: 'Sociologists', tag: 'Subject', color: '#15803d' },
      { role: 'Động từ tường thuật', token: 'contend', tag: 'Reporting V', color: '#0f766e' },
      { role: 'Mệnh đề That', token: 'that income disparity destabilizes social harmony.', tag: 'That-clause', color: '#1d4ed8' }
    ],
    explanationVi: 'Giúp đưa quan điểm của các bên vào bài luận nghị luận hai chiều (Discuss both views) một cách khách quan, bác học.',
    ieltsUsageNote: 'Bắt buộc dùng trong các bài Task 2 dạng "Discuss both views and give your opinion".',
    examples: [
      'Advocates of remote learning contend that flexible schedules empower self-directed scholarship.',
      'Climatologists have demonstrated that anthropogenic greenhouse emissions drive polar ice sheet recession.'
    ],
    commonMistakes: [
      {
        wrong: 'Scientists said that the planet is getting warmer.',
        correct: 'Scientists have demonstrated that global temperatures are climbing precipitously.',
        note: 'Tránh dùng động từ khẩu ngữ "said"; dùng "demonstrated", "argued", "contended".'
      }
    ],
    quiz: {
      prompt: 'Select the most academic reporting verb for a contested viewpoint:',
      options: ['contend', 'talk', 'tell', 'speak'],
      answer: 'contend',
      explanation: '"Contend that" (cho rằng / lập luận rằng) là động từ học thuật chuẩn mực trong bài nghị luận.'
    },
    drillPrompt: 'Viết câu tường thuật học thuật dùng "Proponents of renewable energy argue that..."',
    sampleTransform: 'Proponents of green energy argue that decentralized solar grids bolster long-term economic resilience.'
  },

  // ===================== C1: HỌC THUẬT IELTS 7.0+ (4 BÀI) =====================
  {
    id: 'cefr-c1-01',
    title: 'Inversion with Negative Adverbs (Đảo ngữ với phó từ phủ định)',
    cefrLevel: 'C1',
    category: 'Stylistic Inversion',
    descriptionVi: 'Cấu trúc đảo ngữ trang trọng đưa trợ động từ lên trước chủ ngữ để tạo điểm nhấn mạnh mẽ trong bài luận.',
    formula: 'Negative Adverb (Not only / Rarely / Seldom / Under no circumstances) + Aux Verb + S + Main Verb',
    formulaTokens: [
      { role: 'Phó từ phủ định', token: 'Not only does', tag: 'Neg + Aux', color: '#991b1b' },
      { role: 'Chủ ngữ', token: 'remote work', tag: 'S', color: '#15803d' },
      { role: 'Động từ chính & Bổ ngữ', token: 'boost employee autonomy, but it also reduces overhead costs.', tag: 'VP + clause', color: '#1e40af' }
    ],
    explanationVi: 'Khi đưa các từ như Not only, Rarely, Seldom, Hardly, No sooner lên đầu câu, trật tự từ bị đảo: Trợ động từ đứng trước Chủ ngữ.',
    ieltsUsageNote: 'Sử dụng 1-2 lần ở các câu luận điểm đinh hoặc kết bài Writing Task 2 để khẳng định năng lực ngữ pháp Band 8.0+.',
    examples: [
      'Not only does deforestation accelerate climate change, but it also deprives indigenous species of their natural habitats.',
      'Rarely do developing countries possess the fiscal flexibility required to handle widespread economic downturns.'
    ],
    commonMistakes: [
      {
        wrong: 'Not only the government provides free healthcare, but it also builds schools.',
        correct: 'Not only does the government provide free healthcare, but it also builds schools.',
        note: 'Thiếu trợ động từ đảo ngữ: sau "Not only" phải đảo "does + S + V-bare".'
      }
    ],
    quiz: {
      prompt: 'Identify the grammatically correct inverted sentence:',
      options: [
        'Seldom people consider the long-term consequences of single-use plastics.',
        'Seldom do people consider the long-term consequences of single-use plastics.',
        'Seldom consider people the long-term consequences of single-use plastics.',
        'Seldom people do consider the long-term consequences of single-use plastics.'
      ],
      answer: 'Seldom do people consider the long-term consequences of single-use plastics.',
      explanation: 'Sau "Seldom" phải đảo trợ động từ "do" lên trước chủ ngữ "people", động từ chính "consider" ở dạng nguyên mẫu.'
    },
    drillPrompt: 'Viết lại câu sau bằng cấu trúc đảo ngữ "Not only does...": "Education fosters critical thinking and enhances employment opportunities."',
    sampleTransform: 'Not only does education foster critical thinking, but it also enhances long-term employment opportunities.'
  },
  {
    id: 'cefr-c1-02',
    title: 'Participle Clauses (Mệnh đề phân từ rút gọn V-ing & V-ed)',
    cefrLevel: 'C1',
    category: 'Sentence Condensation',
    descriptionVi: 'Rút gọn mệnh đề phụ bằng V-ing (chủ động) hoặc V-ed/V3 (bị động) để tạo câu văn cô đọng, giàu tính học thuật.',
    formula: 'Present Participle (V-ing) / Past Participle (V3/ed) + Phrase, Main Subject + Main Verb',
    formulaTokens: [
      { role: 'Mệnh đề phân từ', token: 'Recognizing the urgency of climate change,', tag: 'V-ing clause', color: '#0f766e' },
      { role: 'Chủ ngữ chính', token: 'policymakers', tag: 'S', color: '#15803d' },
      { role: 'Vị ngữ chính', token: 'ratified the international carbon agreement.', tag: 'VP', color: '#1d4ed8' }
    ],
    explanationVi: 'Điều kiện tiên quyết: Chủ ngữ của mệnh đề phân từ và chủ ngữ của mệnh đề chính PHẢI LÀ MỘT.',
    ieltsUsageNote: 'Rất hiệu quả trong Task 1 để tóm tắt số liệu và Task 2 để nối nguyên nhân - kết quả mạch lạc.',
    examples: [
      'Having experienced sustained economic growth, several emerging markets are now investing heavily in domestic infrastructure.',
      'Driven by surging consumer demand, international airline travel reached historic peaks last quarter.'
    ],
    commonMistakes: [
      {
        wrong: 'Walking into the classroom, the exam papers were handed out by the teacher.',
        correct: 'Walking into the classroom, the students received the exam papers from the teacher.',
        note: 'Lỗi Dangling Participle: "the exam papers" không thể là chủ thể của hành động "Walking into the classroom".'
      }
    ],
    quiz: {
      prompt: 'Choose the correct participle clause to combine: "The government observed rising pollution levels. It banned petrol cars in city centers."',
      options: [
        'Observing rising pollution levels, petrol cars were banned by the government in city centers.',
        'Observing rising pollution levels, the government banned petrol cars in city centers.',
        'Observed rising pollution levels, the government banned petrol cars in city centers.',
        'Having observe rising pollution levels, the government banned petrol cars in city centers.'
      ],
      answer: 'Observing rising pollution levels, the government banned petrol cars in city centers.',
      explanation: 'Chủ ngữ mệnh đề chính phải là "the government" để đồng nhất với chủ ngữ của "Observing".'
    },
    drillPrompt: 'Nối hai mệnh đề sau bằng V-ing participle clause: "The council acknowledged traffic congestion. It funded a new light rail project."',
    sampleTransform: 'Acknowledging worsening traffic congestion, the municipal council approved funding for a light rail project.'
  },
  {
    id: 'cefr-c1-03',
    title: 'Academic Nominalisation (Danh từ hóa học thuật nâng cao)',
    cefrLevel: 'C1',
    category: 'Academic Style',
    descriptionVi: 'Chuyển đổi động từ và tính từ thành các cụm danh từ trừu tượng để tạo văn phong khách quan, cô đọng đặc trưng của IELTS 8.0+.',
    formula: 'Verbal clause -> Abstract Noun Phrase + Prepositional Modifier',
    formulaTokens: [
      { role: 'Cụm danh từ hóa', token: 'The rapid depletion of fossil fuel reserves', tag: 'Nominal Phrase', color: '#7c3aed' },
      { role: 'Vị ngữ chính', token: 'necessitates', tag: 'V', color: '#0f766e' },
      { role: 'Bổ ngữ danh từ hóa', token: 'an immediate transition to clean renewables.', tag: 'Object Phrase', color: '#1d4ed8' }
    ],
    explanationVi: 'Thay vì viết: "Because people destroy forests quickly, many species die", thí sinh C1 viết: "The accelerated destruction of rainforests precipitates widespread species extinction."',
    ieltsUsageNote: 'Tiêu chí vàng để nâng điểm Lexical Resource và Grammatical Range lên Band 8.0 - 9.0.',
    examples: [
      'The exponential proliferation of digital platforms has revolutionized cross-border commerce.',
      'Rigorous enforcement of environmental penalties resulted in a noticeable reduction in river toxicity.'
    ],
    commonMistakes: [
      {
        wrong: 'Because cities grow too fast, it causes traffic jams.',
        correct: 'Unrestrained urban expansion inevitably engenders severe traffic gridlock.',
        note: 'Thay mệnh đề nguyên nhân dài dòng bằng cụm danh từ hóa học thuật súc tích.'
      }
    ],
    quiz: {
      prompt: 'Which sentence best exemplifies academic nominalisation for: "The climate is warming quickly, so sea levels are rising"?',
      options: [
        'Rapid climatic warming accelerates global sea level rise.',
        'Because the climate gets warm rapidly, seas rise.',
        'The climate is getting warmer and warmer so seas rise.',
        'Seas are rising because it is getting hot.'
      ],
      answer: 'Rapid climatic warming accelerates global sea level rise.',
      explanation: 'Biến động từ "warming" và "rising" thành các cụm danh từ "climatic warming" và "sea level rise".'
    },
    drillPrompt: 'Danh từ hóa câu: "When people consume too much sugar, they become obese."',
    sampleTransform: 'Excessive dietary sugar consumption is directly correlated with escalating rates of adult obesity.'
  },
  {
    id: 'cefr-c1-04',
    title: 'Conditional Inversion without If (Đảo ngữ câu điều kiện không dùng If)',
    cefrLevel: 'C1',
    category: 'Stylistic Conditionals',
    descriptionVi: 'Loại bỏ từ "If" và đảo trợ động từ "Were / Had / Should" lên đầu câu.',
    formula: 'Were S to + Verb  |  Had S + V3  |  Should S + Verb-bare',
    formulaTokens: [
      { role: 'Trợ động từ đảo', token: 'Were governments to subsidize', tag: 'Were + S + to-V', color: '#991b1b' },
      { role: 'Tân ngữ điều kiện', token: 'electric vehicles universally,', tag: 'Object', color: '#15803d' },
      { role: 'Mệnh đề kết quả', token: 'urban air pollutants would decline precipitously.', tag: 'would + V', color: '#1d4ed8' }
    ],
    explanationVi: 'Cấu trúc cực kỳ trang trọng thường xuất hiện trong các bài luận học thuật đỉnh cao để thay thế từ "If" đơn điệu.',
    ieltsUsageNote: 'Sử dụng ở câu chốt giải pháp cuối đoạn thân bài để tạo ấn tượng mạnh với giám khảo.',
    examples: [
      'Had fiscal regulators exercised stricter surveillance, the banking collapse would have been averted.',
      'Should market volatility persist, international investors will seek refuge in sovereign gold reserves.'
    ],
    commonMistakes: [
      {
        wrong: 'Had the government would intervened earlier, lives would be saved.',
        correct: 'Had the government intervened earlier, countless lives would have been spared.',
        note: 'Trong đảo ngữ loại 3, chỉ dùng "Had + S + V3", tuyệt đối không dùng "would" ở vế điều kiện.'
      }
    ],
    quiz: {
      prompt: 'Complete: "____ municipal authorities to build more tram networks, car usage would plummet."',
      options: ['Were', 'If were', 'Had', 'Should'],
      answer: 'Were',
      explanation: 'Đảo ngữ câu điều kiện loại 2: "Were [Subject] to [Verb]" thay cho "If [Subject] were to [Verb]".'
    },
    drillPrompt: 'Viết câu đảo ngữ điều kiện loại 2 bắt đầu bằng "Were schools to..."',
    sampleTransform: 'Were schools to mandate coding literacy, graduates would be far better equipped for the future workforce.'
  },

  // ===================== C2: TINH HOA NGỮ PHÁP 8.0+ (4 BÀI) =====================
  {
    id: 'cefr-c2-01',
    title: 'Cleft Sentences for Focus (Câu chẻ nhấn mạnh trọng tâm)',
    cefrLevel: 'C2',
    category: 'Information Packaging',
    descriptionVi: 'Kỹ thuật tách câu dùng "It is/was... that" hoặc "What... is" để dồn toàn bộ sự chú ý của người đọc vào điểm mấu chốt.',
    formula: 'It + is/was + [Emphasized Element] + that/who + Remaining Clause  |  What [S + V] + is/was + [Complement]',
    formulaTokens: [
      { role: 'Cấu trúc câu chẻ', token: 'It is', tag: 'It-Cleft', color: '#7c3aed' },
      { role: 'Thành phần nhấn mạnh', token: 'systemic policy reform, not individual goodwill,', tag: 'Focus', color: '#15803d' },
      { role: 'Mệnh đề That', token: 'that genuinely resolves environmental degradation.', tag: 'that-clause', color: '#1d4ed8' }
    ],
    explanationVi: 'Câu chẻ giúp câu văn trở nên đanh thép, mang tính nghị luận đỉnh cao. Thay vì viết "Education matters most", người viết Band 8.5 dùng "It is quality education that serves as the catalyst for societal mobility."',
    ieltsUsageNote: 'Vũ khí tối thượng cho câu Thesis Statement hoặc câu chốt khẳng định luận điểm ở Body Paragraphs.',
    examples: [
      'What most distinguishes exceptional leaders from average managers is their capacity for empathetic communication.',
      'It was the invention of the printing press that democratized knowledge across Renaissance Europe.'
    ],
    commonMistakes: [
      {
        wrong: 'What citizens desire it is transparent governance.',
        correct: 'What citizens desire is transparent governance.',
        note: 'Tránh lặp thừa đại từ "it" sau mệnh đề "What...".'
      }
    ],
    quiz: {
      prompt: 'Select the best cleft sentence emphasizing "early childhood education":',
      options: [
        'It is early childhood education that lays the psychological groundwork for future cognitive growth.',
        'What is early childhood education that lays the groundwork for growth.',
        'Early childhood education is what it lays the groundwork.',
        'It was early childhood education what laid the groundwork.'
      ],
      answer: 'It is early childhood education that lays the psychological groundwork for future cognitive growth.',
      explanation: 'Cấu trúc chuẩn: "It is [Element] that [Clause]" tạo trọng tâm lập luận học thuật sắc bén.'
    },
    drillPrompt: 'Viết lại câu sau thành câu chẻ "It is... that...": "Technological over-reliance erodes face-to-face interpersonal skills."',
    sampleTransform: 'It is excessive technological reliance that gradually erodes meaningful face-to-face communication.'
  },
  {
    id: 'cefr-c2-02',
    title: 'Advanced Subjunctive Mood (Bàng thái cách học thuật nâng cao)',
    cefrLevel: 'C2',
    category: 'Mood & Modality',
    descriptionVi: 'Cấu trúc giả định trang trọng đòi hỏi động từ nguyên mẫu không chia sau các tính từ và động từ mang tính cấp thiết.',
    formula: 'It is imperative / crucial / essential that + Subject + [Verb in Bare Infinitive]',
    formulaTokens: [
      { role: 'Tính từ cấp thiết', token: 'It is vital that', tag: 'Mandative Adj', color: '#7c3aed' },
      { role: 'Chủ ngữ', token: 'every sovereign nation', tag: 'S', color: '#15803d' },
      { role: 'Động từ nguyên mẫu', token: 'adhere', tag: 'V-bare', color: '#b91c1c' },
      { role: 'Bổ ngữ', token: 'to stringent carbon quota benchmarks.', tag: 'C', color: '#1d4ed8' }
    ],
    explanationVi: 'Trong văn phong học thuật cao cấp, sau "that", động từ luôn ở dạng nguyên mẫu BARE INFINITIVE, bất kể chủ ngữ là ngôi thứ 3 số ít.',
    ieltsUsageNote: 'Sử dụng khi viết câu khuyến nghị mang tầm vĩ mô trong Writing Task 2.',
    examples: [
      'It is imperative that the international community establish enforceable safeguards against rogue artificial intelligence.',
      'Experts recommend that every child be guaranteed unrestricted access to foundational literacy programs.'
    ],
    commonMistakes: [
      {
        wrong: 'It is essential that each student submits their assignment promptly.',
        correct: 'It is essential that each student submit their assignment promptly.',
        note: 'Subjunctive mood yêu cầu động từ nguyên mẫu không chia "submit", không dùng "submits".'
      }
    ],
    quiz: {
      prompt: 'Choose the correct subjunctive verb form: "It is crucial that the minister ____ the integrity of public healthcare records."',
      options: ['safeguards', 'safeguard', 'safeguarded', 'is safeguarding'],
      answer: 'safeguard',
      explanation: 'Theo cấu trúc Subjunctive sau "It is crucial that", động từ giữ nguyên mẫu: "safeguard".'
    },
    drillPrompt: 'Viết một câu khuyến nghị chính sách sử dụng cấu trúc "It is imperative that + S + [V-bare]...":',
    sampleTransform: 'It is imperative that municipal authorities modernize stormwater drainage systems to withstand extreme weather events.'
  },
  {
    id: 'cefr-c2-03',
    title: 'Locative & Directional Inversion (Đảo ngữ chỉ nơi chốn & Phương hướng)',
    cefrLevel: 'C2',
    category: 'Advanced Fronting',
    descriptionVi: 'Đưa cụm giới từ chỉ địa điểm lên đầu câu và đảo toàn bộ động từ chính lên trước chủ ngữ.',
    formula: 'Prepositional Phrase of Place + Main Verb + Subject (No auxiliary verb needed)',
    formulaTokens: [
      { role: 'Cụm giới từ địa điểm', token: 'At the heart of the environmental crisis', tag: 'Prep Phrase', color: '#0f766e' },
      { role: 'Động từ chính', token: 'lies', tag: 'V', color: '#991b1b' },
      { role: 'Chủ ngữ sau đảo', token: 'an unsustainable reliance on single-use consumer goods.', tag: 'Inverted S', color: '#15803d' }
    ],
    explanationVi: 'Khác với đảo ngữ phủ định dùng trợ động từ, đảo ngữ địa điểm đưa động từ chính (lies, stands, remains, emerges) đứng trực tiếp trước chủ ngữ.',
    ieltsUsageNote: 'Tạo câu mở đoạn (Topic Sentence) cực kỳ ấn tượng, mang tính văn phong học giả cao cấp.',
    examples: [
      'Underlying these escalating social tensions lies a profound deficit in educational equity.',
      'At the core of sustainable urban planning stands the fundamental imperative of accessible transit.'
    ],
    commonMistakes: [
      {
        wrong: 'At the center of the dispute does lie an economic conflict.',
        correct: 'At the center of the dispute lies an intractable economic conflict.',
        note: 'Đảo ngữ địa phương không dùng trợ động từ "does", động từ chính "lies" đứng trực tiếp trước chủ ngữ.'
      }
    ],
    quiz: {
      prompt: 'Select the correct locative inversion sentence:',
      options: [
        'Beneath the surface of technological optimism lie grave ethical dilemmas.',
        'Beneath the surface of technological optimism do lie grave ethical dilemmas.',
        'Beneath the surface of technological optimism grave ethical dilemmas lie.',
        'Beneath the surface of technological optimism are lying grave ethical dilemmas.'
      ],
      answer: 'Beneath the surface of technological optimism lie grave ethical dilemmas.',
      explanation: 'Cụm giới từ + Động từ chính (lie) + Chủ ngữ số nhiều (grave ethical dilemmas).'
    },
    drillPrompt: 'Viết câu mở đoạn dùng "At the core of this dilemma lies..." về vấn đề nhà ở.',
    sampleTransform: 'At the core of the urban housing dilemma lies a chronic deficit in publicly subsidized affordable developments.'
  },
  {
    id: 'cefr-c2-04',
    title: 'Sophisticated Concession: Notwithstanding & Albeit (Nhượng bộ học thuật)',
    cefrLevel: 'C2',
    category: 'Discourse Markers',
    descriptionVi: 'Sử dụng các liên từ nhượng bộ học thuật thượng thừa (Notwithstanding, Albeit, In spite of the fact that) thay thế "Although / But".',
    formula: 'Clause 1, albeit + Adjective / Phrase  |  Notwithstanding + Noun Phrase, Clause',
    formulaTokens: [
      { role: 'Mệnh đề chính', token: 'The nation achieved rapid industrial expansion,', tag: 'Main Clause', color: '#15803d' },
      { role: 'Nhượng bộ học thuật', token: 'albeit at a grievous ecological cost.', tag: 'Albeit + Prep', color: '#7c3aed' }
    ],
    explanationVi: '"Albeit" tương đương "even though / although", thường đi liền với tính từ hoặc cụm giới từ mà không cần mệnh đề đầy đủ. "Notwithstanding" có thể làm giới từ hoặc liên từ.',
    ieltsUsageNote: 'Tạo lập luận đa chiều, phức tạp và uyển chuyển chuẩn Band 8.5 - 9.0 trong bài thi Viết.',
    examples: [
      'Notwithstanding substantial public investment in rail networks, vehicular traffic remains congested.',
      'The candidate delivered an articulate defense, albeit somewhat lacking in empirical substantiation.'
    ],
    commonMistakes: [
      {
        wrong: 'Albeit it was raining heavily, the match proceeded.',
        correct: 'Although it was raining heavily, the match proceeded.',
        note: '"Albeit" không đi kèm mệnh đề đầy đủ có chủ ngữ và động từ chia thì; dùng "albeit + adj/phrase".'
      }
    ],
    quiz: {
      prompt: 'Choose the most scholarly phrasing using "albeit":',
      options: [
        'The reform represents progress, albeit gradual and overdue.',
        'The reform represents progress, albeit it is gradual.',
        'Albeit the reform is good, it took time.',
        'The reform is progress, albeit that it happened.'
      ],
      answer: 'The reform represents progress, albeit gradual and overdue.',
      explanation: '"Albeit" nối trực tiếp với tính từ "gradual and overdue" tạo câu văn súc tích, tinh tế.'
    },
    drillPrompt: 'Viết câu sử dụng "albeit" miêu tả giải pháp công nghệ mang lại kết quả nhưng tốn kém.',
    sampleTransform: 'Solar desalination represents a viable freshwater remedy for arid territories, albeit financially prohibitive for developing municipalities.'
  }
]
