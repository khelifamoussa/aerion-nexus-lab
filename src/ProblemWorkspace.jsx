import { useEffect, useState } from 'react'
import { CheckCircle2, FilePlus2, Save, Send, Target } from 'lucide-react'

const initial={
  title:'',
  problem:'',
  objective:'',
  hypotheses:'',
  constraints:'Civilian UAV research; simulated evidence until external validation.',
  deliverables:'Simulation plan, figures, evidence register, manuscript draft.'
}

export default function ProblemWorkspace({onLaunch}){
  const [spec,setSpec]=useState(()=>{
    try{return {...initial,...JSON.parse(localStorage.getItem('aerion.problemSpec')||'{}')}}catch{return initial}
  })
  const [saved,setSaved]=useState(false)
  const update=(key,value)=>setSpec(s=>({...s,[key]:value}))
  const complete=spec.title.trim()&&spec.problem.trim()&&spec.objective.trim()

  useEffect(()=>{
    const t=setTimeout(()=>{
      localStorage.setItem('aerion.problemSpec',JSON.stringify(spec))
      setSaved(true)
      setTimeout(()=>setSaved(false),1400)
    },500)
    return()=>clearTimeout(t)
  },[spec])

  function launch(){
    localStorage.setItem('aerion.problemSpec',JSON.stringify(spec))
    localStorage.setItem('aerion.activeProblem',spec.title)
    onLaunch?.()
  }

  return <section className="workspace problem-workspace">
    <header className="workspace-head">
      <div><small>STEP 01 · HUMAN-GOVERNED RESEARCH INTAKE</small><h2>Problem Definition Studio</h2><p>Define the scientific problem before the four agents plan, simulate, write and review.</p></div>
      <span className={'autosave '+(saved?'saved':'')}><Save/>{saved?'Saved':'Auto-save active'}</span>
    </header>
    <div className="problem-layout">
      <article className="problem-form">
        <label><span>Research title *</span><input value={spec.title} onChange={e=>update('title',e.target.value)} placeholder="Example: Robust UAV position control under crosswind"/></label>
        <label><span>Scientific problem *</span><textarea value={spec.problem} onChange={e=>update('problem',e.target.value)} placeholder="Describe the real problem, the knowledge gap, operating conditions and why existing methods are insufficient."/></label>
        <label><span>Main objective *</span><textarea value={spec.objective} onChange={e=>update('objective',e.target.value)} placeholder="State the measurable objective and the expected scientific contribution."/></label>
        <label><span>Hypotheses / research questions</span><textarea value={spec.hypotheses} onChange={e=>update('hypotheses',e.target.value)} placeholder="H1... H2... RQ1..."/></label>
        <div className="problem-two">
          <label><span>Scope and constraints</span><textarea value={spec.constraints} onChange={e=>update('constraints',e.target.value)}/></label>
          <label><span>Required deliverables</span><textarea value={spec.deliverables} onChange={e=>update('deliverables',e.target.value)}/></label>
        </div>
        <button className="launch-problem" disabled={!complete} onClick={launch}><Send/> Approve problem and open Agent 01</button>
      </article>
      <aside className="problem-guide">
        <Target/><h3>What should I write?</h3>
        <p>Write the engineering problem in plain language. The Problem Architect will convert it into a bounded experiment specification.</p>
        {['Application and mission','Plant/model boundary','Disturbances and uncertainty','Methods to compare','Measurable success criteria','Evidence and publication target'].map(x=><div key={x}><CheckCircle2/>{x}</div>)}
        <section><FilePlus2/><span><b>Example starter</b><small>Compare PID-FF and nonlinear MPC for a civilian quadrotor inspection mission under 6 m/s crosswind and ±15% mass uncertainty. Minimize RMSE and control effort while preserving real-time feasibility.</small></span></section>
      </aside>
    </div>
  </section>
}
