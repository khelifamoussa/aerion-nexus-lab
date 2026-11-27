import { useEffect, useMemo, useRef, useState } from 'react'
import { Bot, CheckCircle2, Download, Pause, Play, RotateCcw, Save, ShieldCheck, XCircle } from 'lucide-react'
import { agents } from './labData'
import { downloadArtifact } from './scienceEngine'
import { readStore, uid, writeStore } from './researchStore'

const prompts=[
 'Bound the scientific problem, declare assumptions, variables, metrics and an experiment contract.',
 'Create a reproducible simulation plan with frozen plant, disturbances, seeds, baselines and output artifacts.',
 'Build a publication structure with numbered equations, figures, tables, limitations and evidence-linked claims.',
 'Act as a critical Q1 reviewer: test novelty, fairness, traceability, references, uncertainty and reporting quality.'
]
const makeOutputs=(problem)=>{
 const title=problem.title||'Untitled UAV research problem', question=problem.problem||'Define a bounded civilian UAV control problem.'
 return [
  `EXPERIMENT CONTRACT\nTitle: ${title}\nProblem: ${question}\nObjective: ${problem.objective||'Specify a measurable tracking objective.'}\nScope: bounded translational UAV model; declared disturbances only.\nMetrics: RMSE, maximum error, settling behaviour and control energy.\nGate: director approval required before simulation.`,
  `SIMULATION PLAN\nStudy: ${title}\nFreeze mass, drag, actuator lag, reference trajectory, wind model and constraints. Compare baselines under identical initial conditions and compute budgets. Persist configuration, sampled trajectory, metrics and solver metadata.\nEvidence class: simulated data; no real-flight claim.`,
  'MANUSCRIPT MAP\nAbstract → Introduction → Verified related work → numbered problem formulation → method organigram → reproducible experiments → results with uncertainty → limitations → conclusion. Each quantitative claim must reference an evidence artifact ID.',
  'CRITICAL REVIEW\nBlock unsupported novelty, superiority, safety and real-flight claims. Verify DOI metadata, dimensional consistency, equation numbering, figure provenance, fair baselines, uncertainty reporting and journal-scope fit. Recommended decision remains Major Revision until all gates are satisfied.'
 ]
}

export default function OperationalAgents(){
 const [problem,setProblem]=useState(()=>readStore('problem',{}))
 const [active,setActive]=useState(0)
 const [records,setRecords]=useState(()=>readStore('audit',[]))
 const [running,setRunning]=useState(null)
 const [elapsed,setElapsed]=useState(0)
 const timer=useRef(null)
 const outputs=useMemo(()=>makeOutputs(problem),[problem])
 const latest=i=>records.find(x=>x.agentIndex===i)
 const canRun=i=>i===0?Boolean((problem.problem||'').trim()):latest(i-1)?.decision==='approved'
 useEffect(()=>()=>clearInterval(timer.current),[])
 const saveProblem=next=>{setProblem(next);writeStore('problem',next)}
 const run=i=>{
  if(!canRun(i)||running!==null)return
  setActive(i);setRunning(i);setElapsed(0)
  const started=Date.now()
  timer.current=setInterval(()=>setElapsed(Math.floor((Date.now()-started)/1000)),250)
  setTimeout(()=>{
   clearInterval(timer.current)
   const record={id:uid('AGT'),agentIndex:i,agent:agents[i].name,mode:'Local Structured Mode',model:'Deterministic rule engine v1',prompt:prompts[i],inputSnapshot:problem,output:outputs[i],startedAt:new Date(started).toISOString(),completedAt:new Date().toISOString(),durationMs:Date.now()-started,status:'completed',decision:'pending'}
   const next=[record,...records.filter(x=>x.agentIndex!==i)]
   setRecords(next);writeStore('audit',next);setRunning(null)
  },900)
 }
 const cancel=()=>{clearInterval(timer.current);setRunning(null)}
 const decide=(i,decision)=>{
  const next=records.map(x=>x.agentIndex===i?{...x,decision,decidedAt:new Date().toISOString()}:x)
  setRecords(next);writeStore('audit',next)
 }
 const editOutput=(i,value)=>{
  const next=records.map(x=>x.agentIndex===i?{...x,output:value,decision:'pending',editedAt:new Date().toISOString()}:x)
  setRecords(next);writeStore('audit',next)
 }
 const reset=()=>{cancel();setRecords([]);writeStore('audit',[])}
 const rec=latest(active)
 return <section className="workspace operational-workspace"><header className="workspace-head"><div><small>HUMAN-GOVERNED PIPELINE · LOCAL STRUCTURED MODE</small><h2>Operational Four-Agent Laboratory</h2><p>Real state, editable outputs and explicit director approval. No remote AI backend is claimed.</p></div><div className="agent-run-actions"><button className="secondary-action" onClick={reset}><RotateCcw/>Reset cycle</button><button className="primary-action" disabled={!canRun(active)||running!==null} onClick={()=>run(active)}><Play/>Run selected agent</button></div></header>
 <div className="agent-operational-layout"><aside className="problem-brief"><ShieldCheck/><h3>Active research problem</h3><label><span>Research title</span><input value={problem.title||''} onChange={e=>saveProblem({...problem,title:e.target.value})}/></label><label><span>Problem statement</span><textarea value={problem.problem||''} onChange={e=>saveProblem({...problem,problem:e.target.value})} placeholder="Describe the real problem, gap, operating conditions and evidence required."/></label><label><span>Main objective</span><textarea value={problem.objective||''} onChange={e=>saveProblem({...problem,objective:e.target.value})}/></label><small>Autosaved locally. Agent 2–4 remain locked until the previous output is approved.</small></aside>
 <article className="agent-pipeline"><div className="agent-stepper">{agents.map((a,i)=>{const r=latest(i);return <button key={a.id} className={(active===i?'active ':'')+(r?.decision==='approved'?'done':'')} style={{'--agent':a.color}} onClick={()=>setActive(i)}><span>{r?.decision==='approved'?<CheckCircle2/>:<Bot/>}</span><b>{a.name}</b><small>{running===i?`RUNNING ${elapsed}s`:r?.decision?.toUpperCase()||(canRun(i)?'READY':'LOCKED')}</small></button>})}</div>
 <div className="agent-output"><header><span style={{background:agents[active].color}}>AGENT 0{active+1}</span><div><small>{agents[active].role}</small><h3>{agents[active].task}</h3></div></header>{running===active?<div className="real-running"><Bot/><b>Executing deterministic workflow…</b><span>{elapsed}s</span><button onClick={cancel}><Pause/>Cancel</button></div>:rec?<textarea className="editable-agent-output" value={rec.output} onChange={e=>editOutput(active,e.target.value)}/>:<pre>{canRun(active)?'Ready. Review the declared task and run this agent.':'Locked until the preceding agent output is approved by the director.'}</pre>}
 {rec&&running===null&&<div className="approval-bar"><span><b>{rec.mode}</b><small>{rec.durationMs} ms · {rec.model}</small></span><button className="reject" onClick={()=>decide(active,'rejected')}><XCircle/>Reject</button><button className="approve" onClick={()=>decide(active,'approved')}><CheckCircle2/>Approve</button></div>}<footer><b>Evidence gate</b><span>{rec?rec.decision:'Awaiting execution'}</span></footer></div></article>
 <aside className="audit-trail"><header><h3>Audit trail</h3><button disabled={!records.length} onClick={()=>downloadArtifact('aerion-agent-audit.json',JSON.stringify({problem,records},null,2))}><Download/></button></header>{records.length?records.map(x=><div key={x.id} onClick={()=>setActive(x.agentIndex)}><span>0{x.agentIndex+1}</span><p><b>{x.agent}</b><small>{x.status} · {x.decision}</small></p></div>):<p className="empty-audit">No execution recorded yet.</p>}<section><Save/><b>Human authority</b><p>Only an approved output unlocks the next agent. Edits automatically return the gate to pending.</p></section></aside></div></section>
}
