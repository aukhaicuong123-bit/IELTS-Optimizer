import React, { useMemo } from 'react'
import { Sparkles, ArrowRight, BookOpen, Layers } from 'lucide-react'
import { calculateCourseCompletion, calculateJourneyXp } from '../gamification'
import { uiBackgroundAsset, uiJourneyAsset } from '../uiAssets'

export interface StudyTreeProps {
  activeTrack: 'vocabulary' | 'grammar'
  onSelectTrack: (track: 'vocabulary' | 'grammar') => void
  knownVocabCount: number
  totalVocabCount: number
  completedGrammarCount: number
  totalGrammarCount: number
  variant?: 'track' | 'dashboard'
}

interface TreeStage {
  step: string
  name: string
  icon: string
  minXp: number
  maxXp: number
  description: string
}

export const TREE_STAGES: TreeStage[] = [
  { step: '01', name: 'Người mới', icon: '★', minXp: 0, maxXp: 150, description: 'Làm quen nền tảng và xây thói quen học tập' },
  { step: '02', name: 'Người khám phá', icon: '✦', minXp: 150, maxXp: 350, description: 'Mở rộng vốn từ và các cấu trúc cốt lõi' },
  { step: '03', name: 'Người rèn luyện', icon: '✦', minXp: 350, maxXp: 650, description: 'Củng cố phản xạ qua bài học và luyện tập' },
  { step: '04', name: 'Kỳ cựu', icon: '✦', minXp: 650, maxXp: 1050, description: 'Tự tin ứng dụng vào bài viết và bài nói' },
  { step: '05', name: 'Chuyên gia', icon: '✦', minXp: 1050, maxXp: 1500, description: 'Làm chủ cấu trúc học thuật Band 7.5+' },
  { step: '06', name: 'Bậc thầy IELTS', icon: '♛', minXp: 1500, maxXp: 2500, description: 'Sẵn sàng chinh phục mục tiêu IELTS Band 8.0+' }
]

const MILESTONE_ASSETS = [
  uiJourneyAsset('milestone-backpack'),
  uiJourneyAsset('milestone-lantern'),
  uiJourneyAsset('milestone-signpost'),
  uiJourneyAsset('milestone-treasure-map'),
  uiJourneyAsset('milestone-flag-mountain'),
  uiJourneyAsset('milestone-crowned-summit')
]

export const ForumStudyTree: React.FC<StudyTreeProps> = ({
  activeTrack,
  onSelectTrack,
  knownVocabCount,
  totalVocabCount,
  completedGrammarCount,
  totalGrammarCount,
  variant = 'track'
}) => {
  // Calculate total XP dynamically
  const currentXp = useMemo(() => {
    return calculateJourneyXp(knownVocabCount, completedGrammarCount)
  }, [knownVocabCount, completedGrammarCount])

  // Determine current stage
  const currentStageIndex = useMemo(() => {
    const idx = TREE_STAGES.findIndex(s => currentXp >= s.minXp && currentXp < s.maxXp)
    return idx !== -1 ? idx : TREE_STAGES.length - 1
  }, [currentXp])

  const currentStage = TREE_STAGES[currentStageIndex]
  const nextStage = TREE_STAGES[currentStageIndex + 1] || null

  // Progress percentage inside current stage
  const stageProgressPercent = useMemo(() => {
    if (!nextStage) return 100
    const stageSpan = nextStage.minXp - currentStage.minXp
    const earnedInStage = currentXp - currentStage.minXp
    return Math.min(100, Math.max(0, Math.round((earnedInStage / stageSpan) * 100)))
  }, [currentXp, currentStage, nextStage])

  // Overall course completion
  const overallPercent = useMemo(() => {
    return calculateCourseCompletion(
      knownVocabCount,
      totalVocabCount || 64,
      completedGrammarCount,
      totalGrammarCount || 24
    )
  }, [knownVocabCount, totalVocabCount, completedGrammarCount, totalGrammarCount])

  const xpNeeded = nextStage ? Math.max(0, nextStage.minXp - currentXp) : 0

  return (
    <div className={`forum-tree-card ${variant === 'dashboard' ? 'forum-tree-card-dashboard' : ''}`}>
      {/* Shared IELTS journey banner for the vocabulary and grammar tracks */}
      <img
        className="journey-mountain-path"
        src={variant === 'dashboard'
          ? uiBackgroundAsset('hero-mountain-with-birds')
          : uiJourneyAsset('journey-mountain-path')}
        alt=""
        aria-hidden="true"
      />
      <div className="forum-tree-top">
        <div className="forum-tree-motto">
          <span className="forum-badge-pill">
            <Sparkles size={13} /> HÀNH TRÌNH IELTS · STUDY PATH
          </span>
          <h3>Học theo từng chặng, nhớ theo từng bài.</h3>
          <p>
            Từ nền tảng đến phản xạ thành thạo, mỗi bài học là một cột mốc riêng trên hành trình IELTS của bạn.
            Kết quả luyện tập được ghi lại để bạn luôn biết bước tiếp theo.
          </p>
          <div className="forum-track-switchers">
            <button
              type="button"
              className={`forum-track-btn ${activeTrack === 'grammar' ? 'active' : ''}`}
              onClick={() => onSelectTrack('grammar')}
            >
              <BookOpen size={16} />
              <span>Học ngữ pháp</span>
              <ArrowRight size={14} className="arrow-icon" />
            </button>
            <button
              type="button"
              className={`forum-track-btn ${activeTrack === 'vocabulary' ? 'active' : ''}`}
              onClick={() => onSelectTrack('vocabulary')}
            >
              <Layers size={16} />
              <span>Học từ vựng</span>
              <ArrowRight size={14} className="arrow-icon" />
            </button>
          </div>
        </div>

        {/* Tree Growth Status Box */}
        <div className="forum-tree-status-box">
          <div className="tree-stage-visual">
            <div className={`tree-stage-avatar stage-art-${currentStageIndex}`}>
              <img src={uiJourneyAsset('stage-badge-mountain')} alt="" aria-hidden="true" />
            </div>
            <div className="tree-stage-meta">
              <div className="tree-stage-kicker">GIAI ĐOẠN {currentStage.step}</div>
              <h4>{currentStage.name}</h4>
              <p>{currentStage.description}</p>
            </div>
          </div>

          <div className="tree-xp-bar-wrap">
            <div className="tree-xp-labels">
              <span>{nextStage ? `Còn ${xpNeeded} XP để đạt ${nextStage.name}` : 'Đã đạt cấp độ tối đa'}</span>
              <b>{stageProgressPercent}%</b>
            </div>
            <div
              className="tree-xp-track"
              role="progressbar"
              aria-label={`Tiến độ từ ${currentStage.name} tới ${nextStage?.name || 'cấp độ tối đa'}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={stageProgressPercent}
              aria-valuetext={`${stageProgressPercent}%`}
            >
              <div
                className="tree-xp-fill"
                style={{ width: `${stageProgressPercent}%` }}
              />
            </div>
          </div>

          <div className="tree-metrics-row">
            <div className="tree-metric-col">
              <small>Tích lũy XP</small>
              <b>{currentXp} XP</b>
            </div>
            <div className="tree-metric-col">
              <small>Vocab + Grammar</small>
              <b>{overallPercent}% hoàn thành</b>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Stages Stepper Bar */}
      <div className="forum-tree-stepper">
        {TREE_STAGES.map((st, i) => {
          const isDone = i < currentStageIndex
          const isCurrent = i === currentStageIndex
          return (
            <div
              key={st.step}
              className={`tree-step-item ${isCurrent ? 'current' : isDone ? 'done' : 'future'}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <img className="step-illustration" src={MILESTONE_ASSETS[i]} alt="" aria-hidden="true" />
              <div className="step-badge">
                <span className="step-num">{st.step}</span>
                <span className="step-icon">{st.icon}</span>
              </div>
              <span className="step-title">{st.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
