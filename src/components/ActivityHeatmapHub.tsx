import { useState } from 'react'
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { minutesByDate, localDate, heatLevel } from '../domain'
import type { Store } from '../types'

interface ActivityHeatmapHubProps {
  s: Store
  initialExpanded?: boolean
}

export default function ActivityHeatmapHub({ s, initialExpanded = true }: ActivityHeatmapHubProps) {
  const [expanded, setExpanded] = useState(initialExpanded)

  if (!expanded) {
    return (
      <div className="heatmap-hub-collapsed">
        <button onClick={() => setExpanded(true)} className="expand-button">
          <div className="hub-label">
            <span className="eyebrow">ACTIVITY HEATMAP</span>
            <b style={{display: 'block'}}>Expand Activity View</b>
          </div>
          <ChevronUp size={18} />
        </button>
      </div>
    )
  }

  return (
    <div className="heatmap-hub-expanded">
      <div className="hub-header">
        <div className="hub-title">
          <span className="eyebrow">ACTIVITY HEATMAP</span>
          <b style={{display: 'block'}}>Monthly Progress</b>
        </div>
        <button onClick={() => setExpanded(false)} className="collapse-button">
          <ChevronDown size={18} />
        </button>
      </div>
      <MonthlyHeatmap s={s} />
    </div>
  )
}

function MonthlyHeatmap({ s }: { s: Store }) {
  const map = minutesByDate(s.sessions)
  const key = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
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
  const skills = [...new Set([...attempts.map(attempt => attempt.skill), ...submissions.map(submission => submission.skill)])]

  return (
    <section className="panel heatmap-panel">
      <div className="heatmap-selected">
        <span className="eyebrow">SELECTED DATE</span>
        <h2 style={{fontSize: '24px', margin: '0'}}>{selectedDate.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
      </div>
      <div className="heatmap-heading">
        <h3 style={{fontSize: '16px', margin: '0'}}>{month.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h3>
        <div className="heatmap-nav">
          <button aria-label="Previous month" onClick={() => move(-1)}><ChevronLeft size={18} /></button>
          <button aria-label="Next month" onClick={() => move(1)}><ChevronRight size={18} /></button>
        </div>
      </div>
      <div className="heatmap-calendar">
        <div className="weekday-labels">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => <span key={day}>{day}</span>)}
        </div>
        <div className="heatmap-grid">
          {weeks.map((week, weekIndex) => (
            <div className="heatmap-week" key={weekIndex}>
              {week.map(date => {
                const dateKey = key(date)
                const value = map[dateKey] || 0
                const outside = date.getMonth() !== month.getMonth()
                const rest = s.profile.daysOff.includes(dateKey)
                
                return (
                  <button
                    key={dateKey}
                    aria-label={`${dateKey}: ${Math.round(value)} active minutes, ${attempts.filter(a => localDate(a.createdAt) === dateKey).length + (s.submissions || []).filter(sub => localDate(sub.createdAt) === dateKey).length} completed activities${rest ? ', planned rest day' : ''}`}
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
        <span style={{fontSize: '12px'}}>Less</span>
        {[0, 1, 2, 3, 4, 5].map(level => <i className={`heat l${level}`} key={level} aria-label={`Intensity ${level}`} style={{display: 'inline-block', width: '12px', height: '12px', marginRight: '4px', borderRadius: '2px'}} />)}
        <span style={{fontSize: '12px'}}>More active time</span>
      </div>
      <div className="heatmap-detail">
        <b style={{color: '#dceee1'}}>{selected}</b>
        <span style={{fontSize: '12px'}}>{Math.round(minutes)} active minutes{goal ? ` · ${Math.round(minutes / goal * 100)}% of ${goal}-minute goal` : ''}</span>
        <span style={{fontSize: '12px'}}>{completed ? `${completed} completed activities · ${skills.join(', ')}` : 'No recorded activities'}</span>
        <span style={{fontSize: '12px'}}>{s.profile.daysOff.includes(selected) ? 'Planned rest day' : ''}</span>
      </div>
    </section>
  )
}
