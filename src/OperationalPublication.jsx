import { useMemo, useState } from 'react'
import { CheckCircle2, Download, FileText, Link2, Save, ShieldAlert, XCircle } from 'lucide-react'
import { downloadArtifact } from './scienceEngine'
import { readStore, uid, writeStore } from './researchStore'

const sections=['Title & Abstract','Introduction','Related Work','Problem Formulation','Proposed Method','Experiments','Results','Discussion & Limitations','Conclusion','References']
const initialBody=(title)=>`# ${title||'Evidence-Governed UAV Control Study'}\n\n## Abstract\nState the problem, bounded method, calculated evidence and limitations.\n\n## 1. Introduction\nDescribe the verified research gap.\n\n## 2. Problem Formulation\nThe bounded translational model is\n\nm v̇ = fᵤ + f𝑤 − mg e₃ − Dv                                      (1)\n\n## 3. Experiments\nLink each result to an evidence artifact ID.\n\n## 4. Results and Limitations\nNo real-flight claim is made from simulation-only evidence.\n\n## References\nOnly verified bibliographic records may be inserted.`

export function OperationalManuscript(){
 const problem=readStore('problem',{})
 const evidence=readStore('evidence',[])
 const [body,setBody]=useState(()=>readStore('manuscript',{}).body||initialBody(problem.title))
 const [active,setActive]=useState(0)
 const [saved,setSaved]=useState(true)
 const save=()=>{writeStore('manuscript',{id:uid('MS'),title:problem.title||'UAV Research Manuscript',body,updatedAt:new Date().toISOString(),evidenceIds:evidence.map(x=>x.id)});setSaved(true)}
 const words=body.trim()?body.trim().split(/\s+/).length:0
 const insertEvidence=id=>{setBody(x=>x+`\n\nEvidence source: [${id}]\n`);setSaved(false)}
 return <section className="workspace manuscript-workspace operational-manuscript"><header className="workspace-head"><div><small>EDITABLE EVIDENCE-LINKED AUTHORING</small><h2>Operational Manuscript Studio</h2><p>Real editable content, persistent save and explicit evidence insertion.</p></div><div className="manuscript-actions"><span>{saved?'Saved':'Unsaved changes'} · {words} words</span><button className="secondary-action" onClick={save}><Save/>Save revision</button><button className="primary-action" onClick={()=>downloadArtifact('AERION-manuscript.md',body,'text/markdown')}><Download/>Export Markdown</button></div></header>
 <div className="manuscript-operational-layout"><aside className="outline-panel">{sections.map((x,i)=><button key={x} className={active===i?'active':''} onClick={()=>setActive(i)}><span>{String(i+1).padStart(2,'0')}</span><b>{x}</b><small>{body.includes(x.split(' ')[0])?'Present':'Review'}</small></button>)}</aside>
 <article className="live-document"><div className="document-ruler"/><textarea value={body} onChange={e=>{setBody(e.target.value);setSaved(false)}} spellCheck="true"/><footer>Editable research draft · equations and evidence require director verification</footer></article>
 <aside className="manuscript-evidence"><h3>Evidence links</h3>{evidence.map(x=><button key={x.id} onClick={()=>insertEvidence(x.id)}><Link2/><span><b>{x.id}</b><small>{x.sourceExperiment}</small></span></button>)}{!evidence.length&&<p>Register a simulation result before making quantitative claims.</p>}<div className="truth-guard"><ShieldAlert/><p>Simulation evidence cannot support real-flight, safety or field-performance claims.</p></div></aside></div></section>
}

export function CriticalReviewWorkspace(){
 const manuscript=readStore('manuscript',{})
 const evidence=readStore('evidence',[])
 const previous=readStore('review',{})
 const [scores,setScores]=useState(previous.scores||{Novelty:55,Methodology:62,Traceability:evidence.length?78:20,References:30,Figures:40,Reproducibility:evidence.length?82:25})
 const [notes,setNotes]=useState(previous.notes||'Major revisions required: verify references, attach reproducible figures, report uncertainty and avoid unsupported claims.')
 const overall=Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/Object.keys(scores).length)
 const decision=overall>=85?'Minor Revision':overall>=70?'Major Revision':'Reject and Redesign'
 const save=()=>writeStore('review',{id:uid('REV'),scores,notes,overall,decision,createdAt:new Date().toISOString(),manuscriptId:manuscript.id||null})
 return <section className="workspace operational-workspace"><header className="workspace-head"><div><small>DIRECTOR-CONTROLLED SCIENTIFIC REVIEW</small><h2>Critical Review Room</h2><p>Adjust evidence-based scores, record review comments and issue a traceable recommendation.</p></div><button className="primary-action" onClick={save}><Save/>Save review decision</button></header>
 <div className="review-layout"><article className="review-scorecard">{Object.entries(scores).map(([k,v])=><label key={k}><span><b>{k}</b><strong>{v}%</strong></span><input type="range" min="0" max="100" value={v} onChange={e=>setScores({...scores,[k]:+e.target.value})}/></label>)}</article><article className="review-notes"><h3>Reviewer comments</h3><textarea value={notes} onChange={e=>setNotes(e.target.value)}/><div className="review-facts"><span><FileText/>Manuscript {manuscript.body?'available':'missing'}</span><span><CheckCircle2/>Evidence artifacts: {evidence.length}</span></div></article><aside className={'review-decision '+(overall>=70?'warn':'block')}><small>RECOMMENDATION</small><b>{overall}%</b><h3>{decision}</h3><p>This is an internal laboratory recommendation, not a journal editorial decision.</p>{overall>=85?<CheckCircle2/>:<XCircle/>}</aside></div></section>
}
