import { useMemo, useState } from 'react'
import { Database, Download, FileCheck2, Link2, Search, Trash2 } from 'lucide-react'
import { downloadArtifact } from './scienceEngine'
import { readStore, writeStore } from './researchStore'

export default function OperationalEvidence(){
 const [items,setItems]=useState(()=>readStore('evidence',[]))
 const [query,setQuery]=useState('')
 const [selected,setSelected]=useState(null)
 const rows=useMemo(()=>items.filter(x=>JSON.stringify(x).toLowerCase().includes(query.toLowerCase())),[items,query])
 const remove=id=>{const next=items.filter(x=>x.id!==id);setItems(next);writeStore('evidence',next);if(selected?.id===id)setSelected(null)}
 return <section className="workspace operational-workspace"><header className="workspace-head"><div><small>PERSISTENT TRACEABILITY REGISTER</small><h2>Operational Evidence Vault</h2><p>Artifacts shown here were produced or explicitly registered by the laboratory workflow.</p></div><button className="secondary-action" disabled={!items.length} onClick={()=>downloadArtifact('aerion-evidence-bundle.json',JSON.stringify(items,null,2))}><Download/>Export evidence bundle</button></header>
 <div className="evidence-operational"><article className="evidence-register"><div className="evidence-toolbar"><label><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search ID, experiment or metric…"/></label><span>{rows.length} artifact(s)</span></div><div className="evidence-live-table"><div className="head"><span>ID</span><span>Artifact</span><span>Source</span><span>Class</span><span>Status</span><span/></div>{rows.map(x=><button key={x.id} onClick={()=>setSelected(x)} className={selected?.id===x.id?'active':''}><code>{x.id}</code><b>{x.title||x.kind}</b><span>{x.sourceExperiment||'Manual'}</span><span>{x.evidenceClass}</span><em>{x.status}</em><i><FileCheck2/></i></button>)}{!rows.length&&<div className="evidence-empty"><Database/><h3>No matching evidence</h3><p>Run a simulation and choose “Register evidence”.</p></div>}</div></article>
 <aside className="evidence-detail">{selected?<><Database/><small>SAVED EVIDENCE</small><h3>{selected.id}</h3><dl><dt>Created</dt><dd>{new Date(selected.createdAt).toLocaleString()}</dd><dt>Source experiment</dt><dd>{selected.sourceExperiment||'—'}</dd><dt>Evidence class</dt><dd>{selected.evidenceClass}</dd><dt>RMSE</dt><dd>{selected.metrics?.rmse?.toFixed(5)||'—'} m</dd><dt>Final error</dt><dd>{selected.metrics?.finalError?.toFixed(5)||'—'} m</dd></dl><button onClick={()=>{navigator.clipboard?.writeText(selected.id)}}><Link2/>Copy artifact ID</button><button onClick={()=>downloadArtifact(selected.id+'.json',JSON.stringify(selected,null,2))}><Download/>Download artifact</button><button className="danger" onClick={()=>remove(selected.id)}><Trash2/>Remove from vault</button></>:<div className="evidence-empty"><Database/><p>Select an artifact to inspect provenance.</p></div>}</aside></div></section>
}
