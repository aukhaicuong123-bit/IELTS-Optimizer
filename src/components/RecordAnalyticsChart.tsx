import { Activity, CalendarDays, Clock3, Flame, Layers, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import { localDate, measuredMinutes, measuredStreak, minutesByDate } from '../domain'
import type { Skill, Store } from '../types'

type SkillTone = {
  skill: Skill
  label: string
  color: string
  soft: string
}

const SKILLS: SkillTone[] = [
  { skill: 'Reading', label: 'Reading', color: '#0c7668', soft: '#d8f2eb' },
  { skill: 'Listening', label: 'Listening', color: '#2f7c9a', soft: '#dceff6' },
  { skill: 'Writing', label: 'Writing', color: '#b27a2a', soft: '#faecd0' },
  { skill: 'Speaking', label: 'Speaking', color: '#a95d72', soft: '#f8e1e8' },
  { skill: 'Vocabulary', label: 'Từ vựng', color: '#6878b5', soft: '#e5e9fa' },
  { skill: 'Grammar', label: 'Ngữ pháp', color: '#5e9060', soft: '#e2f1df' }
]

const DAY_COUNT = 30

function dateKey(date: Date) {
  return localDate(date.toISOString())
}

function buildDateRange(days: number) {
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (days - 1 - index))
    return date
  })
}

function shortDate(date: Date) {
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(date)
}

function minutesLabel(minutes: number) {
  if (minutes < 1) return '0 phút'
  if (minutes < 60) return `${Math.round(minutes)} phút`
  const hours = Math.floor(minutes / 60)
  const remainder = Math.round(minutes % 60)
  return remainder ? `${hours}g ${remainder}p` : `${hours} giờ`
}

function chartPoint(index: number, value: number, max: number, total: number) {
  const x = 32 + (index / Math.max(total - 1, 1)) * 656
  const y = 208 - (value / Math.max(max, 1)) * 156
  return { x, y }
}

export function RecordAnalyticsChart({ s }: { s: Store }) {
  const dates = useMemo(() => buildDateRange(DAY_COUNT), [])
  const minutes = useMemo(() => minutesByDate(s.sessions), [s.sessions])
  const series = useMemo(
    () => dates.map(date => ({ date, value: minutes[dateKey(date)] || 0 })),
    [dates, minutes]
  )
  const chartMax = Math.max(...series.map(item => item.value), 15)
  const totalMinutes = useMemo(
    () => s.sessions.reduce((total, session) => total + measuredMinutes(session), 0),
    [s.sessions]
  )
  const activeDays = series.filter(item => item.value > 0).length
  const bestDay = series.reduce((best, item) => (item.value > best.value ? item : best), series[0])
  const streak = measuredStreak(s.sessions)
  const evidenceCount = s.attempts.length + (s.submissions || []).length
  const skillMinutes = useMemo(() => {
    const totals = new Map<Skill, number>()
    for (const session of s.sessions) {
      if (!session.skill) continue
      totals.set(session.skill, (totals.get(session.skill) || 0) + measuredMinutes(session))
    }
    return SKILLS.map(item => ({ ...item, value: totals.get(item.skill) || 0 }))
  }, [s.sessions])
  const skillMax = Math.max(...skillMinutes.map(item => item.value), 1)
  const recentSessions = useMemo(
    () => s.sessions.slice().sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt)).slice(0, 4),
    [s.sessions]
  )
  const points = series.map((item, index) => chartPoint(index, item.value, chartMax, series.length))
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} 208 L ${points[0].x} 208 Z`
  const hasActivity = totalMinutes > 0

  return (
    <div className="record-analytics-dashboard">
      <div className="record-analytics-dashboard-head">
        <div>
          <span className="eyebrow">REAL ACTIVITY · 30 NGÀY GẦN NHẤT</span>
          <h3>Nhịp học của bạn, nhìn thấy được</h3>
          <p className="muted">Mỗi điểm dữ liệu đến từ thời gian active đã đo bằng timer, không phải số liệu ước tính.</p>
        </div>
        <div className={`record-live-indicator${hasActivity ? ' is-active' : ''}`}>
          <span aria-hidden="true" /> {hasActivity ? 'Đang theo dõi dữ liệu thật' : 'Chờ phiên học đầu tiên'}
        </div>
      </div>

      <div className="record-analytics-kpis" aria-label="Các chỉ số học tập thực tế">
        <div className="record-analytics-kpi">
          <span className="record-kpi-icon" style={{ background: '#d8f2eb', color: '#0c7668' }}><Clock3 size={17} /></span>
          <span><small>Tổng thời gian active</small><strong>{minutesLabel(totalMinutes)}</strong></span>
        </div>
        <div className="record-analytics-kpi">
          <span className="record-kpi-icon" style={{ background: '#e5e9fa', color: '#6878b5' }}><CalendarDays size={17} /></span>
          <span><small>Ngày có hoạt động</small><strong>{activeDays}/30 ngày</strong></span>
        </div>
        <div className="record-analytics-kpi">
          <span className="record-kpi-icon" style={{ background: '#faecd0', color: '#b27a2a' }}><Flame size={17} /></span>
          <span><small>Chuỗi hiện tại</small><strong>{streak} ngày</strong></span>
        </div>
        <div className="record-analytics-kpi">
          <span className="record-kpi-icon" style={{ background: '#dceff6', color: '#2f7c9a' }}><Layers size={17} /></span>
          <span><small>Minh chứng đã lưu</small><strong>{evidenceCount}</strong></span>
        </div>
      </div>

      <div className="record-analytics-main-grid">
        <section className="record-chart-card" aria-labelledby="record-activity-chart-title">
          <div className="record-chart-card-head">
            <div>
              <span className="record-card-kicker"><TrendingUp size={14} /> TỔNG QUAN XU HƯỚNG</span>
              <h4 id="record-activity-chart-title">Phút học chủ động</h4>
            </div>
            <div className="record-chart-highlight">
              <strong>{minutesLabel(bestDay.value)}</strong>
              <span>ngày cao nhất · {shortDate(bestDay.date)}</span>
            </div>
          </div>
          <div className="record-chart-wrap">
            <svg className="record-activity-chart" viewBox="0 0 720 250" role="img" aria-label="Biểu đồ phút học chủ động trong 30 ngày gần nhất">
              <defs>
                <linearGradient id="recordChartArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0c7668" stopOpacity=".28" />
                  <stop offset="100%" stopColor="#0c7668" stopOpacity=".02" />
                </linearGradient>
                <linearGradient id="recordChartLine" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#0c7668" />
                  <stop offset="100%" stopColor="#24aa8f" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3].map(level => {
                const y = 208 - level * 52
                return <line key={level} x1="32" x2="688" y1={y} y2={y} className="record-chart-grid-line" />
              })}
              <text x="32" y="235" className="record-chart-axis-label">{shortDate(series[0].date)}</text>
              <text x="360" y="235" textAnchor="middle" className="record-chart-axis-label">{shortDate(series[14].date)}</text>
              <text x="688" y="235" textAnchor="end" className="record-chart-axis-label">{shortDate(series[29].date)}</text>
              {hasActivity && <path d={areaPath} fill="url(#recordChartArea)" />}
              {hasActivity && <path d={linePath} fill="none" stroke="url(#recordChartLine)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />}
              {points.map((point, index) => (
                <g key={dateKey(series[index].date)}>
                  {series[index].value > 0 && <circle cx={point.x} cy={point.y} r="5" className="record-chart-point" />}
                  <title>{`${shortDate(series[index].date)}: ${minutesLabel(series[index].value)}`}</title>
                </g>
              ))}
              {!hasActivity && <text x="360" y="125" textAnchor="middle" className="record-chart-empty-label">Chưa có phiên học active trong 30 ngày gần đây</text>}
            </svg>
          </div>
          <div className="record-chart-footnote"><span className="record-chart-dot" /> Phút active được tính từ các khoảng timer đang chạy · ngày không có dữ liệu = 0</div>
        </section>

        <section className="record-chart-card record-skill-card" aria-labelledby="record-skill-chart-title">
          <div className="record-chart-card-head">
            <div>
              <span className="record-card-kicker"><Activity size={14} /> PHÂN BỔ THỜI GIAN</span>
              <h4 id="record-skill-chart-title">Nhịp học theo kỹ năng</h4>
            </div>
          </div>
          <div className="record-skill-bars">
            {skillMinutes.map(item => (
              <div className="record-skill-row" key={item.skill}>
                <div className="record-skill-label"><span className="record-skill-dot" style={{ background: item.color }} /> <span>{item.label}</span><strong>{minutesLabel(item.value)}</strong></div>
                <div className="record-skill-track"><span style={{ width: `${item.value ? Math.max((item.value / skillMax) * 100, 4) : 0}%`, background: item.color }} /></div>
              </div>
            ))}
          </div>
          <p className="record-chart-footnote">Chỉ phiên có gắn kỹ năng mới được phân bổ vào biểu đồ này.</p>
        </section>
      </div>

      <section className="record-recent-activity" aria-labelledby="record-recent-title">
        <div className="record-recent-heading">
          <div>
            <span className="record-card-kicker"><Layers size={14} /> DÒNG DỮ LIỆU GẦN NHẤT</span>
            <h4 id="record-recent-title">Hoạt động vừa ghi nhận</h4>
          </div>
          <span className="record-recent-count">{s.sessions.length} phiên trong hồ sơ</span>
        </div>
        {recentSessions.length ? (
          <div className="record-recent-list">
            {recentSessions.map(session => {
              const skill = SKILLS.find(item => item.skill === session.skill)
              const active = measuredMinutes(session)
              return (
                <div className="record-recent-row" key={session.id}>
                  <span className="record-recent-avatar" style={{ background: skill?.soft || '#edf3ed', color: skill?.color || '#5e756d' }}><Activity size={16} /></span>
                  <span className="record-recent-copy"><strong>{session.activity || 'Study session'}</strong><small>{skill?.label || 'Chưa gắn kỹ năng'} · {new Date(session.startedAt).toLocaleString('vi-VN')}</small></span>
                  <strong className="record-recent-minutes">{active > 0 ? minutesLabel(active) : 'Không tính'}</strong>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="record-analytics-empty"><Activity size={18} /><span>Chưa có hoạt động để phân tích. Bắt đầu một phiên timer để biểu đồ tự cập nhật.</span></div>
        )}
      </section>
    </div>
  )
}

