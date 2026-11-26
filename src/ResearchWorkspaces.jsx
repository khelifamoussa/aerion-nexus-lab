import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, ChevronRight, Database, Download, FileCheck2, Filter, GitBranch, LockKeyhole, Play, ScanSearch, Send, ShieldAlert } from 'lucide-react'
import { evidenceRecords, experiments, publicationTargets } from './labData'

const Status = ({value}) => <span className={'status status-'+value.toLowerCase().replaceAll(' ','-')}>{value}</span>

export function SimulationWorkspace(){
  const [selected,setSelected]=useState(experiments[0])
  const [seeds,setSeeds]=useState(30)
  const [noise,setNoise]=useState(true)
  const readiness=useMemo(()=>Math.min(100,58+Math.round(seeds*.7)+(noise?9:0)),[seeds,noise])
  return <section className="workspace scientific-workspace">
    <header className="workspace-head"><div><small>REPRODUCIBLE COMPUTE BAY</small><h2>Simulation Campaign</h2><p>Configure bounded experiments, deterministic seeds and validation gates.</p></div><button className="primary-action"><Play/> Queue campaign</button></header>
    <div className="science-grid">
      <aside className="experiment-list"><h3>Experiment registry</h3>{experiments.map(x=><button key={x.id} className={selected.id===x.id?'active':''} onClick={()=>setSelected(x)}><span>{x.id}</span><b>{x.title}</b><small>{x.model}</small><ChevronRight/></button>)}</aside>
      <article className="config-console">
        <div className="console-title"><div><small>ACTIVE SPECIFICATION</small><h3>{selected.title}</h3></div><Status value={selected.status}/></div>
        <div className="config-fields"><label>Plant model<strong>{selected.model}</strong></label><label>Controller<strong>{selected.controller}</strong></label><label>Trajectory<strong>{selected.trajectory}</strong></label><label>Disturbance<strong>{selected.disturbance}</strong></label></div>
        <div className="parameter"><span><b>Monte Carlo seeds</b><small>Deterministic range: 42–{41+seeds}</small></span><input type="range" min="10" max="80" value={seeds} onChange={e=>setSeeds(+e.target.value)}/><strong>{seeds}</strong></div>
        <label className="toggle-row"><span><b>Measurement noise</b><small>Gaussian sensor model · σ = 0.02 m</small></span><input type="checkbox" checked={noise} onChange={e=>setNoise(e.target.checked)}/><i/></label>
        <div className="readiness"><div><span>Campaign readiness</span><b>{readiness}%</b></div><i><b style={{width:readiness+'%'}}/></i><p><CheckCircle2/> Model bounds declared <CheckCircle2/> Seeds recorded <CheckCircle2/> Metrics frozen</p></div>
      </article>
      <aside className="compute-ledger"><h3>Compute manifest</h3><dl><dt>Solver</dt><dd>RK45 adaptive</dd><dt>Step ceiling</dt><dd>5 ms</dd><dt>Horizon</dt><dd>60 s</dd><dt>Runs</dt><dd>{seeds}</dd><dt>Artifacts</dt><dd>8 planned</dd></dl><div className="hash-card"><LockKeyhole/><span><small>CONFIGURATION HASH</small><b>sha256: 9ac4…e71b</b></span></div><p><ShieldAlert/> Results remain simulated evidence until external validation is attached.</p></aside>
    </div>
  </section>
}

export function EvidenceWorkspace(){
  const [filter,setFilter]=useState('All')
  const rows=filter==='All'?evidenceRecords:evidenceRecords.filter(x=>x.status===filter)
  return <section className="workspace scientific-workspace">
    <header className="workspace-head"><div><small>TRACEABILITY & CLAIM GOVERNANCE</small><h2>Evidence Vault</h2><p>Every metric, figure and statement points to a reproducible artifact.</p></div><button className="secondary-action"><Download/> Export audit bundle</button></header>
    <div className="evidence-overview"><article><Database/><span><small>REGISTERED ARTIFACTS</small><b>128</b><em>12 added today</em></span></article><article><FileCheck2/><span><small>VERIFIED CLAIMS</small><b>42/48</b><em>87.5% coverage</em></span></article><article><AlertTriangle/><span><small>OPEN GATES</small><b>6</b><em>3 critical</em></span></article><article><GitBranch/><span><small>REPRODUCIBILITY</small><b>94%</b><em>Seeds + configs frozen</em></span></article></div>
    <div className="vault-panel"><div className="vault-toolbar"><span><Filter/> Evidence register</span><div>{['All','Verified','Review','Blocked'].map(x=><button className={filter===x?'active':''} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div></div>
      <div className="evidence-table"><div className="evidence-row head"><span>ID</span><span>Scientific claim</span><span>Source artifact</span><span>Integrity</span><span>Status</span></div>{rows.map(x=><div className="evidence-row" key={x.id}><code>{x.id}</code><b>{x.claim}</b><span>{x.artifact}</span><span className="integrity"><i style={{width:x.integrity+'%'}}/>{x.integrity}%</span><Status value={x.status}/></div>)}</div>
    </div>
    <div className="claim-guard"><ScanSearch/><div><b>Claim Guard is active</b><p>Real-flight, superiority and safety claims are blocked unless their required validation class is present.</p></div><span>3 CLAIMS BLOCKED</span></div>
  </section>
}

export function PublicationWorkspace(){
  const [target,setTarget]=useState(publicationTargets[0])
  const gates=[['Evidence coverage','42 of 48 claims',88],['Reference verification','36 of 40 DOI records',90],['Figure resolution','11 of 11 compliant',100],['Equation traceability','27 of 27 numbered',100],['Reporting checklist','18 of 21 items',86]]
  const ready=gates.every(x=>x[2]===100)
  return <section className="workspace scientific-workspace">
    <header className="workspace-head"><div><small>MANUSCRIPT-TO-JOURNAL PIPELINE</small><h2>Publication Command</h2><p>Target-aware compliance, submission packaging and revision tracking.</p></div><button className="primary-action" disabled={!ready}><Send/> Submit package</button></header>
    <div className="publication-layout"><aside className="journal-selector"><h3>Journal targets</h3>{publicationTargets.map(x=><button className={target.name===x.name?'active':''} onClick={()=>setTarget(x)} key={x.name}><span><b>{x.name}</b><small>{x.publisher}</small></span><Status value={x.fit}/></button>)}</aside>
      <article className="compliance-board"><div className="journal-head"><div><small>SELECTED TARGET</small><h3>{target.name}</h3><p>{target.scope}</p></div><span>{target.template}</span></div>
        <h4>Submission readiness gates</h4>{gates.map(g=><div className="gate" key={g[0]}><span><b>{g[0]}</b><small>{g[1]}</small></span><i><b style={{width:g[2]+'%'}}/></i><strong>{g[2]}%</strong></div>)}
        <div className="blocking-note"><AlertTriangle/><div><b>Submission remains locked</b><p>Resolve six evidence/reference gates before generating the final package.</p></div></div>
      </article>
      <aside className="package-panel"><h3>Submission package</h3>{['Manuscript · DOCX','Anonymous manuscript · PDF','Cover letter','Highlights','Graphical abstract','Source figures','Data availability statement','Reproducibility bundle'].map((x,i)=><div key={x}><span>{i<5?'✓':'○'}</span>{x}</div>)}<button><Download/> Generate draft package</button><footer>Generation creates a reviewable draft. It never submits to a journal automatically.</footer></aside>
    </div>
  </section>
}
