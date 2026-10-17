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
    label: 'Tá»•ng quan (Overview)',
    items: [
      ['dashboard', 'Báº£ng tá»•ng quan', Home],
      ['record', 'Báº¥m giá» & Nháº­t kÃ½', Clock3]
      ,['simulator', 'IELTS Test Simulator', Target]
    ]
  },
  {
    label: '4 Ká»¹ nÄƒng IELTS (Skills)',
    items: [
      ['practice', 'Reading (Äá»c hiá»ƒu)', BookOpen],
      ['listening', 'Listening (Nghe hiá»ƒu)', Volume2],
      ['writing', 'Writing (Viáº¿t luáº­n)', Palette],
      ['speaking', 'Speaking (Luyá»‡n nÃ³i)', Compass]
    ]
  },
  {
    label: 'Ná»n táº£ng chá»§ Ä‘á» (Thematic)',
    items: [
      ['vocabulary', 'Tá»« vá»±ng (Flashcards)', Layers],
      ['grammar', 'Ngá»¯ phÃ¡p á»©ng dá»¥ng', ListChecks]
    ]
  },
  {
    label: 'Báº±ng chá»©ng & Lá»—i sai',
    items: [['errors', 'Bá»™ nhá»› lá»—i & Retest', RotateCcw]]
  },
  {
    label: 'KhÃ¡m phÃ¡ & Há»“ sÆ¡',
    items: [
      ['network', 'TÃ i liá»‡u Ã´n luyá»‡n', Network],
      ['design', 'Thiáº¿t káº¿ há»‡ thá»‘ng', Palette],
      ['profile', 'Má»¥c tiÃªu & Há»“ sÆ¡', Settings]
    ]
  }
]

const nav = navGroups.flatMap(group => group.items)

type RoadmapStep = { phase: string; title: string; outcome: string; activities: string[]; test: string }
const ROADMAPS: Record<Skill, RoadmapStep[]> = {
  Reading: [
    { phase: '01 Â· Cháº©n Ä‘oÃ¡n', title: 'Äá»c hiá»ƒu vÃ  Ä‘á»‹nh vá»‹ thÃ´ng tin', outcome: 'XÃ¡c Ä‘á»‹nh main idea, keywords vÃ  paraphrase trong vÄƒn báº£n há»c thuáº­t.', activities: ['Skim 3 Ä‘oáº¡n vÄƒn theo tiÃªu Ä‘á»', 'Scan tÃªn riÃªng, sá»‘ liá»‡u vÃ  má»‘c thá»i gian', 'Ghi láº¡i paraphrase gÃ¢y nhiá»…u'], test: 'Mini test: matching headings + True/False/Not Given' },
    { phase: '02 Â· XÃ¢y chiáº¿n thuáº­t', title: 'LÃ m chá»§ dáº¡ng cÃ¢u há»i', outcome: 'Chá»n chiáº¿n thuáº­t theo dáº¡ng bÃ i thay vÃ¬ Ä‘oÃ¡n Ä‘Ã¡p Ã¡n.', activities: ['Matching information', 'Sentence endings vÃ  summary completion', 'Table/flow-chart completion'], test: 'Mixed set 20 cÃ¢u, giá»›i háº¡n 25 phÃºt' },
    { phase: '03 Â· Chuyá»ƒn giao', title: 'Timed passage vÃ  retest', outcome: 'Duy trÃ¬ Ä‘á»™ chÃ­nh xÃ¡c khi tÄƒng Ä‘á»™ khÃ³ vÃ  Ã¡p lá»±c thá»i gian.', activities: ['Passage má»›i cÃ¹ng objective', 'Error Memory theo tá»«ng occurrence', 'Retest má»™t lá»—i duy nháº¥t báº±ng ná»™i dung tÆ°Æ¡ng Ä‘Æ°Æ¡ng'], test: 'Full Reading simulation 60 phÃºt' }
  ],
  Listening: [
    { phase: '01 Â· Cháº©n Ä‘oÃ¡n', title: 'Nghe Ã½ chÃ­nh vÃ  dá»± Ä‘oÃ¡n', outcome: 'Dá»± Ä‘oÃ¡n loáº¡i tá»«, bá»‘i cáº£nh vÃ  distractor trÆ°á»›c khi nghe.', activities: ['Form/note completion', 'Nghe sá»‘, tÃªn riÃªng, spelling', 'Shadowing cÃ¢u ngáº¯n'], test: 'Part 1â€“2: form completion + map labelling' },
    { phase: '02 Â· PhÃ¢n biá»‡t thÃ´ng tin', title: 'Paraphrase vÃ  distractors', outcome: 'Theo dÃµi chuyá»ƒn Ã½, sá»­a Ä‘Ã¡p Ã¡n vÃ  nháº­n diá»‡n cÃ¡ch diá»…n Ä‘áº¡t khÃ¡c.', activities: ['Multiple choice', 'Matching speakers/opinions', 'Table vÃ  flow-chart completion'], test: 'Part 3: 15 cÃ¢u nghe má»™t láº§n' },
    { phase: '03 Â· Tá»‘c Ä‘á»™ thi', title: 'Bá»‘n part liÃªn tá»¥c', outcome: 'Giá»¯ táº­p trung, ghi chÃº cÃ³ chá»n lá»c vÃ  tá»± kiá»ƒm transcript.', activities: ['Part 4 academic lecture', 'Accent rotation', 'Review transcript theo lá»—i'], test: 'Full Listening simulation 30 phÃºt' }
  ],
  Writing: [
    { phase: '01 Â· Cháº©n Ä‘oÃ¡n', title: 'Task response vÃ  cáº¥u trÃºc', outcome: 'Tráº£ lá»i Ä‘á»§ Ä‘á», láº­p thesis vÃ  bá»‘ cá»¥c Ä‘oáº¡n rÃµ rÃ ng.', activities: ['PhÃ¢n tÃ­ch Ä‘á» opinion/discussion/problem', 'Láº­p outline 5 phÃºt', 'Viáº¿t topic sentence'], test: 'One-paragraph response + self checklist' },
    { phase: '02 Â· PhÃ¡t triá»ƒn band', title: 'Coherence, vocabulary, grammar', outcome: 'PhÃ¡t triá»ƒn Ã½ báº±ng nguyÃªn nhÃ¢n, vÃ­ dá»¥ vÃ  há»‡ quáº£; trÃ¡nh há»c thuá»™c.', activities: ['Task 1 overview vÃ  grouping data', 'Task 2 argument/counterargument', 'Sá»­a lá»—i cÃ¢u phá»©c vÃ  collocation'], test: 'Task 1 hoáº·c Task 2 timed draft' },
    { phase: '03 Â· Chuáº©n hoÃ¡', title: 'Feedback vÃ  timed writing', outcome: 'HoÃ n thÃ nh Ä‘Ãºng thá»i lÆ°á»£ng vÃ  tá»± sá»­a theo 4 tiÃªu chÃ­ cháº¥m.', activities: ['Rewrite sau feedback', 'So sÃ¡nh model answer há»£p phÃ¡p', 'Kiá»ƒm tra word count vÃ  lá»—i láº·p'], test: 'Academic Writing 60 phÃºt: Task 1 + Task 2' }
  ],
  Speaking: [
    { phase: '01 Â· Cháº©n Ä‘oÃ¡n', title: 'Fluency vÃ  phÃ¡t Ã¢m', outcome: 'Tráº£ lá»i tá»± nhiÃªn, rÃµ Ã½ vÃ  khÃ´ng phá»¥ thuá»™c script.', activities: ['Part 1: personal topics', 'Chunking vÃ  intonation', 'Ghi Ã¢m 60 giÃ¢y rá»“i tá»± nghe láº¡i'], test: 'Part 1 rotation: 10 cÃ¢u, khÃ´ng chuáº©n bá»‹' },
    { phase: '02 Â· Má»Ÿ rá»™ng Ã½', title: 'Cue card vÃ  follow-up', outcome: 'NÃ³i Ä‘á»§ 2 phÃºt vá»›i vÃ­ dá»¥, chi tiáº¿t vÃ  liÃªn káº¿t máº¡ch láº¡c.', activities: ['Part 2: 1 phÃºt chuáº©n bá»‹', 'Story spine: who/what/why/result', 'Part 3: compare, evaluate, speculate'], test: 'Cue card recording + 4 cÃ¢u follow-up' },
    { phase: '03 Â· MÃ´ phá»ng', title: 'Mock interview', outcome: 'Duy trÃ¬ Ä‘á»™ chÃ­nh xÃ¡c vÃ  tÆ°Æ¡ng tÃ¡c dÆ°á»›i Ã¡p lá»±c thi.', activities: ['Random topic draw', 'Pronunciation repair list', 'So sÃ¡nh báº£n ghi trÆ°á»›c/sau'], test: 'Speaking mock 11â€“14 phÃºt' }
  ],
  Vocabulary: [
    { phase: '01 Â· Ná»n táº£ng', title: 'Lexical chunks theo chá»§ Ä‘á»', outcome: 'Nhá»› collocation vÃ  word family trong ngá»¯ cáº£nh, khÃ´ng há»c tá»« rá»i.', activities: ['Flashcard hai chiá»u', 'Pronunciation + word family', 'Tá»± Ä‘áº·t cÃ¢u theo topic'], test: 'Recall quiz: nghÄ©a, collocation, dÃ¹ng cÃ¢u' },
    { phase: '02 Â· Sá»­ dá»¥ng', title: 'Paraphrase vÃ  register', outcome: 'Chá»n tá»« chÃ­nh xÃ¡c theo sáº¯c thÃ¡i Academic/Formal vÃ  trÃ¡nh láº·p.', activities: ['Synonym ladder', 'Cloze passage', 'Paraphrase cÃ¢u Reading/Writing'], test: 'Mixed quiz 20 cÃ¢u + short production' },
    { phase: '03 Â· Ghi nhá»› dÃ i háº¡n', title: 'Spaced review vÃ  transfer', outcome: 'ÄÆ°a tá»« Ä‘Ã£ há»c vÃ o bÃ i nÃ³i/viáº¿t vÃ  theo dÃµi tá»« hay quÃªn.', activities: ['Review 1â€“3â€“7â€“14 ngÃ y', 'Error Memory theo topic', 'DÃ¹ng 5 chunks trong má»™t response'], test: 'Cumulative vocabulary checkpoint' }
  ],
  Grammar: [
    { phase: '01 Â· Cháº©n Ä‘oÃ¡n', title: 'Accuracy ná»n táº£ng', outcome: 'Nháº­n diá»‡n lá»—i áº£nh hÆ°á»Ÿng band: subjectâ€“verb, articles, tense, agreement.', activities: ['Error correction', 'Sentence combining', 'Mini dictation'], test: 'Diagnostic 25 cÃ¢u theo lá»—i' },
    { phase: '02 Â· Kiá»ƒm soÃ¡t cÃ¢u phá»©c', title: 'Complexity cÃ³ kiá»ƒm soÃ¡t', outcome: 'DÃ¹ng relative clauses, conditionals vÃ  concessive clauses Ä‘Ãºng má»¥c Ä‘Ã­ch.', activities: ['Rewrite simple â†’ complex', 'Contrast/causal connectors', 'Grammar in context'], test: 'Editing passage + 8 cÃ¢u production' },
    { phase: '03 Â· Transfer', title: 'Grammar trong bÃ i thi', outcome: 'Giá»¯ accuracy khi viáº¿t/nÃ³i tháº­t, khÃ´ng nhá»“i cáº¥u trÃºc rá»§i ro.', activities: ['Sá»­a má»™t Ä‘oáº¡n Writing', 'Speaking reformulation', 'Personal error log'], test: 'Timed response + targeted recheck sau 7 ngÃ y' }
  ]
}

const DAILY_CYCLES: Record<Skill, string[]> = {
  Reading: ['NgÃ y 1 Â· Skim + main idea (25 phÃºt)', 'NgÃ y 2 Â· Matching headings/information (35 phÃºt)', 'NgÃ y 3 Â· T/F/NG + evidence log (35 phÃºt)', 'NgÃ y 4 Â· Completion + paraphrase (40 phÃºt)', 'NgÃ y 5 Â· Passage timed (20 phÃºt)', 'NgÃ y 6 Â· Chá»¯a lá»—i vÃ  retest occurrence (30 phÃºt)', 'NgÃ y 7 Â· Full Reading mock: 3 passages/60 phÃºt'],
  Listening: ['NgÃ y 1 Â· Part 1 form completion (20 phÃºt)', 'NgÃ y 2 Â· Part 2 map/matching (25 phÃºt)', 'NgÃ y 3 Â· Part 3 multiple choice (30 phÃºt)', 'NgÃ y 4 Â· Part 4 lecture/note completion (30 phÃºt)', 'NgÃ y 5 Â· Dictation + shadowing (20 phÃºt)', 'NgÃ y 6 Â· Transcript error review (25 phÃºt)', 'NgÃ y 7 Â· Full Listening mock: 4 parts/30 phÃºt'],
  Writing: ['NgÃ y 1 Â· PhÃ¢n tÃ­ch Ä‘á» + thesis (25 phÃºt)', 'NgÃ y 2 Â· Task 1 overview + grouping (35 phÃºt)', 'NgÃ y 3 Â· Task 2 body paragraph (40 phÃºt)', 'NgÃ y 4 Â· Cohesion + grammar editing (30 phÃºt)', 'NgÃ y 5 Â· Task 1 timed: 20 phÃºt', 'NgÃ y 6 Â· Task 2 timed: 40 phÃºt', 'NgÃ y 7 Â· Full Writing mock: Task 1 + Task 2/60 phÃºt'],
  Speaking: ['NgÃ y 1 Â· Part 1 fluency recording (15 phÃºt)', 'NgÃ y 2 Â· Pronunciation: chunking + stress (20 phÃºt)', 'NgÃ y 3 Â· Cue card: 1 phÃºt chuáº©n bá»‹/2 phÃºt nÃ³i', 'NgÃ y 4 Â· Part 3 compare/evaluate (25 phÃºt)', 'NgÃ y 5 Â· Retell cÃ¹ng Ã½ báº±ng tá»« khÃ¡c (20 phÃºt)', 'NgÃ y 6 Â· Self-review theo 4 tiÃªu chÃ­ (20 phÃºt)', 'NgÃ y 7 Â· Mock Speaking: Part 1â€“3/11â€“14 phÃºt'],
  Vocabulary: ['NgÃ y 1 Â· Há»c 8 lexical chunks theo topic (20 phÃºt)', 'NgÃ y 2 Â· Recall hai chiá»u + pronunciation (20 phÃºt)', 'NgÃ y 3 Â· Collocation cloze (25 phÃºt)', 'NgÃ y 4 Â· Paraphrase 10 cÃ¢u (25 phÃºt)', 'NgÃ y 5 Â· DÃ¹ng chunks trong Writing/Speaking (30 phÃºt)', 'NgÃ y 6 Â· Ã”n tá»« sai theo spaced review (20 phÃºt)', 'NgÃ y 7 Â· Cumulative quiz + production checkpoint (30 phÃºt)'],
  Grammar: ['NgÃ y 1 Â· Diagnostic: articles/agreement (25 phÃºt)', 'NgÃ y 2 Â· Sentence combining (25 phÃºt)', 'NgÃ y 3 Â· Relative/conditional clauses (30 phÃºt)', 'NgÃ y 4 Â· Contrast/causal connectors (25 phÃºt)', 'NgÃ y 5 Â· Edit má»™t Ä‘oáº¡n Writing (30 phÃºt)', 'NgÃ y 6 Â· Speaking reformulation (20 phÃºt)', 'NgÃ y 7 Â· Grammar checkpoint: editing + production/35 phÃºt']
}

function SkillRoadmap({ skill }: { skill: Skill }) {
  const steps = ROADMAPS[skill]
  return (
    <section className="panel roadmap-panel">
      <div className="panel-title">
        <h3>Lá»™ trÃ¬nh há»c {skill}</h3>
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
        <div className="panel-title"><h3>Lá»‹ch há»c 7 ngÃ y</h3></div>
        <div className="daily-plan-grid">{DAILY_CYCLES[skill].map((day, index) => <div className={`daily-plan-day ${index === 6 ? 'mock-day' : ''}`} key={day}><b>D{index + 1}</b><span>{day.split(' Â· ')[1]}</span></div>)}</div>
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

  const title = nav.find(item => item[0] === page)?.[1] || 'Báº£ng tá»•ng quan'
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
                    <span className="nav-count" title={`${openErrors.length} lá»—i chÆ°a sá»­a`}>
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
          <b>Báº±ng chá»©ng trÆ°á»›c káº¿t luáº­n.</b>
          <span>Dá»¯ liá»‡u há»c táº­p lÃ  minh chá»©ng thá»±c táº¿, khÃ´ng bá»‹a Ä‘iá»ƒm sá»‘.</span>
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
              <span>IELTS OPTIMIZER</span> Â· {nav.find(item => item[0] === page)?.[1]}
            </div>
            <h1>{title}</h1>
          </div>
          <div className="header-right-tools">
            {store.activeSession && (
              <div
                className="timer-live-badge"
                onClick={() => go('record')}
                title="Nháº¥p Ä‘á»ƒ xem nháº­t kÃ½ báº¥m giá»"
                role="button"
                tabIndex={0}
              >
                <span className="timer-pulse-dot" />
                <span>
                  {store.activeSession.paused ? 'Táº¡m dá»«ng: ' : 'Äang há»c: '}
                  {Math.floor(activeSec / 60).toString().padStart(2, '0')}:
                  {Math.floor(activeSec % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
            <button aria-label="CÃ i Ä‘áº·t má»¥c tiÃªu há»“ sÆ¡" className="icon-button" onClick={() => go('profile')}>
              <Settings size={18} />
            </button>
          </div>
        </header>

        {/* Quick Navigation Bar across related views */}
        {['practice', 'listening', 'writing', 'speaking'].includes(page) && (
          <div className="skill-quick-bar" role="tablist" aria-label="4 Ká»¹ nÄƒng">
            <button
              role="tab"
              aria-selected={page === 'practice'}
              className={`skill-quick-btn ${page === 'practice' ? 'active' : ''}`}
              onClick={() => go('practice')}
            >
              <BookOpen size={15} /> <span>Reading (Äá»c hiá»ƒu)</span>
            </button>
            <button
              role="tab"
              aria-selected={page === 'listening'}
              className={`skill-quick-btn ${page === 'listening' ? 'active' : ''}`}
              onClick={() => go('listening')}
            >
              <Volume2 size={15} /> <span>Listening (Nghe hiá»ƒu)</span>
            </button>
            <button
              role="tab"
              aria-selected={page === 'writing'}
              className={`skill-quick-btn ${page === 'writing' ? 'active' : ''}`}
              onClick={() => go('writing')}
            >
              <Palette size={15} /> <span>Writing (Viáº¿t luáº­n)</span>
            </button>
            <button
              role="tab"
              aria-selected={page === 'speaking'}
              className={`skill-quick-btn ${page === 'speaking' ? 'active' : ''}`}
              onClick={() => go('speaking')}
            >
              <Compass size={15} /> <span>Speaking (Luyá»‡n nÃ³i)</span>
            </button>
          </div>
        )}

        {['vocabulary', 'grammar', 'errors'].includes(page) && (
          <div className="skill-quick-bar" role="tablist" aria-label="Ná»n táº£ng & Lá»—i sai">
            <button
              role="tab"
              aria-selected={page === 'vocabulary'}
              className={`skill-quick-btn ${page === 'vocabulary' ? 'active' : ''}`}
              onClick={() => go('vocabulary')}
            >
              <Layers size={15} /> <span>Tá»« vá»±ng theo chá»§ Ä‘á» (Flashcards)</span>
            </button>
            <button
              role="tab"
              aria-selected={page === 'grammar'}
              className={`skill-quick-btn ${page === 'grammar' ? 'active' : ''}`}
              onClick={() => go('grammar')}
            >
              <ListChecks size={15} /> <span>Ngá»¯ phÃ¡p á»©ng dá»¥ng</span>
            </button>
            <button
              role="tab"
              aria-selected={page === 'errors'}
              className={`skill-quick-btn ${page === 'errors' ? 'active' : ''}`}
              onClick={() => go('errors')}
            >
              <RotateCcw size={15} />{' '}
              <span>Bá»™ nhá»› lá»—i & Retest {openErrors.length > 0 ? `(${openErrors.length})` : ''}</span>
            </button>
          </div>
        )}

        {['dashboard', 'record'].includes(page) && (
          <div className="skill-quick-bar" role="tablist" aria-label="Tá»•ng quan há»c táº­p">
            <button
              role="tab"
              aria-selected={page === 'dashboard'}
              className={`skill-quick-btn ${page === 'dashboard' ? 'active' : ''}`}
              onClick={() => go('dashboard')}
            >
              <Home size={15} /> <span>Báº£ng tá»•ng quan (Dashboard)</span>
            </button>
            <button
              role="tab"
              aria-selected={page === 'record'}
              className={`skill-quick-btn ${page === 'record' ? 'active' : ''}`}
              onClick={() => go('record')}
            >
              <Clock3 size={15} /> <span>Báº¥m giá» & Nháº­t kÃ½ (Record)</span>
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
  showAll = false,
  collapsible = false
}: {
  selected: TopicId | 'all'
  onSelect: (topicId: TopicId | 'all') => void
  showAll?: boolean
  collapsible?: boolean
}) {
  const [expanded, setExpanded] = useState(!collapsible)
  return (
    <div className="topic-hub-container" role="region" aria-label="IELTS Topics">
      {collapsible && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="topic-toggle-btn"
          aria-expanded={expanded}
        >
          {expanded ? 'ðŸ™ˆ áº¨n chá»§ Ä‘á»' : 'ðŸ” Chá»n chá»§ Ä‘á»'}
        </button>
      )}
      {expanded && (
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
                <span className="topic-en">Táº¥t cáº£ chá»§ Ä‘á»</span>
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
      )}
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
              CHá»¦ Äá»€ Ã”N Táº¬P IELTS Â· {topic.titleEn.toUpperCase()}
            </span>
            <span className="topic-band-target">Band 6.5 â€“ 8.5</span>
          </div>
          <h2>
            {topic.titleEn} â€” {topic.titleVi}
          </h2>
          <p>{topic.descriptionVi}</p>
        </div>
      </div>
      <div className="topic-header-meta">
        <div className="topic-stat-pills">
          <span className="stat-pill"><b>{topic.vocab.length}</b> tá»« vá»±ng</span>
          <span className="stat-pill"><b>{topic.grammar.length}</b> ngá»¯ phÃ¡p</span>
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
            Open action â†’
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
        <div className="motivation-star">âœ¦</div>
        <div className="motivation-spark spark-one">+</div>
        <div className="motivation-spark spark-two">Â·</div>
      </div>
      <div className="motivation-copy">
        <span className="eyebrow">
          <Sparkles size={12} /> KEEP GOING
        </span>
        <Quote size={18} />
        <blockquote>â€œ{quote}â€</blockquote>
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
          activity: destination ? `Study Â· ${destination.name}` : 'Dashboard study session',
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
              {item.name} Â· {item.kind}
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
            {active ? (active.paused ? 'Paused â€” resume when ready' : 'Session in progress') : 'Start a measured session from Dashboard'}
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
                  {new Date(item.createdAt).toLocaleString()} Â· {item.score}/{item.total}
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
                  {new Date(item.createdAt).toLocaleString()} Â·{' '}
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
          {Math.round(minutes)} active minutes{goal ? ` Â· ${Math.round((minutes / goal) * 100)}% of ${goal}-minute goal` : ''}
        </span>
        <span>{completed ? `${completed} completed activities Â· ${skills.join(', ')}` : 'No recorded activities'}</span>
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
          activity: `${isRetestMode ? 'Retest' : 'Reading'} Â· ${passage.title}`
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
              <span className="eyebrow">CHá»¦ Äá»€ Äá»ŒC HIá»‚U (READING BY TOPIC)</span>
              <h2>Chá»n bÃ i Ä‘á»c theo chá»§ Ä‘á»</h2>
            </div>
            <span className="badge">{filteredPassages.length} bÃ i luyá»‡n táº­p</span>
          </div>
          <TopicBar selected={topicFilter} onSelect={setTopicFilter} showAll={true} collapsible />
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
                  <span className="date-pill" style={{ padding: '2px 8px', fontSize: '10px' }}>{p.minutes} phÃºt</span>
                </div>
                <span className="passage-chip-title">{p.title}</span>
                <div className="passage-chip-meta">
                  <span>{p.topicTitle || 'General'}</span>
                  <span>â€¢</span>
                  <span>{p.questions.length} cÃ¢u há»i</span>
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
            <span className="eyebrow">{passage.topicTitle ? passage.topicTitle.toUpperCase() : 'READING'} Â· {passage.level}</span>
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
                <span>{q.type.toUpperCase()} Â· {q.objective}</span>
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
                  <b>{answers[q.id] === q.answer ? 'âœ“ Correct' : 'âœ— Incorrect'}</b>
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
    note('Simulation Ä‘Ã£ Ä‘Æ°á»£c lÆ°u vÃ o Learning Record.')
  }
  const playAudio = () => { if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(TOPICS[0].listening.audioText); u.lang = 'en-US'; window.speechSynthesis.speak(u) } }
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const secs = (seconds % 60).toString().padStart(2, '0')

  return <section className="stack">
    <section className="panel simulator-hero">
      <span className="eyebrow">IELTS COMPUTER-STYLE SIMULATION</span><h2>PhÃ²ng thi mÃ´ phá»ng</h2>
      <p className="muted">Ná»™i dung tá»± biÃªn soáº¡n theo format IELTS: timer, media, cÃ¢u há»i, ná»™p bÃ i vÃ  review. Äá» gá»‘c bÃªn ngoÃ i khÃ´ng Ä‘Æ°á»£c sao chÃ©p vÃ o á»©ng dá»¥ng.</p>
      <div className="study-modes">{(['Listening', 'Reading', 'Writing', 'Speaking'] as SimulationSkill[]).map(item => <button key={item} className={`mode-tab ${skill === item ? 'active' : ''}`} onClick={() => selectSkill(item)}>{item}</button>)}</div>
    </section>
    {!started ? <section className="panel simulator-start">
      <div className="simulator-spec"><b>{skill}</b><span>{skill === 'Listening' ? '4 parts Â· 40 questions Â· 30 minutes' : skill === 'Reading' ? '3 passages Â· 40 questions Â· 60 minutes' : skill === 'Writing' ? 'Task 1 + Task 2 Â· 60 minutes' : 'Part 1 + Part 2 + Part 3 Â· 11â€“14 minutes'}</span></div>
      <p className="muted">Báº£n demo hiá»‡n dÃ¹ng má»™t module ná»™i bá»™ cÃ³ media vÃ  cÃ¢u há»i tháº­t trong app. CÃ¡c module tiáº¿p theo sáº½ ná»‘i vÃ o cÃ¹ng test runner nÃ y.</p><button className="primary" onClick={start}>Báº¯t Ä‘áº§u simulation</button>
    </section> : <section className="panel simulator-shell">
      <div className="simulator-toolbar"><span className="badge">{skill} Â· {submitted ? 'Review' : 'In progress'}</span><strong className={seconds < 60 ? 'status' : ''}>â± {minutes}:{secs}</strong>{!submitted && <button className="danger" onClick={submit}>Ná»™p bÃ i</button>}</div>
      {skill === 'Listening' && <div className="media-stage"><h3>Part 1 Â· Everyday conversation</h3><p className="muted">Nghe má»™t láº§n nhÆ° phÃ²ng thi. KhÃ´ng hiá»‡n transcript cho Ä‘áº¿n khi ná»™p.</p><button className="primary" onClick={playAudio}>â–¶ Play audio</button><details><summary>Transcript sau khi ná»™p</summary><p className="callout">{submitted ? TOPICS[0].listening.audioText : 'Transcript sáº½ má»Ÿ sau khi ná»™p bÃ i.'}</p></details></div>}
      {skill === 'Reading' && <div className="reading-stage"><h3>{passages[0].title}</h3>{passages[0].text.split('\n\n').slice(0, 2).map(p => <p key={p}>{p}</p>)}</div>}
      {skill === 'Writing' && <div className="writing-stage"><h3>Task 1 Â· Academic report</h3><p className="callout">The chart below compares participation in three university clubs in 2005 and 2025. Summarise the information by selecting and reporting the main features.</p><svg viewBox="0 0 420 180" role="img" aria-label="Bar chart comparing university club participation"><line x1="45" y1="145" x2="390" y2="145" stroke="currentColor"/><rect x="80" y="65" width="34" height="80" fill="#92dcaa"/><rect x="120" y="42" width="34" height="103" fill="#f4c878"/><rect x="210" y="88" width="34" height="57" fill="#92dcaa"/><rect x="250" y="72" width="34" height="73" fill="#f4c878"/><rect x="340" y="105" width="34" height="40" fill="#92dcaa"/><rect x="380" y="55" width="34" height="90" fill="#f4c878"/><text x="74" y="165" fill="currentColor">Science</text><text x="205" y="165" fill="currentColor">Arts</text><text x="335" y="165" fill="currentColor">Sports</text></svg></div>}
      {skill === 'Speaking' && <div className="speaking-stage"><h3>Part 2 Â· Cue card</h3><p className="callout">Describe a skill you learned that was useful in your studies or work. You should say what it was, how you learned it, and explain why it was useful.</p><p className="muted">Use the response box as a transcript or outline, then record yourself separately if your browser supports a microphone.</p></div>}
      {(skill === 'Listening' || skill === 'Reading') && <div className="simulation-questions">{questions.map((q, index) => <div className="question" key={q.id}><h3>{index + 1}. {q.prompt}</h3><div className="options">{q.options.map(option => <label key={option} className={answers[q.id] === option ? 'chosen' : ''}><input type="radio" name={q.id} checked={answers[q.id] === option} onChange={() => setAnswers({ ...answers, [q.id]: option })} disabled={submitted}/><span>{option}</span></label>)}</div>{submitted && <div className="feedback"><b>{answers[q.id] === q.answer ? 'âœ“ Correct' : 'âœ— Review'}</b><small>{q.explanation}</small></div>}</div>)}</div>}
      {(skill === 'Writing' || skill === 'Speaking') && <textarea className="skill-response simulator-response" value={response} onChange={event => setResponse(event.target.value)} disabled={submitted} placeholder={skill === 'Writing' ? 'Viáº¿t cÃ¢u tráº£ lá»i Task 1/Task 2 táº¡i Ä‘Ã¢yâ€¦' : 'DÃ¡n transcript hoáº·c ghi chÃº cÃ¢u tráº£ lá»iâ€¦'} />}
      {submitted && <div className="result"><h3>{skill === 'Listening' || skill === 'Reading' ? `Score: ${score}/${questions.length}` : 'BÃ i Ä‘Ã£ ná»™p â€” chuyá»ƒn sang self-review'}</h3><button className="secondary" onClick={() => selectSkill(skill)}>LÃ m láº¡i module</button></div>}
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
          activity: `${skill} Â· ${currentTopic.titleEn}`
        }
      ]
    })
    note(`${skill} evidence saved to Learning Record.`)
  }

  const history = (s.submissions || []).filter(item => item.skill === skill && item.activityId.includes(selectedTopicId)).slice().reverse()

  return (
    <section className="stack">
      <section className="panel">
        <span className="eyebrow">{skill.toUpperCase()} Â· THEMATIC STUDY UNITS</span>
        <h2>Chá»n chá»§ Ä‘á» Ã´n táº­p ({skill})</h2>
        <TopicBar selected={selectedTopicId} onSelect={id => id !== 'all' && setSelectedTopicId(id)} collapsible />
        <TopicHeader topic={currentTopic} />
      </section>

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
            <a className="secondary audio-source-link" href="https://takeielts.britishcouncil.org/prepare/ielts-free-practice-mock-tests/academic/listening" target="_blank" rel="noreferrer">Má»Ÿ official natural recording â†—</a>
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
            {isPlaying && <span className="muted">Playing audioâ€¦</span>}
          </div>
          <div className="audio-upload-box">
            <label htmlFor="listening-audio-upload"><b>Audio tá»± nhiÃªn</b><span> Æ¯u tiÃªn recording ngÆ°á»i tháº­t tá»« nguá»“n official hoáº·c file luyá»‡n táº­p cá»§a báº¡n.</span></label>
            <input id="listening-audio-upload" type="file" accept="audio/*" onChange={event => {
              const file = event.target.files?.[0]
              if (file) setUploadedAudioUrl(URL.createObjectURL(file))
            }} />
            {uploadedAudioUrl && <audio controls src={uploadedAudioUrl} aria-label="Uploaded natural listening audio" />}
          </div>

          <details style={{ margin: '14px 0' }}>
            <summary style={{ cursor: 'pointer', color: 'var(--mint)', fontWeight: 600 }}>
              Hiá»‡n phá»¥ Ä‘á» bÃ i nghe (Transcript fallback)
            </summary>
            <p className="callout" style={{ marginTop: '8px' }}>
              {currentTopic.listening.audioText}
            </p>
          </details>

          {/* Listening Comprehension Check */}
          <div style={{ marginTop: '20px', borderTop: '1px solid #2e3d37', paddingTop: '16px' }}>
            <h4>Kiá»ƒm tra má»©c Ä‘á»™ nghe hiá»ƒu ({currentTopic.listening.questions.length} cÃ¢u)</h4>
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
                    <b>{quizAnswers[q.id] === q.answer ? 'âœ“ ÄÃºng' : 'âœ— ChÆ°a Ä‘Ãºng'}</b>
                    <span>ÄÃ¡p Ã¡n: {q.answer}</span>
                    <small>{q.explanation}</small>
                  </div>
                )}
              </div>
            ))}
            <button className="secondary" onClick={() => setShowQuizResult(true)}>
              Kiá»ƒm tra Ä‘Ã¡p Ã¡n nghe hiá»ƒu
            </button>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h4>Ghi chÃº & TÃ³m táº¯t Ã½ bÃ i nghe</h4>
            <textarea
              className="skill-response"
              aria-label="Listening notes"
              value={response}
              onChange={event => updateResponse(event.target.value)}
              placeholder="Ghi chÃº cÃ¡c Ã½ chÃ­nh, tá»« vá»±ng vÃ  chi tiáº¿t nghe Ä‘Æ°á»£c vÃ o Ä‘Ã¢y..."
            />
            <p className="muted">{wordCount} tá»« Ä‘Ã£ nháº­p Â· Báº£n nhÃ¡p tá»± Ä‘á»™ng lÆ°u trÃªn trÃ¬nh duyá»‡t</p>
            <button className="primary" onClick={submit}>
              LÆ°u minh chá»©ng vÃ o Learning Record
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
              Task 1 (BÃ¡o cÃ¡o sá»‘ liá»‡u / Biá»ƒu Ä‘á»“)
            </button>
            <button
              className={`mode-tab ${writingTaskType === 'task2' ? 'active' : ''}`}
              onClick={() => setWritingTaskType('task2')}
            >
              Task 2 (BÃ i luáº­n quan Ä‘iá»ƒm / Tháº£o luáº­n)
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
                <b>Gá»£i Ã½ dÃ n bÃ i (Outline suggestions):</b>
                {currentTopic.writing.task2.outlineIdeas.map((idea, i) => (
                  <p key={i} className="muted" style={{ margin: '4px 0' }}>â€¢ {idea}</p>
                ))}
              </div>
            </div>
          )}

          {/* Lexicon bank drawer inspired by ForumFlash */}
          <div className="topic-lexicon-helper">
            <div className="topic-lexicon-title">
              <span>Bá»˜ Tá»ª & COLLOCATION Gá»¢I Ã (THEMATIC LEXICON)</span>
              <small>Nháº¥p Ä‘á»ƒ tham kháº£o hoáº·c thÃªm vÃ o bÃ i viáº¿t</small>
            </div>
            <div className="lexicon-chip-cloud">
              {currentTopic.vocab.map(item => (
                <span
                  key={item.id}
                  className="lexicon-chip"
                  title={`${item.ipa} â€” ${item.meaningVi}`}
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
            placeholder="Viáº¿t bÃ i luáº­n cá»§a báº¡n táº¡i Ä‘Ã¢y..."
          />
          <p className="muted">
            {wordCount} tá»« Â· {response.split('\n\n').filter(Boolean).length} Ä‘oáº¡n vÄƒn Â· Tá»± Ä‘á»™ng lÆ°u nhÃ¡p
          </p>

          {feedback.length > 0 && (
            <div className="callout" style={{ margin: '12px 0' }}>
              <b>Chá»‰ dáº«n tá»± rÃ  soÃ¡t (Revision Cues):</b>
              {feedback.map((line, i) => (
                <span className="feedback-line" key={i}>{line}</span>
              ))}
            </div>
          )}

          <button className="primary" onClick={submit}>
            LÆ°u bÃ i viáº¿t vÃ o Learning Record
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
              Part 1 (Phá»ng váº¥n ngáº¯n)
            </button>
            <button
              className={`mode-tab ${speakingPart === 'part2' ? 'active' : ''}`}
              onClick={() => setSpeakingPart('part2')}
            >
              Part 2 (Cue Card & NÃ³i 2 phÃºt)
            </button>
            <button
              className={`mode-tab ${speakingPart === 'part3' ? 'active' : ''}`}
              onClick={() => setSpeakingPart('part3')}
            >
              Part 3 (Tháº£o luáº­n chuyÃªn sÃ¢u)
            </button>
          </div>

          {speakingPart === 'part1' && (
            <div>
              <h3>Part 1 Questions â€” {currentTopic.titleEn}</h3>
              {currentTopic.speaking.part1.map((question, i) => (
                <div key={i} className="callout" style={{ margin: '8px 0' }}>
                  <b>CÃ¢u há»i {i + 1}:</b> {question}
                </div>
              ))}
            </div>
          )}

          {speakingPart === 'part2' && (
            <div>
              <h3>Part 2 Cue Card â€” {currentTopic.titleEn}</h3>
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
                  {prepActive ? 'Táº¡m dá»«ng chuáº©n bá»‹' : prepSeconds === 60 ? 'Báº¯t Ä‘áº§u 1 phÃºt chuáº©n bá»‹' : 'Tiáº¿p tá»¥c'}
                </button>
              </div>
            </div>
          )}

          {speakingPart === 'part3' && (
            <div>
              <h3>Part 3 Two-way Discussion â€” {currentTopic.titleEn}</h3>
              {currentTopic.speaking.part3.map((q, i) => (
                <div key={i} className="callout" style={{ margin: '8px 0' }}>
                  <b>Tháº£o luáº­n {i + 1}:</b> {q}
                </div>
              ))}
            </div>
          )}

          {/* Useful Collocations for Speaking */}
          <div className="topic-lexicon-helper">
            <div className="topic-lexicon-title">
              <span>Cá»¤M Tá»ª & COLLOCATION NÃ“I NÃŠN DÃ™NG</span>
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
                {recording ? 'Dá»«ng ghi Ã¢m' : 'Báº­t ghi Ã¢m luyá»‡n nÃ³i (Mic)'}
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
            placeholder="DÃ¡n báº£n gÃµ lá»i nÃ³i (transcript) hoáº·c dÃ n Ã½ tráº£ lá»i cá»§a báº¡n vÃ o Ä‘Ã¢y..."
          />
          <button className="primary" onClick={submit}>
            LÆ°u minh chá»©ng luyá»‡n nÃ³i
          </button>
        </section>
      )}

      {/* History */}
      <section className="panel">
        <h3>Minh chá»©ng Ä‘Ã£ lÆ°u ({skill} Â· {currentTopic.titleEn})</h3>
        {history.length ? (
          history.map(item => (
            <details className="list-row" key={item.id}>
              <summary>
                <b>{new Date(item.createdAt).toLocaleString()}</b>
                <span>{item.feedbackMode === 'transcript-fallback' ? 'Audio Â· Ghi chÃº' : 'Minh chá»©ng tá»± luyá»‡n'}</span>
              </summary>
              <p style={{ marginTop: '8px', color: '#c5d3ca' }}>{item.response}</p>
            </details>
          ))
        ) : (
          <p className="muted">ChÆ°a cÃ³ bÃ i lÆ°u nÃ o cho chá»§ Ä‘á» nÃ y.</p>
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
      note('PhÃ¡t Ã¢m khÃ´ng Ä‘Æ°á»£c há»— trá»£ trÃªn trÃ¬nh duyá»‡t nÃ y.')
    }
  }

  const markKnown = (wordId: string, isKnown: boolean) => {
    const next = { ...knownWords, [wordId]: isKnown }
    setKnownWords(next)
    localStorage.setItem('ielts-optimizer-vocab-known', JSON.stringify(next))
    if (isKnown) {
      note(`ÄÃ£ ghi nhá»›: "${currentWord.term}"`)
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
        <h2>Tá»« vá»±ng IELTS theo 8 chá»§ Ä‘á» chuáº©n</h2>
        <TopicBar selected={selectedTopicId} onSelect={id => id !== 'all' && setSelectedTopicId(id)} collapsible />
        <TopicHeader
          topic={currentTopic}
          extraBadge={
            <div className="topic-progress-badge">
              <span>Tiáº¿n Ä‘á»™ chá»§ Ä‘á»:</span>
              <b>{knownCountInTopic} / {vocabList.length} tá»« ({progressPercent}%)</b>
            </div>
          }
        />

        <div className="study-modes">
          <button
            className={`mode-tab ${mode === 'flashcard' ? 'active' : ''}`}
            onClick={() => setMode('flashcard')}
          >
            ðŸŽ´ Láº­t tháº» (Flashcard)
          </button>
          <button
            className={`mode-tab ${mode === 'learn' ? 'active' : ''}`}
            onClick={() => setMode('learn')}
          >
            ðŸ“– Há»c tá»« & ÄÃ¡nh giÃ¡ (Learn)
          </button>
          <button
            className={`mode-tab ${mode === 'quiz' ? 'active' : ''}`}
            onClick={() => setMode('quiz')}
          >
            ðŸŽ¯ Tráº¯c nghiá»‡m (Quiz)
          </button>
          <button
            className={`mode-tab ${mode === 'errors' ? 'active' : ''}`}
            onClick={() => setMode('errors')}
          >
            âš ï¸ Bá»™ nhá»› lá»—i liÃªn káº¿t (Error Memory)
          </button>
        </div>
      </section>

      {/* MODE 1: FLASHCARD (Inspired by ForumFlash) */}
      {mode === 'flashcard' && currentWord && (
        <div className="flashcard-stage">
          <div className="flashcard-header">
            <span className="eyebrow">Tá»ª Vá»°NG THEO CHá»¦ Äá»€</span>
            <div className="flashcard-progress">
              <span>{String(cardIndex + 1).padStart(3, '0')}</span>
              <span>/</span>
              <span>{String(vocabList.length).padStart(3, '0')}</span>
            </div>
          </div>

          <div
            className={`flashcard-box ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped(!flipped)}
            role="button"
            tabIndex={0}
            aria-label="Láº­t tháº» tá»« vá»±ng"
          >
            <div className="card-top">
              <span className="card-tag">{currentWord.type}</span>
              <button
                className="card-speaker"
                aria-label="PhÃ¡t Ã¢m"
                onClick={e => {
                  e.stopPropagation()
                  speak(currentWord.term)
                }}
              >
                <Volume2 size={16} />
              </button>
              <button
                className="flip-btn"
                aria-label="Láº­t tháº»"
                onClick={e => {
                  e.stopPropagation()
                  setFlipped(!flipped)
                }}
              >
                â†» Láº­t tháº»
              </button>
            </div>

            <div className="card-center">
              {!flipped ? (
                <>
                  <h3 className="card-term">{currentWord.term}</h3>
                  <div className="card-ipa">{currentWord.ipa}</div>
                  <div className="card-hint" style={{ marginTop: '22px' }}>
                    <RefreshCw size={13} /> Nháº¥p tháº» Ä‘á»ƒ xem nghÄ©a & vÃ­ dá»¥
                  </div>
                </>
              ) : (
                <>
                  <div className="card-meaning">{currentWord.meaningVi}</div>
                  <div className="card-example">â€œ{currentWord.example}â€</div>
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

            <div className="card-top card-bottom-info">
              <small className="muted">Tháº» {cardIndex + 1} / {vocabList.length}</small>
              <small style={{ color: "var(--mint)" }}>{flipped ? 'Máº·t sau (NghÄ©a)' : 'Máº·t trÆ°á»›c (Tá»«)'}</small>
            </div>
          </div>

          <div className="learn-controls">
            <button
              className="nav-arrow"
              aria-label="Tháº» trÆ°á»›c"
              disabled={cardIndex === 0}
              onClick={() => {
                setCardIndex(cardIndex - 1)
                setFlipped(false)
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <button
              className="nav-arrow"
              aria-label="Tháº» tiáº¿p theo"
              disabled={cardIndex === vocabList.length - 1}
              onClick={() => {
                setCardIndex(cardIndex + 1)
                setFlipped(false)
              }}
            >
              <ArrowRight size={20} />
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
              <div className="card-example">â€œ{currentWord.example}â€</div>
            </div>

            <div className="card-top">
              <small className="muted">Tá»« {cardIndex + 1} / {vocabList.length}</small>
              <small style={{ color: knownWords[currentWord.id] ? 'var(--green)' : '#ffa99c' }}>
                {knownWords[currentWord.id] ? 'âœ“ ÄÃ£ thuá»™c' : 'â—‹ ChÆ°a thuá»™c'}
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
              <ArrowLeft size={20} />
            </button>
            <button className="again-button" onClick={() => markKnown(currentWord.id, false)}>
              <RotateCcw size={15} /> ChÆ°a thuá»™c
            </button>
            <button className="know-button" onClick={() => markKnown(currentWord.id, true)}>
              <Check size={16} /> ÄÃ£ há»c thuá»™c
            </button>
            <button
              className="nav-arrow"
              disabled={cardIndex === vocabList.length - 1}
              onClick={() => {
                setCardIndex(cardIndex + 1)
                setFlipped(false)
              }}
            >
              <ArrowRight size={20} />
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
                <span className="eyebrow">CÃ‚U {quizIndex + 1} / {vocabList.length}</span>
                <span className="date-pill">Äiá»ƒm hiá»‡n táº¡i: {quizScore}</span>
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
                  <Volume2 size={14} /> Nghe phÃ¡t Ã¢m
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
                      {selectedOption !== null && opt === currentQuizWord.meaningVi && <span>âœ“</span>}
                    </button>
                  )
                })}
              </div>

              {selectedOption !== null && (
                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <button className="primary" onClick={nextQuizQuestion}>
                    {quizIndex < vocabList.length - 1 ? 'CÃ¢u tiáº¿p theo â†’' : 'HoÃ n thÃ nh bÃ i kiá»ƒm tra'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="panel" style={{ textAlign: 'center', padding: '36px 20px' }}>
              <h2>Káº¿t quáº£ kiá»ƒm tra tá»« vá»±ng</h2>
              <div className="score-circle" style={{ margin: '20px auto' }}>
                <b>{quizScore}/{vocabList.length}</b>
                <span>{Math.round((quizScore / vocabList.length) * 100)}%</span>
              </div>
              <p className="muted">Chá»§ Ä‘á»: {currentTopic.titleEn}</p>
              <button
                className="secondary"
                onClick={() => {
                  setQuizIndex(0)
                  setQuizScore(0)
                  setSelectedOption(null)
                  setQuizFinished(false)
                }}
              >
                LÃ m láº¡i bÃ i kiá»ƒm tra
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
    if (!text.trim()) return note('Vui lÃ²ng viáº¿t cÃ¢u luyá»‡n táº­p trÆ°á»›c khi lÆ°u.')
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
          activity: `Grammar Drill Â· ${rule.title}`
        }
      ]
    })
    note('ÄÃ£ lÆ°u bÃ i luyá»‡n ngá»¯ phÃ¡p vÃ o Learning Record.')
  }

  return (
    <section className="stack">
      <section className="panel">
        <span className="eyebrow">IELTS GRAMMAR MASTERY (THEMATIC STRUCTURES)</span>
        <h2>Ngá»¯ phÃ¡p IELTS nÃ¢ng cao theo tá»«ng chá»§ Ä‘á»</h2>
        <TopicBar selected={selectedTopicId} onSelect={id => id !== 'all' && setSelectedTopicId(id)} collapsible />
        <TopicHeader topic={currentTopic} />
      </section>

      <div className="grammar-grid">
        {currentTopic.grammar.map(rule => (
          <div className="grammar-box" key={rule.id}>
            <div className="grammar-header">
              <h3>{rule.title}</h3>
              <span className="grammar-level">{rule.level}</span>
            </div>
            <p className="muted" style={{ margin: 0 }}>{rule.explanationVi}</p>
            <div className="grammar-formula">
              <strong>CÃ”NG THá»¨C:</strong> {rule.formula}
            </div>

            <div className="grammar-examples">
              <b>VÃ­ dá»¥ máº«u trong bÃ i thi IELTS (Band 8.0+):</b>
              {rule.examples.map((ex, i) => (
                <div key={i} className="grammar-example-item">
                  â€¢ {ex}
                </div>
              ))}
            </div>

            <div className="grammar-drill">
              <b>BÃ i táº­p luyá»‡n táº­p (Drill):</b>
              <p style={{ margin: 0, fontStyle: 'italic', color: '#c3d8cb' }}>{rule.drillPrompt}</p>
              <textarea
                className="skill-response"
                style={{ minHeight: '80px', margin: '6px 0' }}
                placeholder="Nháº­p cÃ¢u viáº¿t láº¡i hoáº·c cÃ¢u tá»± Ä‘áº·t cá»§a báº¡n..."
                value={drillAnswers[rule.id] || ''}
                onChange={e => setDrillAnswers({ ...drillAnswers, [rule.id]: e.target.value })}
              />
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  className="secondary"
                  onClick={() => setRevealed({ ...revealed, [rule.id]: !revealed[rule.id] })}
                >
                  {revealed[rule.id] ? 'áº¨n Ä‘Ã¡p Ã¡n máº«u' : 'Xem Ä‘Ã¡p Ã¡n máº«u'}
                </button>
                <button className="primary" onClick={() => saveGrammarReflection(rule)}>
                  LÆ°u bÃ i luyá»‡n táº­p
                </button>
              </div>
              {revealed[rule.id] && (
                <div className="callout" style={{ marginTop: '8px' }}>
                  <b>ÄÃ¡p Ã¡n gá»£i Ã½:</b> {rule.sampleTransform}
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
        <span className="eyebrow">{title.toUpperCase()} Â· LINKED ERROR SUPPORT</span>
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
            <span>{item.source === 'recommended' ? 'Recommended' : 'Manual'} Â· {item.date}</span>
            <h3>{item.title}</h3>
            <small>{item.skill} Â· {item.minutes} min Â· {item.reason}</small>
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
                    {new Date(item.startedAt).toLocaleString()} â†’ {new Date(item.endedAt).toLocaleString()}
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
                    {attempt.kind === 'retest' ? 'Retest' : 'Reading practice'} Â· {attempt.score}/{attempt.total}
                  </b>
                  <small>
                    {new Date(attempt.createdAt).toLocaleString()} Â· {attempt.objectiveIds.length} objectives Â·{' '}
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
                  <b>{item.skill} Â· {item.activityId}</b>
                  <small>
                    {new Date(item.createdAt).toLocaleString()} Â·{' '}
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
              Open resource â†—
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
        <p><b>Pedagogy:</b> Practice â†’ Feedback â†’ Reflection â†’ Thematic Retest & Spaced Drills.</p>
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




