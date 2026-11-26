import { useState } from 'react'
import { ArrowRight, Fingerprint, KeyRound, LockKeyhole, ShieldCheck, UserRoundCheck } from 'lucide-react'
import { authMode, createPreviewSession, roles } from './security/auth'

const roleCards = [
  ['director', 'Director', 'Full scientific governance'],
  ['researcher', 'Researcher', 'Run studies and author evidence'],
  ['reviewer', 'Reviewer', 'Audit claims and manuscripts'],
  ['student', 'Student', 'Read approved studies']
]

export default function LoginPortal({ onAuthenticated }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('director')
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    if (authMode !== 'preview') {
      setError('Secure provider is not connected yet. Configure Supabase before production.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid institutional email.')
      return
    }
    setError('')
    onAuthenticated(createPreviewSession({ email, role }))
  }

  return <main className="access-portal">
    <section className="access-visual">
      <div className="access-orbit orbit-a"/><div className="access-orbit orbit-b"/>
      <div className="vault-mark"><Fingerprint/><i/><span/></div>
      <small>AERION NEXUS · SECURE RESEARCH FACILITY</small>
      <h1>Enter the autonomous research hangar.</h1>
      <p>Controlled access for UAV intelligence, advanced control, reproducible simulation and publication-grade evidence.</p>
      <div className="trust-row">
        <span><ShieldCheck/> Role-based access</span>
        <span><LockKeyhole/> Private evidence</span>
        <span><UserRoundCheck/> Auditable sessions</span>
      </div>
    </section>
    <section className="access-card">
      <header><span className="mark"><i/></span><div><b>AERION NEXUS</b><small>Identity & Access Gateway</small></div></header>
      <div className="security-badge"><i/> {authMode === 'preview' ? 'PREVIEW ACCESS · NOT PRODUCTION SECURITY' : 'SECURE PROVIDER ACTIVE'}</div>
      <h2>Authorized personnel</h2>
      <p>Use your approved institutional identity and assigned laboratory role.</p>
      <form onSubmit={submit}>
        <label>Institutional email<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@university.edu" autoComplete="email"/></label>
        <fieldset><legend>Access role</legend><div className="role-picker">{roleCards.map(([id,title,desc])=><button type="button" key={id} onClick={()=>setRole(id)} className={role===id?'active':''}><b>{title}</b><small>{desc}</small></button>)}</div></fieldset>
        {error && <div className="access-error">{error}</div>}
        <button className="enter-lab"><KeyRound/> Authenticate & enter <ArrowRight/></button>
      </form>
      <footer>Preview sessions expire after 4 hours. Production access will use email verification, invitations and server-enforced policies.</footer>
    </section>
  </main>
}

export function AccessIdentity({ session, onLogout }) {
  const role = roles[session.user.role]
  return <div className="access-identity"><span>{session.user.name.slice(0,2).toUpperCase()}</span><div><b>{session.user.name}</b><small>{role.label} · {session.mode}</small></div><button onClick={onLogout}>Sign out</button></div>
}
