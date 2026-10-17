import type { ActiveSession, Attempt, CurrentDifficultyState, ErrorRecord, PlanItem, Profile, Question, StudySession } from './types'
export const scoreAttempt=(questions:Question[], answers:Record<string,string>)=>questions.reduce((n,q)=>n+(answers[q.id]===q.answer?1:0),0)
export const makeErrors=(attempt:Attempt, questions:Question[]):ErrorRecord[]=>questions.filter(q=>attempt.answers[q.id]!==q.answer).map(q=>({id:`err-${attempt.passageId}-${q.objective}`,questionId:q.id,attemptId:attempt.id,attemptIds:[attempt.id],occurrences:[{id:`${attempt.id}:${q.id}`,attemptId:attempt.id,questionId:q.id,createdAt:attempt.createdAt}],passageId:attempt.passageId,type:q.type,objective:q.objective,prompt:q.prompt,learnerAnswer:attempt.answers[q.id]||'No answer',correctAnswer:q.answer,explanation:q.explanation,createdAt:attempt.createdAt,reviewCount:0,retestAttemptIds:[]}))
export const mergeAttemptErrors=(existing:ErrorRecord[],attempt:Attempt,questions:Question[])=>{
  const byDifficulty=new Map(existing.map(e=>[`reading:legacy-error:${e.id}`,e]))
  const byObjective=new Map(existing.map(e=>[`${e.passageId}:${e.objective}`,e]))
  for(const q of questions){
    const key=`${attempt.passageId}:${q.objective}`
    const wrong=attempt.answers[q.id]!==q.answer
    const target=attempt.responseTargets?.[q.id]
    // A Retest is an evidence event, never a new ErrorRecord discovery path.
    // Without an exact target it cannot create, merge, resolve, or reopen history.
    if(attempt.kind==='retest' && (!target || !target.difficultyId || !target.occurrenceId)) continue
    const old=target?byDifficulty.get(target.difficultyId):byObjective.get(key)
    const targetMatchesOccurrence=Boolean(old && target && (old.occurrences?.length ? old.occurrences.some(item=>`reading:occurrence:${old.id}:${item.id}`===target.occurrenceId) : `reading:legacy-occurrence:${old?.id}`===target?.occurrenceId))
    if(attempt.kind==='retest' && (!old || !targetMatchesOccurrence)) continue
    if(wrong&&old){
      const occurrenceId=target?.occurrenceId||`${attempt.id}:${q.id}`
      const occurrences=old.occurrences||[{id:`legacy:${old.id}`,attemptId:old.attemptId,questionId:old.questionId,createdAt:old.createdAt}]
      const existingOccurrence=occurrences.find(item=>item.id===occurrenceId)
      const nextOccurrences=existingOccurrence?occurrences:[...occurrences,{id:occurrenceId,attemptId:attempt.id,questionId:q.id,createdAt:attempt.createdAt}]
      byDifficulty.set(`reading:legacy-error:${old.id}`, {...old,occurrences:nextOccurrences,attemptId:attempt.id,attemptIds:[...(old.attemptIds||[old.attemptId]),attempt.id],learnerAnswer:attempt.answers[q.id]||'No answer',createdAt:attempt.createdAt})
    }else if(wrong&&!old&&attempt.kind!=='retest'){
      const created=makeErrors(attempt,[q])[0]
      byDifficulty.set(`reading:legacy-error:${created.id}`,created)
      byObjective.set(key,created)
    }else if(!wrong&&old&&attempt.kind==='retest'){
      byDifficulty.set(`reading:legacy-error:${old.id}`,{...old,retestAttemptIds:old.retestAttemptIds.includes(attempt.id)?old.retestAttemptIds:[...old.retestAttemptIds,attempt.id]})
    }
  }
  return [...byDifficulty.values()]
}
export const localDate=(iso:string)=>new Date(iso).toLocaleDateString('en-CA')
export const startOfLocalWeek=(date:Date)=>{const d=new Date(date);d.setHours(0,0,0,0);d.setDate(d.getDate()-d.getDay());return d}
export const minutesByDate=(sessions:StudySession[])=>sessions.reduce<Record<string,number>>((a,s)=>{const addInterval=(startedAt:string,endedAt:string)=>{const startMs=new Date(startedAt).getTime(),endMs=new Date(endedAt).getTime();if(!Number.isFinite(startMs)||!Number.isFinite(endMs)||endMs<=startMs)return;let cursor=startMs;while(cursor<endMs){const current=new Date(cursor),nextDay=new Date(current.getFullYear(),current.getMonth(),current.getDate()+1).getTime(),chunk=Math.min(endMs,nextDay)-cursor,date=localDate(current.toISOString());a[date]=(a[date]||0)+chunk/60000;cursor+=chunk}};if(s.activeIntervals?.length)s.activeIntervals.forEach(interval=>addInterval(interval.startedAt,interval.endedAt));return a},{})
export const measuredMinutes=(session:StudySession)=>session.activeIntervals?.reduce((total,interval)=>{const seconds=(Date.parse(interval.endedAt)-Date.parse(interval.startedAt))/1000;return total+(Number.isFinite(seconds)&&seconds>0?seconds/60:0)},0)||0
// Level 0 is always empty. With a valid goal, levels 1-5 represent <=25%,
// <=50%, <=75%, <100%, and >=100% of that goal. Without one, use fixed
// measured-minute buckets so intensity still reflects actual study time.
export const heatLevel=(minutes:number, goal:number)=>{
  const actual=Number.isFinite(minutes)&&minutes>0?minutes:0
  if(actual===0)return 0
  if(Number.isFinite(goal)&&goal>0){const ratio=actual/goal;return ratio<=.25?1:ratio<=.5?2:ratio<=.75?3:ratio<1?4:5}
  return actual<15?1:actual<30?2:actual<60?3:actual<90?4:5
}
export const recommendations=(profile:Profile, attempts:Attempt[], errors:ErrorRecord[], plan:PlanItem[], states:Record<string,CurrentDifficultyState>)=>{if(!profile.targetBand&&!profile.dailyGoalMinutes)return {title:'Set up your learner profile',reason:'A target and study goal are needed to make the plan meaningful.',page:'profile' as const};if(!attempts.length)return {title:'Take your first Reading practice',reason:'There is no practice evidence yet. Start with the original passage to establish a baseline.',page:'practice' as const};const open=errors.filter(error=>states[`reading:legacy-error:${error.id}`]?.status==='open');if(open.length){const objective=open[0].objective;return {title:`Retest: ${objective}`,reason:'This objective is still open in Error Memory; complete a new equivalent task.',page:'errors' as const}}const latest=attempts[attempts.length-1];if(latest&&latest.total>0&&latest.score/latest.total<.75)return {title:'Repeat a focused Reading practice',reason:`Your latest practice was ${latest.score}/${latest.total}; reinforce the same skill with a new attempt.`,page:'practice' as const};const pending=plan.find(p=>p.status==='planned');if(pending)return {title:pending.title,reason:pending.reason||'This is the next planned activity.',page:'dashboard' as const};return {title:'Plan your next evidence check',reason:'No open error or pending task is available; add a transparent activity to continue.',page:'dashboard' as const}}
export const snapshotActiveSession=(session:ActiveSession, endedAt:string):ActiveSession=>{if(session.paused)return session;const startMs=Date.parse(session.lastResumedAt),endMs=Date.parse(endedAt);if(!Number.isFinite(startMs)||!Number.isFinite(endMs)||endMs<=startMs)return session;return {...session,accumulatedSeconds:session.accumulatedSeconds+(endMs-startMs)/1000,lastResumedAt:endedAt,activeIntervals:[...(session.activeIntervals||[]),{startedAt:session.lastResumedAt,endedAt}]}}
