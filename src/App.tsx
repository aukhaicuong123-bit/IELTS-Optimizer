import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Compass,
  Home,
  ListChecks,
  Network,
  Palette,
  Quote,
  RotateCcw,
  Settings,
  Sparkles,
  Target,
  Volume2,
  RefreshCw,
  Check,
  ArrowRight,
  ArrowLeft,
  Eye,
  Award,
  HelpCircle,
  Layers,
  Filter,
  Play,
  Pause,
  GraduationCap,
  Leaf,
  Cpu,
  HeartPulse,
  Briefcase,
  Building2,
  Scale
} from 'lucide-react'
import { passages } from './content'
import {
  heatLevel,
  localDate,
  mergeAttemptErrors,
  minutesByDate,
  measuredMinutes,
  recommendations,
  scoreAttempt,
  snapshotActiveSession
} from './domain'
import { deriveReadingStates, readingDifficultyId, targetFor } from './readingEngine'
import { clearStore, loadStore } from './storage'
import { TOPICS, type TopicId, type TopicDefinition, type VocabItem, type GrammarRule } from './topicData'
import type {
  ActiveSession,
  Attempt,
  ErrorRecord,
  Page,
  Passage,
  PlanItem,
  Profile,
  Question,
  ReadingOccurrenceTarget,
  Skill,
  Store,
  StudyDestination
} from './types'

type NavItem = [Page, string, any]

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Tổng quan (Overview)',
    items: [
      ['dashboard', 'Bảng tổng quan', Home],
      ['record', 'Bấm giờ & Nhật ký', Clock3]
      ,['simulator', 'IELTS Test Simulator', Target]
    ]
  },
  {
    label: '4 Kỹ năng IELTS (Skills)',
    items: [
      ['practice', 'Reading (Đọc hiểu)', BookOpen],
      ['listening', 'Listening (Nghe hiểu)', Volume2],
      ['writing', 'Writing (Viết luận)', Palette],
      ['speaking', 'Speaking (Luyện nói)', Compass]
    ]
  },
  {
    label: 'Nền tảng chủ đề (Thematic)',
    items: [
      ['vocabulary', 'Từ vựng (Flashcards)', Layers],
      ['grammar', 'Ngữ pháp ứng dụng', ListChecks]
    ]
  },
  {
    label: 'Bằng chứng & Lỗi sai',
    items: [['errors', 'Bộ nhớ lỗi & Retest', RotateCcw]]
  },
  {
    label: 'Khám phá & Hồ sơ',
    items: [
      ['network', 'Tài liệu ôn luyện', Network],
      ['design', 'Thiết kế hệ thống', Palette],
      ['profile', 'Mục tiêu & Hồ sơ', Settings]
    ]
  }
]

const nav = navGroups.flatMap(group => group.items)

type RoadmapStep = { phase: string; title: string; outcome: string; activities: string[]; test: string }
const ROADMAPS: Record<Skill, RoadmapStep[]> = {
  Reading: [
    { phase: '01 · Chẩn đoán', title: 'Đọc hiểu và định vị thông tin', outcome: 'Xác định main idea, keywords và paraphrase trong văn bản học thuật.', activities: ['Skim 3 đoạn văn theo tiêu đề', 'Scan tên riêng, số liệu và mốc thời gian', 'Ghi lại paraphrase gây nhiễu'], test: 'Mini test: matching headings + True/False/Not Given' },
    { phase: '02 · Xây chiến thuật', title: 'Làm chủ dạng câu hỏi', outcome: 'Chọn chiến thuật theo dạng bài thay vì đoán đáp án.', activities: ['Matching information', 'Sentence endings và summary completion', 'Table/flow-chart completion'], test: 'Mixed set 20 câu, giới hạn 25 phút' },
    { phase: '03 · Chuyển giao', title: 'Timed passage và retest', outcome: 'Duy trì độ chính xác khi tăng độ khó và áp lực thời gian.', activities: ['Passage mới cùng objective', 'Error Memory theo từng occurrence', 'Retest một lỗi duy nhất bằng nội dung tương đương'], test: 'Full Reading simulation 60 phút' }
  ],
  Listening: [
    { phase: '01 · Chẩn đoán', title: 'Nghe ý chính và dự đoán', outcome: 'Dự đoán loại từ, bối cảnh và distractor trước khi nghe.', activities: ['Form/note completion', 'Nghe số, tên riêng, spelling', 'Shadowing câu ngắn'], test: 'Part 1–2: form completion + map labelling' },
    { phase: '02 · Phân biệt thông tin', title: 'Paraphrase và distractors', outcome: 'Theo dõi chuyển ý, sửa đáp án và nhận diện cách diễn đạt khác.', activities: ['Multiple choice', 'Matching speakers/opinions', 'Table và flow-chart completion'], test: 'Part 3: 15 câu nghe một lần' },
    { phase: '03 · Tốc độ thi', title: 'Bốn part liên tục', outcome: 'Giữ tập trung, ghi chú có chọn lọc và tự kiểm transcript.', activities: ['Part 4 academic lecture', 'Accent rotation', 'Review transcript theo lỗi'], test: 'Full Listening simulation 30 phút' }
  ],
  Writing: [
    { phase: '01 · Chẩn đoán', title: 'Task response và cấu trúc', outcome: 'Trả lời đủ đề, lập thesis và bố cục đoạn rõ ràng.', activities: ['Phân tích đề opinion/discussion/problem', 'Lập outline 5 phút', 'Viết topic sentence'], test: 'One-paragraph response + self checklist' },
    { phase: '02 · Phát triển band', title: 'Coherence, vocabulary, grammar', outcome: 'Phát triển ý bằng nguyên nhân, ví dụ và hệ quả; tránh học thuộc.', activities: ['Task 1 overview và grouping data', 'Task 2 argument/counterargument', 'Sửa lỗi câu phức và collocation'], test: 'Task 1 hoặc Task 2 timed draft' },
    { phase: '03 · Chuẩn hoá', title: 'Feedback và timed writing', outcome: 'Hoàn thành đúng thời lượng và tự sửa theo 4 tiêu chí chấm.', activities: ['Rewrite sau feedback', 'So sánh model answer hợp pháp', 'Kiểm tra word count và lỗi lặp'], test: 'Academic Writing 60 phút: Task 1 + Task 2' }
  ],
  Speaking: [
    { phase: '01 · Chẩn đoán', title: 'Fluency và phát âm', outcome: 'Trả lời tự nhiên, rõ ý và không phụ thuộc script.', activities: ['Part 1: personal topics', 'Chunking và intonation', 'Ghi âm 60 giây rồi tự nghe lại'], test: 'Part 1 rotation: 10 câu, không chuẩn bị' },
    { phase: '02 · Mở rộng ý', title: 'Cue card và follow-up', outcome: 'Nói đủ 2 phút với ví dụ, chi tiết và liên kết mạch lạc.', activities: ['Part 2: 1 phút chuẩn bị', 'Story spine: who/what/why/result', 'Part 3: compare, evaluate, speculate'], test: 'Cue card recording + 4 câu follow-up' },
    { phase: '03 · Mô phỏng', title: 'Mock interview', outcome: 'Duy trì độ chính xác và tương tác dưới áp lực thi.', activities: ['Random topic draw', 'Pronunciation repair list', 'So sánh bản ghi trước/sau'], test: 'Speaking mock 11–14 phút' }
  ],
  Vocabulary: [
    { phase: '01 · Nền tảng', title: 'Lexical chunks theo chủ đề', outcome: 'Nhớ collocation và word family trong ngữ cảnh, không học từ rời.', activities: ['Flashcard hai chiều', 'Pronunciation + word family', 'Tự đặt câu theo topic'], test: 'Recall quiz: nghĩa, collocation, dùng câu' },
    { phase: '02 · Sử dụng', title: 'Paraphrase và register', outcome: 'Chọn từ chính xác theo sắc thái Academic/Formal và tránh lặp.', activities: ['Synonym ladder', 'Cloze passage', 'Paraphrase câu Reading/Writing'], test: 'Mixed quiz 20 câu + short production' },
    { phase: '03 · Ghi nhớ dài hạn', title: 'Spaced review và transfer', outcome: 'Đưa từ đã học vào bài nói/viết và theo dõi từ hay quên.', activities: ['Review 1–3–7–14 ngày', 'Error Memory theo topic', 'Dùng 5 chunks trong một response'], test: 'Cumulative vocabulary checkpoint' }
  ],
  Grammar: [
    { phase: '01 · Chẩn đoán', title: 'Accuracy nền tảng', outcome: 'Nhận diện lỗi ảnh hưởng band: subject–verb, articles, tense, agreement.', activities: ['Error correction', 'Sentence combining', 'Mini dictation'], test: 'Diagnostic 25 câu theo lỗi' },
    { phase: '02 · Kiểm soát câu phức', title: 'Complexity có kiểm soát', outcome: 'Dùng relative clauses, conditionals và concessive clauses đúng mục đích.', activities: ['Rewrite simple → complex', 'Contrast/causal connectors', 'Grammar in context'], test: 'Editing passage + 8 câu production' },
    { phase: '03 · Transfer', title: 'Grammar trong bài thi', outcome: 'Giữ accuracy khi viết/nói thật, không nhồi cấu trúc rủi ro.', activities: ['Sửa một đoạn Writing', 'Speaking reformulation', 'Personal error log'], test: 'Timed response + targeted recheck sau 7 ngày' }
  ]
}

const DAILY_CYCLES: Record<Skill, string[]> = {
  Reading: ['Ngày 1 · Skim + main idea (25 phút)', 'Ngày 2 · Matching headings/information (35 phút)', 'Ngày 3 · T/F/NG + evidence log (35 phút)', 'Ngày 4 · Completion + paraphrase (40 phút)', 'Ngày 5 · Passage timed (20 phút)', 'Ngày 6 · Chữa lỗi và retest occurrence (30 phút)', 'Ngày 7 · Full Reading mock: 3 passages/60 phút'],
  Listening: ['Ngày 1 · Part 1 form completion (20 phút)', 'Ngày 2 · Part 2 map/matching (25 phút)', 'Ngày 3 · Part 3 multiple choice (30 phút)', 'Ngày 4 · Part 4 lecture/note completion (30 phút)', 'Ngày 5 · Dictation + shadowing (20 phút)', 'Ngày 6 · Transcript error review (25 phút)', 'Ngày 7 · Full Listening mock: 4 parts/30 phút'],
  Writing: ['Ngày 1 · Phân tích đề + thesis (25 phút)', 'Ngày 2 · Task 1 overview + grouping (35 phút)', 'Ngày 3 · Task 2 body paragraph (40 phút)', 'Ngày 4 · Cohesion + grammar editing (30 phút)', 'Ngày 5 · Task 1 timed: 20 phút', 'Ngày 6 · Task 2 timed: 40 phút', 'Ngày 7 · Full Writing mock: Task 1 + Task 2/60 phút'],
  Speaking: ['Ngày 1 · Part 1 fluency recording (15 phút)', 'Ngày 2 · Pronunciation: chunking + stress (20 phút)', 'Ngày 3 · Cue card: 1 phút chuẩn bị/2 phút nói', 'Ngày 4 · Part 3 compare/evaluate (25 phút)', 'Ngày 5 · Retell cùng ý bằng từ khác (20 phút)', 'Ngày 6 · Self-review theo 4 tiêu chí (20 phút)', 'Ngày 7 · Mock Speaking: Part 1–3/11–14 phút'],
  Vocabulary: ['Ngày 1 · Học 8 lexical chunks theo topic (20 phút)', 'Ngày 2 · Recall hai chiều + pronunciation (20 phút)', 'Ngày 3 · Collocation cloze (25 phút)', 'Ngày 4 · Paraphrase 10 câu (25 phút)', 'Ngày 5 · Dùng chunks trong Writing/Speaking (30 phút)', 'Ngày 6 · Ôn từ sai theo spaced review (20 phút)', 'Ngày 7 · Cumulative quiz + production checkpoint (30 phút)'],
  Grammar: ['Ngày 1 · Diagnostic: articles/agreement (25 phút)', 'Ngày 2 · Sentence combining (25 phút)', 'Ngày 3 · Relative/conditional clauses (30 phút)', 'Ngày 4 · Contrast/causal connectors (25 phút)', 'Ngày 5 · Edit một đoạn Writing (30 phút)', 'Ngày 6 · Speaking reformulation (20 phút)', 'Ngày 7 · Grammar checkpoint: editing + production/35 phút']
}

function SkillRoadmap({ skill }: { skill: Skill }) {
  const steps = ROADMAPS[skill]
  return (
    <section className="panel roadmap-panel">
      <div className="panel-title">
        <h3>Lộ trình học {skill}</h3>
      </div>
      <div className="roadmap-grid">
        {steps.map(step => (
          <article className="roadmap-step" key={step.phase}>
            <span className="badge">{step.phase}</span><h3>{step.title}</h3><p className="muted">{step.outcome}</p>
            <ul>{step.activities.map(activity => <li key={activity}>{activity}</li>)}</ul>
            <div className="callout"><b>Checkpoint:</b> {step.test}</div>
          </article>
        ))}
      </div>
      <div className="daily-plan-block">
        <div className="panel-title"><h3>Lịch học 7 ngày</h3></div>
        <div className="daily-plan-grid">{DAILY_CYCLES[skill].map((day, index) => <div className={`daily-plan-day ${index === 6 ? 'mock-day' : ''}`} key={day}><b>D{index + 1}</b><span>{day.split(' · ')[1]}</span></div>)}</div>
      </div>
    </section>
  )
}
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
const stableOccurrenceId = (errorId: string, occurrenceId: string) => `reading:occurrence:${errorId}:${occurrenceId}`

// Topic Icons mapping
const TOPIC_ICONS: Record<string, any> = {
  GraduationCap,
  Leaf,
  Cpu,
  HeartPulse,
  Briefcase,
  Building2,
  Scale,
  Palette
}

export default function App() {
  const [store, setStore] = useState<Store>(loadStore)
  const [page, setPage] = useState<Page>('dashboard')
  const [retestTargets, setRetestTargets] = useState<ReadingOccurrenceTarget[]>([])
  const [toast, setToast] = useState('')
  const [headerNow, setHeaderNow] = useState(Date.now())

  useEffect(() => {
    if (!store.recoveryState) localStorage.setItem('ielts-optimizer-store-v1', JSON.stringify(store))
  }, [store])

  useEffect(() => {
    if (!store.activeSession || store.activeSession.paused) return
    const t = setInterval(() => setHeaderNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [store.activeSession])

  useEffect(() => {
    const pauseWhenHidden = () => {
      const active = store.activeSession
      if (document.visibilityState !== 'hidden' || !active || active.paused) return
      const pausedAt = new Date().toISOString()
      setStore({
        ...store,
        activeSession: { ...snapshotActiveSession(active, pausedAt), paused: true }
      })
    }
    document.addEventListener('visibilitychange', pauseWhenHidden)
    return () => document.removeEventListener('visibilitychange', pauseWhenHidden)
  }, [store])

  const note = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(''), 2400)
  }

  const go = (next: Page) => {
    setRetestTargets([])
    setPage(next)
  }

  const openRetest = (target: ReadingOccurrenceTarget) => {
    setRetestTargets([target])
    setPage('practice')
  }

  const title = nav.find(item => item[0] === page)?.[1] || 'Bảng tổng quan'
  const openErrors = store.errors.filter(
    e => deriveReadingStates(store.errors, store.attempts, passages).statesByDifficulty[readingDifficultyId(e)]?.status === 'open'
  )

  const activeSec = store.activeSession
    ? Math.max(0, store.activeSession.accumulatedSeconds + (store.activeSession.paused ? 0 : (headerNow - new Date(store.activeSession.lastResumedAt).getTime()) / 1000))
    : 0

  return (
    <div className="app">
      <aside>
        <div className="brand">
          <span>I</span>
          <div>
            IELTS Optimizer
            <small>PERSONALIZED LEARNING</small>
          </div>
        </div>
        <nav aria-label="Main navigation">
          {navGroups.map(group => (
            <div className="nav-group" key={group.label}>
              <span className="nav-group-label">{group.label}</span>
              {group.items.map(([id, label, Icon]) => (
                <button
                  aria-label={label}
                  className={page === id ? 'active' : ''}
                  onClick={() => go(id)}
                  key={id}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                  {id === 'errors' && openErrors.length > 0 && (
                    <span className="nav-count" title={`${openErrors.length} lỗi chưa sửa`}>
                      {openErrors.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-note">
          <Target size={17} />
          <b>Bằng chứng trước kết luận.</b>
          <span>Dữ liệu học tập là minh chứng thực tế, không bịa điểm số.</span>
        </div>
      </aside>

      <main>
        {store.recoveryState && (
          <section className="panel" role="alert" style={{ marginBottom: '16px', borderColor: 'var(--red)' }}>
            <b>Data recovery mode</b>
            <p className="muted">{store.recoveryState.message} Reset storage only after saving the raw backup if needed.</p>
            {store.recoveryState.raw && <details><summary>Show preserved raw data</summary><pre style={{ maxHeight: '120px', overflow: 'auto' }}>{store.recoveryState.raw}</pre></details>}
          </section>
        )}
        <header>
          <div>
            <div className="section-kicker">
              <span>IELTS OPTIMIZER</span> · {nav.find(item => item[0] === page)?.[1]}
            </div>
            <h1>{title}</h1>
          </div>
          <div className="header-right-tools">
            {store.activeSession && (
              <div
                className="timer-live-badge"
                onClick={() => go('record')}
                title="Nhấp để xem nhật ký bấm giờ"
                role="button"
                tabIndex={0}
              >
                <span className="timer-pulse-dot" />
                <span>
                  {store.activeSession.paused ? 'Tạm dừng: ' : 'Đang học: '}
                  {Math.floor(activeSec / 60).toString().padStart(2, '0')}:
                  {Math.floor(activeSec % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
            <button aria-label="Cài đặt mục tiêu hồ sơ" className="icon-button" onClick={() => go('profile')}>
              <Settings size={18} />
            </button>
          </div>
        </header>

        {/* Quick Navigation Bar across related views */}
        {['practice', 'listening', 'writing', 'speaking'].includes(page) && (
          <div className="skill-quick-bar" role="tablist" aria-label="4 Kỹ năng">
            <button
              role="tab"
              aria-selected={page === 'practice'}
              className={`skill-quick-btn ${page === 'practice' ? 'active' : ''}`}
              onClick={() => go('practice')}
            >
              <BookOpen size={15} /> <span>Reading (Đọc hiểu)</span>
            </button>
            <button
              role="tab"
              aria-selected={page === 'listening'}
              className={`skill-quick-btn ${page === 'listening' ? 'active' : ''}`}
              onClick={() => go('listening')}
            >
              <Volume2 size={15} /> <span>Listening (Nghe hiểu)</span>
            </button>
            <button
              role="tab"
              aria-selected={page === 'writing'}
              className={`skill-quick-btn ${page === 'writing' ? 'active' : ''}`}
              onClick={() => go('writing')}
            >
              <Palette size={15} /> <span>Writing (Viết luận)</span>
            </button>
            <button
              role="tab"
              aria-selected={page === 'speaking'}
              className={`skill-quick-btn ${page === 'speaking' ? 'active' : ''}`}
              onClick={() => go('speaking')}
            >
              <Compass size={15} /> <span>Speaking (Luyện nói)</span>
            </button>
          </div>
        )}

        {['vocabulary', 'grammar', 'errors'].includes(page) && (
          <div className="skill-quick-bar" role="tablist" aria-label="Nền tảng & Lỗi sai">
            <button
              role="tab"
              aria-selected={page === 'vocabulary'}
              className={`skill-quick-btn ${page === 'vocabulary' ? 'active' : ''}`}
              onClick={() => go('vocabulary')}
            >
              <Layers size={15} /> <span>Từ vựng theo chủ đề (Flashcards)</span>
            </button>
            <button
              role="tab"
              aria-selected={page === 'grammar'}
              className={`skill-quick-btn ${page === 'grammar' ? 'active' : ''}`}
              onClick={() => go('grammar')}
            >
              <ListChecks size={15} /> <span>Ngữ pháp ứng dụng</span>
            </button>
            <button
              role="tab"
              aria-selected={page === 'errors'}
              className={`skill-quick-btn ${page === 'errors' ? 'active' : ''}`}
              onClick={() => go('errors')}
            >
              <RotateCcw size={15} />{' '}
              <span>Bộ nhớ lỗi & Retest {openErrors.length > 0 ? `(${openErrors.length})` : ''}</span>
            </button>
          </div>
        )}

        {['dashboard', 'record'].includes(page) && (
          <div className="skill-quick-bar" role="tablist" aria-label="Tổng quan học tập">
            <button
              role="tab"
              aria-selected={page === 'dashboard'}
              className={`skill-quick-btn ${page === 'dashboard' ? 'active' : ''}`}
              onClick={() => go('dashboard')}
            >
              <Home size={15} /> <span>Bảng tổng quan (Dashboard)</span>
            </button>
            <button
              role="tab"
              aria-selected={page === 'record'}
              className={`skill-quick-btn ${page === 'record' ? 'active' : ''}`}
              onClick={() => go('record')}
            >
              <Clock3 size={15} /> <span>Bấm giờ & Nhật ký (Record)</span>
            </button>
          </div>
        )}

        {page === 'dashboard' && <Dashboard s={store} go={setPage} setS={setStore} note={note} />}
        {page === 'practice' && <Practice s={store} setS={setStore} note={note} targets={retestTargets} />}
        {page === 'simulator' && <IELTSSimulation s={store} setS={setStore} note={note} />}
        {page === 'errors' && <Errors s={store} setS={setStore} openRetest={openRetest} note={note} go={setPage} />}
        {page === 'record' && <Record s={store} setS={setStore} note={note} />}
        {page === 'listening' && <SkillPractice s={store} setS={setStore} note={note} skill="Listening" />}
        {page === 'writing' && <SkillPractice s={store} setS={setStore} note={note} skill="Writing" />}
        {page === 'speaking' && <SkillPractice s={store} setS={setStore} note={note} skill="Speaking" />}
        {page === 'vocabulary' && <VocabularyHub s={store} setS={setStore} note={note} />}
        {page === 'grammar' && <GrammarHub s={store} setS={setStore} note={note} />}
        {page === 'network' && <LearningNetwork />}
        {page === 'design' && <LearningDesign />}
        {page === 'profile' && <Profile s={store} setS={setStore} note={note} />}
      </main>

      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}
    </div>
  )
}

/**
 * Shared Topic Navigation Bar (Inspired by ForumFlash #study)
 */
function TopicBar({
  selected,
  onSelect,
  showAll = false
}: {
  selected: TopicId | 'all'
  onSelect: (topicId: TopicId | 'all') => void
  showAll?: boolean
}) {
  return (
    <div className="topic-hub-container" role="region" aria-label="IELTS Topics">
      <div className="topic-grid" role="tablist">
        {showAll && (
          <button
            type="button"
            role="tab"
            aria-selected={selected === 'all'}
            className={`topic-card-btn ${selected === 'all' ? 'active' : ''}`}
            onClick={() => onSelect('all')}
          >
            <div className="topic-card-indicator" style={{ backgroundColor: '#92dcaa' }} />
            <Filter size={15} className="topic-card-icon" style={{ color: '#92dcaa' }} />
            <div className="topic-card-text">
              <span className="topic-en">Tất cả chủ đề</span>
              <small className="topic-vi">All 8 Topics</small>
            </div>
          </button>
        )}
        {TOPICS.map(topic => {
          const Icon = TOPIC_ICONS[topic.icon] || Layers
          const isActive = selected === topic.id
          return (
            <button
              key={topic.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`topic-card-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelect(topic.id)}
            >
              <div className="topic-card-indicator" style={{ backgroundColor: topic.accent }} />
              <Icon size={15} className="topic-card-icon" style={{ color: isActive ? topic.accent : undefined }} />
              <div className="topic-card-text">
                <span className="topic-en">{topic.titleEn.split(' & ')[0]}</span>
                <small className="topic-vi">{topic.titleVi.split(' & ')[0]}</small>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TopicHeader({ topic, extraBadge }: { topic: TopicDefinition; extraBadge?: ReactNode }) {
  const Icon = TOPIC_ICONS[topic.icon] || Layers
  return (
    <div className="topic-header-card" style={{ borderLeft: `4px solid ${topic.accent}` }}>
      <div className="topic-header-left">
        <div
          className="topic-icon-badge"
          style={{
            backgroundColor: `${topic.accent}20`,
            color: topic.accent,
            borderColor: `${topic.accent}55`
          }}
        >
          <Icon size={22} />
        </div>
        <div className="topic-header-title">
          <div className="topic-kicker-row">
            <span className="eyebrow" style={{ color: topic.accent, margin: 0 }}>
              CHỦ ĐỀ ÔN TẬP IELTS · {topic.titleEn.toUpperCase()}
            </span>
            <span className="topic-band-target">Band 6.5 – 8.5</span>
          </div>
          <h2>
            {topic.titleEn} — {topic.titleVi}
          </h2>
          <p>{topic.descriptionVi}</p>
        </div>
      </div>
      <div className="topic-header-meta">
        <div className="topic-stat-pills">
          <span className="stat-pill"><b>{topic.vocab.length}</b> từ vựng</span>
          <span className="stat-pill"><b>{topic.grammar.length}</b> ngữ pháp</span>
          <span className="stat-pill"><b>Task 1 & 2</b></span>
          <span className="stat-pill"><b>Speaking</b></span>
        </div>
        {extraBadge}
      </div>
    </div>
  )
}

function Dashboard({
  s,
  go,
  setS,
  note
}: {
  s: Store
  go: (page: Page) => void
  setS: (store: Store) => void
  note: (message: string) => void
}) {
  const minutes = minutesByDate(s.sessions)
  const today = Math.round(minutes[localDate(new Date().toISOString())] || 0)
  const projection = deriveReadingStates(s.errors, s.attempts, passages)
  const open = s.errors.filter(
    error => projection.statesByDifficulty[readingDifficultyId(error)]?.status === 'open'
  )
  const rec = recommendations(s.profile, s.attempts, s.errors, s.plan, projection.statesByDifficulty)

  return (
    <>
      <section className="hero-card">
        <div>
          <span className="eyebrow">YOUR NEXT LEARNING ACTION</span>
          <h2>{rec.title}</h2>
          <p>{rec.reason}</p>
          <button className="primary" onClick={() => go(rec.page)}>
            Open action →
          </button>
        </div>
      </section>

      <div className="metrics">
        <Metric icon={<Target />} label="Target band" value={s.profile.targetBand ? `${s.profile.targetBand}` : 'Not set'} />
        <Metric icon={<Clock3 />} label="Today" value={`${today} min`} />
        <Metric icon={<BookOpen />} label="Attempts" value={`${s.attempts.length}`} />
        <Metric icon={<RotateCcw />} label="Open errors" value={`${open.length}`} />
      </div>

      <DashboardRecord s={s} setS={setS} note={note} />

      <div className="dashboard-lower">
        <Heatmap s={s} />
        <MotivationPanel />
      </div>
    </>
  )
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="metric">
      <div className="metric-icon">{icon}</div>
      <small>{label}</small>
      <b>{value}</b>
    </div>
  )
}

function MotivationPanel() {
  const quotes = [
    'Small steps every day become confident answers.',
    'Your mistakes are data. Use them to choose the next right move.',
    'Progress is built in the minutes you decide to keep going.',
    'Focus on the next question, then let the evidence guide you.'
  ]
  const quote = quotes[new Date().getDate() % quotes.length]
  return (
    <section className="panel motivation-panel">
      <div className="motivation-art" aria-hidden="true">
        <div className="motivation-orbit orbit-one" />
        <div className="motivation-orbit orbit-two" />
        <div className="motivation-star">✦</div>
        <div className="motivation-spark spark-one">+</div>
        <div className="motivation-spark spark-two">·</div>
      </div>
      <div className="motivation-copy">
        <span className="eyebrow">
          <Sparkles size={12} /> KEEP GOING
        </span>
        <Quote size={18} />
        <blockquote>“{quote}”</blockquote>
        <p>Review your evidence, choose one focused task and return tomorrow.</p>
      </div>
    </section>
  )
}

function DashboardRecord({
  s,
  setS,
  note
}: {
  s: Store
  setS: (store: Store) => void
  note: (message: string) => void
}) {
  const active = s.activeSession
  const destinations = s.studyDestinations || []
  const [now, setNow] = useState(Date.now())
  const [destinationId, setDestinationId] = useState(active?.destinationId || destinations[0]?.id || '')
  const [newDestination, setNewDestination] = useState('')
  const [newDestinationKind, setNewDestinationKind] = useState<StudyDestination['kind']>('website')

  useEffect(() => {
    if (!active || active.paused) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [active])

  useEffect(() => {
    if (!active || active.paused) return
    const timer = setInterval(() => {
      const snapshot = snapshotActiveSession(active, new Date().toISOString())
      if (snapshot !== active) setS({ ...s, activeSession: snapshot })
    }, 5000)
    return () => clearInterval(timer)
  }, [active, s, setS])

  const seconds = active
    ? Math.max(0, active.accumulatedSeconds + (active.paused ? 0 : (now - new Date(active.lastResumedAt).getTime()) / 1000))
    : 0

  const start = () => {
    const time = new Date().toISOString()
    setNow(Date.now())
    setS({
      ...s,
      activeSession: {
        id: uid('session'),
        startedAt: time,
        lastResumedAt: time,
        accumulatedSeconds: 0,
        paused: false,
        activeIntervals: [],
        destinationId: destinationId || undefined
      }
    })
  }

  const pause = () => {
    if (!active) return
    setS({
      ...s,
      activeSession: { ...snapshotActiveSession(active, new Date().toISOString()), paused: true }
    })
  }

  const resume = () => {
    if (active) {
      setNow(Date.now())
      setS({
        ...s,
        activeSession: { ...active, lastResumedAt: new Date().toISOString(), paused: false }
      })
    }
  }

  const stop = () => {
    if (!active) return
    const end = new Date().toISOString()
    const completed = snapshotActiveSession(active, end)
    const intervals = completed.activeIntervals || []
    const measured = intervals.length
      ? intervals.reduce((total, interval) => total + Math.max(0, Date.parse(interval.endedAt) - Date.parse(interval.startedAt)) / 1000, 0)
      : completed.accumulatedSeconds
    const destination = destinations.find(item => item.id === active.destinationId)
    setS({
      ...s,
      activeSession: undefined,
      sessions: [
        ...s.sessions,
        {
          id: active.id,
          startedAt: active.startedAt,
          endedAt: end,
          minutes: Math.max(0, Math.round(measured / 60)),
          activeIntervals: intervals.length ? intervals : undefined,
          activity: destination ? `Study · ${destination.name}` : 'Dashboard study session',
          skill: 'Reading'
        }
      ]
    })
    note('Study time saved to Learning Record.')
  }

  const addDestination = () => {
    const name = newDestination.trim()
    if (!name) return
    const item: StudyDestination = { id: uid('destination'), name, kind: newDestinationKind }
    setS({ ...s, studyDestinations: [...destinations, item] })
    setDestinationId(item.id)
    setNewDestination('')
  }

  const recentAttempts = s.attempts.slice().reverse().slice(0, 3)
  const recentSubmissions = (s.submissions || []).slice().reverse().slice(0, 3)
  const recentSessions = s.sessions.slice().reverse().slice(0, 2)

  return (
    <section className="panel dashboard-record">
      <div className="panel-title">
        <div>
          <span className="eyebrow">LEARNING RECORD</span>
          <h3>Study session & recent activity</h3>
        </div>
      </div>
      <div className="destination-tools">
        <div>
          <b>Study destination</b>
          <small>Choose a label for this session. Leaving this tab automatically pauses the timer.</small>
        </div>
        <select
          aria-label="Study destination"
          value={destinationId}
          onChange={event => setDestinationId(event.target.value)}
        >
          <option value="">General study</option>
          {destinations.map(item => (
            <option value={item.id} key={item.id}>
              {item.name} · {item.kind}
            </option>
          ))}
        </select>
        <div className="destination-add">
          <input
            aria-label="New study website or app"
            placeholder="Add website or app"
            value={newDestination}
            onChange={event => setNewDestination(event.target.value)}
          />
          <select
            aria-label="New destination type"
            value={newDestinationKind}
            onChange={event => setNewDestinationKind(event.target.value as StudyDestination['kind'])}
          >
            <option value="website">Website</option>
            <option value="app">App</option>
          </select>
          <button className="secondary" onClick={addDestination}>
            Add
          </button>
        </div>
      </div>
      <div className="record-timer">
        <div>
          <b>
            {Math.floor(seconds / 60).toString().padStart(2, '0')}:
            {Math.floor(seconds % 60).toString().padStart(2, '0')}
          </b>
          <span>
            {active ? (active.paused ? 'Paused — resume when ready' : 'Session in progress') : 'Start a measured session from Dashboard'}
          </span>
        </div>
        {!active ? (
          <button className="primary" onClick={start}>
            Start learning session
          </button>
        ) : (
          <div className="record-timer-actions">
            <button className="secondary" onClick={active.paused ? resume : pause}>
              {active.paused ? 'Resume' : 'Pause'}
            </button>
            <button className="danger" onClick={stop}>
              Stop and save
            </button>
          </div>
        )}
      </div>
      <p className="muted record-note">
        Only active intervals are recorded. Switching to another tab or app pauses this session automatically. The
        destination list labels context; it does not grant background tracking permission.
      </p>
      <div className="record-summary">
        <b>{s.sessions.reduce((total, item) => total + item.minutes, 0)} min</b>
        <span>measured study time</span>
        <b>{s.attempts.length + (s.submissions || []).length}</b>
        <span>saved activities</span>
      </div>
      {recentAttempts.length || recentSubmissions.length || recentSessions.length ? (
        <div className="record-activity">
          {recentAttempts.map(item => (
            <div className="record-activity-row" key={`attempt-${item.id}`}>
              <span className="record-dot reading-dot" />
              <div>
                <b>{item.kind === 'retest' ? 'Reading Retest' : 'Reading Practice'}</b>
                <small>
                  {new Date(item.createdAt).toLocaleString()} · {item.score}/{item.total}
                </small>
              </div>
              <strong>{item.total ? `${Math.round((item.score / item.total) * 100)}%` : 'Saved'}</strong>
            </div>
          ))}
          {recentSubmissions.map(item => (
            <div className="record-activity-row" key={`submission-${item.id}`}>
              <span className="record-dot skill-dot" />
              <div>
                <b>{item.skill} evidence</b>
                <small>
                  {new Date(item.createdAt).toLocaleString()} ·{' '}
                  {item.feedbackMode === 'self-review' ? 'Self-review' : 'Transcript fallback'}
                </small>
              </div>
              <strong>Saved</strong>
            </div>
          ))}
          {recentSessions.map(item => (
            <div className="record-activity-row" key={`session-${item.id}`}>
              <span className="record-dot time-dot" />
              <div>
                <b>{item.activity || 'Study session'}</b>
                <small>{new Date(item.startedAt).toLocaleString()}</small>
              </div>
              <strong>{item.minutes} min</strong>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted">Your saved practice, reflections and study time will appear here.</p>
      )}
    </section>
  )
}

function Heatmap({ s }: { s: Store }) {
  const map = minutesByDate(s.sessions)
  const key = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const today = new Date()
  const [selected, setSelected] = useState(key(today))
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const selectedDate = new Date(`${selected}T12:00:00`)
  const minutes = map[selected] || 0
  const goal = s.profile.dailyGoalMinutes || 0

  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
  const gridStart = new Date(month.getFullYear(), month.getMonth(), 1 - firstDay.getDay())
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)
    return date
  })
  const weeks = Array.from({ length: 6 }, (_, index) => days.slice(index * 7, index * 7 + 7))
  const move = (delta: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1))

  const attempts = s.attempts.filter(attempt => localDate(attempt.createdAt) === selected)
  const submissions = (s.submissions || []).filter(submission => localDate(submission.createdAt) === selected)
  const completed = attempts.length + submissions.length
  const skills = [
    ...new Set([...attempts.map(attempt => attempt.skill), ...submissions.map(submission => submission.skill)])
  ]

  return (
    <section className="panel heatmap-panel">
      <div className="heatmap-selected">
        <span className="eyebrow">SELECTED DATE</span>
        <h2>{selectedDate.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
      </div>
      <div className="heatmap-heading">
        <h3>{month.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h3>
        <div className="heatmap-nav">
          <button aria-label="Previous month" onClick={() => move(-1)}>
            <ChevronLeft size={18} />
          </button>
          <button aria-label="Next month" onClick={() => move(1)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="heatmap-calendar">
        <div className="weekday-labels">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="heatmap-grid">
          {weeks.map((week, weekIndex) => (
            <div className="heatmap-week" key={weekIndex}>
              {week.map(date => {
                const dateKey = key(date)
                const value = map[dateKey] || 0
                const outside = date.getMonth() !== month.getMonth()
                const rest = s.profile.daysOff.includes(dateKey)
                const dayAttempts = s.attempts.filter(attempt => localDate(attempt.createdAt) === dateKey)
                const daySubmissions = (s.submissions || []).filter(
                  submission => localDate(submission.createdAt) === dateKey
                )
                const dayCompleted = dayAttempts.length + daySubmissions.length
                return (
                  <button
                    key={dateKey}
                    aria-label={`${dateKey}: ${Math.round(value)} active minutes, ${dayCompleted} completed activities${rest ? ', planned rest day' : ''}`}
                    className={`heat l${heatLevel(value, goal)} ${outside ? 'outside-month' : ''} ${rest ? 'rest-day' : ''} ${selected === dateKey ? 'selected-day' : ''}`}
                    onClick={() => {
                      setSelected(dateKey)
                      if (outside) setMonth(new Date(date.getFullYear(), date.getMonth(), 1))
                    }}
                  >
                    {date.getDate()}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4, 5].map(level => (
          <i className={`heat l${level}`} key={level} aria-label={`Intensity ${level}`} />
        ))}
        <span>More active time</span>
      </div>
      <div className="heatmap-detail">
        <b>{selected}</b>
        <span>
          {Math.round(minutes)} active minutes{goal ? ` · ${Math.round((minutes / goal) * 100)}% of ${goal}-minute goal` : ''}
        </span>
        <span>{completed ? `${completed} completed activities · ${skills.join(', ')}` : 'No recorded activities'}</span>
        <span>{s.profile.daysOff.includes(selected) ? 'Planned rest day' : ''}</span>
      </div>
    </section>
  )
}

/**
 * Reading Practice with Topic Filtering and Retest Support
 */
function Practice({
  s,
  setS,
  note,
  targets
}: {
  s: Store
  setS: (store: Store) => void
  note: (message: string) => void
  targets: ReadingOccurrenceTarget[]
}) {
  const [topicFilter, setTopicFilter] = useState<TopicId | 'all'>('all')
  const [selectedPassageId, setSelectedPassageId] = useState<string>(passages[0].id)

  const practiceCount = s.attempts.filter(attempt => attempt.kind === 'practice').length
  const contexts = targets
    .map(target => {
      const error = s.errors.find(item => readingDifficultyId(item) === target.difficultyId)
      const occurrence = error?.occurrences?.find(item => stableOccurrenceId(error.id, item.id) === target.occurrenceId)
      const sourceQuestionId = error ? (occurrence?.questionId || (!error.occurrences?.length ? error.questionId : undefined)) : undefined
      const sourceQuestion = error && sourceQuestionId
        ? passages.find(item => item.id === error.passageId)?.questions.find(item => item.id === sourceQuestionId)
        : undefined
      return error && sourceQuestion ? { target, error, sourceQuestion } : undefined
    })
    .filter((context): context is NonNullable<typeof context> => Boolean(context))

  const retestContext = contexts[0]
  const isRetestMode = targets.length > 0

  const retestPassage = retestContext
    ? passages.find(p => p.id !== retestContext.error.passageId && p.questions.some(q => q.equivalenceKey && q.equivalenceKey === retestContext.sourceQuestion.equivalenceKey))
    : undefined

  const passage = isRetestMode
    ? retestPassage
    : passages.find(p => p.id === selectedPassageId) || passages[0]

  const filteredPassages = topicFilter === 'all'
    ? passages.filter(p => !p.id.includes('-retest'))
    : passages.filter(p => p.topicId === topicFilter && !p.id.includes('-retest'))

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [reflection, setReflection] = useState('')

  useEffect(() => {
    setAnswers({})
    setSubmitted(false)
    setReflection('')
  }, [passage?.id])

  if (!passage) {
    return (
      <section className="panel empty">
        <h2>Retest unavailable</h2>
        <p>No authored equivalent passage is available for this exact occurrence. The record remains unchanged.</p>
      </section>
    )
  }

  const score = scoreAttempt(passage.questions, answers)

  const submit = () => {
    const timestamp = new Date().toISOString()
    const responseTargets = isRetestMode && retestContext
      ? passage.questions.reduce<Record<string, ReadingOccurrenceTarget>>((map, q) => {
          if (Object.keys(map).length === 0 && q.equivalenceKey && q.equivalenceKey === retestContext.sourceQuestion.equivalenceKey) {
            map[q.id] = retestContext.target
          }
          return map
        }, {})
      : undefined

    const attempt: Attempt = {
      id: uid('attempt'),
      passageId: passage.id,
      skill: 'Reading',
      answers,
      score,
      total: passage.questions.length,
      kind: isRetestMode ? 'retest' : 'practice',
      createdAt: timestamp,
      objectiveIds: passage.questions.map(q => q.objective),
      responseTargets,
      reflection: reflection ? { nextStep: reflection } : undefined
    }

    const nextErrors = mergeAttemptErrors(s.errors, attempt, passage.questions)
    setS({
      ...s,
      attempts: [...s.attempts, attempt],
      errors: nextErrors,
      sessions: [
        ...s.sessions,
        {
          id: uid('session'),
          startedAt: timestamp,
          endedAt: timestamp,
          minutes: 0,
          activeIntervals: [],
          skill: 'Reading',
          activity: `${isRetestMode ? 'Retest' : 'Reading'} · ${passage.title}`
        }
      ]
    })
    setSubmitted(true)
    note(isRetestMode ? 'Retest evidence recorded.' : 'Reading attempt saved.')
  }

  return (
    <section className="stack">
      {!isRetestMode && (
        <section className="panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">CHỦ ĐỀ ĐỌC HIỂU (READING BY TOPIC)</span>
              <h2>Chọn bài đọc theo chủ đề</h2>
            </div>
            <span className="badge">{filteredPassages.length} bài luyện tập</span>
          </div>
          <TopicBar selected={topicFilter} onSelect={setTopicFilter} showAll={true} />
          <div className="passage-chips">
            {filteredPassages.map(p => (
              <button
                key={p.id}
                type="button"
                className={`passage-chip-btn ${p.id === passage.id ? 'active' : ''}`}
                onClick={() => setSelectedPassageId(p.id)}
              >
                <div className="passage-chip-top">
                  <span className="passage-chip-level">{p.level}</span>
                  <span className="date-pill" style={{ padding: '2px 8px', fontSize: '10px' }}>{p.minutes} phút</span>
                </div>
                <span className="passage-chip-title">{p.title}</span>
                <div className="passage-chip-meta">
                  <span>{p.topicTitle || 'General'}</span>
                  <span>•</span>
                  <span>{p.questions.length} câu hỏi</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {isRetestMode && retestContext && (
        <section className="panel callout">
          <b>Targeted Retest Mode:</b> Addressing previously opened objective <em>"{retestContext.error.objective}"</em> from {retestContext.error.passageId}.
        </section>
      )}

      <div className="practice-layout">
        <section className="panel passage">
          <div className="panel-title">
            <span className="eyebrow">{passage.topicTitle ? passage.topicTitle.toUpperCase() : 'READING'} · {passage.level}</span>
            <span className="date-pill">{passage.minutes} min target</span>
          </div>
          <h2>{passage.title}</h2>
          {passage.text.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>

        <section className="panel questions">
          <h2>Questions ({passage.questions.length})</h2>
          {passage.questions.map((q, index) => (
            <div className="question" key={q.id}>
              <div className="question-top">
                <b>{index + 1}</b>
                <span>{q.type.toUpperCase()} · {q.objective}</span>
              </div>
              <h3>{q.prompt}</h3>
              <div className="options">
                {q.options.map(option => (
                  <label key={option} className={answers[q.id] === option ? 'chosen' : ''}>
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === option}
                      onChange={() => setAnswers({ ...answers, [q.id]: option })}
                      disabled={submitted}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {submitted && (
                <div className={`feedback ${answers[q.id] === q.answer ? 'correct' : 'incorrect'}`}>
                  <b>{answers[q.id] === q.answer ? '✓ Correct' : '✗ Incorrect'}</b>
                  <span>Correct answer: {q.answer}</span>
                  <small>{q.explanation}</small>
                </div>
              )}
            </div>
          ))}

          {!submitted ? (
            <button
              className="primary full"
              disabled={Object.keys(answers).length < passage.questions.length}
              onClick={submit}
            >
              Submit answers ({Object.keys(answers).length}/{passage.questions.length})
            </button>
          ) : (
            <div className="result">
              <div className="score-circle">
                <b>{score}/{passage.questions.length}</b>
                <span>{Math.round((score / passage.questions.length) * 100)}%</span>
              </div>
              <p className="muted">Attempt saved to Learning Record and Error Memory.</p>
              <div className="reflection">
                <label className="field-label">
                  Strategy Reflection (Optional)
                  <textarea
                    placeholder="Note what strategy worked or what misled you..."
                    value={reflection}
                    onChange={e => setReflection(e.target.value)}
                  />
                </label>
              </div>
            </div>
          )}
        </section>
      </div>
    </section>
  )
}

type SimulationSkill = 'Listening' | 'Reading' | 'Writing' | 'Speaking'
type SimulationQuestion = { id: string; prompt: string; options: string[]; answer: string; explanation: string }

const SIMULATION_QUESTIONS: Record<'Listening' | 'Reading', SimulationQuestion[]> = {
  Listening: TOPICS[0].listening.questions.map(q => ({ id: q.id, prompt: q.prompt, options: q.options, answer: q.answer, explanation: q.explanation })),
  Reading: passages[0].questions.map(q => ({ id: q.id, prompt: q.prompt, options: q.options, answer: q.answer, explanation: q.explanation }))
}

function IELTSSimulation({ s, setS, note }: { s: Store; setS: (store: Store) => void; note: (message: string) => void }) {
  const [skill, setSkill] = useState<SimulationSkill>('Listening')
  const [started, setStarted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [seconds, setSeconds] = useState(30 * 60)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [response, setResponse] = useState('')
  const questions = SIMULATION_QUESTIONS[skill === 'Reading' ? 'Reading' : 'Listening']
  const timeLimit = skill === 'Reading' ? 60 * 60 : skill === 'Writing' ? 60 * 60 : skill === 'Speaking' ? 14 * 60 : 30 * 60

  useEffect(() => {
    if (!started || submitted || seconds <= 0) return
    const timer = window.setInterval(() => setSeconds(value => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [started, submitted, seconds])

  const selectSkill = (next: SimulationSkill) => {
    setSkill(next); setStarted(false); setSubmitted(false); setSeconds(next === 'Reading' ? 3600 : next === 'Writing' ? 3600 : next === 'Speaking' ? 840 : 1800); setAnswers({}); setResponse('')
  }
  const start = () => { setStarted(true); setSubmitted(false); setSeconds(timeLimit); setAnswers({}); setResponse('') }
  const score = questions.filter(q => answers[q.id] === q.answer).length
  const submit = () => {
    setSubmitted(true)
    const now = new Date().toISOString()
    const evidence = skill === 'Reading' || skill === 'Listening' ? `${skill} simulation: ${score}/${questions.length}` : `${skill} simulation: self-review submitted`
    setS({ ...s, submissions: [...(s.submissions || []), { id: uid('submission'), skill, activityId: `simulation-${skill.toLowerCase()}`, response: response || evidence, createdAt: now, feedbackMode: skill === 'Listening' ? 'transcript-fallback' : 'self-review', completed: true }] })
    note('Simulation đã được lưu vào Learning Record.')
  }
  const playAudio = () => { if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(TOPICS[0].listening.audioText); u.lang = 'en-US'; window.speechSynthesis.speak(u) } }
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const secs = (seconds % 60).toString().padStart(2, '0')

  return <section className="stack">
    <section className="panel simulator-hero">
      <span className="eyebrow">IELTS COMPUTER-STYLE SIMULATION</span><h2>Phòng thi mô phỏng</h2>
      <p className="muted">Nội dung tự biên soạn theo format IELTS: timer, media, câu hỏi, nộp bài và review. Đề gốc bên ngoài không được sao chép vào ứng dụng.</p>
      <div className="study-modes">{(['Listening', 'Reading', 'Writing', 'Speaking'] as SimulationSkill[]).map(item => <button key={item} className={`mode-tab ${skill === item ? 'active' : ''}`} onClick={() => selectSkill(item)}>{item}</button>)}</div>
    </section>
    {!started ? <section className="panel simulator-start">
      <div className="simulator-spec"><b>{skill}</b><span>{skill === 'Listening' ? '4 parts · 40 questions · 30 minutes' : skill === 'Reading' ? '3 passages · 40 questions · 60 minutes' : skill === 'Writing' ? 'Task 1 + Task 2 · 60 minutes' : 'Part 1 + Part 2 + Part 3 · 11–14 minutes'}</span></div>
      <p className="muted">Bản demo hiện dùng một module nội bộ có media và câu hỏi thật trong app. Các module tiếp theo sẽ nối vào cùng test runner này.</p><button className="primary" onClick={start}>Bắt đầu simulation</button>
    </section> : <section className="panel simulator-shell">
      <div className="simulator-toolbar"><span className="badge">{skill} · {submitted ? 'Review' : 'In progress'}</span><strong className={seconds < 60 ? 'status' : ''}>⏱ {minutes}:{secs}</strong>{!submitted && <button className="danger" onClick={submit}>Nộp bài</button>}</div>
      {skill === 'Listening' && <div className="media-stage"><h3>Part 1 · Everyday conversation</h3><p className="muted">Nghe một lần như phòng thi. Không hiện transcript cho đến khi nộp.</p><button className="primary" onClick={playAudio}>▶ Play audio</button><details><summary>Transcript sau khi nộp</summary><p className="callout">{submitted ? TOPICS[0].listening.audioText : 'Transcript sẽ mở sau khi nộp bài.'}</p></details></div>}
      {skill === 'Reading' && <div className="reading-stage"><h3>{passages[0].title}</h3>{passages[0].text.split('\n\n').slice(0, 2).map(p => <p key={p}>{p}</p>)}</div>}
      {skill === 'Writing' && <div className="writing-stage"><h3>Task 1 · Academic report</h3><p className="callout">The chart below compares participation in three university clubs in 2005 and 2025. Summarise the information by selecting and reporting the main features.</p><svg viewBox="0 0 420 180" role="img" aria-label="Bar chart comparing university club participation"><line x1="45" y1="145" x2="390" y2="145" stroke="currentColor"/><rect x="80" y="65" width="34" height="80" fill="#92dcaa"/><rect x="120" y="42" width="34" height="103" fill="#f4c878"/><rect x="210" y="88" width="34" height="57" fill="#92dcaa"/><rect x="250" y="72" width="34" height="73" fill="#f4c878"/><rect x="340" y="105" width="34" height="40" fill="#92dcaa"/><rect x="380" y="55" width="34" height="90" fill="#f4c878"/><text x="74" y="165" fill="currentColor">Science</text><text x="205" y="165" fill="currentColor">Arts</text><text x="335" y="165" fill="currentColor">Sports</text></svg></div>}
      {skill === 'Speaking' && <div className="speaking-stage"><h3>Part 2 · Cue card</h3><p className="callout">Describe a skill you learned that was useful in your studies or work. You should say what it was, how you learned it, and explain why it was useful.</p><p className="muted">Use the response box as a transcript or outline, then record yourself separately if your browser supports a microphone.</p></div>}
      {(skill === 'Listening' || skill === 'Reading') && <div className="simulation-questions">{questions.map((q, index) => <div className="question" key={q.id}><h3>{index + 1}. {q.prompt}</h3><div className="options">{q.options.map(option => <label key={option} className={answers[q.id] === option ? 'chosen' : ''}><input type="radio" name={q.id} checked={answers[q.id] === option} onChange={() => setAnswers({ ...answers, [q.id]: option })} disabled={submitted}/><span>{option}</span></label>)}</div>{submitted && <div className="feedback"><b>{answers[q.id] === q.answer ? '✓ Correct' : '✗ Review'}</b><small>{q.explanation}</small></div>}</div>)}</div>}
      {(skill === 'Writing' || skill === 'Speaking') && <textarea className="skill-response simulator-response" value={response} onChange={event => setResponse(event.target.value)} disabled={submitted} placeholder={skill === 'Writing' ? 'Viết câu trả lời Task 1/Task 2 tại đây…' : 'Dán transcript hoặc ghi chú câu trả lời…'} />}
      {submitted && <div className="result"><h3>{skill === 'Listening' || skill === 'Reading' ? `Score: ${score}/${questions.length}` : 'Bài đã nộp — chuyển sang self-review'}</h3><button className="secondary" onClick={() => selectSkill(skill)}>Làm lại module</button></div>}
    </section>}
  </section>
}

/**
 * Listening, Writing, and Speaking with Topic-organized Units
 */
function SkillPractice({
  s,
  setS,
  note,
  skill
}: {
  s: Store
  setS: (store: Store) => void
  note: (message: string) => void
  skill: 'Listening' | 'Writing' | 'Speaking'
}) {
  const [selectedTopicId, setSelectedTopicId] = useState<TopicId>('education')
  const currentTopic = TOPICS.find(t => t.id === selectedTopicId) || TOPICS[0]

  // Writing state
  const [writingTaskType, setWritingTaskType] = useState<'task1' | 'task2'>('task2')

  // Speaking state
  const [speakingPart, setSpeakingPart] = useState<'part1' | 'part2' | 'part3'>('part2')
  const [prepSeconds, setPrepSeconds] = useState(60)
  const [prepActive, setPrepActive] = useState(false)

  // Common audio / draft states
  const activityId = `${skill.toLowerCase()}-${selectedTopicId}-${skill === 'Writing' ? writingTaskType : skill === 'Speaking' ? speakingPart : 'unit'}`
  const draft = s.drafts?.find(item => item.activityId === activityId)?.content || ''
  const [response, setResponse] = useState(draft)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState('')
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState('')
  const [recordingError, setRecordingError] = useState('')
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [showQuizResult, setShowQuizResult] = useState(false)

  const recorder = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    setResponse(draft)
    setProgress(0)
    setQuizAnswers({})
    setShowQuizResult(false)
    setPrepActive(false)
    setPrepSeconds(60)
  }, [activityId, draft])

  useEffect(() => {
    let timer: any
    if (prepActive && prepSeconds > 0) {
      timer = setInterval(() => setPrepSeconds(prev => prev - 1), 1000)
    } else if (prepSeconds === 0) {
      setPrepActive(false)
    }
    return () => clearInterval(timer)
  }, [prepActive, prepSeconds])

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const updateResponse = (value: string) => {
    setResponse(value)
    if (skill === 'Writing' || skill === 'Speaking') {
      setS({
        ...s,
        drafts: [
          ...(s.drafts || []).filter(item => item.activityId !== activityId),
          { id: `draft-${activityId}`, skill, activityId, content: value, updatedAt: new Date().toISOString() }
        ]
      })
    }
  }

  // Audio player methods for Listening
  const playGeneratedAudio = () => {
    if (!('speechSynthesis' in window)) {
      return note('Speech audio is not supported in this browser. Use the transcript fallback.')
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(currentTopic.listening.audioText)
    utterance.lang = 'en-US'
    utterance.rate = Math.min(1.05, playbackSpeed * 0.94)
    utterance.pitch = 0.98
    const preferredVoice = window.speechSynthesis.getVoices().find(voice =>
      /^en(-|_)/i.test(voice.lang) && /Google|Microsoft|Samantha|Alex|Daniel|Karen/i.test(voice.name)
    ) || window.speechSynthesis.getVoices().find(voice => /^en(-|_)/i.test(voice.lang))
    if (preferredVoice) utterance.voice = preferredVoice
    utterance.onstart = () => {
      setIsPlaying(true)
      setProgress(0)
    }
    utterance.onboundary = event => {
      setProgress(Math.min(100, Math.round((event.charIndex / currentTopic.listening.audioText.length) * 100)))
    }
    utterance.onend = () => {
      setIsPlaying(false)
      setProgress(100)
    }
    utterance.onerror = () => {
      setIsPlaying(false)
      note('Audio playback error. Transcript fallback remains available.')
    }
    window.speechSynthesis.speak(utterance)
  }

  const pauseGeneratedAudio = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause()
      setIsPlaying(false)
    }
  }

  const resumeGeneratedAudio = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
      setIsPlaying(true)
    }
  }

  // Audio recording methods for Speaking
  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) throw new Error('unsupported')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const chunks: Blob[] = []
      const next = new MediaRecorder(stream)
      next.ondataavailable = event => {
        if (event.data.size) chunks.push(event.data)
      }
      next.onstop = () => {
        setAudioUrl(URL.createObjectURL(new Blob(chunks, { type: next.mimeType || 'audio/webm' })))
        stream.getTracks().forEach(track => track.stop())
      }
      next.start()
      recorder.current = next
      setRecording(true)
      setRecordingError('')
    } catch {
      setRecordingError('Recording unavailable. You can paste a transcript or speaking notes instead.')
    }
  }

  const stopRecording = () => {
    recorder.current?.stop()
    recorder.current = null
    setRecording(false)
  }

  const wordCount = response.trim() ? response.trim().split(/\s+/).length : 0

  const feedback =
    skill === 'Writing'
      ? [
          wordCount >= 140
            ? 'Task coverage: response length meets standard practice targets.'
            : 'Task coverage: expand the response toward the 150-word (Task 1) or 250-word (Task 2) target.',
          /however|therefore|consequently|furthermore|in contrast|nevertheless/i.test(response)
            ? 'Coherence: linking transitions identified.'
            : 'Coherence: incorporate clear transitions between argumentative points.',
          /\b(the|a|an)\b/i.test(response)
            ? 'Grammar: articles present; verify accuracy in complex noun phrases.'
            : 'Grammar: check article usage.',
          new RegExp(currentTopic.vocab.map(v => v.term.split(' ')[0]).join('|'), 'i').test(response)
            ? 'Lexical Resource: topic vocabulary collocations detected!'
            : `Lexical Resource: incorporate collocations from the ${currentTopic.titleEn} lexicon bank below.`
        ]
      : []

  const submit = () => {
    const savedResponse = response.trim() || (audioUrl ? '[Browser recording saved for playback; no transcript supplied.]' : '')
    if (!savedResponse) return note('Add a response or recording before saving.')
    const submission = {
      id: uid('submission'),
      skill,
      activityId,
      response: savedResponse,
      createdAt: new Date().toISOString(),
      feedbackMode: skill === 'Listening' ? ('transcript-fallback' as const) : ('self-review' as const),
      completed: true
    }
    setS({
      ...s,
      submissions: [...(s.submissions || []), submission],
      sessions: [
        ...s.sessions,
        {
          id: uid('session'),
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          minutes: 15,
          skill,
          activity: `${skill} · ${currentTopic.titleEn}`
        }
      ]
    })
    note(`${skill} evidence saved to Learning Record.`)
  }

  const history = (s.submissions || []).filter(item => item.skill === skill && item.activityId.includes(selectedTopicId)).slice().reverse()

  return (
    <section className="stack">
      <section className="panel">
        <span className="eyebrow">{skill.toUpperCase()} · THEMATIC STUDY UNITS</span>
        <h2>Chọn chủ đề ôn tập ({skill})</h2>
        <TopicBar selected={selectedTopicId} onSelect={id => id !== 'all' && setSelectedTopicId(id)} />
        <TopicHeader topic={currentTopic} />
      </section>

      <SkillRoadmap skill={skill} />

      {/* LISTENING SPECIFIC VIEW */}
      {skill === 'Listening' && (
        <section className="panel">
          <div className="panel-title">
            <div>
              <span className="badge">{currentTopic.listening.level}</span>
              <h3>{currentTopic.listening.title}</h3>
            </div>
            <span className="date-pill">{currentTopic.listening.durationMinutes} min audio exercise</span>
          </div>

          <div className="audio-controls">
            <button className="secondary" onClick={playGeneratedAudio}>
              <Play size={14} /> Play fallback voice
            </button>
            <a className="secondary audio-source-link" href="https://takeielts.britishcouncil.org/prepare/ielts-free-practice-mock-tests/academic/listening" target="_blank" rel="noreferrer">Mở official natural recording ↗</a>
            <button className="secondary" onClick={pauseGeneratedAudio}>
              <Pause size={14} /> Pause
            </button>
            <button className="secondary" onClick={resumeGeneratedAudio}>
              Resume
            </button>
            <progress max="100" value={progress} aria-label="Audio progress" />
            <select
              value={playbackSpeed}
              onChange={e => setPlaybackSpeed(parseFloat(e.target.value))}
              aria-label="Speed"
              style={{ background: '#18241f', color: '#e7f3e9', border: '1px solid #2e3d37', borderRadius: '6px', padding: '6px' }}
            >
              <option value="0.9">0.9x Speed</option>
              <option value="1.0">1.0x Normal</option>
              <option value="1.15">1.15x Fast</option>
            </select>
            {isPlaying && <span className="muted">Playing audio…</span>}
          </div>
          <div className="audio-upload-box">
            <label htmlFor="listening-audio-upload"><b>Audio tự nhiên</b><span> Ưu tiên recording người thật từ nguồn official hoặc file luyện tập của bạn.</span></label>
            <input id="listening-audio-upload" type="file" accept="audio/*" onChange={event => {
              const file = event.target.files?.[0]
              if (file) setUploadedAudioUrl(URL.createObjectURL(file))
            }} />
            {uploadedAudioUrl && <audio controls src={uploadedAudioUrl} aria-label="Uploaded natural listening audio" />}
          </div>

          <details style={{ margin: '14px 0' }}>
            <summary style={{ cursor: 'pointer', color: 'var(--mint)', fontWeight: 600 }}>
              Hiện phụ đề bài nghe (Transcript fallback)
            </summary>
            <p className="callout" style={{ marginTop: '8px' }}>
              {currentTopic.listening.audioText}
            </p>
          </details>

          {/* Listening Comprehension Check */}
          <div style={{ marginTop: '20px', borderTop: '1px solid #2e3d37', paddingTop: '16px' }}>
            <h4>Kiểm tra mức độ nghe hiểu ({currentTopic.listening.questions.length} câu)</h4>
            {currentTopic.listening.questions.map((q, qIndex) => (
              <div key={q.id} style={{ margin: '12px 0', padding: '12px', background: '#131f1a', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 8px', fontWeight: 600 }}>
                  {qIndex + 1}. {q.prompt}
                </p>
                <div className="options">
                  {q.options.map(opt => (
                    <label key={opt} className={quizAnswers[q.id] === opt ? 'chosen' : ''}>
                      <input
                        type="radio"
                        name={q.id}
                        checked={quizAnswers[q.id] === opt}
                        onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: opt })}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                {showQuizResult && (
                  <div className={`feedback ${quizAnswers[q.id] === q.answer ? 'correct' : 'incorrect'}`} style={{ marginTop: '8px' }}>
                    <b>{quizAnswers[q.id] === q.answer ? '✓ Đúng' : '✗ Chưa đúng'}</b>
                    <span>Đáp án: {q.answer}</span>
                    <small>{q.explanation}</small>
                  </div>
                )}
              </div>
            ))}
            <button className="secondary" onClick={() => setShowQuizResult(true)}>
              Kiểm tra đáp án nghe hiểu
            </button>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h4>Ghi chú & Tóm tắt ý bài nghe</h4>
            <textarea
              className="skill-response"
              aria-label="Listening notes"
              value={response}
              onChange={event => updateResponse(event.target.value)}
              placeholder="Ghi chú các ý chính, từ vựng và chi tiết nghe được vào đây..."
            />
            <p className="muted">{wordCount} từ đã nhập · Bản nháp tự động lưu trên trình duyệt</p>
            <button className="primary" onClick={submit}>
              Lưu minh chứng vào Learning Record
            </button>
          </div>
        </section>
      )}

      {/* WRITING SPECIFIC VIEW */}
      {skill === 'Writing' && (
        <section className="panel">
          <div className="study-modes">
            <button
              className={`mode-tab ${writingTaskType === 'task1' ? 'active' : ''}`}
              onClick={() => setWritingTaskType('task1')}
            >
              Task 1 (Báo cáo số liệu / Biểu đồ)
            </button>
            <button
              className={`mode-tab ${writingTaskType === 'task2' ? 'active' : ''}`}
              onClick={() => setWritingTaskType('task2')}
            >
              Task 2 (Bài luận quan điểm / Thảo luận)
            </button>
          </div>

          {writingTaskType === 'task1' ? (
            <div>
              <span className="badge">{currentTopic.writing.task1.chartType}</span>
              <h3>{currentTopic.writing.task1.title}</h3>
              <p className="callout">{currentTopic.writing.task1.prompt}</p>
              <div className="writing-chart-card">
                <svg viewBox="0 0 520 230" role="img" aria-label="Bar chart for Academic Writing Task 1 practice">
                  <line x1="58" y1="185" x2="490" y2="185" stroke="currentColor" />
                  <line x1="58" y1="25" x2="58" y2="185" stroke="currentColor" />
                  {[0, 25, 50, 75, 100].map(value => <g key={value}><line x1="53" y1={185 - value * 1.6} x2="58" y2={185 - value * 1.6} stroke="currentColor" /><text x="20" y={189 - value * 1.6} fill="currentColor">{value}</text></g>)}
                  {[['Science', 54, 84], ['Arts', 38, 59], ['Sports', 27, 68]].map(([label, oldValue, newValue], index) => <g key={label}><rect x={100 + index * 125} y={185 - Number(oldValue) * 1.6} width="36" height={Number(oldValue) * 1.6} fill="#92dcaa" /><rect x={140 + index * 125} y={185 - Number(newValue) * 1.6} width="36" height={Number(newValue) * 1.6} fill="#f4c878" /><text x={98 + index * 125} y="208" fill="currentColor">{label}</text></g>)}
                </svg>
                <div className="chart-legend"><span><i className="legend-swatch old" />2005</span><span><i className="legend-swatch recent" />2025</span></div>
              </div>
            </div>
          ) : (
            <div>
              <span className="badge">{currentTopic.writing.task2.essayType}</span>
              <h3>{currentTopic.writing.task2.title}</h3>
              <p className="callout">{currentTopic.writing.task2.prompt}</p>
              <div style={{ margin: '12px 0' }}>
                <b>Gợi ý dàn bài (Outline suggestions):</b>
                {currentTopic.writing.task2.outlineIdeas.map((idea, i) => (
                  <p key={i} className="muted" style={{ margin: '4px 0' }}>• {idea}</p>
                ))}
              </div>
            </div>
          )}

          {/* Lexicon bank drawer inspired by ForumFlash */}
          <div className="topic-lexicon-helper">
            <div className="topic-lexicon-title">
              <span>BỘ TỪ & COLLOCATION GỢI Ý (THEMATIC LEXICON)</span>
              <small>Nhấp để tham khảo hoặc thêm vào bài viết</small>
            </div>
            <div className="lexicon-chip-cloud">
              {currentTopic.vocab.map(item => (
                <span
                  key={item.id}
                  className="lexicon-chip"
                  title={`${item.ipa} — ${item.meaningVi}`}
                  onClick={() => updateResponse(response ? `${response} ${item.term}` : item.term)}
                >
                  + {item.term} ({item.meaningVi})
                </span>
              ))}
            </div>
          </div>

          <textarea
            className="skill-response"
            aria-label="Writing response"
            style={{ minHeight: '220px' }}
            value={response}
            onChange={event => updateResponse(event.target.value)}
            placeholder="Viết bài luận của bạn tại đây..."
          />
          <p className="muted">
            {wordCount} từ · {response.split('\n\n').filter(Boolean).length} đoạn văn · Tự động lưu nháp
          </p>

          {feedback.length > 0 && (
            <div className="callout" style={{ margin: '12px 0' }}>
              <b>Chỉ dẫn tự rà soát (Revision Cues):</b>
              {feedback.map((line, i) => (
                <span className="feedback-line" key={i}>{line}</span>
              ))}
            </div>
          )}

          <button className="primary" onClick={submit}>
            Lưu bài viết vào Learning Record
          </button>
        </section>
      )}

      {/* SPEAKING SPECIFIC VIEW */}
      {skill === 'Speaking' && (
        <section className="panel">
          <div className="study-modes">
            <button
              className={`mode-tab ${speakingPart === 'part1' ? 'active' : ''}`}
              onClick={() => setSpeakingPart('part1')}
            >
              Part 1 (Phỏng vấn ngắn)
            </button>
            <button
              className={`mode-tab ${speakingPart === 'part2' ? 'active' : ''}`}
              onClick={() => setSpeakingPart('part2')}
            >
              Part 2 (Cue Card & Nói 2 phút)
            </button>
            <button
              className={`mode-tab ${speakingPart === 'part3' ? 'active' : ''}`}
              onClick={() => setSpeakingPart('part3')}
            >
              Part 3 (Thảo luận chuyên sâu)
            </button>
          </div>

          {speakingPart === 'part1' && (
            <div>
              <h3>Part 1 Questions — {currentTopic.titleEn}</h3>
              {currentTopic.speaking.part1.map((question, i) => (
                <div key={i} className="callout" style={{ margin: '8px 0' }}>
                  <b>Câu hỏi {i + 1}:</b> {question}
                </div>
              ))}
            </div>
          )}

          {speakingPart === 'part2' && (
            <div>
              <h3>Part 2 Cue Card — {currentTopic.titleEn}</h3>
              <div className="panel" style={{ background: '#121e18', border: '1px solid #365342' }}>
                <p style={{ fontStyle: 'italic', color: 'var(--mint)', fontWeight: 600 }}>
                  {currentTopic.speaking.part2.cueCard}
                </p>
                <p style={{ margin: '8px 0 4px', fontWeight: 600 }}>You should say:</p>
                <ul>
                  {currentTopic.speaking.part2.bulletPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
                <p className="muted">Follow-up: {currentTopic.speaking.part2.followUp}</p>
              </div>

              {/* 1-Minute Prep Timer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '14px 0' }}>
                <span className="badge">1-Minute Prep Timer: {prepSeconds}s</span>
                <button
                  className="secondary"
                  onClick={() => {
                    setPrepActive(!prepActive)
                    if (prepSeconds === 0) setPrepSeconds(60)
                  }}
                >
                  {prepActive ? 'Tạm dừng chuẩn bị' : prepSeconds === 60 ? 'Bắt đầu 1 phút chuẩn bị' : 'Tiếp tục'}
                </button>
              </div>
            </div>
          )}

          {speakingPart === 'part3' && (
            <div>
              <h3>Part 3 Two-way Discussion — {currentTopic.titleEn}</h3>
              {currentTopic.speaking.part3.map((q, i) => (
                <div key={i} className="callout" style={{ margin: '8px 0' }}>
                  <b>Thảo luận {i + 1}:</b> {q}
                </div>
              ))}
            </div>
          )}

          {/* Useful Collocations for Speaking */}
          <div className="topic-lexicon-helper">
            <div className="topic-lexicon-title">
              <span>CỤM TỪ & COLLOCATION NÓI NÊN DÙNG</span>
            </div>
            <div className="lexicon-chip-cloud">
              {currentTopic.speaking.collocations.map((colloc, i) => (
                <span key={i} className="card-colloc-tag">
                  {colloc}
                </span>
              ))}
            </div>
          </div>

          {/* Browser Audio Recorder */}
          <div style={{ margin: '18px 0', borderTop: '1px solid #2e3d37', paddingTop: '16px' }}>
            <div className="error-actions">
              <button className={recording ? 'danger' : 'secondary'} onClick={recording ? stopRecording : startRecording}>
                {recording ? 'Dừng ghi âm' : 'Bật ghi âm luyện nói (Mic)'}
              </button>
              {audioUrl && <audio controls src={audioUrl} aria-label="Recorded speaking response" />}
            </div>
            {recordingError && <p className="status">{recordingError}</p>}
          </div>

          <textarea
            className="skill-response"
            aria-label="Speaking transcript or notes"
            value={response}
            onChange={event => updateResponse(event.target.value)}
            placeholder="Dán bản gõ lời nói (transcript) hoặc dàn ý trả lời của bạn vào đây..."
          />
          <button className="primary" onClick={submit}>
            Lưu minh chứng luyện nói
          </button>
        </section>
      )}

      {/* History */}
      <section className="panel">
        <h3>Minh chứng đã lưu ({skill} · {currentTopic.titleEn})</h3>
        {history.length ? (
          history.map(item => (
            <details className="list-row" key={item.id}>
              <summary>
                <b>{new Date(item.createdAt).toLocaleString()}</b>
                <span>{item.feedbackMode === 'transcript-fallback' ? 'Audio · Ghi chú' : 'Minh chứng tự luyện'}</span>
              </summary>
              <p style={{ marginTop: '8px', color: '#c5d3ca' }}>{item.response}</p>
            </details>
          ))
        ) : (
          <p className="muted">Chưa có bài lưu nào cho chủ đề này.</p>
        )}
      </section>
    </section>
  )
}

/**
 * Vocabulary Study Hub (Inspired by ForumFlash https://forumflash.vercel.app/#study)
 * Offers 4 study modes: Flashcard, Learn, Quiz, and Error Memory
 */
function VocabularyHub({
  s,
  setS,
  note
}: {
  s: Store
  setS: (store: Store) => void
  note: (message: string) => void
}) {
  const [selectedTopicId, setSelectedTopicId] = useState<TopicId>('education')
  const [mode, setMode] = useState<'flashcard' | 'learn' | 'quiz' | 'errors'>('flashcard')
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  // Persistent learned set from localStorage
  const [knownWords, setKnownWords] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('ielts-optimizer-vocab-known')
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  // Quiz states
  const [quizIndex, setQuizIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)

  const currentTopic = TOPICS.find(t => t.id === selectedTopicId) || TOPICS[0]
  const vocabList = currentTopic.vocab
  const currentWord = vocabList[cardIndex % vocabList.length]

  useEffect(() => {
    setCardIndex(0)
    setFlipped(false)
    setQuizIndex(0)
    setSelectedOption(null)
    setQuizScore(0)
    setQuizFinished(false)
  }, [selectedTopicId])

  const speak = (term: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(term)
      u.lang = 'en-US'
      window.speechSynthesis.speak(u)
    } else {
      note('Phát âm không được hỗ trợ trên trình duyệt này.')
    }
  }

  const markKnown = (wordId: string, isKnown: boolean) => {
    const next = { ...knownWords, [wordId]: isKnown }
    setKnownWords(next)
    localStorage.setItem('ielts-optimizer-vocab-known', JSON.stringify(next))
    if (isKnown) {
      note(`Đã ghi nhớ: "${currentWord.term}"`)
    }
    // Advance to next card
    if (cardIndex < vocabList.length - 1) {
      setCardIndex(cardIndex + 1)
      setFlipped(false)
    }
  }

  const knownCountInTopic = vocabList.filter(item => knownWords[item.id]).length
  const progressPercent = Math.round((knownCountInTopic / vocabList.length) * 100)

  // Quiz options generation
  const currentQuizWord = vocabList[quizIndex % vocabList.length]
  const quizOptions = (() => {
    if (!currentQuizWord) return []
    const correct = currentQuizWord.meaningVi
    const distractors = vocabList
      .filter(w => w.id !== currentQuizWord.id)
      .map(w => w.meaningVi)
      .slice(0, 3)
    return [correct, ...distractors].sort((a, b) => a.localeCompare(b))
  })()

  const handleQuizAnswer = (opt: string) => {
    if (selectedOption !== null) return
    setSelectedOption(opt)
    if (opt === currentQuizWord.meaningVi) {
      setQuizScore(quizScore + 1)
    }
  }

  const nextQuizQuestion = () => {
    if (quizIndex < vocabList.length - 1) {
      setQuizIndex(quizIndex + 1)
      setSelectedOption(null)
    } else {
      setQuizFinished(true)
    }
  }

  return (
    <section className="stack">
      <section className="panel">
        <span className="eyebrow">IELTS VOCABULARY ACCELERATOR (THEMATIC STUDY)</span>
        <h2>Từ vựng IELTS theo 8 chủ đề chuẩn</h2>
        <TopicBar selected={selectedTopicId} onSelect={id => id !== 'all' && setSelectedTopicId(id)} />
        <TopicHeader
          topic={currentTopic}
          extraBadge={
            <div className="topic-progress-badge">
              <span>Tiến độ chủ đề:</span>
              <b>{knownCountInTopic} / {vocabList.length} từ ({progressPercent}%)</b>
            </div>
          }
        />

        <div className="study-modes">
          <button
            className={`mode-tab ${mode === 'flashcard' ? 'active' : ''}`}
            onClick={() => setMode('flashcard')}
          >
            🎴 Lật thẻ (Flashcard)
          </button>
          <button
            className={`mode-tab ${mode === 'learn' ? 'active' : ''}`}
            onClick={() => setMode('learn')}
          >
            📖 Học từ & Đánh giá (Learn)
          </button>
          <button
            className={`mode-tab ${mode === 'quiz' ? 'active' : ''}`}
            onClick={() => setMode('quiz')}
          >
            🎯 Trắc nghiệm (Quiz)
          </button>
          <button
            className={`mode-tab ${mode === 'errors' ? 'active' : ''}`}
            onClick={() => setMode('errors')}
          >
            ⚠️ Bộ nhớ lỗi liên kết (Error Memory)
          </button>
        </div>
      </section>

      <SkillRoadmap skill="Vocabulary" />

      {/* MODE 1: FLASHCARD (Inspired by ForumFlash) */}
      {mode === 'flashcard' && currentWord && (
        <div className="flashcard-stage">
          <div
            className={`flashcard-box ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped(!flipped)}
            role="button"
            tabIndex={0}
            aria-label="Lật thẻ từ vựng"
          >
            <div className="card-top">
              <span className="card-tag">{currentWord.type}</span>
              <button
                className="card-speaker"
                aria-label="Phát âm"
                onClick={e => {
                  e.stopPropagation()
                  speak(currentWord.term)
                }}
              >
                <Volume2 size={16} />
              </button>
            </div>

            <div className="card-center">
              {!flipped ? (
                <>
                  <h3 className="card-term">{currentWord.term}</h3>
                  <div className="card-ipa">{currentWord.ipa}</div>
                  <div className="card-hint" style={{ marginTop: '22px' }}>
                    <RefreshCw size={13} /> Nhấp thẻ để xem nghĩa & ví dụ
                  </div>
                </>
              ) : (
                <>
                  <div className="card-meaning">{currentWord.meaningVi}</div>
                  <div className="card-example">“{currentWord.example}”</div>
                  {currentWord.collocations.length > 0 && (
                    <div className="card-collocs">
                      {currentWord.collocations.map((colloc, i) => (
                        <span key={i} className="card-colloc-tag">
                          + {colloc}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="card-top">
              <small className="muted">Thẻ {cardIndex + 1} / {vocabList.length}</small>
              <small style={{ color: 'var(--mint)' }}>{flipped ? 'Mặt sau (Nghĩa)' : 'Mặt trước (Từ)'}</small>
            </div>
          </div>

          <div className="learn-controls">
            <button
              className="nav-arrow"
              aria-label="Thẻ trước"
              disabled={cardIndex === 0}
              onClick={() => {
                setCardIndex(cardIndex - 1)
                setFlipped(false)
              }}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              className="nav-arrow"
              aria-label="Thẻ tiếp theo"
              disabled={cardIndex === vocabList.length - 1}
              onClick={() => {
                setCardIndex(cardIndex + 1)
                setFlipped(false)
              }}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: LEARN WITH REPETITION BUTTONS */}
      {mode === 'learn' && currentWord && (
        <div className="flashcard-stage">
          <div
            className={`flashcard-box ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="card-top">
              <span className="card-tag">{currentWord.type}</span>
              <button
                className="card-speaker"
                onClick={e => {
                  e.stopPropagation()
                  speak(currentWord.term)
                }}
              >
                <Volume2 size={16} />
              </button>
            </div>

            <div className="card-center">
              <h3 className="card-term">{currentWord.term}</h3>
              <div className="card-ipa">{currentWord.ipa}</div>
              <div className="card-meaning" style={{ marginTop: '12px' }}>
                {currentWord.meaningVi}
              </div>
              <div className="card-example">“{currentWord.example}”</div>
            </div>

            <div className="card-top">
              <small className="muted">Từ {cardIndex + 1} / {vocabList.length}</small>
              <small style={{ color: knownWords[currentWord.id] ? 'var(--green)' : '#ffa99c' }}>
                {knownWords[currentWord.id] ? '✓ Đã thuộc' : '○ Chưa thuộc'}
              </small>
            </div>
          </div>

          <div className="learn-controls">
            <button
              className="nav-arrow"
              disabled={cardIndex === 0}
              onClick={() => {
                setCardIndex(cardIndex - 1)
                setFlipped(false)
              }}
            >
              <ArrowLeft size={18} />
            </button>
            <button className="again-button" onClick={() => markKnown(currentWord.id, false)}>
              <RotateCcw size={15} /> Chưa thuộc
            </button>
            <button className="know-button" onClick={() => markKnown(currentWord.id, true)}>
              <Check size={16} /> Đã học thuộc
            </button>
            <button
              className="nav-arrow"
              disabled={cardIndex === vocabList.length - 1}
              onClick={() => {
                setCardIndex(cardIndex + 1)
                setFlipped(false)
              }}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* MODE 3: QUIZ */}
      {mode === 'quiz' && (
        <div className="quiz-stage">
          {!quizFinished ? (
            <>
              <div className="quiz-header">
                <span className="eyebrow">CÂU {quizIndex + 1} / {vocabList.length}</span>
                <span className="date-pill">Điểm hiện tại: {quizScore}</span>
              </div>
              <div className="quiz-term-box">
                <span className="card-tag">{currentQuizWord.type}</span>
                <h2>{currentQuizWord.term}</h2>
                <p className="card-ipa">{currentQuizWord.ipa}</p>
                <button
                  className="secondary"
                  style={{ marginTop: '8px' }}
                  onClick={() => speak(currentQuizWord.term)}
                >
                  <Volume2 size={14} /> Nghe phát âm
                </button>
              </div>

              <div className="quiz-options">
                {quizOptions.map(opt => {
                  let stateClass = ''
                  if (selectedOption !== null) {
                    if (opt === currentQuizWord.meaningVi) stateClass = 'correct'
                    else if (opt === selectedOption) stateClass = 'wrong'
                  }
                  return (
                    <button
                      key={opt}
                      className={`quiz-opt-btn ${stateClass}`}
                      disabled={selectedOption !== null}
                      onClick={() => handleQuizAnswer(opt)}
                    >
                      <span>{opt}</span>
                      {selectedOption !== null && opt === currentQuizWord.meaningVi && <span>✓</span>}
                    </button>
                  )
                })}
              </div>

              {selectedOption !== null && (
                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <button className="primary" onClick={nextQuizQuestion}>
                    {quizIndex < vocabList.length - 1 ? 'Câu tiếp theo →' : 'Hoàn thành bài kiểm tra'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="panel" style={{ textAlign: 'center', padding: '36px 20px' }}>
              <h2>Kết quả kiểm tra từ vựng</h2>
              <div className="score-circle" style={{ margin: '20px auto' }}>
                <b>{quizScore}/{vocabList.length}</b>
                <span>{Math.round((quizScore / vocabList.length) * 100)}%</span>
              </div>
              <p className="muted">Chủ đề: {currentTopic.titleEn}</p>
              <button
                className="secondary"
                onClick={() => {
                  setQuizIndex(0)
                  setQuizScore(0)
                  setSelectedOption(null)
                  setQuizFinished(false)
                }}
              >
                Làm lại bài kiểm tra
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 4: LINKED ERROR MEMORY */}
      {mode === 'errors' && (
        <ErrorDrill
          s={s}
          setS={setS}
          note={note}
          title="Vocabulary"
          filter={selectedTopicId}
        />
      )}
    </section>
  )
}

/**
 * Grammar Hub: IELTS Grammar Rules by Topic
 */
function GrammarHub({
  s,
  setS,
  note
}: {
  s: Store
  setS: (store: Store) => void
  note: (message: string) => void
}) {
  const [selectedTopicId, setSelectedTopicId] = useState<TopicId>('education')
  const currentTopic = TOPICS.find(t => t.id === selectedTopicId) || TOPICS[0]
  const [drillAnswers, setDrillAnswers] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  const saveGrammarReflection = (rule: GrammarRule) => {
    const text = drillAnswers[rule.id] || ''
    if (!text.trim()) return note('Vui lòng viết câu luyện tập trước khi lưu.')
    const submission = {
      id: uid('submission'),
      skill: 'Grammar' as const,
      activityId: `grammar-${rule.id}`,
      response: `[${rule.title}] ${text.trim()}`,
      createdAt: new Date().toISOString(),
      feedbackMode: 'self-review' as const,
      completed: true
    }
    setS({
      ...s,
      submissions: [...(s.submissions || []), submission],
      sessions: [
        ...s.sessions,
        {
          id: uid('session'),
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          minutes: 10,
          skill: 'Grammar',
          activity: `Grammar Drill · ${rule.title}`
        }
      ]
    })
    note('Đã lưu bài luyện ngữ pháp vào Learning Record.')
  }

  return (
    <section className="stack">
      <section className="panel">
        <span className="eyebrow">IELTS GRAMMAR MASTERY (THEMATIC STRUCTURES)</span>
        <h2>Ngữ pháp IELTS nâng cao theo từng chủ đề</h2>
        <TopicBar selected={selectedTopicId} onSelect={id => id !== 'all' && setSelectedTopicId(id)} />
        <TopicHeader topic={currentTopic} />
      </section>

      <SkillRoadmap skill="Grammar" />

      <div className="grammar-grid">
        {currentTopic.grammar.map(rule => (
          <div className="grammar-box" key={rule.id}>
            <div className="grammar-header">
              <h3>{rule.title}</h3>
              <span className="grammar-level">{rule.level}</span>
            </div>
            <p className="muted" style={{ margin: 0 }}>{rule.explanationVi}</p>
            <div className="grammar-formula">
              <strong>CÔNG THỨC:</strong> {rule.formula}
            </div>

            <div className="grammar-examples">
              <b>Ví dụ mẫu trong bài thi IELTS (Band 8.0+):</b>
              {rule.examples.map((ex, i) => (
                <div key={i} className="grammar-example-item">
                  • {ex}
                </div>
              ))}
            </div>

            <div className="grammar-drill">
              <b>Bài tập luyện tập (Drill):</b>
              <p style={{ margin: 0, fontStyle: 'italic', color: '#c3d8cb' }}>{rule.drillPrompt}</p>
              <textarea
                className="skill-response"
                style={{ minHeight: '80px', margin: '6px 0' }}
                placeholder="Nhập câu viết lại hoặc câu tự đặt của bạn..."
                value={drillAnswers[rule.id] || ''}
                onChange={e => setDrillAnswers({ ...drillAnswers, [rule.id]: e.target.value })}
              />
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  className="secondary"
                  onClick={() => setRevealed({ ...revealed, [rule.id]: !revealed[rule.id] })}
                >
                  {revealed[rule.id] ? 'Ẩn đáp án mẫu' : 'Xem đáp án mẫu'}
                </button>
                <button className="primary" onClick={() => saveGrammarReflection(rule)}>
                  Lưu bài luyện tập
                </button>
              </div>
              {revealed[rule.id] && (
                <div className="callout" style={{ marginTop: '8px' }}>
                  <b>Đáp án gợi ý:</b> {rule.sampleTransform}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ErrorDrill({
  s,
  setS,
  note,
  title,
  filter
}: {
  s: Store
  setS: (store: Store) => void
  note: (message: string) => void
  title: string
  filter: string
}) {
  const [reflection, setReflection] = useState('')
  const linked = s.errors.filter(error => `${error.objective} ${error.explanation}`.toLowerCase().includes(filter.toLowerCase()))
  const items = linked

  const review = (error: Store['errors'][number]) => {
    if (!reflection.trim()) return note('Write a correction rule before saving.')
    const skill = title as 'Vocabulary' | 'Grammar'
    const submission = {
      id: uid('submission'),
      skill,
      activityId: `${title.toLowerCase()}-error-${error.id}`,
      response: reflection.trim(),
      createdAt: new Date().toISOString(),
      feedbackMode: 'self-review' as const,
      completed: true
    }
    setS({
      ...s,
      errors: s.errors.map(item => (item.id === error.id ? { ...item, reviewCount: item.reviewCount + 1 } : item)),
      submissions: [...(s.submissions || []), submission]
    })
    setReflection('')
    note(`${title} review saved to Learning Record.`)
  }

  return (
    <section className="stack">
      <section className="panel">
        <span className="eyebrow">{title.toUpperCase()} · LINKED ERROR SUPPORT</span>
        <h2>{title} error drills</h2>
        <p className="muted">
          This local-first drill uses real learner Error Memory. It does not invent vocabulary or grammar errors when
          none have been recorded.
        </p>
      </section>
      {items.length ? (
        items.map(error => (
          <section className="panel error-card" key={error.id}>
            <span className="badge">{linked.includes(error) ? 'Linked match' : 'Available Reading error'}</span>
            <h3>{error.objective}</h3>
            <p>{error.explanation}</p>
            <p className="question-copy">
              Review prompt: explain why your answer differed from the evidence, then write one correction rule.
            </p>
            <textarea
              className="skill-response"
              aria-label={`${title} reflection for ${error.objective}`}
              value={reflection}
              onChange={event => setReflection(event.target.value)}
              placeholder="Your correction rule..."
            />
            <button className="secondary" onClick={() => review(error)}>
              Save review
            </button>
          </section>
        ))
      ) : (
        <section className="panel empty">
          <p>No learner errors are available yet for this filter.</p>
          <button className="secondary" onClick={() => note('Complete Reading practice first to create linked evidence.')}>
            How to start
          </button>
        </section>
      )}
    </section>
  )
}

function Errors({
  s,
  setS,
  openRetest,
  note,
  go
}: {
  s: Store
  setS: (store: Store) => void
  openRetest: (target: ReadingOccurrenceTarget) => void
  note: (message: string) => void
  go: (page: Page) => void
}) {
  const projection = deriveReadingStates(s.errors, s.attempts, passages)
  return (
    <section className="stack">
      <section className="panel">
        <h2>Error Review ({s.errors.length})</h2>
        <p className="muted">
          Evidence resolves open errors only when a new equivalent attempt demonstrates correct performance.
        </p>
      </section>
      {s.errors.length ? (
        s.errors.map(error => {
          const state = projection.statesByDifficulty[readingDifficultyId(error)]
          const target = targetFor(error)
          return (
            <section className="panel error-card" key={error.id}>
              <div className="error-head">
                <span className="badge">{error.type}</span>
                <span className={`status ${state?.status === 'resolved' ? 'good' : ''}`}>
                  {state?.status === 'resolved' ? 'Resolved by retest' : 'Open'}
                </span>
              </div>
              <h3>{error.objective}</h3>
              <p className="question-copy">{error.prompt || error.explanation}</p>
              <div className="explanation">
                <span>Learner answer: {error.learnerAnswer}</span>
                <span className="green-text">Evidence answer: {error.correctAnswer}</span>
                <small>{error.explanation}</small>
              </div>
              <div className="error-actions">
                <small>Reviewed {error.reviewCount} times</small>
                {state?.status === 'open' && target && (
                  <button className="primary" onClick={() => openRetest(target)}>
                    Retest now
                  </button>
                )}
                <button
                  className="secondary"
                  onClick={() => {
                    setS({
                      ...s,
                      errors: s.errors.map(item =>
                        item.id === error.id ? { ...item, reviewCount: item.reviewCount + 1 } : item
                      )
                    })
                    note('Error reviewed.')
                  }}
                >
                  Mark reviewed
                </button>
              </div>
            </section>
          )
        })
      ) : (
        <section className="panel empty">
          <p>No errors yet.</p>
          <button className="secondary" onClick={() => go('practice')}>
            Go to practice
          </button>
        </section>
      )}
    </section>
  )
}

function Plan({
  s,
  setS,
  note
}: {
  s: Store
  setS: (store: Store) => void
  note: (message: string) => void
}) {
  const projection = deriveReadingStates(s.errors, s.attempts, passages)
  const suggestion = recommendations(s.profile, s.attempts, s.errors, s.plan, projection.statesByDifficulty)

  const add = (source: 'manual' | 'recommended') => {
    const date = localDate(new Date().toISOString())
    if (s.profile.daysOff.includes(date)) return note('Today is a planned rest day. Choose another date in Profile.')
    const error = s.errors.find(item => projection.statesByDifficulty[readingDifficultyId(item)]?.status === 'open')
    const item: PlanItem = {
      id: uid('plan'),
      date,
      title: source === 'recommended' ? suggestion.title : 'Reading accuracy practice',
      skill: source === 'recommended' ? s.profile.priority : 'Reading',
      objective: error?.objective || 'Build learning evidence',
      minutes: s.profile.dailyGoalMinutes || 30,
      status: 'planned',
      source,
      reason: source === 'recommended' ? suggestion.reason : 'Added manually.'
    }
    setS({ ...s, plan: [...s.plan, item] })
    note('Study plan updated.')
  }

  return (
    <section className="stack">
      <section className="panel">
        <h2>Study Plan</h2>
        <p className="muted">Priority, goal, open errors and planned rest days shape suggestions.</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
          <button className="primary" onClick={() => add('recommended')}>
            + Add recommendation
          </button>
          <button className="secondary" onClick={() => add('manual')}>
            Add manual
          </button>
        </div>
      </section>
      {s.plan.map(item => (
        <section className="panel plan-row" key={item.id}>
          <div>
            <span>{item.source === 'recommended' ? 'Recommended' : 'Manual'} · {item.date}</span>
            <h3>{item.title}</h3>
            <small>{item.skill} · {item.minutes} min · {item.reason}</small>
          </div>
          <select
            value={item.status}
            onChange={event =>
              setS({
                ...s,
                plan: s.plan.map(current =>
                  current.id === item.id ? { ...current, status: event.target.value as PlanItem['status'] } : current
                )
              })
            }
          >
            <option value="planned">Planned</option>
            <option value="done">Done</option>
            <option value="skipped">Skipped</option>
          </select>
        </section>
      ))}
    </section>
  )
}

function Record({
  s,
  setS,
  note
}: {
  s: Store
  setS: (store: Store) => void
  note: (message: string) => void
}) {
  const active = s.activeSession
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!active || active.paused) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [active])

  const seconds = active
    ? Math.max(0, active.accumulatedSeconds + (active.paused ? 0 : (now - new Date(active.lastResumedAt).getTime()) / 1000))
    : 0

  const start = () => {
    const time = new Date().toISOString()
    setNow(Date.now())
    setS({
      ...s,
      activeSession: {
        id: uid('session'),
        startedAt: time,
        lastResumedAt: time,
        accumulatedSeconds: 0,
        paused: false,
        activeIntervals: []
      }
    })
  }

  const pause = () => {
    if (!active) return
    setS({
      ...s,
      activeSession: { ...snapshotActiveSession(active, new Date().toISOString()), paused: true }
    })
  }

  const resume = () => {
    if (active) {
      setNow(Date.now())
      setS({
        ...s,
        activeSession: { ...active, lastResumedAt: new Date().toISOString(), paused: false }
      })
    }
  }

  const stop = () => {
    if (!active) return
    const end = new Date().toISOString()
    const completed = snapshotActiveSession(active, end)
    const intervals = completed.activeIntervals || []
    const measured = intervals.length
      ? intervals.reduce((total, interval) => total + Math.max(0, Date.parse(interval.endedAt) - Date.parse(interval.startedAt)) / 1000, 0)
      : completed.accumulatedSeconds
    setS({
      ...s,
      activeSession: undefined,
      sessions: [
        ...s.sessions,
        {
          id: active.id,
          startedAt: active.startedAt,
          endedAt: end,
          minutes: Math.max(0, Math.round(measured / 60)),
          activeIntervals: intervals.length ? intervals : undefined,
          activity: 'Timer session',
          skill: 'Reading'
        }
      ]
    })
    note('Timer session saved as measured active intervals.')
  }

  return (
    <section className="stack">
      <section className="panel">
        <h2>{active ? (active.paused ? 'Timer paused' : 'Session in progress') : 'Learning Record'}</h2>
        <p className="timer">
          {Math.floor(seconds / 60).toString().padStart(2, '0')}:
          {Math.floor(seconds % 60).toString().padStart(2, '0')}
        </p>
        {!active ? (
          <button className="primary" onClick={start}>
            Start timer
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="secondary" onClick={active.paused ? resume : pause}>
              {active.paused ? 'Resume' : 'Pause'}
            </button>
            <button className="danger" onClick={stop}>
              Stop and save
            </button>
          </div>
        )}
        <p className="muted" style={{ marginTop: '12px' }}>
          Paused intervals are excluded. Reopened sessions stay paused until you resume them.
        </p>
      </section>
      <section className="panel">
        <b>{Math.round(s.sessions.reduce((total, item) => total + measuredMinutes(item), 0))} measured minutes</b>
        {s.sessions.length === 0 ? (
          <p className="muted">No study sessions yet.</p>
        ) : (
          s.sessions
            .slice()
            .reverse()
            .map(item => (
              <div className="list-row" key={item.id}>
                <div>
                  <b>{item.activity || 'Study session'}</b>
                  <small>
                    {new Date(item.startedAt).toLocaleString()} → {new Date(item.endedAt).toLocaleString()}
                  </small>
                </div>
                <strong>{measuredMinutes(item) > 0 ? `${Math.round(measuredMinutes(item))} min` : 'Not counted'}</strong>
              </div>
            ))
        )}
      </section>
      <section className="panel">
        <h3>Reading history</h3>
        {s.attempts.length === 0 ? (
          <p className="muted">No Reading attempts yet.</p>
        ) : (
          s.attempts
            .slice()
            .reverse()
            .map(attempt => (
              <div className="list-row" key={attempt.id}>
                <div>
                  <b>
                    {attempt.kind === 'retest' ? 'Retest' : 'Reading practice'} · {attempt.score}/{attempt.total}
                  </b>
                  <small>
                    {new Date(attempt.createdAt).toLocaleString()} · {attempt.objectiveIds.length} objectives ·{' '}
                    {attempt.reflection ? 'Reflection saved' : 'No reflection yet'}
                  </small>
                </div>
                <strong>{attempt.total ? Math.round((attempt.score / attempt.total) * 100) : 0}%</strong>
              </div>
            ))
        )}
      </section>
      <section className="panel">
        <h3>Other skill submissions</h3>
        {(s.submissions || []).length ? (
          (s.submissions || [])
            .slice()
            .reverse()
            .map(item => (
              <div className="list-row" key={item.id}>
                <div>
                  <b>{item.skill} · {item.activityId}</b>
                  <small>
                    {new Date(item.createdAt).toLocaleString()} ·{' '}
                    {item.feedbackMode === 'transcript-fallback' ? 'Transcript fallback' : 'Self-review only'}
                  </small>
                </div>
                <strong>Saved</strong>
              </div>
            ))
        ) : (
          <p className="muted">No other skill submissions yet.</p>
        )}
      </section>
    </section>
  )
}

function LearningNetwork() {
  return (
    <section className="stack">
      <section className="panel">
        <h2>Learning Network</h2>
        <p className="muted">Curated authoritative IELTS resources linked by skill and objective.</p>
        {[
          ['British Council LearnEnglish', 'Official practice questions, listening audios and writing criteria.', 'https://learnenglish.britishcouncil.org'],
          ['Cambridge English IELTS', 'Format details, scoring descriptors and band score explanations.', 'https://www.cambridgeenglish.org/exams-and-tests/ielts/'],
          ['IDP IELTS Preparation', 'Preparation articles, masterclasses and speaking interview samples.', 'https://www.ieltsidpindia.com/prep-material/'],
          ['ForumFlash IELTS Lexicon', 'Thematic academic vocabulary, collocations and idiom sets.', 'https://forumflash.vercel.app/#study']
        ].map(([name, description, url]) => (
          <div className="network-card" key={name}>
            <b>{name}</b>
            <span>{description}</span>
            <a href={url} target="_blank" rel="noopener noreferrer">
              Open resource ↗
            </a>
          </div>
        ))}
      </section>
    </section>
  )
}

function LearningDesign() {
  return (
    <section className="stack">
      <section className="panel">
        <h2>Learning Design</h2>
        <p className="muted">Implemented learning theory is tied to evidence-producing activities.</p>
        {[
          ['Behaviorism', 'Reading feedback, Error Review and Retest provide immediate reinforcement.', 'Implemented'],
          ['Cognitivism', 'Questions are chunked; explanations connect answers to passage evidence and objectives.', 'Implemented'],
          ['Constructivism', 'Saved reflections ask learners to name evidence and a next strategy.', 'Implemented'],
          ['Connectivism', 'Thematic topic structure and curated Learning Network link skills and lexicon.', 'Implemented']
        ].map(([name, description, status]) => (
          <div className="design-row" key={name}>
            <b>{name}</b>
            <span>{description}</span>
            <em>{status}</em>
          </div>
        ))}
      </section>
      <section className="panel">
        <h3>TPACK mapping</h3>
        <p><b>Content:</b> IELTS passages, thematic vocabulary, grammar structures, and questions.</p>
        <p><b>Pedagogy:</b> Practice → Feedback → Reflection → Thematic Retest & Spaced Drills.</p>
        <p><b>Technology:</b> Scoring, local records, Heatmap, audio synthesis, and interactive flashcards.</p>
      </section>
    </section>
  )
}

function Profile({
  s,
  setS,
  note
}: {
  s: Store
  setS: (store: Store) => void
  note: (message: string) => void
}) {
  const [profile, setLocalProfile] = useState<Profile>(s.profile)

  const save = () => {
    setS({ ...s, profile })
    note('Profile updated.')
  }

  const resetAll = () => {
    if (confirm('Clear all learner attempts, errors, and history?')) {
      const cleared = clearStore()
      setS(loadStore())
      note(cleared ? 'All learner data reset.' : 'Warning: some learner-progress keys could not be removed.')
    }
  }

  return (
    <section className="stack">
      <section className="panel">
        <h2>Learner Profile</h2>
        <p className="muted">Set targets, daily goals, and planned rest days.</p>
        <div className="form-grid">
          <label>
            Target Band Score
            <input
              type="number"
              step="0.5"
              min="4"
              max="9"
              value={profile.targetBand || ''}
              onChange={e => setLocalProfile({ ...profile, targetBand: parseFloat(e.target.value) || undefined })}
            />
          </label>
          <label>
            Daily Goal (Minutes)
            <input
              type="number"
              min="10"
              max="240"
              value={profile.dailyGoalMinutes || ''}
              onChange={e => setLocalProfile({ ...profile, dailyGoalMinutes: parseInt(e.target.value) || undefined })}
            />
          </label>
          <label>
            Priority Skill
            <select
              value={profile.priority}
              onChange={e => setLocalProfile({ ...profile, priority: e.target.value as any })}
            >
              <option value="Reading">Reading</option>
              <option value="Listening">Listening</option>
              <option value="Writing">Writing</option>
              <option value="Speaking">Speaking</option>
            </select>
          </label>
          <label>
            Exam Date
            <input
              type="date"
              value={profile.examDate || ''}
              onChange={e => setLocalProfile({ ...profile, examDate: e.target.value || undefined })}
            />
          </label>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="primary" onClick={save}>
            Save profile
          </button>
          <button className="danger-outline" onClick={resetAll}>
            Reset data
          </button>
        </div>
      </section>
    </section>
  )
}
