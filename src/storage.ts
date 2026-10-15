import type { Store } from './types'
const KEY='optistudy-store-v1'
const empty:Store={version:1,profile:{daysOff:[],priority:'Reading'},attempts:[],errors:[],sessions:[],plan:[]}
export const loadStore=():Store=>{try{const raw=localStorage.getItem(KEY); if(!raw)return empty; const x=JSON.parse(raw); return {...empty,...x,profile:{...empty.profile,...x.profile},attempts:Array.isArray(x.attempts)?x.attempts:[],errors:Array.isArray(x.errors)?x.errors:[],sessions:Array.isArray(x.sessions)?x.sessions:[],plan:Array.isArray(x.plan)?x.plan:[]}}catch{return empty}}
export const saveStore=(s:Store)=>localStorage.setItem(KEY,JSON.stringify(s))
export const clearStore=()=>localStorage.removeItem(KEY)
