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

// One additional high-utility item for every topic, so each campaign has a
// wider review set without changing the existing local progress IDs.
const TOPIC_EXPANSION: Record<string, VocabItem> = {
  education: { id: 'edu-extra-1', term: 'academic attainment', ipa: '/ˌæk.əˈdem.ɪk əˈteɪn.mənt/', type: 'Collocation · IELTS', meaningVi: 'thành tích học tập', example: 'Socioeconomic background can influence academic attainment long before university admission.', collocations: ['measure academic attainment', 'improve educational attainment'] },
  environment: { id: 'env-extra-1', term: 'ecosystem resilience', ipa: '/ˈiː.kəʊˌsɪs.təm rɪˈzɪl.i.əns/', type: 'Collocation · IELTS', meaningVi: 'khả năng chống chịu của hệ sinh thái', example: 'Biodiversity strengthens ecosystem resilience during periods of drought.', collocations: ['build ecosystem resilience', 'threaten ecosystem resilience'] },
  technology: { id: 'tech-extra-1', term: 'digital literacy', ipa: '/ˈdɪdʒ.ɪ.təl ˈlɪt.ər.ə.si/', type: 'Academic Word', meaningVi: 'năng lực số', example: 'Digital literacy is now essential for accessing public services and employment.', collocations: ['develop digital literacy', 'bridge the digital literacy gap'] },
  health: { id: 'hea-extra-1', term: 'healthcare disparity', ipa: '/ˈhelθ.keər dɪˈspær.ə.ti/', type: 'Academic Word', meaningVi: 'bất bình đẳng trong chăm sóc sức khỏe', example: 'Rural clinics can reduce healthcare disparities by providing preventive services locally.', collocations: ['address healthcare disparities', 'widen healthcare disparities'] },
  work: { id: 'wor-extra-1', term: 'employee retention', ipa: '/ɪmˈplɔɪ.iː rɪˈten.ʃən/', type: 'Collocation · IELTS', meaningVi: 'khả năng giữ chân nhân viên', example: 'Flexible working arrangements can improve employee retention.', collocations: ['boost employee retention', 'support staff retention'] },
  cities: { id: 'cit-extra-1', term: 'urban liveability', ipa: '/ˈɜː.bən ˌlɪv.əˈbɪl.ə.ti/', type: 'Academic Word', meaningVi: 'mức độ đáng sống của đô thị', example: 'Affordable housing is a central component of urban liveability.', collocations: ['improve urban liveability', 'measure city liveability'] },
  crime: { id: 'cri-extra-1', term: 'crime prevention', ipa: '/kraɪm prɪˈven.ʃən/', type: 'Collocation · IELTS', meaningVi: 'phòng chống tội phạm', example: 'Community policing combines crime prevention with trust-building.', collocations: ['prioritise crime prevention', 'invest in prevention'] },
  culture: { id: 'cul-extra-1', term: 'cultural continuity', ipa: '/ˈkʌl.tʃər.əl ˌkɒn.tɪˈnjuː.ə.ti/', type: 'Academic Word', meaningVi: 'tính liên tục văn hóa', example: 'Local schools can support cultural continuity by teaching traditional arts.', collocations: ['maintain cultural continuity', 'threaten cultural continuity'] },
  travel: { id: 'tra-extra-1', term: 'responsible tourism', ipa: '/rɪˈspɒn.sə.bəl ˈtʊə.rɪ.zəm/', type: 'Collocation · IELTS', meaningVi: 'du lịch có trách nhiệm', example: 'Responsible tourism limits environmental damage while supporting local livelihoods.', collocations: ['promote responsible tourism', 'principles of responsible tourism'] },
  globalization: { id: 'glo-extra-1', term: 'economic interdependence', ipa: '/ˌiː.kəˈnɒm.ɪk ˌɪn.tə.dɪˈpen.dəns/', type: 'Academic Word', meaningVi: 'sự phụ thuộc lẫn nhau về kinh tế', example: 'Economic interdependence makes supply-chain disruptions more widely felt.', collocations: ['deepen economic interdependence', 'global interdependence'] },
  media: { id: 'med-extra-1', term: 'media literacy', ipa: '/ˈmiː.di.ə ˈlɪt.ər.ə.si/', type: 'Academic Word', meaningVi: 'năng lực hiểu và đánh giá truyền thông', example: 'Media literacy helps students distinguish evidence from misleading claims.', collocations: ['teach media literacy', 'strengthen media literacy'] },
  science: { id: 'sci-extra-1', term: 'evidence-based policy', ipa: '/ˈev.ɪ.dəns beɪst ˈpɒl.ə.si/', type: 'Collocation · IELTS', meaningVi: 'chính sách dựa trên bằng chứng', example: 'Public health decisions should be guided by evidence-based policy.', collocations: ['formulate evidence-based policy', 'support evidence-based decisions'] },
  economy: { id: 'eco-extra-1', term: 'income inequality', ipa: '/ˈɪn.kʌm ˌɪn.ɪˈkwɒl.ə.ti/', type: 'Academic Word', meaningVi: 'bất bình đẳng thu nhập', example: 'Targeted taxation can reduce income inequality without discouraging innovation.', collocations: ['tackle income inequality', 'widen income inequality'] },
  society: { id: 'soc-extra-1', term: 'social cohesion', ipa: '/ˈsəʊ.ʃəl kəʊˈhiː.ʒən/', type: 'Collocation · IELTS', meaningVi: 'sự gắn kết xã hội', example: 'Shared public spaces can strengthen social cohesion in diverse neighbourhoods.', collocations: ['foster social cohesion', 'undermine social cohesion'] },
  energy: { id: 'ene-extra-1', term: 'energy transition', ipa: '/ˈen.ə.dʒi trænˈzɪʃ.ən/', type: 'Collocation · IELTS', meaningVi: 'quá trình chuyển đổi năng lượng', example: 'A fair energy transition must protect workers in carbon-intensive industries.', collocations: ['accelerate the energy transition', 'finance a just transition'] },
  transport: { id: 'transport-extra-1', term: 'modal shift', ipa: '/ˈməʊ.dəl ʃɪft/', type: 'Academic Word', meaningVi: 'sự chuyển đổi phương thức đi lại', example: 'Reliable buses are needed to achieve a modal shift away from private cars.', collocations: ['encourage a modal shift', 'support modal shift'] },
  psychology: { id: 'psy-extra-1', term: 'cognitive load', ipa: '/ˈkɒɡ.nə.tɪv ləʊd/', type: 'Academic Word', meaningVi: 'tải nhận thức', example: 'Clear instructions reduce cognitive load for learners working online.', collocations: ['reduce cognitive load', 'manage cognitive load'] },
  food: { id: 'foo-extra-1', term: 'food security', ipa: '/fuːd sɪˈkjʊə.rə.ti/', type: 'Collocation · IELTS', meaningVi: 'an ninh lương thực', example: 'Climate-resilient crops are important for long-term food security.', collocations: ['safeguard food security', 'threaten food security'] },
  space: { id: 'spa-extra-1', term: 'space exploration', ipa: '/speɪs ˌeks.pləˈreɪ.ʃən/', type: 'Collocation · IELTS', meaningVi: 'khám phá không gian', example: 'Space exploration has produced technologies with applications on Earth.', collocations: ['fund space exploration', 'advance space exploration'] },
  sports: { id: 'spo-extra-1', term: 'grassroots participation', ipa: '/ˈɡrɑːs.ruːts pɑːˌtɪs.ɪˈpeɪ.ʃən/', type: 'Collocation · IELTS', meaningVi: 'sự tham gia thể thao ở cấp cộng đồng', example: 'Affordable facilities are vital for grassroots participation in sport.', collocations: ['increase grassroots participation', 'support community participation'] },
  language: { id: 'lan-extra-1', term: 'linguistic diversity', ipa: '/lɪŋˈɡwɪs.tɪk daɪˈvɜː.sə.ti/', type: 'Academic Word', meaningVi: 'sự đa dạng ngôn ngữ', example: 'Linguistic diversity can enrich education but requires inclusive language policy.', collocations: ['preserve linguistic diversity', 'celebrate linguistic diversity'] },
  history: { id: 'his-extra-1', term: 'historical narrative', ipa: '/hɪˈstɒr.ɪ.kəl ˈnær.ə.tɪv/', type: 'Academic Word', meaningVi: 'tường thuật lịch sử', example: 'Museums increasingly present more than one historical narrative.', collocations: ['challenge a historical narrative', 'construct a national narrative'] },
  business: { id: 'bus-extra-1', term: 'corporate accountability', ipa: '/ˈkɔː.pər.ət əˌkaʊn.təˈbɪl.ə.ti/', type: 'Collocation · IELTS', meaningVi: 'trách nhiệm giải trình của doanh nghiệp', example: 'Transparent reporting strengthens corporate accountability.', collocations: ['demand corporate accountability', 'improve corporate accountability'] },
  wildlife: { id: 'wil-extra-1', term: 'habitat fragmentation', ipa: '/ˈhæb.ɪ.tæt ˌfræɡ.menˈteɪ.ʃən/', type: 'Academic Word', meaningVi: 'sự phân mảnh môi trường sống', example: 'Road construction accelerates habitat fragmentation and isolates animal populations.', collocations: ['prevent habitat fragmentation', 'reverse habitat fragmentation'] },
  generation: { id: 'gen-extra-1', term: 'intergenerational solidarity', ipa: '/ˌɪn.təˌdʒen.əˈreɪ.ʃən.əl ˌsɒl.ɪˈdær.ə.ti/', type: 'Collocation · IELTS', meaningVi: 'tình đoàn kết liên thế hệ', example: 'Public services should promote intergenerational solidarity rather than competition.', collocations: ['build intergenerational solidarity', 'strengthen family solidarity'] }
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
      vocab: [...t.vocab, ...ext, ...(TOPIC_EXPANSION[t.id] ? [TOPIC_EXPANSION[t.id]] : [])]
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
      vocab: [...t.vocab, ...(TOPIC_EXPANSION[t.id] ? [TOPIC_EXPANSION[t.id]] : [])]
    }
  })
]

// Total vocabulary words count across all 25 topics
export const TOTAL_FORUM_VOCAB_COUNT = FORUM_25_TOPICS.reduce((acc, t) => acc + t.vocab.length, 0)
