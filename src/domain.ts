import type { ActiveSession, Attempt, CurrentDifficultyState, ErrorRecord, PlanItem, Profile, Question, StudySession } from './types'
export const normalizeAnswer=(value:string|undefined)=>(value??'').trim().toLowerCase()
export const isAnswerCorrect=(learnerAnswer:string|undefined,correctAnswer:string)=>normalizeAnswer(learnerAnswer)===normalizeAnswer(correctAnswer)
// Error identity must be unique per question, not per objective: several questions
// can share one objective (e.g. every question of an exam passage), so an
// objective-scoped id silently collapsed distinct mistakes into one record.
export const errorRecordId=(passageId:string,questionId:string)=>`err-${passageId}-${questionId}`
export const errorQuestionKey=(passageId:string,questionId:string)=>`${passageId}:${questionId}`
export const scoreAttempt=(questions:Question[], answers:Record<string,string>)=>questions.reduce((n,q)=>n+(isAnswerCorrect(answers[q.id],q.answer)?1:0),0)
export const makeErrors=(attempt:Attempt, questions:Question[]):ErrorRecord[]=>questions.filter(q=>!isAnswerCorrect(attempt.answers[q.id],q.answer)).map(q=>({id:errorRecordId(attempt.passageId,q.id),questionId:q.id,attemptId:attempt.id,attemptIds:[attempt.id],occurrences:[{id:`${attempt.id}:${q.id}`,attemptId:attempt.id,questionId:q.id,createdAt:attempt.createdAt}],passageId:attempt.passageId,type:q.type,objective:q.objective,prompt:q.prompt,learnerAnswer:attempt.answers[q.id]||'No answer',correctAnswer:q.answer,explanation:q.explanation,createdAt:attempt.createdAt,reviewCount:0,retestAttemptIds:[]}))
export const mergeAttemptErrors=(existing:ErrorRecord[],attempt:Attempt,questions:Question[])=>{
  const byDifficulty=new Map(existing.map(e=>[`reading:legacy-error:${e.id}`,e]))
  // Errors are looked up per question, so distinct questions that share one
  // objective keep their own records instead of overwriting each other.
  const byQuestion=new Map(existing.map(e=>[errorQuestionKey(e.passageId,e.questionId),e]))
  for(const q of questions){
    const key=errorQuestionKey(attempt.passageId,q.id)
    const wrong=!isAnswerCorrect(attempt.answers[q.id],q.answer)
    const target=attempt.responseTargets?.[q.id]
    // A Retest is an evidence event, never a new ErrorRecord discovery path.
    // Without an exact target it cannot create, merge, resolve, or reopen history.
    if(attempt.kind==='retest' && (!target || !target.difficultyId || !target.occurrenceId)) continue
    const old=target?byDifficulty.get(target.difficultyId):byQuestion.get(key)
    const targetMatchesOccurrence=Boolean(old && target && (old.occurrences?.length ? old.occurrences.some(item=>`reading:occurrence:${old.id}:${item.id}`===target.occurrenceId) : `reading:legacy-occurrence:${old?.id}`===target?.occurrenceId))
    if(attempt.kind==='retest' && (!old || !targetMatchesOccurrence)) continue
    if(wrong&&old){
      const occurrenceId=target?.occurrenceId||`${attempt.id}:${q.id}`
      const occurrences=old.occurrences||[{id:`legacy:${old.id}`,attemptId:old.attemptId,questionId:old.questionId,createdAt:old.createdAt}]
      const existingOccurrence=occurrences.find(item=>item.id===occurrenceId)
      const nextOccurrences=existingOccurrence?occurrences:[...occurrences,{id:occurrenceId,attemptId:attempt.id,questionId:q.id,createdAt:attempt.createdAt}]
      const merged={...old,occurrences:nextOccurrences,attemptId:attempt.id,attemptIds:[...(old.attemptIds||[old.attemptId]),attempt.id],learnerAnswer:attempt.answers[q.id]||'No answer',createdAt:attempt.createdAt}
      byDifficulty.set(`reading:legacy-error:${old.id}`,merged)
      byQuestion.set(errorQuestionKey(old.passageId,old.questionId),merged)
    }else if(wrong&&!old&&attempt.kind!=='retest'){
      const created=makeErrors(attempt,[q])[0]
      byDifficulty.set(`reading:legacy-error:${created.id}`,created)
      byQuestion.set(key,created)
    }else if(!wrong&&old&&attempt.kind==='retest'){
      const resolved={...old,retestAttemptIds:old.retestAttemptIds.includes(attempt.id)?old.retestAttemptIds:[...old.retestAttemptIds,attempt.id]}
      byDifficulty.set(`reading:legacy-error:${old.id}`,resolved)
      byQuestion.set(errorQuestionKey(old.passageId,old.questionId),resolved)
    }
  }
  return [...byDifficulty.values()]
}
export const localDate=(iso:string)=>new Date(iso).toLocaleDateString('en-CA')
export const startOfLocalWeek=(date:Date)=>{const d=new Date(date);d.setHours(0,0,0,0);d.setDate(d.getDate()-d.getDay());return d}
export const minutesByDate=(sessions:StudySession[])=>sessions.reduce<Record<string,number>>((a,s)=>{const addInterval=(startedAt:string,endedAt:string)=>{const startMs=new Date(startedAt).getTime(),endMs=new Date(endedAt).getTime();if(!Number.isFinite(startMs)||!Number.isFinite(endMs)||endMs<=startMs)return;let cursor=startMs;while(cursor<endMs){const current=new Date(cursor),nextDay=new Date(current.getFullYear(),current.getMonth(),current.getDate()+1).getTime(),chunk=Math.min(endMs,nextDay)-cursor,date=localDate(current.toISOString());a[date]=(a[date]||0)+chunk/60000;cursor+=chunk}};if(s.activeIntervals?.length)s.activeIntervals.forEach(interval=>addInterval(interval.startedAt,interval.endedAt));return a},{})
export const measuredMinutes=(session:StudySession)=>session.activeIntervals?.reduce((total,interval)=>{const seconds=(Date.parse(interval.endedAt)-Date.parse(interval.startedAt))/1000;return total+(Number.isFinite(seconds)&&seconds>0?seconds/60:0)},0)||0
export const measuredStreak=(sessions:StudySession[], today=new Date())=>{
  const minutes=minutesByDate(sessions)
  const cursor=new Date(today)
  cursor.setHours(12,0,0,0)
  let streak=0
  while((minutes[localDate(cursor.toISOString())]||0)>0){
    streak+=1
    cursor.setDate(cursor.getDate()-1)
  }
  return streak
}
// Level 0 is always empty. With a valid goal, levels 1-5 represent <=25%,
// <=50%, <=75%, <100%, and >=100% of that goal. Without one, use fixed
// measured-minute buckets so intensity still reflects actual study time.
export const heatLevel=(minutes:number, goal:number)=>{
  const actual=Number.isFinite(minutes)&&minutes>0?minutes:0
  if(actual===0)return 0
  if(Number.isFinite(goal)&&goal>0){const ratio=actual/goal;return ratio<=.25?1:ratio<=.5?2:ratio<=.75?3:ratio<1?4:5}
  return actual<15?1:actual<30?2:actual<60?3:actual<90?4:5
}
export const recommendations=(profile:Profile, attempts:Attempt[], errors:ErrorRecord[], plan:PlanItem[], states:Record<string,CurrentDifficultyState>)=>{if(!profile.targetBand&&!profile.dailyGoalMinutes)return {title:'Thiết lập hồ sơ học viên',reason:'Cần có mục tiêu đầu ra và mục tiêu học tập để kế hoạch trở nên thiết thực.',page:'profile' as const};if(!attempts.length)return {title:'Take your first Reading practice',reason:'There is no practice evidence yet. Start with the original passage to establish a baseline.',page:'practice' as const};const open=errors.filter(error=>states[`reading:legacy-error:${error.id}`]?.status==='open');if(open.length){const objective=open[0].objective;return {title:`Retest: ${objective}`,reason:'This objective is still open in Error Memory; complete a new equivalent task.',page:'errors' as const}}const latest=attempts[attempts.length-1];if(latest&&latest.total>0&&latest.score/latest.total<.75)return {title:'Repeat a focused Reading practice',reason:`Your latest practice was ${latest.score}/${latest.total}; reinforce the same skill with a new attempt.`,page:'practice' as const};const pending=plan.find(p=>p.status==='planned');if(pending)return {title:pending.title,reason:pending.reason||'This is the next planned activity.',page:'dashboard' as const};return {title:'Plan your next evidence check',reason:'No open error or pending task is available; add a transparent activity to continue.',page:'dashboard' as const}}
export const snapshotActiveSession=(session:ActiveSession, endedAt:string):ActiveSession=>{if(session.paused)return session;const startMs=Date.parse(session.lastResumedAt),endMs=Date.parse(endedAt);if(!Number.isFinite(startMs)||!Number.isFinite(endMs)||endMs<=startMs)return session;return {...session,accumulatedSeconds:session.accumulatedSeconds+(endMs-startMs)/1000,lastResumedAt:endedAt,activeIntervals:[...(session.activeIntervals||[]),{startedAt:session.lastResumedAt,endedAt}]}}
