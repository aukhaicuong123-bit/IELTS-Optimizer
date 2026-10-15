import type { Store } from './types'
const KEY='ielts-optimizer-store-v1'
const LEGACY_KEY='optistudy-store-v1'
const empty:Store={version:1,profile:{daysOff:[],priority:'Reading'},attempts:[],errors:[],sessions:[],plan:[]}
const validProfile=(p:any)=>({...empty.profile,...(p&&typeof p==='object'?p:{}),daysOff:Array.isArray(p?.daysOff)?p.daysOff:[],priority:['Reading','Listening','Writing','Speaking'].includes(p?.priority)?p.priority:'Reading',dailyGoalMinutes:typeof p?.dailyGoalMinutes==='number'&&p.dailyGoalMinutes>=0&&p.dailyGoalMinutes<=1440?p.dailyGoalMinutes:undefined,targetBand:typeof p?.targetBand==='number'&&p.targetBand>=1&&p.targetBand<=9?p.targetBand:undefined})
export const loadStore=():Store=>{try{const raw=localStorage.getItem(KEY)||localStorage.getItem(LEGACY_KEY);if(!raw)return structuredClone(empty);const x=JSON.parse(raw);const restored={...empty,...x,version:1 as const,profile:validProfile(x.profile),attempts:Array.isArray(x.attempts)?x.attempts:[],errors:Array.isArray(x.errors)?x.errors:[],sessions:Array.isArray(x.sessions)?x.sessions:[],plan:Array.isArray(x.plan)?x.plan:[]};localStorage.setItem(KEY,JSON.stringify(restored));return restored}catch{return structuredClone(empty)}}
export const saveStore=(s:Store)=>localStorage.setItem(KEY,JSON.stringify(s))
export const clearStore=()=>localStorage.removeItem(KEY)
