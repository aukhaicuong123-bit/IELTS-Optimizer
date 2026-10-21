import React, { useState, useMemo } from 'react'
import {
  BookOpen,
  CheckCircle,
  HelpCircle,
  Check,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Award,
  Layers
} from 'lucide-react'
import { CEFR_GRAMMAR_RULES, type CefrLevel, type CefrGrammarRule } from '../data/cefrGrammarData'
import { TOTAL_FORUM_VOCAB_COUNT } from '../data/forumVocab25Topics'
import { TOPICS, type TopicId } from '../topicData'
import { ForumStudyTree } from './ForumStudyTree'
import type { Store } from '../types'

const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

export interface ForumGrammarHubProps {
  s: Store
  setS: (store: Store) => void
  note: (message: string) => void
  onSwitchToVocab?: () => void
}

export const ForumGrammarHub: React.FC<ForumGrammarHubProps> = ({
  s,
  setS,
  note,
  onSwitchToVocab
}) => {
  const [viewTrack, setViewTrack] = useState<'cefr' | 'topic'>('cefr')
  const [selectedCefr, setSelectedCefr] = useState<CefrLevel | 'all'>('all')
  const [selectedTopicId, setSelectedTopicId] = useState<TopicId>('education')
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(CEFR_GRAMMAR_RULES[0]?.id || null)

  // Quiz state: ruleId -> selectedOption
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({})

  // Drill written answer: ruleId -> text
  const [drillAnswers, setDrillAnswers] = useState<Record<string, string>>({})
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({})

  // Grammar mistakes stored in localStorage
  const [grammarErrors, setGrammarErrors] = useState<Record<string, { title: string; prompt: string; wrongCount: number }>>(() => {
    try {
      const raw = localStorage.getItem('ielts-optimizer-grammar-errors')
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  // Filtered CEFR rules
  const displayedCefrRules = useMemo(() => {
    if (selectedCefr === 'all') return CEFR_GRAMMAR_RULES
    return CEFR_GRAMMAR_RULES.filter(r => r.cefrLevel === selectedCefr)
  }, [selectedCefr])

  // Filtered Topic rules
  const currentTopic = useMemo(() => {
    return TOPICS.find(t => t.id === selectedTopicId) || TOPICS[0]
  }, [selectedTopicId])

  // Handle quiz submission with XP rewards and mistake tracking
  const handleQuizSubmit = (rule: CefrGrammarRule, chosen: string) => {
    setQuizAnswers(prev => ({ ...prev, [rule.id]: chosen }))
    setQuizSubmitted(prev => ({ ...prev, [rule.id]: true }))

    const isCorrect = chosen === rule.quiz.answer
    if (isCorrect) {
      note(`+25 XP · Chính xác! Bạn đã hoàn thành phần kiểm tra "${rule.title}"`)
      // If was in error vault, remove or decrement
      if (grammarErrors[rule.id]) {
        const nextErr = { ...grammarErrors }
        delete nextErr[rule.id]
        setGrammarErrors(nextErr)
        localStorage.setItem('ielts-optimizer-grammar-errors', JSON.stringify(nextErr))
      }
    } else {
      note(`Chưa chính xác. Đã lưu câu hỏi vào Sổ nhớ câu chưa đúng để ôn lại.`)
      const curErr = grammarErrors[rule.id] || { title: rule.title, prompt: rule.quiz.prompt, wrongCount: 0 }
      const nextErr = {
        ...grammarErrors,
        [rule.id]: {
          title: rule.title,
          prompt: rule.quiz.prompt,
          wrongCount: curErr.wrongCount + 1
        }
      }
      setGrammarErrors(nextErr)
      localStorage.setItem('ielts-optimizer-grammar-errors', JSON.stringify(nextErr))
    }
  }

  // Save grammar sentence writing reflection to Learning Record
  const saveGrammarReflection = (ruleTitle: string, ruleId: string) => {
    const text = drillAnswers[ruleId] || ''
    if (!text.trim()) return note('Vui lòng viết câu luyện tập trước khi lưu.')

    const submission = {
      id: uid('submission'),
      skill: 'Grammar' as const,
      activityId: `grammar-${ruleId}`,
      response: `[${ruleTitle}] ${text.trim()}`,
      createdAt: new Date().toISOString(),
      feedbackMode: 'self-review' as const,
      completed: true
    }

    setS({
      ...s,
      submissions: [...(s.submissions || []), submission]
    })
    note(`+25 XP · Đã lưu bài luyện ngữ pháp vào Learning Record!`)
  }

  // Stats
  const completedGrammarCount = Object.keys(quizSubmitted).filter(
    id => {
      const rule = CEFR_GRAMMAR_RULES.find(r => r.id === id)
      return rule && quizAnswers[id] === rule.quiz.answer
    }
  ).length

  return (
    <section className="stack">
      {/* ForumFlash Tree of Knowledge Header */}
      <ForumStudyTree
        activeTrack="grammar"
        onSelectTrack={track => {
          if (track === 'vocabulary' && onSwitchToVocab) {
            onSwitchToVocab()
          }
        }}
        knownVocabCount={0}
        totalVocabCount={TOTAL_FORUM_VOCAB_COUNT}
        completedGrammarCount={completedGrammarCount}
        totalGrammarCount={CEFR_GRAMMAR_RULES.length}
      />

      {/* Main Grammar Study Hub Panel */}
      <section className="panel forum-study-panel">
        <div className="forum-panel-head">
          <div className="forum-panel-title">
            <span className="eyebrow">FORUM STUDY · GRAMMAR MASTERY CURRICULUM</span>
            <h2>Lộ trình ngữ pháp IELTS chuẩn 6 bậc CEFR (A1 → C2)</h2>
            <p className="muted">
              Xếp theo 6 bậc từ A1 đến C2: từ cấu trúc câu căn bản, thì thời đến đảo ngữ, mệnh đề phân từ và câu chẻ học thuật Band 8.0+.
            </p>
          </div>
          <div className="forum-badge-indicator">
            <span className="stat-pill">
              <b>{completedGrammarCount}</b> / {CEFR_GRAMMAR_RULES.length} bài đã hoàn thành
            </span>
          </div>
        </div>

        {/* Dual Track Navigation Switcher */}
        <div className="forum-mode-tabs" style={{ marginBottom: 16 }}>
          <button
            type="button"
            className={`forum-mode-tab ${viewTrack === 'cefr' ? 'active' : ''}`}
            onClick={() => setViewTrack('cefr')}
          >
            <BookOpen size={15} />
            <span>Ngữ pháp theo 6 bậc CEFR (A1 → C2)</span>
          </button>
          <button
            type="button"
            className={`forum-mode-tab ${viewTrack === 'topic' ? 'active' : ''}`}
            onClick={() => setViewTrack('topic')}
          >
            <Layers size={15} />
            <span>Ngữ pháp theo 8 Chủ đề IELTS</span>
          </button>
        </div>

        {/* CEFR Level Filters (A1 to C2) */}
        {viewTrack === 'cefr' && (
          <div className="forum-cefr-selector">
            <button
              type="button"
              className={`cefr-chip ${selectedCefr === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCefr('all')}
            >
              Tất cả (A1 → C2)
            </button>
            {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CefrLevel[]).map(lvl => (
              <button
                key={lvl}
                type="button"
                className={`cefr-chip ${selectedCefr === lvl ? 'active' : ''}`}
                onClick={() => setSelectedCefr(lvl)}
              >
                <b className="cefr-tag-text">{lvl}</b>
                <span className="cefr-sublabel">
                  {lvl === 'A1' && 'Nền tảng'}
                  {lvl === 'A2' && 'Cơ bản'}
                  {lvl === 'B1' && 'Trung cấp'}
                  {lvl === 'B2' && 'Nâng cao'}
                  {lvl === 'C1' && 'IELTS 7.0+'}
                  {lvl === 'C2' && 'IELTS 8.0+'}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Thematic Topic Filters */}
        {viewTrack === 'topic' && (
          <div className="forum-topics-grid">
            {TOPICS.map(t => (
              <button
                key={t.id}
                type="button"
                className={`forum-topic-chip ${t.id === selectedTopicId ? 'active' : ''}`}
                onClick={() => setSelectedTopicId(t.id)}
              >
                <span className="chip-indicator" />
                <span className="chip-title">{t.titleEn}</span>
                <span className="chip-badge">{t.grammar.length} cấu trúc</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* TRACK 1: CEFR GRAMMAR CURRICULUM CARDS */}
      {viewTrack === 'cefr' && (
        <div className="forum-grammar-list">
          {displayedCefrRules.map((rule, idx) => {
            const isExpanded = expandedRuleId === rule.id
            const isQuizDone = quizSubmitted[rule.id]
            const isQuizCorrect = isQuizDone && quizAnswers[rule.id] === rule.quiz.answer

            return (
              <div
                key={rule.id}
                className={`forum-grammar-card ${isExpanded ? 'expanded' : ''} ${isQuizCorrect ? 'passed' : ''}`}
              >
                {/* Header Row */}
                <div
                  className="fg-card-head"
                  onClick={() => setExpandedRuleId(isExpanded ? null : rule.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="fg-head-left">
                    <span className={`fg-cefr-badge lvl-${rule.cefrLevel.toLowerCase()}`}>
                      {rule.cefrLevel}
                    </span>
                    <div>
                      <div className="fg-meta-row">
                        <span className="fg-category-pill">{rule.category}</span>
                        {isQuizCorrect && (
                          <span className="fg-done-chip">
                            <Check size={12} /> Đã hoàn thành (+25 XP)
                          </span>
                        )}
                      </div>
                      <h3>{rule.title}</h3>
                      <p className="fg-short-desc">{rule.descriptionVi}</p>
                    </div>
                  </div>

                  <div className="fg-head-right">
                    <span className="fg-toggle-btn">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </div>
                </div>

                {/* Expanded Detailed Content */}
                {isExpanded && (
                  <div className="fg-card-body">
                    {/* Visual Sentence Breakdown inspired by ForumFlash */}
                    <div className="fg-breakdown-box">
                      <div className="fg-breakdown-title">
                        <Sparkles size={14} />
                        <span>MÔ PHỎNG CẤU TRÚC TRỰC QUAN (VISUAL BREAKDOWN)</span>
                      </div>
                      <div className="fg-tokens-row">
                        {rule.formulaTokens.map((tok, ti) => (
                          <React.Fragment key={ti}>
                            <div className="fg-token-block" style={{ borderColor: tok.color }}>
                              <span className="fg-token-role">{tok.role}</span>
                              <b className="fg-token-val" style={{ color: tok.color }}>
                                {tok.token}
                              </b>
                              <span className="fg-token-tag">{tok.tag}</span>
                            </div>
                            {ti < rule.formulaTokens.length - 1 && (
                              <span className="fg-token-plus">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="fg-formula-text">
                        <b>Công thức chuẩn:</b> <code>{rule.formula}</code>
                      </div>
                    </div>

                    {/* Step 1: Knowledge & Examples & Trap Warnings */}
                    <div className="fg-step-section">
                      <div className="fg-step-banner">
                        <span className="fg-step-num">01</span>
                        <div>
                          <b>ĐANG HỌC · Kiến thức &amp; Ứng dụng IELTS</b>
                          <small>Quy tắc ngữ pháp, ví dụ mẫu Band 8.0+ và bẫy lỗi thường gặp</small>
                        </div>
                      </div>

                      <div className="fg-explanation-text">
                        <p>{rule.explanationVi}</p>
                        <div className="fg-ielts-note">
                          <b>💡 Ứng dụng trong bài thi IELTS:</b> {rule.ieltsUsageNote}
                        </div>
                      </div>

                      <div className="fg-examples-list">
                        <b>Ví dụ mẫu trong bài viết & bài nói Band 8.0+:</b>
                        {rule.examples.map((ex, ei) => (
                          <div key={ei} className="fg-example-item">
                            <span className="dot" />
                            <span>{ex}</span>
                          </div>
                        ))}
                      </div>

                      {rule.commonMistakes.length > 0 && (
                        <div className="fg-traps-box">
                          <div className="fg-traps-head">
                            <AlertTriangle size={15} />
                            <b>BẪY LỖI THƯỜNG GẶP (COMMON TRAPS TO AVOID)</b>
                          </div>
                          {rule.commonMistakes.map((m, mi) => (
                            <div key={mi} className="fg-trap-row">
                              <div className="trap-wrong">
                                <span className="mark-x">✗</span>
                                <s>{m.wrong}</s>
                              </div>
                              <div className="trap-correct">
                                <span className="mark-check">✓</span>
                                <b>{m.correct}</b>
                              </div>
                              <small className="trap-note">Lưu ý: {m.note}</small>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Step 2: Interactive Test / Quiz (Step 02 Kiểm tra) */}
                    <div className="fg-step-section">
                      <div className="fg-step-banner test-step">
                        <span className="fg-step-num">02</span>
                        <div>
                          <b>TIẾP THEO · Kiểm tra tương tác (Interactive Quiz)</b>
                          <small>Trả lời câu hỏi để kiểm tra độ hiểu và tích lũy +25 XP</small>
                        </div>
                      </div>

                      <div className="fg-quiz-box">
                        <p className="fg-quiz-prompt">{rule.quiz.prompt}</p>
                        <div className="fg-quiz-options">
                          {rule.quiz.options.map(opt => {
                            const isChosen = quizAnswers[rule.id] === opt
                            let optClass = ''
                            if (isQuizDone) {
                              if (opt === rule.quiz.answer) optClass = 'correct'
                              else if (isChosen) optClass = 'wrong'
                            }

                            return (
                              <button
                                key={opt}
                                type="button"
                                className={`fg-quiz-opt ${optClass} ${isChosen && !isQuizDone ? 'selected' : ''}`}
                                disabled={isQuizDone}
                                onClick={() => handleQuizSubmit(rule, opt)}
                              >
                                <span>{opt}</span>
                                {isQuizDone && opt === rule.quiz.answer && (
                                  <span className="check-icon">✓</span>
                                )}
                              </button>
                            )
                          })}
                        </div>

                        {isQuizDone && (
                          <div className={`fg-quiz-feedback ${isQuizCorrect ? 'passed' : 'failed'}`}>
                            <b>{isQuizCorrect ? '✓ Hoàn thành xuất sắc (+25 XP)' : '✗ Chưa đúng'}</b>
                            <p>{rule.quiz.explanation}</p>
                            {!isQuizCorrect && (
                              <button
                                type="button"
                                className="secondary"
                                style={{ marginTop: 8, fontSize: 12 }}
                                onClick={() => {
                                  const nextAns = { ...quizAnswers }
                                  delete nextAns[rule.id]
                                  const nextSub = { ...quizSubmitted }
                                  delete nextSub[rule.id]
                                  setQuizAnswers(nextAns)
                                  setQuizSubmitted(nextSub)
                                }}
                              >
                                <RotateCcw size={13} /> Thử làm lại câu này
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Step 3: Sentence Writing Drill */}
                    <div className="fg-drill-section">
                      <b>Thực hành viết câu tự đặt (Self-practice Drill):</b>
                      <p className="muted" style={{ margin: '4px 0 8px', fontSize: '13px' }}>
                        {rule.drillPrompt}
                      </p>
                      <textarea
                        className="skill-response"
                        style={{ minHeight: '75px', margin: '6px 0' }}
                        placeholder="Nhập câu tiếng Anh tự viết của bạn áp dụng cấu trúc này..."
                        value={drillAnswers[rule.id] || ''}
                        onChange={e => setDrillAnswers({ ...drillAnswers, [rule.id]: e.target.value })}
                      />
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: 6 }}>
                        <button
                          type="button"
                          className="secondary"
                          style={{ fontSize: 12 }}
                          onClick={() => setRevealedSolutions(prev => ({ ...prev, [rule.id]: !prev[rule.id] }))}
                        >
                          {revealedSolutions[rule.id] ? 'Ẩn câu mẫu' : 'Xem câu mẫu Band 8.0+'}
                        </button>
                        <button
                          type="button"
                          className="primary"
                          style={{ fontSize: 12 }}
                          onClick={() => saveGrammarReflection(rule.title, rule.id)}
                        >
                          Lưu bài tập (+25 XP)
                        </button>
                      </div>

                      {revealedSolutions[rule.id] && (
                        <div className="callout" style={{ marginTop: '10px' }}>
                          <b>Câu mẫu tham khảo:</b> {rule.sampleTransform}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* TRACK 2: THEMATIC IELTS TOPIC GRAMMAR */}
      {viewTrack === 'topic' && (
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
                <p style={{ margin: 0, fontStyle: 'italic', color: '#244d3b' }}>{rule.drillPrompt}</p>
                <textarea
                  className="skill-response"
                  style={{ minHeight: '80px', margin: '6px 0' }}
                  placeholder="Nhập câu viết lại hoặc câu tự đặt của bạn..."
                  value={drillAnswers[rule.id] || ''}
                  onChange={e => setDrillAnswers({ ...drillAnswers, [rule.id]: e.target.value })}
                />
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => setRevealedSolutions(prev => ({ ...prev, [rule.id]: !prev[rule.id] }))}
                  >
                    {revealedSolutions[rule.id] ? 'Ẩn đáp án mẫu' : 'Xem đáp án mẫu'}
                  </button>
                  <button
                    type="button"
                    className="primary"
                    onClick={() => saveGrammarReflection(rule.title, rule.id)}
                  >
                    Lưu bài luyện tập
                  </button>
                </div>
                {revealedSolutions[rule.id] && (
                  <div className="callout" style={{ marginTop: '8px' }}>
                    <b>Đáp án gợi ý:</b> {rule.sampleTransform}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GRAMMAR MISTAKE VAULT / SỔ NHỚ CÂU SAI */}
      {Object.keys(grammarErrors).length > 0 && (
        <div className="panel forum-error-vault" style={{ marginTop: 20 }}>
          <div className="vault-header">
            <div>
              <h3>Sổ nhớ ngữ pháp cần ôn lại ({Object.keys(grammarErrors).length} câu)</h3>
              <p className="muted">
                Các câu hỏi kiểm tra ngữ pháp bạn từng trả lời chưa đúng được lưu tại đây để củng cố phản xạ.
              </p>
            </div>
          </div>
          <div className="vault-items-grid">
            {Object.entries(grammarErrors).map(([ruleId, err]) => (
              <div key={ruleId} className="vault-item-card">
                <div className="vault-item-head">
                  <h4>{err.title}</h4>
                  <span className="vault-wrong-badge">{err.wrongCount} lần chưa đúng</span>
                </div>
                <p className="vault-meaning" style={{ fontStyle: 'italic' }}>“{err.prompt}”</p>
                <button
                  type="button"
                  className="primary"
                  style={{ fontSize: 11, padding: '6px 12px', marginTop: 8 }}
                  onClick={() => {
                    setViewTrack('cefr')
                    setSelectedCefr('all')
                    setExpandedRuleId(ruleId)
                  }}
                >
                  Mở bài học để ôn tập lại →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
