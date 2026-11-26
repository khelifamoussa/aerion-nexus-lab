import { useState } from 'react'
import { ArrowRight, Fingerprint, KeyRound, LockKeyhole, MailCheck, ShieldCheck, UserRoundCheck } from 'lucide-react'
import { authMode, createPreviewSession, requestMagicLink, roles } from './security/auth'

const roleCards=[['director','Director','Full scientific governance'],['researcher','Researcher','Run studies and author evidence'],['reviewer','Reviewer','Audit claims and manuscripts'],['student','Student','Read approved studies']]

export default function LoginPortal({onAuthenticated}){
 const[email,setEmail]=useState('');const[role,setRole]=useState('director');const[error,setError]=useState('');const[sent,setSent]=useState(false);const[busy,setBusy]=useState(false)
 async function submit(event){
  event.preventDefault();if(!/^\S+@\S+\.\S+$/.test(email)){setError('Enter a valid institutional email.');return}
  setBusy(true);setError('')
  try{
   if(authMode==='preview')onAuthenticated(createPreviewSession({email,role}))
   else{await requestMagicLink(email);setSent(true)}
  }catch(err){setError(err.message?.includes('Signups not allowed')?'This address is not invited to the laboratory.':err.message||'Authentication failed.')}
  finally{setBusy(false)}
 }
 return <main className="access-portal"><section className="access-visual"><div className="access-orbit orbit-a"/><div className="access-orbit orbit-b"/><div className="vault-mark"><Fingerprint/><i/><span/></div><small>AERION NEXUS · SECURE RESEARCH FACILITY</small><h1>Enter the autonomous research hangar.</h1><p>Controlled access for UAV intelligence, advanced control, reproducible simulation and publication-grade evidence.</p><div className="trust-row"><span><ShieldCheck/> Role-based access</span><span><LockKeyhole/> Private evidence</span><span><UserRoundCheck/> Auditable sessions</span></div></section>
 <section className="access-card"><header><span className="mark"><i/></span><div><b>AERION NEXUS</b><small>Identity & Access Gateway</small></div></header><div className="security-badge"><i/> {authMode==='preview'?'PREVIEW ACCESS · NOT PRODUCTION SECURITY':'SUPABASE AUTH · INVITATION ONLY'}</div>
 {sent?<div className="magic-sent"><MailCheck/><h2>Check your secure email</h2><p>If <b>{email}</b> is an approved laboratory identity, a one-time access link has been sent. The link returns you to this gateway and creates no public account.</p><button onClick={()=>setSent(false)}>Use another email</button></div>:<><h2>Authorized personnel</h2><p>Use an email previously invited by the laboratory director.</p><form onSubmit={submit}><label>Institutional email<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@university.edu" autoComplete="email"/></label>
 {authMode==='preview'&&<fieldset><legend>Preview role</legend><div className="role-picker">{roleCards.map(([id,title,desc])=><button type="button" key={id} onClick={()=>setRole(id)} className={role===id?'active':''}><b>{title}</b><small>{desc}</small></button>)}</div></fieldset>}
 {error&&<div className="access-error">{error}</div>}<button disabled={busy} className="enter-lab"><KeyRound/> {busy?'Authenticating…':authMode==='preview'?'Enter preview':'Send secure access link'} <ArrowRight/></button></form></>}
 <footer>Production access uses one-time email links, server-enforced RLS and private evidence storage. Laboratory roles cannot be selected by users.</footer></section></main>
}
export function AccessIdentity({session,onLogout}){const role=roles[session.user.role]||roles.student;return <div className="access-identity"><span>{session.user.name.slice(0,2).toUpperCase()}</span><div><b>{session.user.name}</b><small>{role.label} · {session.mode}</small></div><button onClick={onLogout}>Sign out</button></div>}
