export const agents=[{id:1,code:'ARCHITECT',name:'Problem Architect',role:'Scientific Planner',color:'#776dff',progress:100,state:'Validated',task:'Experiment specification locked'},{id:2,code:'SIMULATION',name:'Simulation Engineer',role:'Model · Control · Optimize',color:'#23e7d2',progress:64,state:'Running',task:'Monte Carlo · seeds 42–71'},{id:3,code:'WRITER',name:'Scientific Writer',role:'Journal Architect',color:'#ffbe55',progress:82,state:'Evidence locked',task:'Results section v0.8.3'},{id:4,code:'REVIEWER',name:'Critical Reviewer',role:'Validate · Challenge',color:'#b278ff',progress:74,state:'Reviewing',task:'6 issues remain open'}]
export const metrics=[['RMSE','0.184 m','−31.8%'],['MAX ERROR','0.462 m','at 38.4 s'],['CONTROL EFFORT','12.8 N²s','−8.4%'],['RUNTIME','18.6 ms','real-time safe']]
export const stages=['Problem','Evidence','Model','Algorithm','Simulation','Validation','Manuscript','Review','Submission','Publication']
export const modules={Controllers:['PID + Anti-windup','LQR / LQI','Nonlinear MPC','Sliding Mode'],Optimizers:['PSO','Differential Evolution','CMA-ES','Bayesian Optimization'],Estimators:['Extended Kalman Filter','UKF','Disturbance Observer','Moving Horizon'],Planners:['Waypoint','RRT*','Trajectory Optimization','MPC Replanning']}

export const experiments=[
  {id:'EXP-024',title:'Crosswind trajectory tracking',model:'3D point mass + force lag',controller:'PID + feedforward',trajectory:'Solar inspection raster',disturbance:'6.2 m/s · 238°',status:'Validated'},
  {id:'EXP-025',title:'Robustness under mass uncertainty',model:'3D point mass · ±18% mass',controller:'Nonlinear MPC',trajectory:'Helix climb',disturbance:'Dryden gust profile',status:'Review'},
  {id:'EXP-026',title:'Estimator stress campaign',model:'Drag + biased sensors',controller:'LQI + EKF',trajectory:'Figure-eight',disturbance:'GPS dropout · 3 s',status:'Draft'}
]
export const evidenceRecords=[
  {id:'EV-042',claim:'PID-FF reduces tracking RMSE by 31.8%',artifact:'EXP-024 / metrics.json',integrity:100,status:'Verified'},
  {id:'EV-043',claim:'Maximum position error remains below 0.5 m',artifact:'EXP-024 / run-61.parquet',integrity:100,status:'Verified'},
  {id:'EV-044',claim:'Controller is real-time safe at 50 Hz',artifact:'EXP-024 / benchmark.csv',integrity:92,status:'Review'},
  {id:'EV-045',claim:'Method is superior to all robust controllers',artifact:'No admissible comparison',integrity:18,status:'Blocked'},
  {id:'EV-046',claim:'Stable across declared mass uncertainty',artifact:'EXP-025 / monte-carlo.zip',integrity:76,status:'Review'},
  {id:'EV-047',claim:'Validated for real autonomous flight',artifact:'Simulation only',integrity:0,status:'Blocked'}
]
export const publicationTargets=[
  {name:'IEEE Transactions on Control Systems Technology',publisher:'IEEE',fit:'High fit',scope:'Control methods with rigorous experimental or application validation.',template:'IEEE two-column'},
  {name:'Control Engineering Practice',publisher:'Elsevier',fit:'High fit',scope:'Application-driven control engineering with reproducible evaluation.',template:'Elsevier CAS'},
  {name:'Aerospace Science and Technology',publisher:'Elsevier',fit:'Review',scope:'Advanced aerospace systems, modeling and validation.',template:'Elsevier numbered'},
  {name:'Journal of Intelligent & Robotic Systems',publisher:'Springer',fit:'Review',scope:'Intelligent autonomous and robotic systems.',template:'Springer Nature'}
]
