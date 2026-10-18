import { useState, useMemo, useEffect } from 'react'
import {
  BookOpen,
  Volume2,
  PenTool,
  Mic,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Sparkles,
  FileText,
  HelpCircle,
  Award,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import type {
  Store,
  Page,
  QuestionBankItem,
  ReadingQuestionBankPayload,
  ListeningQuestionBankPayload,
  WritingQuestionBankPayload,
  SpeakingQuestionBankPayload,
  IELTSSkill,
  DifficultyBand,
  Attempt,
  ErrorRecord,
  SkillSubmission,
  DraftRecord,
  Question
} from './types'
import { getApprovedQuestionBankItems } from './questionBankValidator'
import { SEED_QUESTION_BANK_ITEMS } from './seedQuestionBank'
import { mergeAttemptErrors } from './domain'

interface Props {
  store: Store
  setStore: (updater: Store | ((prev: Store) => Store)) => void
  onNavigate: (page: Page) => void
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void
  initialSkill?: IELTSSkill | 'All'
  lockedSkill?: IELTSSkill
  hideHeaderBanner?: boolean
}

export default function QuestionBankView({
  store,
  setStore,
  onNavigate,
  addToast,
  initialSkill = 'All',
  lockedSkill,
  hideHeaderBanner = false
}: Props) {
  const [selectedSkill, setSelectedSkill] = useState<IELTSSkill | 'All'>(lockedSkill || initialSkill)
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyBand | 'All'>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeItemId, setActiveItemId] = useState<string | null>(null)

  // Retrieve only approved items through the fail-closed validator
  const approvedItems = useMemo(() => {
    return getApprovedQuestionBankItems(SEED_QUESTION_BANK_ITEMS, {
      skill: selectedSkill === 'All' ? undefined : selectedSkill,
      difficulty: difficultyFilter === 'All' ? undefined : difficultyFilter,
      searchTerm: searchTerm.trim() || undefined
    })
  }, [selectedSkill, difficultyFilter, searchTerm])

  const activeItem = useMemo(() => {
    if (!activeItemId) return null
    return SEED_QUESTION_BANK_ITEMS.find(i => i.id === activeItemId) || null
  }, [activeItemId])

  // Counts by skill for segmented tabs
  const skillCounts = useMemo(() => {
    const all = getApprovedQuestionBankItems(SEED_QUESTION_BANK_ITEMS)
    return {
      All: all.length,
      Reading: all.filter(i => i.skill === 'Reading').length,
      Listening: all.filter(i => i.skill === 'Listening').length,
      Writing: all.filter(i => i.skill === 'Writing').length,
      Speaking: all.filter(i => i.skill === 'Speaking').length
    }
  }, [])

  if (activeItem) {
    return (
      <ActivePracticeRunner
        item={activeItem}
        store={store}
        setStore={setStore}
        onBack={() => setActiveItemId(null)}
        addToast={addToast}
      />
    )
  }

  return (
    <div className="stack" style={{ gap: 20 }}>
      {/* Header Banner */}
      {!hideHeaderBanner && (
        <div className="hero-card" style={{ minHeight: 'auto', padding: '22px 24px' }}>
          <div>
            <span className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={14} /> NGÂN HÀNG BÀI TẬP ĐÃ KIỂM ĐỊNH (QUESTION BANK)
            </span>
            <h1 style={{ fontSize: 24, margin: '6px 0 8px' }}>Kho câu hỏi & Luyện tập chuẩn hóa theo kỹ năng</h1>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', maxWidth: 680 }}>
              Tất cả các bài luyện tập đều tuân thủ kiểm định chất lượng: 100% nội dung nguyên bản, có trích dẫn bằng chứng
              chính xác, tiêu chí chấm chuẩn IELTS và hỗ trợ Error Memory.
            </p>
          </div>
          <div className="header-meta" style={{ gap: 20 }}>
            <div style={{ textAlign: 'right' }}>
              <strong style={{ fontSize: 26, fontFamily: 'Space Grotesk', color: 'var(--mint)' }}>
                {skillCounts.All}
              </strong>
              <small style={{ display: 'block', color: 'var(--muted)' }}>Đề chuẩn hóa</small>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className="panel"
        style={{
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Skill Filter Tabs or Locked Skill Title */}
          {lockedSkill ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="eyebrow" style={{ color: 'var(--mint)' }}>NGÂN HÀNG CÂU HỎI {lockedSkill.toUpperCase()}</span>
              <span className="badge">{approvedItems.length} bài tập</span>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(['All', 'Reading', 'Listening', 'Writing', 'Speaking'] as const).map(skill => {
                const isActive = selectedSkill === skill
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => setSelectedSkill(skill)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 14px',
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
                    {skill === 'Reading' && <BookOpen size={14} />}
                    {skill === 'Listening' && <Volume2 size={14} />}
                    {skill === 'Writing' && <PenTool size={14} />}
                  {skill === 'Speaking' && <Mic size={14} />}
                  <span>{skill === 'All' ? 'Tất cả' : skill}</span>
                  <span style={{ fontSize: 11, opacity: 0.7 }}>({skillCounts[skill]})</span>
                </button>
              )
            })}
          </div>
          )}

          {/* Difficulty Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Độ khó:</span>
            <select
              value={difficultyFilter}
              onChange={e => setDifficultyFilter(e.target.value as any)}
              style={{
                background: '#111a17',
                color: '#e7f3e9',
                border: '1px solid var(--line)',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 12
              }}
            >
              <option value="All">Tất cả trình độ</option>
              <option value="foundation">Foundation (Band 4.0 - 5.0)</option>
              <option value="intermediate">Intermediate (Band 5.5 - 6.5)</option>
              <option value="advanced">Advanced (Band 7.0 - 8.0)</option>
              <option value="expert">Expert (Band 8.5 - 9.0)</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--muted)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tiêu đề, chủ đề (Environment, Ocean, Water...), hoặc mục tiêu..."
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              background: '#111a17',
              border: '1px solid var(--line)',
              borderRadius: 8,
              color: '#e7f3e9',
              fontSize: 13
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: 10,
                top: 8,
                background: 'transparent',
                border: 0,
                color: 'var(--muted)',
                fontSize: 12
              }}
            >
              Xóa
            </button>
          )}
        </div>
      </div>

      {/* Item List / Grid */}
      {approvedItems.length === 0 ? (
        <div className="panel empty" style={{ padding: '40px 20px' }}>
          <div className="empty-icon">
            <FileText size={28} />
          </div>
          <h3 style={{ marginBottom: 6 }}>Không tìm thấy đề thi phù hợp</h3>
          <p className="muted" style={{ marginBottom: 16 }}>
            Thử thay đổi từ khóa tìm kiếm hoặc chọn lại bộ lọc kỹ năng và độ khó.
          </p>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              setSelectedSkill('All')
              setDifficultyFilter('All')
              setSearchTerm('')
            }}
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {approvedItems.map(item => {
            const skillIcon =
              item.skill === 'Reading' ? (
                <BookOpen size={16} color="var(--mint)" />
              ) : item.skill === 'Listening' ? (
                <Volume2 size={16} color="#78c5ee" />
              ) : item.skill === 'Writing' ? (
                <PenTool size={16} color="var(--accent)" />
              ) : (
                <Mic size={16} color="#e599f7" />
              )

            const questionCount =
              item.skill === 'Reading'
                ? (item.payload as ReadingQuestionBankPayload).questions.length
                : item.skill === 'Listening'
                ? (item.payload as ListeningQuestionBankPayload).questions.length
                : undefined

            const wordCountMin =
              item.skill === 'Writing' ? (item.payload as WritingQuestionBankPayload).minimumWordCount : undefined

            return (
              <div
                key={item.id}
                className="panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 20,
                  transition: 'border-color 0.15s ease'
                }}
              >
                <div>
                  {/* Unboxed Metadata Line with typographic separators */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 11,
                      color: 'var(--muted)',
                      marginBottom: 10,
                      flexWrap: 'wrap'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#dceee1', fontWeight: 600 }}>
                      {skillIcon} {item.skill}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.topic}</span>
                    <span aria-hidden="true">·</span>
                    <span style={{ textTransform: 'capitalize', color: 'var(--accent)' }}>{item.difficulty}</span>
                    {questionCount !== undefined && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{questionCount} câu hỏi</span>
                      </>
                    )}
                    {wordCountMin !== undefined && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Tối thiểu {wordCountMin} từ</span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: 16, lineHeight: 1.35, marginBottom: 8, color: '#f0f8f1' }}>{item.title}</h3>

                  {/* Instructions Preview */}
                  <p style={{ fontSize: 12, color: '#a6b8af', lineHeight: 1.5, margin: '0 0 14px' }}>
                    {item.instructions}
                  </p>

                  {/* Objectives unboxed list */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                    {item.objectives.map(obj => (
                      <span
                        key={obj}
                        style={{
                          fontSize: 10,
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: '#25352e',
                          color: '#a0c4b0'
                        }}
                      >
                        {obj}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action & Provenance */}
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14, marginTop: 4 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 10,
                      fontSize: 10,
                      color: 'var(--muted)'
                    }}
                  >
                    <span>Giấy phép: {item.source.license}</span>
                    <span>v{item.contentVersion}</span>
                  </div>

                  <button
                    type="button"
                    className="primary"
                    onClick={() => setActiveItemId(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '10px'
                    }}
                  >
                    Luyện tập ngay
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// =========================================================================
// ACTIVE PRACTICE RUNNER (Interactive test execution for Question Bank item)
// =========================================================================

interface RunnerProps {
  item: QuestionBankItem
  store: Store
  setStore: (updater: Store | ((prev: Store) => Store)) => void
  onBack: () => void
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}

function getQuestionBankPrompt(item: QuestionBankItem): string {
  const payload = item.payload as { prompt?: string }
  return payload.prompt || item.instructions
}

function buildLocalApproachFallback(item: QuestionBankItem) {
  const taskType = ((item.payload as { taskType?: string }).taskType || item.skill.toLowerCase()) as string

  return {
    understandTheTask: `Bản public hiện đang dùng chế độ hướng dẫn cục bộ cho dạng ${taskType}. Hãy xác định đúng yêu cầu đề, giới hạn thời gian và tiêu chí chấm trước khi bắt đầu.`,
    recommendedStructure: [
      'Bước 1: Gạch chân từ khóa đề bài và xác định dạng câu hỏi hoặc nhiệm vụ chính.',
      'Bước 2: Chia bài làm thành các phần nhỏ theo đúng tiêu chí chấm hoặc thứ tự xử lý hợp lý.',
      'Bước 3: Hoàn thành phần trả lời chính trước, sau đó mới rà soát lỗi diễn đạt và tính đầy đủ.',
      'Bước 4: Tự kiểm lại xem câu trả lời có bám đề, rõ ràng và đủ bằng chứng hay chưa.'
    ],
    keyVocabulary: [
      'clear central idea',
      'relevant supporting detail',
      'logical progression',
      'accurate language control'
    ],
    selfCheckQuestions: [
      'Tôi đã trả lời đúng trọng tâm đề chưa?',
      'Các ý đã được sắp xếp theo trình tự dễ theo dõi chưa?',
      'Tôi đã rà lại lỗi từ vựng, ngữ pháp hoặc chi tiết còn thiếu chưa?'
    ]
  }
}

function buildLocalEvaluationFallback(item: QuestionBankItem, submission: string) {
  const words = submission.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const taskType = ((item.payload as { taskType?: string }).taskType || item.skill.toLowerCase()) as string
  const targetMin = taskType === 'task2' ? 250 : 150
  const meetsLength = wordCount >= targetMin

  return {
    overallBandEstimate: meetsLength ? 6.0 : 5.0,
    overallAssessment: `Bản public hiện dùng đánh giá cục bộ để mọi người có thể trải nghiệm giao diện trên web. Bài hiện có ${wordCount} từ, mục tiêu tham chiếu là ${targetMin} từ.`,
    criteria: {
      taskAchievementOrResponse: {
        score: meetsLength ? 6.0 : 5.0,
        comment: meetsLength ? 'Đã đạt ngưỡng độ dài tham chiếu cho dạng bài này.' : 'Chưa đạt ngưỡng độ dài tham chiếu, nên phát triển ý thêm.',
        evidence: words.slice(0, 10).join(' ') || 'Chưa có đủ nội dung để trích dẫn.'
      },
      coherenceAndCohesion: {
        score: 6.0,
        comment: 'Ưu tiên chia đoạn rõ ràng và liên kết ý mạch lạc giữa các phần trả lời.',
        evidence: 'Đánh giá cục bộ dựa trên độ đầy đủ và cấu trúc tổng quát.'
      },
      lexicalResource: {
        score: 5.5,
        comment: 'Nên tăng mật độ từ vựng theo chủ đề và tránh lặp từ khóa quá nhiều.',
        evidence: 'Đánh giá cục bộ chưa thay thế phản hồi AI có dẫn chứng.'
      },
      grammaticalRangeAndAccuracy: {
        score: 5.5,
        comment: 'Nên rà lỗi câu đơn/câu ghép và giữ cấu trúc câu ổn định.',
        evidence: 'Đánh giá cục bộ tập trung vào trải nghiệm public-first.'
      }
    },
    strengths: [
      'Có nội dung để tiếp tục luyện tập trực tiếp trên website public',
      'Có thể dùng ngay để thử luồng giao diện và nhập bài'
    ],
    priorityIssues: [
      meetsLength ? 'Mở rộng ví dụ và bằng chứng để tăng sức thuyết phục.' : 'Viết dài hơn để đạt độ phủ ý tối thiểu.',
      'Rà lại liên kết ý và giảm lặp từ vựng.'
    ],
    actionableRevisions: [
      {
        originalExcerpt: words.slice(0, 12).join(' ') || 'Chưa có đoạn trích phù hợp.',
        suggestedRewrite: 'Viết lại câu mở đầu theo hướng rõ luận điểm hơn và thêm một chi tiết hỗ trợ cụ thể.',
        reason: 'Giúp câu trả lời rõ mục tiêu hơn trong bản public đầu tiên.'
      }
    ],
    nextExerciseRecommendation: 'Tiếp tục luyện một đề cùng kỹ năng trong Question Bank để kiểm tra độ ổn định của câu trả lời.',
    limitationsNotice: 'Chế độ public hiện đang dùng đánh giá cục bộ để website chạy ổn trên GitHub Pages; phản hồi AI server-side sẽ được bổ sung sau.'
  }
}

function ActivePracticeRunner({ item, store, setStore, onBack, addToast }: RunnerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [writingDraft, setWritingDraft] = useState('')
  const [speakingNotes, setSpeakingNotes] = useState('')
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [prepSecondsLeft, setPrepSecondsLeft] = useState<number | null>(null)
  const [speakSecondsLeft, setSpeakSecondsLeft] = useState<number | null>(null)
  const [showRubric, setShowRubric] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiAssessment, setAiAssessment] = useState<any>(null)
  const [aiApproach, setAiApproach] = useState<any>(null)

  const handleAskAIApproach = async () => {
    try {
      setAiLoading(true)
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: item.title,
          taskPrompt: getQuestionBankPrompt(item),
          taskType: (item.payload as any).taskType || 'task2',
          mode: 'approach'
        })
      })
      if (!res.ok) throw new Error('ai-coach-unavailable')
      const result = await res.json()
      if (result.success && result.data) {
        setAiApproach(result.data)
        addToast(result.isFallback ? 'Đã tải gợi ý tiếp cận' : 'AI Coach đã phân tích hướng tiếp cận!', 'info')
      } else {
        setAiApproach(buildLocalApproachFallback(item))
        addToast('Đã chuyển sang gợi ý cục bộ để bản public vẫn hoạt động.', 'info')
      }
    } catch (_e: any) {
      setAiApproach(buildLocalApproachFallback(item))
      addToast('AI server chưa bật trên bản public, đã dùng gợi ý cục bộ.', 'info')
    } finally {
      setAiLoading(false)
    }
  }

  const handleAskAIEvaluation = async () => {
    if (!writingDraft.trim() || writingDraft.trim().split(/\s+/).length < 15) {
      addToast('Vui lòng viết tối thiểu 15 từ để AI đánh giá theo tiêu chí IELTS.', 'warning')
      return
    }

    try {
      setAiLoading(true)
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: item.title,
          taskPrompt: getQuestionBankPrompt(item),
          taskType: (item.payload as any).taskType || 'task2',
          studentSubmission: writingDraft,
          mode: 'evaluate'
        })
      })
      if (!res.ok) throw new Error('ai-coach-unavailable')
      const result = await res.json()
      if (result.success && result.data) {
        setAiAssessment(result.data)
        addToast(result.isFallback ? 'Đã hoàn thành đánh giá định lượng' : 'AI Examiner đã hoàn thành chấm bài có bằng chứng!', 'success')
      } else {
        setAiAssessment(buildLocalEvaluationFallback(item, writingDraft))
        addToast('Đã chuyển sang đánh giá cục bộ để bản public vẫn hoạt động.', 'info')
      }
    } catch (_e: any) {
      setAiAssessment(buildLocalEvaluationFallback(item, writingDraft))
      addToast('AI server chưa bật trên bản public, đã dùng đánh giá cục bộ.', 'info')
    } finally {
      setAiLoading(false)
    }
  }

  // Initialize draft from store if present
  useEffect(() => {
    if (item.skill === 'Writing') {
      const existingDraft = store.drafts?.find(d => d.activityId === item.id)?.content
      if (existingDraft) setWritingDraft(existingDraft)
    } else if (item.skill === 'Speaking') {
      const existingDraft = store.drafts?.find(d => d.activityId === item.id)?.content
      if (existingDraft) setSpeakingNotes(existingDraft)
    }
  }, [item.id, item.skill, store.drafts])

  // Countdown timer for Speaking prep
  const prepRunning = prepSecondsLeft !== null && prepSecondsLeft > 0
  useEffect(() => {
    if (!prepRunning) return
    const t = setInterval(() => {
      setPrepSecondsLeft(prev => (prev && prev > 1 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(t)
  }, [prepRunning])

  // Countdown timer for Speaking duration
  const speakRunning = speakSecondsLeft !== null && speakSecondsLeft > 0
  useEffect(() => {
    if (!speakRunning) return
    const t = setInterval(() => {
      setSpeakSecondsLeft(prev => (prev && prev > 1 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(t)
  }, [speakRunning])

  // Browser speech synthesis for listening
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      addToast('Trình duyệt không hỗ trợ tổng hợp âm thanh', 'warning')
      return
    }

    if (audioPlaying) {
      window.speechSynthesis.cancel()
      setAudioPlaying(false)
    } else {
      const transcript = (item.payload as ListeningQuestionBankPayload).transcript
      const utterance = new SpeechSynthesisUtterance(transcript)
      utterance.lang = 'en-US'
      utterance.rate = 0.95
      utterance.onend = () => setAudioPlaying(false)
      utterance.onerror = () => setAudioPlaying(false)
      window.speechSynthesis.speak(utterance)
      setAudioPlaying(true)
    }
  }

  // Handle Objective Submission for Reading and Listening
  const handleSubmitObjective = () => {
    const questions =
      item.skill === 'Reading'
        ? (item.payload as ReadingQuestionBankPayload).questions
        : (item.payload as ListeningQuestionBankPayload).questions

    let correctCount = 0
    const attemptId = `qb-attempt-${Date.now()}`

    questions.forEach(q => {
      const learnerAns = (answers[q.id] || '').trim().toLowerCase()
      const rawKey = Array.isArray(q.answerKey) ? q.answerKey[0] : q.answerKey
      const correctAns = rawKey.trim().toLowerCase()

      // Multiple choice option prefix stripping or match
      const isMatch = learnerAns === correctAns

      if (isMatch) {
        correctCount++
      }
    })

    setScore(correctCount)
    setSubmitted(true)

    // Save Attempt to store
    const newAttempt: Attempt = {
      id: attemptId,
      passageId: item.id,
      skill: item.skill,
      answers,
      score: correctCount,
      total: questions.length,
      kind: 'practice',
      createdAt: new Date().toISOString(),
      objectiveIds: item.objectives
    }

    const engineQuestions: Question[] = questions.map(q => ({
      id: q.id,
      type: (q.type as Question['type']) || 'multiple-choice',
      prompt: q.prompt,
      options: q.options || [],
      answer: Array.isArray(q.answerKey) ? q.answerKey[0] : q.answerKey,
      explanation: q.explanation,
      objective: q.objective
    }))
    const nextErrors = mergeAttemptErrors(store.errors, newAttempt, engineQuestions)
    setStore(prev => ({
      ...prev,
      attempts: [newAttempt, ...prev.attempts],
      errors: nextErrors
    }))

    addToast(`Đã hoàn thành! Điểm của bạn: ${correctCount}/${questions.length}`, 'success')
  }

  // Handle Writing Draft Save
  const handleSaveWritingDraft = () => {
    const updatedDrafts = [
      ...(store.drafts || []).filter(d => d.activityId !== item.id),
      {
        id: `draft-${item.id}`,
        skill: 'Writing' as const,
        activityId: item.id,
        content: writingDraft,
        updatedAt: new Date().toISOString()
      }
    ]
    setStore(prev => ({ ...prev, drafts: updatedDrafts }))
    addToast('Đã lưu bài nháp thành công', 'success')
  }

  // Handle Writing Submission
  const handleSubmitWriting = () => {
    if (writingDraft.trim().split(/\s+/).length < 20) {
      addToast('Bài viết quá ngắn. Hãy hoàn thiện nội dung trước khi nộp.', 'warning')
      return
    }

    const newSub: SkillSubmission = {
      id: `sub-${Date.now()}`,
      skill: 'Writing',
      activityId: item.id,
      response: writingDraft,
      createdAt: new Date().toISOString(),
      feedbackMode: 'self-review',
      completed: true
    }

    setStore(prev => ({
      ...prev,
      submissions: [newSub, ...(prev.submissions || [])]
    }))

    setSubmitted(true)
    addToast('Đã nộp bài viết thành công!', 'success')
  }

  // Word count calculation
  const wordCount = writingDraft.trim() ? writingDraft.trim().split(/\s+/).length : 0

  return (
    <div className="stack" style={{ gap: 18 }}>
      {/* Top Navigation & Task Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <button
          type="button"
          onClick={onBack}
          className="secondary"
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', fontSize: 12 }}
        >
          <ArrowLeft size={14} /> Quay lại Thư viện đề
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)' }}>
          <span>Kỹ năng: <strong style={{ color: 'var(--mint)' }}>{item.skill}</strong></span>
          <span aria-hidden="true">·</span>
          <span>Chủ đề: <strong style={{ color: '#dceee1' }}>{item.topic}</strong></span>
          <span aria-hidden="true">·</span>
          <span>Độ khó: <strong style={{ color: 'var(--accent)', textTransform: 'capitalize' }}>{item.difficulty}</strong></span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* READING PRACTICE LAYOUT                                            */}
      {/* =================================================================== */}
      {item.skill === 'Reading' && (
        <div className="practice-layout">
          {/* Passage Column */}
          <div className="panel passage" style={{ maxHeight: '82vh', overflowY: 'auto', padding: 24 }}>
            <span className="eyebrow">IELTS ACADEMIC READING</span>
            <h2 style={{ fontSize: 20, margin: '8px 0 14px', color: '#f0f8f1' }}>
              {(item.payload as ReadingQuestionBankPayload).passageTitle}
            </h2>
            <div style={{ color: '#c5d3ca', lineHeight: 1.85, fontSize: 14 }}>
              {(item.payload as ReadingQuestionBankPayload).passageText
                .split('\n\n')
                .map((para, i) => (
                  <p key={i} style={{ marginBottom: 16 }}>
                    {para}
                  </p>
                ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', borderTop: '1px solid var(--line)', paddingTop: 10, marginTop: 20 }}>
              Nguồn: {item.source.author} ({item.source.license})
            </div>
          </div>

          {/* Questions Column */}
          <div className="panel questions" style={{ maxHeight: '82vh', overflowY: 'auto', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 16, margin: 0 }}>Câu hỏi ({ (item.payload as ReadingQuestionBankPayload).questions.length })</h3>
              {submitted && (
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--mint)' }}>
                  Kết quả: {score}/{(item.payload as ReadingQuestionBankPayload).questions.length}
                </span>
              )}
            </div>

            <div className="stack" style={{ gap: 16 }}>
              {(item.payload as ReadingQuestionBankPayload).questions.map((q, qIndex) => {
                const learnerAnswer = answers[q.id] || ''
                const rawKey = Array.isArray(q.answerKey) ? q.answerKey[0] : q.answerKey
                const isCorrect = learnerAnswer.trim().toLowerCase() === rawKey.trim().toLowerCase()

                return (
                  <div key={q.id} className="question" style={{ borderTop: qIndex === 0 ? 0 : '1px solid var(--line)', paddingTop: qIndex === 0 ? 0 : 16 }}>
                    <div className="question-top">
                      <b>{qIndex + 1}</b>
                      <span>{q.type.toUpperCase()} · Mục tiêu: {q.objective}</span>
                    </div>

                    <h4 style={{ margin: '10px 0', fontSize: 14, fontWeight: 600, color: '#e7f3e9', lineHeight: 1.45 }}>
                      {q.prompt}
                    </h4>

                    {/* Multiple-choice options */}
                    {q.type === 'multiple-choice' && q.options && (
                      <div className="options">
                        {q.options.map((opt, optIndex) => {
                          const isChosen = answers[q.id] === opt
                          return (
                            <label
                              key={optIndex}
                              className={isChosen ? 'chosen' : ''}
                              style={{ cursor: submitted ? 'default' : 'pointer' }}
                            >
                              <input
                                type="radio"
                                name={q.id}
                                value={opt}
                                checked={isChosen}
                                disabled={submitted}
                                onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                              />
                              <span>{opt}</span>
                            </label>
                          )
                        })}
                      </div>
                    )}

                    {/* True / False / Not Given options */}
                    {q.type === 'true-false-not-given' && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '8px 0' }}>
                        {['TRUE', 'FALSE', 'NOT GIVEN'].map(val => {
                          const isChosen = answers[q.id] === val
                          return (
                            <button
                              key={val}
                              type="button"
                              disabled={submitted}
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

                    {/* Feedback and evidence quote after submission */}
                    {submitted && (
                      <div
                        style={{
                          marginTop: 12,
                          padding: 12,
                          borderRadius: 8,
                          background: isCorrect ? '#0e442933' : '#3d1a1833',
                          border: `1px solid ${isCorrect ? '#26a64166' : '#ff998a66'}`
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: isCorrect ? 'var(--mint)' : 'var(--red)', marginBottom: 6 }}>
                          {isCorrect ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                          {isCorrect ? 'Chính xác' : `Chưa chính xác (Đáp án đúng: ${rawKey})`}
                        </div>
                        <p style={{ margin: '0 0 6px', fontSize: 12, color: '#c5d3ca' }}>
                          <strong>Giải thích:</strong> {q.explanation}
                        </p>
                        <p style={{ margin: 0, fontSize: 12, color: '#a0c4b0', fontStyle: 'italic' }}>
                          <strong>Bằng chứng từ bài đọc:</strong> "{q.evidenceQuote}"
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}

              {!submitted ? (
                <button
                  type="button"
                  className="primary"
                  onClick={handleSubmitObjective}
                  style={{ width: '100%', marginTop: 12 }}
                >
                  Nộp bài & Kiểm tra đáp án
                </button>
              ) : (
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setSubmitted(false)
                    setAnswers({})
                  }}
                  style={{ width: '100%', marginTop: 12 }}
                >
                  Làm lại bài này
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* LISTENING PRACTICE LAYOUT                                          */}
      {/* =================================================================== */}
      {item.skill === 'Listening' && (
        <div className="practice-layout">
          {/* Audio & Transcript Column */}
          <div className="panel" style={{ padding: 24 }}>
            <span className="eyebrow">IELTS LISTENING PRACTICE</span>
            <h2 style={{ fontSize: 20, margin: '8px 0 10px', color: '#f0f8f1' }}>{item.title}</h2>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>
              {(item.payload as ListeningQuestionBankPayload).audioPrompt}
            </p>

            {/* Audio Simulation Control */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                background: '#111a17',
                border: '1px solid var(--line)',
                borderRadius: 10,
                marginBottom: 16
              }}
            >
              <button
                type="button"
                className="primary"
                onClick={handleToggleAudio}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px' }}
              >
                {audioPlaying ? <Pause size={14} /> : <Play size={14} />}
                {audioPlaying ? 'Tạm dừng giọng đọc' : 'Phát giọng đọc (Synthetic)'}
              </button>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                {audioPlaying ? 'Đang phát âm thanh mẫu...' : 'Nhấn để nghe bài đọc tổng hợp'}
              </span>
            </div>

            <div
              style={{
                fontSize: 11,
                padding: '10px 12px',
                borderRadius: 6,
                background: '#f4c87812',
                color: 'var(--accent)',
                marginBottom: 16
              }}
            >
              Lưu ý: Giọng đọc sử dụng bộ tổng hợp trình duyệt (Synthetic Speech) phục vụ luyện tập, không phải audio thi chính thức.
            </div>

            {/* Collapsible Transcript */}
            <details style={{ marginTop: 14 }}>
              <summary style={{ cursor: 'pointer', fontSize: 13, color: 'var(--mint)', fontWeight: 600 }}>
                Xem toàn bộ Transcript (Lời thoại)
              </summary>
              <div
                style={{
                  marginTop: 10,
                  padding: 14,
                  background: '#111a17',
                  borderRadius: 8,
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: '#c5d3ca'
                }}
              >
                {(item.payload as ListeningQuestionBankPayload).transcript}
              </div>
            </details>
          </div>

          {/* Listening Questions Column */}
          <div className="panel questions" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 14 }}>
              Câu hỏi ({(item.payload as ListeningQuestionBankPayload).questions.length})
            </h3>

            <div className="stack" style={{ gap: 16 }}>
              {(item.payload as ListeningQuestionBankPayload).questions.map((q, qIndex) => {
                const rawKey = Array.isArray(q.answerKey) ? q.answerKey[0] : q.answerKey
                const isCorrect = (answers[q.id] || '').trim().toLowerCase() === rawKey.trim().toLowerCase()

                return (
                  <div key={q.id} className="question" style={{ borderTop: qIndex === 0 ? 0 : '1px solid var(--line)', paddingTop: qIndex === 0 ? 0 : 16 }}>
                    <div className="question-top">
                      <b>{qIndex + 1}</b>
                      <span>{q.type.toUpperCase()} · Mục tiêu: {q.objective}</span>
                    </div>

                    <h4 style={{ margin: '10px 0', fontSize: 14, fontWeight: 600, color: '#e7f3e9' }}>{q.prompt}</h4>

                    {q.options && (
                      <div className="options">
                        {q.options.map((opt, optIndex) => {
                          const isChosen = answers[q.id] === opt
                          return (
                            <label key={optIndex} className={isChosen ? 'chosen' : ''}>
                              <input
                                type="radio"
                                name={q.id}
                                value={opt}
                                checked={isChosen}
                                disabled={submitted}
                                onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                              />
                              <span>{opt}</span>
                            </label>
                          )
                        })}
                      </div>
                    )}

                    {submitted && (
                      <div
                        style={{
                          marginTop: 12,
                          padding: 12,
                          borderRadius: 8,
                          background: isCorrect ? '#0e442933' : '#3d1a1833',
                          border: `1px solid ${isCorrect ? '#26a64166' : '#ff998a66'}`
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: isCorrect ? 'var(--mint)' : 'var(--red)', marginBottom: 6 }}>
                          {isCorrect ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                          {isCorrect ? 'Chính xác' : `Chưa chính xác (Đáp án đúng: ${rawKey})`}
                        </div>
                        <p style={{ margin: '0 0 6px', fontSize: 12, color: '#c5d3ca' }}>
                          <strong>Giải thích:</strong> {q.explanation}
                        </p>
                        <p style={{ margin: 0, fontSize: 12, color: '#a0c4b0', fontStyle: 'italic' }}>
                          <strong>Bằng chứng nghe:</strong> "{q.evidenceQuote}"
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}

              {!submitted ? (
                <button
                  type="button"
                  className="primary"
                  onClick={handleSubmitObjective}
                  style={{ width: '100%', marginTop: 12 }}
                >
                  Nộp bài & Chấm điểm
                </button>
              ) : (
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setSubmitted(false)
                    setAnswers({})
                  }}
                  style={{ width: '100%', marginTop: 12 }}
                >
                  Làm lại bài
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* WRITING PRACTICE LAYOUT                                            */}
      {/* =================================================================== */}
      {item.skill === 'Writing' && (
        <div className="practice-layout">
          {/* Prompt & Rubric Column */}
          <div className="panel" style={{ padding: 24, maxHeight: '82vh', overflowY: 'auto' }}>
            <span className="eyebrow">
              {(item.payload as WritingQuestionBankPayload).taskType === 'task2' ? 'IELTS WRITING TASK 2' : 'IELTS WRITING TASK 1'}
            </span>
            <h2 style={{ fontSize: 20, margin: '8px 0 12px', color: '#f0f8f1' }}>{item.title}</h2>

            <div
              style={{
                padding: 16,
                background: '#111a17',
                border: '1px solid var(--line)',
                borderRadius: 8,
                fontSize: 14,
                lineHeight: 1.6,
                color: '#e7f3e9',
                marginBottom: 16
              }}
            >
              {(item.payload as WritingQuestionBankPayload).prompt}
            </div>

            {(item.payload as WritingQuestionBankPayload).stimulusDescription && (
              <div style={{ marginBottom: 16, padding: 12, background: '#18241f', borderRadius: 8, fontSize: 13, color: '#c5d3ca' }}>
                <strong style={{ color: 'var(--mint)', display: 'block', marginBottom: 4 }}>Mô tả quy trình / Biểu đồ:</strong>
                {(item.payload as WritingQuestionBankPayload).stimulusDescription}
              </div>
            )}

            {(item.payload as WritingQuestionBankPayload).approachHints && (
              <div style={{ marginBottom: 18 }}>
                <strong style={{ fontSize: 13, color: 'var(--accent)', display: 'block', marginBottom: 6 }}>
                  Gợi ý tiếp cận (Approach Hints):
                </strong>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#b9c8c0', lineHeight: 1.6 }}>
                  {(item.payload as WritingQuestionBankPayload).approachHints?.map((hint, i) => (
                    <li key={i}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rubric Accordion */}
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
              <button
                type="button"
                onClick={() => setShowRubric(prev => !prev)}
                className="secondary"
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>Xem 4 tiêu chí chấm chuẩn IELTS</span>
                {showRubric ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showRubric && (
                <div style={{ marginTop: 12, display: 'grid', gap: 10, fontSize: 12, color: '#c5d3ca' }}>
                  <div style={{ padding: 10, background: '#111a17', borderRadius: 6 }}>
                    <strong style={{ color: 'var(--mint)' }}>1. Task Achievement / Response:</strong>
                    <p style={{ margin: '4px 0 0' }}>{(item.payload as WritingQuestionBankPayload).rubric.taskAchievementOrResponseCriteria}</p>
                  </div>
                  <div style={{ padding: 10, background: '#111a17', borderRadius: 6 }}>
                    <strong style={{ color: 'var(--mint)' }}>2. Coherence & Cohesion:</strong>
                    <p style={{ margin: '4px 0 0' }}>{(item.payload as WritingQuestionBankPayload).rubric.coherenceAndCohesionCriteria}</p>
                  </div>
                  <div style={{ padding: 10, background: '#111a17', borderRadius: 6 }}>
                    <strong style={{ color: 'var(--mint)' }}>3. Lexical Resource:</strong>
                    <p style={{ margin: '4px 0 0' }}>{(item.payload as WritingQuestionBankPayload).rubric.lexicalResourceCriteria}</p>
                  </div>
                  <div style={{ padding: 10, background: '#111a17', borderRadius: 6 }}>
                    <strong style={{ color: 'var(--mint)' }}>4. Grammatical Range & Accuracy:</strong>
                    <p style={{ margin: '4px 0 0' }}>{(item.payload as WritingQuestionBankPayload).rubric.grammaticalRangeAndAccuracyCriteria}</p>
                  </div>
                </div>
              )}
            </div>
            {/* AI Approach Section */}
            <div style={{ marginTop: 16 }}>
              <button
                type="button"
                disabled={aiLoading}
                onClick={handleAskAIApproach}
                className="secondary"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  borderColor: '#4d94ff66',
                  color: '#78c5ee'
                }}
              >
                <Sparkles size={14} />
                {aiLoading ? 'AI Coach đang phân tích...' : 'AI Gợi ý hướng tiếp cận (Approach)'}
              </button>

              {aiApproach && (
                <div
                  style={{
                    marginTop: 12,
                    padding: 14,
                    background: '#14232c',
                    border: '1px solid #23485d',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#d6e9f5'
                  }}
                >
                  <strong style={{ display: 'block', color: '#78c5ee', marginBottom: 6 }}>
                    Hiểu đề bài & Trọng tâm:
                  </strong>
                  <p style={{ margin: '0 0 10px', lineHeight: 1.5 }}>{aiApproach.understandTheTask}</p>

                  {aiApproach.recommendedStructure && (
                    <div style={{ marginBottom: 10 }}>
                      <strong style={{ display: 'block', color: 'var(--mint)', marginBottom: 4 }}>
                        Dàn bài gợi ý:
                      </strong>
                      <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                        {aiApproach.recommendedStructure.map((st: string, idx: number) => (
                          <li key={idx}>{st}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiApproach.keyVocabulary && (
                    <div>
                      <strong style={{ display: 'block', color: 'var(--accent)', marginBottom: 4 }}>
                        Từ vựng học thuật nên dùng:
                      </strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {aiApproach.keyVocabulary.map((v: string, idx: number) => (
                          <span
                            key={idx}
                            style={{ padding: '2px 8px', borderRadius: 4, background: '#1c3647', color: '#bfe3fa' }}
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Writing Editor Column */}
          <div className="panel" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ fontSize: 15, margin: 0 }}>Bài viết của bạn</h3>
              <div
                style={{
                  fontSize: 12,
                  fontFamily: 'Space Grotesk',
                  color: wordCount >= (item.payload as WritingQuestionBankPayload).minimumWordCount ? 'var(--mint)' : 'var(--accent)'
                }}
              >
                <strong>{wordCount}</strong> / {(item.payload as WritingQuestionBankPayload).minimumWordCount} từ{' '}
                {wordCount >= (item.payload as WritingQuestionBankPayload).minimumWordCount ? '(Đạt yêu cầu tối thiểu)' : '(Chưa đủ số từ)'}
              </div>
            </div>

            <textarea
              value={writingDraft}
              onChange={e => setWritingDraft(e.target.value)}
              placeholder="Nhập bài viết luận của bạn tại đây..."
              style={{
                flex: 1,
                minHeight: 340,
                background: '#111a17',
                color: '#f0f8f1',
                border: '1px solid var(--line)',
                borderRadius: 8,
                padding: 14,
                lineHeight: 1.65,
                fontSize: 14,
                resize: 'vertical',
                marginBottom: 16
              }}
            />

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap', marginBottom: 16 }}>
              <button type="button" className="secondary" onClick={handleSaveWritingDraft}>
                Lưu bài nháp
              </button>
              <button
                type="button"
                disabled={aiLoading}
                className="secondary"
                onClick={handleAskAIEvaluation}
                style={{
                  borderColor: 'var(--mint)',
                  color: 'var(--mint)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Sparkles size={14} />
                {aiLoading ? 'AI đang chấm bài...' : 'AI Chấm & Đánh giá bài viết'}
              </button>
              <button type="button" className="primary" onClick={handleSubmitWriting}>
                Nộp bài hoàn thành
              </button>
            </div>

            {/* AI Assessment Results Display */}
            {aiAssessment && (
              <div
                style={{
                  padding: 18,
                  borderRadius: 10,
                  background: '#14221c',
                  border: '1px solid #355342',
                  marginTop: 6
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Award size={20} color="var(--mint)" />
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#f0f8f1' }}>
                      Ước lượng luyện tập: Band {aiAssessment.overallBandEstimate || '6.0'}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                    (Ước lượng định hướng luyện tập, không phải điểm thi chính thức)
                  </span>
                </div>

                <p style={{ fontSize: 13, color: '#c5d3ca', lineHeight: 1.55, margin: '0 0 14px' }}>
                  {aiAssessment.overallAssessment}
                </p>

                {/* 4 Criteria Scores */}
                {aiAssessment.criteria && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 14 }}>
                    {Object.entries(aiAssessment.criteria).map(([critKey, val]: [string, any]) => (
                      <div key={critKey} style={{ padding: 10, background: '#111a17', borderRadius: 6, fontSize: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <strong style={{ color: 'var(--mint)', textTransform: 'capitalize' }}>
                            {critKey.replace(/([A-Z])/g, ' $1')}
                          </strong>
                          {val.score && <b style={{ color: 'var(--accent)' }}>Band {val.score}</b>}
                        </div>
                        <p style={{ margin: '0 0 4px', color: '#c5d3ca' }}>{val.comment}</p>
                        {val.evidence && (
                          <small style={{ color: 'var(--muted)', display: 'block', fontStyle: 'italic' }}>
                            Bằng chứng: "{val.evidence}"
                          </small>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Priority Issues & Actionable Revisions */}
                {aiAssessment.priorityIssues && aiAssessment.priorityIssues.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <strong style={{ fontSize: 12, color: 'var(--red)', display: 'block', marginBottom: 4 }}>
                      Vấn đề ưu tiên cần sửa (1–3 trọng tâm):
                    </strong>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#e7cfcd', lineHeight: 1.5 }}>
                      {aiAssessment.priorityIssues.map((issue: string, idx: number) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiAssessment.actionableRevisions && aiAssessment.actionableRevisions.length > 0 && (
                  <div>
                    <strong style={{ fontSize: 12, color: 'var(--mint)', display: 'block', marginBottom: 6 }}>
                      Gợi ý viết lại cụ thể (Actionable Rewrite):
                    </strong>
                    <div style={{ display: 'grid', gap: 8 }}>
                      {aiAssessment.actionableRevisions.map((rev: any, idx: number) => (
                        <div key={idx} style={{ padding: 8, background: '#111a17', borderRadius: 6, fontSize: 11 }}>
                          <span style={{ color: '#ff998a', display: 'block', marginBottom: 2 }}>
                            Đoạn gốc: "{rev.originalExcerpt}"
                          </span>
                          <span style={{ color: 'var(--mint)', display: 'block', marginBottom: 2 }}>
                            Gợi ý viết lại: "{rev.suggestedRewrite}"
                          </span>
                          <small style={{ color: 'var(--muted)' }}>Lý do: {rev.reason}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SPEAKING PRACTICE LAYOUT                                           */}
      {/* =================================================================== */}
      {item.skill === 'Speaking' && (
        <div className="panel" style={{ padding: 26 }}>
          <span className="eyebrow">IELTS SPEAKING PRACTICE</span>
          <h2 style={{ fontSize: 20, margin: '8px 0 10px', color: '#f0f8f1' }}>{item.title}</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>
            {(item.payload as SpeakingQuestionBankPayload).mainPrompt}
          </p>

          {/* Cue Card for Part 2 */}
          {(item.payload as SpeakingQuestionBankPayload).part === 'part2' && (
            <div
              style={{
                padding: 20,
                background: '#14221c',
                border: '1px solid #355342',
                borderRadius: 10,
                marginBottom: 20
              }}
            >
              <h4 style={{ margin: '0 0 10px', color: 'var(--mint)', fontSize: 16 }}>Topic Cue Card</h4>
              <p style={{ margin: '0 0 12px', fontSize: 14, color: '#f0f8f1' }}>
                You should say:
              </p>
              <ul style={{ margin: 0, paddingLeft: 22, fontSize: 13, color: '#c5d3ca', lineHeight: 1.7 }}>
                {(item.payload as SpeakingQuestionBankPayload).cueCardBullets?.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Follow-up Questions for Part 1 or Part 3 */}
          {(item.payload as SpeakingQuestionBankPayload).followUpQuestions && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 14, color: '#dceee1', marginBottom: 8 }}>Câu hỏi phỏng vấn:</h4>
              <div style={{ display: 'grid', gap: 8 }}>
                {(item.payload as SpeakingQuestionBankPayload).followUpQuestions?.map((fq, i) => (
                  <div key={i} style={{ padding: 12, background: '#111a17', borderRadius: 6, fontSize: 13, color: '#c5d3ca' }}>
                    <strong>{i + 1}.</strong> {fq}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timer Controls */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20, padding: 16, background: '#111a17', borderRadius: 8 }}>
            {(item.payload as SpeakingQuestionBankPayload).part === 'part2' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>Thời gian chuẩn bị (1 phút):</span>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setPrepSecondsLeft(60)}
                  style={{ padding: '6px 12px', fontSize: 12 }}
                >
                  {prepSecondsLeft !== null ? `${prepSecondsLeft}s` : 'Bắt đầu 1 phút'}
                </button>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Thời gian nói (2 phút):</span>
              <button
                type="button"
                className="secondary"
                onClick={() => setSpeakSecondsLeft(120)}
                style={{ padding: '6px 12px', fontSize: 12 }}
              >
                {speakSecondsLeft !== null ? `${speakSecondsLeft}s` : 'Bắt đầu 2 phút'}
              </button>
            </div>
          </div>

          {/* Notes / Response transcript textarea */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#bed0c3', marginBottom: 6 }}>
              Ghi chú dàn ý hoặc bản gõ câu trả lời của bạn:
            </label>
            <textarea
              value={speakingNotes}
              onChange={e => setSpeakingNotes(e.target.value)}
              placeholder="Ghi lại các ý chính (bullet points) hoặc câu trả lời mẫu của bạn để lưu lại..."
              style={{
                width: '100%',
                minHeight: 140,
                background: '#111a17',
                color: '#f0f8f1',
                border: '1px solid var(--line)',
                borderRadius: 8,
                padding: 12,
                fontSize: 13,
                lineHeight: 1.6
              }}
            />
          </div>

          {/* Limitations notice disclosure */}
          <div
            style={{
              padding: 12,
              borderRadius: 6,
              background: '#f4c87814',
              border: '1px solid #f4c87833',
              fontSize: 12,
              color: 'var(--accent)',
              marginBottom: 16
            }}
          >
            {(item.payload as SpeakingQuestionBankPayload).limitationsNotice}
          </div>

          <button
            type="button"
            className="primary"
            onClick={() => {
              if (speakingNotes.trim()) {
                const updatedDrafts = [
                  ...(store.drafts || []).filter(d => d.activityId !== item.id),
                  {
                    id: `speaking-draft-${item.id}`,
                    skill: 'Speaking' as const,
                    activityId: item.id,
                    content: speakingNotes,
                    updatedAt: new Date().toISOString()
                  }
                ]
                setStore(prev => ({ ...prev, drafts: updatedDrafts }))
              }
              addToast('Đã hoàn thành buổi luyện nói!', 'success')
              onBack()
            }}
          >
            Hoàn thành luyện tập
          </button>
        </div>
      )}
    </div>
  )
}
