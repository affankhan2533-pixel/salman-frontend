'use client';

import React, { useRef, useEffect, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { gsap, ScrollTrigger } from '@/lib/gsap';

// ─── CONFIGURATION OBJECT ──────────────────────────────────────────────────
const CONFIG = {
  colors: {
    chrome: '#E2E8F0',
    chromeLight: '#F8FAFC',
    chromeDark: '#475569',
    gold: '#C8A76E',
    bronze: '#C09A4E',
    dark: '#1F1F1C',
    warmLight: '#FFF8E7',
    hairStrand: '#2A2A26',
  },
  materials: {
    metalness: 0.98,
    roughness: 0.08,
    envMapIntensity: 3.2,
  },
  motion: {
    idleFloatSpeed: 0.8,
    idleFloatAmplitude: 0.08,
    snipMaxAngle: 0.44, // radians (~25 degrees)
  },
  particles: {
    countDesktop: 12,
    countMobile: 6,
  },
};

// ─── PROCEDURAL GEOMETRY CACHE ──────────────────────────────────────────────
const GEOMETRIES = (() => {
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 0);
  bladeShape.lineTo(0.065, 0.2);
  bladeShape.lineTo(0.055, 1.5);
  bladeShape.quadraticCurveTo(0.025, 2.2, 0.0, 2.6);
  bladeShape.quadraticCurveTo(-0.015, 2.2, -0.035, 1.5);
  bladeShape.lineTo(-0.05, 0.2);
  bladeShape.lineTo(0, 0);

  const extrudeOpts = {
    steps: 1,
    depth: 0.025,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.009,
    bevelSegments: 4,
  };

  return {
    blade: new THREE.ExtrudeGeometry(bladeShape, extrudeOpts),
    shaft: new THREE.CylinderGeometry(0.04, 0.055, 0.85, 16),
    ringL: new THREE.TorusGeometry(0.22, 0.045, 14, 28),
    ringR: new THREE.TorusGeometry(0.20, 0.045, 14, 28),
    pivotBody: new THREE.CylinderGeometry(0.12, 0.12, 0.1, 28),
    pivotFace: new THREE.CylinderGeometry(0.088, 0.088, 0.018, 28),
    grooveBox: new THREE.BoxGeometry(0.15, 0.025, 0.015),
    stopper: new THREE.CylinderGeometry(0.02, 0.02, 0.05, 14),
  };
})();

// ─── HIGH-SPECULAR METALLIC CHROME & GOLD MATERIALS ──────────────────────────
const MATERIALS = {
  chrome: new THREE.MeshStandardMaterial({
    color: CONFIG.colors.chrome,
    metalness: CONFIG.materials.metalness,
    roughness: CONFIG.materials.roughness,
    envMapIntensity: CONFIG.materials.envMapIntensity,
  }),
  gold: new THREE.MeshStandardMaterial({
    color: CONFIG.colors.gold,
    metalness: 0.9,
    roughness: 0.2,
    envMapIntensity: 2.4,
  }),
  bronze: new THREE.MeshStandardMaterial({
    color: CONFIG.colors.bronze,
    metalness: 0.88,
    roughness: 0.25,
    envMapIntensity: 1.8,
  }),
  dark: new THREE.MeshStandardMaterial({
    color: CONFIG.colors.dark,
    metalness: 0.3,
    roughness: 0.7,
  }),
};

// ─── REALISTIC CHROME SCISSOR MODEL WITH GOLD RIVET SCREW ──────────────────
function Scissor3DModel({ bladeAngle }) {
  return (
    <group scale={1.15}>
      {/* Pivot Center Pin Screw — Gold/Brass Accent Detail */}
      <mesh geometry={GEOMETRIES.pivotBody} material={MATERIALS.gold} rotation={[Math.PI / 2, 0, 0]} castShadow />
      <mesh geometry={GEOMETRIES.pivotFace} material={MATERIALS.gold} position={[0, 0, 0.058]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={GEOMETRIES.grooveBox} material={MATERIALS.dark} position={[0, 0, 0.068]} />

      {/* Left Blade & Handle — Polished Steel Chrome */}
      <group rotation={[0, 0, bladeAngle]}>
        <mesh geometry={GEOMETRIES.blade} material={MATERIALS.chrome} position={[0, 0, 0.01]} castShadow receiveShadow />
        <mesh geometry={GEOMETRIES.shaft} material={MATERIALS.chrome} position={[-0.03, -0.44, -0.01]} rotation={[0, 0, 0.12]} castShadow />
        <mesh geometry={GEOMETRIES.ringL} material={MATERIALS.chrome} position={[-0.16, -0.98, -0.01]} castShadow />
        <mesh geometry={GEOMETRIES.stopper} material={MATERIALS.dark} position={[0.05, -0.28, 0.01]} rotation={[Math.PI / 2, 0, 0]} />
      </group>

      {/* Right Blade & Handle — Polished Steel Chrome (Mirrored) */}
      <group rotation={[0, 0, -bladeAngle]} scale={[-1, 1, 1]}>
        <mesh geometry={GEOMETRIES.blade} material={MATERIALS.chrome} position={[0, 0, -0.035]} castShadow receiveShadow />
        <mesh geometry={GEOMETRIES.shaft} material={MATERIALS.chrome} position={[-0.03, -0.44, 0.01]} rotation={[0, 0, 0.12]} castShadow />
        <mesh geometry={GEOMETRIES.ringR} material={MATERIALS.chrome} position={[-0.16, -0.98, 0.01]} castShadow />
      </group>
    </group>
  );
}

// ─── SCISSOR CONTROLLER WITH 60FPS SCROLL ANIMATION ─────────────────────────
function ScissorController({ scrollProgress, isMobile, setSnipPhase }) {
  const modelRef = useRef();
  const timeRef = useRef(0);
  const [bladeAngle, setBladeAngle] = useState(0.05);

  useFrame((_, delta) => {
    if (!modelRef.current) return;

    timeRef.current += delta * CONFIG.motion.idleFloatSpeed;
    const p = Math.max(0, Math.min(1, scrollProgress.current));

    // 1. Idle Float Micro Motion (Subtle breathing)
    const floatY = Math.sin(timeRef.current * 1.5) * CONFIG.motion.idleFloatAmplitude;
    const floatRotZ = Math.cos(timeRef.current * 1.2) * 0.05;

    // 2. Scroll Animation Phases:
    // Phase 1 (0% -> 40%): Drift + Rotate + Scale Up (1x -> 1.15x)
    // Phase 2 (40% -> 70%): Dramatic SNIP Moment (Blade Open-Close + Hair Falling)
    // Phase 3 (70% -> 100%): Rotate Away & Fade Out

    let targetRotY = 0;
    let targetRotX = 0;
    let targetRotZ = floatRotZ;
    let targetScale = 1.0;
    let targetY = floatY;
    let targetX = 0;
    let currentBladeAngle = 0;

    if (p <= 0.4) {
      const progress1 = p / 0.4;
      targetRotY = progress1 * 0.75;
      targetRotX = progress1 * 0.35;
      targetRotZ = floatRotZ - progress1 * 0.4;
      targetScale = 1.0 + progress1 * 0.15;
      targetX = progress1 * 0.35;
      targetY = floatY - progress1 * 0.2;
      setSnipPhase(0);
    } else if (p <= 0.7) {
      const progress2 = (p - 0.4) / 0.3;
      targetRotY = 0.75 + progress2 * 0.25;
      targetRotX = 0.35;
      targetRotZ = -0.4 + progress2 * 0.2;
      targetScale = 1.15;
      targetX = 0.35 - progress2 * 0.15;
      targetY = floatY - 0.2;
      setSnipPhase(progress2);

      // "SNIP" Blade Motion (Open -> Close -> Open slightly)
      if (progress2 < 0.5) {
        currentBladeAngle = (progress2 / 0.5) * CONFIG.motion.snipMaxAngle;
      } else {
        currentBladeAngle = (1 - (progress2 - 0.5) / 0.5) * CONFIG.motion.snipMaxAngle;
      }
    } else {
      const progress3 = (p - 0.7) / 0.3;
      targetRotY = 1.0 + progress3 * 0.8;
      targetRotX = 0.35 + progress3 * 0.5;
      targetRotZ = -0.2 - progress3 * 0.6;
      targetScale = 1.15 * (1 - progress3 * 0.5);
      targetX = 0.2 - progress3 * 0.6;
      targetY = floatY - 0.2 - progress3 * 0.8;
      currentBladeAngle = 0;
      setSnipPhase(1);
    }

    // Apply smooth lerped transforms
    const m = modelRef.current;
    const lerpSpeed = delta * 6;

    m.rotation.y = THREE.MathUtils.lerp(m.rotation.y, targetRotY, lerpSpeed);
    m.rotation.x = THREE.MathUtils.lerp(m.rotation.x, targetRotX, lerpSpeed);
    m.rotation.z = THREE.MathUtils.lerp(m.rotation.z, targetRotZ, lerpSpeed);
    m.position.x = THREE.MathUtils.lerp(m.position.x, targetX, lerpSpeed);
    m.position.y = THREE.MathUtils.lerp(m.position.y, targetY, lerpSpeed);
    m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x, isMobile ? targetScale * 0.75 : targetScale, lerpSpeed));

    setBladeAngle(currentBladeAngle);
  });

  return (
    <group ref={modelRef}>
      <Scissor3DModel bladeAngle={bladeAngle} />
    </group>
  );
}

// ─── DYNAMIC HAIR-CLIPPING PARTICLES OVERLAY ─────────────────────────────────
function HairStrandsOverlay({ snipPhase, isMobile }) {
  const strandCount = isMobile ? CONFIG.particles.countMobile : CONFIG.particles.countDesktop;

  const strands = useMemo(() => {
    return Array.from({ length: strandCount }).map((_, i) => {
      const angle = (i / strandCount) * Math.PI * 2 + (Math.random() - 0.5);
      const radius = 20 + Math.random() * 40;
      const initialX = Math.cos(angle) * radius;
      const initialY = Math.sin(angle) * radius - 10;
      const fallDistance = 60 + Math.random() * 80;
      const rotation = (Math.random() - 0.5) * 60;
      const curvature = (Math.random() - 0.5) * 30;

      return {
        id: i,
        initialX,
        initialY,
        fallDistance,
        rotation,
        curvature,
        width: 12 + Math.random() * 16,
        height: 25 + Math.random() * 30,
      };
    });
  }, [strandCount]);

  if (snipPhase <= 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
      {strands.map((s) => {
        const fallY = s.initialY + snipPhase * s.fallDistance;
        const driftX = s.initialX + Math.sin(snipPhase * Math.PI + s.id) * 15;
        const rot = s.rotation + snipPhase * 45;
        const opacity = snipPhase < 0.2 ? snipPhase / 0.2 : 1 - (snipPhase - 0.2) / 0.8;

        return (
          <svg
            key={s.id}
            style={{
              transform: `translate3d(${driftX}px, ${fallY}px, 0) rotate(${rot}deg)`,
              opacity: Math.max(0, opacity),
            }}
            className="absolute top-1/2 left-1/2 w-8 h-8 pointer-events-none will-change-transform transition-opacity duration-150"
            viewBox="0 0 40 40"
          >
            <path
              d={`M 10 5 Q ${20 + s.curvature} 20 30 35`}
              fill="none"
              stroke={CONFIG.colors.hairStrand}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        );
      })}
    </div>
  );
}

// ─── MAIN SCISSOR SCENE COMPONENT (Dynamic Client Only) ───────────────────────
export default function HeroScissorScene({ heroTargetRef }) {
  const scrollProgress = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [snipPhase, setSnipPhase] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    checkMobile();

    window.addEventListener('resize', checkMobile, { passive: true });

    // Bind GSAP ScrollTrigger to Hero section
    const ctx = gsap.context(() => {
      if (heroTargetRef && heroTargetRef.current) {
        ScrollTrigger.create({
          trigger: heroTargetRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
          onUpdate: (self) => {
            scrollProgress.current = self.progress;
          },
        });
      }
    });

    return () => {
      window.removeEventListener('resize', checkMobile);
      ctx.revert();
    };
  }, [heroTargetRef]);

  // Reduced motion accessible fallback
  if (prefersReducedMotion) {
    return (
      <div className="w-full h-full flex items-center justify-center opacity-80">
        <svg viewBox="0 0 100 100" className="w-32 h-32 text-champagne drop-shadow-md">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-full h-full pointer-events-none select-none relative [perspective:1200px]">
      
      {/* 1. Floating Drop Shadow Layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-48 h-12 bg-black/25 rounded-full blur-xl transform translate-y-16 scale-90 will-change-transform" />
      </div>

      {/* 2. Hair Strand Particles Falling Overlay */}
      <HairStrandsOverlay snipPhase={snipPhase} isMobile={isMobile} />

      {/* 3. 3D R3F Canvas Layer with Polished Metallic Steel Chrome Scissor */}
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: isMobile ? 52 : 44 }}
        dpr={[1, isMobile ? 1.2 : 2]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        {/* Studio Lighting Setup for Chrome Steel Reflections */}
        <ambientLight intensity={0.65} color={CONFIG.colors.warmLight} />
        <directionalLight position={[5, 8, 5]} intensity={3.4} color="#FFFFFF" castShadow />
        <directionalLight position={[-5, 3, -3]} intensity={1.8} color="#E2E8F0" />
        <spotLight position={[0, 9, 7]} intensity={2.8} color={CONFIG.colors.gold} angle={0.45} penumbra={0.8} />

        <Environment preset="studio" />
        <ContactShadows position={[0, -1.35, 0]} opacity={0.45} scale={4.5} blur={1.8} far={3.5} />

        <Suspense fallback={null}>
          <ScissorController scrollProgress={scrollProgress} isMobile={isMobile} setSnipPhase={setSnipPhase} />
        </Suspense>
      </Canvas>
    </div>
  );
}
