'use client';

import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  Suspense,
  memo,
  Component,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// ─── ERROR BOUNDARY FOR 3D CANVAS SAFETY ──────────────────────────────────────
class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn('ScissorScene 3D Canvas notice:', err);
  }
  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

// ─── MODEL METRICS ────────────────────────────────────────────────────────────
const MODEL_CENTER_Y = 0.73;

// ─── GEOMETRY CACHE ───────────────────────────────────────────────────────────
const GEO = (() => {
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 0);
  bladeShape.lineTo(0.07, 0.22);
  bladeShape.lineTo(0.06, 1.6);
  bladeShape.quadraticCurveTo(0.03, 2.3, 0.0, 2.72);
  bladeShape.quadraticCurveTo(-0.015, 2.3, -0.038, 1.6);
  bladeShape.lineTo(-0.055, 0.22);
  bladeShape.lineTo(0, 0);

  const extOpts = {
    steps: 1,
    depth: 0.028,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.009,
    bevelSegments: 3,
  };

  return {
    blade: new THREE.ExtrudeGeometry(bladeShape, extOpts),
    shaft: new THREE.CylinderGeometry(0.042, 0.058, 0.88, 14),
    ringL: new THREE.TorusGeometry(0.24, 0.048, 14, 30),
    ringR: new THREE.TorusGeometry(0.22, 0.048, 14, 30),
    pivotBody: new THREE.CylinderGeometry(0.13, 0.13, 0.11, 30),
    pivotFace: new THREE.CylinderGeometry(0.09, 0.09, 0.016, 30),
    grooveBox: new THREE.BoxGeometry(0.16, 0.027, 0.016),
    stopper: new THREE.CylinderGeometry(0.022, 0.022, 0.055, 14),
    hair: new THREE.CylinderGeometry(1, 1, 1, 6),
  };
})();

// ─── HYPER-REALISTIC HIGH-SPECULAR METALLIC MATERIALS ───────────────────────
const MAT = {
  chrome: new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    metalness: 0.99,
    roughness: 0.035,
    envMapIntensity: 4.5,
  }),
  bronze: new THREE.MeshStandardMaterial({
    color: '#d4af37',
    metalness: 0.96,
    roughness: 0.12,
    envMapIntensity: 2.8,
  }),
  dark: new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.35,
    roughness: 0.65,
  }),
  hair: new THREE.MeshStandardMaterial({
    color: '#28211c',
    roughness: 0.82,
    metalness: 0.08,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
  }),
};

// ─── PROCEDURAL SCISSOR MESH (WITH DIRECT BLADE REFS FOR INSTANT ANIMATION) ─
const ProcScissor = memo(function ProcScissor({ leftBladeRef, rightBladeRef }) {
  return (
    <group>
      <mesh geometry={GEO.pivotBody} material={MAT.bronze} rotation={[Math.PI / 2, 0, 0]} castShadow />
      <mesh geometry={GEO.pivotFace} material={MAT.bronze} position={[0, 0, 0.062]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={GEO.grooveBox} material={MAT.dark} position={[0, 0, 0.072]} />

      {/* Left Blade Group — Rotated directly via leftBladeRef in useFrame */}
      <group ref={leftBladeRef}>
        <mesh geometry={GEO.blade} material={MAT.chrome} position={[0, 0, 0.01]} castShadow receiveShadow />
        <mesh geometry={GEO.shaft} material={MAT.chrome} position={[-0.032, -0.46, -0.01]} rotation={[0, 0, 0.13]} castShadow />
        <mesh geometry={GEO.ringL} material={MAT.chrome} position={[-0.17, -1.02, -0.01]} castShadow />
        <mesh geometry={GEO.stopper} material={MAT.dark} position={[0.055, -0.3, 0.01]} rotation={[Math.PI / 2, 0, 0]} />
      </group>

      {/* Right Blade Group — Rotated directly via rightBladeRef in useFrame */}
      <group ref={rightBladeRef} scale={[-1, 1, 1]}>
        <mesh geometry={GEO.blade} material={MAT.chrome} position={[0, 0, -0.038]} castShadow receiveShadow />
        <mesh geometry={GEO.shaft} material={MAT.chrome} position={[-0.032, -0.46, 0.01]} rotation={[0, 0, 0.13]} castShadow />
        <mesh geometry={GEO.ringR} material={MAT.chrome} position={[-0.17, -1.02, 0.01]} castShadow />
      </group>
    </group>
  );
});

// ─── INSTANCED HAIR PARTICLES (OPTIMIZED ZERO CPU/GPU OVERHEAD) ─────────────
const PARTICLE_COUNT = 28;

function HairParticles({ active }) {
  const ref = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => {
      const a = (Math.random() - 0.5) * Math.PI * 0.9;
      const s = 0.25 + Math.random() * 0.55;
      return {
        x: (Math.random() - 0.5) * 0.18,
        y: (Math.random() - 0.5) * 0.12,
        z: (Math.random() - 0.5) * 0.18,
        vx: Math.sin(a) * s * 0.02,
        vy: (-Math.abs(Math.cos(a)) * s - 0.01) * 0.028,
        vz: (Math.random() - 0.5) * 0.01,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        vrz: (Math.random() - 0.5) * 0.04,
        len: 0.07 + Math.random() * 0.12,
        life: 0,
      };
    });
  }, []);

  useFrame((_, dt) => {
    if (!ref.current) return;
    let hasUpdates = false;

    data.forEach((p, i) => {
      if (active) {
        p.life = Math.min(1, p.life + dt * 4.0);
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.rz += p.vrz;
        hasUpdates = true;
      } else if (p.life > 0) {
        p.life = Math.max(0, p.life - dt * 4.5);
        hasUpdates = true;
      }

      if (hasUpdates || p.life > 0) {
        const op = active && p.life < 0.85 ? p.life : Math.max(0, 1 - ((p.life - 0.85) / 0.15));
        MAT.hair.opacity = op;

        dummy.position.set(p.x, p.y, p.z);
        dummy.rotation.set(p.rx, p.ry, p.rz);
        dummy.scale.set(0.0028, p.len, 0.0028);
        dummy.updateMatrix();
        ref.current.setMatrixAt(i, dummy.matrix);
      }
    });

    if (hasUpdates) {
      ref.current.instanceMatrix.needsUpdate = true;
    }
  });

  return <instancedMesh ref={ref} args={[GEO.hair, MAT.hair, PARTICLE_COUNT]} />;
}

// ─── SUBTLE IDLE MICRO-FLOAT ──────────────────────────────────────────────────
function IdleFloat() {
  const { camera } = useThree();
  const t = useRef(0);

  useFrame((_, dt) => {
    t.current += dt * 0.35;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, Math.sin(t.current * 0.5) * 0.015, dt * 1.8);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, Math.cos(t.current * 0.35) * 0.012, dt * 1.8);
  });

  return null;
}

// ─── KEY LIGHT REF SWEEP ─────────────────────────────────────────────────────
function KeyLight({ sweepX }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, sweepX, dt * 3.4);
  });
  return <directionalLight ref={ref} position={[2, 7, 5]} intensity={3.8} color="#ffffff" castShadow />;
}

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp01(v) { return Math.max(0, Math.min(1, v)); }
function remap(v, a, b) { return clamp01((v - a) / (b - a)); }

// ─── 3D OVERLAY DYNAMIC SCISSOR RIG CONTROLLER ──────────────────────────────
// RICH DYNAMIC MOTION ENGINE:
// 1. Descending Entry & Arc Roll (0% - 38%)
// 2. 3D Profile Sweep & Specular Pitch (38% - 58%)
// 3. Wide Blade Open & Snapping Cut (58% - 74%)
// 4. Post-Cut Floating Orbit & Arc Tilt (74% - 88%)
// 5. Dissolve & Settle into About Section (88% - 100%)
function ScissorRig({ progressRef, mouseTiltRef, deviceMode }) {
  const groupRef = useRef();
  const leftBladeRef = useRef();
  const rightBladeRef = useRef();

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    const prog = typeof progressRef === 'object' ? progressRef.current : progressRef;
    const p = clamp01(prog);

    // Responsive scaling for Desktop (0.72), Tablet (0.58), Mobile (0.44)
    const baseScale = deviceMode === 'mobile' ? 0.44 : deviceMode === 'tablet' ? 0.58 : 0.72;

    // ── OPACITY TIMING ──
    let op = 0;
    if (p < 0.18) op = 0;
    else if (p < 0.38) op = remap(p, 0.18, 0.38);
    else if (p < 0.88) op = 1;
    else op = lerp(1, 0, remap(p, 0.88, 1.0));

    // ── DYNAMIC POSITION Y ──
    // 0-38%: Descends from top center (+2.8 -> 0.0)
    // 38-74%: Centered at 0.0 over IDENTITY
    // 74-88%: Performs a luxury floating orbit upward (0.0 -> +0.18)
    // 88-100%: Settles back to 0.0 as it dissolves
    let pY;
    const topY = deviceMode === 'mobile' ? 2.0 : deviceMode === 'tablet' ? 2.4 : 2.8;
    if (p < 0.38) {
      pY = lerp(topY, 0, remap(p, 0.18, 0.38));
    } else if (p < 0.74) {
      pY = 0;
    } else if (p < 0.88) {
      pY = lerp(0, 0.18, remap(p, 0.74, 0.88));
    } else {
      pY = lerp(0.18, 0, remap(p, 0.88, 1.0));
    }

    // ── DYNAMIC ROTATION Z (ARC ROLL) ──
    // 0-38%: Rolls from -45° (-0.78 rad) to -12° (-0.21 rad)
    // 38-58%: Smoothly aligns to 0° (0 rad) over text center
    // 58-74%: Aligned straight at 0° for text shear cut
    // 74-88%: Post-cut floating tilt (0° -> +0.16 rad / +9.2°)
    // 88-100%: Settle back to 0°
    let rZ;
    if (p < 0.38) {
      rZ = lerp(-0.78, -0.21, remap(p, 0.18, 0.38));
    } else if (p < 0.58) {
      rZ = lerp(-0.21, 0, remap(p, 0.38, 0.58));
    } else if (p < 0.74) {
      rZ = 0;
    } else if (p < 0.88) {
      rZ = lerp(0, 0.16, remap(p, 0.74, 0.88));
    } else {
      rZ = lerp(0.16, 0, remap(p, 0.88, 1.0));
    }

    // ── DYNAMIC ROTATION Y (3D PROFILE SWEEP) ──
    // Sweeps dynamically from 0.08 rad up to 1.85 rad (~106° silver mirror view)
    const rY = lerp(0.08, 1.85, p) + Math.sin(p * Math.PI * 1.2) * 0.18;

    // ── DYNAMIC ROTATION X (SPECULAR PITCH TILT) ──
    const rX = 0.05 + Math.sin(p * Math.PI) * 0.19;

    // ── 58% - 74%: MULTI-STAGE BLADE SHEAR ACTION ──
    // 58-66%: Open wide (0 -> 0.54 rad / ~31° opening)
    // 66-70%: Tension hover
    // 70-74%: Snap shut cleanly (0.54 -> 0.0 rad) with metallic recoil
    let bladeAngle = 0;
    if (p >= 0.58 && p < 0.66) {
      bladeAngle = lerp(0, 0.54, remap(p, 0.58, 0.66));
    } else if (p >= 0.66 && p < 0.70) {
      bladeAngle = 0.54 + Math.sin(p * 40) * 0.012; // subtle tension hover
    } else if (p >= 0.70 && p < 0.74) {
      bladeAngle = lerp(0.54, 0, remap(p, 0.70, 0.74));
    }

    // Direct Three.js Scene Object Rotation for 60-120 FPS Blade Animation!
    if (leftBladeRef.current) leftBladeRef.current.rotation.z = bladeAngle;
    if (rightBladeRef.current) rightBladeRef.current.rotation.z = -bladeAngle;

    const mouseX = mouseTiltRef.current ? mouseTiltRef.current.x : 0;
    const mouseY = mouseTiltRef.current ? mouseTiltRef.current.y : 0;

    const spd = dt * 3.8;
    const g = groupRef.current;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, rX + mouseY * 0.012, spd);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, rY + mouseX * 0.012, spd);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, rZ, spd);
    g.position.x = THREE.MathUtils.lerp(g.position.x, 0, spd);
    g.position.y = THREE.MathUtils.lerp(g.position.y, pY, spd * 0.8);
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, Math.max(0.001, baseScale * op), spd * 0.85));
  });

  const progVal = typeof progressRef === 'object' ? progressRef.current : progressRef;
  const p = clamp01(progVal);

  // Hair particles emit during shear cut action (70% - 82%)
  const particlesActive = p >= 0.70 && p < 0.82;

  return (
    <group ref={groupRef} position={[0, -MODEL_CENTER_Y * (deviceMode === 'mobile' ? 0.44 : deviceMode === 'tablet' ? 0.58 : 0.72), 0]}>
      <ProcScissor leftBladeRef={leftBladeRef} rightBladeRef={rightBladeRef} />
      <HairParticles active={particlesActive} />
    </group>
  );
}

// ─── SCENE ROOT ─────────────────────────────────────────────────────────────
function ScissorScene({ progressRef = 0, isVisible = true }) {
  const mouseTiltRef = useRef({ x: 0, y: 0 });
  const [deviceMode, setDeviceMode] = useState('desktop');
  const [isTabActive, setIsTabActive] = useState(true);

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      if (w < 640) setDeviceMode('mobile');
      else if (w < 1024) setDeviceMode('tablet');
      else setDeviceMode('desktop');
    };
    const onVisibilityChange = () => setIsTabActive(!document.hidden);

    onResize();
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (deviceMode === 'mobile') return;
    let rafId = null;
    const onMouse = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        mouseTiltRef.current = {
          x: (e.clientX / window.innerWidth - 0.5) * 2,
          y: (e.clientY / window.innerHeight - 0.5) * 2,
        };
        rafId = null;
      });
    };
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouse);
    };
  }, [deviceMode]);

  const progVal = typeof progressRef === 'object' ? progressRef.current : progressRef;
  const pL = progVal < 0.18 ? 2 : progVal < 0.74 ? lerp(2, 9.8, remap(progVal, 0.18, 0.74)) : 9.8;

  const shouldRender = isVisible && isTabActive;

  // Responsive camera parameters: Mobile Z=9.2 FOV=44, Tablet Z=8.0 FOV=42, Desktop Z=7.5 FOV=40
  const camZ = deviceMode === 'mobile' ? 9.2 : deviceMode === 'tablet' ? 8.0 : 7.5;
  const camFov = deviceMode === 'mobile' ? 44 : deviceMode === 'tablet' ? 42 : 40;

  return (
    <CanvasErrorBoundary>
      <div className="w-full h-full pointer-events-none bg-transparent">
        <Canvas
          frameloop={shouldRender ? 'always' : 'never'}
          camera={{ position: [0, 0, camZ], fov: camFov }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, deviceMode === 'mobile' ? 1.0 : 1.5]}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.7} />
          <KeyLight sweepX={pL} />
          <directionalLight position={[-5, 2, -3]} intensity={1.4} color="#dceeff" />
          <directionalLight position={[4, -2, 3]} intensity={0.7} color="#fff8f0" />
          <spotLight position={[0, 9, -7]} intensity={4.5} color="#c8a76e" angle={0.44} penumbra={0.85} />

          <Environment preset="studio" />
          <ContactShadows position={[0, -1.4, 0]} opacity={0.28} scale={4.2} blur={1.5} far={2.5} />

          <IdleFloat />

          <Suspense fallback={null}>
            <ScissorRig progressRef={progressRef} mouseTiltRef={mouseTiltRef} deviceMode={deviceMode} />
          </Suspense>
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}

export default memo(ScissorScene);
