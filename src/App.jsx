import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Atom, BookOpen, Box, BrainCircuit, CircleGauge, Database, FileText, FlaskConical, Languages, Pause, Play, Search, ShieldCheck, Sparkles, Wind } from 'lucide-react'
import HangarScene from './HangarScene'
import LoginPortal, { AccessIdentity } from './LoginPortal'
import { authMode, clearSession, listenForAuthChanges, loadSecureSession, restoreSession } from './security/auth'
import { EvidenceWorkspace, PublicationWorkspace, SimulationWorkspace } from './ResearchWorkspaces'
import { AgentWorkspace, AlgorithmWorkspace, DigitalTwinWorkspace, ManuscriptWorkspace } from './AdvancedWorkspaces'
import ProblemWorkspace from './ProblemWorkspace'
import { agents, metrics, modules, stages } from './labData'

const nav=[['Mission Control',CircleGauge],['Problem Definition',FlaskConical],['Four Agents',BrainCircuit],['Digital Twin',Box],['Simulation',Activity],['Algorithms',Atom],['Evidence',Database],['Manuscript',FileText],['Publication',BookOpen]]

function AgentRail({running}){
  return <div className="agent-rail">{agents.map(a=><motion.article key={a.id} whileHover={{x:5}} className="agent-node" style={{'--agent':a.color}}>
    <span className="agent-core"><i/></span><div><small>{a.code}</small><b>{a.name}</b><em>{running&&a.id===2?'Executing seeded runs':a.task}</em></div><strong>{running&&a.id===2?'RUN':a.progress+'%'}</strong>
  </motion.article>)}</div>
}

function ResearchTimeline({running}){
  return <div className="research-timeline">{stages.map((s,i)=><div key={s} className={i<4||(running&&i<7)?'complete':i===4?'current':''}><i>{i<4?'✓':String(i+1).padStart(2,'0')}</i><span>{s}</span></div>)}</div>
}

function MetricWave({running}){
  const pts=useMemo(()=>Array.from({length:70},(_,i)=>(i/69*100)+','+(50+Math.sin(i*.36)*18*Math.exp(-i/55)+(i%3-1)*2)).join(' '),[])
  return <div className="wave-panel"><div className="panel-title"><span><small>LIVE EXPERIMENT · EXP-024</small><b>Tracking error envelope</b></span><div className="legend"><i/> PID-FF <i/> MPC</div></div>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#20e6d3" stopOpacity=".36"/><stop offset="1" stopColor="#20e6d3" stopOpacity="0"/></linearGradient></defs>
      {[20,40,60,80].map(y=><line key={y} x1="0" y1={y} x2="100" y2={y}/>)}
      <polygon points={'0,100 '+pts+' 100,100'} fill="url(#fill)"/><polyline className={running?'drawing':''} points={pts}/>
    </svg>
    <div className="metric-strip">{metrics.map(m=><div key={m[0]}><small>{m[0]}</small><b>{m[1]}</b><em>{m[2]}</em></div>)}</div>
  </div>
}

function Workspace({view,onNavigate}){
  if(view==='Problem Definition') return <ProblemWorkspace onLaunch={()=>onNavigate('Four Agents')}/>
  if(view==='Four Agents') return <AgentWorkspace/>
  if(view==='Digital Twin') return <DigitalTwinWorkspace/>
  if(view==='Algorithms') return <AlgorithmWorkspace/>
  if(view==='Manuscript') return <ManuscriptWorkspace/>
  if(view==='Simulation') return <SimulationWorkspace/>
  if(view==='Evidence') return <EvidenceWorkspace/>
  if(view==='Publication') return <PublicationWorkspace/>
  if(view==='Legacy Agent View') return <section className="workspace"><header><small>ORCHESTRATION MATRIX</small><h2>Four-Agent Intelligence Center</h2></header><div className="agent-grid">{agents.map(a=><article key={a.id} style={{'--agent':a.color}}><span>{a.code}</span><h3>{a.name}</h3><p>{a.role}</p><div className="progress"><i style={{width:a.progress+'%'}}/></div><dl><dt>Current state</dt><dd>{a.state}</dd><dt>Audit status</dt><dd>Traceable</dd><dt>Quality gate</dt><dd>{a.id===4?'6 open':'Passed'}</dd></dl></article>)}</div></section>
  if(view==='Legacy Algorithms') return <section className="workspace"><header><small>MODULAR SCIENTIFIC ENGINE</small><h2>Algorithm Engineering Bay</h2></header><div className="module-grid">{Object.entries(modules).map(([k,v])=><article key={k}><h3>{k}</h3>{v.map((m,i)=><button key={m}>{m}<span>{i<2?'STABLE':'ADVANCED'}</span></button>)}</article>)}</div></section>
  if(view==='Legacy Manuscript') return <section className="workspace"><header><small>JOURNAL ARCHITECT · v0.8.3</small><h2>Scientific Manuscript Studio</h2></header><div className="paper-space"><aside>{['Title & abstract','Introduction','Related work','Problem formulation','Proposed method','Experiments','Results','Discussion & limits','Conclusion','References'].map(x=><button key={x}>{x}</button>)}</aside><article className="paper"><h2>Robust 3D UAV Trajectory Tracking under Crosswind and Model Uncertainty</h2><p><b>Abstract—</b> This traceable study evaluates baseline and advanced position controllers for a civilian inspection mission. Results are linked to reproducible experiment records and explicitly limited to simulated evidence.</p><h3>Problem formulation</h3><p>The translational dynamics are expressed in an inertial frame with wind disturbance, drag and actuator dynamics.</p><div className="equation">mṽ = f<sub>u</sub> + f<sub>w</sub> − mg e<sub>3</sub> − Dv <span>(12)</span></div><h3>Results</h3><p>Across 30 seeded runs, the validated controller reduced tracking RMSE within the stated computational budget. Hardware validation is not claimed.</p></article><aside className="evidence"><h3>Traceability</h3><p>✓ Eq. 12 ↔ model/dynamics</p><p>✓ RMSE ↔ EXP-024</p><p>✓ Figure ↔ seeds 42–71</p><h3>Warnings</h3><p>⚠ 4 citations need DOI verification</p><p>⚠ Real-flight claim blocked</p></aside></div></section>
  return <section className="workspace"><header><small>{view.toUpperCase()}</small><h2>{view} workspace</h2><p>This modular workspace is ready for scientific services and backend adapters.</p></header><div className="future-panel"><FlaskConical/><h3>Extensible research module</h3><p>UI, state and evidence contracts are separated so simulation, databases and AI services can be connected without rebuilding the interface.</p></div></section>
}

export default function App(){
  const [session,setSession]=useState(()=>restoreSession())
  const [view,setView]=useState('Mission Control')
  const [running,setRunning]=useState(false)
  const [lang,setLang]=useState('EN')
  const [camera,setCamera]=useState('orbit')
  const [time,setTime]=useState(0)
  useEffect(()=>{if(!running)return;const t=setInterval(()=>setTime(x=>x>=100?0:x+1),120);return()=>clearInterval(t)},[running])
  useEffect(()=>{
    let active=true
    if(authMode==='supabase') loadSecureSession().then(s=>{if(active)setSession(s)}).catch(()=>{if(active)setSession(null)})
    const stop=listenForAuthChanges(s=>{if(active)setSession(s)})
    return()=>{active=false;stop()}
  },[])
  const mission=view==='Mission Control'
  async function logout(){ await clearSession(); setSession(null) }
  if(session===undefined) return <div className="secure-loading"><span className="mark"><i/></span><b>Establishing secure laboratory session…</b></div>
  if(!session) return <LoginPortal onAuthenticated={setSession}/>
  return <div className="app" dir={lang==='AR'?'rtl':'ltr'}>
    <header className="topbar"><a className="brand"><span className="mark"><i/></span><span><b>AERION NEXUS</b><small>Autonomous Flight · Intelligent Control · AI</small></span></a>
      <div className="lab-status"><i/> LAB ONLINE <b>EXP-024</b></div>
      <label className="search"><Search/><input placeholder="Search experiment, equation, evidence…"/></label>
      <button className="language" onClick={()=>setLang(lang==='EN'?'AR':'EN')}><Languages/>{lang==='EN'?'العربية':'English'}</button><AccessIdentity session={session} onLogout={logout}/>
    </header>
    <aside className="nav"><div className="nav-title">RESEARCH SPACES</div>{nav.map(([name,Icon])=><button key={name} onClick={()=>setView(name)} className={view===name?'active':''}><Icon/><span>{name}</span>{name==='Manuscript'&&<em>82%</em>}</button>)}<div className="system"><ShieldCheck/><span><b>System nominal</b><small>Evidence gates active</small></span></div></aside>
    <main><AnimatePresence mode="wait">{mission?<motion.section key="mission" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="mission">
      <div className="title-row"><div><small>AUTONOMOUS RESEARCH HANGAR</small><h1>Research Mission Control</h1><p>Robust 3D UAV trajectory tracking under crosswind and model uncertainty.</p></div><div className="mission-actions"><button className="define-problem" onClick={()=>setView('Problem Definition')}><FlaskConical/> Define research problem</button><button className="run" onClick={()=>setRunning(!running)}>{running?<Pause/>:<Play/>}{running?'Pause experiment':'Run research cycle'}</button></div></div>
      <div className="hangar-layout"><section className="scene-shell"><div className="scene-top"><span><Sparkles/> DIGITAL TWIN · 6-DOF</span><b>Solar Farm Inspection Mission</b><div>{['orbit','top','follow'].map(x=><button key={x} className={camera===x?'active':''} onClick={()=>setCamera(x)}>{x}</button>)}</div></div>
        <div className="scene"><HangarScene running={running} cameraMode={camera}/><div className="hud left"><small>FLIGHT STATE</small><b>{running?'SIMULATING':'STANDBY'}</b><em>MODEL ANX-X4 · v3.0</em></div><div className="hud right"><Wind/><span><small>WIND VECTOR</small><b>6.2 m/s · 238°</b></span></div><div className="hud bottom"><span>T+ {time.toFixed(1)} s</span><i><b style={{width:time+'%'}}/></i><span>60 FPS</span></div></div>
      </section><AgentRail running={running}/></div><ResearchTimeline running={running}/><MetricWave running={running}/>
    </motion.section>:<motion.div key={view} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}><Workspace view={view} onNavigate={setView}/></motion.div>}</AnimatePresence></main>
  </div>
}
