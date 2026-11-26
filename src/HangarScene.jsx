import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls, RoundedBox, Stars } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function Rotor({ position, running }) {
  const blade=useRef()
  useFrame((_,d)=>{if(running&&blade.current) blade.current.rotation.y+=d*35})
  return <group position={position}>
    <mesh castShadow><cylinderGeometry args={[.12,.16,.16,24]}/><meshStandardMaterial color="#152c3f" metalness={.9} roughness={.25}/></mesh>
    <group ref={blade} position={[0,.1,0]}>
      <mesh castShadow><boxGeometry args={[1.45,.025,.09]}/><meshStandardMaterial color="#8df7ff" transparent opacity={running?.34:.75} emissive="#1bd7eb" emissiveIntensity={.6}/></mesh>
      <mesh castShadow rotation-y={Math.PI/2}><boxGeometry args={[1.45,.025,.09]}/><meshStandardMaterial color="#9b8cff" transparent opacity={running?.3:.7} emissive="#655cff" emissiveIntensity={.55}/></mesh>
    </group>
  </group>
}

function Drone({ running }) {
  const drone=useRef()
  useFrame(({clock})=>{if(!drone.current)return;const t=clock.elapsedTime;drone.current.position.y=2.05+Math.sin(t*1.2)*(running?.13:.035);drone.current.rotation.z=running?Math.sin(t*.65)*.035:0})
  return <group ref={drone} position={[0,2.05,0]}>
    {[Math.PI/4,-Math.PI/4].map((r,i)=><mesh key={i} rotation-y={r} castShadow><boxGeometry args={[3.25,.12,.16]}/><meshStandardMaterial color="#172d40" metalness={.75} roughness={.27}/></mesh>)}
    <RoundedBox args={[1.1,.35,.75]} radius={.16} castShadow><meshPhysicalMaterial color="#0ebace" metalness={.64} roughness={.2} clearcoat={1}/></RoundedBox>
    <mesh position={[0,-.22,.39]} castShadow><sphereGeometry args={[.2,24,18]}/><meshPhysicalMaterial color="#071522" metalness={.2} roughness={.08} transmission={.24}/></mesh>
    <Rotor position={[1.15,.12,1.15]} running={running}/><Rotor position={[-1.15,.12,-1.15]} running={running}/>
    <Rotor position={[1.15,.12,-1.15]} running={running}/><Rotor position={[-1.15,.12,1.15]} running={running}/>
    <pointLight color="#4ff5ff" intensity={5} distance={4} position={[0,-.25,0]}/>
  </group>
}

function SolarField(){
  const panels=useMemo(()=>Array.from({length:30},(_,i)=>({x:(i%10-4.5)*1.25,z:Math.floor(i/10)*1.5-4})),[])
  return <group>{panels.map((p,i)=><group key={i} position={[p.x,.2,p.z]} rotation-x={-.22}>
    <mesh castShadow receiveShadow><boxGeometry args={[.95,.06,.62]}/><meshStandardMaterial color="#073b65" metalness={.55} roughness={.24}/></mesh>
    <lineSegments><edgesGeometry args={[new THREE.BoxGeometry(.95,.06,.62)]}/><lineBasicMaterial color="#4ad8ed" transparent opacity={.45}/></lineSegments>
  </group>)}</group>
}

function DataArc({color,offset=0}){
  const points=useMemo(()=>Array.from({length:80},(_,i)=>{const t=i/79*Math.PI*2;return new THREE.Vector3(Math.sin(t*2)*3.4,2.2+Math.sin(t*3+offset)*.65,Math.cos(t)*1.15)}),[offset])
  const curve=useMemo(()=>new THREE.CatmullRomCurve3(points),[points])
  return <mesh><tubeGeometry args={[curve,180,.018,8,false]}/><meshBasicMaterial color={color} transparent opacity={.7}/></mesh>
}

function AgentCore({position,color,label,active}){
  return <group position={position}>
    <mesh><icosahedronGeometry args={[.32,3]}/><meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={active?2:.7} metalness={.25} roughness={.16}/></mesh>
    <mesh rotation-x={Math.PI/2}><torusGeometry args={[.55,.012,8,80]}/><meshBasicMaterial color={color} transparent opacity={.8}/></mesh>
    <pointLight color={color} intensity={active?4:1.5} distance={4}/>
    <Html center distanceFactor={9} position={[0,-.75,0]}><span className="spatial-label">{label}</span></Html>
  </group>
}

function CameraRig({mode}){
  const {camera}=useThree()
  useFrame((_,d)=>{const target=mode==='top'?new THREE.Vector3(0,10,.1):mode==='follow'?new THREE.Vector3(5,3.4,5):new THREE.Vector3(7,5.2,8);camera.position.lerp(target,Math.min(1,d*2.4));camera.lookAt(0,1.5,0)})
  return null
}

function World({running,cameraMode}){
  return <>
    <color attach="background" args={['#061929']}/><fog attach="fog" args={['#061929',10,25]}/>
    <ambientLight intensity={1.05}/><hemisphereLight args={['#a8f5ff','#06243a',2]}/>
    <directionalLight position={[6,10,4]} intensity={3.2} color="#d9fbff" castShadow shadow-mapSize={[2048,2048]}/>
    <spotLight position={[-6,8,3]} intensity={4} color="#685cff" angle={.5} penumbra={.8}/>
    <Stars radius={45} depth={20} count={500} factor={1.6} fade speed={.15}/>
    <mesh rotation-x={-Math.PI/2} receiveShadow><planeGeometry args={[40,40]}/><meshStandardMaterial color="#08263a" metalness={.28} roughness={.58}/></mesh>
    <gridHelper args={[28,28,'#0b8097','#123b4d']} position={[0,.012,0]}/>
    <SolarField/><DataArc color="#23e7d2"/><DataArc color="#776dff" offset={1.25}/><Drone running={running}/>
    <AgentCore position={[-5,1.6,-1]} color="#776dff" label="ARCHITECT"/>
    <AgentCore position={[-5,1.6,2]} color="#23e7d2" label="SIMULATION" active={running}/>
    <AgentCore position={[5,1.6,-1]} color="#ffbe55" label="WRITER"/>
    <AgentCore position={[5,1.6,2]} color="#b278ff" label="REVIEWER"/>
    <mesh position={[0,.1,0]} receiveShadow><cylinderGeometry args={[2.3,2.55,.18,64]}/><meshStandardMaterial color="#162f43" metalness={.8} roughness={.22}/></mesh>
    <mesh position={[0,.205,0]} rotation-x={-Math.PI/2}><ringGeometry args={[1.85,2.28,64]}/><meshBasicMaterial color="#25ddec" transparent opacity={.7}/></mesh>
    <CameraRig mode={cameraMode}/><OrbitControls enablePan={false} minDistance={4.5} maxDistance={15} maxPolarAngle={Math.PI*.48}/>
  </>
}

export default function HangarScene({running,cameraMode}){
  return <Canvas shadows dpr={[1,1.8]} camera={{position:[7,5.2,8],fov:44}} gl={{antialias:true,powerPreference:'high-performance'}}><World running={running} cameraMode={cameraMode}/></Canvas>
}
