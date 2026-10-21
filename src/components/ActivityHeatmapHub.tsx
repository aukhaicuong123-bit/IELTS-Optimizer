import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  Flame,
  BarChart3,
  Sparkles,
  CheckCircle2,
  Layers
} from 'lucide-react'
import { Store, Attempt, StudySession } from '../types'
import { localDate, measuredMinutes, minutesByDate } from '../domain'

interface ActivityHeatmapHubProps {
  s: Store
  initialExpanded?: boolean
  onExpandChange?: (expanded: boolean) => void
}

interface HeatmapDay {
  dayOfWeek: number
  dayName: string
  dateKey: string
  minutes: number
  level: number
}

interface HeatmapColumn {
  id: string
  monthName: string
  monthIndex: number
  periodIndex: number
  days: HeatmapDay[]
}

export function ActivityHeatmapHub({ s }: ActivityHeatmapHubProps) {
  // Primary view: 'month' (Giao diện 2) or 'year' (Bản đồ năm)
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month')
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false)
  const [tooltip, setTooltip] = useState<{
    text: string
    x: number
    y: number
    visible: boolean
  }>({ text: '', x: 0, y: 0, visible: false })

  const matrixContainerRef = useRef<HTMLDivElement>(null)
  const yearMenuRef = useRef<HTMLDivElement>(null)

  // Close the year dropdown when clicking outside of it
  useEffect(() => {
    if (!yearDropdownOpen) return
    const onDocPointerDown = (e: MouseEvent) => {
      if (yearMenuRef.current && !yearMenuRef.current.contains(e.target as Node)) {
        setYearDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocPointerDown)
    return () => document.removeEventListener('mousedown', onDocPointerDown)
  }, [yearDropdownOpen])

  // Real store minutes
  const realMinutesMap = useMemo(() => minutesByDate(s.sessions), [s.sessions])

  // Today ISO key
  const todayIsoKey = useMemo(() => localDate(new Date().toISOString()), [])

  // Always start from the real current date; never point the learner at a demo day.
  const [selectedDateKey, setSelectedDateKey] = useState<string>(todayIsoKey)

  // Calendar view month follows the real current date.
  const [viewMonth, setViewMonth] = useState<Date>(() => new Date())

  // Selected date object
  const selectedDateObj = useMemo(() => {
    return new Date(`${selectedDateKey}T12:00:00`)
  }, [selectedDateKey])

  // Calendar cells are based only on measured active minutes.
  const getDayMinutes = (dateKey: string) => Math.round(realMinutesMap[dateKey] || 0)

  // Intensity level 0 - 5
  const getLevel = (minutes: number) => {
    if (minutes <= 0) return 0
    if (minutes <= 15) return 1
    if (minutes <= 30) return 2
    if (minutes <= 60) return 3
    if (minutes <= 90) return 4
    return 5
  }

  // 12 Months & Weekdays
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dayRowLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Month Calendar Grid (42 cells starting Monday matching Image 2)
  const calendarGrid = useMemo(() => {
    const year = viewMonth.getFullYear()
    const month = viewMonth.getMonth()
    const firstDay = new Date(year, month, 1)

    // Monday-based index: 0 = Mon, ..., 6 = Sun
    const dayOfWeek = firstDay.getDay()
    const mondayOffset = (dayOfWeek + 6) % 7

    const start = new Date(year, month, 1 - mondayOffset)
    const days: { date: Date; dateKey: string; isCurrentMonth: boolean; minutes: number; level: number }[] = []

    for (let i = 0; i < 42; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const dKey = localDate(d.toISOString())
      const minutes = getDayMinutes(dKey)
      days.push({
        date: d,
        dateKey: dKey,
        isCurrentMonth: d.getMonth() === month,
        minutes,
        level: getLevel(minutes)
      })
    }
    return days
  }, [viewMonth, realMinutesMap])

  // Activity Overview stats — always computed from real session data.
  // No hardcoded demo strings: an empty store shows real zeroes /
  // 'Chưa có dữ liệu' rather than fabricated reference values.
  const statsOverview = useMemo(() => {
    const todayMins = Math.round(realMinutesMap[todayIsoKey] || 0)

    let last7DaysTotal = 0
    const now = new Date()
    for (let i = 0; i < 7; i++) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      const key = localDate(d.toISOString())
      last7DaysTotal += Math.round(realMinutesMap[key] || 0)
    }
    const fmtMinutes = (mins: number) => {
      const hours = Math.floor(mins / 60)
      const m = mins % 60
      return hours > 0 ? `${hours} giờ ${m} phút` : `${m} phút`
    }

    // Most active day: day with the most real study minutes
    let bestKey: string | null = null
    let bestMins = 0
    Object.keys(realMinutesMap).forEach(key => {
      const mins = Math.round(realMinutesMap[key] || 0)
      if (mins > bestMins) {
        bestMins = mins
        bestKey = key
      }
    })
    let mostActiveDayText = 'Chưa có dữ liệu'
    if (bestKey) {
      const weekday = new Date(`${bestKey}T12:00:00`).toLocaleDateString('vi-VN', { weekday: 'long' })
      const weekdayLabel = weekday.charAt(0).toUpperCase() + weekday.slice(1)
      mostActiveDayText = `${weekdayLabel} · ${bestMins} phút`
    }

    return {
      todayMins: `${todayMins} phút`,
      past7DaysText: fmtMinutes(last7DaysTotal),
      mostActiveDayText
    }
  }, [realMinutesMap, todayIsoKey])

  // Selected Day Details
  const selectedDayDetails = useMemo(() => {
    const sessions = s.sessions.filter(sess => localDate(sess.startedAt) === selectedDateKey)
    const attempts = s.attempts.filter(att => localDate(att.createdAt) === selectedDateKey)
    const submissions = (s.submissions || []).filter(sub => localDate(sub.createdAt) === selectedDateKey)
    const realMin = Math.round(realMinutesMap[selectedDateKey] || 0)

    return {
      dateKey: selectedDateKey,
      isToday: selectedDateKey === todayIsoKey,
      minutes: realMin,
      sessionsCount: sessions.length,
      attemptsCount: attempts.length,
      submissionsCount: submissions.length,
      hasRealData: sessions.length > 0 || attempts.length > 0 || submissions.length > 0,
      attempts,
      sessions
    }
  }, [selectedDateKey, realMinutesMap, s.sessions, s.attempts, s.submissions])

  // Month navigation
  const changeMonth = (delta: number) => {
    setViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1))
  }

  // Jump to today
  const jumpToToday = () => {
    const today = new Date()
    const todayKey = localDate(today.toISOString())
    setSelectedDateKey(todayKey)
    setSelectedYear(today.getFullYear())
    setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    setViewMode('month')
  }

  // Select day
  const handleDayClick = (dateKey: string) => {
    setSelectedDateKey(dateKey)
    const d = new Date(`${dateKey}T12:00:00`)
    if (d.getMonth() !== viewMonth.getMonth() || d.getFullYear() !== viewMonth.getFullYear()) {
      setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1))
    }
  }

  // Tooltip
  const handleCellHover = (e: React.MouseEvent, minutes: number, dateKey: string) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const containerRect = matrixContainerRef.current?.getBoundingClientRect() || { left: 0, top: 0 }
    const d = new Date(`${dateKey}T12:00:00`)
    const formattedDate = d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    })
    const text = `${Math.round(minutes)} phút học chủ động · ${formattedDate}`

    setTooltip({
      text,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 8,
      visible: true
    })
  }

  const handleCellLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }))
  }

  // Full Year Heatmap columns (25 columns across 12 months)
  // Each column is a REAL Monday-start week so every row genuinely maps to
  // Mon..Sun and every tile points at a real calendar date. (The previous
  // version fabricated dates from fixed day-of-month starts 3/16/25 capped at
  // day 28, so tiles were misaligned with their weekday rows and days 29-31
  // could never appear.)
  const heatmapColumns = useMemo<HeatmapColumn[]>(() => {
    const cols: HeatmapColumn[] = []
    const periodsPerMonth = [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2]
    monthLabels.forEach((mName, mIdx) => {
      const periods = periodsPerMonth[mIdx]
      // All Mondays that fall inside this month
      const mondays: Date[] = []
      const cursor = new Date(selectedYear, mIdx, 1)
      while (cursor.getMonth() === mIdx) {
        if (cursor.getDay() === 1) mondays.push(new Date(cursor))
        cursor.setDate(cursor.getDate() + 1)
      }
      if (mondays.length === 0) return
      // Spread chosen weeks evenly: first Monday .. last Monday of the month
      const pickedIndexes =
        periods >= mondays.length
          ? mondays.map((_, i) => i)
          : Array.from({ length: periods }, (_, p) =>
              Math.round((p * (mondays.length - 1)) / (periods - 1))
            )
      pickedIndexes.forEach((mondayIdx, p) => {
        const monday = mondays[mondayIdx]
        const days: HeatmapDay[] = dayRowLabels.map((dayName, dayOfWeek) => {
          const d = new Date(monday)
          d.setDate(monday.getDate() + dayOfWeek)
          const dateKey = localDate(d.toISOString())
          const minutes = getDayMinutes(dateKey)
          return {
            dayOfWeek,
            dayName,
            dateKey,
            minutes,
            level: getLevel(minutes)
          }
        })
        cols.push({
          id: `${mName}-${p}`,
          monthName: mName,
          monthIndex: mIdx,
          periodIndex: p,
          days
        })
      })
    })
    return cols
  }, [selectedYear, realMinutesMap])

  const heatmapMonthSpans = useMemo(() => {
    return monthLabels
      .map((monthName, monthIndex) => ({
        monthName,
        span: heatmapColumns.filter(column => column.monthIndex === monthIndex).length
      }))
      .filter(month => month.span > 0)
  }, [heatmapColumns])

  const totalActiveMinutes = useMemo(() => {
    return Object.entries(realMinutesMap)
      .filter(([dateKey]) => dateKey.startsWith(`${selectedYear}-`))
      .reduce((total, [, minutes]) => total + Math.round(minutes), 0)
  }, [selectedYear, realMinutesMap])

  const availableYears = useMemo(() => {
    const years = new Set<number>([currentYear])
    s.sessions.forEach(session => {
      const year = new Date(session.startedAt).getFullYear()
      if (Number.isFinite(year)) years.add(year)
    })
    return Array.from(years).sort((a, b) => b - a)
  }, [currentYear, s.sessions])

  return (
    <div className="img2-heatmap-hub" ref={matrixContainerRef}>
      {/* ======================================================== */}
      {/* TOP HEADER: Icon + Title + Switcher + Actions            */}
      {/* ======================================================== */}
      <div className="img2-hub-header">
        <div className="img2-title-cluster">
          <div className="img2-badge-icon" aria-hidden="true">
            <CalendarDays size={20} />
          </div>
          <div>
            <h2 className="img2-main-title">Hoạt động học tập & Lịch tháng</h2>
            <p className="img2-subtitle">
              {selectedDateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })} · {totalActiveMinutes} phút học chủ động trong năm {selectedYear}
            </p>
          </div>
        </div>

        <div className="img2-header-actions">
          {/* View Mode Toggle: Lịch tháng (Giao diện 2) vs Bản đồ năm */}
          <div className="img2-view-switcher" role="tablist" aria-label="Chế độ xem">
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'month'}
              className={`img2-view-tab ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              <CalendarDays size={15} />
              <span>Lịch tháng</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'year'}
              className={`img2-view-tab ${viewMode === 'year' ? 'active' : ''}`}
              onClick={() => setViewMode('year')}
            >
              <Layers size={15} />
              <span>Bản đồ năm</span>
            </button>
          </div>

          {/* Jump to Today */}
          <button
            type="button"
            className="img2-today-btn"
            onClick={jumpToToday}
            title="Trở về hôm nay"
          >
            Hôm nay
          </button>

          {/* Year selector dropdown */}
          <div className="img2-year-selector-wrap" ref={yearMenuRef}>
            <button
              type="button"
              className="img2-year-btn"
              onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
            >
              <span>Năm {selectedYear}</span>
              <ChevronDown size={14} />
            </button>
            {yearDropdownOpen && (
              <div className="img2-year-menu">
                {availableYears.map(y => (
                  <button
                    key={y}
                    type="button"
                    className={`img2-year-opt ${selectedYear === y ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedYear(y)
                      setViewMonth(prev => new Date(y, prev.getMonth(), 1))
                      setYearDropdownOpen(false)
                    }}
                  >
                    Năm {y}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW MODE 1: GIAO DIỆN THỨ 2 (MONTH CALENDAR + STATS)    */}
      {/* ======================================================== */}
      {viewMode === 'month' ? (
        <div className="img2-giao-dien-2-layout">
          {/* ---------------------------------------------------- */}
          {/* LEFT: EXPANDED MONTH CALENDAR (Image 2 Primary Card) */}
          {/* ---------------------------------------------------- */}
          <div className="img2-cal-card img2-cal-primary">
            {/* Header: Monday, October 19 */}
            <div className="img2-cal-header-bar">
              <div className="img2-cal-header-date">
                {selectedDateObj.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              {/* Subheader: selected month with < > buttons */}
              <div className="img2-cal-month-nav">
                <span className="img2-cal-month-title">
                  {viewMonth.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
                <div className="img2-cal-arrows">
                  <button
                    type="button"
                    className="img2-arrow-btn"
                    onClick={() => changeMonth(-1)}
                    aria-label="Previous month"
                    title="Tháng trước"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    className="img2-arrow-btn"
                    onClick={() => changeMonth(1)}
                    aria-label="Next month"
                    title="Tháng sau"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Weekday Row: Mon Tue Wed Thu Fri Sat Sun (Monday start!) */}
            <div className="img2-cal-weekdays" aria-hidden="true">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            {/* 42-cell Calendar Days Grid */}
            <div className="img2-cal-grid" role="grid">
              {calendarGrid.map((dayItem, idx) => {
                const isSelected = dayItem.dateKey === selectedDateKey
                const dayNum = dayItem.date.getDate()
                const hasDot = dayItem.minutes > 0
                const isToday = dayItem.dateKey === todayIsoKey

                return (
                  <button
                    key={`${dayItem.dateKey}-${idx}`}
                    type="button"
                    className={`img2-cal-cell ${!dayItem.isCurrentMonth ? 'outside' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'is-today' : ''}`}
                    onClick={() => handleDayClick(dayItem.dateKey)}
                    onMouseEnter={e => handleCellHover(e, dayItem.minutes, dayItem.dateKey)}
                    onMouseLeave={handleCellLeave}
                    aria-label={`${dayItem.dateKey}: ${dayItem.minutes} phút học chủ động`}
                  >
                    <span className="img2-cell-num">{dayNum}</span>
                    {hasDot && (
                      <span
                        className={`img2-cell-dot dot-lvl-${dayItem.level}`}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Calendar Footer Legend */}
            <div className="img2-cal-legend">
              <div className="img2-cal-legend-item">
                <span className="img2-legend-sample-blue" />
                <span>Ngày đang chọn</span>
              </div>
              <div className="img2-cal-legend-item">
                <span className="img2-legend-sample-dot" />
                <span>Có hoạt động học tập</span>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------- */}
          {/* RIGHT: OVERVIEW STATS + SELECTED DAY DETAILS         */}
          {/* ---------------------------------------------------- */}
          <div className="img2-right-sidebar">
            {/* Card 1: Tổng quan hoạt động (Exact replica of Image 2) */}
            <div className="img2-overview-card">
              <h3 className="img2-overview-title">Tổng quan hoạt động</h3>
              <div className="img2-overview-list">
                <div className="img2-overview-item">
                  <div className="img2-item-left">
                    <span className="img2-stat-icon green-icon">
                      <Clock size={16} />
                    </span>
                    <span className="img2-stat-label">Tổng thời gian học hôm nay</span>
                  </div>
                  <strong className="img2-stat-value">{statsOverview.todayMins}</strong>
                </div>

                <div className="img2-overview-item">
                  <div className="img2-item-left">
                    <span className="img2-stat-icon blue-icon">
                      <BarChart3 size={16} />
                    </span>
                    <span className="img2-stat-label">Thời gian học 7 ngày qua</span>
                  </div>
                  <strong className="img2-stat-value">{statsOverview.past7DaysText}</strong>
                </div>

                <div className="img2-overview-item">
                  <div className="img2-item-left">
                    <span className="img2-stat-icon purple-icon">
                      <Flame size={16} />
                    </span>
                    <span className="img2-stat-label">Ngày học tích cực nhất</span>
                  </div>
                  <strong className="img2-stat-value">{statsOverview.mostActiveDayText}</strong>
                </div>
              </div>
            </div>

            {/* Card 2: Chi tiết ngày đã chọn */}
            <div className="img2-day-detail-card">
              <div className="img2-detail-header">
                <div className="img2-detail-title-wrap">
                  <span className="img2-detail-badge">
                    {selectedDayDetails.isToday ? 'Hôm nay · Chi tiết ngày' : 'Chi tiết ngày'}
                  </span>
                  <h4 className="img2-detail-date">
                    {selectedDateObj.toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </h4>
                </div>
                <div className="img2-detail-mins-pill">
                  {selectedDayDetails.minutes} phút
                </div>
              </div>

              <div className="img2-detail-content">
                {selectedDayDetails.hasRealData ? (
                  <div className="img2-detail-activities">
                    {selectedDayDetails.attempts.map((att: Attempt, idx: number) => (
                      <div key={att.id || idx} className="img2-detail-item">
                        <span className="img2-item-bullet"><CheckCircle2 size={14} /></span>
                        <div className="img2-item-info">
                          <strong>Luyện Reading: {att.skill}</strong>
                          <span className="img2-item-sub">Đúng: {att.score}/{att.total} câu</span>
                        </div>
                      </div>
                    ))}
                    {selectedDayDetails.sessions.map((sess: StudySession, idx: number) => (
                      <div key={sess.id || idx} className="img2-detail-item">
                        <span className="img2-item-bullet"><Clock size={14} /></span>
                        <div className="img2-item-info">
                          <strong>Phiên đếm giờ học: {sess.skill || 'Tự học'}</strong>
                          <span className="img2-item-sub">
                            {Math.round(measuredMinutes(sess)) > 0
                              ? `${Math.round(measuredMinutes(sess))} phút học chủ động`
                              : 'Chưa có phút học chủ động được đo'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="img2-detail-empty">
                    <Sparkles size={20} className="img2-sparkle-icon" />
                    <p>
                      {selectedDayDetails.minutes > 0
                        ? `Đã ghi nhận ${selectedDayDetails.minutes} phút hoạt động học tập trong ngày.`
                        : selectedDayDetails.isToday
                          ? 'Hôm nay chưa có phiên học nào được ghi nhận. Hãy bắt đầu một phiên học để cập nhật dữ liệu tại đây.'
                          : 'Chưa có hoạt động học trong ngày này. Hãy bấm Bắt đầu học để duy trì chuỗi học tập!'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* VIEW MODE 2: BẢN ĐỒ CẢ NĂM (YEAR HEATMAP OVERVIEW)       */
        /* ======================================================== */
        <div className="img2-year-full-layout">
          <div className="img2-heatmap-card">
            {/* Month labels along the top */}
            <div className="img2-months-header">
              <div className="img2-day-spacer" />
              <div className="img2-months-row">
                {heatmapMonthSpans.map(month => (
                  <span
                    key={month.monthName}
                    className="img2-month-label"
                    style={{ gridColumn: `span ${month.span}` }}
                  >
                    {month.monthName}
                  </span>
                ))}
              </div>
            </div>

            {/* Matrix Body: 7 Day Labels + 25 Columns */}
            <div className="img2-matrix-grid-wrap">
              <div className="img2-day-labels" aria-hidden="true">
                {dayRowLabels.map(d => (
                  <span key={d}>{d}</span>
                ))}
              </div>

              <div className="img2-matrix-columns">
                {heatmapColumns.map((col: HeatmapColumn) => (
                  <div key={col.id} className="img2-matrix-col">
                    {col.days.map((cell: HeatmapDay) => (
                      <button
                        key={`${col.id}-${cell.dayOfWeek}`}
                        type="button"
                        className={`img2-heat-tile lvl-${cell.level} ${cell.dateKey === selectedDateKey ? 'tile-active' : ''}`}
                        onClick={() => {
                          handleDayClick(cell.dateKey)
                          setViewMode('month')
                        }}
                        onMouseEnter={e => handleCellHover(e, cell.minutes, cell.dateKey)}
                        onMouseLeave={handleCellLeave}
                        aria-label={`${cell.dateKey}: ${cell.minutes} phút học chủ động`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Legend */}
            <div className="img2-legend-row">
              <span className="img2-legend-text">Ít hoạt động</span>
              <div className="img2-legend-tiles" aria-hidden="true">
                <span className="img2-heat-tile lvl-0" />
                <span className="img2-heat-tile lvl-1" />
                <span className="img2-heat-tile lvl-2" />
                <span className="img2-heat-tile lvl-3" />
                <span className="img2-heat-tile lvl-4" />
                <span className="img2-heat-tile lvl-5" />
              </div>
              <span className="img2-legend-text">Nhiều hoạt động</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Tooltip */}
      {tooltip.visible && (
        <div
          className="img2-tooltip"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}
