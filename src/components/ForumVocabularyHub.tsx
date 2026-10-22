import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import {
  Volume2,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Check,
  Award,
  Keyboard,
  Search,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Layers
} from 'lucide-react'
import { FORUM_25_TOPICS, TOTAL_FORUM_VOCAB_COUNT, type ForumTopic } from '../data/forumVocab25Topics'
import { CEFR_GRAMMAR_RULES } from '../data/cefrGrammarData'
import type { VocabItem } from '../topicData'
import { ForumStudyTree } from './ForumStudyTree'
import type { Store, SkillSubmission } from '../types'

export interface ForumVocabularyHubProps {
  s: Store
  setS: (store: Store) => void
  note: (message: string) => void
  onSwitchToGrammar?: () => void
}

type CategoryFilter = 'All' | 'Xã hội & Đời sống' | 'Khoa học & Tự nhiên' | 'Kinh tế & Phát triển' | 'Tư duy & Văn hóa'

export const ForumVocabularyHub: React.FC<ForumVocabularyHubProps> = ({
  s,
  setS,
  note,
  onSwitchToGrammar
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(FORUM_25_TOPICS[0].id)
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [topicsExpanded, setTopicsExpanded] = useState(false)
  const [mode, setMode] = useState<'flip' | 'quiz'>('flip')
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Persistent known words from localStorage
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

  // Filter topics by category and search
  const filteredTopics = useMemo(() => {
    return FORUM_25_TOPICS.filter(t => {
      const matchesCat = categoryFilter === 'All' || t.category === categoryFilter
      const matchesSearch =
        searchQuery.trim() === '' ||
        t.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.titleVi.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCat && matchesSearch
    })
  }, [categoryFilter, searchQuery])

  // Current topic and vocab
  const currentTopic = useMemo(() => {
    return FORUM_25_TOPICS.find(t => t.id === selectedTopicId) || FORUM_25_TOPICS[0]
  }, [selectedTopicId])

  useEffect(() => {
    setCardIndex(0)
    setFlipped(false)
    setQuizIndex(0)
    setQuizScore(0)
    setSelectedOption(null)
    setQuizFinished(false)
  }, [selectedTopicId])

  const vocabList: VocabItem[] = currentTopic.vocab
  const currentWord: VocabItem | undefined = vocabList[cardIndex % vocabList.length]

  // Reset indices on topic change
  useEffect(() => {
    setCardIndex(0)
    setFlipped(false)
    setQuizIndex(0)
    setSelectedOption(null)
    setQuizScore(0)
    setQuizFinished(false)
  }, [selectedTopicId])

  // Touch gesture support for mobile swiping
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const deltaY = e.changedTouches[0].clientY - touchStartY.current
    // Register horizontal swipe if > 40px and significantly horizontal
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0 && cardIndex < vocabList.length - 1) {
        setCardIndex(cardIndex + 1)
        setFlipped(false)
      } else if (deltaX > 0 && cardIndex > 0) {
        setCardIndex(cardIndex - 1)
        setFlipped(false)
      }
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  // Speech synthesis for native pronunciation
  const speak = useCallback((term: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(term)
      u.lang = 'en-US'
      u.rate = 0.95
      setIsSpeaking(true)
      u.onend = () => setIsSpeaking(false)
      u.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(u)
    } else {
      note('Phát âm không được hỗ trợ trên trình duyệt này.')
    }
  }, [note])

  // Mark word known/unknown with XP rewarding
  const markKnown = useCallback((wordId: string, isKnown: boolean) => {
    if (!currentWord) return
    const nextKnown = { ...knownWords, [wordId]: isKnown }
    setKnownWords(nextKnown)
    localStorage.setItem('ielts-optimizer-vocab-known', JSON.stringify(nextKnown))

    if (isKnown) {
      note(`+15 XP · Đã ghi nhớ: "${currentWord.term}"`)
    } else {
      note(`Đã đánh dấu cần ôn lại: "${currentWord.term}"`)
    }

    // Auto advance
    if (cardIndex < vocabList.length - 1) {
      setCardIndex(prev => prev + 1)
      setFlipped(false)
    }
  }, [currentWord, knownWords, cardIndex, vocabList.length, note])

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return

      if (e.code === 'Space') {
        e.preventDefault()
        setFlipped(prev => !prev)
      } else if (e.code === 'ArrowRight') {
        e.preventDefault()
        if (cardIndex < vocabList.length - 1) {
          setCardIndex(prev => prev + 1)
          setFlipped(false)
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault()
        if (cardIndex > 0) {
          setCardIndex(prev => prev - 1)
          setFlipped(false)
        }
      } else if (e.key === '1' && currentWord) {
        markKnown(currentWord.id, false)
      } else if (e.key === '2' && currentWord) {
        markKnown(currentWord.id, true)
      } else if ((e.key === 'a' || e.key === 'A') && currentWord) {
        speak(currentWord.term)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cardIndex, vocabList.length, currentWord, markKnown, speak])

  // Total known counts across all 25 topics
  const totalKnownAcrossAllTopics = useMemo(() => {
    return Object.values(knownWords).filter(Boolean).length
  }, [knownWords])

  const knownCountInCurrentTopic = useMemo(() => {
    return vocabList.filter(item => knownWords[item.id]).length
  }, [vocabList, knownWords])

  const topicProgressPercent = Math.round((knownCountInCurrentTopic / vocabList.length) * 100)

  // Quiz generator
  const currentQuizWord = vocabList[quizIndex % vocabList.length]
  const quizOptions = useMemo(() => {
    if (!currentQuizWord) return []
    const correct = currentQuizWord.meaningVi
    const distractors = vocabList
      .filter(w => w.id !== currentQuizWord.id)
      .map(w => w.meaningVi)
      .slice(0, 3)
    return [correct, ...distractors].sort((a, b) => a.localeCompare(b))
  }, [currentQuizWord, vocabList])

  const handleQuizAnswer = (opt: string) => {
    if (selectedOption !== null || !currentQuizWord) return
    setSelectedOption(opt)
    if (opt === currentQuizWord.meaningVi) {
      setQuizScore(prev => prev + 1)
      note('+15 XP · Câu trả lời chính xác!')
    }
  }

  const nextQuizQuestion = () => {
    if (quizIndex < vocabList.length - 1) {
      setQuizIndex(prev => prev + 1)
      setSelectedOption(null)
    } else {
      setQuizFinished(true)
    }
  }

  return (
    <section className="stack">
      {/* ForumFlash Tree of Knowledge Header */}
      <ForumStudyTree
        activeTrack="vocabulary"
        onSelectTrack={track => {
          if (track === 'grammar' && onSwitchToGrammar) {
            onSwitchToGrammar()
          }
        }}
        knownVocabCount={totalKnownAcrossAllTopics}
        totalVocabCount={TOTAL_FORUM_VOCAB_COUNT}
        completedGrammarCount={s.submissions?.filter((sub: SkillSubmission) => sub.skill === 'Grammar').length || 0}
        totalGrammarCount={CEFR_GRAMMAR_RULES.length}
      />

      {/* Main Study Hub Panel */}
      <section className="panel forum-study-panel">
        <div className="forum-panel-head">
          <div className="forum-panel-title">
            <span className="eyebrow">FORUM STUDY · {FORUM_25_TOPICS.length} THEMATIC VOCABULARY CAMPAIGNS</span>
            <h2>Từ vựng IELTS theo {FORUM_25_TOPICS.length} chủ đề &amp; Collocations ({TOTAL_FORUM_VOCAB_COUNT} mục học)</h2>
            <p className="muted">
              {TOTAL_FORUM_VOCAB_COUNT} mục từ, cụm từ và thành ngữ học thuật theo {FORUM_25_TOPICS.length} chủ đề chuẩn ForumFlash. Phát âm chuẩn IPA, ví dụ theo ngữ cảnh và bài quiz ôn tập.
            </p>
          </div>
          <div className="forum-badge-indicator">
            <span className="stat-pill">
              <b>{totalKnownAcrossAllTopics}</b> / {TOTAL_FORUM_VOCAB_COUNT} từ toàn khóa học ({Math.round((totalKnownAcrossAllTopics / TOTAL_FORUM_VOCAB_COUNT) * 100)}%)
            </span>
          </div>
        </div>

        <button
          type="button"
          className="topic-toggle-btn vocab-topic-toggle"
          onClick={() => setTopicsExpanded(prev => !prev)}
          aria-expanded={topicsExpanded}
        >
          {topicsExpanded ? '🙈 Ẩn chủ đề' : '🔍 Chọn chủ đề'}
        </button>

        {topicsExpanded && (
          <div className="vocab-topic-picker">
            <div className="forum-cat-filter-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {(['All', 'Xã hội & Đời sống', 'Khoa học & Tự nhiên', 'Kinh tế & Phát triển', 'Tư duy & Văn hóa'] as CategoryFilter[]).map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`forum-cat-btn ${categoryFilter === cat ? 'active' : ''}`}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: categoryFilter === cat ? '#075d52' : '#dce5d6',
                    background: categoryFilter === cat ? '#075d52' : '#fffefa',
                    color: categoryFilter === cat ? '#fff' : '#2c3e50',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat === 'All' ? `Tất cả (25 chủ đề)` : cat}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', marginBottom: '14px', maxWidth: '380px' }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: 11, color: '#64748b' }} />
              <input
                type="text"
                placeholder="Tìm kiếm chủ đề từ vựng..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 34px',
                  borderRadius: '8px',
                  border: '1px solid #d9dfd8',
                  fontSize: '12px',
                  background: '#fffefa',
                  color: '#172236'
                }}
              />
            </div>

            <div className="forum-topics-grid vocab-topic-grid" role="tablist" aria-label="Chủ đề từ vựng">
              {filteredTopics.map((t, idx) => {
                const isSel = t.id === selectedTopicId
                const knownInT = t.vocab.filter(w => knownWords[w.id]).length
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={isSel}
                    className={`forum-topic-chip ${isSel ? 'active' : ''}`}
                    onClick={() => setSelectedTopicId(t.id)}
                  >
                    <span className="chip-indicator" />
                    <span className="chip-title">{idx + 1}. {t.titleEn}</span>
                    <span className="chip-badge">{knownInT}/{t.vocab.length}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="topic-header-card vocab-topic-header" style={{ borderLeft: '4px solid #075d52' }}>
          <div className="topic-header-left">
            <div className="topic-icon-badge vocab-topic-icon"><Layers size={22} /></div>
            <div className="topic-header-title">
              <div className="topic-kicker-row">
                <span className="eyebrow" style={{ color: '#075d52', margin: 0 }}>CHỦ ĐỀ TỪ VỰNG IELTS · {currentTopic.category.toUpperCase()}</span>
                <span className="topic-band-target">{FORUM_25_TOPICS.findIndex(t => t.id === selectedTopicId) + 1}/25 chủ đề</span>
              </div>
              <h2>{currentTopic.titleEn} — {currentTopic.titleVi}</h2>
              <p>{currentTopic.descriptionVi}</p>
            </div>
          </div>
          <div className="topic-header-meta">
            <div className="topic-stat-pills">
              <span className="stat-pill"><b>{vocabList.length}</b> từ vựng</span>
              <span className="stat-pill"><b>{knownCountInCurrentTopic}</b> đã thuộc</span>
              <span className="stat-pill"><b>{currentTopic.category}</b></span>
            </div>
          </div>
        </div>

        {/* Mode Tabs: Only Flashcard and Quiz */}
        <div className="forum-mode-tabs" style={{ marginTop: '16px' }}>
          <button
            type="button"
            className={`forum-mode-tab ${mode === 'flip' ? 'active' : ''}`}
            onClick={() => setMode('flip')}
          >
            <RefreshCw size={15} />
            <span>Lật thẻ (Flashcard) · {vocabList.length} từ</span>
          </button>
          <button
            type="button"
            className={`forum-mode-tab ${mode === 'quiz' ? 'active' : ''}`}
            onClick={() => setMode('quiz')}
          >
            <Award size={15} />
            <span>Trắc nghiệm (Quiz) · {vocabList.length} câu</span>
          </button>
        </div>
      </section>

      {/* MODE 1: FLASHCARD (LẬT THẺ) */}
      {mode === 'flip' && currentWord && (
        <div className="flashcard-stage">
          <div className="forum-stage-header" style={{ width: '100%', maxWidth: 720 }}>
            <div className="forum-stage-kicker">
              <span>{currentTopic.titleEn.toUpperCase()} · CHỦ ĐỀ {FORUM_25_TOPICS.findIndex(t => t.id === selectedTopicId) + 1}/25</span>
              <span className="keyboard-hint">
                <Keyboard size={13} /> Phím tắt: Space (Lật thẻ) · ← / → (Chuyển từ) · 1 (Chưa thuộc) · 2 (Đã thuộc) · A (Phát âm)
              </span>
            </div>
            <div className="flashcard-progress">
              <span>{String(cardIndex + 1).padStart(3, '0')}</span>
              <span>/</span>
              <span>{String(vocabList.length).padStart(3, '0')}</span>
            </div>
          </div>

          {/* Mobile swipe helper */}
          <div className="mobile-flashcard-hint" aria-hidden="true">
            <span>👈 Vuốt trái / phải để chuyển thẻ · Chạm để lật</span>
          </div>

          <div
            className={`flashcard-box ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped(!flipped)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="button"
            tabIndex={0}
            aria-label="Lật thẻ từ vựng (chạm để lật hoặc vuốt sang trái/phải)"
          >
            <div className="card-top">
              <span className="card-tag">{currentWord.type}</span>
              <button
                type="button"
                className={`card-speaker ${isSpeaking ? 'active-speaking' : ''}`}
                aria-label="Phát âm"
                onClick={e => {
                  e.stopPropagation()
                  speak(currentWord.term)
                }}
              >
                <Volume2 size={16} />
              </button>
              <button
                type="button"
                className="flip-btn"
                aria-label="Lật thẻ"
                onClick={e => {
                  e.stopPropagation()
                  setFlipped(!flipped)
                }}
              >
                ↻ Lật thẻ (Space)
              </button>
            </div>

            <div className="card-center">
              {!flipped ? (
                <>
                  <h3 className="card-term">{currentWord.term}</h3>
                  <div className="card-ipa">{currentWord.ipa}</div>
                  <div className="card-hint" style={{ marginTop: '22px' }}>
                    <RefreshCw size={13} /> Nhấp thẻ hoặc bấm Phím Cách để xem nghĩa &amp; ví dụ
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
              <small style={{ color: knownWords[currentWord.id] ? '#075d52' : '#b45309', fontWeight: 700 }}>
                {knownWords[currentWord.id] ? '✓ Đã thuộc (+15 XP)' : '○ Chưa thuộc'}
              </small>
            </div>
          </div>

          <div className="forum-controls-bar" style={{ marginTop: 14 }}>
            <button
              type="button"
              className="nav-arrow"
              disabled={cardIndex === 0}
              onClick={() => {
                setCardIndex(cardIndex - 1)
                setFlipped(false)
              }}
              title="Thẻ trước (←)"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              className="forum-status-btn unknown"
              onClick={() => markKnown(currentWord.id, false)}
              title="Chưa thuộc (Phím 1)"
            >
              <RotateCcw size={15} /> Chưa thuộc
            </button>
            <button
              type="button"
              className="forum-status-btn known"
              onClick={() => markKnown(currentWord.id, true)}
              title="Đã học thuộc (Phím 2)"
            >
              <Check size={16} /> Đã thuộc (+15 XP)
            </button>
            <button
              type="button"
              className="nav-arrow"
              disabled={cardIndex === vocabList.length - 1}
              onClick={() => {
                setCardIndex(cardIndex + 1)
                setFlipped(false)
              }}
              title="Thẻ sau (→)"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: QUIZ (TRẮC NGHIỆM) */}
      {mode === 'quiz' && (
        <div className="quiz-stage">
          {!quizFinished && currentQuizWord ? (
            <>
              <div className="quiz-header">
                <span className="eyebrow">CÂU {quizIndex + 1} / {vocabList.length}</span>
                <span className="date-pill">Điểm hiện tại: {quizScore} câu đúng</span>
              </div>
              <div className="quiz-term-box">
                <span className="card-tag">{currentQuizWord.type}</span>
                <h2>{currentQuizWord.term}</h2>
                <p className="card-ipa">{currentQuizWord.ipa}</p>
                <button
                  type="button"
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
                      type="button"
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
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button type="button" className="primary" onClick={nextQuizQuestion}>
                    {quizIndex < vocabList.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả bài kiểm tra'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="panel result-summary-box" style={{ textAlign: 'center', padding: '36px 20px' }}>
              <h2>Kết quả kiểm tra từ vựng</h2>
              <div className="score-circle" style={{ margin: '20px auto' }}>
                <b>{quizScore}/{vocabList.length}</b>
                <span>{Math.round((quizScore / vocabList.length) * 100)}%</span>
              </div>
              <p className="muted">Chủ đề: {currentTopic.titleEn}</p>
              <button
                type="button"
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
    </section>
  )
}
