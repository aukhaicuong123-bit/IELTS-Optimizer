import { TOPICS, type VocabItem } from '../topicData'
import { ADDITIONAL_17_TOPICS } from './additionalTopicsData'

export interface ForumTopic {
  id: string
  titleEn: string
  titleVi: string
  category: 'Xã hội & Đời sống' | 'Khoa học & Tự nhiên' | 'Kinh tế & Phát triển' | 'Tư duy & Văn hóa'
  descriptionVi: string
  vocab: VocabItem[]
}

// Additional high-band words to bring the 8 core topics to 10 words each
const CORE_TOPIC_EXTENSIONS: Record<string, VocabItem[]> = {
  education: [
    {
      id: 'edu-ext-1',
      term: 'pedagogical approach',
      ipa: '/ˌped.əˈɡɒdʒ.ɪ.kəl əˈprəʊtʃ/',
      type: 'Academic Word',
      meaningVi: 'phương pháp sư phạm, cách tiếp cận giảng dạy',
      example: 'Modern pedagogical approaches emphasize interactive inquiry rather than rote memorization.',
      collocations: ['innovative pedagogical approaches', 'student-centered pedagogy']
    },
    {
      id: 'edu-ext-2',
      term: 'holistic development',
      ipa: '/həʊˈlɪs.tɪk dɪˈvel.əp.mənt/',
      type: 'Collocation · IELTS',
      meaningVi: 'sự phát triển toàn diện (thể chất, trí tuệ, nhân cách)',
      example: 'Liberal arts curricula foster holistic development by combining sciences with humanities.',
      collocations: ['promote holistic development', 'nurture well-rounded students']
    }
  ],
  environment: [
    {
      id: 'env-ext-1',
      term: 'carbon sequestration',
      ipa: '/ˈkɑː.bən ˌsiː.kwesˈtreɪ.ʃən/',
      type: 'Academic Word',
      meaningVi: 'sự cô lập và thu giữ carbon từ khí quyển',
      example: 'Preserving coastal mangrove forests enhances natural carbon sequestration and protects shorelines.',
      collocations: ['enhance carbon sequestration', 'biological sequestration methods']
    },
    {
      id: 'env-ext-2',
      term: 'environmental degradation',
      ipa: '/ɪnˌvaɪ.rənˈmen.təl ˌdeɡ.rəˈdeɪ.ʃən/',
      type: 'Collocation · IELTS',
      meaningVi: 'sự suy thoái môi trường sống',
      example: 'Uncontrolled industrial effluents cause irreversible environmental degradation to local river basins.',
      collocations: ['halt environmental degradation', 'combat ecosystem degradation']
    }
  ],
  technology: [
    {
      id: 'tech-ext-1',
      term: 'algorithmic bias',
      ipa: '/ˌæl.ɡəˈrɪð.mɪk ˈbaɪ.əs/',
      type: 'Academic Word',
      meaningVi: 'thiên kiến thuật toán do dữ liệu huấn luyện sai lệch',
      example: 'Auditing machine-learning models is crucial to eliminate algorithmic bias in loan approvals.',
      collocations: ['mitigate algorithmic bias', 'unintentional algorithmic discrimination']
    },
    {
      id: 'tech-ext-2',
      term: 'technological obsolescence',
      ipa: '/ˌtek.nəˈlɒdʒ.ɪ.kəl ˌɒb.səˈles.ns/',
      type: 'Collocation · IELTS',
      meaningVi: 'sự lỗi thời của công nghệ',
      example: 'Rapid device upgrades fuel electronic waste through planned technological obsolescence.',
      collocations: ['hasten technological obsolescence', 'pace of obsolescence']
    }
  ],
  health: [
    {
      id: 'hea-ext-1',
      term: 'preventative medicine',
      ipa: '/prɪˈven.tə.tɪv ˈmed.ɪ.sən/',
      type: 'Collocation · IELTS',
      meaningVi: 'y học dự phòng, phòng bệnh hơn chữa bệnh',
      example: 'Investing in preventative medicine yields higher societal returns than treating chronic advanced illnesses.',
      collocations: ['prioritize preventative medicine', 'public health preventative programs']
    },
    {
      id: 'hea-ext-2',
      term: 'psychological well-being',
      ipa: '/ˌsaɪ.kəˈlɒdʒ.ɪ.kəl ˌwelˈbiː.ɪŋ/',
      type: 'Collocation · IELTS',
      meaningVi: 'sức khỏe tinh thần, trạng thái an lạc tâm lý',
      example: 'Green city spaces noticeably enhance psychological well-being among urban inhabitants.',
      collocations: ['bolster psychological well-being', 'safeguard mental wellness']
    }
  ],
  work: [
    {
      id: 'wor-ext-1',
      term: 'telecommuting flexibility',
      ipa: '/ˈtel.i.kəˌmjuː.tɪŋ ˌflek.səˈbɪl.ə.ti/',
      type: 'Collocation · IELTS',
      meaningVi: 'sự linh hoạt làm việc từ xa',
      example: 'Offering telecommuting flexibility enhances worker retention and mitigates rush-hour gridlock.',
      collocations: ['embrace telecommuting flexibility', 'remote work autonomy']
    },
    {
      id: 'wor-ext-2',
      term: 'occupational hazard',
      ipa: '/ˌɒk.jʊˈpeɪ.ʃən.əl ˈhæz.əd/',
      type: 'Academic Word',
      meaningVi: 'mối nguy hiểm nghề nghiệp',
      example: 'Chronic back strain has become an alarming occupational hazard for computer desk workers.',
      collocations: ['minimize occupational hazards', 'workplace ergonomic risks']
    }
  ],
  cities: [
    {
      id: 'cit-ext-1',
      term: 'mixed-use zoning',
      ipa: '/mɪkst juːs ˈzəʊ.nɪŋ/',
      type: 'Academic Word',
      meaningVi: 'quy hoạch hỗn hợp (kết hợp nhà ở, cửa hàng, văn phòng trong cùng khu vực)',
      example: 'Adopting mixed-use zoning enables residents to walk to groceries and offices within minutes.',
      collocations: ['promote mixed-use zoning', 'smart urban mixed-use development']
    },
    {
      id: 'cit-ext-2',
      term: 'gentrification',
      ipa: '/ˌdʒen.trɪ.fɪˈkeɪ.ʃən/',
      type: 'Academic Word',
      meaningVi: 'quá trình chỉnh trang đô thị (khiến giá nhà tăng, đẩy người thu nhập thấp ra xa)',
      example: 'Rapid gentrification of historic quarters often prices out long-standing working-class tenants.',
      collocations: ['consequences of gentrification', 'resist unchecked gentrification']
    }
  ],
  crime: [
    {
      id: 'cri-ext-1',
      term: 'restorative justice',
      ipa: '/rɪˈstɔː.rə.tɪv ˈdʒʌs.tɪs/',
      type: 'Academic Word',
      meaningVi: 'công lý phục hồi (hàn gắn tổn thương giữa thủ phạm và nạn nhân)',
      example: 'Restorative justice programs reduce reoffending by facilitating empathy and direct restitution.',
      collocations: ['champion restorative justice', 'restorative community mediation']
    },
    {
      id: 'cri-ext-2',
      term: 'recidivism rate',
      ipa: '/rɪˈsɪd.ɪ.vɪ.zəm reɪt/',
      type: 'Academic Word',
      meaningVi: 'tỷ lệ tái phạm tội',
      example: 'Comprehensive prison vocational training drastically cuts recidivism rates upon parole release.',
      collocations: ['curb recidivism rates', 'high recidivism among ex-convicts']
    }
  ],
  culture: [
    {
      id: 'cul-ext-1',
      term: 'intangible heritage',
      ipa: '/ɪnˈtæn.dʒə.bəl ˈher.ɪ.tɪdʒ/',
      type: 'Collocation · IELTS',
      meaningVi: 'di sản văn hóa phi vật thể (lễ hội, âm nhạc dân gian, phong tục)',
      example: 'UNESCO designates traditional folk performing arts as endangered intangible heritage.',
      collocations: ['preserve intangible heritage', 'safeguard folk traditions']
    },
    {
      id: 'cul-ext-2',
      term: 'cultural appropriation',
      ipa: '/ˈkʌl.tʃər.əl əˌprəʊ.priˈeɪ.ʃən/',
      type: 'Academic Word',
      meaningVi: 'chiếm dụng văn hóa (sử dụng yếu tố văn hóa của nhóm thiểu số thiếu tôn trọng)',
      example: 'Commercializing sacred ceremonial attire without consent is condemned as cultural appropriation.',
      collocations: ['accused of cultural appropriation', 'respectful cultural exchange']
    }
  ]
}

// Construct the complete 25 Topics
export const FORUM_25_TOPICS: ForumTopic[] = [
  // 1 to 8: Core topics with extensions (10 words each)
  ...TOPICS.map(t => {
    const ext = CORE_TOPIC_EXTENSIONS[t.id] || []
    let cat: ForumTopic['category'] = 'Xã hội & Đời sống'
    if (['environment', 'health'].includes(t.id)) cat = 'Khoa học & Tự nhiên'
    if (['technology', 'work', 'cities'].includes(t.id)) cat = 'Kinh tế & Phát triển'
    if (['culture', 'education', 'crime'].includes(t.id)) cat = 'Tư duy & Văn hóa'

    return {
      id: t.id,
      titleEn: t.titleEn,
      titleVi: t.titleVi,
      category: cat,
      descriptionVi: t.descriptionVi,
      vocab: [...t.vocab, ...ext]
    }
  }),

  // 9 to 25: Additional topics from ForumFlash (10 words each)
  ...ADDITIONAL_17_TOPICS.map(t => {
    let cat: ForumTopic['category'] = 'Xã hội & Đời sống'
    if (['energy', 'wildlife', 'science', 'food'].includes(t.id)) cat = 'Khoa học & Tự nhiên'
    if (['travel', 'globalization', 'economy', 'transport', 'business'].includes(t.id)) cat = 'Kinh tế & Phát triển'
    if (['media', 'psychology', 'space', 'sports', 'language', 'history', 'generation', 'society'].includes(t.id)) cat = 'Tư duy & Văn hóa'

    return {
      id: t.id,
      titleEn: t.titleEn,
      titleVi: t.titleVi,
      category: cat,
      descriptionVi: t.descriptionVi,
      vocab: t.vocab
    }
  })
]

// Total vocabulary words count across all 25 topics
export const TOTAL_FORUM_VOCAB_COUNT = FORUM_25_TOPICS.reduce((acc, t) => acc + t.vocab.length, 0)
