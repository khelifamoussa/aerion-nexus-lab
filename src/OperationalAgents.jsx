import { useMemo, useState } from 'react'
import { Bot, CheckCircle2, Download, Play, RotateCcw, ShieldCheck } from 'lucide-react'
import { agents } from './labData'
import { downloadArtifact } from './scienceEngine'

const makeOutputs=(problem)=>{
 const title=problem.title||'Untitled UAV research problem'
 const question=problem.problem||'Define a bounded civilian UAV control problem.'
 return [
  {heading:'Experiment contract',body:`Problem: ${question}\nObjective: ${problem.objective||'Specify a measurable tracking objective.'}\nBounded scope: translational UAV dynamics, declared disturbances and reproducible metrics.\nPrimary metrics: RMSE, maximum error, settling behaviour and control energy.`},
  {heading:'Simulation plan',body:`Create a versioned plant for “${title}”. Freeze mass, drag, actuator lag, trajectory and wind model. Compare baselines and advanced methods under identical seeds and compute budgets. Export parameters, trajectories and metric definitions.`},
  {heading:'Manuscript map',body:'Draft: Abstract → Introduction → Related work → numbered problem formulation → method organigram → reproducible experiments → results with uncertainty → limitations → conclusion. Every quantitative sentence must point to an evidence artifact.'},
  {heading:'Critical review',body:'Block unsupported novelty, superiority, safety and real-flight claims. Verify DOI metadata, equation numbering, figure resolution, fair baselines, uncertainty reporting and journal-scope fit before releasing a submission package.'}
 ]
}

export default function OperationalAgents(){
 const saved=()=>JSON.parse(localStorage.getItem('aerion.problemSpec')||'{}')
 const [problem,setProblem]=useState(saved)
 const [active,setActive]=useState(0)
 const [step,setStep]=useState(()=>Number(localStorage.getItem('aerion.agentStep')||0))
 const [audit,setAudit]=useState(()=>JSON.parse(localStorage.getItem('aerion.agentAudit')||'[]'))
 const outputs=useMemo(()=>makeOutputs(problem),[problem])
 const persistProblem=next=>{setProblem(next);localStorage.setItem('aerion.problemSpec',JSON.stringify(next))}
 const run=()=>{
  const next=Math.min(4,step+1)
  const entry={at:new Date().toISOString(),agent:agents[next-1].name,problem:problem.title||'Untitled research problem',output:outputs[next-1]}
  const log=[entry,...audit].slice(0,30)
  setStep(next);setActive(next-1);setAudit(log)
  localStorage.setItem('aerion.agentStep',String(next));localStorage.setItem('aerion.agentAudit',JSON.stringify(log))
 }
 const reset=()=>{setStep(0);setAudit([]);localStorage.removeItem('aerion.agentStep');localStorage.removeItem('aerion.agentAudit')}
 return <section className="workspace operational-workspace"><header className="workspace-head"><div><small>HUMAN-GOVERNED FOUR-AGENT PIPELINE</small><h2>Operational Agent Laboratory</h2><p>Enter or refine the problem here, then execute each governed handoff with an auditable output.</p></div><div className="agent-run-actions"><button className="secondary-action" onClick={reset}><RotateCcw/>Reset</button><button className="primary-action" disabled={step===4||!(problem.problem||'').trim()} onClick={run}><Play/>{step===4?'Cycle complete':`Run agent ${step+1}`}</button></div></header>
 <div className="agent-operational-layout"><aside className="problem-brief"><ShieldCheck/><h3>Active research problem</h3><label><span>Research title</span><input value={problem.title||''} onChange={e=>persistProblem({...problem,title:e.target.value})} placeholder="Robust UAV trajectory tracking…"/></label><label><span>Problem statement</span><textarea value={problem.problem||''} onChange={e=>persistProblem({...problem,problem:e.target.value})} placeholder="Describe the real problem, operating conditions, gap and expected evidence."/></label><label><span>Main objective</span><textarea value={problem.objective||''} onChange={e=>persistProblem({...problem,objective:e.target.value})} placeholder="Define measurable success."/></label><small>Saved automatically in this browser and shared with the simulation/manuscript workflow.</small></aside>
 <article className="agent-pipeline"><div className="agent-stepper">{agents.map((a,i)=><button key={a.id} className={(active===i?'active ':'')+(i<step?'done':'')} style={{'--agent':a.color}} onClick={()=>setActive(i)}><span>{i<step?<CheckCircle2/>:<Bot/>}</span><b>{a.name}</b><small>{i<step?'COMPLETED':i===step?'READY':'LOCKED'}</small></button>)}</div><div className="agent-output"><header><span style={{background:agents[active].color}}>AGENT 0{active+1}</span><div><small>{agents[active].role}</small><h3>{outputs[active].heading}</h3></div></header><pre>{active<step?outputs[active].body:'Run this agent to generate its governed output from the active problem.'}</pre><footer><b>Evidence gate</b><span>{active<step?'Output recorded in audit trail':'Awaiting execution'}</span></footer></div></article>
 <aside className="audit-trail"><header><h3>Audit trail</h3><button disabled={!audit.length} onClick={()=>downloadArtifact('aerion-agent-audit.json',JSON.stringify({problem,audit},null,2))}><Download/></button></header>{audit.length?audit.map((x,i)=><div key={x.at}><span>{String(audit.length-i).padStart(2,'0')}</span><p><b>{x.agent}</b><small>{new Date(x.at).toLocaleString()}</small></p></div>):<p className="empty-audit">No execution recorded yet.</p>}<section><b>Human authority</b><p>Agent outputs are drafts. The laboratory director approves scope, evidence and publication.</p></section></aside></div></section>
}
