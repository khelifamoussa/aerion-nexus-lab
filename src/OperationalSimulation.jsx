import { useEffect, useMemo, useState } from 'react'
import { Activity, Download, Play, Save, ShieldAlert } from 'lucide-react'
import { downloadArtifact, resultToCsv, simulateCampaign } from './scienceEngine'

const defaults={mass:2.4,drag:.18,wind:1.8,horizon:25,kp:5.5,kd:3.9,ki:.35,controller:'PID',trajectory:'step'}
const Field=({label,name,value,onChange,step=.1})=><label><span>{label}</span><input type="number" name={name} value={value} step={step} onChange={onChange}/></label>

function Trace({result}){
 const values=result?.data||[]
 const min=-1,max=3.5
 const points=(key)=>values.filter((_,i)=>i%4===0).map((v,i,a)=>`${i/Math.max(1,a.length-1)*100},${96-(v[key]-min)/(max-min)*88}`).join(' ')
 return <div className="operational-chart"><div className="chart-legend"><span><i/>Reference</span><span><i/>Position</span></div><svg viewBox="0 0 100 100" preserveAspectRatio="none">{[20,40,60,80].map(y=><line key={y} x1="0" x2="100" y1={y} y2={y}/>)}<polyline className="ref" points={points('reference')}/><polyline className="pos" points={points('position')}/></svg></div>
}

export default function OperationalSimulation(){
 const [params,setParams]=useState(()=>JSON.parse(localStorage.getItem('aerion.simulation.params')||'null')||defaults)
 const [result,setResult]=useState(()=>JSON.parse(localStorage.getItem('aerion.simulation.last')||'null'))
 const [running,setRunning]=useState(false)
 const [message,setMessage]=useState('Ready for a deterministic browser simulation.')
 const change=e=>setParams({...params,[e.target.name]:e.target.type==='number'?+e.target.value:e.target.value})
 useEffect(()=>localStorage.setItem('aerion.simulation.params',JSON.stringify(params)),[params])
 const run=()=>{
   setRunning(true);setMessage('Integrating equations…')
   requestAnimationFrame(()=>{try{const next=simulateCampaign(params);setResult(next);localStorage.setItem('aerion.simulation.last',JSON.stringify(next));setMessage('Campaign completed and preserved locally.')}catch(e){setMessage(e.message)}finally{setRunning(false)}})
 }
 const metric=useMemo(()=>result?.metrics,[result])
 return <section className="workspace operational-workspace"><header className="workspace-head"><div><small>REPRODUCIBLE RK4 COMPUTE BAY</small><h2>Operational Simulation Laboratory</h2><p>Run the bounded translational UAV model, inspect traceable metrics and export the complete trajectory.</p></div><button className="primary-action" onClick={run} disabled={running}><Play/>{running?'Computing…':'Run simulation'}</button></header>
 <div className="operational-grid"><aside className="sim-form"><h3>Plant & controller</h3><div className="field-pair"><Field label="Mass (kg)" name="mass" value={params.mass} onChange={change}/><Field label="Linear drag" name="drag" value={params.drag} onChange={change} step={.01}/><Field label="Wind force (N)" name="wind" value={params.wind} onChange={change}/><Field label="Horizon (s)" name="horizon" value={params.horizon} onChange={change} step={1}/><Field label="Kp" name="kp" value={params.kp} onChange={change}/><Field label="Kd" name="kd" value={params.kd} onChange={change}/><Field label="Ki" name="ki" value={params.ki} onChange={change} step={.05}/></div><label><span>Controller</span><select name="controller" value={params.controller} onChange={change}><option>PID</option><option>PID + DOB</option></select></label><label><span>Trajectory</span><select name="trajectory" value={params.trajectory} onChange={change}><option value="step">Step</option><option value="sine">Sine</option><option value="ramp">Ramp</option><option value="circle">Circle projection</option></select></label><p className="sim-message"><Activity/>{message}</p></aside>
 <article className="result-console"><header><div><small>ACTIVE RESULT</small><h3>{result?.id||'No campaign yet'}</h3></div><span>{result?'COMPUTED':'WAITING'}</span></header><Trace result={result}/>{metric?<div className="result-metrics"><div><small>RMSE</small><b>{metric.rmse.toFixed(4)} m</b></div><div><small>FINAL ERROR</small><b>{metric.finalError.toFixed(4)} m</b></div><div><small>MAX |ERROR|</small><b>{metric.maxError.toFixed(3)} m</b></div><div><small>∫u²dt</small><b>{metric.controlEnergy.toFixed(1)}</b></div></div>:<div className="empty-result">Set the parameters and run a campaign.</div>}<div className="export-row"><button disabled={!result} onClick={()=>downloadArtifact('aerion-experiment.json',JSON.stringify(result,null,2))}><Download/>JSON evidence</button><button disabled={!result} onClick={()=>downloadArtifact('aerion-trajectory.csv',resultToCsv(result),'text/csv')}><Download/>CSV trajectory</button><button disabled={!result} onClick={()=>{localStorage.setItem('aerion.evidence.latest',JSON.stringify(result));setMessage('Result registered as the latest evidence artifact.')}}><Save/>Register evidence</button></div></article>
 <aside className="model-contract"><ShieldAlert/><h3>Model contract</h3><div className="equation-card">mẍ = u + d(t) − cẋ <b>(1)</b></div><div className="equation-card">u = Kₚe + Kᵢ∫e dt − Kdẋ <b>(2)</b></div><dl><dt>Integrator</dt><dd>Fixed RK4 · 20 ms</dd><dt>Scope</dt><dd>3D translation projected per axis</dd><dt>Evidence class</dt><dd>Simulated</dd><dt>Persistence</dt><dd>Browser local storage</dd></dl><p>No attitude, motor, 6-DOF or real-flight claim is produced by this module.</p></aside></div></section>
}
