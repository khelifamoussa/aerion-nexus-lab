export function referenceAt(t, trajectory='step'){
  if(trajectory==='sine') return 2*Math.sin(.45*t)
  if(trajectory==='ramp') return Math.min(3,.18*t)
  if(trajectory==='circle') return 1.5*Math.sin(.32*t)
  return 2
}

export function simulateCampaign(p){
  const dt=.02
  const horizon=Math.max(4,Math.min(90,Number(p.horizon)||25))
  const mass=Math.max(.2,Number(p.mass)||2.4)
  const drag=Math.max(0,Number(p.drag)||.18)
  const kp=Math.max(0,Number(p.kp)||5.5)
  const kd=Math.max(0,Number(p.kd)||3.9)
  const ki=Math.max(0,Number(p.ki)||.35)
  const wind=Math.max(0,Number(p.wind)||1.8)
  let x=0,v=0,integral=0,energy=0,sumSq=0,maxError=0
  const data=[]
  const deriv=(state,t)=>{
    const ref=referenceAt(t,p.trajectory)
    const error=ref-state[0]
    const disturbance=wind*(.72*Math.sin(.9*t)+.28*Math.sin(2.35*t))
    const estimate=p.controller==='PID + DOB'?.78*disturbance:0
    const raw=kp*error-kd*state[1]+ki*state[2]-estimate
    const u=Math.max(-30,Math.min(30,raw))
    return [state[1],(u+disturbance-drag*state[1])/mass,Math.max(-15,Math.min(15,error)),u,disturbance,ref]
  }
  let s=[x,v,integral]
  const count=Math.round(horizon/dt)
  for(let i=0;i<=count;i++){
    const t=i*dt
    const a=deriv(s,t)
    const error=a[5]-s[0]
    sumSq+=error*error; energy+=a[3]*a[3]*dt; maxError=Math.max(maxError,Math.abs(error))
    if(i%5===0)data.push({t:+t.toFixed(2),reference:+a[5].toFixed(5),position:+s[0].toFixed(5),velocity:+s[1].toFixed(5),command:+a[3].toFixed(5),disturbance:+a[4].toFixed(5),error:+error.toFixed(5)})
    const b=deriv(s.map((q,j)=>q+dt*a[j]/2),t+dt/2)
    const c=deriv(s.map((q,j)=>q+dt*b[j]/2),t+dt/2)
    const d=deriv(s.map((q,j)=>q+dt*c[j]),t+dt)
    s=s.map((q,j)=>q+dt*(a[j]+2*b[j]+2*c[j]+d[j])/6)
    s[2]=Math.max(-20,Math.min(20,s[2]))
    if(!s.every(Number.isFinite)) throw new Error('Numerical instability detected')
  }
  return {id:'EXP-'+Date.now(),createdAt:new Date().toISOString(),parameters:{...p,mass,drag,kp,kd,ki,wind,horizon,dt},metrics:{rmse:Math.sqrt(sumSq/(count+1)),finalError:data.at(-1).error,maxError,controlEnergy:energy},data}
}

export function downloadArtifact(name,content,type='application/json'){
  const blob=new Blob([content],{type})
  const url=URL.createObjectURL(blob)
  const a=document.createElement('a');a.href=url;a.download=name;a.click()
  setTimeout(()=>URL.revokeObjectURL(url),1500)
}

export function resultToCsv(result){
  return ['time_s,reference_m,position_m,velocity_mps,command_N,disturbance_N,error_m',...result.data.map(x=>[x.t,x.reference,x.position,x.velocity,x.command,x.disturbance,x.error].join(','))].join('\n')
}
