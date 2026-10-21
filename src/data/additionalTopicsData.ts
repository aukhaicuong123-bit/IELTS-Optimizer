import type { TopicDefinition } from '../topicData'

export const ADDITIONAL_17_TOPICS: TopicDefinition[] = [
  // 9. TRAVEL & TOURISM
  {
    id: 'travel',
    titleEn: 'Travel, Tourism & Hospitality',
    titleVi: 'Du lịch & Khách sạn',
    accent: '#38bdf8',
    badgeColor: '#075985',
    icon: 'Compass',
    descriptionVi: 'Du lịch đại chúng, du lịch sinh thái, giao lưu văn hóa và tác động kinh tế của ngành công nghiệp không khói.',
    vocab: [
      {
        id: 'trav-1',
        term: 'ecotourism',
        ipa: '/ˈiːkəʊtʊərɪzəm/',
        type: 'Academic Word',
        meaningVi: 'du lịch sinh thái, thân thiện với môi trường tự nhiên',
        example: 'Ecotourism provides sustainable livelihoods for indigenous communities while safeguarding ecosystems.',
        collocations: ['promote ecotourism', 'sustainable ecotourism initiative']
      },
      {
        id: 'trav-2',
        term: 'mass tourism',
        ipa: '/mæs ˈtʊərɪzəm/',
        type: 'Collocation · IELTS',
        meaningVi: 'du lịch đại chúng, quy mô ồ ạt',
        example: 'Unregulated mass tourism often degrades historical monuments and strains municipal resources.',
        collocations: ['curb mass tourism', 'environmental fallout of mass tourism']
      },
      {
        id: 'trav-3',
        term: 'cultural assimilation',
        ipa: '/ˈkʌltʃərəl əˌsɪm.ɪˈleɪ.ʃən/',
        type: 'Academic Word',
        meaningVi: 'sự đồng hóa văn hóa',
        example: 'Frequent international travel promotes cultural empathy rather than forced assimilation.',
        collocations: ['resist cultural assimilation', 'process of assimilation']
      },
      {
        id: 'trav-4',
        term: 'hospitality industry',
        ipa: '/ˌhɒs.pɪˈtæl.ə.ti ˈɪn.dəs.tri/',
        type: 'Collocation · IELTS',
        meaningVi: 'ngành dịch vụ khách sạn - nhà hàng',
        example: 'The hospitality industry contributes significantly to foreign currency reserves in developing nations.',
        collocations: ['boom in the hospitality industry', 'hospitality sector workforce']
      },
      {
        id: 'trav-5',
        term: 'off the beaten track',
        ipa: '/ɒf ðə ˈbiːtn træk/',
        type: 'Idiom',
        meaningVi: 'nơi hẻo lánh, hoang sơ, ít du khách lui tới',
        example: 'Adventurous travellers prefer destinations off the beaten track to experience authentic local life.',
        collocations: ['travel off the beaten track', 'remote destinations']
      },
      {
        id: 'trav-6',
        term: 'carbon footprint of aviation',
        ipa: '/ˈkɑːbən ˈfʊtprɪnt əv ˌeɪviˈeɪʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'dấu chân carbon từ ngành hàng không',
        example: 'Levying kerosene taxes could reduce the soaring carbon footprint of commercial aviation.',
        collocations: ['offset carbon footprint', 'aviation emissions']
      },
      {
        id: 'trav-7',
        term: 'itinerary planning',
        ipa: '/aɪˈtɪnərəri ˈplænɪŋ/',
        type: 'Academic Word',
        meaningVi: 'lập kế hoạch lộ trình du lịch',
        example: 'Careful itinerary planning allows travellers to minimize transit time and maximize immersion.',
        collocations: ['flexible itinerary', 'customized travel itinerary']
      },
      {
        id: 'trav-8',
        term: 'seasonal influx of tourists',
        ipa: '/ˈsiːzənl ˈɪnflʌks əv ˈtʊərɪsts/',
        type: 'Collocation · IELTS',
        meaningVi: 'làn sóng du khách đổ về theo mùa',
        example: 'Coastal towns struggle to manage waste during the seasonal influx of international holidaymakers.',
        collocations: ['cope with an influx', 'unprecedented tourist influx']
      },
      {
        id: 'trav-9',
        term: 'broaden one’s horizons',
        ipa: '/ˈbrɔːdn wʌnz həˈraɪznz/',
        type: 'Idiom',
        meaningVi: 'mở rộng tầm nhìn, mở mang hiểu biết',
        example: 'Immersing oneself in foreign cultures fundamentally broadens an individual’s worldview and intellectual horizons.',
        collocations: ['broaden cultural horizons', 'expand personal outlook']
      },
      {
        id: 'trav-10',
        term: 'revenue leakage',
        ipa: '/ˈrevənjuː ˈliːkɪdʒ/',
        type: 'Academic Word',
        meaningVi: 'thất thoát doanh thu du lịch về các tập đoàn đa quốc gia nước ngoài',
        example: 'Tourism revenue leakage prevents local inhabitants from reaping equitable economic benefits.',
        collocations: ['combat revenue leakage', 'leakage to foreign tour operators']
      }
    ],
    grammar: [
      {
        id: 'trav-g1',
        title: 'Cleft Sentences for Emphasis in Travel Essays',
        level: 'Band 7.5+',
        explanationVi: 'Dùng cấu trúc "It is... that" để nhấn mạnh trách nhiệm của du khách hoặc cơ quan quản lý.',
        formula: 'It is + [Emphasised Element] + that + Remaining Clause',
        examples: [
          'It is responsible visitor conduct that preserves vulnerable heritage monuments.',
          'It is the local economy that benefits most from community-based homestays.'
        ],
        drillPrompt: 'Viết lại câu nhấn mạnh vai trò của du lịch sinh thái: "Sustainable management safeguards biodiversity."',
        sampleTransform: 'It is sustainable ecotourism management that truly safeguards fragile natural biodiversity.'
      },
      {
        id: 'trav-g2',
        title: 'Participle Clauses in Descriptive Writing',
        level: 'Band 7.0+',
        explanationVi: 'Dùng V-ing đứng đầu câu để kết nối nguyên nhân và kết quả mượt mà.',
        formula: 'Present Participle (V-ing) + Object, Subject + Verb',
        examples: [
          'Attracting millions of overseas visitors annually, the coastal resort has seen rapid infrastructural modernization.',
          'Lacking stringent environmental codes, the island suffered severe coral reef bleaching.'
        ],
        drillPrompt: 'Nối hai câu sau dùng V-ing: "The city recognized the danger of overcrowding. It capped daily tourist permits."',
        sampleTransform: 'Recognizing the grave perils of overtourism, the municipality capped daily visitor permits to the historic center.'
      }
    ],
    listening: {
      id: 'lis-travel-01',
      title: 'Sustainable Tourism Strategies in Historic Towns',
      level: 'Band 7.0',
      durationMinutes: 4,
      audioText: 'The municipal committee today debated the escalating impacts of mass holiday cruises docking at our ancient port...',
      questions: [
        {
          id: 'q-lis-trav-1',
          prompt: 'What was identified as the primary consequence of unregulated cruise ships?',
          options: ['Water pollution and pier congestion', 'Loss of hotel employment', 'Flight cancellations', 'Retail decline'],
          answer: 'Water pollution and pier congestion',
          explanation: 'The speaker explicitly emphasized pier overcrowding and marine pollution.'
        }
      ]
    },
    writing: {
      task1Prompt: 'The chart below shows tourist arrivals in five European cities from 2000 to 2020.',
      task2Prompt: 'Some people believe international tourism creates mutual understanding, while others argue it damages local customs. Discuss both views and give your opinion.',
      sampleBand8: 'International travel is widely heralded as a potent instrument for fostering cross-cultural empathy...'
    },
    speaking: {
      part1: ['Do you prefer travelling alone or with friends?', 'What is your dream holiday destination?'],
      part2: {
        cueCard: 'Describe a memorable journey or trip you took that broadened your horizons.',
        bulletPoints: ['Where you went', 'Who accompanied you', 'What unique experiences you had', 'Why it left a lasting impression'],
        followUp: 'How has tourism in your home country changed over the past decade?'
      },
      part3: ['How can governments balance tourist revenues with heritage preservation?', 'Do you think space tourism will become viable?']
    }
  },

  // 10. GLOBALIZATION
  {
    id: 'globalization',
    titleEn: 'Globalization & International Relations',
    titleVi: 'Toàn cầu hóa & Quan hệ quốc tế',
    accent: '#818cf8',
    badgeColor: '#3730a3',
    icon: 'Globe',
    descriptionVi: 'Thương mại quốc tế, hội nhập kinh tế, giao thoa văn hóa, và sự phụ thuộc lẫn nhau giữa các quốc gia.',
    vocab: [
      {
        id: 'glob-1',
        term: 'interdependence',
        ipa: '/ˌɪntədɪˈpendəns/',
        type: 'Academic Word',
        meaningVi: 'sự phụ thuộc lẫn nhau giữa các quốc gia',
        example: 'Economic interdependence means that domestic financial shocks swiftly reverberate worldwide.',
        collocations: ['global interdependence', 'deepening economic interdependence']
      },
      {
        id: 'glob-2',
        term: 'multinational corporation',
        ipa: '/ˌmʌltiˈnæʃnəl ˌkɔːpəˈreɪʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'tập đoàn đa quốc gia',
        example: 'Multinational corporations frequently shift production to nations with lower regulatory compliance costs.',
        collocations: ['regulate multinational corporations', 'foreign direct investment by MNCs']
      },
      {
        id: 'glob-3',
        term: 'cultural homogenization',
        ipa: '/ˈkʌltʃərəl həˌmɒdʒənaɪˈzeɪʃn/',
        type: 'Academic Word',
        meaningVi: 'sự đồng nhất hóa văn hóa, mất đi bản sắc địa phương',
        example: 'Critics warn that Western consumerist culture drives cultural homogenization across Asia.',
        collocations: ['threat of cultural homogenization', 'homogenization of urban lifestyles']
      },
      {
        id: 'glob-4',
        term: 'tariff barriers',
        ipa: '/ˈtærɪf ˈbæriəz/',
        type: 'Collocation · IELTS',
        meaningVi: 'hàng rào thuế quan',
        example: 'Dismantling protective tariff barriers stimulated cross-border trade but challenged domestic farmers.',
        collocations: ['impose tariff barriers', 'lower bilateral tariffs']
      },
      {
        id: 'glob-5',
        term: 'supply chain disruption',
        ipa: '/səˈplaɪ tʃeɪn dɪsˈrʌpʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự đứt gãy chuỗi cung ứng',
        example: 'Recent geopolitical conflicts caused severe supply chain disruptions for crucial semiconductor chips.',
        collocations: ['mitigate supply chain disruptions', 'resilient global supply chains']
      },
      {
        id: 'glob-6',
        term: 'brain drain',
        ipa: '/ˈbreɪn dreɪn/',
        type: 'Idiom',
        meaningVi: 'chảy máu chất xám',
        example: 'Developing countries suffer from severe brain drain as talented physicians emigrate for lucrative salaries.',
        collocations: ['reverse the brain drain', 'stem the brain drain']
      },
      {
        id: 'glob-7',
        term: 'diplomatic friction',
        ipa: '/ˌdɪpləˈmætɪk ˈfrɪkʃn/',
        type: 'Academic Word',
        meaningVi: 'ma sát, căng thẳng ngoại giao',
        example: 'Territorial disputes often incite diplomatic friction between neighboring sovereign states.',
        collocations: ['defuse diplomatic friction', 'bilateral friction']
      },
      {
        id: 'glob-8',
        term: 'foreign direct investment',
        ipa: '/ˈfɒrən daɪˈrekt ɪnˈvestmənt/',
        type: 'Collocation · IELTS',
        meaningVi: 'vốn đầu tư trực tiếp nước ngoài (FDI)',
        example: 'Attracting foreign direct investment is instrumental in modernizing national manufacturing capabilities.',
        collocations: ['inflow of FDI', 'stimulate direct investment']
      },
      {
        id: 'glob-9',
        term: 'bilateral agreements',
        ipa: '/baɪˈlætərəl əˈɡriːmənts/',
        type: 'Academic Word',
        meaningVi: 'các hiệp định song phương',
        example: 'Both nations signed bilateral agreements to reduce trade barriers and intellectual property piracy.',
        collocations: ['ratify bilateral agreements', 'free trade pact']
      },
      {
        id: 'glob-10',
        term: 'level playing field',
        ipa: '/ˈlevl ˈpleɪɪŋ fiːld/',
        type: 'Idiom',
        meaningVi: 'môi trường cạnh tranh công bằng, bình đẳng',
        example: 'International trade treaties strive to establish a level playing field for domestic small businesses.',
        collocations: ['create a level playing field', 'maintain fair competition']
      }
    ],
    grammar: [
      {
        id: 'glob-g1',
        title: 'Negative Inversion with "Not only... but also"',
        level: 'Band 8.0+',
        explanationVi: 'Nhấn mạnh hai lợi ích hoặc hai rủi ro của toàn cầu hóa.',
        formula: 'Not only + Aux + Subject + Verb, but S + also + Verb',
        examples: [
          'Not only does trade integration spur national GDP, but it also democratizes technological know-how.',
          'Not only has globalization accelerated scientific cooperation, but it has also unified global supply logistics.'
        ],
        drillPrompt: 'Viết lại dùng đảo ngữ: "Globalization creates jobs and enriches consumer choice."',
        sampleTransform: 'Not only does globalization generate abundant employment, but it also remarkably enriches consumer choice.'
      },
      {
        id: 'glob-g2',
        title: 'Passive Constructions with Impersonal "It"',
        level: 'Band 7.5+',
        explanationVi: 'Diễn đạt quan điểm khách quan, trung tính trong bài nghị luận học thuật.',
        formula: 'It is widely believed / argued / recognized that + Clause',
        examples: [
          'It is widely contended that multinational firms should bear ethical responsibilities for carbon mitigation.',
          'It is universally accepted that multilateral treaties are essential to confront cross-border climate risks.'
        ],
        drillPrompt: 'Chuyển quan điểm chủ quan thành văn phong trung lập: "People think globalization harms small businesses."',
        sampleTransform: 'It is frequently contended that unchecked globalization compromises the commercial viability of localized enterprises.'
      }
    ],
    listening: {
      id: 'lis-glob-01',
      title: 'The Evolution of Cross-Border Trade Alliances',
      level: 'Band 7.5',
      durationMinutes: 4,
      audioText: 'Good morning delegates. Today we examine the transition from regional trade blocs to digital cross-border commerce...',
      questions: [
        {
          id: 'q-lis-glob-1',
          prompt: 'What was cited as the principal driver of recent supply chain re-shoring?',
          options: ['Geopolitical instability and transport bottlenecks', 'Lack of consumer interest', 'Currency shortages', 'Declining labor wages'],
          answer: 'Geopolitical instability and transport bottlenecks',
          explanation: 'The speaker highlighted freight disruptions and geopolitical risks.'
        }
      ]
    },
    writing: {
      task1Prompt: 'The graph illustrates global trade volumes and shipping container costs from 2005 to 2022.',
      task2Prompt: 'Globalization has led to cultural similarity across different nations. Do the advantages of this trend outweigh the disadvantages?',
      sampleBand8: 'The inexorable march of globalization has precipitated an unprecedented degree of cultural convergence...'
    },
    speaking: {
      part1: ['Do you often buy imported goods?', 'How does international news affect your daily thinking?'],
      part2: {
        cueCard: 'Describe an international product or cultural trend that became popular in your country.',
        bulletPoints: ['What it is', 'Where it originated', 'How people responded to it', 'Why it achieved widespread popularity'],
        followUp: 'Do you think this trend will endure in the long run?'
      },
      part3: ['How can countries protect local traditions while embracing foreign investments?', 'Will national borders matter in 50 years?']
    }
  },

  // 11. MEDIA & ADVERTISING
  {
    id: 'media',
    titleEn: 'Media, Advertising & News',
    titleVi: 'Truyền thông & Quảng cáo',
    accent: '#fb7185',
    badgeColor: '#9f1239',
    icon: 'Radio',
    descriptionVi: 'Ảnh hưởng của quảng cáo, tin giả, mạng xã hội, và trách nhiệm đạo đức của báo chí truyền thông.',
    vocab: [
      {
        id: 'med-1',
        term: 'misinformation',
        ipa: '/ˌmɪs.ɪn.fəˈmeɪ.ʃən/',
        type: 'Academic Word',
        meaningVi: 'thông tin sai lệch, thất thiệt',
        example: 'The rapid dissemination of online misinformation undermines public confidence in democratic institutions.',
        collocations: ['combat online misinformation', 'rampant misinformation']
      },
      {
        id: 'med-2',
        term: 'subliminal advertising',
        ipa: '/sʌbˈlɪmɪnl ˈædvətaɪzɪŋ/',
        type: 'Collocation · IELTS',
        meaningVi: 'quảng cáo tiềm thức, tác động vô thức đến người mua',
        example: 'Critics advocate strict bans on subliminal advertising targeted at impressionable young consumers.',
        collocations: ['ban subliminal advertising', 'psychological influence of subliminal ads']
      },
      {
        id: 'med-3',
        term: 'sensationalism',
        ipa: '/senˈseɪʃənəlɪzəm/',
        type: 'Academic Word',
        meaningVi: 'xu hướng giật gân, câu khách của báo chí',
        example: 'Commercial news outlets frequently resort to sensationalism to inflate web traffic and click-through rates.',
        collocations: ['media sensationalism', 'succumb to sensationalism']
      },
      {
        id: 'med-4',
        term: 'echo chamber',
        ipa: '/ˈekəʊ ˈtʃeɪmbə/',
        type: 'Idiom',
        meaningVi: 'buồng vang thông tin (nơi người ta chỉ nghe thấy quan điểm giống mình)',
        example: 'Social media algorithms risk trapping users in ideological echo chambers that polarize civic discourse.',
        collocations: ['escape an echo chamber', 'algorithmic echo chambers']
      },
      {
        id: 'med-5',
        term: 'consumerist culture',
        ipa: '/kənˈsjuːmərɪst ˈkʌltʃə/',
        type: 'Collocation · IELTS',
        meaningVi: 'văn hóa tiêu dùng chuộng vật chất',
        example: 'Aggressive marketing campaigns fuel an unsustainable consumerist culture of disposable goods.',
        collocations: ['foster a consumerist culture', 'entrenched consumerism']
      },
      {
        id: 'med-6',
        term: 'journalistic integrity',
        ipa: '/ˌdʒɜːnəˈlɪstɪk ɪnˈteɡrəti/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự liêm chính, chuẩn mực đạo đức của người làm báo',
        example: 'Upholding journalistic integrity necessitates rigorous fact-checking and unbiased reporting.',
        collocations: ['compromise journalistic integrity', 'adhere to professional integrity']
      },
      {
        id: 'med-7',
        term: 'targeted advertising',
        ipa: '/ˈtɑːɡɪtɪd ˈædvətaɪzɪŋ/',
        type: 'Collocation · IELTS',
        meaningVi: 'quảng cáo nhắm mục tiêu dựa trên dữ liệu người dùng',
        example: 'Big tech platforms leverage personal browsing data to conduct highly tailored targeted advertising.',
        collocations: ['opt out of targeted advertising', 'algorithmic advertising']
      },
      {
        id: 'med-8',
        term: 'media literacy',
        ipa: '/ˈmiːdiə ˈlɪtərəsi/',
        type: 'Academic Word',
        meaningVi: 'năng lực hiểu và đánh giá thông tin truyền thông',
        example: 'Incorporating media literacy into secondary curricula empowers teenagers to discern credible news sources.',
        collocations: ['cultivate media literacy', 'digital media literacy programs']
      },
      {
        id: 'med-9',
        term: 'sway public opinion',
        ipa: '/sweɪ ˈpʌblɪk əˈpɪnjən/',
        type: 'Idiom',
        meaningVi: 'lèo lái, chi phối dư luận xã hội',
        example: 'Coordinated PR campaigns can decisively sway public opinion on contentious public policies.',
        collocations: ['power to sway public opinion', 'influence public sentiment']
      },
      {
        id: 'med-10',
        term: 'manipulation of data',
        ipa: '/məˌnɪpjʊˈleɪʃn əv ˈdeɪtə/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự thao túng, bóp méo dữ liệu',
        example: 'Deliberate manipulation of statistical data by advertisers misleads consumers regarding health claims.',
        collocations: ['unethical manipulation', 'data distortion']
      }
    ],
    grammar: [
      {
        id: 'med-g1',
        title: 'Cleft Sentences with "What... is"',
        level: 'Band 7.5+',
        explanationVi: 'Dùng mệnh đề danh từ để đưa trọng tâm lên đầu câu nhằm khẳng định luận điểm đanh thép.',
        formula: 'What + S + V + is/was + Complement',
        examples: [
          'What distinguishes objective journalism from propaganda is transparent verification of primary sources.',
          'What concerns child psychologists most is the pervasive influence of unmonitored digital ads.'
        ],
        drillPrompt: 'Viết lại nhấn mạnh sự thật: "Unregulated social media spreads fake news quickly."',
        sampleTransform: 'What facilitates the meteoric spread of misinformation is the absence of algorithmic oversight.'
      },
      {
        id: 'med-g2',
        title: 'Mixed Conditionals (Quá khứ ảnh hưởng đến Hiện tại)',
        level: 'Band 8.0+',
        explanationVi: 'Kết hợp điều kiện quá khứ (If + had + V3) với hệ quả ở hiện tại (would + V-inf).',
        formula: 'If + S + had + V3, S + would + V-inf (now)',
        examples: [
          'If governments had enacted digital privacy statutes a decade ago, personal data would be far safer today.',
          'If citizens had received media literacy education, public discourse would not be so acutely polarized now.'
        ],
        drillPrompt: 'Viết câu điều kiện hỗn hợp về việc quản lý quảng cáo độc hại.',
        sampleTransform: 'If strict ad limits had been mandated years ago, children would not suffer from severe consumerist pressure today.'
      }
    ],
    listening: {
      id: 'lis-med-01',
      title: 'Algorithmic Personalization and Journalistic Ethics',
      level: 'Band 7.5',
      durationMinutes: 4,
      audioText: 'Today we interview Professor Harris on the intersection between algorithmic feed design and journalistic independence...',
      questions: [
        {
          id: 'q-lis-med-1',
          prompt: 'According to Professor Harris, what is the core ethical hazard of click-based metrics?',
          options: ['Prioritizing viral outrage over nuanced investigation', 'Higher printing expenditures', 'Loss of international subscribers', 'Server overload'],
          answer: 'Prioritizing viral outrage over nuanced investigation',
          explanation: 'The professor stated newsrooms sacrifice depth in pursuit of viral engagement.'
        }
      ]
    },
    writing: {
      task1Prompt: 'The chart demonstrates preferred news channels across four age cohorts from 2012 to 2022.',
      task2Prompt: 'Nowadays, consumers are influenced heavily by advertising. Some believe this leads to superficial consumerism. To what extent do you agree?',
      sampleBand8: 'In an era saturated with sophisticated commercial marketing, advertisements wield unprecedented leverage...'
    },
    speaking: {
      part1: ['How do you usually catch up with current affairs?', 'Do you find social media ads annoying?'],
      part2: {
        cueCard: 'Describe an advertisement you saw that persuaded you to buy a product or service.',
        bulletPoints: ['What product was advertised', 'Where you encountered the ad', 'What technique made it persuasive', 'How you felt after making the purchase'],
        followUp: 'Do you still use that product today?'
      },
      part3: ['Should advertisements targeted at young children be prohibited?', 'Is printed journalism destined to disappear?']
    }
  },

  // 12. SCIENCE & RESEARCH
  {
    id: 'science',
    titleEn: 'Science, Research & Ethics',
    titleVi: 'Khoa học & Đạo đức nghiên cứu',
    accent: '#a855f7',
    badgeColor: '#6b21a8',
    icon: 'Atom',
    descriptionVi: 'Đột phá khoa học, đạo đức sinh học, biến đổi gen, trí tuệ nhân tạo và vai trò của tài trợ nghiên cứu.',
    vocab: [
      {
        id: 'sci-1',
        term: 'breakthrough',
        ipa: '/ˈbreɪkθruː/',
        type: 'Academic Word',
        meaningVi: 'bước đột phá khoa học mang tính cách mạng',
        example: 'Genetic gene-editing represents a profound breakthrough in eradicating hereditary blood disorders.',
        collocations: ['scientific breakthrough', 'herald a major breakthrough']
      },
      {
        id: 'sci-2',
        term: 'bioethics',
        ipa: '/ˌbaɪ.əʊˈeθ.ɪks/',
        type: 'Academic Word',
        meaningVi: 'đạo đức sinh học trong y học và di truyền',
        example: 'Cloning mammals raises thorny questions of bioethics that current legal frameworks fail to address.',
        collocations: ['adhere to principles of bioethics', 'bioethical quandary']
      },
      {
        id: 'sci-3',
        term: 'clinical trial',
        ipa: '/ˈklɪnɪkl ˈtraɪəl/',
        type: 'Collocation · IELTS',
        meaningVi: 'thử nghiệm lâm sàng trên người',
        example: 'Novel pharmaceuticals must undergo rigorous three-phase clinical trials before regulatory endorsement.',
        collocations: ['conduct clinical trials', 'pass randomized trials']
      },
      {
        id: 'sci-4',
        term: 'empirical evidence',
        ipa: '/ɪmˈpɪrɪkl ˈevɪdəns/',
        type: 'Academic Word',
        meaningVi: 'bằng chứng thực nghiệm thu thập từ quan sát thực tế',
        example: 'Hypotheses must be corroborated by robust empirical evidence before gaining consensus in scientific communities.',
        collocations: ['gather empirical evidence', 'supported by empirical data']
      },
      {
        id: 'sci-5',
        term: 'double-edged sword',
        ipa: '/ˌdʌbl edʒd ˈsɔːd/',
        type: 'Idiom',
        meaningVi: 'con dao hai lưỡi (vừa có lợi vừa có hại)',
        example: 'Nuclear energy remains a classic double-edged sword, offering boundless power alongside apocalyptic peril.',
        collocations: ['prove to be a double-edged sword', 'wield a double-edged tool']
      },
      {
        id: 'sci-6',
        term: 'peer review',
        ipa: '/ˈpɪə rɪvjuː/',
        type: 'Academic Word',
        meaningVi: 'đánh giá ngang hàng bởi các chuyên gia độc lập',
        example: 'Rigorous peer review prevents flawed methodology and fraudulent data from being disseminated.',
        collocations: ['subjected to peer review', 'peer-reviewed academic journal']
      },
      {
        id: 'sci-7',
        term: 'genetic modification',
        ipa: '/dʒəˈnetɪk ˌmɒdɪfɪˈkeɪʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'biến đổi gen nhân tạo',
        example: 'Genetic modification of staple crops enhances drought resistance and bolsters agricultural yields.',
        collocations: ['advances in genetic modification', 'controversy surrounding GMOs']
      },
      {
        id: 'sci-8',
        term: 'state-funded research',
        ipa: '/steɪt ˈfʌndɪd rɪˈsɜːtʃ/',
        type: 'Collocation · IELTS',
        meaningVi: 'nghiên cứu do nhà nước tài trợ',
        example: 'State-funded research ensures that vital scientific discoveries remain accessible in the public domain.',
        collocations: ['rely on state-funded research', 'allocate grants for research']
      },
      {
        id: 'sci-9',
        term: 'push the boundaries',
        ipa: '/pʊʃ ðə ˈbaʊndriz/',
        type: 'Idiom',
        meaningVi: 'vượt qua ranh giới, mở rộng giới hạn hiểu biết',
        example: 'Theoretical physicists continually push the boundaries of human comprehension regarding quantum mechanics.',
        collocations: ['push scientific boundaries', 'expand horizons']
      },
      {
        id: 'sci-10',
        term: 'unforeseen ramifications',
        ipa: '/ˌʌnfɔːˈsiːn ˌræmɪfɪˈkeɪʃnz/',
        type: 'Academic Word',
        meaningVi: 'hệ quả khôn lường không lường trước được',
        example: 'Deploying autonomous military systems could yield catastrophic unforeseen ramifications.',
        collocations: ['trigger unforeseen ramifications', 'entail grave ramifications']
      }
    ],
    grammar: [
      {
        id: 'sci-g1',
        title: 'Subjunctive Mood in Scientific Imperatives',
        level: 'Band 8.0+',
        explanationVi: 'Dùng dạng động từ nguyên mẫu không chia sau các tính từ chỉ tính cấp thiết trong nghiên cứu.',
        formula: 'It is essential / imperative / crucial that + S + [Bare Verb]',
        examples: [
          'It is imperative that every medical laboratory adhere strictly to international biohazard protocols.',
          'Scientific ethicists recommend that artificial intelligence algorithms be transparently audited.'
        ],
        drillPrompt: 'Viết câu subjunctive về an toàn thử nghiệm thuốc: "Scientists must test vaccines safely."',
        sampleTransform: 'It is vital that new pharmaceutical compounds be rigorously evaluated before commercial distribution.'
      },
      {
        id: 'sci-g2',
        title: 'Passive with Modal Verbs for Recommendations',
        level: 'Band 7.0+',
        explanationVi: 'Đưa ra giải pháp chính sách khoa học với văn phong khách quan.',
        formula: 'Modal (should / must / ought to) + be + Past Participle (V3)',
        examples: [
          'Public funds should be channeled toward renewable energy alternatives rather than fossil fuel subsidies.',
          'Strict ethical oversight must be established to monitor human embryo gene alteration.'
        ],
        drillPrompt: 'Chuyển sang bị động với modal: "Governments must monitor artificial intelligence systems."',
        sampleTransform: 'Autonomous computational models must be monitored continually by independent regulatory commissions.'
      }
    ],
    listening: {
      id: 'lis-sci-01',
      title: 'Gene Editing and the Future of Hereditary Medicine',
      level: 'Band 7.5',
      durationMinutes: 4,
      audioText: 'In our annual biotechnology seminar, Dr. Evelyn Vance outlines the transformative potential of CRISPR technology...',
      questions: [
        {
          id: 'q-lis-sci-1',
          prompt: 'What was mentioned as the chief bioethical concern regarding germline gene editing?',
          options: ['Heritable alterations passed to subsequent generations', 'High cost of laboratory equipment', 'Delays in patent approval', 'Scarcity of donors'],
          answer: 'Heritable alterations passed to subsequent generations',
          explanation: 'Dr. Vance specifically warned about permanent genetic mutations inherited by offspring.'
        }
      ]
    },
    writing: {
      task1Prompt: 'The diagram displays the four phases of a clinical pharmaceutical trial.',
      task2Prompt: 'Some people think state funding should be spent only on practical science that improves life, not theoretical science. Discuss both views.',
      sampleBand8: 'Scientific inquiry has long occupied a pivotal role in driving societal advancement and technological innovation...'
    },
    speaking: {
      part1: ['Did you enjoy studying science subjects at school?', 'What scientific invention do you find most useful?'],
      part2: {
        cueCard: 'Describe a scientific breakthrough or discovery that you find particularly fascinating.',
        bulletPoints: ['What discovery it is', 'How you learned about it', 'How it affects human life', 'Why you consider it remarkable'],
        followUp: 'Do you think this technology will become commonplace soon?'
      },
      part3: ['Should governments regulate artificial intelligence research?', 'Why are fewer students choosing scientific careers?']
    }
  },

  // 13. ECONOMY & FINANCE
  {
    id: 'economy',
    titleEn: 'Economy, Finance & Consumerism',
    titleVi: 'Kinh tế & Tài chính',
    accent: '#10b981',
    badgeColor: '#065f46',
    icon: 'TrendingUp',
    descriptionVi: 'Lạm phát, phân hóa giàu nghèo, quản lý tài chính cá nhân, bất bình đẳng thu nhập và chu kỳ kinh tế.',
    vocab: [
      {
        id: 'eco-1',
        term: 'income inequality',
        ipa: '/ˈɪnkʌm ˌɪnɪˈkwɒləti/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự bất bình đẳng thu nhập',
        example: 'Widening income inequality hampers social cohesion and restricts upward generational mobility.',
        collocations: ['tackle income inequality', 'gap in wealth distribution']
      },
      {
        id: 'eco-2',
        term: 'inflationary pressure',
        ipa: '/ɪnˈfleɪʃənəri ˈpreʃə/',
        type: 'Academic Word',
        meaningVi: 'áp lực lạm phát, giá cả tăng cao',
        example: 'Surging energy costs exert persistent inflationary pressure on household living expenditures.',
        collocations: ['curb inflationary pressures', 'mounting inflation']
      },
      {
        id: 'eco-3',
        term: 'fiscal stimulus',
        ipa: '/ˈfɪskl ˈstɪmjələs/',
        type: 'Academic Word',
        meaningVi: 'gói kích thích tài khóa của chính phủ',
        example: 'The administration injected massive fiscal stimulus packages to avert economic recession.',
        collocations: ['implement fiscal stimulus', 'stimulus spending']
      },
      {
        id: 'eco-4',
        term: 'cost of living crisis',
        ipa: '/kɒst əv ˈlɪvɪŋ ˈkraɪsɪs/',
        type: 'Collocation · IELTS',
        meaningVi: 'khủng hoảng chi phí sinh hoạt',
        example: 'Urban workers face a severe cost of living crisis due to soaring rental rates and utility bills.',
        collocations: ['endure a cost of living crisis', 'mitigate household financial burdens']
      },
      {
        id: 'eco-5',
        term: 'make ends meet',
        ipa: '/meɪk endz miːt/',
        type: 'Idiom',
        meaningVi: 'xoay xở đủ sống, giật gấu vá vai',
        example: 'Minimum-wage earners frequently struggle to make ends meet in major financial capitals.',
        collocations: ['barely make ends meet', 'struggle to survive']
      },
      {
        id: 'eco-6',
        term: 'progressive taxation',
        ipa: '/prəˈɡresɪv tækˈseɪʃn/',
        type: 'Academic Word',
        meaningVi: 'hệ thống thuế lũy tiến (người giàu đóng tỷ lệ cao hơn)',
        example: 'Implementing progressive taxation schemes redistributes wealth to subsidize vital public healthcare.',
        collocations: ['levy progressive taxation', 'redistributive fiscal system']
      },
      {
        id: 'eco-7',
        term: 'purchasing power',
        ipa: '/ˈpɜːtʃəsɪŋ ˌpaʊə/',
        type: 'Academic Word',
        meaningVi: 'sức mua của đồng tiền',
        example: 'Continuous inflation gradually erodes the purchasing power of citizens on fixed retirement pensions.',
        collocations: ['erosion of purchasing power', 'maintain consumer purchasing ability']
      },
      {
        id: 'eco-8',
        term: 'recessionary downturn',
        ipa: '/rɪˈseʃənri ˈdaʊntɜːn/',
        type: 'Collocation · IELTS',
        meaningVi: 'suy thoái kinh tế',
        example: 'Small enterprises rarely possess adequate capital buffers to withstand prolonged recessionary downturns.',
        collocations: ['weather a downturn', 'economic contraction']
      },
      {
        id: 'eco-9',
        term: 'tighten one’s belt',
        ipa: '/ˈtaɪtn wʌnz belt/',
        type: 'Idiom',
        meaningVi: 'thắt lưng buộc bụng, tiết kiệm chi tiêu',
        example: 'Faced with rising interest rates, middle-class households are compelled to tighten their belts.',
        collocations: ['forced to tighten belts', 'curtail discretionary spending']
      },
      {
        id: 'eco-10',
        term: 'conspicuous consumption',
        ipa: '/kənˈspɪkjuəs kənˈsʌmpʃn/',
        type: 'Academic Word',
        meaningVi: 'tiêu dùng khoe mẽ, phô trương sự giàu có',
        example: 'Conspicuous consumption of luxury goods is frequently driven by social media vanity.',
        collocations: ['fuel conspicuous consumption', 'ostentatious display of wealth']
      }
    ],
    grammar: [
      {
        id: 'eco-g1',
        title: 'Comparative Correlative (The more... the more)',
        level: 'Band 7.5+',
        explanationVi: 'Biểu thị mối tương quan tỷ lệ thuận hoặc nghịch giữa hai biến số kinh tế.',
        formula: 'The + Comparative + Clause, The + Comparative + Clause',
        examples: [
          'The wider the income disparity grows, the more acute social unrest becomes.',
          'The higher the central bank pushes interest rates, the lower business investment drops.'
        ],
        drillPrompt: 'Viết câu so sánh kép về lạm phát và sức mua.',
        sampleTransform: 'The more persistent inflationary pressures become, the more severely household purchasing power deteriorates.'
      },
      {
        id: 'eco-g2',
        title: 'Inversion with "Only by / Only when"',
        level: 'Band 8.0+',
        explanationVi: 'Đảo ngữ để nhấn mạnh biện pháp kinh tế duy nhất có hiệu quả.',
        formula: 'Only by + V-ing / Only when + Clause, Aux + S + Verb',
        examples: [
          'Only by restructuring the progressive tax code can the state meaningfully alleviate wealth polarization.',
          'Only when fiscal stability is restored will foreign investors regain confidence in emerging markets.'
        ],
        drillPrompt: 'Viết lại bằng đảo ngữ "Only by...": "Governments can stimulate growth by investing in infrastructure."',
        sampleTransform: 'Only by allocating generous funding to green infrastructure can governments stimulate sustainable economic revitalization.'
      }
    ],
    listening: {
      id: 'lis-eco-01',
      title: 'Macroeconomic Strategies for Wealth Inequality Mitigation',
      level: 'Band 7.5',
      durationMinutes: 4,
      audioText: 'In this symposium on monetary policy, chief economist Laura Vance analyzes the structural causes of post-crisis inflation...',
      questions: [
        {
          id: 'q-lis-eco-1',
          prompt: 'What measure did the economist advocate to shield low-income households?',
          options: ['Targeted energy vouchers and progressive wealth taxation', 'Reducing corporate taxes', 'Freezing bank loans', 'Lowering school budgets'],
          answer: 'Targeted energy vouchers and progressive wealth taxation',
          explanation: 'The speaker explicitly proposed progressive fiscal redistribution and targeted support.'
        }
      ]
    },
    writing: {
      task1Prompt: 'The pie charts compare household expenditure patterns in the UK and Japan in 2020.',
      task2Prompt: 'Some people argue that a country’s success should be judged purely by economic growth, while others say factors like happiness and health are more vital. Discuss both views.',
      sampleBand8: 'For decades, gross domestic product has served as the orthodox benchmark for evaluating national prosperity...'
    },
    speaking: {
      part1: ['Do you think saving money is important for young people?', 'How do you usually budget your monthly spending?'],
      part2: {
        cueCard: 'Describe a time when you had to budget carefully to purchase something important.',
        bulletPoints: ['What you wished to buy', 'How you economized money', 'How long it took', 'How you felt when you finally bought it'],
        followUp: 'Was that purchase worth the sacrifice?'
      },
      part3: ['Why is the gap between rich and poor widening in many countries?', 'Should financial literacy be a mandatory school subject?']
    }
  },

  // 14. SOCIETY & DEMOGRAPHICS
  {
    id: 'society',
    titleEn: 'Society, Family & Demographics',
    titleVi: 'Xã hội, Gia đình & Nhân khẩu',
    accent: '#f59e0b',
    badgeColor: '#78350f',
    icon: 'Users',
    descriptionVi: 'Cơ cấu dân số già hóa, gia đình hạt nhân, bình đẳng giới, biến đổi vai trò xã hội và chính sách an sinh.',
    vocab: [
      {
        id: 'soc-1',
        term: 'aging population',
        ipa: '/ˈeɪdʒɪŋ ˌpɒpjʊˈleɪʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'dân số già hóa, tỷ lệ người cao tuổi tăng',
        example: 'An aging population places mounting fiscal strain on pension schemes and geriatric healthcare facilities.',
        collocations: ['challenges of an aging population', 'demographic aging']
      },
      {
        id: 'soc-2',
        term: 'nuclear family',
        ipa: '/ˌnjuːkliə ˈfæməli/',
        type: 'Collocation · IELTS',
        meaningVi: 'gia đình hạt nhân (chỉ gồm cha mẹ và con cái)',
        example: 'The transition from extended households to nuclear families has eroded traditional grandparental childcare support.',
        collocations: ['preponderance of nuclear families', 'traditional vs nuclear family']
      },
      {
        id: 'soc-3',
        term: 'birth rate decline',
        ipa: '/bɜːθ reɪt dɪˈklaɪn/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự sụt giảm tỷ lệ sinh',
        example: 'Steep birth rate declines in industrialized economies threaten long-term labor market viability.',
        collocations: ['plummeting birth rate', 'reverse the birth decline']
      },
      {
        id: 'soc-4',
        term: 'gender parity',
        ipa: '/ˈdʒendə ˈpærɪti/',
        type: 'Academic Word',
        meaningVi: 'bình đẳng giới, sự ngang hàng nam nữ',
        example: 'Attaining genuine gender parity in corporate executive suites requires subsidized parental leave policies.',
        collocations: ['achieve gender parity', 'stride toward parity']
      },
      {
        id: 'soc-5',
        term: 'social cohesion',
        ipa: '/ˈsəʊʃl kəʊˈhiːʒn/',
        type: 'Academic Word',
        meaningVi: 'sự gắn kết xã hội, tính đoàn kết cộng đồng',
        example: 'Community arts centers and neighborhood gardens foster strong social cohesion among diverse ethnic groups.',
        collocations: ['strengthen social cohesion', 'erosion of civic cohesion']
      },
      {
        id: 'soc-6',
        term: 'generation gap',
        ipa: '/ˌdʒen.əˈreɪ.ʃən ɡæp/',
        type: 'Idiom',
        meaningVi: 'khoảng cách thế hệ về tư tưởng và lối sống',
        example: 'The rapid evolution of digital platforms has widened the generation gap between adolescents and parents.',
        collocations: ['bridge the generation gap', 'pronounced generational divide']
      },
      {
        id: 'soc-7',
        term: 'social mobility',
        ipa: '/ˈsəʊʃl məʊˈbɪləti/',
        type: 'Academic Word',
        meaningVi: 'sự dịch chuyển xã hội (vươn lên tầng lớp cao hơn)',
        example: 'Free tertiary education is arguably the most effective vehicle for promoting upward social mobility.',
        collocations: ['facilitate social mobility', 'stifled mobility']
      },
      {
        id: 'soc-8',
        term: 'social safety net',
        ipa: '/ˈsəʊʃl ˈseɪfti net/',
        type: 'Collocation · IELTS',
        meaningVi: 'mạng lưới an sinh xã hội',
        example: 'A resilient social safety net prevents vulnerable households from slipping into destitute poverty.',
        collocations: ['strengthen the safety net', 'welfare safety net']
      },
      {
        id: 'soc-9',
        term: 'see eye to eye',
        ipa: '/siː aɪ tu aɪ/',
        type: 'Idiom',
        meaningVi: 'đồng thuận, có cùng quan điểm',
        example: 'Family members rarely see eye to eye on career choices due to divergent generational value systems.',
        collocations: ['see eye to eye on issues', 'fail to agree']
      },
      {
        id: 'soc-10',
        term: 'demographic dividend',
        ipa: '/ˌdem.əˈɡræf.ɪk ˈdɪvɪdend/',
        type: 'Academic Word',
        meaningVi: 'cơ cấu dân số vàng (tỷ lệ người trong độ tuổi lao động cao)',
        example: 'Harnessing the demographic dividend requires massive investment in vocational skills for youth.',
        collocations: ['reap the demographic dividend', 'window of opportunity']
      }
    ],
    grammar: [
      {
        id: 'soc-g1',
        title: 'Clauses of Concession with "Whereas / While"',
        level: 'Band 7.0+',
        explanationVi: 'Đối chiếu hai nhóm nhân khẩu học hoặc quan điểm xã hội trái ngược.',
        formula: 'Clause 1, whereas / while + Clause 2',
        examples: [
          'Elderly demographics often rely on traditional community bonds, whereas young adults gravitate toward digital networks.',
          'While urban birth rates continue to contract, rural birth figures remain comparatively resilient.'
        ],
        drillPrompt: 'Viết câu đối chiếu lối sống gia đình truyền thống và hiện đại.',
        sampleTransform: 'Whereas traditional extended families offered collective childcare, contemporary nuclear households frequently rely on paid domestic assistance.'
      },
      {
        id: 'soc-g2',
        title: 'Inverted Conditionals (Had S + V3 / Were S to)',
        level: 'Band 8.0+',
        explanationVi: 'Đảo ngữ câu điều kiện không dùng If để tạo phong cách nghị luận trang trọng.',
        formula: 'Were S to + Verb / Had S + V3, S + would + Verb',
        examples: [
          'Were authorities to increase childcare stipends, birth rates would rebound noticeably.',
          'Had governments modernized retirement age thresholds earlier, pension systems would not be in deficit today.'
        ],
        drillPrompt: 'Chuyển sang đảo ngữ loại 2: "If governments supported working mothers, productivity would rise."',
        sampleTransform: 'Were authorities to subsidize comprehensive maternal healthcare, female workforce participation would rise exponentially.'
      }
    ],
    listening: {
      id: 'lis-soc-01',
      title: 'Sociological Impacts of Urban Demographic Shifts',
      level: 'Band 7.5',
      durationMinutes: 4,
      audioText: 'Dr. Naomi Chen presents demographic findings from the national census, focusing on median household sizes...',
      questions: [
        {
          id: 'q-lis-soc-1',
          prompt: 'What was the major societal factor cited for dropping marriage rates among young professionals?',
          options: ['Prohibitive housing costs and prolonged education', 'Lack of social clubs', 'Increased tax penalties', 'Shortage of marriage halls'],
          answer: 'Prohibitive housing costs and prolonged education',
          explanation: 'The sociologist highlighted housing unaffordability and academic duration.'
        }
      ]
    },
    writing: {
      task1Prompt: 'The chart details age distribution in three continents across three decades: 1990, 2010, and projected 2030.',
      task2Prompt: 'In many countries, an increasing number of elderly people live alone. Do the disadvantages of this trend outweigh the advantages?',
      sampleBand8: 'In modern industrialized societies, solitary living among senior citizens has evolved into a widespread demographic reality...'
    },
    speaking: {
      part1: ['How often do you spend leisure time with family?', 'What role do grandparents play in Vietnamese families?'],
      part2: {
        cueCard: 'Describe an elderly person in your family or community whom you admire deeply.',
        bulletPoints: ['Who this person is', 'How you know them', 'What qualities make them admirable', 'What life lessons you learned from them'],
        followUp: 'Do you still communicate regularly with this person?'
      },
      part3: ['What obligations do children have toward their aging parents?', 'How can cities be designed to be more age-friendly?']
    }
  },

  // 15. ENERGY & SUSTAINABILITY
  {
    id: 'energy',
    titleEn: 'Energy, Resources & Sustainability',
    titleVi: 'Năng lượng & Tài nguyên bền vững',
    accent: '#22c55e',
    badgeColor: '#14532d',
    icon: 'Sun',
    descriptionVi: 'Năng lượng tái tạo, an ninh năng lượng, điện hạt nhân, hóa thạch và chuyển dịch năng lượng xanh.',
    vocab: [
      {
        id: 'ene-1',
        term: 'renewable energy',
        ipa: '/rɪˈnjuːəbl ˈenədʒi/',
        type: 'Collocation · IELTS',
        meaningVi: 'năng lượng tái tạo (mặt trời, gió, thủy triều)',
        example: 'Transitioning to renewable energy is the cornerstone of international carbon neutrality agreements.',
        collocations: ['transition to renewable energy', 'renewable energy generation']
      },
      {
        id: 'ene-2',
        term: 'fossil fuel dependency',
        ipa: '/ˈfɒsl fjuːəl dɪˈpendənsi/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự phụ thuộc vào nhiên liệu hóa thạch',
        example: 'Ending fossil fuel dependency requires massive grid upgrades and scalable battery storage solutions.',
        collocations: ['break fossil fuel dependency', 'heavy dependence on coal']
      },
      {
        id: 'ene-3',
        term: 'nuclear fission',
        ipa: '/ˌnjuː.kli.ə ˈfɪʃ.ən/',
        type: 'Academic Word',
        meaningVi: 'phản ứng phân hạch hạt nhân',
        example: 'Advanced nuclear fission reactors generate constant base-load electricity without direct greenhouse emissions.',
        collocations: ['harness nuclear fission', 'nuclear safety safeguards']
      },
      {
        id: 'ene-4',
        term: 'depletion of natural resources',
        ipa: '/dɪˈpliːʃn əv ˈnætʃrəl rɪˈsɔːsɪz/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự cạn kiệt tài nguyên thiên nhiên',
        example: 'Unrestrained mining operations hasten the irreversible depletion of precious rare-earth minerals.',
        collocations: ['halt resource depletion', 'rapid depletion rates']
      },
      {
        id: 'ene-5',
        term: 'tip of the iceberg',
        ipa: '/tɪp əv ði ˈaɪsbɜːɡ/',
        type: 'Idiom',
        meaningVi: 'chỉ là phần nổi của tảng băng chìm',
        example: 'Current energy shortages are merely the tip of the iceberg if grid modernization is delayed further.',
        collocations: ['represent the tip of the iceberg', 'surface problem']
      },
      {
        id: 'ene-6',
        term: 'energy grid resilience',
        ipa: '/ˈenədʒi ɡrɪd rɪˈzɪliəns/',
        type: 'Academic Word',
        meaningVi: 'khả năng chống chịu và phục hồi của lưới điện',
        example: 'Extreme heatwaves test the resilience of national energy grids across the continent.',
        collocations: ['bolster grid resilience', 'decentralized energy grids']
      },
      {
        id: 'ene-7',
        term: 'carbon footprint reduction',
        ipa: '/ˈkɑːbən ˈfʊtprɪnt rɪˈdʌkʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'cắt giảm dấu chân carbon',
        example: 'Industrial factories that invest in heat-recycling systems achieve significant carbon footprint reductions.',
        collocations: ['commit to carbon reduction', 'net-zero reduction pledges']
      },
      {
        id: 'ene-8',
        term: 'photovoltaic panels',
        ipa: '/ˌfəʊtəʊvɒlˈteɪɪk ˈpænlz/',
        type: 'Academic Word',
        meaningVi: 'tấm pin quang điện mặt trời',
        example: 'The falling price of photovoltaic panels has made residential rooftop solar power economically viable.',
        collocations: ['install photovoltaic panels', 'photovoltaic cell efficiency']
      },
      {
        id: 'ene-9',
        term: 'run out of steam',
        ipa: '/rʌn aʊt əv stiːm/',
        type: 'Idiom',
        meaningVi: 'đuối sức, mất dần đà phát triển',
        example: 'Efforts to curb global emissions risk running out of steam without enforceable international sanctions.',
        collocations: ['momentum running out of steam', 'falter']
      },
      {
        id: 'ene-10',
        term: 'circular economy',
        ipa: '/ˌsɜːkjələ ɪˈkɒnəmi/',
        type: 'Collocation · IELTS',
        meaningVi: 'nền kinh tế tuần hoàn (tái chế và tái sử dụng tối đa)',
        example: 'Embracing a circular economy model minimizes raw extraction and repurposes industrial byproducts.',
        collocations: ['transition to a circular economy', 'closed-loop manufacturing']
      }
    ],
    grammar: [
      {
        id: 'ene-g1',
        title: 'Passive Voice in Technical Processes',
        level: 'Band 7.5+',
        explanationVi: 'Miêu tả quy trình sản xuất và chuyển hóa năng lượng trong Task 1 và Task 2.',
        formula: 'Subject + is / are + Past Participle (V3/ed) + by / through',
        examples: [
          'Solar radiation is captured by photovoltaic modules and converted into alternating electrical current.',
          'Surplus wind energy is stored in lithium-ion facilities to stabilize baseline network demands.'
        ],
        drillPrompt: 'Chuyển sang bị động: "Wind turbines generate green electricity for rural towns."',
        sampleTransform: 'Green electricity is generated by offshore wind turbines to power peripheral municipalities.'
      },
      {
        id: 'ene-g2',
        title: 'Reduced Relative Clauses (with Past Participles)',
        level: 'Band 7.5+',
        explanationVi: 'Rút gọn mệnh đề quan hệ bị động để tăng sự cô đọng học thuật.',
        formula: 'Noun + Past Participle (V3/ed) + Phrase',
        examples: [
          'Energy generated from offshore wind farms is fed directly into the national transmission grid.',
          'Subsidies granted to petroleum corporations should be redirected toward renewable initiatives.'
        ],
        drillPrompt: 'Rút gọn mệnh đề: "Electricity which is produced by coal plants creates pollution."',
        sampleTransform: 'Electricity generated by coal-fired thermal plants produces dangerous sulfur dioxide emissions.'
      }
    ],
    listening: {
      id: 'lis-ene-01',
      title: 'Geothermal and Tidal Energy Generation in Coastal Regions',
      level: 'Band 7.5',
      durationMinutes: 4,
      audioText: 'Welcome everyone. In todays engineering lecture, we evaluate the baseline dependability of offshore tidal turbines...',
      questions: [
        {
          id: 'q-lis-ene-1',
          prompt: 'What was presented as the primary competitive advantage of tidal power over solar energy?',
          options: ['Predictability of ocean tidal cycles', 'Cheaper manufacturing materials', 'Absence of maintenance', 'Zero marine disturbance'],
          answer: 'Predictability of ocean tidal cycles',
          explanation: 'The lecturer emphasized that tides can be mathematically predicted years in advance.'
        }
      ]
    },
    writing: {
      task1Prompt: 'The diagram shows the sequential stages of producing biofuel from sugarcane.',
      task2Prompt: 'Some people say fossil fuels should be replaced immediately by nuclear energy, while others fear the catastrophic risks. Discuss both views.',
      sampleBand8: 'The urgent necessity to decouple modern human civilization from greenhouse-emitting fossil fuels...'
    },
    speaking: {
      part1: ['Do you turn off lights when leaving a room?', 'Does your country use a lot of solar power?'],
      part2: {
        cueCard: 'Describe an eco-friendly habits or green energy technology you would like to adopt.',
        bulletPoints: ['What it is', 'How it functions', 'What benefits it brings', 'Why you have not adopted it yet'],
        followUp: 'Do you think solar panels will become standard on homes?'
      },
      part3: ['Should individuals or governments carry the prime responsibility for energy conservation?', 'How can developing nations afford green tech?']
    }
  },

  // 16. TRANSPORTATION
  {
    id: 'transport',
    titleEn: 'Transportation & Infrastructure',
    titleVi: 'Giao thông & Hạ tầng',
    accent: '#06b6d4',
    badgeColor: '#164e63',
    icon: 'Truck',
    descriptionVi: 'Ùn tắc giao thông, phương tiện công cộng, xe điện, quy hoạch hạ tầng và thành phố 15 phút.',
    vocab: [
      {
        id: 'tra-1',
        term: 'traffic congestion',
        ipa: '/ˈtræfɪk kənˈdʒestʃən/',
        type: 'Collocation · IELTS',
        meaningVi: 'tình trạng ùn tắc giao thông',
        example: 'Chronic traffic congestion inflicts staggering productivity losses on metropolitan commercial hubs.',
        collocations: ['alleviate traffic congestion', 'gridlock in peak hours']
      },
      {
        id: 'tra-2',
        term: 'public transit infrastructure',
        ipa: '/ˈpʌblɪk ˈtrænzɪt ˌɪnfrəˈstrʌktʃə/',
        type: 'Collocation · IELTS',
        meaningVi: 'hạ tầng giao thông công cộng (tàu điện, xe buýt nhanh)',
        example: 'Investing in high-speed public transit infrastructure incentivizes commuters to abandon personal automobiles.',
        collocations: ['expand transit infrastructure', 'integrated transit network']
      },
      {
        id: 'tra-3',
        term: 'congestion pricing',
        ipa: '/kənˈdʒestʃən ˈpraɪsɪŋ/',
        type: 'Academic Word',
        meaningVi: 'phí chống ùn tắc nội đô trong giờ cao điểm',
        example: 'Metropolises like London and Singapore proved that congestion pricing dramatically curtails private vehicle inflow.',
        collocations: ['implement congestion pricing', 'cordon fee']
      },
      {
        id: 'tra-4',
        term: 'pedestrianized zone',
        ipa: '/pəˈdestriənaɪzd zəʊn/',
        type: 'Academic Word',
        meaningVi: 'khu phố đi bộ cấm xe cơ giới',
        example: 'Transforming historic high streets into pedestrianized zones boosts retail revenues and air purity.',
        collocations: ['designate pedestrianized zones', 'car-free city centers']
      },
      {
        id: 'tra-5',
        term: 'in the fast lane',
        ipa: '/ɪn ðə fɑːst leɪn/',
        type: 'Idiom',
        meaningVi: 'lối sống gấp gáp, cạnh tranh khốc liệt',
        example: 'Urban commuters living in the fast lane often neglect physical activity and mindful relaxation.',
        collocations: ['life in the fast lane', 'hectic commuting pace']
      },
      {
        id: 'tra-6',
        term: 'fleet electrification',
        ipa: '/fliːt ɪˌlektrɪfɪˈkeɪʃn/',
        type: 'Academic Word',
        meaningVi: 'điện hóa đội xe công cộng hoặc xe thương mại',
        example: 'Municipal fleet electrification eliminates toxic diesel particulates along congested commuter arteries.',
        collocations: ['accelerate fleet electrification', 'transition to electric buses']
      },
      {
        id: 'tra-7',
        term: 'intermodal transit hub',
        ipa: '/ˌɪntəˈməʊdl ˈtrænzɪt hʌb/',
        type: 'Academic Word',
        meaningVi: 'nhà ga trung chuyển liên phương thức (kết nối metro, bus, xe đạp)',
        example: 'Seamless transfers at intermodal transit hubs drastically shorten end-to-end suburban commuting journeys.',
        collocations: ['construct intermodal hubs', 'seamless multimodal connectivity']
      },
      {
        id: 'tra-8',
        term: 'road fatality rate',
        ipa: '/rəʊd fəˈtæləti reɪt/',
        type: 'Collocation · IELTS',
        meaningVi: 'tỷ lệ tử vong do tai nạn giao thông',
        example: 'Strict speed enforcement and automated camera networks have driven down annual road fatality rates.',
        collocations: ['slash road fatality rates', 'traffic accident statistics']
      },
      {
        id: 'tra-9',
        term: 'hit the road',
        ipa: '/hɪt ðə rəʊd/',
        type: 'Idiom',
        meaningVi: 'khởi hành lên đường',
        example: 'Millions of commuters hit the road simultaneously during morning rush hours, overwhelming expressways.',
        collocations: ['hit the road early', 'begin the commute']
      },
      {
        id: 'tra-10',
        term: 'carpooling initiative',
        ipa: '/ˈkɑːpuːlɪŋ ɪˈnɪʃətɪv/',
        type: 'Collocation · IELTS',
        meaningVi: 'sáng kiến đi chung xe để giảm ùn tắc',
        example: 'Corporate carpooling initiatives reduce parking demand and cut individual transportation overheads.',
        collocations: ['incentivize carpooling', 'carpooling platforms']
      }
    ],
    grammar: [
      {
        id: 'tra-g1',
        title: 'Conditionals with "Provided that / As long as"',
        level: 'Band 7.0+',
        explanationVi: 'Biểu thị điều kiện bắt buộc để chính sách giao thông thành công.',
        formula: 'S + will + Verb + provided that / as long as + Present Simple',
        examples: [
          'Commuters will embrace metro transit provided that trains remain punctually reliable and affordable.',
          'Congestion taxes will succeed as long as municipal authorities supply clean, frequent bus alternatives.'
        ],
        drillPrompt: 'Viết câu điều kiện với "provided that" về việc cấm xe cá nhân.',
        sampleTransform: 'Restricting personal vehicles will gain civic backing provided that rapid public transport is accessible to suburban dwellers.'
      },
      {
        id: 'tra-g2',
        title: 'Inversion with "Under no circumstances"',
        level: 'Band 8.0+',
        explanationVi: 'Nhấn mạnh điều tuyệt đối không được phép xảy ra trong an toàn giao thông.',
        formula: 'Under no circumstances + Aux + S + Verb',
        examples: [
          'Under no circumstances should highway safety maintenance budgets be compromised.',
          'Under no circumstances can authorities permit heavy diesel lorries through residential school zones.'
        ],
        drillPrompt: 'Viết lại bằng đảo ngữ: "Drivers must never use mobile phones while driving."',
        sampleTransform: 'Under no circumstances should operators manipulate smartphones while handling motor vehicles on high-speed roadways.'
      }
    ],
    listening: {
      id: 'lis-tra-01',
      title: 'The 15-Minute City Model and Active Mobility',
      level: 'Band 7.5',
      durationMinutes: 4,
      audioText: 'In this seminar on smart urbanism, urban planner Carlos Moreno explains the foundational principles of the 15-minute city...',
      questions: [
        {
          id: 'q-lis-tra-1',
          prompt: 'What constitutes the defining goal of the 15-minute city framework?',
          options: ['Accessing all essential amenities within 15 minutes by walking or cycling', 'Higher car speed limits', 'Free highway tolls', 'Subsidized airport parking'],
          answer: 'Accessing all essential amenities within 15 minutes by walking or cycling',
          explanation: 'The speaker stressed localized access to work, food, and healthcare without private automobiles.'
        }
      ]
    },
    writing: {
      task1Prompt: 'The bar chart compares commuting modes across five European metropolises in 2021.',
      task2Prompt: 'The only way to solve traffic congestion in large cities is to provide free public transportation. To what extent do you agree or disagree?',
      sampleBand8: 'Urban mobility remains one of the most intractable dilemmas confronting modern municipal governments...'
    },
    speaking: {
      part1: ['How do you usually commute to work or school?', 'Do you enjoy riding bicycles in your city?'],
      part2: {
        cueCard: 'Describe a public transport trip that was either exceptionally smooth or frustrating.',
        bulletPoints: ['What mode of transport you took', 'Where you were headed', 'What occurred during the trip', 'Why you remember it vividly'],
        followUp: 'Do you still use that route today?'
      },
      part3: ['How will autonomous vehicles alter urban city planning?', 'Should private car ownership in dense inner cities be banned?']
    }
  },

  // 17. PSYCHOLOGY & HUMAN BEHAVIOUR
  {
    id: 'psychology',
    titleEn: 'Psychology & Human Behaviour',
    titleVi: 'Tâm lý học & Hành vi',
    accent: '#ec4899',
    badgeColor: '#831843',
    icon: 'Brain',
    descriptionVi: 'Căng thẳng tinh thần, động lực nội tại, tâm lý bầy đàn, hội chứng sợ bỏ lỡ (FOMO) và sự kiên trì.',
    vocab: [
      {
        id: 'psy-1',
        term: 'cognitive dissonance',
        ipa: '/ˈkɒɡnətɪv ˈdɪsənəns/',
        type: 'Academic Word',
        meaningVi: 'sự bất hòa nhận thức (mâu thuẫn giữa niềm tin và hành vi)',
        example: 'Smokers often suffer cognitive dissonance when intellectual health awareness clashes with physical addiction.',
        collocations: ['resolve cognitive dissonance', 'psychological dissonance']
      },
      {
        id: 'psy-2',
        term: 'intrinsic motivation',
        ipa: '/ɪnˈtrɪnzɪk ˌməʊtɪˈveɪʃn/',
        type: 'Academic Word',
        meaningVi: 'động lực nội tại (xuất phát từ niềm đam mê bên trong)',
        example: 'Students driven by intrinsic motivation achieve deeper academic mastery than those chasing extrinsic rewards.',
        collocations: ['foster intrinsic motivation', 'intrinsic vs extrinsic drivers']
      },
      {
        id: 'psy-3',
        term: 'herd mentality',
        ipa: '/hɜːd menˈtæləti/',
        type: 'Idiom',
        meaningVi: 'tâm lý bầy đàn, hùa theo đám đông',
        example: 'Stock market bubbles are frequently amplified by uncritical herd mentality among novice retail investors.',
        collocations: ['succumb to herd mentality', 'blind herd behavior']
      },
      {
        id: 'psy-4',
        term: 'mental resilience',
        ipa: '/ˈmentl rɪˈzɪliəns/',
        type: 'Collocation · IELTS',
        meaningVi: 'sức bền tâm lý, khả năng vượt qua nghịch cảnh',
        example: 'Cultivating mental resilience equips adolescents to handle rigorous academic setbacks constructively.',
        collocations: ['build mental resilience', 'psychological resilience']
      },
      {
        id: 'psy-5',
        term: 'burnout syndrome',
        ipa: '/ˈbɜːnaʊt ˈsɪndrəʊm/',
        type: 'Collocation · IELTS',
        meaningVi: 'hội chứng kiệt quệ do áp lực công việc kéo dài',
        example: 'Prolonged overtime hours without autonomy are the primary triggers of workplace burnout syndrome.',
        collocations: ['suffer from burnout', 'combat corporate burnout']
      },
      {
        id: 'psy-6',
        term: 'confirmation bias',
        ipa: '/ˌkɒnfəˈmeɪʃn ˈbaɪəs/',
        type: 'Academic Word',
        meaningVi: 'thiên kiến xác nhận (chỉ tìm thông tin củng cố niềm tin cũ)',
        example: 'Social media algorithms prey upon confirmation bias, reinforcing preexisting prejudices.',
        collocations: ['fall victim to confirmation bias', 'mitigate bias']
      },
      {
        id: 'psy-7',
        term: 'coping mechanism',
        ipa: '/ˈkəʊpɪŋ ˌmekənɪzəm/',
        type: 'Academic Word',
        meaningVi: 'cơ chế đối phó với căng thẳng',
        example: 'Mindfulness meditation serves as an empowering coping mechanism for managing high-stakes exam anxiety.',
        collocations: ['adaptive coping mechanisms', 'unhealthy coping mechanisms']
      },
      {
        id: 'psy-8',
        term: 'emotional intelligence',
        ipa: '/ɪˈməʊʃənl ɪnˈtelɪdʒəns/',
        type: 'Collocation · IELTS',
        meaningVi: 'trí tuệ cảm xúc (EQ)',
        example: 'Modern leadership demands high emotional intelligence to resolve workplace disputes empathetically.',
        collocations: ['high emotional intelligence', 'develop EQ competencies']
      },
      {
        id: 'psy-9',
        term: 'keep an open mind',
        ipa: '/kiːp ən ˈəʊpən maɪnd/',
        type: 'Idiom',
        meaningVi: 'giữ tư duy cởi mở, không thành kiến',
        example: 'Effective researchers must keep an open mind when empirical observations contradict established theories.',
        collocations: ['maintain an open mind', 'receptive to feedback']
      },
      {
        id: 'psy-10',
        term: 'fear of missing out',
        ipa: '/fɪə əv ˈmɪsɪŋ aʊt/',
        type: 'Idiom',
        meaningVi: 'hội chứng sợ bỏ lỡ (FOMO)',
        example: 'Continuous notification chimes induce chronic fear of missing out among smartphone users.',
        collocations: ['driven by FOMO', 'curb compulsive social checks']
      }
    ],
    grammar: [
      {
        id: 'psy-g1',
        title: 'Gerund Phrases as Subjects and Complements',
        level: 'Band 7.0+',
        explanationVi: 'Dùng danh động từ V-ing làm chủ ngữ câu văn học thuật để tăng tính trang trọng.',
        formula: 'V-ing + Object / Prepositional phrase + Singular Verb',
        examples: [
          'Cultivating mental fortitude enables individuals to thrive in volatile professional environments.',
          'Practicing self-compassion significantly mitigates the debilitating effects of chronic anxiety.'
        ],
        drillPrompt: 'Viết câu bắt đầu bằng danh động từ V-ing về việc tập thể dục giúp giảm stress.',
        sampleTransform: 'Engaging in regular aerobic exertion releases endorphins that counteract physiological stress hormones.'
      },
      {
        id: 'psy-g2',
        title: 'Subjunctive after "It is vital that / It is imperative that"',
        level: 'Band 8.0+',
        explanationVi: 'Đưa ra khuyến nghị tâm lý học chuẩn mực.',
        formula: 'It is essential that + S + [Bare Verb]',
        examples: [
          'It is imperative that parents recognize the subtle symptoms of adolescent depression early.',
          'Psychiatrists recommend that employers provide confidential counselling hotlines.'
        ],
        drillPrompt: 'Viết câu subjunctive về bảo vệ sức khỏe tâm thần nơi làm việc.',
        sampleTransform: 'It is vital that corporate managers encourage team members to disconnect completely outside contracted working hours.'
      }
    ],
    listening: {
      id: 'lis-psy-01',
      title: 'Cognitive Biases in Economic Decision Making',
      level: 'Band 7.5',
      durationMinutes: 4,
      audioText: 'Good afternoon. Today we review how heuristics and loss aversion distort objective consumer evaluations...',
      questions: [
        {
          id: 'q-lis-psy-1',
          prompt: 'According to behavioural economists, why do consumers feel the pain of loss more than equivalent gain?',
          options: ['Loss aversion bias', 'Lack of arithmetic training', 'Peer pressure', 'Advertising saturation'],
          answer: 'Loss aversion bias',
          explanation: 'The lecturer demonstrated that the psychological pain of losing $100 is twice as potent as gaining $100.'
        }
      ]
    },
    writing: {
      task1Prompt: 'The graph indicates self-reported stress levels across professions between 2010 and 2020.',
      task2Prompt: 'Some people think ambition is a positive trait that drives success, while others believe it causes dissatisfaction and stress. Discuss both views.',
      sampleBand8: 'Human ambition has historically operated as the primary engine propelling technological and societal achievements...'
    },
    speaking: {
      part1: ['How do you manage stress before an important exam?', 'Do you consider yourself an optimist or a pessimist?'],
      part2: {
        cueCard: 'Describe a challenging situation in which your perseverance and mental strength were tested.',
        bulletPoints: ['What the situation was', 'What obstacles you faced', 'How you maintained your composure', 'What you learned about yourself'],
        followUp: 'Would you handle it differently today?'
      },
      part3: ['Can emotional resilience be taught in schools?', 'Why are anxiety disorders rising among younger demographics?']
    }
  },

  // 18. FOOD & AGRICULTURE
  {
    id: 'food',
    titleEn: 'Food, Nutrition & Agriculture',
    titleVi: 'Ẩm thực & Nông nghiệp',
    accent: '#f97316',
    badgeColor: '#7c2d12',
    icon: 'Apple',
    descriptionVi: 'An ninh lương thực, thực phẩm biến đổi gen, nông nghiệp hữu cơ, chế độ ăn kiêng và lãng phí thực phẩm.',
    vocab: [
      {
        id: 'foo-1',
        term: 'food security',
        ipa: '/fuːd sɪˈkjʊərəti/',
        type: 'Collocation · IELTS',
        meaningVi: 'an ninh lương thực (đảm bảo nguồn cung thực phẩm)',
        example: 'Severe droughts precipitated by global warming jeopardize national food security in arid territories.',
        collocations: ['threaten food security', 'bolster domestic food supplies']
      },
      {
        id: 'foo-2',
        term: 'intensive farming',
        ipa: '/ɪnˈtensɪv ˈfɑːmɪŋ/',
        type: 'Academic Word',
        meaningVi: 'thâm canh nông nghiệp quy mô công nghiệp',
        example: 'While intensive farming maximizes crop yields, it depletes soil nutrients and contaminates waterways.',
        collocations: ['environmental fallout of intensive farming', 'agrochemical runoff']
      },
      {
        id: 'foo-3',
        term: 'organic agriculture',
        ipa: '/ɔːˈɡænɪk ˈæɡrɪkʌltʃə/',
        type: 'Collocation · IELTS',
        meaningVi: 'nông nghiệp hữu cơ',
        example: 'Transitioning to organic agriculture eliminates synthetic pesticides and promotes soil microbiome health.',
        collocations: ['certify organic agriculture', 'sustainable farming practices']
      },
      {
        id: 'foo-4',
        term: 'malnutrition',
        ipa: '/ˌmælnjuːˈtrɪʃn/',
        type: 'Academic Word',
        meaningVi: 'suy dinh dưỡng, thiếu chất',
        example: 'Chronic childhood malnutrition impairs cognitive development and increases vulnerability to infections.',
        collocations: ['eradicate malnutrition', 'suffer from severe malnutrition']
      },
      {
        id: 'foo-5',
        term: 'food miles',
        ipa: '/ˈfuːd maɪlz/',
        type: 'Collocation · IELTS',
        meaningVi: 'khoảng cách vận chuyển thực phẩm từ nông trại đến bàn ăn',
        example: 'Purchasing locally harvested seasonal produce drastically cuts associated food miles and freight emissions.',
        collocations: ['reduce food miles', 'carbon footprint of food miles']
      },
      {
        id: 'foo-6',
        term: 'processed food',
        ipa: '/ˈprəʊsest fuːd/',
        type: 'Collocation · IELTS',
        meaningVi: 'thực phẩm chế biến sẵn, nhiều phụ gia',
        example: 'Diets heavy in ultra-processed food correlate strongly with cardiovascular disease and diabetes.',
        collocations: ['curtail consumption of processed food', 'artificially preserved foods']
      },
      {
        id: 'foo-7',
        term: 'bite off more than one can chew',
        ipa: '/baɪt ɒf mɔː ðæn wʌn kæn tʃuː/',
        type: 'Idiom',
        meaningVi: 'gánh vác quá sức, ôm đồm quá nhiều',
        example: 'Farmers attempting to transition to organic certification overnight often bite off more than they can chew.',
        collocations: ['overcommit resources', 'take on too much']
      },
      {
        id: 'foo-8',
        term: 'subsistence farming',
        ipa: '/səbˈsɪstəns ˈfɑːmɪŋ/',
        type: 'Academic Word',
        meaningVi: 'nông nghiệp tự cung tự cấp',
        example: 'Smallholders practicing subsistence farming are acutely vulnerable to sudden climate fluctuations.',
        collocations: ['rely on subsistence farming', 'marginal agricultural yields']
      },
      {
        id: 'foo-9',
        term: 'food waste reduction',
        ipa: '/fuːd weɪst rɪˈdʌkʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'cắt giảm lãng phí thức ăn',
        example: 'Supermarket redistribution schemes play a vital role in municipal food waste reduction campaigns.',
        collocations: ['curb food wastage', 'post-harvest food loss']
      },
      {
        id: 'foo-10',
        term: 'crop diversification',
        ipa: '/krɒp daɪˌvɜːsɪfɪˈkeɪʃn/',
        type: 'Academic Word',
        meaningVi: 'đa dạng hóa cây trồng để tránh rủi ro dịch bệnh',
        example: 'Practicing crop diversification shields farming communities from total devastation when specific blights strike.',
        collocations: ['implement crop diversification', 'polyculture farming']
      }
    ],
    grammar: [
      {
        id: 'foo-g1',
        title: 'Passive Structures with Reporting Verbs',
        level: 'Band 7.5+',
        explanationVi: 'Dùng văn phong trung lập trích dẫn các nghiên cứu dinh dưỡng.',
        formula: 'Subject + is / are said / thought / proved to + Verb-inf',
        examples: [
          'Ultra-processed snacks are proven to accelerate metabolic deterioration in adolescents.',
          'Mediterranean dietary regimens are widely acknowledged to bolster cardiovascular longevity.'
        ],
        drillPrompt: 'Chuyển câu sau: "Scientists say excessive sugar causes obesity."',
        sampleTransform: 'Excessive refined sugar intake is empirically proven to be a primary catalyst for childhood obesity.'
      },
      {
        id: 'foo-g2',
        title: 'Hypothetical Conditionals for Policy Solutions',
        level: 'Band 7.5+',
        explanationVi: 'Đề xuất giải pháp cải thiện sức khỏe cộng đồng qua thuế thực phẩm.',
        formula: 'If + S + were to + Verb, S + would + Verb',
        examples: [
          'If authorities were to tax sugary beverages heavily, consumption rates would plummet rapidly.',
          'If supermarkets were mandated to donate unsold edible groceries, urban food poverty would be substantially alleviated.'
        ],
        drillPrompt: 'Viết câu điều kiện với "were to" về việc đánh thuế thức ăn nhanh.',
        sampleTransform: 'If governments were to levy punitive excise taxes on junk food, public health expenditures would decline dramatically.'
      }
    ],
    listening: {
      id: 'lis-foo-01',
      title: 'Vertical Farming and Hydroponic Agriculture in Megacities',
      level: 'Band 7.5',
      durationMinutes: 4,
      audioText: 'In this agricultural innovation broadcast, Dr. Peter Aris explores how indoor hydroponics addresses urban land scarcity...',
      questions: [
        {
          id: 'q-lis-foo-1',
          prompt: 'What was highlighted as the greatest operational expense in vertical indoor farming?',
          options: ['Artificial LED lighting electricity costs', 'Water shortages', 'Seed pricing', 'Harvest transport'],
          answer: 'Artificial LED lighting electricity costs',
          explanation: 'The researcher explained that continuous artificial illumination consumes substantial power.'
        }
      ]
    },
    writing: {
      task1Prompt: 'The chart illustrates global grain production and fertilizer usage from 1980 to 2020.',
      task2Prompt: 'Modern farming methods have increased food production, but damaged the environment. Do the benefits outweigh the harms?',
      sampleBand8: 'The unprecedented expansion of global population over the past century has necessitated aggressive farming...'
    },
    speaking: {
      part1: ['Do you prefer home-cooked meals or dining out?', 'What is your favorite traditional Vietnamese dish?'],
      part2: {
        cueCard: 'Describe a special meal or traditional food you prepared for friends or family.',
        bulletPoints: ['What you cooked', 'Why you chose those ingredients', 'Who shared the meal with you', 'How your guests reacted'],
        followUp: 'Do you cook that dish often?'
      },
      part3: ['Why is fast food so popular despite known health risks?', 'How can schools encourage healthier eating habits among children?']
    }
  },

  // 19. SPACE EXPLORATION
  {
    id: 'space',
    titleEn: 'Space Exploration & Astronomy',
    titleVi: 'Khám phá vũ trụ & Thiên văn',
    accent: '#6366f1',
    badgeColor: '#312e81',
    icon: 'Rocket',
    descriptionVi: 'Thám hiểm sao Hỏa, vệ tinh quan sát, chi phí ngân sách nghiên cứu không gian và du lịch vũ trụ.',
    vocab: [
      {
        id: 'spa-1',
        term: 'extraterrestrial life',
        ipa: '/ˌekstrətəˈrestriəl laɪf/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự sống ngoài Trái Đất',
        example: 'Astrobiologists analyze soil samples on Mars to identify microscopic signatures of extraterrestrial life.',
        collocations: ['search for extraterrestrial life', 'extraterrestrial intelligence']
      },
      {
        id: 'spa-2',
        term: 'space debris',
        ipa: '/speɪs ˈdebriː/',
        type: 'Collocation · IELTS',
        meaningVi: 'rác thải không gian (mảnh vỡ vệ tinh cũ quanh quỹ đạo)',
        example: 'Accumulating space debris poses severe collision hazards for vital meteorological and telecommunication satellites.',
        collocations: ['track space debris', 'orbital junk cleanup']
      },
      {
        id: 'spa-3',
        term: 'colonization of Mars',
        ipa: '/ˌkɒlənaɪˈzeɪʃn əv mɑːz/',
        type: 'Collocation · IELTS',
        meaningVi: 'thuộc địa hóa, định cư trên sao Hỏa',
        example: 'Permanent colonization of Mars would require overcoming deadly cosmic radiation and atmospheric scarcity.',
        collocations: ['human colonization', 'terraforming initiatives']
      },
      {
        id: 'spa-4',
        term: 'satellite telemetry',
        ipa: '/ˈsætəlaɪt təˈlemətri/',
        type: 'Academic Word',
        meaningVi: 'dữ liệu đo đạc từ xa của vệ tinh',
        example: 'Satellite telemetry provides irreplaceable data for tracking typhoon trajectories and deforestation rates.',
        collocations: ['transmit telemetry data', 'earth-observation satellites']
      },
      {
        id: 'spa-5',
        term: 'astronomical expenditure',
        ipa: '/ˌæstrəˈnɒmɪkl ɪkˈspendɪtʃə/',
        type: 'Idiom',
        meaningVi: 'chi phí khổng lồ, trên trời (nghĩa bóng và nghĩa đen)',
        example: 'Critics contend that astronomical expenditures on deep-space probes should be redirected toward poverty alleviation.',
        collocations: ['incur astronomical costs', 'colossal public spending']
      },
      {
        id: 'spa-6',
        term: 'spin-off technologies',
        ipa: '/ˈspɪn ɒf tekˈnɒlədʒiz/',
        type: 'Academic Word',
        meaningVi: 'công nghệ phụ phẩm phái sinh từ nghiên cứu vũ trụ',
        example: 'Space agency research yielded ubiquitous spin-off technologies such as memory foam and scratch-resistant lenses.',
        collocations: ['commercial spin-offs', 'spin-off inventions']
      },
      {
        id: 'spa-7',
        term: 'reach for the stars',
        ipa: '/riːtʃ fɔː ðə stɑːz/',
        type: 'Idiom',
        meaningVi: 'vươn tới ước mơ lớn, chinh phục đỉnh cao',
        example: 'Humanity has an innate psychological imperative to reach for the stars and unravel cosmic mysteries.',
        collocations: ['aspire to greatness', 'reach for astronomical heights']
      },
      {
        id: 'spa-8',
        term: 'weightlessness',
        ipa: '/ˈweɪtləsnəs/',
        type: 'Academic Word',
        meaningVi: 'trạng thái không trọng lực',
        example: 'Long-duration exposure to weightlessness in orbital stations induces bone density loss and muscular atrophy.',
        collocations: ['microgravity environment', 'effects of weightlessness']
      },
      {
        id: 'spa-9',
        term: 'geopolitical prestige',
        ipa: '/ˌdʒiːəʊpəˈlɪtɪkl preˈstiːʒ/',
        type: 'Academic Word',
        meaningVi: 'vị thế, uy tín địa chính trị quốc tế',
        example: 'The mid-century space race was driven primarily by superpowers seeking ideological and geopolitical prestige.',
        collocations: ['bolster national prestige', 'symbol of geopolitical prowess']
      },
      {
        id: 'spa-10',
        term: 'cosmic radiation',
        ipa: '/ˈkɒzmɪk ˌreɪdiˈeɪʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'bức xạ vũ trụ nguy hiểm',
        example: 'Interplanetary spacecraft must incorporate heavy shielding to insulate astronauts against cosmic radiation.',
        collocations: ['shield against radiation', 'ionizing cosmic rays']
      }
    ],
    grammar: [
      {
        id: 'spa-g1',
        title: 'Inversion with "Had it not been for"',
        level: 'Band 8.0+',
        explanationVi: 'Nhấn mạnh vai trò không thể thiếu của nghiên cứu vũ trụ đối với công nghệ hiện đại.',
        formula: 'Had it not been for + Noun phrase, S + would (not) have + V3',
        examples: [
          'Had it not been for satellite technology, global weather forecasting would be significantly less accurate.',
          'Had it not been for space exploration budgets, countless consumer technologies would never have been invented.'
        ],
        drillPrompt: 'Viết lại dùng "Had it not been for": "Without satellite communication, GPS would not exist."',
        sampleTransform: 'Had it not been for orbital satellite deployment, global navigation infrastructure would not exist today.'
      },
      {
        id: 'spa-g2',
        title: 'Clauses of Purpose with "In order that / So that"',
        level: 'Band 7.0+',
        explanationVi: 'Diễn tả mục đích đầu tư ngân sách nghiên cứu không gian.',
        formula: 'Main clause + so that / in order that + S + can/could + Verb',
        examples: [
          'Telescopes are positioned beyond Earth atmosphere in order that astronomers can observe pristine cosmic wavelengths.',
          'International space stations were constructed so that scientists from rival nations could collaborate peacefully.'
        ],
        drillPrompt: 'Nối hai mệnh đề với "in order that" về thử nghiệm vệ tinh.',
        sampleTransform: 'Advanced orbital probes were launched in order that climatologists could monitor polar icecap melt rates with pinpoint precision.'
      }
    ],
    listening: {
      id: 'lis-spa-01',
      title: 'Orbital Debris Tracking and Collision Avoidance Systems',
      level: 'Band 7.5',
      durationMinutes: 4,
      audioText: 'Dr. Gregory Finch lectures on orbital hazards caused by decommissioned rocket stages in low Earth orbit...',
      questions: [
        {
          id: 'q-lis-spa-1',
          prompt: 'What is the Kessler Syndrome described by the lecturer?',
          options: ['A cascading chain reaction of orbital collisions rendering space impassable', 'Loss of satellite radio frequency', 'Sun flares blinding telescopes', 'Meteor impact on Mars'],
          answer: 'A cascading chain reaction of orbital collisions rendering space impassable',
          explanation: 'The speaker defined it as an exponential chain reaction where orbital debris multiplies uncontrollably.'
        }
      ]
    },
    writing: {
      task1Prompt: 'The diagram shows the launch and orbit trajectory of a meteorological observation satellite.',
      task2Prompt: 'Governments spend billions on space exploration while millions of people on Earth lack food and clean water. Should this money be diverted? Discuss both views.',
      sampleBand8: 'The allocation of substantial state revenues toward deep-space missions has provoked heated debate...'
    },
    speaking: {
      part1: ['Are you interested in reading astronomy news?', 'Did you learn about planets in elementary school?'],
      part2: {
        cueCard: 'Describe a movie or book about space exploration that made a lasting impression on you.',
        bulletPoints: ['What the movie or book was', 'What the storyline entailed', 'What scientific elements were showcased', 'Why you found it compelling'],
        followUp: 'Would you ever travel to space as a tourist?'
      },
      part3: ['Do you believe humans will colonize another planet within this century?', 'Is space exploration worth the astronomical economic price?']
    }
  },

  // 20. SPORTS & FITNESS
  {
    id: 'sports',
    titleEn: 'Sports, Fitness & Recreation',
    titleVi: 'Thể thao & Thể chất',
    accent: '#14b8a6',
    badgeColor: '#134e48',
    icon: 'Activity',
    descriptionVi: 'Thể thao đỉnh cao, lợi ích rèn luyện sức khỏe, tinh thần đồng đội, thương mại hóa thể thao và thế vận hội.',
    vocab: [
      {
        id: 'spo-1',
        term: 'sedentary lifestyle',
        ipa: '/ˈsedntri ˈlaɪfstaɪl/',
        type: 'Collocation · IELTS',
        meaningVi: 'lối sống ít vận động, ngồi nhiều',
        example: 'A sedentary lifestyle is a prominent precursor to chronic cardiovascular ailments and metabolic disorders.',
        collocations: ['lead a sedentary lifestyle', 'combating sedentary habits']
      },
      {
        id: 'spo-2',
        term: 'sportsmanship',
        ipa: '/ˈspɔːtsmənʃɪp/',
        type: 'Academic Word',
        meaningVi: 'tinh thần thể thao cao thượng, công bằng',
        example: 'True sportsmanship transcends winning and embraces respect for opponents and integrity in defeat.',
        collocations: ['display admirable sportsmanship', 'lack of sportsmanship']
      },
      {
        id: 'spo-3',
        term: 'commercialization of sports',
        ipa: '/kəˌmɜːʃəlaɪˈzeɪʃn əv spɔːts/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự thương mại hóa thể thao',
        example: 'Excessive commercialization of sports has inflated athlete wages while pricing ordinary fans out of stadiums.',
        collocations: ['rampant commercialization', 'corporate sponsorships']
      },
      {
        id: 'spo-4',
        term: 'aerobic endurance',
        ipa: '/eəˈrəʊbɪk ɪnˈdjʊərəns/',
        type: 'Academic Word',
        meaningVi: 'sức bền hiếu khí, khả năng chịu đựng của tim phổi',
        example: 'Consistent swimming and running routines noticeably enhance cardiovascular and aerobic endurance.',
        collocations: ['boost aerobic endurance', 'stamina development']
      },
      {
        id: 'spo-5',
        term: 'level the playing field',
        ipa: '/ˈlevl ðə ˈpleɪɪŋ fiːld/',
        type: 'Idiom',
        meaningVi: 'tạo điều kiện thi đấu công bằng cho mọi đối thủ',
        example: 'Strict anti-doping testing protocols are designed to level the playing field for clean competitors.',
        collocations: ['create a level playing field', 'fair competition']
      },
      {
        id: 'spo-6',
        term: 'performance-enhancing drugs',
        ipa: '/pəˈfɔːməns ɪnˈhɑːnsɪŋ drʌɡz/',
        type: 'Collocation · IELTS',
        meaningVi: 'chất kích thích nâng cao thành tích (doping)',
        example: 'Athletes caught ingesting banned performance-enhancing drugs suffer lengthy competitive disqualifications.',
        collocations: ['ban on performance-enhancing drugs', 'doping scandal']
      },
      {
        id: 'spo-7',
        term: 'team cohesion',
        ipa: '/tiːm kəʊˈhiːʒn/',
        type: 'Academic Word',
        meaningVi: 'sự gắn kết, ăn ý giữa các thành viên trong đội',
        example: 'Strong team cohesion frequently enables underdog squads to triumph over technically superior rivals.',
        collocations: ['forge team cohesion', 'foster camaraderie']
      },
      {
        id: 'spo-8',
        term: 'grassroots sports facilities',
        ipa: '/ˈɡrɑːsruːts spɔːts fəˈsɪlətiz/',
        type: 'Collocation · IELTS',
        meaningVi: 'cơ sở thể thao phong trào ở địa phương',
        example: 'Subsidizing grassroots sports facilities encourages community members of all ages to remain active.',
        collocations: ['invest in grassroots facilities', 'community sports fields']
      },
      {
        id: 'spo-9',
        term: 'par for the course',
        ipa: '/pɑː fɔː ðə kɔːs/',
        type: 'Idiom',
        meaningVi: 'chuyện thường thấy, điều hiển nhiên trong hoàn cảnh đó',
        example: 'Experiencing minor muscular injuries is par for the course in professional endurance marathons.',
        collocations: ['considered par for the course', 'normal occurrence']
      },
      {
        id: 'spo-10',
        term: 'psychological resilience',
        ipa: '/ˌsaɪkəˈlɒdʒɪkl rɪˈzɪliəns/',
        type: 'Academic Word',
        meaningVi: 'bản lĩnh tâm lý của vận động viên đỉnh cao',
        example: 'Elite champions distinguish themselves through psychological resilience under intense high-pressure scrutiny.',
        collocations: ['mental toughness', 'maintain psychological composure']
      }
    ],
    grammar: [
      {
        id: 'spo-g1',
        title: 'Contrastive Clauses with "Not only... but also"',
        level: 'Band 7.5+',
        explanationVi: 'Nhấn mạnh cả lợi ích thể chất lẫn tinh thần của thể thao.',
        formula: 'Engaging in X not only + Verb 1, but it also + Verb 2',
        examples: [
          'Participating in organized athletics not only fortifies physical stamina, but it also cultivates lifelong discipline.',
          'Investing in community sports not only lowers chronic disease rates, but it also nurtures civic unity.'
        ],
        drillPrompt: 'Viết câu kết hợp lợi ích thể chất và tinh thần của việc tập gym.',
        sampleTransform: 'Regular resistance training not only enhances muscular density, but it also alleviates depressive cognitive symptoms.'
      },
      {
        id: 'spo-g2',
        title: 'Comparative Clauses of Proportion (The more... the better)',
        level: 'Band 7.0+',
        explanationVi: 'Liên hệ giữa mức độ vận động và tình trạng sức khỏe.',
        formula: 'The + Comparative + S + V, The + Comparative + S + V',
        examples: [
          'The earlier children establish exercise habits, the less vulnerable they are to adult chronic illnesses.',
          'The more accessible public athletic centers become, the higher community physical engagement climbs.'
        ],
        drillPrompt: 'Viết câu so sánh kép về vận động và sức khỏe tim mạch.',
        sampleTransform: 'The more frequently adults participate in cardiovascular exercise, the lower their risk of early heart complications.'
      }
    ],
    listening: {
      id: 'lis-spo-01',
      title: 'The Economic Legacy of Hosting International Sports Tournaments',
      level: 'Band 7.5',
      durationMinutes: 4,
      audioText: 'In today session on urban sports economies, we analyze the financial return on investment of Olympic infrastructure...',
      questions: [
        {
          id: 'q-lis-spo-1',
          prompt: 'What was termed a "white elephant" in Olympic economic terminology?',
          options: ['Expensive stadiums left underutilized after games finish', 'A symbol of peace', 'Olympic mascot statue', 'A trophy for medalists'],
          answer: 'Expensive stadiums left underutilized after games finish',
          explanation: 'The speaker explicitly defined white elephants as costly stadiums abandoned post-tournament.'
        }
      ]
    },
    writing: {
      task1Prompt: 'The chart demonstrates leisure exercise participation rates by age group between 2005 and 2020.',
      task2Prompt: 'Some people argue that hosting international sporting events brings significant benefits to a host nation, while others argue it is a waste of public funds. Discuss both views.',
      sampleBand8: 'Staging mega sporting spectacles such as the Olympic Games or FIFA World Cup represents a monumental financial undertaking...'
    },
    speaking: {
      part1: ['Do you play any competitive sports?', 'What sport is most popular to watch in Vietnam?'],
      part2: {
        cueCard: 'Describe a sporting match or athletic contest you watched that was exceptionally thrilling.',
        bulletPoints: ['What sport it was', 'Who the competing teams or athletes were', 'What made the contest suspenseful', 'How you felt when it ended'],
        followUp: 'Do you still support that team or athlete today?'
      },
      part3: ['Why do professional athletes earn astronomical salaries compared to nurses and teachers?', 'Should schools enforce daily physical training?']
    }
  },

  // 21. LANGUAGE & LINGUISTICS
  {
    id: 'language',
    titleEn: 'Language, Linguistics & Communication',
    titleVi: 'Ngôn ngữ & Giao tiếp',
    accent: '#eab308',
    badgeColor: '#713f12',
    icon: 'MessageSquare',
    descriptionVi: 'Sự mai một của các ngôn ngữ bản địa, ngôn ngữ toàn cầu, dịch thuật máy móc và mối quan hệ giữa ngôn ngữ và tư duy.',
    vocab: [
      {
        id: 'lan-1',
        term: 'linguistic diversity',
        ipa: '/lɪŋˈɡwɪstɪk daɪˈvɜːsəti/',
        type: 'Academic Word',
        meaningVi: 'sự đa dạng ngôn ngữ',
        example: 'Globalization accelerates the erosion of linguistic diversity as indigenous dialects vanish unrecorded.',
        collocations: ['preserve linguistic diversity', 'loss of minority languages']
      },
      {
        id: 'lan-2',
        term: 'lingua franca',
        ipa: '/ˌlɪŋɡwə ˈfræŋkə/',
        type: 'Academic Word',
        meaningVi: 'ngôn ngữ chung dùng để giao tiếp giữa các quốc gia',
        example: 'English functions as the undisputed global lingua franca in international commerce and aviation.',
        collocations: ['adopt as a lingua franca', 'global trade lingua franca']
      },
      {
        id: 'lan-3',
        term: 'language extinction',
        ipa: '/ˈlæŋɡwɪdʒ ɪkˈstɪŋkʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự tuyệt chủng ngôn ngữ',
        example: 'Linguists warn that half of the world remaining languages face extinction before the century concludes.',
        collocations: ['verge of language extinction', 'endangered tongue']
      },
      {
        id: 'lan-4',
        term: 'bilingualism',
        ipa: '/baɪˈlɪŋɡwəlɪzəm/',
        type: 'Academic Word',
        meaningVi: 'tình trạng song ngữ, khả năng sử dụng thành thạo hai ngôn ngữ',
        example: 'Neuroscientific studies corroborate that early childhood bilingualism strengthens executive cognitive control.',
        collocations: ['benefits of bilingualism', 'promote active bilingualism']
      },
      {
        id: 'lan-5',
        term: 'lost in translation',
        ipa: '/lɒst ɪn trænsˈleɪʃn/',
        type: 'Idiom',
        meaningVi: 'bị hiểu sai hoặc mất đi sắc thái ý nghĩa khi dịch',
        example: 'Poetic metaphors and idiomatic nuances frequently get lost in literal machine translation.',
        collocations: ['get lost in translation', 'untranslatable nuance']
      },
      {
        id: 'lan-6',
        term: 'machine translation',
        ipa: '/məˈʃiːn trænsˈleɪʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'dịch thuật tự động bằng máy móc / AI',
        example: 'Neural machine translation algorithms have achieved remarkable fluency, yet struggle with cultural sarcasm.',
        collocations: ['advances in machine translation', 'automated translation tools']
      },
      {
        id: 'lan-7',
        term: 'mother tongue',
        ipa: '/ˈmʌðə tʌŋ/',
        type: 'Collocation · IELTS',
        meaningVi: 'tiếng mẹ đẻ, ngôn ngữ thứ nhất',
        example: 'Foundational literacy acquisition in one’s mother tongue facilitates subsequent foreign language mastery.',
        collocations: ['master one’s mother tongue', 'native language proficiency']
      },
      {
        id: 'lan-8',
        term: 'cultural nuance',
        ipa: '/ˈkʌltʃərəl ˈnjuːɑːns/',
        type: 'Academic Word',
        meaningVi: 'sắc thái văn hóa tinh tế trong ngôn từ',
        example: 'Proficient international diplomats must understand cultural nuances to avoid unintentional insult.',
        collocations: ['grasp cultural nuances', 'subtle linguistic nuances']
      },
      {
        id: 'lan-9',
        term: 'read between the lines',
        ipa: '/riːd bɪˈtwiːn ðə laɪnz/',
        type: 'Idiom',
        meaningVi: 'hiểu được ẩn ý đằng sau câu chữ',
        example: 'In diplomatic cables, one must read between the lines to discern actual policy concessions.',
        collocations: ['skill to read between the lines', 'infer unspoken intentions']
      },
      {
        id: 'lan-10',
        term: 'oral tradition',
        ipa: '/ˈɔːrəl trəˈdɪʃn/',
        type: 'Academic Word',
        meaningVi: 'truyền thống truyền khẩu dân gian',
        example: 'Indigenous folklore preserved solely through oral tradition vanishes when youth migrate to urban metropolises.',
        collocations: ['rich oral tradition', 'oral historical archives']
      }
    ],
    grammar: [
      {
        id: 'lan-g1',
        title: 'Cleft Sentences for Emphasis in Language Essays',
        level: 'Band 7.5+',
        explanationVi: 'Nhấn mạnh vai trò của ngôn ngữ trong việc bảo tồn bản sắc.',
        formula: 'It is + through X + that + Clause',
        examples: [
          'It is through language that ancestral cultural wisdom and indigenous identities are transmitted across generations.',
          'It is through bilingual immersion that children develop flexible lateral thinking faculties.'
        ],
        drillPrompt: 'Viết lại nhấn mạnh ngôn ngữ: "Mother tongue protects cultural heritage."',
        sampleTransform: 'It is through preserving their mother tongue that minority communities safeguard their distinct cultural heritage.'
      },
      {
        id: 'lan-g2',
        title: 'Complex Sentences with "Inasmuch as / Insofar as"',
        level: 'Band 8.0+',
        explanationVi: 'Diễn tả mối quan hệ nguyên nhân - điều kiện mang tính học thuật cao cấp.',
        formula: 'Insofar as + Clause 1, Clause 2',
        examples: [
          'Insofar as a language encapsulates unique philosophical worldviews, its extinction represents an irremediable loss.',
          'Inasmuch as machine translators enhance speed, human editors remain essential for capturing subtle emotive nuances.'
        ],
        drillPrompt: 'Viết câu dùng "Insofar as" về việc học ngoại ngữ giúp kết nối thế giới.',
        sampleTransform: 'Insofar as international languages dissolve cross-cultural communication barriers, they foster mutual geopolitical understanding.'
      }
    ],
    listening: {
      id: 'lis-lan-01',
      title: 'Digital Preservation of Endangered Indigenous Dialects',
      level: 'Band 7.5',
      durationMinutes: 4,
      audioText: 'Linguistics professor Elena Rossi addresses the rapid rate of language endangerment in the Amazonian basin...',
      questions: [
        {
          id: 'q-lis-lan-1',
          prompt: 'What innovative strategy did the research team deploy to archive endangered spoken dialects?',
          options: ['Crowdsourced mobile audio recordings by indigenous youths', 'Printed dictionaries only', 'Radio broadcasts', 'Grammar textbooks'],
          answer: 'Crowdsourced mobile audio recordings by indigenous youths',
          explanation: 'Professor Rossi explained that equipping local adolescents with recording apps revitalized audio archives.'
        }
      ]
    },
    writing: {
      task1Prompt: 'The chart reveals the distribution of the ten most widely spoken global languages in 2022.',
      task2Prompt: 'Several languages die out every year. Some people believe this is not important because life is easier with fewer languages. To what extent do you agree or disagree?',
      sampleBand8: 'The rapid demise of indigenous linguistic varieties constitutes one of the most pressing cultural crises...'
    },
    speaking: {
      part1: ['How many languages can you speak?', 'What do you find most challenging when learning English?'],
      part2: {
        cueCard: 'Describe a foreign language you would like to master besides English.',
        bulletPoints: ['What language it is', 'Where it is spoken', 'Why you are drawn to it', 'How you plan to learn it'],
        followUp: 'Do you think learning it will help your career?'
      },
      part3: ['Will AI translation render foreign language learning obsolete?', 'Why should governments fund the preservation of minority tongues?']
    }
  },

  // 22. HISTORY & CIVILIZATION
  {
    id: 'history',
    titleEn: 'History, Archaeology & Civilizations',
    titleVi: 'Lịch sử & Khảo cổ học',
    accent: '#d97706',
    badgeColor: '#78350f',
    icon: 'Landmark',
    descriptionVi: 'Bảo tồn di sản lịch sử, bài học từ quá khứ, khảo cổ học khai quật và vai trò của bảo tàng trong xã hội hiện đại.',
    vocab: [
      {
        id: 'his-1',
        term: 'historical artifact',
        ipa: '/hɪˈstɒrɪkl ˈɑːtɪfækt/',
        type: 'Collocation · IELTS',
        meaningVi: 'hiện vật, cổ vật lịch sử',
        example: 'Looting of historical artifacts from war zones strips nations of their irreplaceable cultural patrimony.',
        collocations: ['preserve historical artifacts', 'excavate rare artifacts']
      },
      {
        id: 'his-2',
        term: 'repatriation of heritage',
        ipa: '/ˌriːˌpæt.riˈeɪ.ʃən əv ˈherɪtɪdʒ/',
        type: 'Academic Word',
        meaningVi: 'sự hồi hương, trao trả di sản văn hóa về cố quốc',
        example: 'Former colonies advocate the immediate repatriation of heritage treasures held in Western imperial museums.',
        collocations: ['demand heritage repatriation', 'bilateral artifact return']
      },
      {
        id: 'his-3',
        term: 'learn from the past',
        ipa: '/lɜːn frəm ðə pɑːst/',
        type: 'Idiom',
        meaningVi: 'rút ra bài học từ quá khứ để không lặp lại sai lầm',
        example: 'Failing to learn from the past inevitably condemns societies to repeat catastrophic economic mistakes.',
        collocations: ['heed the lessons of history', 'retrospective wisdom']
      },
      {
        id: 'his-4',
        term: 'archaeological excavation',
        ipa: '/ˌɑːkiəˈlɒdʒɪkl ˌekskəˈveɪʃn/',
        type: 'Academic Word',
        meaningVi: 'cuộc khai quật khảo cổ',
        example: 'Recent archaeological excavations unearthed elaborate subterranean irrigation networks built two millennia ago.',
        collocations: ['conduct an excavation', 'yield unprecedented findings']
      },
      {
        id: 'his-5',
        term: 'stand the test of time',
        ipa: '/stænd ðə test əv taɪm/',
        type: 'Idiom',
        meaningVi: 'vững vàng qua thử thách của thời gian, trường tồn',
        example: 'Ancient Roman aqueducts and architectural marvels have remarkably stood the test of time.',
        collocations: ['endure across centuries', 'timeless resilience']
      },
      {
        id: 'his-6',
        term: 'historical revisionism',
        ipa: '/hɪˈstɒrɪkl rɪˈvɪʒənɪzəm/',
        type: 'Academic Word',
        meaningVi: 'xét lại lịch sử (đánh giá lại dưới lăng kính mới)',
        example: 'Rigorous historical revisionism helps expose long-suppressed perspectives of marginalized indigenous peoples.',
        collocations: ['scholarly revisionism', 're-examine historical orthodoxies']
      },
      {
        id: 'his-7',
        term: 'living monument',
        ipa: '/ˈlɪvɪŋ ˈmɒnjumənt/',
        type: 'Collocation · IELTS',
        meaningVi: 'di tích sống (nơi truyền thống vẫn tiếp diễn)',
        example: 'Historic trading quarters in Kyoto and Hoi An function as living monuments of pre-industrial commerce.',
        collocations: ['conserve living monuments', 'inhabited heritage site']
      },
      {
        id: 'his-8',
        term: 'collective memory',
        ipa: '/kəˈlektɪv ˈmeməri/',
        type: 'Academic Word',
        meaningVi: 'ký ức tập thể của một dân tộc hoặc cộng đồng',
        example: 'National memorials serve to enshrine collective memory and honor sacrifices made during liberation wars.',
        collocations: ['preserve collective memory', 'part of national consciousness']
      },
      {
        id: 'his-9',
        term: 'turn back the clock',
        ipa: '/tɜːn bæk ðə klɒk/',
        type: 'Idiom',
        meaningVi: 'quay ngược thời gian, trở lại quá khứ',
        example: 'While we cannot turn back the clock, historical comprehension prevents repeating geopolitical catastrophes.',
        collocations: ['cannot reverse time', 'nostalgic impulses']
      },
      {
        id: 'his-10',
        term: 'paleontological evidence',
        ipa: '/ˌpeɪliˌɒntəˈlɒdʒɪkl ˈevɪdəns/',
        type: 'Academic Word',
        meaningVi: 'bằng chứng cổ sinh vật học (hóa thạch)',
        example: 'Paleontological evidence confirms that abrupt climate swings precipitated mass extinction episodes.',
        collocations: ['analyze fossilized remains', 'corroborate evolutionary models']
      }
    ],
    grammar: [
      {
        id: 'his-g1',
        title: 'Past Perfect in Historical Analysis',
        level: 'Band 7.0+',
        explanationVi: 'Diễn tả một sự kiện lịch sử xảy ra trước một mốc thời gian hoặc sự kiện khác trong quá khứ.',
        formula: 'Subject + had + Past Participle (V3/ed) + before / by the time',
        examples: [
          'By the time European explorers arrived, sophisticated indigenous agricultural systems had flourished for centuries.',
          'The empire had already collapsed economically before external barbarian forces breached the capital.'
        ],
        drillPrompt: 'Viết câu dùng Past Perfect về sự phát triển của nền văn minh cổ đại.',
        sampleTransform: 'Long before modern irrigation was conceived, ancient Mesopotamian engineers had constructed intricate canal systems.'
      },
      {
        id: 'his-g2',
        title: 'Inversion with "Never before had / Seldom had"',
        level: 'Band 8.0+',
        explanationVi: 'Nhấn mạnh sự kiện lịch sử có quy mô chưa từng có.',
        formula: 'Never before / Seldom had + S + V3 + Complement',
        examples: [
          'Never before had an ancient society constructed monuments of such staggering mathematical precision.',
          'Seldom had global trade networks experienced such rapid expansion as during the maritime spice era.'
        ],
        drillPrompt: 'Viết lại bằng "Never before had": "Ancient Rome reached unprecedented architectural grandeur."',
        sampleTransform: 'Never before had a classical civilization attained such monumental architectural and infrastructural sophistication.'
      }
    ],
    listening: {
      id: 'lis-his-01',
      title: 'Digital 3D Scanning and Restoration of Ancient Ruins',
      level: 'Band 7.5',
      durationMinutes: 4,
      audioText: 'Dr. Marcus Vance discusses how lidar imaging and drone photogrammetry are revolutionizing ancient site mapping...',
      questions: [
        {
          id: 'q-lis-his-1',
          prompt: 'What was stated as the main benefit of lidar scanning over manual excavation?',
          options: ['Penetrating dense jungle canopies without disturbing the ground', 'Lower satellite cost', 'Instant museum display', 'Finding gold treasures'],
          answer: 'Penetrating dense jungle canopies without disturbing the ground',
          explanation: 'The archaeologist explained that lidar lasers pierce through dense vegetation to reveal subterranean ruins.'
        }
      ]
    },
    writing: {
      task1Prompt: 'The maps illustrate changes in an archaeological excavation site between 1980 and 2020.',
      task2Prompt: 'Some people argue that museums should be free for all citizens, while others say admission fees are essential to maintain artifacts. Discuss both views.',
      sampleBand8: 'Museums serve as repositories of national memory and public educational enlightenment...'
    },
    speaking: {
      part1: ['Do you enjoy visiting museums when travelling?', 'Did you find history classes engaging at school?'],
      part2: {
        cueCard: 'Describe a historic building or monument you visited that fascinated you.',
        bulletPoints: ['Where it is situated', 'When and why it was constructed', 'What you saw during your visit', 'Why you find it historically significant'],
        followUp: 'Is this monument well-protected by authorities?'
      },
      part3: ['Why is it vital for younger generations to study historical errors?', 'Should foreign museums return looted artifacts?']
    }
  },

  // 23. BUSINESS & ENTREPRENEURSHIP
  {
    id: 'business',
    titleEn: 'Business, Leadership & Entrepreneurship',
    titleVi: 'Kinh doanh & Khởi nghiệp',
    accent: '#0284c7',
    badgeColor: '#0c4a6e',
    icon: 'Briefcase',
    descriptionVi: 'Khởi nghiệp đổi mới sáng tạo, trách nhiệm xã hội của doanh nghiệp (CSR), kỹ năng lãnh đạo và quản trị nhân sự.',
    vocab: [
      {
        id: 'bus-1',
        term: 'corporate social responsibility',
        ipa: '/ˌkɔːpərət ˈsəʊʃl rɪˌspɒnsəˈbɪləti/',
        type: 'Collocation · IELTS',
        meaningVi: 'trách nhiệm xã hội của doanh nghiệp (CSR)',
        example: 'Pioneering enterprises view corporate social responsibility as a core investment rather than a public relations expense.',
        collocations: ['implement CSR programs', 'ethical business practices']
      },
      {
        id: 'bus-2',
        term: 'disruptive innovation',
        ipa: '/dɪsˈrʌptɪv ˌɪnəˈveɪʃn/',
        type: 'Academic Word',
        meaningVi: 'sự đổi mới mang tính đột phá, thay đổi hoàn toàn cục diện thị trường',
        example: 'Smartphone application platforms represented a disruptive innovation that transformed urban taxi industries.',
        collocations: ['pioneer disruptive innovation', 'threaten legacy business models']
      },
      {
        id: 'bus-3',
        term: 'venture capital',
        ipa: '/ˈventʃə ˈkæpɪtl/',
        type: 'Collocation · IELTS',
        meaningVi: 'vốn đầu tư mạo hiểm cho các startup',
        example: 'Securing venture capital backing enables tech startups to scale product operations rapidly before turning profitable.',
        collocations: ['attract venture capital', 'venture capital firm']
      },
      {
        id: 'bus-4',
        term: 'sustainable business model',
        ipa: '/səˈsteɪnəbl ˈbɪznəs ˈmɒdl/',
        type: 'Collocation · IELTS',
        meaningVi: 'mô hình kinh doanh bền vững',
        example: 'Investors increasingly divest from carbon-heavy firms that lack a viable sustainable business model.',
        collocations: ['develop a sustainable model', 'triple bottom line accounting']
      },
      {
        id: 'bus-5',
        term: 'think outside the box',
        ipa: '/θɪŋk aʊtˈsaɪd ðə bɒks/',
        type: 'Idiom',
        meaningVi: 'suy nghĩ đột phá, sáng tạo vượt khỏi khuôn khổ',
        example: 'Forward-looking entrepreneurs must think outside the box to navigate fierce e-commerce competition.',
        collocations: ['ability to think outside the box', 'unconventional problem-solving']
      },
      {
        id: 'bus-6',
        term: 'competitive advantage',
        ipa: '/kəmˈpetətɪv ədˈvɑːntɪdʒ/',
        type: 'Academic Word',
        meaningVi: 'lợi thế cạnh tranh',
        example: 'Proprietary artificial intelligence algorithms confer a durable competitive advantage over rival manufacturers.',
        collocations: ['maintain competitive advantage', 'gain an edge over competitors']
      },
      {
        id: 'bus-7',
        term: 'entrepreneurial mindset',
        ipa: '/ˌɒntrəprəˈnɜːriəl ˈmaɪndset/',
        type: 'Academic Word',
        meaningVi: 'tư duy khởi nghiệp (chấp nhận rủi ro và tìm kiếm cơ hội)',
        example: 'Business academies strive to instill an entrepreneurial mindset characterized by resilience and lateral thinking.',
        collocations: ['cultivate an entrepreneurial mindset', 'risk-taking acumen']
      },
      {
        id: 'bus-8',
        term: 'bottom line',
        ipa: '/ˌbɒt.əm ˈlaɪn/',
        type: 'Idiom',
        meaningVi: 'lợi nhuận ròng cuối cùng / điểm cốt lõi nhất',
        example: 'Prioritizing employee mental well-being ultimately bolsters the corporate bottom line by reducing absenteeism.',
        collocations: ['affect the bottom line', 'focus on profitability']
      },
      {
        id: 'bus-9',
        term: 'monopolistic practice',
        ipa: '/məˌnɒpəˈlɪstɪk ˈpræktɪs/',
        type: 'Academic Word',
        meaningVi: 'hành vi độc quyền bóp nghẹt cạnh tranh',
        example: 'Antitrust regulators investigate tech conglomerates suspected of engaging in anti-competitive monopolistic practices.',
        collocations: ['penalize monopolistic practices', 'break up monopolies']
      },
      {
        id: 'bus-10',
        term: 'consumer loyalty',
        ipa: '/kənˈsjuːmə ˈlɔɪəlti/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự trung thành của người tiêu dùng đối với thương hiệu',
        example: 'Exceptional after-sales service and transparent warranties are paramount in cultivating long-term consumer loyalty.',
        collocations: ['foster consumer loyalty', 'brand loyalty retention']
      }
    ],
    grammar: [
      {
        id: 'bus-g1',
        title: 'Nominalisation in Business Reports',
        level: 'Band 7.5+',
        explanationVi: 'Chuyển động từ thành cụm danh từ để tăng tính học thuật và súc tích.',
        formula: 'Verb -> Noun phrase (e.g. innovate -> the implementation of innovative strategies)',
        examples: [
          'The prompt execution of financial restructuring averted corporate bankruptcy.',
          'The rapid expansion of e-commerce channels necessitated the modernization of warehouse logistics.'
        ],
        drillPrompt: 'Danh từ hóa câu sau: "Because the company reduced operational costs, profits rose."',
        sampleTransform: 'A substantial reduction in operational expenditures yielded an immediate surge in quarterly net profitability.'
      },
      {
        id: 'bus-g2',
        title: 'Conditionals with "Should you require / Should S happen to"',
        level: 'Band 8.0+',
        explanationVi: 'Đảo ngữ câu điều kiện loại 1 trong giao tiếp và thư từ thương mại trang trọng.',
        formula: 'Should + Subject + Verb-bare, S + will + Verb',
        examples: [
          'Should startup founders encounter unforeseen regulatory hurdles, venture mentors provide legal guidance.',
          'Should market volatility persist, corporate treasurers will hedge currency exposures.'
        ],
        drillPrompt: 'Chuyển sang đảo ngữ loại 1: "If consumer demand contracts, firms will reduce output."',
        sampleTransform: 'Should consumer demand contract unexpectedly, manufacturing facilities will curtail production quotas immediately.'
      }
    ],
    listening: {
      id: 'lis-bus-01',
      title: 'Venture Capital Due Diligence in Green Technology Startups',
      level: 'Band 7.5',
      durationMinutes: 4,
      audioText: 'Managing partner Julian Stone details the essential metrics investors examine before injecting seed funding into clean-tech ventures...',
      questions: [
        {
          id: 'q-lis-bus-1',
          prompt: 'What was emphasized as the most pivotal factor in early-stage venture evaluation?',
          options: ['Founding team execution capability and technical resilience', 'Office size', 'Initial revenue figures', 'Social media followers'],
          answer: 'Founding team execution capability and technical resilience',
          explanation: 'Julian Stone stated that venture capital primarily bets on the capability and grit of the founders.'
        }
      ]
    },
    writing: {
      task1Prompt: 'The table contrasts initial capital expenditures and break-even timelines for four startup business models.',
      task2Prompt: 'Some people argue that businesses have only one social responsibility: to make profit. Others believe businesses must benefit society. Discuss both views.',
      sampleBand8: 'The quintessential purpose of commercial business enterprises has provoked fierce ideological contention...'
    },
    speaking: {
      part1: ['Would you ever consider establishing your own business?', 'What qualities make a successful commercial leader?'],
      part2: {
        cueCard: 'Describe a successful business or enterprise that you admire in your locality.',
        bulletPoints: ['What business it is', 'What services or merchandise it provides', 'How it distinguishes itself from rivals', 'Why you admire its leadership'],
        followUp: 'Is this enterprise popular among your acquaintances?'
      },
      part3: ['What are the advantages and drawbacks of working for a startup versus a large corporation?', 'How has e-commerce transformed retail?']
    }
  },

  // 24. WILDLIFE & BIODIVERSITY
  {
    id: 'wildlife',
    titleEn: 'Wildlife, Flora & Marine Ecosystems',
    titleVi: 'Động thực vật & Hệ sinh thái',
    accent: '#10b981',
    badgeColor: '#064e3b',
    icon: 'Feather',
    descriptionVi: 'Bảo tồn đa dạng sinh học, tuyệt chủng loài, phá hủy sinh cảnh, hệ sinh thái đại dương và buôn bán động vật hoang dã.',
    vocab: [
      {
        id: 'wil-1',
        term: 'biodiversity loss',
        ipa: '/ˌbaɪəʊdaɪˈvɜːsəti lɒs/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự suy giảm đa dạng sinh học',
        example: 'Habitat fragmentation and pesticide runoff are the prime accelerators of accelerating biodiversity loss.',
        collocations: ['halt biodiversity loss', 'catastrophic loss of species']
      },
      {
        id: 'wil-2',
        term: 'endangered species',
        ipa: '/ɪnˈdeɪndʒəd ˈspiːʃiːz/',
        type: 'Collocation · IELTS',
        meaningVi: 'loài động thực vật có nguy cơ tuyệt chủng',
        example: 'Establishing protected wildlife corridors enables endangered species to migrate safely across fragmented landscapes.',
        collocations: ['protect endangered species', 'red list of endangered fauna']
      },
      {
        id: 'wil-3',
        term: 'poaching and trafficking',
        ipa: '/ˈpəʊtʃɪŋ ənd ˈtræfɪkɪŋ/',
        type: 'Collocation · IELTS',
        meaningVi: 'săn bắn trộm và buôn lậu động vật hoang dã',
        example: 'International syndicates fuel illicit poaching and trafficking of pangolin scales and rhinoceros horn.',
        collocations: ['crack down on poaching', 'wildlife trafficking network']
      },
      {
        id: 'wil-4',
        term: 'coral reef bleaching',
        ipa: '/ˈkɒrəl riːf ˈbliːtʃɪŋ/',
        type: 'Academic Word',
        meaningVi: 'hiện tượng tẩy trắng san hô do nước biển ấm lên',
        example: 'Prolonged marine heatwaves cause widespread coral reef bleaching, decimating nursery grounds for pelagic fish.',
        collocations: ['trigger coral bleaching', 'mass bleaching episode']
      },
      {
        id: 'wil-5',
        term: 'keystone species',
        ipa: '/ˈkiːstəʊn ˈspiːʃiːz/',
        type: 'Academic Word',
        meaningVi: 'loài chủ chốt (đóng vai trò duy trì sự cân bằng của cả hệ sinh thái)',
        example: 'Apex predators like gray wolves act as keystone species whose presence prevents herbivore overgrazing.',
        collocations: ['role of keystone species', 'ecosystem collapse without keystone species']
      },
      {
        id: 'wil-6',
        term: 'habitat fragmentation',
        ipa: '/ˈhæbɪtæt ˌfræɡmenˈteɪʃn/',
        type: 'Academic Word',
        meaningVi: 'sự chia cắt, phân mảnh môi trường sống tự nhiên',
        example: 'Highway construction across virgin rainforest causes severe habitat fragmentation for arboreal primates.',
        collocations: ['mitigate habitat fragmentation', 'wildlife overpasses']
      },
      {
        id: 'wil-7',
        term: 'food chain disruption',
        ipa: '/fuːd tʃeɪn dɪsˈrʌpʃn/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự gián đoạn, đứt gãy chuỗi thức ăn',
        example: 'Overfishing of primary krill populations risks systemic food chain disruption throughout the Antarctic ocean.',
        collocations: ['trigger food chain disruption', 'destabilize trophic levels']
      },
      {
        id: 'wil-8',
        term: 'in the wild',
        ipa: '/ɪn ðə waɪld/',
        type: 'Idiom',
        meaningVi: 'trong môi trường tự nhiên hoang dã',
        example: 'Fewer than five hundred Siberian tigers survive in the wild across remote Far Eastern taiga forests.',
        collocations: ['roam in the wild', 'extinct in the wild']
      },
      {
        id: 'wil-9',
        term: 'marine protected area',
        ipa: '/məˈriːn prəˈtektɪd ˈeəriə/',
        type: 'Academic Word',
        meaningVi: 'khu bảo tồn biển nghiêm ngặt',
        example: 'Designating large no-take marine protected areas allows depleted fish stocks to regenerate biomass.',
        collocations: ['establish marine reserves', 'enforce marine protected zones']
      },
      {
        id: 'wil-10',
        term: 'ecological equilibrium',
        ipa: '/ˌiːkəˈlɒdʒɪkl ˌiːkwɪˈlɪbriəm/',
        type: 'Academic Word',
        meaningVi: 'trạng thái cân bằng sinh thái',
        example: 'Introducing invasive cane toads irreparably disturbed the delicate ecological equilibrium of local fauna.',
        collocations: ['restore ecological equilibrium', 'upset nature’s balance']
      }
    ],
    grammar: [
      {
        id: 'wil-g1',
        title: 'Present Participles (V-ing) as Adverbial Modifiers',
        level: 'Band 7.5+',
        explanationVi: 'Miêu tả hậu quả của hành vi con người lên tự nhiên.',
        formula: 'Main clause, thereby / thus + V-ing + Object',
        examples: [
          'Commercial trawlers scrape ocean seabeds, thereby destroying ancient sponge habitats that take centuries to mature.',
          'Industrial effluents drain into delta estuaries, thus imperiling the survival of freshwater dolphins.'
        ],
        drillPrompt: 'Viết câu dùng "thereby V-ing" về nạn phá rừng.',
        sampleTransform: 'Unrestricted timber logging razes vital tropical forests, thereby depriving countless endemic primates of nesting habitats.'
      },
      {
        id: 'wil-g2',
        title: 'Inversion with "Only when / Only through"',
        level: 'Band 8.0+',
        explanationVi: 'Nhấn mạnh biện pháp bảo tồn sinh thái duy nhất có hiệu quả.',
        formula: 'Only through + Noun phrase, will + S + Verb',
        examples: [
          'Only through international anti-trafficking task forces will the slaughter of endangered elephants be halted.',
          'Only when pristine habitat corridors are preserved will wild predator populations successfully rebound.'
        ],
        drillPrompt: 'Viết câu đảo ngữ "Only through..." về việc bảo vệ đại dương.',
        sampleTransform: 'Only through enforcing strict global marine protected sanctuaries will depleted oceanic fish stocks fully regenerate.'
      }
    ],
    listening: {
      id: 'lis-wil-01',
      title: 'Acoustic Monitoring of Amazonian Rainforest Biodiversity',
      level: 'Band 7.5',
      durationMinutes: 4,
      audioText: 'In our conservation biology research update, Dr. Mateo Silva describes deploying solar-powered bioacoustic sensors across cloud forests...',
      questions: [
        {
          id: 'q-lis-wil-1',
          prompt: 'What primary advantage does bioacoustic sensor monitoring offer over camera traps?',
          options: ['Continuous 24-hour auditory coverage across vast canopy layers', 'No battery required', 'Cheaper satellite dishes', 'Direct animal capture'],
          answer: 'Continuous 24-hour auditory coverage across vast canopy layers',
          explanation: 'Dr. Silva explained that acoustic arrays capture bird, insect, and primate calls day and night.'
        }
      ]
    },
    writing: {
      task1Prompt: 'The chart tracks the living planet index for marine, freshwater, and terrestrial vertebrates from 1970 to 2020.',
      task2Prompt: 'Some people argue that spending millions on protecting wild animals is wasteful when humans face severe social problems. Do you agree or disagree?',
      sampleBand8: 'The ethical imperative and ecological necessity of conserving endangered fauna have frequently been pitted against pressing human social needs...'
    },
    speaking: {
      part1: ['Are you fond of watching wildlife documentaries?', 'What wild animal is native to your region?'],
      part2: {
        cueCard: 'Describe an endangered animal species that you find particularly fascinating.',
        bulletPoints: ['What animal it is', 'Where its natural habitat is situated', 'Why it is facing extinction', 'What measures are needed to preserve it'],
        followUp: 'Have you ever seen this animal in person?'
      },
      part3: ['Should zoos be banned, or do they serve a legitimate conservation purpose?', 'How can international treaties enforce anti-poaching laws?']
    }
  },

  // 25. YOUTH & GENERATIONAL SHIFTS
  {
    id: 'generation',
    titleEn: 'Youth, Aging & Generational Shifts',
    titleVi: 'Thế hệ trẻ & Tuổi già',
    accent: '#a855f7',
    badgeColor: '#581c87',
    icon: 'Sparkles',
    descriptionVi: 'Thế hệ Gen Z, định hướng nghề nghiệp của giới trẻ, khoảng cách quan điểm sống và chính sách hỗ trợ người cao tuổi.',
    vocab: [
      {
        id: 'gen-1',
        term: 'digital native',
        ipa: '/ˌdɪdʒɪtl ˈneɪtɪv/',
        type: 'Collocation · IELTS',
        meaningVi: 'người sinh ra trong kỷ nguyên số (thành thạo công nghệ từ nhỏ)',
        example: 'As digital natives, teenagers process hypermedia effortlessly but may struggle with sustained linear reading.',
        collocations: ['traits of digital natives', 'digital native vs digital immigrant']
      },
      {
        id: 'gen-2',
        term: 'delayed adulthood',
        ipa: '/dɪˈleɪd əˈdʌlthʊd/',
        type: 'Academic Word',
        meaningVi: 'hiện tượng trưởng thành muộn (kết hôn, mua nhà muộn hơn)',
        example: 'Escalating student debt and soaring real estate prices have catalyzed widespread delayed adulthood across OECD nations.',
        collocations: ['phenomenon of delayed adulthood', 'delaying traditional milestones']
      },
      {
        id: 'gen-3',
        term: 'generational divide',
        ipa: '/ˌdʒen.əˈreɪ.ʃənəl dɪˈvaɪd/',
        type: 'Collocation · IELTS',
        meaningVi: 'sự phân cực, bất đồng quan điểm giữa các thế hệ',
        example: 'Divergent perspectives regarding climate urgency and work-life balance have exacerbated the generational divide.',
        collocations: ['bridge the generational divide', 'deepening generational rift']
      },
      {
        id: 'gen-4',
        term: 'geriatric care',
        ipa: '/ˌdʒer.iˈæt.rɪk keə/',
        type: 'Academic Word',
        meaningVi: 'chăm sóc y tế và điều dưỡng cho người cao tuổi',
        example: 'Nations experiencing rapid aging must expand funding for community-based geriatric care infrastructure.',
        collocations: ['shortage of geriatric care specialists', 'comprehensive geriatric support']
      },
      {
        id: 'gen-5',
        term: 'stand on one’s own two feet',
        ipa: '/stænd ɒn wʌnz əʊn tuː fiːt/',
        type: 'Idiom',
        meaningVi: 'tự lập, tự đứng vững trên đôi chân của mình',
        example: 'Part-time student employment empowers young adults to stand on their own two feet financially.',
        collocations: ['learn to stand on own feet', 'achieve financial independence']
      },
      {
        id: 'gen-6',
        term: 'youth empowerment',
        ipa: '/juːθ ɪmˈpaʊəmənt/',
        type: 'Collocation · IELTS',
        meaningVi: 'trao quyền cho giới trẻ tham gia hoạch định chính sách',
        example: 'Civic forums advocating youth empowerment ensure adolescent viewpoints inform urban climate initiatives.',
        collocations: ['foster youth empowerment', 'grassroots youth participation']
      },
      {
        id: 'gen-7',
        term: 'retirement threshold',
        ipa: '/rɪˈtaɪəmənt ˈθreʃhəʊld/',
        type: 'Collocation · IELTS',
        meaningVi: 'tuổi nghỉ hưu theo luật định',
        example: 'Governments face intense public pushback when attempting to elevate the statutory retirement threshold.',
        collocations: ['raise the retirement threshold', 'pension age reform']
      },
      {
        id: 'gen-8',
        term: 'career aspirations',
        ipa: '/kəˈrɪər ˌæspəˈreɪʃnz/',
        type: 'Collocation · IELTS',
        meaningVi: 'nguyện vọng, hoài bão nghề nghiệp của giới trẻ',
        example: 'Modern graduates prioritize purpose and psychological fulfillment in their career aspirations over mere corporate loyalty.',
        collocations: ['fulfill career aspirations', 'evolving professional ambitions']
      },
      {
        id: 'gen-9',
        term: 'pass the torch',
        ipa: '/pɑːs ðə tɔːtʃ/',
        type: 'Idiom',
        meaningVi: 'chuyển giao ngọn đuốc, trao lại trách nhiệm cho thế hệ sau',
        example: 'Senior executive leaders must cultivate successor talent before preparing to pass the torch to younger managers.',
        collocations: ['pass the leadership torch', 'generational succession']
      },
      {
        id: 'gen-10',
        term: 'intergenerational solidarity',
        ipa: '/ˌɪntədʒenəˈreɪʃənl ˌsɒlɪˈdærəti/',
        type: 'Academic Word',
        meaningVi: 'tinh thần đoàn kết, tương trợ giữa các thế hệ',
        example: 'Maintaining equitable pension contributions alongside subsidized youth housing fosters true intergenerational solidarity.',
        collocations: ['nurture intergenerational solidarity', 'mutual generational support']
      }
    ],
    grammar: [
      {
        id: 'gen-g1',
        title: 'Clauses of Contrast with "While / Whereas"',
        level: 'Band 7.0+',
        explanationVi: 'Đối chiếu tư duy và kỳ vọng giữa thế hệ trẻ và thế hệ đi trước.',
        formula: 'Clause 1, whereas / while + Clause 2',
        examples: [
          'Previous generations prioritized job security and institutional stability, whereas modern youths seek autonomy and personal alignment.',
          'While baby boomers frequently favored physical home ownership, younger cohorts embrace flexible rented lifestyles.'
        ],
        drillPrompt: 'Viết câu đối chiếu quan điểm về công việc giữa hai thế hệ.',
        sampleTransform: 'Whereas senior professionals often regarded lifelong company tenure as a virtue, millennial and Gen Z employees prioritize workplace well-being.'
      },
      {
        id: 'gen-g2',
        title: 'Cleft Sentences for Emphasis in Societal Essays',
        level: 'Band 8.0+',
        explanationVi: 'Nhấn mạnh trách nhiệm tạo cơ hội cho giới trẻ.',
        formula: 'It is + Noun phrase + that + Clause',
        examples: [
          'It is equitable access to affordable housing that empowers young adults to achieve true financial independence.',
          'It is mutual respect, rather than rigid hierarchy, that bridges the widening generational divide.'
        ],
        drillPrompt: 'Viết câu nhấn mạnh cơ hội giáo dục cho thanh thiếu niên.',
        sampleTransform: 'It is high-quality vocational mentorship that truly unlocks the innovative potential of the younger generation.'
      }
    ],
    listening: {
      id: 'lis-gen-01',
      title: 'Generational Value Shifts in Modern Corporate Environments',
      level: 'Band 7.5',
      durationMinutes: 4,
      audioText: 'Sociologist Claire Dupont explores workplace dynamics as four distinct generational cohorts collaborate under one roof...',
      questions: [
        {
          id: 'q-lis-gen-1',
          prompt: 'What was identified as the primary non-monetary perk demanded by younger job seekers?',
          options: ['Flexible remote work arrangements and mental health support', 'Free parking spaces', 'Company cars', 'Longer uniform lunch hours'],
          answer: 'Flexible remote work arrangements and mental health support',
          explanation: 'The researcher highlighted schedule autonomy and psychological well-being.'
        }
      ]
    },
    writing: {
      task1Prompt: 'The chart contrasts home ownership rates among 25-34 year olds across five countries in 2000 and 2020.',
      task2Prompt: 'Some people believe that older generations have the most valuable wisdom, while others argue that young people understand the modern world better. Discuss both views.',
      sampleBand8: 'The dynamic interchange between the accrued wisdom of older citizens and the innovative technological fluency of youth...'
    },
    speaking: {
      part1: ['Do you find it easy to converse with people much older than you?', 'What advice do older relatives frequently give you?'],
      part2: {
        cueCard: 'Describe a valuable lesson or perspective you gained from a person of a different generation.',
        bulletPoints: ['Who this individual was', 'What age difference existed between you', 'What lesson or insight they imparted', 'How it influenced your decisions'],
        followUp: 'Do you still reflect on that advice today?'
      },
      part3: ['How can societies ensure elderly citizens remain active and valued?', 'Why are young people today feeling more career pressure?']
    }
  }
]
