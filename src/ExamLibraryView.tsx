import { useState, useMemo, useEffect, useRef } from 'react'
import {
  BookOpen,
  Volume2,
  PenTool,
  Mic,
  Clock,
  Award,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Flag,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  RotateCcw,
  Sparkles,
  Check,
  Play,
  Pause,
  VolumeX,
  FastForward,
  HelpCircle,
  Search,
  Layers,
  Send,
  ListChecks
} from 'lucide-react'
import type { Store, Page, Attempt, ErrorRecord, SkillSubmission, Question } from './types'
import { mergeAttemptErrors } from './domain'
import {
  IELTS_EXAM_COLLECTIONS,
  type FullIELTSExam,
  type ExamPassage,
  type FullListeningSection,
  type WritingStimulusData,
  calculateAcademicReadingBand,
  calculateListeningBand
} from './examLibraryData'
import { uiSectionAsset } from './uiAssets'

interface Props {
  store: Store
  setStore: (updater: Store | ((prev: Store) => Store)) => void
  onNavigate: (page: Page) => void
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}

function countExamQuestions(exam: FullIELTSExam): number {
  return exam.reading.passages.reduce((total, passage) => total + passage.questions.length, 0)
    + exam.listening.sections.reduce((total, section) => total + section.questions.length, 0)
}

function examSpecSummary(exam: FullIELTSExam) {
  return {
    listening: `${exam.listening.sections.length} Sections · ${exam.listening.totalQuestions} Câu hỏi · ${exam.listening.timeAllowedMinutes} Phút`,
    reading: `${exam.reading.passages.length} Passages · ${exam.reading.totalQuestions} Câu hỏi · ${exam.reading.timeAllowedMinutes} Phút`,
    writing: `Task 1 & Task 2 · ${exam.writing.timeAllowedMinutes} Phút`,
    speaking: 'Part 1 · Part 2 (Cue Card) · Part 3'
  }
}

function Task1StimulusChart({ data }: { data?: WritingStimulusData }) {
  if (!data) return null
  const colors = ['#075d52', '#3b82f6', '#d97706', '#7c3aed', '#db2777', '#65a30d']
  const maxValue = Math.max(...data.series.flatMap(series => series.values), 1)

  if (data.visualization === 'table') {
    return (
      <div className="task1-stimulus-visual task1-data-table-wrap">
        <table className="task1-data-table">
          <caption>Actual figures ({data.unit})</caption>
          <thead>
            <tr><th scope="col">Series</th>{data.categories.map(category => <th scope="col" key={category}>{category}</th>)}</tr>
          </thead>
          <tbody>
            {data.series.map(series => (
              <tr key={series.label}>
                <th scope="row">{series.label}</th>
                {series.values.map((value, index) => <td key={`${series.label}-${index}`}>{value}{data.unit === '%' ? '%' : ''}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const chartWidth = 720
  const chartHeight = 300
  const left = 48
  const right = 16
  const top = 18
  const bottom = 42
  const plotWidth = chartWidth - left - right
  const plotHeight = chartHeight - top - bottom
  const xStep = data.categories.length > 1 ? plotWidth / (data.categories.length - 1) : plotWidth
  const y = (value: number) => top + plotHeight - (value / maxValue) * plotHeight
  const x = (index: number) => left + (data.categories.length > 1 ? index * xStep : plotWidth / 2)

  return (
    <div className="task1-stimulus-visual">
      <svg className="task1-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={`Task 1 ${data.visualization} chart in ${data.unit}`}>
        {[0, .25, .5, .75, 1].map(ratio => {
          const gridY = top + plotHeight - ratio * plotHeight
          return <line key={ratio} x1={left} x2={chartWidth - right} y1={gridY} y2={gridY} className="task1-chart-grid" />
        })}
        {data.visualization === 'bar' ? data.categories.map((category, categoryIndex) => {
          const groupWidth = plotWidth / data.categories.length
          const barWidth = Math.min(28, (groupWidth * .72) / data.series.length)
          const start = left + categoryIndex * groupWidth + (groupWidth - barWidth * data.series.length) / 2
          return (
            <g key={category}>
              {data.series.map((series, seriesIndex) => {
                const value = series.values[categoryIndex] || 0
                const barX = start + seriesIndex * barWidth
                return <rect key={series.label} x={barX} y={y(value)} width={Math.max(4, barWidth - 2)} height={top + plotHeight - y(value)} rx="2" fill={colors[seriesIndex % colors.length]}><title>{series.label}: {value}{data.unit}</title></rect>
              })}
              <text x={left + categoryIndex * groupWidth + groupWidth / 2} y={chartHeight - 16} textAnchor="middle" className="task1-chart-label">{category}</text>
            </g>
          )
        }) : data.series.map((series, seriesIndex) => {
          const points = series.values.map((value, index) => `${x(index)},${y(value)}`).join(' ')
          return (
            <g key={series.label}>
              <polyline points={points} fill="none" stroke={colors[seriesIndex % colors.length]} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
              {series.values.map((value, index) => <circle key={index} cx={x(index)} cy={y(value)} r="4" fill={colors[seriesIndex % colors.length]}><title>{series.label}: {value}{data.unit}</title></circle>)}
            </g>
          )
        })}
        {data.visualization === 'line' && data.categories.map((category, index) => <text key={category} x={x(index)} y={chartHeight - 16} textAnchor="middle" className="task1-chart-label">{category}</text>)}
      </svg>
      <div className="task1-chart-legend">
        {data.series.map((series, index) => <span key={series.label}><i style={{ background: colors[index % colors.length] }} />{series.label}</span>)}
      </div>
      <small className="task1-chart-unit">Unit: {data.unit}</small>
    </div>
  )
}

export default function ExamLibraryView({ store, setStore, onNavigate, addToast }: Props) {
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null)
  const [activeExamMode, setActiveExamMode] = useState<'reading' | 'listening' | 'writing' | 'speaking' | null>(null)
  const [selectedModule, setSelectedModule] = useState<'All' | 'Academic' | 'General Training'>('All')
  const [searchTerm, setSearchTerm] = useState('')

  const activeExam = useMemo(() => {
    return IELTS_EXAM_COLLECTIONS.find(e => e.id === selectedExamId) || null
  }, [selectedExamId])

  const filteredExams = useMemo(() => {
    return IELTS_EXAM_COLLECTIONS.filter(e => {
      const matchMod = selectedModule === 'All' || e.module === selectedModule
      const matchSearch =
        !searchTerm.trim() ||
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.volume.toLowerCase().includes(searchTerm.toLowerCase())
      return matchMod && matchSearch
    })
  }, [selectedModule, searchTerm])

  const formatReferenceExam = IELTS_EXAM_COLLECTIONS[0]
  const referenceSpec = formatReferenceExam ? examSpecSummary(formatReferenceExam) : null

  // Router for active exam modes
  if (activeExam && activeExamMode === 'reading') {
    return (
      <FullReadingExamSimulator
        exam={activeExam}
        store={store}
        setStore={setStore}
        onExit={() => {
          setActiveExamMode(null)
          setSelectedExamId(null)
        }}
        addToast={addToast}
      />
    )
  }

  if (activeExam && activeExamMode === 'listening') {
    return (
      <FullListeningExamSimulator
        exam={activeExam}
        store={store}
        setStore={setStore}
        onExit={() => {
          setActiveExamMode(null)
          setSelectedExamId(null)
        }}
        addToast={addToast}
      />
    )
  }

  if (activeExam && activeExamMode === 'writing') {
    return (
      <FullWritingExamSimulator
        exam={activeExam}
        store={store}
        setStore={setStore}
        onExit={() => {
          setActiveExamMode(null)
          setSelectedExamId(null)
        }}
        addToast={addToast}
      />
    )
  }

  if (activeExam && activeExamMode === 'speaking') {
    return (
      <FullSpeakingExamSimulator
        exam={activeExam}
        store={store}
        setStore={setStore}
        onExit={() => {
          setActiveExamMode(null)
          setSelectedExamId(null)
        }}
        addToast={addToast}
      />
    )
  }

  return (
    <div className="stack exam-library-view" style={{ gap: 20 }}>
      {/* Header Banner - Modeled after IELTS Online Tests Exam Library */}
      <div className="hero-card exam-library-hero" style={{ minHeight: 'auto', padding: '24px 28px' }}>
        <div className="exam-library-hero-copy">
          <span className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={14} /> IELTS EXAM LIBRARY — MÔ PHỎNG FORMAT IELTS
          </span>
          <h1 style={{ fontSize: 26, margin: '8px 0 10px' }}>Thư viện đề luyện tập sát format thi thật</h1>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', maxWidth: 740, lineHeight: 1.6 }}>
            Mỗi bộ đề là <strong>nội dung tự biên soạn theo cấu trúc IELTS</strong>:
            Reading ({referenceSpec?.reading || 'cấu trúc theo bộ đề'}), Listening ({referenceSpec?.listening || 'cấu trúc theo bộ đề'}),
            Writing ({referenceSpec?.writing || 'Task 1 & Task 2'}) và Speaking ({referenceSpec?.speaking || 'Part 1, 2, 3'}). Có đồng hồ đếm ngược,
            thanh điều hướng theo câu hỏi,
            chấm điểm Reading/Listening theo thang Band tham khảo và trích dẫn bằng chứng từ bài.
            Đây không phải đề chính thức của IELTS.
          </p>
        </div>
        <div className="exam-library-hero-art" aria-hidden="true">
          <img src={uiSectionAsset('exam-library')} alt="" />
        </div>
        <div className="header-meta exam-library-hero-stats" style={{ gap: 24 }}>
          <div className="exam-library-stat" style={{ textAlign: 'right' }}>
            <strong style={{ fontSize: 30, fontFamily: 'Space Grotesk', color: 'var(--mint)' }}>
              {IELTS_EXAM_COLLECTIONS.length}
            </strong>
            <small style={{ display: 'block', color: 'var(--muted)' }}>Bộ đề hoàn chỉnh</small>
          </div>
          <div className="exam-library-stat" style={{ textAlign: 'right' }}>
            <strong style={{ fontSize: 30, fontFamily: 'Space Grotesk', color: 'var(--accent)' }}>
              {IELTS_EXAM_COLLECTIONS.reduce((total, exam) => total + countExamQuestions(exam), 0)}
            </strong>
            <small style={{ display: 'block', color: 'var(--muted)' }}>Câu Reading + Listening</small>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div
        className="panel exam-library-filters"
        style={{
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div className="exam-library-module-tabs" role="tablist" aria-label="Lọc module đề thi" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['All', 'Academic', 'General Training'] as const).map(mod => {
            const isActive = selectedModule === mod
            return (
              <button
                key={mod}
                type="button"
                onClick={() => setSelectedModule(mod)}
                aria-pressed={isActive}
                className={`exam-library-module-tab ${isActive ? 'active' : ''}`}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: isActive ? 'var(--mint)' : 'var(--line)',
                  background: isActive ? '#b9f2c318' : '#14201c',
                  color: isActive ? 'var(--mint)' : '#b9c8c0',
                  transition: 'all 0.15s ease'
                }}
              >
                {mod === 'All' ? 'Tất cả các bộ đề' : `IELTS ${mod}`}
              </button>
            )
          })}
        </div>

        <div className="exam-library-filter-tools" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="exam-library-search" style={{ position: 'relative', minWidth: 240 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--muted)' }} />
            <label className="sr-only" htmlFor="exam-library-search">Tìm kiếm đề thi</label>
            <input
              id="exam-library-search"
              type="text"
              placeholder="Tìm kiếm đề thi, mã đề..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 12px 7px 32px',
                borderRadius: 8,
                fontSize: 12,
                background: '#14201c',
                border: '1px solid var(--line)',
                color: '#f0f8f1'
              }}
            />
            {searchTerm && (
              <button type="button" className="exam-library-clear-search" onClick={() => setSearchTerm('')} aria-label="Xóa tìm kiếm">×</button>
            )}
          </div>
          <span className="exam-library-format-note" style={{ fontSize: 12, color: 'var(--muted)' }} role="status" aria-live="polite">
            {filteredExams.length} bộ đề · Mô phỏng thi trên máy tính
          </span>
        </div>
      </div>

      {/* Exam Collection Grid */}
      <div className="exam-library-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {filteredExams.length === 0 ? (
          <div className="exam-library-empty panel">
            <img src={uiSectionAsset('empty-map')} alt="" aria-hidden="true" />
            <h2>Không tìm thấy bộ đề phù hợp</h2>
            <p>Thử xóa từ khóa hoặc chọn lại module để xem các bộ đề đang có.</p>
            <button type="button" className="secondary" onClick={() => { setSearchTerm(''); setSelectedModule('All') }}>
              Xóa bộ lọc
            </button>
          </div>
        ) : filteredExams.map(exam => {
          const specs = examSpecSummary(exam)
          return (
          <div
            key={exam.id}
            className="panel exam-library-card"
            style={{
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 16,
              borderColor: '#304a3e',
              background: '#121e1a'
            }}
          >
            <div>
              {/* Volume & Code Meta */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 11,
                  color: 'var(--muted)',
                  marginBottom: 8
                }}
              >
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{exam.volume}</span>
                <span className="exam-code-badge" style={{ fontFamily: 'monospace', background: '#1c2e27', padding: '2px 6px', borderRadius: 4 }}>
                  {exam.code}
                </span>
              </div>

              {/* Title */}
              <div className="exam-library-card-title">
                <img src={uiSectionAsset('mock-test-paper')} alt="" aria-hidden="true" />
                <div>
                  <h2 style={{ fontSize: 20, margin: '0 0 4px', color: '#f0f8f1' }}>{exam.title}</h2>
                  <span className="exam-library-card-subtitle">{exam.module} · {countExamQuestions(exam)} câu Reading + Listening</span>
                </div>
              </div>

              {/* Exam specs summary */}
              <div style={{ display: 'grid', gap: 8, fontSize: 12, color: '#c5d3ca', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Volume2 size={15} color="var(--accent)" />
                  <span>
                    <strong>Listening:</strong> {specs.listening} (Có Audio)
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BookOpen size={15} color="var(--mint)" />
                  <span>
                    <strong>Reading:</strong> {specs.reading}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PenTool size={15} color="#74c0fc" />
                  <span>
                    <strong>Writing:</strong> {specs.writing}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Mic size={15} color="#e599f7" />
                  <span>
                    <strong>Speaking:</strong> {specs.speaking} · Phỏng vấn
                  </span>
                </div>
              </div>

              {/* Community statistics */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 11,
                  color: 'var(--muted)',
                  borderTop: '1px solid var(--line)',
                  paddingTop: 10
                }}
              >
                <span>Nội dung tự biên soạn</span>
                <span aria-hidden="true">·</span>
                <span>Không sử dụng đề có bản quyền</span>
                <span aria-hidden="true">·</span>
                <span style={{ color: 'var(--mint)' }}>Mô phỏng thi trên máy tính</span>
              </div>
            </div>

            {/* Action Buttons for Each Skill or Full Test */}
            <div className="exam-card-actions" style={{ display: 'grid', gap: 8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  type="button"
                  className="primary"
                  onClick={() => {
                    setSelectedExamId(exam.id)
                    setActiveExamMode('reading')
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '10px 8px',
                    fontSize: 12,
                    fontWeight: 700
                  }}
                >
                  <BookOpen size={14} /> Full Reading ({exam.reading.totalQuestions} câu)
                </button>

                <button
                  type="button"
                  className="primary"
                  onClick={() => {
                    setSelectedExamId(exam.id)
                    setActiveExamMode('listening')
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '10px 8px',
                    fontSize: 12,
                    fontWeight: 700,
                    background: '#e5a842',
                    color: '#122019'
                  }}
                >
                  <Volume2 size={14} /> Full Listening ({exam.listening.totalQuestions} câu)
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setSelectedExamId(exam.id)
                    setActiveExamMode('writing')
                  }}
                  style={{ fontSize: 12, padding: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <PenTool size={13} /> Làm Writing (T1+T2)
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setSelectedExamId(exam.id)
                    setActiveExamMode('speaking')
                  }}
                  style={{ fontSize: 12, padding: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <Mic size={13} /> Làm Speaking (P1-3)
                </button>
              </div>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}

// =========================================================================
// 1. FULL READING EXAM SIMULATOR (collection-defined passages/questions/time)
// =========================================================================

interface ReadingSimulatorProps {
  exam: FullIELTSExam
  store: Store
  setStore: (updater: Store | ((prev: Store) => Store)) => void
  onExit: () => void
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}

function FullReadingExamSimulator({ exam, store, setStore, onExit, addToast }: ReadingSimulatorProps) {
  const [activePassageIndex, setActivePassageIndex] = useState<0 | 1 | 2>(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())
  const [secondsLeft, setSecondsLeft] = useState<number>(() => exam.reading.timeAllowedMinutes * 60)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [confirmExitOpen, setConfirmExitOpen] = useState(false)
  const [mobileSimulatorTab, setMobileSimulatorTab] = useState<'passage' | 'questions'>('passage')
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const handleSubmitRef = useRef<(() => void) | null>(null)

  // Flatten all 40 questions in order 1..40
  const allQuestions = useMemo(() => {
    return exam.reading.passages.flatMap(p => p.questions).sort((a, b) => a.number - b.number)
  }, [exam])

  // Timer countdown
  useEffect(() => {
    handleSubmitRef.current = handleSubmitTest
  })
  useEffect(() => {
    if (isSubmitted) return
    const t = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(t)
          handleSubmitRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [isSubmitted])

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleFlag = (qNum: number) => {
    setFlaggedQuestions(prev => {
      const next = new Set(prev)
      if (next.has(qNum)) next.delete(qNum)
      else next.add(qNum)
      return next
    })
  }

  const jumpToQuestion = (qNum: number) => {
    const targetQ = allQuestions.find(q => q.number === qNum)
    if (!targetQ) return

    const targetPassageIndex = ((targetQ.passageNumber || 1) - 1) as 0 | 1 | 2
    if (activePassageIndex !== targetPassageIndex) {
      setActivePassageIndex(targetPassageIndex)
    }
    setMobileSimulatorTab('questions')

    setTimeout(() => {
      questionRefs.current[qNum]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  const handleSubmitTest = () => {
    let rawScore = 0
    const attemptId = `full-reading-attempt-${Date.now()}`

    allQuestions.forEach(q => {
      const learnerAns = (answers[q.id] || '').trim().toLowerCase()
      const correctAns = q.answerKey.trim().toLowerCase()
      const isCorrect = learnerAns === correctAns

      if (isCorrect) {
        rawScore++
      }
    })

    const bandScore = calculateAcademicReadingBand(rawScore)

    const newAttempt: Attempt = {
      id: attemptId,
      passageId: exam.id,
      skill: 'Reading',
      answers,
      score: rawScore,
      total: allQuestions.length,
      kind: 'practice',
      createdAt: new Date().toISOString(),
      objectiveIds: allQuestions.map(q => `reading:${exam.id}:passage-${q.passageNumber || 1}`)
    }

    const engineQuestions: Question[] = allQuestions.map(q => ({
      id: q.id,
      type: (q.type as Question['type']) || 'multiple-choice',
      prompt: q.prompt,
      options: q.options || [],
      answer: q.answerKey,
      explanation: q.explanation,
      objective: `reading:${exam.id}:passage-${q.passageNumber || 1}`
    }))
    const nextErrors = mergeAttemptErrors(store.errors, newAttempt, engineQuestions)
    setStore(prev => ({
      ...prev,
      attempts: [newAttempt, ...prev.attempts],
      errors: nextErrors
    }))

    setIsSubmitted(true)
    addToast(`Bài thi Reading hoàn tất! Điểm thô: ${rawScore}/${allQuestions.length} — Đạt Band ${bandScore.toFixed(1)}`, 'success')
  }

  const answeredCount = Object.keys(answers).length
  const rawScore = useMemo(() => {
    return allQuestions.reduce((acc, q) => {
      const userAns = (answers[q.id] || '').trim().toLowerCase()
      return userAns === q.answerKey.trim().toLowerCase() ? acc + 1 : acc
    }, 0)
  }, [allQuestions, answers])

  const calculatedBand = calculateAcademicReadingBand(rawScore)
  const activePassage = exam.reading.passages[activePassageIndex]

  if (isSubmitted) {
    return (
      <div className="stack exam-simulator exam-simulator-reading exam-simulator-result" data-state="submitted" style={{ gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="secondary"
            onClick={onExit}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <ArrowLeft size={14} /> Trở về Thư viện đề thi
          </button>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Mã bài thi: {exam.code}</span>
        </div>

        <div className="panel exam-result-hero" style={{ padding: 26, background: '#13211c', borderColor: '#355342' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16
            }}
          >
            <div>
          <span className="eyebrow">BÁO CÁO KẾT QUẢ THI THỬ READING ({allQuestions.length} CÂU HOÀN CHỈNH)</span>
              <h2 style={{ fontSize: 24, margin: '6px 0 10px' }}>{exam.title}</h2>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: 13 }}>
                Thời gian làm bài: {formatTimer(exam.reading.timeAllowedMinutes * 60 - secondsLeft)} · Hoàn thành: {answeredCount}/{allQuestions.length} câu hỏi
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, textAlign: 'center' }}>
              <div className="exam-result-metric exam-result-raw" style={{ padding: '10px 18px', background: '#182922', borderRadius: 10, border: '1px solid var(--line)' }}>
                <span style={{ fontSize: 11, color: 'var(--muted)', display: 'block' }}>Điểm số thô (Raw)</span>
                <strong style={{ fontSize: 26, fontFamily: 'Space Grotesk', color: '#f0f8f1' }}>
                  {rawScore} <small style={{ fontSize: 14, color: 'var(--muted)' }}>/ {allQuestions.length}</small>
                </strong>
              </div>

              <div className="exam-result-metric exam-result-band" style={{ padding: '10px 22px', background: '#b9f2c318', borderRadius: 10, border: '1px solid var(--mint)' }}>
                <span style={{ fontSize: 11, color: 'var(--mint)', display: 'block', fontWeight: 600 }}>ƯỚC LƯỢNG BAND</span>
                <strong style={{ fontSize: 32, fontFamily: 'Space Grotesk', color: 'var(--mint)' }}>
                  {calculatedBand.toFixed(1)}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed question breakdown */}
        <div className="panel exam-result-review" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 17, marginBottom: 16 }}>Bảng phân tích đáp án & Bằng chứng chi tiết ({allQuestions.length} Câu)</h3>

          <div className="stack" style={{ gap: 14 }}>
            {allQuestions.map(q => {
              const userAns = answers[q.id] || '(bỏ trống)'
              const isCorrect = userAns.trim().toLowerCase() === q.answerKey.trim().toLowerCase()

              return (
                <div
                  key={q.id}
                  className={`exam-result-review-item ${isCorrect ? 'is-correct' : 'is-incorrect'}`}
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    background: isCorrect ? '#0e442922' : '#3d1a1822',
                    border: `1px solid ${isCorrect ? '#26a64155' : '#ff998a55'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 11,
                          fontWeight: 700,
                          background: isCorrect ? 'var(--mint)' : 'var(--red)',
                          color: '#122019'
                        }}
                      >
                        {q.number}
                      </span>
                      <strong style={{ fontSize: 13, color: isCorrect ? 'var(--mint)' : 'var(--red)' }}>
                        {isCorrect ? 'Chính xác' : 'Chưa chính xác'}
                      </strong>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>Passage {q.passageNumber}</span>
                  </div>

                  <p style={{ margin: '6px 0 10px', fontSize: 13, color: '#f0f8f1', fontWeight: 500 }}>{q.prompt}</p>

                  <div style={{ display: 'flex', gap: 16, fontSize: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span>
                      Câu trả lời của bạn:{' '}
                      <strong style={{ color: isCorrect ? 'var(--mint)' : 'var(--red)' }}>{userAns}</strong>
                    </span>
                    {!isCorrect && (
                      <span>
                        Đáp án đúng: <strong style={{ color: 'var(--mint)' }}>{q.answerKey}</strong>
                      </span>
                    )}
                  </div>

                  <p style={{ margin: '0 0 4px', fontSize: 12, color: '#c5d3ca' }}>
                    <strong>Giải thích:</strong> {q.explanation}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: '#9bc4aa', fontStyle: 'italic' }}>
                    <strong>Bằng chứng từ bài đọc:</strong> "{q.evidenceQuote}"
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Active Reading Test Workspace
  return (
    <div className="stack exam-simulator exam-simulator-reading" data-state="active" style={{ gap: 14 }}>
      {/* Top Exam Navigation Bar */}
      <div
        className="panel exam-simulator-toolbar exam-runner-status"
        style={{
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: '#14201c',
          borderBottom: '1px solid #304a3e'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            className="secondary"
            onClick={() => setConfirmExitOpen(true)}
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            Thoát bài thi
          </button>
          <div>
            <strong style={{ fontSize: 14, color: '#f0f8f1', display: 'block' }}>{exam.title}</strong>
            <small style={{ color: 'var(--muted)', fontSize: 11 }}>{exam.module} Reading · {allQuestions.length} Câu hỏi ({exam.reading.passages.length} Passages)</small>
          </div>
        </div>

        {/* Passage Switcher Tabs */}
        <div style={{ display: 'flex', gap: 6 }}>
          {exam.reading.passages.map((p, idx) => (
            <button
              key={p.passageNumber}
              type="button"
              onClick={() => setActivePassageIndex(idx as any)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                border: '1px solid',
                borderColor: activePassageIndex === idx ? 'var(--mint)' : 'var(--line)',
                background: activePassageIndex === idx ? '#b9f2c322' : '#111a17',
                color: activePassageIndex === idx ? 'var(--mint)' : '#b9c8c0'
              }}
            >
              Passage {p.passageNumber}
            </button>
          ))}
        </div>

        {/* Countdown Timer & Submit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 8,
              background: secondsLeft < 300 ? '#ff998a22' : secondsLeft < 600 ? '#f4c87822' : '#111a17',
              border: `1px solid ${secondsLeft < 300 ? 'var(--red)' : secondsLeft < 600 ? 'var(--accent)' : 'var(--line)'}`
            }}
          >
            <Clock size={16} color={secondsLeft < 300 ? 'var(--red)' : 'var(--mint)'} />
            <strong
              style={{
                fontFamily: 'Space Grotesk',
                fontSize: 16,
                color: secondsLeft < 300 ? 'var(--red)' : 'var(--mint)'
              }}
            >
              {formatTimer(secondsLeft)}
            </strong>
          </div>

          <button
            type="button"
            className="primary"
            onClick={handleSubmitTest}
            style={{ padding: '8px 18px', fontWeight: 700 }}
          >
            Nộp bài thi ({answeredCount}/{allQuestions.length})
          </button>
        </div>
      </div>

      {/* Mobile Reading Simulator Tab Bar */}
      <div className="mobile-reading-tab-bar" role="tablist" aria-label="Chuyển chế độ xem di động">
        <button
          type="button"
          role="tab"
          aria-selected={mobileSimulatorTab === 'passage'}
          className={`mobile-tab-btn ${mobileSimulatorTab === 'passage' ? 'active' : ''}`}
          onClick={() => setMobileSimulatorTab('passage')}
        >
          <BookOpen size={16} />
          <span>Bài đọc Passage {activePassage.passageNumber}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileSimulatorTab === 'questions'}
          className={`mobile-tab-btn ${mobileSimulatorTab === 'questions' ? 'active' : ''}`}
          onClick={() => setMobileSimulatorTab('questions')}
        >
          <ListChecks size={16} />
          <span>Câu hỏi ({answeredCount}/{allQuestions.length})</span>
        </button>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="practice-layout" style={{ alignItems: 'stretch' }}>
        {/* Left Column: Full Reading Passage */}
        <div
          className={`panel passage ${mobileSimulatorTab === 'passage' ? 'mobile-pane-active' : 'mobile-pane-hidden'}`}
          style={{
            maxHeight: '74vh',
            overflowY: 'auto',
            padding: 26,
            lineHeight: 1.85,
            fontSize: 14,
            color: '#c5d3ca'
          }}
        >
          <span className="eyebrow">READING PASSAGE {activePassage.passageNumber}</span>
          <h2 style={{ fontSize: 20, margin: '8px 0 16px', color: '#f0f8f1' }}>{activePassage.title}</h2>
          {activePassage.text.split('\n\n').map((para, i) => (
            <p key={i} style={{ marginBottom: 16 }}>
              {para}
            </p>
          ))}
          <button
            type="button"
            className="primary full mobile-only-action"
            style={{ marginTop: 20 }}
            onClick={() => setMobileSimulatorTab('questions')}
          >
            Làm câu hỏi Passage {activePassage.passageNumber} →
          </button>
        </div>

        {/* Right Column: Questions for Active Passage */}
        <div
          className={`panel questions ${mobileSimulatorTab === 'questions' ? 'mobile-pane-active' : 'mobile-pane-hidden'}`}
          style={{ maxHeight: '74vh', overflowY: 'auto', padding: 24 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
            <h3 style={{ fontSize: 16, margin: 0 }}>
              Passage {activePassage.passageNumber} — Questions ({activePassage.questions.length})
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                className="secondary mobile-only-action"
                onClick={() => setMobileSimulatorTab('passage')}
                style={{ fontSize: 12, padding: '6px 10px' }}
              >
                <BookOpen size={13} /> Đọc bài
              </button>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                Đã trả lời:{' '}
                {activePassage.questions.filter(q => Boolean(answers[q.id])).length}/{activePassage.questions.length}
              </span>
            </div>
          </div>

          <div className="stack" style={{ gap: 20 }}>
            {activePassage.questions.map(q => {
              const isFlagged = flaggedQuestions.has(q.number)
              const userAns = answers[q.id] || ''

              return (
                <div
                  key={q.id}
                  ref={el => {
                    questionRefs.current[q.number] = el
                  }}
                  className="question"
                  style={{
                    borderTop: '1px solid var(--line)',
                    paddingTop: 16,
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div className="question-top">
                      <b>{q.number}</b>
                      <span>{q.type.toUpperCase()}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFlag(q.number)}
                      style={{
                        background: 'transparent',
                        border: 0,
                        cursor: 'pointer',
                        color: isFlagged ? 'var(--accent)' : 'var(--muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11
                      }}
                      title="Gắn cờ để kiểm tra lại câu hỏi này sau"
                    >
                      <Flag size={13} fill={isFlagged ? 'var(--accent)' : 'none'} />
                      <span>{isFlagged ? 'Đã gắn cờ' : 'Gắn cờ review'}</span>
                    </button>
                  </div>

                  <h4 style={{ margin: '8px 0 12px', fontSize: 14, fontWeight: 600, color: '#e7f3e9' }}>{q.prompt}</h4>

                  {q.type === 'multiple-choice' && q.options && (
                    <div className="options">
                      {q.options.map((opt, optIndex) => {
                        const isChosen = userAns === opt
                        return (
                          <label key={optIndex} className={isChosen ? 'chosen' : ''}>
                            <input
                              type="radio"
                              name={q.id}
                              value={opt}
                              checked={isChosen}
                              onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                            />
                            <span>{opt}</span>
                          </label>
                        )
                      })}
                    </div>
                  )}

                  {q.type === 'true-false-not-given' && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '8px 0' }}>
                      {['TRUE', 'FALSE', 'NOT GIVEN'].map(val => {
                        const isChosen = userAns === val
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setAnswers(prev => ({ ...prev, [q.id]: val }))}
                            style={{
                              padding: '8px 16px',
                              borderRadius: 7,
                              fontSize: 12,
                              fontWeight: 600,
                              border: '1px solid',
                              borderColor: isChosen ? 'var(--mint)' : 'var(--line)',
                              background: isChosen ? '#b9f2c322' : '#14201c',
                              color: isChosen ? 'var(--mint)' : '#b9c8c0'
                            }}
                          >
                            {val}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {q.type === 'sentence-completion' && !q.options && (
                    <div className="options">
                      <label style={{ display: 'block' }}>
                        <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
                          Nhập câu trả lời (không phân biệt hoa thường)
                        </span>
                        <input
                          type="text"
                          name={q.id}
                          value={userAns}
                          onChange={event => setAnswers(prev => ({ ...prev, [q.id]: event.target.value }))}
                          placeholder="Nhập câu trả lời…"
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: 7,
                            border: '1px solid var(--line)',
                            background: '#14201c',
                            color: '#e7f3e9',
                            fontSize: 13
                          }}
                        />
                      </label>
                    </div>
                  )}

                  {q.type === 'sentence-completion' && q.options && (
                    <div className="options">
                      {q.options.map((opt, optIndex) => {
                        const isChosen = userAns === opt
                        return (
                          <label key={optIndex} className={isChosen ? 'chosen' : ''}>
                            <input
                              type="radio"
                              name={q.id}
                              value={opt}
                              checked={isChosen}
                              onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                            />
                            <span>{opt}</span>
                          </label>
                        )
                      })}
                    </div>
                  )}

                  {q.type === 'matching-headings' && (
                    <div className="options">
                      <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
                        Chọn heading phù hợp nhất cho đoạn văn/{q.prompt}
                      </span>
                      {(activePassage.headingBank || []).map((h) => {
                        const isChosen = userAns === h.label
                        return (
                          <label key={h.label} className={isChosen ? 'chosen' : ''}>
                            <input
                              type="radio"
                              name={q.id}
                              value={h.label}
                              checked={isChosen}
                              onChange={() => setAnswers(prev => ({ ...prev, [q.id]: h.label }))}
                            />
                            <span>{h.label.toUpperCase()}. {h.text}</span>
                          </label>
                        )
                      })}
                    </div>
                  )}

                  {q.type === 'summary-completion' && (
                    <div className="options">
                      {q.promptDetail && (
                        <p style={{ margin: '0 0 8px', fontSize: 13, color: '#c5d3ca', fontStyle: 'italic' }}>
                          {q.promptDetail}
                        </p>
                      )}
                      <label style={{ display: 'block' }}>
                        <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
                          Nhập câu trả lời (không phân biệt hoa thường)
                        </span>
                        <input
                          type="text"
                          name={q.id}
                          value={userAns}
                          onChange={event => setAnswers(prev => ({ ...prev, [q.id]: event.target.value }))}
                          placeholder="Nhập câu trả lời…"
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: 7,
                            border: '1px solid var(--line)',
                            background: '#14201c',
                            color: '#e7f3e9',
                            fontSize: 13
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom 1..40 Question Palette */}
      <div
        className="panel"
        style={{
          padding: '12px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          background: '#111a17',
          borderTop: '1px solid #304a3e'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--muted)' }}>
          <div style={{ display: 'flex', gap: 14 }}>
            <span>Đã làm: <strong style={{ color: 'var(--mint)' }}>{answeredCount}/{allQuestions.length}</strong></span>
            <span>Gắn cờ: <strong style={{ color: 'var(--accent)' }}>{flaggedQuestions.size}</strong></span>
          </div>
          <span>Bấm vào số câu để chuyển nhanh đến câu hỏi tương ứng</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(28px, 1fr))',
            gap: 6
          }}
        >
          {allQuestions.map(q => {
            const isAnswered = Boolean(answers[q.id])
            const isFlagged = flaggedQuestions.has(q.number)

            return (
              <button
                key={q.number}
                type="button"
                onClick={() => jumpToQuestion(q.number)}
                style={{
                  height: 32,
                  padding: 0,
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: 'Space Grotesk',
                  border: '1px solid',
                  borderColor: isFlagged ? 'var(--accent)' : isAnswered ? 'var(--mint)' : 'var(--line)',
                  background: isAnswered ? '#b9f2c322' : '#18241f',
                  color: isAnswered ? 'var(--mint)' : '#b9c8c0',
                  position: 'relative'
                }}
              >
                {q.number}
                {isFlagged && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: 'var(--accent)'
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Confirm Exit Modal */}
      {confirmExitOpen && (
        <div className="modal-overlay">
          <div className="modal-panel">
            <h3>Xác nhận thoát bài thi Reading?</h3>
            <p className="modal-message">
              Tiến trình làm bài thi này sẽ không được lưu nếu bạn thoát trước khi nhấn Nộp bài thi.
            </p>
            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => setConfirmExitOpen(false)}>
                Tiếp tục làm bài
              </button>
              <button type="button" className="danger" onClick={onExit}>
                Rời khỏi bài thi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// =========================================================================
// 2. FULL LISTENING EXAM SIMULATOR (collection-defined sections/questions/time)
// =========================================================================

interface ListeningSimulatorProps {
  exam: FullIELTSExam
  store: Store
  setStore: (updater: Store | ((prev: Store) => Store)) => void
  onExit: () => void
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}

function FullListeningExamSimulator({ exam, store, setStore, onExit, addToast }: ListeningSimulatorProps) {
  const [activeSectionIndex, setActiveSectionIndex] = useState<0 | 1 | 2 | 3>(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())
  const [secondsLeft, setSecondsLeft] = useState<number>(() => exam.listening.timeAllowedMinutes * 60)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [confirmExitOpen, setConfirmExitOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [playedSections, setPlayedSections] = useState<Set<number>>(new Set())
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const handleSubmitRef = useRef<(() => void) | null>(null)

  const listeningPaper = exam.listening

  const allQuestions = useMemo(() => {
    return listeningPaper.sections.flatMap(s => s.questions).sort((a, b) => a.number - b.number)
  }, [listeningPaper])

  const activeSection = listeningPaper.sections[activeSectionIndex]

  // Timer countdown
  useEffect(() => {
    handleSubmitRef.current = handleSubmitTest
  })
  useEffect(() => {
    if (isSubmitted) return
    const t = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(t)
          handleSubmitRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [isSubmitted])

  // Speech synthesis audio playback for authentic simulation
  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()

    if (isPlaying && !playedSections.has(activeSection.sectionNumber)) {
      const cleanTranscript = activeSection.transcript.replace(/^[A-Za-z0-9\.\s'-]{1,30}:\s*/gm, '')
      const utterance = new SpeechSynthesisUtterance(cleanTranscript)
      utterance.rate = 1
      utterance.lang = 'en-GB'
      utterance.onend = () => {
        setIsPlaying(false)
        setPlayedSections(prev => new Set(prev).add(activeSection.sectionNumber))
      }
      utterance.onerror = () => setIsPlaying(false)
      window.speechSynthesis.speak(utterance)
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isPlaying, activeSectionIndex, activeSection.sectionNumber, playedSections])

  const startAudio = () => {
    if (playedSections.has(activeSection.sectionNumber)) return
    setIsPlaying(true)
  }

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleFlag = (qNum: number) => {
    setFlaggedQuestions(prev => {
      const next = new Set(prev)
      if (next.has(qNum)) next.delete(qNum)
      else next.add(qNum)
      return next
    })
  }

  const jumpToQuestion = (qNum: number) => {
    const targetQ = allQuestions.find(q => q.number === qNum)
    if (!targetQ) return

    const targetSectionIndex = ((targetQ.sectionNumber || 1) - 1) as 0 | 1 | 2 | 3
    if (activeSectionIndex !== targetSectionIndex) {
      setActiveSectionIndex(targetSectionIndex)
      if (isPlaying) {
        window.speechSynthesis.cancel()
        setIsPlaying(false)
      }
    }

    setTimeout(() => {
      questionRefs.current[qNum]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  const handleSubmitTest = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsPlaying(false)

    let rawScore = 0
    const attemptId = `full-listening-attempt-${Date.now()}`

    allQuestions.forEach(q => {
      const learnerAns = (answers[q.id] || '').trim().toLowerCase()
      const correctAns = q.answerKey.trim().toLowerCase()
      const isCorrect = learnerAns === correctAns

      if (isCorrect) {
        rawScore++
      }
    })

    const bandScore = calculateListeningBand(rawScore)

    const newAttempt: Attempt = {
      id: attemptId,
      passageId: exam.id,
      skill: 'Listening',
      answers,
      score: rawScore,
      total: allQuestions.length,
      kind: 'practice',
      createdAt: new Date().toISOString(),
      objectiveIds: allQuestions.map(q => `listening:${exam.id}:section-${q.sectionNumber || 1}`)
    }

    const engineQuestions: Question[] = allQuestions.map(q => ({
      id: q.id,
      type: (q.type as Question['type']) || 'multiple-choice',
      prompt: q.prompt,
      options: q.options || [],
      answer: q.answerKey,
      explanation: q.explanation,
      objective: `listening:${exam.id}:section-${q.sectionNumber || 1}`
    }))
    const nextErrors = mergeAttemptErrors(store.errors, newAttempt, engineQuestions)
    setStore(prev => ({
      ...prev,
      attempts: [newAttempt, ...prev.attempts],
      errors: nextErrors
    }))

    setIsSubmitted(true)
    addToast(`Bài thi Listening hoàn tất! Điểm thô: ${rawScore}/${allQuestions.length} — Đạt Band ${bandScore.toFixed(1)}`, 'success')
  }

  const answeredCount = Object.keys(answers).length
  const rawScore = useMemo(() => {
    return allQuestions.reduce((acc, q) => {
      const userAns = (answers[q.id] || '').trim().toLowerCase()
      return userAns === q.answerKey.trim().toLowerCase() ? acc + 1 : acc
    }, 0)
  }, [allQuestions, answers])

  const calculatedBand = calculateListeningBand(rawScore)

  if (isSubmitted) {
    return (
      <div className="stack exam-simulator exam-simulator-listening exam-simulator-result" data-state="submitted" style={{ gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="secondary"
            onClick={onExit}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <ArrowLeft size={14} /> Trở về Thư viện đề thi
          </button>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Mã bài thi: {exam.code}</span>
        </div>

        <div className="panel exam-result-hero" style={{ padding: 26, background: '#13211c', borderColor: '#355342' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16
            }}
          >
            <div>
          <span className="eyebrow">BÁO CÁO KẾT QUẢ THI THỬ LISTENING ({allQuestions.length} CÂU HOÀN CHỈNH)</span>
              <h2 style={{ fontSize: 24, margin: '6px 0 10px' }}>{exam.title} — Listening Paper</h2>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: 13 }}>
                Thời gian làm bài: {formatTimer(exam.listening.timeAllowedMinutes * 60 - secondsLeft)} · Hoàn thành: {answeredCount}/{allQuestions.length} câu hỏi
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, textAlign: 'center' }}>
              <div className="exam-result-metric exam-result-raw" style={{ padding: '10px 18px', background: '#182922', borderRadius: 10, border: '1px solid var(--line)' }}>
                <span style={{ fontSize: 11, color: 'var(--muted)', display: 'block' }}>Điểm số thô (Raw)</span>
                <strong style={{ fontSize: 26, fontFamily: 'Space Grotesk', color: '#f0f8f1' }}>
                  {rawScore} <small style={{ fontSize: 14, color: 'var(--muted)' }}>/ {allQuestions.length}</small>
                </strong>
              </div>

              <div className="exam-result-metric exam-result-band" style={{ padding: '10px 22px', background: '#e5a84218', borderRadius: 10, border: '1px solid #e5a842' }}>
                <span style={{ fontSize: 11, color: '#e5a842', display: 'block', fontWeight: 600 }}>ƯỚC LƯỢNG BAND</span>
                <strong style={{ fontSize: 32, fontFamily: 'Space Grotesk', color: '#e5a842' }}>
                  {calculatedBand.toFixed(1)}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed question breakdown */}
        <div className="panel exam-result-review" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 17, marginBottom: 16 }}>Bảng phân tích đáp án & Bằng chứng Audio Transcript ({allQuestions.length} Câu)</h3>

          <div className="stack" style={{ gap: 14 }}>
            {allQuestions.map(q => {
              const userAns = answers[q.id] || '(bỏ trống)'
              const isCorrect = userAns.trim().toLowerCase() === q.answerKey.trim().toLowerCase()

              return (
                <div
                  key={q.id}
                  className={`exam-result-review-item ${isCorrect ? 'is-correct' : 'is-incorrect'}`}
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    background: isCorrect ? '#0e442922' : '#3d1a1822',
                    border: `1px solid ${isCorrect ? '#26a64155' : '#ff998a55'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 11,
                          fontWeight: 700,
                          background: isCorrect ? 'var(--mint)' : 'var(--red)',
                          color: '#122019'
                        }}
                      >
                        {q.number}
                      </span>
                      <strong style={{ fontSize: 13, color: isCorrect ? 'var(--mint)' : 'var(--red)' }}>
                        {isCorrect ? 'Chính xác' : 'Chưa chính xác'}
                      </strong>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>Section {q.sectionNumber}</span>
                  </div>

                  <p style={{ margin: '6px 0 10px', fontSize: 13, color: '#f0f8f1', fontWeight: 500 }}>{q.prompt}</p>

                  <div style={{ display: 'flex', gap: 16, fontSize: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span>
                      Câu trả lời của bạn:{' '}
                      <strong style={{ color: isCorrect ? 'var(--mint)' : 'var(--red)' }}>{userAns}</strong>
                    </span>
                    {!isCorrect && (
                      <span>
                        Đáp án đúng: <strong style={{ color: 'var(--mint)' }}>{q.answerKey}</strong>
                      </span>
                    )}
                  </div>

                  <p style={{ margin: '0 0 4px', fontSize: 12, color: '#c5d3ca' }}>
                    <strong>Giải thích:</strong> {q.explanation}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: '#e5a842', fontStyle: 'italic' }}>
                    <strong>Trích xuất từ Audio Transcript:</strong> "{q.evidenceQuote}"
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Active Listening Test Workspace
  return (
    <div className="stack exam-simulator exam-simulator-listening" data-state="active" style={{ gap: 14 }}>
      {/* Top Controller Bar */}
      <div
        className="panel exam-simulator-toolbar exam-runner-status"
        style={{
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: '#14201c',
          borderBottom: '1px solid #304a3e'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            className="secondary"
            onClick={() => setConfirmExitOpen(true)}
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            Thoát bài thi
          </button>
          <div>
            <strong style={{ fontSize: 14, color: '#f0f8f1', display: 'block' }}>{exam.title}</strong>
            <small style={{ color: 'var(--muted)', fontSize: 11 }}>{exam.module} Listening · {allQuestions.length} Câu hỏi ({listeningPaper.sections.length} Sections)</small>
          </div>
        </div>

        {/* Section Tabs */}
        <div style={{ display: 'flex', gap: 6 }}>
          {listeningPaper.sections.map((s, idx) => (
            <button
              key={s.sectionNumber}
              type="button"
              onClick={() => {
                setActiveSectionIndex(idx as any)
                if (isPlaying) {
                  window.speechSynthesis.cancel()
                  setIsPlaying(false)
                }
              }}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                border: '1px solid',
                borderColor: activeSectionIndex === idx ? 'var(--mint)' : 'var(--line)',
                background: activeSectionIndex === idx ? '#b9f2c322' : '#111a17',
                color: activeSectionIndex === idx ? 'var(--mint)' : '#b9c8c0'
              }}
            >
              Section {s.sectionNumber}
            </button>
          ))}
        </div>

        {/* Countdown Timer & Submit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 8,
              background: secondsLeft < 300 ? '#ff998a22' : '#111a17',
              border: `1px solid ${secondsLeft < 300 ? 'var(--red)' : 'var(--line)'}`
            }}
          >
            <Clock size={16} color={secondsLeft < 300 ? 'var(--red)' : 'var(--mint)'} />
            <strong
              style={{
                fontFamily: 'Space Grotesk',
                fontSize: 16,
                color: secondsLeft < 300 ? 'var(--red)' : 'var(--mint)'
              }}
            >
              {formatTimer(secondsLeft)}
            </strong>
          </div>

          <button
            type="button"
            className="primary"
            onClick={handleSubmitTest}
            style={{ padding: '8px 18px', fontWeight: 700 }}
          >
            Nộp bài thi ({answeredCount}/{allQuestions.length})
          </button>
        </div>
      </div>

      {/* Audio Simulation Player Bar */}
      <div
        className="panel exam-simulator-media-panel"
        style={{
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          background: '#12201a',
          borderColor: '#2e493a'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={startAudio}
            disabled={isPlaying || playedSections.has(activeSection.sectionNumber)}
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              background: playedSections.has(activeSection.sectionNumber) ? 'var(--line)' : 'var(--mint)',
              color: '#122019',
              border: 0,
              cursor: 'pointer'
            }}
            title={playedSections.has(activeSection.sectionNumber) ? 'Section này đã phát xong' : 'Phát audio một lần'}
          >
            {playedSections.has(activeSection.sectionNumber) ? <Check size={20} /> : <Play size={20} style={{ marginLeft: 2 }} />}
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Volume2 size={16} color="var(--mint)" />
              <strong style={{ fontSize: 14, color: '#f0f8f1' }}>
                Audio Section {activeSection.sectionNumber}: {activeSection.title}
              </strong>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--muted)' }}>{activeSection.context}</p>
          </div>
        </div>

        {/* Soundwave Simulation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 24, padding: '0 8px' }}>
            {[4, 12, 18, 8, 22, 14, 10, 16, 6, 20, 12, 15].map((h, i) => (
              <span
                key={i}
                style={{
                  width: 3,
                  height: isPlaying ? h : 4,
                  borderRadius: 2,
                  background: isPlaying ? 'var(--mint)' : 'var(--line)',
                  transition: 'height 0.2s ease'
                }}
              />
            ))}
          </div>

          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            Audio tổng hợp · phát 1 lần như phòng thi
          </span>
        </div>
      </div>

      {/* Questions List for Active Section */}
      <div className="panel" style={{ padding: 26, maxHeight: '68vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <span className="eyebrow">SECTION {activeSection.sectionNumber} QUESTIONS</span>
            <h3 style={{ fontSize: 18, margin: '4px 0 0' }}>{activeSection.title}</h3>
          </div>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>
            Đã làm: {activeSection.questions.filter(q => Boolean(answers[q.id])).length}/{activeSection.questions.length} câu
          </span>
        </div>

        <div className="stack" style={{ gap: 20 }}>
          {activeSection.questions.map(q => {
            const isFlagged = flaggedQuestions.has(q.number)
            const userAns = answers[q.id] || ''

            return (
              <div
                key={q.id}
                ref={el => {
                  questionRefs.current[q.number] = el
                }}
                className="question"
                style={{
                  borderTop: '1px solid var(--line)',
                  paddingTop: 16,
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div className="question-top">
                    <b>{q.number}</b>
                    <span>{q.type.toUpperCase()}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFlag(q.number)}
                    style={{
                      background: 'transparent',
                      border: 0,
                      cursor: 'pointer',
                      color: isFlagged ? 'var(--accent)' : 'var(--muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11
                    }}
                    title="Gắn cờ để kiểm tra lại"
                  >
                    <Flag size={13} fill={isFlagged ? 'var(--accent)' : 'none'} />
                    <span>{isFlagged ? 'Đã gắn cờ' : 'Gắn cờ review'}</span>
                  </button>
                </div>

                <h4 style={{ margin: '8px 0 12px', fontSize: 14, fontWeight: 600, color: '#e7f3e9' }}>{q.prompt}</h4>

                {q.type === 'multiple-choice' && q.options && (
                  <div className="options">
                    {q.options.map((opt, optIndex) => {
                      const isChosen = userAns === opt
                      return (
                        <label key={optIndex} className={isChosen ? 'chosen' : ''}>
                          <input
                            type="radio"
                            name={q.id}
                            value={opt}
                            checked={isChosen}
                            onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                          />
                          <span>{opt}</span>
                        </label>
                      )
                    })}
                  </div>
                )}

                {q.type === 'sentence-completion' && !q.options && (
                  <div className="options">
                    <label style={{ display: 'block' }}>
                      <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
                        Nhập câu trả lời (không phân biệt hoa thường)
                      </span>
                      <input
                        type="text"
                        name={q.id}
                        value={userAns}
                        onChange={event => setAnswers(prev => ({ ...prev, [q.id]: event.target.value }))}
                        placeholder="Nhập câu trả lời…"
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: 7,
                          border: '1px solid var(--line)',
                          background: '#14201c',
                          color: '#e7f3e9',
                          fontSize: 13
                        }}
                      />
                    </label>
                  </div>
                )}

                {q.type === 'sentence-completion' && q.options && (
                  <div className="options">
                    {q.options.map((opt, optIndex) => {
                      const isChosen = userAns === opt
                      return (
                        <label key={optIndex} className={isChosen ? 'chosen' : ''}>
                          <input
                            type="radio"
                            name={q.id}
                            value={opt}
                            checked={isChosen}
                            onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                          />
                          <span>{opt}</span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom 1..40 Question Palette */}
      <div
        className="panel"
        style={{
          padding: '12px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          background: '#111a17',
          borderTop: '1px solid #304a3e'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--muted)' }}>
          <div style={{ display: 'flex', gap: 14 }}>
            <span>Đã làm: <strong style={{ color: 'var(--mint)' }}>{answeredCount}/{allQuestions.length}</strong></span>
            <span>Gắn cờ: <strong style={{ color: 'var(--accent)' }}>{flaggedQuestions.size}</strong></span>
          </div>
          <span>Bấm vào số câu để chuyển nhanh đến câu hỏi tương ứng</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(28px, 1fr))',
            gap: 6
          }}
        >
          {allQuestions.map(q => {
            const isAnswered = Boolean(answers[q.id])
            const isFlagged = flaggedQuestions.has(q.number)

            return (
              <button
                key={q.number}
                type="button"
                onClick={() => jumpToQuestion(q.number)}
                style={{
                  height: 32,
                  padding: 0,
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: 'Space Grotesk',
                  border: '1px solid',
                  borderColor: isFlagged ? 'var(--accent)' : isAnswered ? 'var(--mint)' : 'var(--line)',
                  background: isAnswered ? '#b9f2c322' : '#18241f',
                  color: isAnswered ? 'var(--mint)' : '#b9c8c0',
                  position: 'relative'
                }}
              >
                {q.number}
                {isFlagged && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: 'var(--accent)'
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Confirm Exit Modal */}
      {confirmExitOpen && (
        <div className="modal-overlay">
          <div className="modal-panel">
            <h3>Xác nhận thoát bài thi Listening?</h3>
            <p className="modal-message">
              Tiến trình làm bài thi này sẽ không được lưu nếu bạn thoát trước khi nhấn Nộp bài thi.
            </p>
            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => setConfirmExitOpen(false)}>
                Tiếp tục làm bài
              </button>
              <button type="button" className="danger" onClick={onExit}>
                Rời khỏi bài thi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// =========================================================================
// 3. FULL WRITING EXAM SIMULATOR (Task 1 & Task 2, 60-Minute Countdown)
// =========================================================================

interface WritingSimulatorProps {
  exam: FullIELTSExam
  store: Store
  setStore: (updater: Store | ((prev: Store) => Store)) => void
  onExit: () => void
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}

function FullWritingExamSimulator({ exam, store, setStore, onExit, addToast }: WritingSimulatorProps) {
  const [activeTask, setActiveTask] = useState<'task1' | 'task2'>('task1')
  const [task1Text, setTask1Text] = useState('')
  const [task2Text, setTask2Text] = useState('')
  const [secondsLeft, setSecondsLeft] = useState<number>(() => exam.writing.timeAllowedMinutes * 60)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [confirmExitOpen, setConfirmExitOpen] = useState(false)
  const handleSubmitRef = useRef<(() => void) | null>(null)

  const writingPaper = exam.writing

  useEffect(() => {
    handleSubmitRef.current = handleSubmitWriting
  })
  useEffect(() => {
    if (isSubmitted) return
    const t = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(t)
          handleSubmitRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [isSubmitted])

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const countWords = (text: string) => {
    const trimmed = text.trim()
    return trimmed ? trimmed.split(/\s+/).length : 0
  }

  const task1Words = countWords(task1Text)
  const task2Words = countWords(task2Text)

  const handleSubmitWriting = () => {
    const submissionId = `full-writing-${Date.now()}`
    const newSubmission: SkillSubmission = {
      id: submissionId,
      skill: 'Writing',
      activityId: exam.id,
      response: `--- TASK 1 (${task1Words} words) ---\n${task1Text}\n\n--- TASK 2 (${task2Words} words) ---\n${task2Text}`,
      feedbackMode: 'self-review',
      completed: true,
      createdAt: new Date().toISOString()
    }

    setStore(prev => ({
      ...prev,
      submissions: [newSubmission, ...(prev.submissions || [])]
    }))

    setIsSubmitted(true)
    addToast('Bài thi Writing hoàn tất! Đã lưu bài nộp và mở bài mẫu tham khảo Band 8.0+', 'success')
  }

  if (isSubmitted) {
    return (
      <div className="stack exam-simulator exam-simulator-writing exam-simulator-result" data-state="submitted" style={{ gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="secondary"
            onClick={onExit}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <ArrowLeft size={14} /> Trở về Thư viện đề thi
          </button>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Mã bài thi: {exam.code}</span>
        </div>

        <div className="panel exam-result-hero" style={{ padding: 26, background: '#13211c', borderColor: '#355342' }}>
          <span className="eyebrow">BÁO CÁO NỘP BÀI THI WRITING (TASK 1 & TASK 2)</span>
          <h2 style={{ fontSize: 24, margin: '6px 0 10px' }}>{exam.title} — Academic Writing</h2>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 12 }}>
            <div className="exam-result-metric" style={{ padding: '8px 16px', background: '#182922', borderRadius: 8 }}>
              <span>Task 1 Word Count: </span>
              <strong style={{ color: task1Words >= 150 ? 'var(--mint)' : 'var(--accent)' }}>
                {task1Words} / 150 từ
              </strong>
            </div>
            <div className="exam-result-metric" style={{ padding: '8px 16px', background: '#182922', borderRadius: 8 }}>
              <span>Task 2 Word Count: </span>
              <strong style={{ color: task2Words >= 250 ? 'var(--mint)' : 'var(--accent)' }}>
                {task2Words} / 250 từ
              </strong>
            </div>
          </div>
        </div>

        {/* Side-by-Side Model Comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Task 1 Comparison */}
          <div className="panel" style={{ padding: 20 }}>
            <span className="eyebrow">TASK 1 — BÀI VIẾT CỦA BẠN</span>
            <div style={{ whiteSpace: 'pre-wrap', fontSize: 13, color: '#f0f8f1', margin: '12px 0', minHeight: 180 }}>
              {task1Text || '(Chưa viết nội dung)'}
            </div>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14, marginTop: 14 }}>
                <span className="eyebrow" style={{ color: 'var(--mint)' }}>BÀI MẪU THAM KHẢO SAU KHI NỘP</span>
              <p style={{ fontSize: 13, color: '#c5d3ca', lineHeight: 1.7, margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>
                {writingPaper.task1.modelAnswer}
              </p>
            </div>
          </div>

          {/* Task 2 Comparison */}
          <div className="panel" style={{ padding: 20 }}>
            <span className="eyebrow">TASK 2 — BÀI VIẾT CỦA BẠN</span>
            <div style={{ whiteSpace: 'pre-wrap', fontSize: 13, color: '#f0f8f1', margin: '12px 0', minHeight: 180 }}>
              {task2Text || '(Chưa viết nội dung)'}
            </div>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14, marginTop: 14 }}>
                <span className="eyebrow" style={{ color: 'var(--mint)' }}>BÀI MẪU THAM KHẢO SAU KHI NỘP</span>
              <p style={{ fontSize: 13, color: '#c5d3ca', lineHeight: 1.7, margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>
                {writingPaper.task2.modelAnswer}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Active Writing Test Workspace
  return (
    <div className="stack exam-simulator exam-simulator-writing" data-state="active" style={{ gap: 14 }}>
      {/* Top Controller Bar */}
      <div
        className="panel exam-simulator-toolbar exam-runner-status"
        style={{
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: '#14201c',
          borderBottom: '1px solid #304a3e'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            className="secondary"
            onClick={() => setConfirmExitOpen(true)}
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            Thoát bài thi
          </button>
          <div>
            <strong style={{ fontSize: 14, color: '#f0f8f1', display: 'block' }}>{exam.title}</strong>
            <small style={{ color: 'var(--muted)', fontSize: 11 }}>Academic Writing · Task 1 & Task 2 (60 Phút)</small>
          </div>
        </div>

        {/* Task Tabs */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => setActiveTask('task1')}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              border: '1px solid',
              borderColor: activeTask === 'task1' ? 'var(--mint)' : 'var(--line)',
              background: activeTask === 'task1' ? '#b9f2c322' : '#111a17',
              color: activeTask === 'task1' ? 'var(--mint)' : '#b9c8c0'
            }}
          >
            Task 1 ({task1Words}/150 từ)
          </button>
          <button
            type="button"
            onClick={() => setActiveTask('task2')}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              border: '1px solid',
              borderColor: activeTask === 'task2' ? 'var(--mint)' : 'var(--line)',
              background: activeTask === 'task2' ? '#b9f2c322' : '#111a17',
              color: activeTask === 'task2' ? 'var(--mint)' : '#b9c8c0'
            }}
          >
            Task 2 ({task2Words}/250 từ)
          </button>
        </div>

        {/* Countdown Timer & Submit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 8,
              background: secondsLeft < 300 ? '#ff998a22' : '#111a17',
              border: `1px solid ${secondsLeft < 300 ? 'var(--red)' : 'var(--line)'}`
            }}
          >
            <Clock size={16} color={secondsLeft < 300 ? 'var(--red)' : 'var(--mint)'} />
            <strong
              style={{
                fontFamily: 'Space Grotesk',
                fontSize: 16,
                color: secondsLeft < 300 ? 'var(--red)' : 'var(--mint)'
              }}
            >
              {formatTimer(secondsLeft)}
            </strong>
          </div>

          <button
            type="button"
            className="primary"
            onClick={handleSubmitWriting}
            style={{ padding: '8px 18px', fontWeight: 700 }}
          >
            Nộp bài thi Writing
          </button>
        </div>
      </div>

      {/* Active Task Workspace */}
      {activeTask === 'task1' ? (
        <div className="practice-layout" style={{ alignItems: 'stretch' }}>
          {/* Prompt and Stimulus */}
          <div className="panel" style={{ padding: 24, maxHeight: '72vh', overflowY: 'auto' }}>
            <span className="eyebrow">ACADEMIC WRITING TASK 1 (20 MINUTES — 150 WORDS)</span>
            <h3 style={{ fontSize: 18, margin: '8px 0 12px' }}>{writingPaper.task1.title}</h3>
            <p style={{ fontSize: 13, color: '#c5d3ca', lineHeight: 1.6, marginBottom: 16 }}>
              {writingPaper.task1.prompt}
            </p>

            <div style={{ padding: 16, background: '#182922', borderRadius: 8, border: '1px solid var(--line)' }}>
              <span className="eyebrow">DỮ LIỆU TASK 1 · {writingPaper.task1.stimulusType.toUpperCase()}</span>
              <Task1StimulusChart data={writingPaper.task1.stimulusData} />
              <p style={{ margin: '8px 0 0', fontSize: 13, color: '#f0f8f1', lineHeight: 1.6 }}>
                {writingPaper.task1.stimulusDescription}
              </p>
            </div>
          </div>

          {/* Text Editor Area */}
          <div className="panel" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Viết câu trả lời của bạn:</span>
              <strong
                style={{
                  fontSize: 13,
                  color: task1Words >= 150 ? 'var(--mint)' : 'var(--accent)'
                }}
              >
                {task1Words} từ (Tối thiểu 150 từ)
              </strong>
            </div>

            <textarea
              className="skill-response"
              rows={18}
              placeholder="Start writing your Task 1 response here..."
              value={task1Text}
              onChange={e => setTask1Text(e.target.value)}
              style={{ flex: 1, minHeight: 360 }}
            />
          </div>
        </div>
      ) : (
        <div className="practice-layout" style={{ alignItems: 'stretch' }}>
          {/* Prompt for Task 2 */}
          <div className="panel" style={{ padding: 24, maxHeight: '72vh', overflowY: 'auto' }}>
            <span className="eyebrow">ACADEMIC WRITING TASK 2 (40 MINUTES — 250 WORDS)</span>
            <h3 style={{ fontSize: 18, margin: '8px 0 12px' }}>{writingPaper.task2.title}</h3>
            <p style={{ fontSize: 14, color: '#f0f8f1', lineHeight: 1.7, marginBottom: 16 }}>
              {writingPaper.task2.prompt}
            </p>

            <div style={{ padding: 16, background: '#182922', borderRadius: 8, border: '1px solid var(--line)' }}>
              <span className="eyebrow">TIÊU CHÍ CHẤM ĐIỂM (IELTS WRITING BAND DESCRIPTORS)</span>
              <ul style={{ margin: '8px 0 0', paddingLeft: 18, fontSize: 12, color: '#c5d3ca', lineHeight: 1.8 }}>
                <li><strong>Task Response (25%):</strong> Trả lời đầy đủ câu hỏi, có luận điểm rõ ràng và ví dụ hỗ trợ.</li>
                <li><strong>Coherence & Cohesion (25%):</strong> Bố cục logic, chia đoạn hợp lý, sử dụng liên từ mượt mà.</li>
                <li><strong>Lexical Resource (25%):</strong> Vốn từ vựng phong phú, sử dụng cụm collocation học thuật tự nhiên.</li>
                <li><strong>Grammatical Range & Accuracy (25%):</strong> Đa dạng cấu trúc ngữ pháp (câu phức, mệnh đề quan hệ).</li>
              </ul>
            </div>
          </div>

          {/* Text Editor Area */}
          <div className="panel" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Viết bài luận của bạn:</span>
              <strong
                style={{
                  fontSize: 13,
                  color: task2Words >= 250 ? 'var(--mint)' : 'var(--accent)'
                }}
              >
                {task2Words} từ (Tối thiểu 250 từ)
              </strong>
            </div>

            <textarea
              className="skill-response"
              rows={18}
              placeholder="Start writing your Task 2 essay here..."
              value={task2Text}
              onChange={e => setTask2Text(e.target.value)}
              style={{ flex: 1, minHeight: 360 }}
            />
          </div>
        </div>
      )}

      {/* Confirm Exit Modal */}
      {confirmExitOpen && (
        <div className="modal-overlay">
          <div className="modal-panel">
            <h3>Xác nhận thoát bài thi Writing?</h3>
            <p className="modal-message">
              Bài viết chưa hoàn tất sẽ không được lưu nếu bạn thoát trước khi nhấn Nộp bài thi.
            </p>
            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => setConfirmExitOpen(false)}>
                Tiếp tục viết bài
              </button>
              <button type="button" className="danger" onClick={onExit}>
                Rời khỏi bài thi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// =========================================================================
// 4. FULL SPEAKING EXAM SIMULATOR (Part 1, Part 2 Cue Card, Part 3)
// =========================================================================

interface SpeakingSimulatorProps {
  exam: FullIELTSExam
  store: Store
  setStore: (updater: Store | ((prev: Store) => Store)) => void
  onExit: () => void
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}

function FullSpeakingExamSimulator({ exam, store, setStore, onExit, addToast }: SpeakingSimulatorProps) {
  const [activePart, setActivePart] = useState<'part1' | 'part2' | 'part3'>('part1')
  const [prepSeconds, setPrepSeconds] = useState(60)
  const [prepActive, setPrepActive] = useState(false)
  const [speakingSeconds, setSpeakingSeconds] = useState(120)
  const [speakingActive, setSpeakingActive] = useState(false)
  const [recording, setRecording] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [notes, setNotes] = useState('')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const speakingPaper = exam.speaking

  // Prep timer for Part 2
  useEffect(() => {
    if (!prepActive) return
    const t = setInterval(() => {
      setPrepSeconds(s => {
        if (s <= 1) {
          clearInterval(t)
          setPrepActive(false)
          addToast('Hết 1 phút chuẩn bị! Bạn hãy bắt đầu 2 phút nói.', 'info')
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [prepActive])

  // Speaking timer for Part 2
  useEffect(() => {
    if (!speakingActive) return
    const t = setInterval(() => {
      setSpeakingSeconds(s => {
        if (s <= 1) {
          clearInterval(t)
          setSpeakingActive(false)
          stopRecording()
          addToast('Hoàn thành 2 phút bài nói Part 2!', 'success')
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [speakingActive])

  const speakPrompt = (text: string) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-GB'
    utterance.rate = 0.95
    window.speechSynthesis.speak(utterance)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioChunksRef.current = []
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = e => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach(track => track.stop())
      }
      recorder.start()
      mediaRecorderRef.current = recorder
      setRecording(true)
      addToast('Đang ghi âm bài nói của bạn...', 'info')
    } catch {
      addToast('Không thể kết nối Microphone. Vui lòng cấp quyền truy cập Mic.', 'error')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop()
      setRecording(false)
      addToast('Đã dừng ghi âm.', 'success')
    }
  }

  const completeSpeaking = () => {
    if (recording) stopRecording()
    setPrepActive(false)
    setSpeakingActive(false)
    const response = JSON.stringify({
      notes,
      hasRecording: Boolean(audioUrl),
      speakingSecondsUsed: 120 - speakingSeconds
    })
    setStore(prev => ({
      ...prev,
      submissions: [
        ...(prev.submissions || []),
        {
          id: `exam-speaking-${exam.id}-${Date.now()}`,
          skill: 'Speaking',
          activityId: exam.id,
          response,
          createdAt: new Date().toISOString(),
          feedbackMode: 'self-review',
          completed: true
        }
      ]
    }))
    setIsSubmitted(true)
    addToast('Đã lưu bằng chứng phiên Speaking. Chưa có band tự động cho bài nói.', 'success')
  }

  if (isSubmitted) {
    return (
      <div className="stack exam-simulator exam-simulator-speaking exam-simulator-result" data-state="submitted" style={{ gap: 20 }}>
        <div className="exam-result-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" className="secondary" onClick={onExit} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={14} /> Trở về Thư viện đề thi
          </button>
          <span className="muted">Mã bài thi: {exam.code}</span>
        </div>
        <div className="panel exam-result-hero" style={{ padding: 26, background: '#13211c', borderColor: '#355342' }}>
          <span className="eyebrow">BÁO CÁO PHIÊN SPEAKING ĐÃ LƯU</span>
          <h2 style={{ fontSize: 24, margin: '6px 0 10px' }}>{exam.title} — Speaking Interview</h2>
          <p className="exam-result-lead" style={{ margin: 0 }}>
            Phiên luyện tập đã được lưu vào Learning Record. IELTS Optimizer không tự suy đoán band Speaking từ bản ghi âm hoặc ghi chú.
          </p>
          <div className="exam-result-summary-grid">
            <div className="exam-result-metric"><span>Trạng thái</span><strong>Đã hoàn thành</strong></div>
            <div className="exam-result-metric"><span>Bằng chứng</span><strong>{audioUrl ? 'Có bản ghi âm' : 'Ghi chú tự đánh giá'}</strong></div>
            <div className="exam-result-metric"><span>Part 2 đã dùng</span><strong>{120 - speakingSeconds}s</strong></div>
          </div>
        </div>
        <div className="panel exam-result-review" style={{ padding: 24 }}>
          <h3>Phản tư sau phiên nói</h3>
          {notes ? <p className="exam-result-reflection">{notes}</p> : <p className="muted">Bạn chưa thêm ghi chú phản tư cho phiên này.</p>}
          {audioUrl && <audio controls src={audioUrl} className="exam-result-audio" />}
        </div>
      </div>
    )
  }

  return (
    <div className="stack exam-simulator exam-simulator-speaking" data-state="active" style={{ gap: 14 }}>
      {/* Top Header */}
      <div
        className="panel exam-simulator-toolbar exam-runner-status"
        style={{
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: '#14201c',
          borderBottom: '1px solid #304a3e'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            className="secondary"
            onClick={onExit}
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            Thoát phỏng vấn
          </button>
          <div>
            <strong style={{ fontSize: 14, color: '#f0f8f1', display: 'block' }}>{exam.title}</strong>
            <small style={{ color: 'var(--muted)', fontSize: 11 }}>Speaking Interview (Part 1, 2, 3)</small>
          </div>
        </div>

        {/* Part Tabs */}
        <div style={{ display: 'flex', gap: 8 }}>
          {(['part1', 'part2', 'part3'] as const).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setActivePart(p)}
              style={{
                padding: '6px 16px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                border: '1px solid',
                borderColor: activePart === p ? 'var(--mint)' : 'var(--line)',
                background: activePart === p ? '#b9f2c322' : '#111a17',
                color: activePart === p ? 'var(--mint)' : '#b9c8c0'
              }}
            >
              {p === 'part1' ? 'Part 1 (Phỏng vấn)' : p === 'part2' ? 'Part 2 (Cue Card)' : 'Part 3 (Thảo luận sâu)'}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="primary"
          onClick={completeSpeaking}
          style={{ padding: '8px 18px', fontWeight: 700 }}
        >
          Hoàn thành Speaking
        </button>
      </div>

      {/* Part 1: Introduction and Interview */}
      {activePart === 'part1' && (
        <div className="panel" style={{ padding: 26 }}>
          <span className="eyebrow">PART 1: INTRODUCTION & INTERVIEW (4-5 MINUTES)</span>
          <h3 style={{ fontSize: 20, margin: '8px 0 16px' }}>Chủ đề: {speakingPaper.part1.topic}</h3>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
            Giám khảo sẽ hỏi bạn các câu hỏi ngắn về đời sống thường ngày. Nhấn nút <strong>Phát âm câu hỏi</strong> để nghe giám khảo đọc đề.
          </p>

          <div className="stack" style={{ gap: 16 }}>
            {speakingPaper.part1.questions.map((q, i) => (
              <div key={i} style={{ padding: 18, background: '#182922', borderRadius: 8, border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <strong style={{ fontSize: 14, color: '#f0f8f1' }}>Câu hỏi {i + 1}: {q}</strong>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => speakPrompt(q)}
                    style={{ fontSize: 11, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Volume2 size={13} /> Giám khảo đọc
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Part 2: Long Turn Cue Card */}
      {activePart === 'part2' && (
        <div className="practice-layout" style={{ alignItems: 'stretch' }}>
          {/* Cue Card Frame */}
          <div className="panel" style={{ padding: 26 }}>
            <span className="eyebrow">PART 2: CANDIDATE CUE CARD (INDIVIDUAL LONG TURN)</span>
            <h3 style={{ fontSize: 20, margin: '8px 0 14px', color: '#f0f8f1' }}>{speakingPaper.part2.prompt}</h3>

            <div style={{ padding: 18, background: '#1c2e27', borderRadius: 8, border: '1px solid #355342', marginBottom: 20 }}>
              <strong style={{ fontSize: 13, color: 'var(--mint)', display: 'block', marginBottom: 8 }}>
                You should say:
              </strong>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#e0eee4', lineHeight: 1.8 }}>
                {speakingPaper.part2.cueCardBullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>

            {/* Timers Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ padding: 14, background: '#14201c', borderRadius: 8, border: '1px solid var(--line)' }}>
                <span style={{ fontSize: 11, color: 'var(--muted)', display: 'block' }}>1 Phút chuẩn bị (Prep Time)</span>
                <strong style={{ fontSize: 22, fontFamily: 'Space Grotesk', color: 'var(--accent)' }}>
                  {prepSeconds}s
                </strong>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setPrepActive(p => !p)
                    if (prepSeconds === 0) setPrepSeconds(60)
                  }}
                  style={{ width: '100%', marginTop: 8, fontSize: 11 }}
                >
                  {prepActive ? 'Tạm dừng 1p' : 'Bắt đầu 1p chuẩn bị'}
                </button>
              </div>

              <div style={{ padding: 14, background: '#14201c', borderRadius: 8, border: '1px solid var(--line)' }}>
                <span style={{ fontSize: 11, color: 'var(--muted)', display: 'block' }}>2 Phút bài nói (Speaking Time)</span>
                <strong style={{ fontSize: 22, fontFamily: 'Space Grotesk', color: 'var(--mint)' }}>
                  {speakingSeconds}s
                </strong>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setSpeakingActive(p => !p)
                    if (!recording) startRecording()
                    else stopRecording()
                  }}
                  style={{ width: '100%', marginTop: 8, fontSize: 11 }}
                >
                  {speakingActive ? 'Dừng bài nói' : 'Bắt đầu 2p nói'}
                </button>
              </div>
            </div>

            {/* Recorder Controls */}
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  type="button"
                  className={recording ? 'danger' : 'primary'}
                  onClick={recording ? stopRecording : startRecording}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Mic size={14} /> {recording ? 'Dừng ghi âm' : 'Bật ghi âm luyện nói'}
                </button>
                {audioUrl && <audio controls src={audioUrl} style={{ height: 36 }} />}
              </div>
            </div>
          </div>

          {/* Candidate Notes & Model Answer */}
          <div className="panel" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
            <span className="eyebrow">GHI CHÚ KHI CHUẨN BỊ (SCRATCHPAD NOTES)</span>
            <textarea
              className="skill-response"
              rows={8}
              placeholder="Ghi nhanh ý chính trong 1 phút chuẩn bị tại đây..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ marginBottom: 16 }}
            />

            <p className="muted" style={{ margin: 0, lineHeight: 1.6 }}>
              Bài mẫu và nhận xét chỉ nên xem sau khi bạn hoàn thành phần nói, để giữ áp lực và điều kiện luyện tập gần với phòng thi.
            </p>
          </div>
        </div>
      )}

      {/* Part 3: Two-way Discussion */}
      {activePart === 'part3' && (
        <div className="panel" style={{ padding: 26 }}>
          <span className="eyebrow">PART 3: TWO-WAY DISCUSSION (4-5 MINUTES)</span>
          <h3 style={{ fontSize: 20, margin: '8px 0 16px' }}>Chủ đề: {speakingPaper.part3.topic}</h3>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
            Giám khảo đặt các câu hỏi phân tích, phản biện mang tính học thuật sâu rộng hơn về chủ đề.
          </p>

          <div className="stack" style={{ gap: 16 }}>
            {speakingPaper.part3.questions.map((q, i) => (
              <div key={i} style={{ padding: 18, background: '#182922', borderRadius: 8, border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <strong style={{ fontSize: 14, color: '#f0f8f1' }}>Thảo luận {i + 1}: {q}</strong>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => speakPrompt(q)}
                    style={{ fontSize: 11, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Volume2 size={13} /> Giám khảo đọc
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
