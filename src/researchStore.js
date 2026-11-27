const KEYS={
 problem:'aerion.problemSpec', audit:'aerion.agentAudit', step:'aerion.agentStep',
 experiments:'aerion.experiments', evidence:'aerion.evidence', manuscript:'aerion.manuscript',
 review:'aerion.review'
}
export const readStore=(key,fallback)=>{
 try{return JSON.parse(localStorage.getItem(KEYS[key]||key)||'null')??fallback}catch{return fallback}
}
export const writeStore=(key,value)=>{
 localStorage.setItem(KEYS[key]||key,JSON.stringify(value))
 window.dispatchEvent(new CustomEvent('aerion:store',{detail:{key,value}}))
 return value
}
export const uid=(prefix='ART')=>`${prefix}-${new Date().toISOString().replace(/[-:.TZ]/g,'').slice(0,14)}-${Math.random().toString(36).slice(2,6).toUpperCase()}`
export const addEvidence=(artifact)=>{
 const all=readStore('evidence',[])
 const item={id:artifact.id||uid('EVD'),createdAt:new Date().toISOString(),status:'Saved evidence',evidenceClass:'Simulation data',...artifact}
 writeStore('evidence',[item,...all.filter(x=>x.id!==item.id)])
 return item
}
export const addExperiment=(result)=>{
 const all=readStore('experiments',[])
 writeStore('experiments',[result,...all.filter(x=>x.id!==result.id)].slice(0,100))
 return result
}
export const subscribeStore=(fn)=>{
 const h=e=>fn(e.detail);window.addEventListener('aerion:store',h);return()=>window.removeEventListener('aerion:store',h)
}
