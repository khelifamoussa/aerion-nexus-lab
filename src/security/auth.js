import { supabase, supabaseConfigured } from './supabase'

const STORAGE_KEY = 'aerion.preview.session'
export const roles={
 director:{label:'Lab Director',permissions:['missions:write','agents:configure','evidence:approve','manuscript:export','publication:manage']},
 researcher:{label:'Researcher',permissions:['missions:write','agents:run','evidence:read','manuscript:write']},
 reviewer:{label:'Scientific Reviewer',permissions:['missions:read','evidence:review','manuscript:comment']},
 student:{label:'Student',permissions:['missions:read','evidence:read']}
}
export const authMode=import.meta.env.VITE_AUTH_MODE||'preview'

export function restoreSession(){
 if(authMode!=='preview') return undefined
 try{const s=JSON.parse(sessionStorage.getItem(STORAGE_KEY));return s?.expiresAt>Date.now()?s:null}catch{return null}
}
export function createPreviewSession({email,role}){
 const session={user:{id:crypto.randomUUID(),email,name:email.split('@')[0].replace(/[._-]/g,' '),role},issuedAt:Date.now(),expiresAt:Date.now()+4*60*60*1000,mode:'preview'}
 sessionStorage.setItem(STORAGE_KEY,JSON.stringify(session));return session
}
export function normalizeSupabaseSession(session){
 if(!session?.user)return null
 const meta=session.user.user_metadata||{}
 return{raw:session,user:{id:session.user.id,email:session.user.email,name:meta.display_name||session.user.email?.split('@')[0]||'Researcher',role:meta.lab_role||'student'},mode:'supabase',expiresAt:(session.expires_at||0)*1000}
}
export async function requestMagicLink(email){
 if(!supabaseConfigured)throw new Error('Supabase is not configured.')
 const{error}=await supabase.auth.signInWithOtp({email,options:{shouldCreateUser:true,emailRedirectTo:window.location.origin+window.location.pathname}})
 if(error)throw error
}
export async function loadSecureSession(){
 if(authMode==='preview')return restoreSession()
 if(!supabaseConfigured)return null
 const{data,error}=await supabase.auth.getSession();if(error)throw error
 return normalizeSupabaseSession(data.session)
}
export function listenForAuthChanges(callback){
 if(authMode!=='supabase'||!supabaseConfigured)return()=>{}
 const{data}=supabase.auth.onAuthStateChange((_event,session)=>callback(normalizeSupabaseSession(session)))
 return()=>data.subscription.unsubscribe()
}
export async function clearSession(){
 sessionStorage.removeItem(STORAGE_KEY)
 if(authMode==='supabase'&&supabaseConfigured)await supabase.auth.signOut()
}
export function can(session,permission){return roles[session?.user?.role]?.permissions.includes(permission)??false}
