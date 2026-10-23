/// <reference types="node" />
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const app = readFileSync(new URL('./App.tsx', import.meta.url), 'utf8')
const examLibrary = readFileSync(new URL('./ExamLibraryView.tsx', import.meta.url), 'utf8')
const styles = readFileSync(new URL('./styles.css', import.meta.url), 'utf8')
const recordAnalytics = readFileSync(new URL('./components/RecordAnalyticsChart.tsx', import.meta.url), 'utf8')

describe('critical UI bindings', () => {
  it('renders the recommendation reason as a JSX expression', () => {
    expect(app).toContain('<p>{rec.reason}</p>')
    expect(app).not.toContain('<p>rec.reason</p>')
  })

  it('keeps the real-data dashboard composition and profile stepper present', () => {
    expect(app).toContain('<DashboardPlanQueue s={s} go={go} />')
    expect(app).toContain('className="profile-stepper"')
    expect(app).toContain('<ActivityHeatmapHub s={s} initialExpanded={true} />')
    expect(app).toContain('MỤC TIÊU TỔNG QUAN')
    expect(app).toContain('Chưa có dữ liệu')
  })

  it('gives every full simulator explicit active and submitted visual states', () => {
    expect(examLibrary.match(/data-state="active"/g)?.length).toBe(4)
    expect(examLibrary.match(/data-state="submitted"/g)?.length).toBe(4)
    expect(styles).toContain('.exam-simulator[data-state="submitted"]')
    expect(styles).toContain('.exam-simulator[data-state="active"]')
  })

  it('keeps the record chart bound to measured learner activity', () => {
    expect(app).toContain('<RecordAnalyticsChart s={s} />')
    expect(recordAnalytics).toContain('minutesByDate(s.sessions)')
    expect(recordAnalytics).toContain('measuredMinutes(session)')
    expect(recordAnalytics).toContain('s.attempts.length')
    expect(styles).toContain('.workspace-theme .record-analytics-dashboard')
  })
})
