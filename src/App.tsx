import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Compass,
  Home,
  ListChecks,
  Menu,
  X,
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
  Scale,
  AlertTriangle,
  Info,
  CheckCircle,
  BookOpenCheck,
  CalendarDays,
  UserRound,
  BarChart3,
  Flame
} from 'lucide-react'
import ExamLibraryView from './ExamLibraryView'
import { ActivityHeatmapHub } from './components/ActivityHeatmapHub'
import { passages } from './content'
import {
  heatLevel,
  localDate,
  mergeAttemptErrors,
  minutesByDate,
  measuredMinutes,
  measuredStreak,
  recommendations,
  scoreAttempt,
  snapshotActiveSession
} from './domain'
import { deriveReadingStates, readingDifficultyId, targetFor } from './readingEngine'
import { clearStore, loadStore } from './storage'
import { TOPICS, type TopicId, type TopicDefinition, type VocabItem, type GrammarRule } from './topicData'
import { READING_DRILLS, LISTENING_DRILLS, WRITING_DRILLS, SPEAKING_DRILLS, GRAMMAR_DRILLS, VOCAB_DRILLS, dailySelection, dayOfYear, type ReadingDrill, type ListeningDrill, type WritingDrill, type SpeakingDrill, type GrammarDrill, type VocabDrill } from './practiceBank'
import type {
  ActiveSession,
  Attempt,
  ErrorRecord,
  Page,
  Passage,
  Profile,
  Question,
  ReadingOccurrenceTarget,
  Skill,
  Store,
  StudyDestination
} from './types'
import { ForumVocabularyHub } from './components/ForumVocabularyHub'
import { ForumGrammarHub } from './components/ForumGrammarHub'
import { IELTS_SKILL_CURRICULUM, type IELTSFourSkill } from './skillCurriculum'
import { SKILL_MODEL_CONTENT } from './skillModelContent'

type NavItem = [Page, string, any]

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Tổng quan',
    items: [
      ['dashboard', 'Bảng tổng quan', Home],
      ['question-bank', 'Thư viện đề thi', BookOpenCheck],
      ['record', 'Nhật ký', Clock3]
    ]
  },
  {
    label: '4 Kỹ năng IELTS',
    items: [
      ['practice', 'Reading', BookOpen],
      ['listening', 'Listening', Volume2],
      ['writing', 'Writing', Palette],
      ['speaking', 'Speaking', Compass]
    ]
  },
  {
    label: 'Nền tảng theo chủ đề',
    items: [
      ['vocabulary', 'Từ vựng', Layers],
      ['grammar', 'Ngữ pháp ứng dụng', ListChecks]
    ]
  },
  {
    label: 'Bằng chứng & lỗi sai',
    items: [['errors', 'Bộ nhớ lỗi & Retest', RotateCcw]]
  },
  {
    label: 'Khám phá & hồ sơ',
    items: [
      ['network', 'Tài liệu ôn luyện', Network],
      ['design', 'Thiết kế hệ thống', Palette],
      ['profile', 'Mục tiêu & Hồ sơ', Settings]
    ]
  }
]

const nav = navGroups.flatMap(group => group.items)

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
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>>([])
  const [confirmDialog, setConfirmDialog] = useState<{ title: string; message: string; onConfirm: () => void; onCancel?: () => void } | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [headerNow, setHeaderNow] = useState(Date.now())

  useEffect(() => {
    if (!store.recoveryState) localStorage.setItem('ielts-optimizer-store-v1', JSON.stringify(store))
  }, [store])

  useEffect(() => {
    if (!store.activeSession || store.activeSession.paused) return
    setHeaderNow(Date.now())
    const t = setInterval(() => setHeaderNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [store.activeSession?.paused, store.activeSession?.lastResumedAt, store.activeSession?.id])

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

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  const note = (message: string) => addToast(message, 'info')

  const openConfirm = (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
    setConfirmDialog({ title, message, onConfirm, onCancel })
  }

  const closeConfirm = () => setConfirmDialog(null)

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

  const headerRunningElapsed = store.activeSession && !store.activeSession.paused
    ? Math.max(0, (headerNow - new Date(store.activeSession.lastResumedAt).getTime()) / 1000)
    : 0
  const activeSec = store.activeSession
    ? Math.max(0, store.activeSession.accumulatedSeconds + headerRunningElapsed)
    : 0

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return
      if (confirmDialog && e.key === 'Escape') {
        closeConfirm()
        return
      }
      // Number keys 1-5 navigate to main pages
      const pageMap: Record<string, Page> = {
        '1': 'dashboard',
        '2': 'practice',
        '3': 'question-bank',
        '4': 'errors',
        '5': 'record'
      }
      if (e.key in pageMap) {
        e.preventDefault()
        go(pageMap[e.key])
      }
      // '/' opens vocabulary (fast topic jump)
      if (e.key === '/') {
        e.preventDefault()
        go('vocabulary')
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [confirmDialog, go, closeConfirm])

  return (
    <div className={`app workspace-theme ${page === 'dashboard' ? 'app-dashboard' : ''}`}>
      <aside className="app-sidebar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <div>
            IELTS Optimizer
            <small>PERSONALIZED LEARNING</small>
          </div>
        </div>
        <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(true)} aria-label="Mở menu">
          <Menu size={20} />
        </button>
        <nav aria-label="Main navigation" className={mobileMenuOpen ? 'nav-mobile-open' : 'nav-mobile-closed'}>
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
        {mobileMenuOpen && (
          <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)} aria-label="Đóng menu">
            <X size={20} />
          </button>
        )}
        <div className="sidebar-note">
          <Target size={17} />
          <b>Bằng chứng trước kết luận.</b>
          <span>Dữ liệu học tập là minh chứng thực tế, không bịa điểm số.</span>
        </div>
      </aside>
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
      )}

      <main className={page === 'dashboard' ? 'dashboard-main' : ''}>
        {store.recoveryState && (
          <section className="panel" role="alert" style={{ marginBottom: '16px', borderColor: 'var(--red)' }}>
            <b>Data recovery mode</b>
            <p className="muted">{store.recoveryState.message} Reset storage only after saving the raw backup if needed.</p>
            {store.recoveryState.raw && <details><summary>Show preserved raw data</summary><pre style={{ maxHeight: '120px', overflow: 'auto' }}>{store.recoveryState.raw}</pre></details>}
          </section>
        )}
        <header className={page === 'dashboard' ? 'dashboard-header' : ''}>
          <div>
            <div className="section-kicker">
              <span>{page === 'dashboard' ? 'WORKSPACE' : 'IELTS OPTIMIZER'}</span> / {page === 'dashboard' ? 'TỔNG QUAN' : nav.find(item => item[0] === page)?.[1]}
            </div>
            <h1>{page === 'dashboard' ? 'Tổng quan học tập' : title}</h1>
            {page === 'dashboard' && <p className="dashboard-subtitle">Theo dõi thời gian học, xem lại lỗi và tiến trình gần đây của bạn.</p>}
          </div>
          <div className="header-right-tools">
            {page === 'dashboard' && <span className="dashboard-date"><CalendarDays size={18} /> {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>}
            {store.activeSession && (
              <div className="timer-live-badge" onClick={() => go('record')} title="Nhấp để xem nhật ký" role="button" tabIndex={0}>
                <span className="timer-pulse-dot" />
                <span>{store.activeSession.paused ? 'Tạm dừng: ' : 'Đang học: '}{Math.floor(activeSec / 60).toString().padStart(2, '0')}:{Math.floor(activeSec % 60).toString().padStart(2, '0')}</span>
              </div>
            )}
            {page === 'dashboard' ? (
              <button aria-label="Mở hồ sơ người học" className="learner-avatar" onClick={() => go('profile')}><UserRound size={20} /></button>
            ) : (
              <button aria-label="Cài đặt mục tiêu hồ sơ" className="icon-button" onClick={() => go('profile')}><Settings size={18} /></button>
            )}
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

          {['question-bank', 'record'].includes(page) && (
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
              aria-selected={page === 'question-bank'}
              className={`skill-quick-btn ${page === 'question-bank' ? 'active' : ''}`}
              onClick={() => go('question-bank')}
            >
              <BookOpenCheck size={15} /> <span>Thư viện đề thi (Exam Library)</span>
            </button>
            <button
              role="tab"
              aria-selected={page === 'record'}
              className={`skill-quick-btn ${page === 'record' ? 'active' : ''}`}
              onClick={() => go('record')}
            >
              <Clock3 size={15} /> <span>Nhật ký</span>
            </button>
          </div>
        )}

        {page === 'dashboard' && <Dashboard s={store} go={setPage} setS={setStore} note={note} />}
        {page === 'question-bank' && <ExamLibraryView store={store} setStore={setStore} onNavigate={setPage} addToast={addToast} />}

        {page === 'practice' && <Practice s={store} setS={setStore} note={note} targets={retestTargets} />}

        {page === 'simulator' && (
          <ExamLibraryView
            store={store}
            setStore={setStore}
            onNavigate={setPage}
            addToast={addToast}
          />
        )}
        {page === 'errors' && <Errors s={store} setS={setStore} openRetest={openRetest} note={note} go={setPage} />}
        {page === 'record' && <Record s={store} />}

        {page === 'listening' && <SkillPractice s={store} setS={setStore} note={note} skill="Listening" />}

        {page === 'writing' && <SkillPractice s={store} setS={setStore} note={note} skill="Writing" />}

        {page === 'speaking' && <SkillPractice s={store} setS={setStore} note={note} skill="Speaking" />}
        {page === 'vocabulary' && (
          <ForumVocabularyHub
            s={store}
            setS={setStore}
            note={note}
            onSwitchToGrammar={() => go('grammar')}
          />
        )}
        {page === 'grammar' && (
          <ForumGrammarHub
            s={store}
            setS={setStore}
            note={note}
            onSwitchToVocab={() => go('vocabulary')}
          />
        )}
        {page === 'network' && <LearningNetwork />}
        {page === 'design' && <LearningDesign />}
        {page === 'profile' && <Profile s={store} setS={setStore} note={note} openConfirm={openConfirm} />}
      </main>

      <ToastContainer toasts={toasts} onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))} />

      {confirmDialog && (
        <ConfirmDialog
          {...confirmDialog}
          onConfirm={() => {
            confirmDialog.onConfirm()
            closeConfirm()
          }}
          onCancel={() => {
            confirmDialog.onCancel?.()
            closeConfirm()
          }}
        />
      )}

    </div>
  )
}

/* ============================================================================
 * UX COMPONENTS — Toast, ConfirmDialog, EmptyState, MobileMenu
 * ============================================================================ */

function ToastContainer({ toasts, onDismiss }: { toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>; onDismiss: (id: string) => void }) {
  const typeIcons: Record<'success' | 'error' | 'warning' | 'info', any> = {
    success: CheckCircle,
    error: AlertTriangle,
    warning: AlertTriangle,
    info: Info
  }
  const typeColors: Record<'success' | 'error' | 'warning' | 'info', string> = {
    success: '#0e7c5b',
    error: '#c94f4f',
    warning: '#b8860b',
    info: '#4d94ff'
  }
  return (
    <div className="toast-container">
      {toasts.map(t => {
        const Icon = typeIcons[t.type]
        return (
          <div
            key={t.id}
            className={`toast toast-${t.type}`}
            role="alert"
            aria-live="polite"
            onClick={() => onDismiss(t.id)}
          >
            <Icon size={18} style={{ color: typeColors[t.type] }} />
            <span>{t.message}</span>
            <button className="toast-dismiss" onClick={() => onDismiss(t.id)} aria-label="Đóng thông báo">
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

function ConfirmDialog({ title, message, onConfirm, onCancel }: { title: string; message: string; onConfirm: () => void; onCancel?: () => void }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title} onClick={onCancel}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <AlertTriangle size={22} style={{ color: '#f4c878' }} />
          <h3>{title}</h3>
          {onCancel && <button className="modal-close" onClick={onCancel} aria-label="Đóng"><X size={20} /></button>}
        </div>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="secondary" onClick={onCancel || onConfirm}>Hủy</button>
          <button className="danger" onClick={onConfirm}>Xác nhận</button>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ icon, title, message, actionLabel, onAction }: { icon: ReactNode; title: string; message: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <section className="panel empty">
      <div className="empty-icon">{icon}</div>
      <h2>{title}</h2>
      <p className="muted">{message}</p>
      {actionLabel && onAction && (
        <button className="primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </section>
  )
}

/* ============================================================================ */

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
          {expanded ? '🙈 Ẩn chủ đề' : '🔍 Chọn chủ đề'}
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

/* ============================================================================
 * DAILY DRILL — rotating practice exercises for every skill
 * ========================================================================== */

function DailyDrillHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="panel-title" style={{ marginBottom: '14px' }}>
      <div>
        <span className="eyebrow">BÀI TẬP HẰNG NGÀY · {subtitle.toUpperCase()}</span>
        <h3>{title}</h3>
      </div>
      <span className="badge">{new Date().toLocaleDateString('vi-VN')}</span>
    </div>
  )
}

function SkillPageHeader({ skill, title, context }: { skill: IELTSFourSkill; title: string; context: string }) {
  const meta = IELTS_SKILL_CURRICULUM[skill]
  return (
    <section className="panel" style={{ borderColor: '#4e806b' }}>
      <div className="panel-title">
        <div>
          <span className="eyebrow">IELTS ACADEMIC · {skill.toUpperCase()}</span>
          <h2 style={{ marginBottom: 4 }}>{title}</h2>
          <p className="muted" style={{ margin: 0 }}>{meta.labelVi} · {context}</p>
        </div>
        <div style={{ display: 'grid', gap: 5, textAlign: 'right' }}>
          <span className="badge">{meta.format}</span>
          <span className="date-pill">Thời lượng: {meta.duration}</span>
        </div>
      </div>
      <p className="callout" style={{ margin: '14px 0 10px' }}>{meta.qualityNote}</p>
      <div className="lexicon-chip-cloud" aria-label={`${skill} assessment criteria`}>
        {meta.scoring.map(criterion => <span key={criterion} className="card-colloc-tag">{criterion}</span>)}
      </div>
    </section>
  )
}

function DailyReadingDrill() {
  const drills = dailySelection(READING_DRILLS, 1, dayOfYear())
  const drill = drills[0]
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)
  if (!drill) return null
  const answered = Object.keys(answers).length === drill.questions.length
  const correct = drill.questions.filter(q => answers[q.id] === q.answer).length
  return (
    <section className="panel" style={{ marginTop: 20 }}>
      <DailyDrillHeader title={drill.title} subtitle={`Reading · ${drill.level} · ${drill.minutes} phút`} />
      <p style={{ whiteSpace: 'pre-line', fontSize: 14, lineHeight: 1.8, color: '#c5d3ca' }}>{drill.text}</p>
      {drill.questions.map((q, qi) => (
        <div key={q.id} style={{ margin: '16px 0' }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>{qi + 1}. {q.prompt}</p>
          <div className="quiz-options">
            {q.options.map(opt => {
              let cls = ''
              if (showResult) {
                if (opt === q.answer) cls = 'correct'
                else if (answers[q.id] === opt) cls = 'wrong'
              }
              return (
                <button key={opt} className={`quiz-opt-btn ${cls}`} disabled={showResult} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}>
                  <span>{opt}</span>
                  {showResult && opt === q.answer && <span>✓</span>}
                </button>
              )
            })}
          </div>
          {showResult && <p className="feedback-line muted" style={{ marginTop: 6 }}>{q.explanation}</p>}
        </div>
      ))}
      {!showResult ? (
        <button className="primary" disabled={!answered} onClick={() => setShowResult(true)}>Kiểm tra đáp án</button>
      ) : (
        <div className="result-summary-box">
          <b>{correct}/{drill.questions.length} câu đúng</b>
          <p className="muted" style={{ margin: '6px 0 0' }}>{correct === drill.questions.length ? 'Xuất sắc!' : 'Ôn lại phần explanation ở trên nhé.'}</p>
        </div>
      )}
    </section>
  )
}

function DailyListeningDrill({ note }: { note: (msg: string) => void }) {
  const drills = dailySelection(LISTENING_DRILLS, 1, dayOfYear())
  const drill = drills[0]
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)
  if (!drill) return null
  const answered = Object.keys(answers).length === drill.questions.length
  const correct = drill.questions.filter(q => answers[q.id] === q.answer).length
  const speak = () => {
    if (!('speechSynthesis' in window)) return note('Trình duyệt không hỗ trợ phát âm.')
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(drill.audioText)
    u.lang = 'en-US'
    u.rate = 0.92
    window.speechSynthesis.speak(u)
  }
  return (
    <section className="panel" style={{ marginTop: 20 }}>
      <DailyDrillHeader title={drill.title} subtitle={`Listening · ${drill.level} · ${drill.minutes} phút`} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <button className="primary" onClick={speak}>▶ Nghe đoạn hội thoại</button>
        <button className="secondary" onClick={() => window.speechSynthesis?.pause()}>⏸ Tạm dừng</button>
        <button className="secondary" onClick={() => window.speechSynthesis?.resume()}>▶ Tiếp tục</button>
      </div>
      <p className="muted" style={{ fontSize: 12, marginBottom: 12 }}>💡 Nghe trước khi trả lời. Nếu chưa nghe rõ, bấm nghe lại.</p>
      {drill.questions.map((q, qi) => (
        <div key={q.id} style={{ margin: '14px 0' }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>{qi + 1}. {q.prompt}</p>
          <div className="quiz-options">
            {q.options.map(opt => {
              let cls = ''
              if (showResult) {
                if (opt === q.answer) cls = 'correct'
                else if (answers[q.id] === opt) cls = 'wrong'
              }
              return (
                <button key={opt} className={`quiz-opt-btn ${cls}`} disabled={showResult} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}>
                  <span>{opt}</span>
                  {showResult && opt === q.answer && <span>✓</span>}
                </button>
              )
            })}
          </div>
          {showResult && <p className="feedback-line muted" style={{ marginTop: 6 }}>{q.explanation}</p>}
        </div>
      ))}
      {!showResult ? (
        <button className="primary" disabled={!answered} onClick={() => setShowResult(true)}>Kiểm tra đáp án</button>
      ) : (
        <div className="result-summary-box">
          <b>{correct}/{drill.questions.length} câu đúng</b>
        </div>
      )}
    </section>
  )
}

function DailyWritingDrill() {
  const drills = dailySelection(WRITING_DRILLS, 1, dayOfYear())
  const drill = drills[0]
  if (!drill) return null
  return (
    <section className="panel" style={{ marginTop: 20 }}>
      <DailyDrillHeader title={drill.title} subtitle={`Writing ${drill.task} · ${drill.minutes} phút`} />
      <div className="callout" style={{ marginBottom: 14 }}>{drill.prompt}</div>
      <h4 style={{ margin: '10px 0 6px', color: '#075d52', fontWeight: 700 }}>Cấu trúc đề xuất</h4>
      <ul style={{ color: '#264253', fontSize: 13, lineHeight: 1.8, paddingLeft: 18 }}>
        {drill.structure.map((s, i) => <li key={i}>{s}</li>)}
      </ul>
      <h4 style={{ margin: '10px 0 6px', color: '#075d52', fontWeight: 700 }}>Cụm từ hay dùng</h4>
      <div className="lexicon-chip-cloud">
        {drill.keyPhrases.map((p, i) => <span key={i} className="card-colloc-tag">+ {p}</span>)}
      </div>
      <h4 style={{ margin: '10px 0 6px', color: '#b91c1c', fontWeight: 700 }}>Lỗi thường gặp</h4>
      <ul style={{ color: '#7f1d1d', fontSize: 13, lineHeight: 1.8, paddingLeft: 18 }}>
        {drill.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
      </ul>
    </section>
  )
}

function DailySpeakingDrill() {
  const drills = dailySelection(SPEAKING_DRILLS, 1, dayOfYear())
  const drill = drills[0]
  if (!drill) return null
  return (
    <section className="panel" style={{ marginTop: 20 }}>
      <DailyDrillHeader title={drill.topic} subtitle={`Speaking ${drill.part} · ${drill.minutes} phút`} />
      <div style={{ display: 'grid', gap: 8, marginBottom: 14 }}>
        {drill.questions.map((q, i) => (
          <div key={i} className="callout" style={{ margin: 0 }}>{q}</div>
        ))}
      </div>
      <h4 style={{ margin: '10px 0 6px', color: '#075d52', fontWeight: 700 }}>💡 Mẹo luyện tập</h4>
      <ul style={{ color: '#264253', fontSize: 13, lineHeight: 1.8, paddingLeft: 18 }}>
        {drill.tips.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </section>
  )
}

function DailyGrammarDrill() {
  const drills = dailySelection(GRAMMAR_DRILLS, 3, dayOfYear())
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)
  const answered = drills.every(d => answers[d.id])
  const correct = drills.filter(d => answers[d.id] === d.answer).length
  return (
    <section className="panel" style={{ marginTop: 20 }}>
      <DailyDrillHeader title="Bài tập ngữ pháp hôm nay" subtitle="Grammar · 3 câu" />
      {drills.map((drill, di) => {
        const parts = drill.sentence.split('____')
        return (
          <div key={drill.id} style={{ margin: '16px 0' }}>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>
              {di + 1}. {parts[0]}
              <span style={{ color: '#075d52', borderBottom: '2px solid #075d52', padding: '0 16px', fontWeight: 700 }}>{answers[drill.id] || '____'}</span>
              {parts[1] || ''}
            </p>
            <span className="badge">{drill.category} · {drill.level}</span>
            <div className="quiz-options" style={{ marginTop: 8 }}>
              {drill.options.map(opt => {
                let cls = ''
                if (showResult) {
                  if (opt === drill.answer) cls = 'correct'
                  else if (answers[drill.id] === opt) cls = 'wrong'
                }
                return (
                  <button key={opt} className={`quiz-opt-btn ${cls}`} disabled={showResult} onClick={() => setAnswers(prev => ({ ...prev, [drill.id]: opt }))}>
                    <span>{opt}</span>
                    {showResult && opt === drill.answer && <span>✓</span>}
                  </button>
                )
              })}
            </div>
            {showResult && <p className="feedback-line muted" style={{ marginTop: 4 }}>{drill.explanation}</p>}
          </div>
        )
      })}
      {!showResult ? (
        <button className="primary" disabled={!answered} onClick={() => setShowResult(true)}>Kiểm tra đáp án</button>
      ) : (
        <div className="result-summary-box">
          <b>{correct}/{drills.length} câu đúng</b>
        </div>
      )}
    </section>
  )
}

function DailyVocabDrill() {
  const drills = dailySelection(VOCAB_DRILLS, 4, dayOfYear())
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)
  const answered = drills.every(d => answers[d.id])
  const correct = drills.filter(d => answers[d.id] === d.answer).length
  return (
    <section className="panel" style={{ marginTop: 20 }}>
      <DailyDrillHeader title="Từ vựng chuyên sâu hôm nay" subtitle="Vocabulary · 4 từ" />
      {drills.map((drill, di) => (
        <div key={drill.id} style={{ margin: '16px 0' }}>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>{di + 1}. {drill.prompt}</p>
          <span className="badge">{drill.type}</span>
          <div className="quiz-options" style={{ marginTop: 8 }}>
            {drill.options.map(opt => {
              let cls = ''
              if (showResult) {
                if (opt === drill.answer) cls = 'correct'
                else if (answers[drill.id] === opt) cls = 'wrong'
              }
              return (
                <button key={opt} className={`quiz-opt-btn ${cls}`} disabled={showResult} onClick={() => setAnswers(prev => ({ ...prev, [drill.id]: opt }))}>
                  <span>{opt}</span>
                  {showResult && opt === drill.answer && <span>✓</span>}
                </button>
              )
            })}
          </div>
          {showResult && <p className="feedback-line muted" style={{ marginTop: 4 }}>{drill.note}</p>}
        </div>
      ))}
      {!showResult ? (
        <button className="primary" disabled={!answered} onClick={() => setShowResult(true)}>Kiểm tra đáp án</button>
      ) : (
        <div className="result-summary-box">
          <b>{correct}/{drills.length} từ đúng</b>
        </div>
      )}
    </section>
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
  const rec = recommendations(s.profile, s.attempts, s.errors, s.plan, projection.statesByDifficulty)

  const [heatmapExpanded, setHeatmapExpanded] = useState(false)

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <span className="dashboard-hero-label">LỜI NHẮN HÔM NAY</span>
          <span className="dashboard-quote-mark">“</span>
          <h2>Mỗi ngày tiến một chút,<br />rồi bạn sẽ đi xa hơn<br />mình nghĩ.</h2>
        </div>
        <span className="dashboard-recommendation-hidden"><p>{rec.reason}</p></span>
        <div className="dashboard-landscape" aria-hidden="true">
          <span className="sun" /><span className="mountain mountain-back" /><span className="mountain mountain-front" /><span className="lake" /><span className="traveller" />
        </div>
      </section>

      <LearnerProfileCard s={s} go={go} />

      <DashboardTimerCard s={s} setS={setS} note={note} />

      <RecentEvidence s={s} go={go} />

      <section className="dashboard-card activity-card activity-hub-card full-width-default">
        <ActivityHeatmapHub
          s={s}
          initialExpanded={true}
        />
      </section>
    </div>
  )
}

function LearnerProfileCard({ s, go }: { s: Store; go: (page: Page) => void }) {
  const targetBand = s.profile.targetBand || 7.0
  const currentLevel = s.profile.currentLevel || 'B2 (Intermediate)'
  const examDate = s.profile.examDate
  const daysLeft = examDate
    ? Math.max(0, Math.ceil((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  const totalMinutesAllTime = Math.round(s.sessions.reduce((acc, sess) => acc + measuredMinutes(sess), 0))
  const totalHours = Math.floor(totalMinutesAllTime / 60)
  const totalMinsRem = totalMinutesAllTime % 60
  const dailyGoal = s.profile.dailyGoalMinutes || 60
  const todayMinutes = Math.round(minutesByDate(s.sessions)[localDate(new Date().toISOString())] || 0)
  const progressPercent = Math.min(100, Math.round((todayMinutes / dailyGoal) * 100))

  const skillTargets: { skill: Skill; label: string; icon: string; band: number }[] = [
    { skill: 'Listening', label: 'Nghe', icon: '🎧', band: targetBand },
    { skill: 'Reading', label: 'Đọc', icon: '📖', band: s.profile.priority === 'Reading' ? Math.min(9, targetBand + 0.5) : targetBand },
    { skill: 'Writing', label: 'Viết', icon: '✍️', band: Math.max(6.0, targetBand - 0.5) },
    { skill: 'Speaking', label: 'Nói', icon: '🗣️', band: Math.max(6.0, targetBand - 0.5) }
  ]

  return (
    <section className="learner-profile-card">
      <div className="card-heading">
        <div className="profile-heading-main">
          <div className="profile-avatar-circle" aria-hidden="true">
            <UserRound size={20} />
          </div>
          <div>
            <h2>Hồ sơ người học</h2>
            <span className="profile-subheading">Kế hoạch cá nhân hóa</span>
          </div>
        </div>
        <button
          className="profile-settings-btn"
          onClick={() => go('profile')}
          title="Tùy chỉnh thông tin hồ sơ"
          aria-label="Cài đặt hồ sơ"
        >
          <Settings size={15} />
          <span>Cài đặt</span>
        </button>
      </div>

      <div className="profile-band-spotlight">
        <div className="band-spotlight-top">
          <div className="band-spotlight-badge">
            <span className="band-badge-label">MỤC TIÊU TỔNG QUAN</span>
            <strong className="band-badge-value">Band {targetBand.toFixed(1)}</strong>
          </div>
          <div className="band-spotlight-meta">
            <span className="band-level-tag">{currentLevel}</span>
            <span className="band-gap-text">
              Khoảng cách: <b>+{targetBand - 6.0 > 0 ? (targetBand - 6.0).toFixed(1) : '0.5'} Band</b>
            </span>
          </div>
        </div>

        <div className="profile-skills-grid">
          {skillTargets.map(item => (
            <div
              key={item.skill}
              className={`profile-skill-chip ${s.profile.priority === item.skill ? 'priority' : ''}`}
              title={`Kỹ năng ${item.label} - Mục tiêu Band ${item.band.toFixed(1)}`}
            >
              <span className="skill-chip-icon">{item.icon}</span>
              <span className="skill-chip-name">{item.label}</span>
              <b className="skill-chip-band">{item.band.toFixed(1)}</b>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-details-grid">
        <ProfileRow
          icon={<Target />}
          label="Trọng tâm ưu tiên"
          hint="Kỹ năng tập trung bứt phá"
          value={s.profile.priority || 'Reading'}
        />
        <ProfileRow
          icon={<CalendarDays />}
          label="Lịch thi IELTS"
          hint={daysLeft !== null ? `Còn ${daysLeft} ngày chuẩn bị` : 'Thời gian dự kiến'}
          value={examDate ? new Date(examDate).toLocaleDateString('vi-VN') : 'Chưa đặt lịch'}
        />
        <ProfileRow
          icon={<Clock3 />}
          label="Thời gian học mỗi ngày"
          hint={`Hôm nay đã hoàn thành ${progressPercent}%`}
          value={`~ ${Math.round(dailyGoal / 60)} giờ (${dailyGoal} phút)`}
        />
        <ProfileRow
          icon={<Award />}
          label="Tổng tích lũy thực tế"
          hint={`${s.attempts.length + (s.submissions || []).length} bài thi & hoạt động hoàn tất`}
          value={`${totalHours}h ${totalMinsRem}m`}
        />
      </div>

      <button className="profile-edit-btn" onClick={() => go('profile')}>
        <Settings size={15} />
        <span>Chỉnh sửa mục tiêu & thông tin cá nhân</span>
        <ChevronRight size={15} />
      </button>
    </section>
  )
}

function ProfileRow({ icon, label, hint, value }: { icon: ReactNode; label: string; hint: string; value: string }) {
  return (
    <div className="profile-row">
      <span className="profile-row-icon">{icon}</span>
      <span className="profile-row-copy">
        <b>{label}</b>
        <small>{hint}</small>
      </span>
      <span className="profile-row-value">{value}</span>
    </div>
  )
}

function ActivityGrid({ s, today }: { s: Store; today: number }) {
  const minutes = minutesByDate(s.sessions)
  const weekdayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  const todayDate = new Date()
  const mondayOffset = (todayDate.getDay() + 6) % 7
  const currentMonday = new Date(todayDate)
  currentMonday.setDate(todayDate.getDate() - mondayOffset)
  const cells = weekdayLabels.flatMap((_, row) => Array.from({ length: 18 }, (_, column) => {
    const date = new Date(currentMonday)
    date.setDate(currentMonday.getDate() - (17 - column) * 7 + row)
    const measured = minutes[localDate(date.toISOString())] || 0
    return measured
  }))
  return (
    <div className="activity-grid-shell" role="img" aria-label="Heatmap hoạt động học tập 18 tuần">
      <div className="activity-row-labels" aria-hidden="true">
        {weekdayLabels.map(label => <span key={label}>{label}</span>)}
      </div>
      <div className="activity-grid">
        {cells.map((value, index) => <span key={index} className={`activity-cell level-${Math.min(4, value > 90 ? 4 : value > 45 ? 3 : value > 20 ? 2 : value > 0 ? 1 : 0)}`} />)}
      </div>
    </div>
  )
}

function RecentEvidence({ s, go }: { s: Store; go: (page: Page) => void }) {
  const latestAttempt = s.attempts.slice().sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0]
  const latestSubmission = (s.submissions || []).slice().sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0]
  const latestEvidence = [
    latestAttempt ? { kind: 'attempt' as const, createdAt: latestAttempt.createdAt } : null,
    latestSubmission ? { kind: 'submission' as const, createdAt: latestSubmission.createdAt } : null
  ].filter(Boolean).sort((a, b) => Date.parse(b!.createdAt) - Date.parse(a!.createdAt))[0]
  const showAttempt = latestEvidence?.kind === 'attempt'
  const label = showAttempt ? 'Reading' : latestSubmission ? latestSubmission.skill : 'Chưa có dữ liệu'
  const date = latestEvidence?.createdAt
  const attemptNeedsReview = Boolean(latestAttempt && latestAttempt.total > 0 && latestAttempt.score < latestAttempt.total)
  return (
    <section className="dashboard-card evidence-card">
      <div className="card-heading">
        <h2>Bằng chứng học tập gần đây</h2>
        <button className="card-link" onClick={() => go('record')}>
          Xem tất cả <ChevronRight size={17} />
        </button>
      </div>
      <div className="evidence-main">
        <span className="evidence-icon"><BookOpen size={23} /></span>
        <div>
          <small>{label}　·　{date ? new Date(date).toLocaleDateString('vi-VN') : 'Chưa có dữ liệu'}</small>
          <h3>{showAttempt ? 'Kết quả Reading gần nhất' : latestSubmission ? 'Hoạt động gần nhất đã lưu' : 'Bắt đầu bài học đầu tiên'}</h3>
          <p>{showAttempt ? 'Dùng kết quả này để chọn nội dung ôn tập tiếp theo.' : latestSubmission ? 'Bằng chứng học tập đã được lưu vào hồ sơ.' : 'Hoàn thành một hoạt động để tạo bằng chứng học tập.'}</p>
        </div>
        <span className="evidence-status">{showAttempt ? (attemptNeedsReview ? 'Cần xem lại' : 'Đã hoàn thành') : latestSubmission ? 'Đã lưu' : 'Mới'}</span>
      </div>
      <div className="evidence-detail">
        <div className="evidence-detail-col">
          <span>▤ Trạng thái</span>
          <b>Paraphrase recognition</b>
        </div>
        <div className="evidence-detail-col">
          <span>▤ Câu hỏi liên quan</span>
          <b>IELTS Academic Test 1</b>
        </div>
        <div className="evidence-detail-col">
          <span>◷ Hành động tiếp theo</span>
          <b>Làm lại câu hỏi tương tự</b>
        </div>
      </div>
    </section>
  )
}

function DashboardTimerCard({
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
    setNow(Date.now())
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [active?.paused, active?.lastResumedAt, active?.id])

  const runningElapsed = active && !active.paused
    ? Math.max(0, (now - new Date(active.lastResumedAt).getTime()) / 1000)
    : 0
  const seconds = active
    ? Math.max(0, active.accumulatedSeconds + runningElapsed)
    : 0

  const minutesMap = minutesByDate(s.sessions)
  const todaySavedMinutes = Math.round(minutesMap[localDate(new Date().toISOString())] || 0)
  const currentRunningMinutes = Math.floor(seconds / 60)
  const totalTodayMinutes = todaySavedMinutes + currentRunningMinutes
  const dailyGoal = s.profile.dailyGoalMinutes || 60
  const progressPercent = Math.min(100, Math.round((totalTodayMinutes / dailyGoal) * 100))

  const currentStreak = measuredStreak(s.sessions)

  const start = () => {
    const nowMs = Date.now()
    setNow(nowMs)
    const time = new Date(nowMs).toISOString()
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
    if (active) {
      const nowMs = Date.now()
      setNow(nowMs)
      setS({ ...s, activeSession: { ...snapshotActiveSession(active, new Date(nowMs).toISOString()), paused: true } })
    }
  }

  const resume = () => {
    if (active) {
      const nowMs = Date.now()
      setNow(nowMs)
      setS({ ...s, activeSession: { ...active, lastResumedAt: new Date(nowMs).toISOString(), paused: false } })
    }
  }

  const stop = () => {
    if (!active) return
    const end = new Date().toISOString()
    const completed = snapshotActiveSession(active, end)
    const earnedMinutes = Math.max(0, Math.round(completed.accumulatedSeconds / 60))
    setS({
      ...s,
      activeSession: undefined,
      sessions: [
        ...s.sessions,
        {
          id: active.id,
          startedAt: active.startedAt,
          endedAt: end,
          minutes: earnedMinutes,
          activeIntervals: completed.activeIntervals,
          activity: 'Dashboard study session',
          skill: s.profile.priority || 'Reading'
        }
      ]
    })
    note(`Đã lưu ${earnedMinutes} phút học vào Nhật ký & Bảng tổng quan.`)
  }

  const resetTimer = () => {
    if (active) {
      setS({ ...s, activeSession: undefined })
      note('Đã đặt lại bộ đếm giờ.')
    }
  }

  const hours = Math.floor(seconds / 3600).toString().padStart(2, '0')
  const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0')

  return (
    <section className="dashboard-card timer-card expanded-timer-card">
      <div className="card-heading">
        <div className="timer-heading-title">
          <h2>Bộ đếm giờ học</h2>
          <span className={`timer-status-chip ${active ? (active.paused ? 'paused' : 'live') : 'idle'}`}>
            <span className="status-dot" />
            {active ? (active.paused ? 'Đang tạm dừng' : 'Đang tính giờ') : 'Sẵn sàng'}
          </span>
        </div>
        <button
          className="timer-help-btn"
          onClick={() => note('Bộ đếm giờ tự động tạm dừng khi bạn chuyển tab hoặc rời ứng dụng để phản ánh chính xác thời gian học thực tế.')}
          title="Thông tin cơ chế đếm giờ"
          aria-label="Cơ chế đếm giờ"
        >
          <HelpCircle size={17} />
        </button>
      </div>

      <div className="timer-screen-container">
        <div className="timer-clock-badge">
          <Clock3 size={18} />
          <span>{active ? (active.paused ? 'Phiên đang tạm dừng' : 'Phiên học đang tính giờ thực tế') : 'Bấm Bắt đầu để tính giờ học'}</span>
        </div>

        <div className="timer-display-frame">
          <strong className="timer-digits-expanded">
            {hours}:{mins}:{secs}
          </strong>
        </div>
      </div>

      <div className="timer-goal-progress-box">
        <div className="goal-progress-labels">
          <span className="goal-label-title">Tiến độ mục tiêu hôm nay</span>
          <span className="goal-label-stat">
            <b>{totalTodayMinutes}</b> / {dailyGoal} phút ({progressPercent}%)
          </span>
        </div>
        <div className="goal-progress-bar-track">
          <div
            className="goal-progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="timer-main-controls">
        {!active ? (
          <button className="timer-btn-primary" onClick={() => start()}>
            <Play size={19} fill="currentColor" />
            <span>Bắt đầu học ngay</span>
          </button>
        ) : (
          <div className="timer-active-actions">
            <button
              className="timer-btn-primary"
              onClick={active.paused ? resume : pause}
            >
              {active.paused ? <Play size={19} fill="currentColor" /> : <Pause size={19} fill="currentColor" />}
              <span>{active.paused ? 'Tiếp tục' : 'Tạm dừng'}</span>
            </button>
            <button
              className="timer-btn-save"
              onClick={stop}
              title="Lưu phiên học này vào Nhật ký"
            >
              <CheckCircle2 size={18} />
              <span>Lưu phiên</span>
            </button>
            <button
              className="timer-btn-reset"
              onClick={resetTimer}
              title="Đặt lại bộ đếm giờ"
              aria-label="Đặt lại bộ đếm giờ"
            >
              <RotateCcw size={17} />
            </button>
          </div>
        )}
      </div>

      <div className="timer-quick-stats">
        <div className="timer-stat-col">
          <span className="stat-label">Đã học hôm nay</span>
          <b className="stat-val">{totalTodayMinutes} phút</b>
        </div>
        <div className="timer-stat-divider" />
        <div className="timer-stat-col">
          <span className="stat-label">Chuỗi chuyên cần</span>
          <b className="stat-val">🔥 {currentStreak} ngày</b>
        </div>
        <div className="timer-stat-divider" />
        <div className="timer-stat-col">
          <span className="stat-label">Kỹ năng phiên</span>
          <b className="stat-val">{s.profile.priority || 'Reading'}</b>
        </div>
      </div>
    </section>
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
    setNow(Date.now())
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [active?.paused, active?.lastResumedAt, active?.id])

  useEffect(() => {
    if (!active || active.paused) return
    const timer = setInterval(() => {
      const snapshot = snapshotActiveSession(active, new Date().toISOString())
      if (snapshot !== active) setS({ ...s, activeSession: snapshot })
    }, 5000)
    return () => clearInterval(timer)
  }, [active, s, setS])

  const runningElapsed = active && !active.paused
    ? Math.max(0, (now - new Date(active.lastResumedAt).getTime()) / 1000)
    : 0
  const seconds = active
    ? Math.max(0, active.accumulatedSeconds + runningElapsed)
    : 0

  const start = () => {
    const nowMs = Date.now()
    setNow(nowMs)
    const time = new Date(nowMs).toISOString()
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
    const nowMs = Date.now()
    setNow(nowMs)
    setS({
      ...s,
      activeSession: { ...snapshotActiveSession(active, new Date(nowMs).toISOString()), paused: true }
    })
  }

  const resume = () => {
    if (active) {
      const nowMs = Date.now()
      setNow(nowMs)
      setS({
        ...s,
        activeSession: { ...active, lastResumedAt: new Date(nowMs).toISOString(), paused: false }
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
        <b>{Math.round(s.sessions.reduce((total, item) => total + measuredMinutes(item), 0))} min</b>
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
              <strong>{Math.round(measuredMinutes(item))} min</strong>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted">Your saved practice, reflections and study time will appear here.</p>
      )}

      <div style={{ marginTop: '24px' }}>
        <Heatmap s={s} />
      </div>
    </section>
  )
}

function Heatmap({ s }: { s: Store }) {
  return (
    <div className="record-heatmap-wrapper" style={{ marginTop: '16px' }}>
      <ActivityHeatmapHub s={s} initialExpanded={true} />
    </div>
  )
}

/* ===== YEAR HEATMAP ===== */
/**
 * Yearly heatmap: all 12 months in a wrapped grid, no horizontal scrolling.
 * Each month is a compact sub-grid of weeks × 7 day-cells.
 */
function YearHeatmap({ s }: { s: Store }) {
  const map = minutesByDate(s.sessions)
  const key = (date: Date) => localDate(date.toISOString())
  const today = new Date()
  const year = today.getFullYear()
  const goal = s.profile.dailyGoalMinutes || 0

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  const monthVietnamese = [
    'Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6',
    'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'
  ]

  const monthBlocks = monthNames.map((mName, mIndex) => {
    const monthStart = new Date(year, mIndex, 1)
    const leadingBlanks = monthStart.getDay()
    const daysInMonth = new Date(year, mIndex + 1, 0).getDate()
    const totalCells = leadingBlanks + daysInMonth
    const weekCount = Math.ceil(totalCells / 7)

    const cells = []
    for (let i = 0; i < weekCount * 7; i++) {
      const absoluteDay = i - leadingBlanks + 1
      const isOutside = absoluteDay < 1 || absoluteDay > daysInMonth
      const date = isOutside ? null : new Date(year, mIndex, absoluteDay)
      cells.push({ date, isOutside })
    }
    return { mName, mVietnamese: monthVietnamese[mIndex], mIndex, cells, weekCount }
  })

  const yearTotal = Object.values(map).reduce((a, b) => a + b, 0)
  const activeDays = Object.values(map).filter(v => v > 0).length

  return (
    <section className="panel heatmap-panel year-view">
      <div className="heatmap-year-header">
        <div className="heatmap-year-title">
          <span className="eyebrow">BẢN ĐỒ NĂNG SUẤT NĂM</span>
          <h2>{year}</h2>
        </div>
        <div className="heatmap-year-stats">
          <span className="stat"><b>{yearTotal.toFixed(0)}</b> phút hoạt động</span>
          <span className="stat"><b>{activeDays}</b> ngày có hoạt động</span>
        </div>
      </div>

      <div className="heatmap-year-grid">
        {monthBlocks.map(block => (
          <div key={block.mIndex} className="heatmap-month-block">
            <div className="heatmap-month-name">{block.mVietnamese}</div>
            <div className="heatmap-month-grid">
              {block.cells.map((cell, i) => {
                if (cell.isOutside) {
                  return <div key={i} className="heat heat-l0 outside-month" />
                }
                const dateKey = key(cell.date!)
                const value = map[dateKey] || 0
                const rest = s.profile.daysOff.includes(dateKey)
                return (
                  <div
                    key={i}
                    aria-label={`${dateKey}: ${Math.round(value)} phút hoạt động${rest ? ', ngày nghỉ đã kế hoạch' : ''}`}
                    title={`${dateKey}: ${Math.round(value)} phút`}
                    className={`heat heat-l${heatLevel(value, goal)} ${rest ? 'rest-day' : ''}`}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="heatmap-year-legend">
        <span>Ít</span>
        {[0, 1, 2, 3, 4, 5].map(level => (
          <i key={level} className={`heat heat-l${level}`} aria-label={`Mức ${level}`} />
        ))}
        <span>Nhiều</span>
      </div>

      <div className="heatmap-year-summary">
        <span><b>{yearTotal.toFixed(0)}</b> tổng phút hoạt động trong năm {year}</span>
        <span><b>{activeDays}</b> / 365 ngày có hoạt động</span>
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
  const [topicFilter, setTopicFilter] = useState<TopicId>('education')
  const [selectedPassageId, setSelectedPassageId] = useState<string>(
    passages.find(p => p.topicId === 'education')?.id || passages[0].id
  )

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

  const filteredPassages = passages.filter(p => p.topicId === topicFilter && !p.id.includes('-retest'))
  const selectedTopic = TOPICS.find(topic => topic.id === topicFilter) || TOPICS[0]

  const passage = isRetestMode
    ? retestPassage
    : filteredPassages.find(p => p.id === selectedPassageId) || filteredPassages[0]

  useEffect(() => {
    if (isRetestMode || !filteredPassages.length) return
    if (!filteredPassages.some(item => item.id === selectedPassageId)) {
      setSelectedPassageId(filteredPassages[0].id)
    }
  }, [filteredPassages, isRetestMode, selectedPassageId])

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
      errors: nextErrors
    })
    setSubmitted(true)
    note(isRetestMode ? 'Retest evidence recorded.' : 'Reading attempt saved.')
  }

  return (
    <section className="stack">
      <SkillPageHeader
        skill="Reading"
        title={isRetestMode ? 'Reading Retest · bài tương đương' : passage.title}
        context={passage.topicTitle || 'Bài đọc theo chủ đề'}
      />
      {!isRetestMode && (
        <>
        <section className="panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">CHỦ ĐỀ ĐỌC HIỂU (READING BY TOPIC)</span>
              <h2>Chọn chủ đề ôn tập (Reading)</h2>
            </div>
          </div>
          <TopicBar selected={topicFilter} onSelect={id => id !== 'all' && setTopicFilter(id)} collapsible />
          <TopicHeader
            topic={selectedTopic}
            extraBadge={<span className="badge">{filteredPassages.length} bài luyện tập</span>}
          />
        </section>

        <section className="panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">BÀI ĐỌC THEO CHỦ ĐỀ</span>
              <h2>Chọn bài đọc</h2>
            </div>
            <span className="badge">{filteredPassages.length} bài</span>
          </div>
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
        </>
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
                  Chiến lược rút ra (nên ghi sau mỗi bài)
                  <textarea
                    placeholder="Ví dụ: Mình nhầm False/Not Given vì chưa tìm câu bằng chứng; lần sau sẽ scan theo paraphrase..."
                    value={reflection}
                    onChange={e => setReflection(e.target.value)}
                  />
                </label>
                <button
                  className="secondary"
                  disabled={!reflection.trim()}
                  onClick={() => {
                    const lastAttempt = s.attempts[s.attempts.length - 1]
                    if (!lastAttempt) return
                    setS({ ...s, attempts: s.attempts.map(attempt => attempt.id === lastAttempt.id ? { ...attempt, reflection: { nextStep: reflection.trim() } } : attempt) })
                    note('Đã lưu chiến lược rút ra vào Learning Record.')
                  }}
                >
                  Lưu chiến lược
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {!isRetestMode && <DailyReadingDrill />}
    </section>
  )
}

type SimulationSkill = 'Listening' | 'Reading' | 'Writing' | 'Speaking'
type SimulationQuestion = { id: string; prompt: string; options: string[]; answer: string; explanation: string; audioText?: string }

const SIMULATION_QUESTIONS: Record<'Listening' | 'Reading', SimulationQuestion[]> = {
  Listening: TOPICS.flatMap((topic) =>
    topic.listening.questions.map((q) => ({
      id: `${topic.id}-${q.id}`,
      prompt: q.prompt,
      options: q.options,
      answer: q.answer,
      explanation: q.explanation,
      audioText: topic.listening.audioText,
    }))
  ),
  Reading: passages.flatMap((passage) =>
    passage.questions.map((q) => ({
      id: `${passage.id}-${q.id}`,
      prompt: q.prompt,
      options: q.options,
      answer: q.answer,
      explanation: q.explanation,
    }))
  ),
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
    if (!started || submitted) return
    const timer = window.setInterval(() => {
      setSeconds(value => {
        if (value <= 1) {
          window.clearInterval(timer)
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [started, submitted])

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
  const playAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const audioText = SIMULATION_QUESTIONS.Listening[0]?.audioText ?? TOPICS[0].listening.audioText
      const u = new SpeechSynthesisUtterance(audioText)
      u.lang = 'en-US'
      window.speechSynthesis.speak(u)
    }
  }
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const secs = (seconds % 60).toString().padStart(2, '0')

  return <section className="stack">
    <section className="panel simulator-hero">
      <span className="eyebrow">IELTS COMPUTER-STYLE SIMULATION</span><h2>Phòng thi mô phỏng</h2>
      <p className="muted">Nội dung tự biên soạn theo format IELTS: timer, media, câu hỏi, nộp bài và review. Đề gốc bên ngoài không được sao chép vào ứng dụng.</p>
      <div className="study-modes">{(['Listening', 'Reading', 'Writing', 'Speaking'] as SimulationSkill[]).map(item => <button key={item} className={`mode-tab ${skill === item ? 'active' : ''}`} onClick={() => selectSkill(item)}>{item}</button>)}</div>
    </section>
    {!started ? <section className="panel simulator-start">
      <div className="simulator-spec"><b>{skill}</b><span>{skill === 'Listening' ? '4 parts · 24 questions · 30 minutes' : skill === 'Reading' ? `4 passages · ${SIMULATION_QUESTIONS.Reading.length} questions · 60 minutes` : skill === 'Writing' ? 'Task 1 + Task 2 · 60 minutes' : 'Part 1 + Part 2 + Part 3 · 11–14 minutes'}</span></div>
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
  const [speakingSeconds, setSpeakingSeconds] = useState(120)
  const [speakingActive, setSpeakingActive] = useState(false)

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
    setSpeakingActive(false)
    setSpeakingSeconds(120)
  }, [activityId, draft])

  useEffect(() => {
    if (!prepActive) return
    const timer = setInterval(() => {
      setPrepSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setPrepActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [prepActive])

  useEffect(() => {
    if (!speakingActive) return
    const timer = setInterval(() => {
      setSpeakingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setSpeakingActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [speakingActive])

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
  const writingWordTarget = writingTaskType === 'task1' ? 150 : 250
  const paragraphCount = response.split(/\n\s*\n/).filter(Boolean).length
  const sentenceCount = response.split(/[.!?]+/).filter(sentence => sentence.trim()).length

  const feedback =
    skill === 'Writing'
      ? [
          wordCount >= writingWordTarget
            ? `Task coverage: ${wordCount}/${writingWordTarget} từ — đạt mốc luyện tập tối thiểu.`
            : `Task coverage: ${wordCount}/${writingWordTarget} từ — tiếp tục phát triển ý, chưa chỉ kéo dài câu.`,
          /however|therefore|consequently|furthermore|in contrast|nevertheless/i.test(response)
            ? 'Coherence: linking transitions identified.'
            : 'Coherence: incorporate clear transitions between argumentative points.',
          paragraphCount >= (writingTaskType === 'task1' ? 3 : 4)
            ? `Coherence: ${paragraphCount} đoạn có thể rà soát theo chức năng.`
            : `Coherence: hiện có ${paragraphCount} đoạn; hãy tách bài thành ${writingTaskType === 'task1' ? '3' : '4'} phần rõ ràng.`,
          sentenceCount >= 5
            ? `Grammar range: ${sentenceCount} câu — kiểm tra xen kẽ câu đơn, câu ghép và câu phức.`
            : 'Grammar range: hãy viết đủ câu để có thể kiểm tra sự đa dạng cấu trúc.',
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
      submissions: [...(s.submissions || []), submission]
    })
    note(`${skill} evidence saved to Learning Record.`)
  }

  const history = (s.submissions || []).filter(item => item.skill === skill && item.activityId.includes(selectedTopicId)).slice().reverse()
  const modelContent = SKILL_MODEL_CONTENT[currentTopic.id]

  return (
    <section className="stack">
      <SkillPageHeader
        skill={skill}
        title={`${skill} · ${currentTopic.titleEn}`}
        context={`Chủ đề: ${currentTopic.titleVi}`}
      />
      <section className="panel">
        <span className="eyebrow">{skill.toUpperCase()} · THEMATIC STUDY UNITS</span>
        <h2>Chọn chủ đề ôn tập ({skill})</h2>
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
              className="audio-speed-select"
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
            <summary className="transcript-summary-toggle">
              Hiện phụ đề bài nghe (Transcript fallback)
            </summary>
            <p className="callout" style={{ marginTop: '8px' }}>
              {currentTopic.listening.audioText}
            </p>
          </details>

          {/* Listening Comprehension Check */}
          <div className="listening-quiz-section">
            <h4>Kiểm tra mức độ nghe hiểu ({currentTopic.listening.questions.length} câu)</h4>
            {currentTopic.listening.questions.map((q, qIndex) => (
              <div key={q.id} className="listening-quiz-card">
                <p className="listening-quiz-prompt">
                  {qIndex + 1}. {q.prompt}
                </p>
                <div className="listening-quiz-options">
                  {q.options.map(opt => (
                    <label key={opt} className={`quiz-option-label ${quizAnswers[q.id] === opt ? 'chosen' : ''}`}>
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
                  <div className={`feedback ${quizAnswers[q.id] === q.answer ? 'correct' : 'incorrect'}`} style={{ marginTop: '10px' }}>
                    <b>{quizAnswers[q.id] === q.answer ? '✓ Đúng' : '✗ Chưa đúng'}</b>
                    <span>Đáp án: {q.answer}</span>
                    <small>{q.explanation}</small>
                  </div>
                )}
              </div>
            ))}
            <button className="primary" onClick={() => setShowQuizResult(true)}>
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
              {currentTopic.writing.task1 ? (
                <>
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
                </>
              ) : (
                <>
                  <span className="badge">Writing Task 1</span>
                  <h3>{currentTopic.writing.task1Prompt}</h3>
                  <p className="callout">{currentTopic.writing.task1Prompt}</p>
                </>
              )}
            </div>
          ) : (
            <div>
              {currentTopic.writing.task2 ? (
                <>
                  <span className="badge">{currentTopic.writing.task2.essayType}</span>
                  <h3>{currentTopic.writing.task2.title}</h3>
                  <p className="callout">{currentTopic.writing.task2.prompt}</p>
                  <div style={{ margin: '12px 0' }}>
                    <b>Gợi ý dàn bài (Outline suggestions):</b>
                    {currentTopic.writing.task2.outlineIdeas.map((idea, i) => (
                      <p key={i} className="muted" style={{ margin: '4px 0' }}>• {idea}</p>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <span className="badge">Writing Task 2</span>
                  <h3>{currentTopic.writing.task2Prompt}</h3>
                  <p className="callout">{currentTopic.writing.task2Prompt}</p>
                </>
              )}
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
            {wordCount}/{writingWordTarget} từ tối thiểu · {paragraphCount} đoạn · {sentenceCount} câu · Tự động lưu nháp
          </p>

          {writingTaskType === 'task2' && modelContent?.writingTask2 && (
            <details className="callout" style={{ margin: '12px 0' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 700 }}>Mở đoạn mẫu có chú thích sau khi tự viết</summary>
              <h4 style={{ marginBottom: 6 }}>{modelContent.writingTask2.title}</h4>
              <p style={{ lineHeight: 1.75 }}>{modelContent.writingTask2.text}</p>
              <ul style={{ marginBottom: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                {modelContent.writingTask2.notes.map(noteText => <li key={noteText}>{noteText}</li>)}
              </ul>
            </details>
          )}

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
                <p style={{ fontStyle: 'italic', color: '#075d52', fontWeight: 600 }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '10px 0 16px' }}>
                <span className="badge">Speaking timer: {Math.floor(speakingSeconds / 60)}:{String(speakingSeconds % 60).padStart(2, '0')}</span>
                <button
                  className={speakingActive ? 'danger' : 'secondary'}
                  onClick={() => {
                    if (speakingSeconds === 0) setSpeakingSeconds(120)
                    setSpeakingActive(active => !active)
                  }}
                >
                  {speakingActive ? 'Dừng đồng hồ nói' : speakingSeconds === 120 ? 'Bắt đầu nói 2 phút' : speakingSeconds === 0 ? 'Làm lại 2 phút' : 'Tiếp tục nói'}
                </button>
                <small className="muted">Nói liên tục, không đọc bài viết hoàn chỉnh.</small>
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
              {currentTopic.speaking.collocations?.map((colloc, i) => (
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
            placeholder={speakingPart === 'part2' ? 'Ghi 4 từ khóa trước khi nói; sau đó dán transcript hoặc ghi chú câu trả lời...' : 'Dán transcript hoặc ghi chú câu trả lời của bạn vào đây...'}
          />
          {speakingPart === 'part2' && modelContent?.speakingPart2 && (
            <details className="callout" style={{ margin: '12px 0' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 700 }}>Mở bản nói mẫu có chú thích sau khi tự ghi âm</summary>
              <h4 style={{ marginBottom: 6 }}>{modelContent.speakingPart2.title}</h4>
              <p style={{ lineHeight: 1.75 }}>{modelContent.speakingPart2.text}</p>
              <ul style={{ marginBottom: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                {modelContent.speakingPart2.notes.map(noteText => <li key={noteText}>{noteText}</li>)}
              </ul>
            </details>
          )}
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

      {skill === 'Listening' && <DailyListeningDrill note={note} />}
      {skill === 'Writing' && <DailyWritingDrill />}
      {skill === 'Speaking' && <DailySpeakingDrill />}
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
        <TopicBar selected={selectedTopicId} onSelect={id => id !== 'all' && setSelectedTopicId(id)} collapsible />
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

      {/* MODE 1: FLASHCARD (Inspired by ForumFlash) */}
      {mode === 'flashcard' && currentWord && (
        <div className="flashcard-stage">
          <div className="flashcard-header">
            <span className="eyebrow">TỪ VỰNG THEO CHỦ ĐỀ</span>
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
              <button
                className="flip-btn"
                aria-label="Lật thẻ"
                onClick={e => {
                  e.stopPropagation()
                  setFlipped(!flipped)
                }}
              >
                ↻ Lật thẻ
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
                  <div className="card-example">
                    <span className="card-example-label">Ví dụ trong ngữ cảnh</span>
                    <span className="card-example-text">“{currentWord.example}”</span>
                  </div>
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
              <small className="muted">Thẻ {cardIndex + 1} / {vocabList.length}</small>
              <small style={{ color: '#075d52', fontWeight: 600 }}>{flipped ? 'Mặt sau (Nghĩa)' : 'Mặt trước (Từ)'}</small>
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
              <ArrowLeft size={20} />
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
              <div className="card-example">
                <span className="card-example-label">Ví dụ trong ngữ cảnh</span>
                <span className="card-example-text">“{currentWord.example}”</span>
              </div>
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

      <DailyVocabDrill />
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
      submissions: [...(s.submissions || []), submission]
    })
    note('Đã lưu bài luyện ngữ pháp vào Learning Record.')
  }

  return (
    <section className="stack">
      <section className="panel">
        <span className="eyebrow">IELTS GRAMMAR MASTERY (THEMATIC STRUCTURES)</span>
        <h2>Ngữ pháp IELTS nâng cao theo từng chủ đề</h2>
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

      <DailyGrammarDrill />
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

function Record({
  s
}: {
  s: Store
}) {
  return (
    <section className="stack">
      <section className="panel">
        <h2>Learning Record</h2>
        <p className="muted">Lưu lại lịch sử các buổi học tập đã thực hiện.</p>
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
  note,
  openConfirm
}: {
  s: Store
  setS: (store: Store) => void
  note: (message: string) => void
  openConfirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => void
}) {
  const [profile, setLocalProfile] = useState<Profile>(s.profile)

  const save = () => {
    setS({ ...s, profile })
    note('Profile updated.')
  }

  const resetAll = () => {
    openConfirm('Xóa toàn bộ dữ liệu học tập?', 'Hành động này sẽ xóa tất cả bài làm, lỗi, nhật ký và tiến độ. Không thể hoàn tác.', () => {
      const cleared = clearStore()
      setS(loadStore())
      note(cleared ? 'Đã xóa toàn bộ dữ liệu học tập.' : 'Không thể xóa một số khóa dữ liệu.')
    })
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
