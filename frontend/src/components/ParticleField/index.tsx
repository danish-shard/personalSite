import { useRef, useMemo, useEffect, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Module-level refs (no React state — never triggers re-renders) ───────────
const mouseNDC = { x: 0, y: 0 };

// ─── Shaders ─────────────────────────────────────────────────────────────────

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uWarp;
  uniform float uActiveRatio;

  attribute float aOffset;
  attribute float aSize;
  attribute vec3  aColor;
  attribute float aIndex;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // Cull inactive particles during preloader ramp (WebGL1-compatible)
    if (aIndex > uActiveRatio) {
      gl_Position = vec4(9999.0, 9999.0, 9999.0, 1.0);
      gl_PointSize = 0.0;
      vAlpha = 0.0;
      vColor = vec3(0.0);
      return;
    }

    vec3 pos = position;

    // ── Ambient drift ──────────────────────────────────────────────────────
    float t = uTime * 0.25 + aOffset * 6.2832;
    pos.x += sin(t)              * 0.08;
    pos.y += cos(t * 0.7 + 1.1) * 0.06;
    pos.z += sin(t * 0.5 + 2.3) * 0.05;

    // ── Warp elongation ────────────────────────────────────────────────────
    // Particles stretch toward/away from camera on Z; XY compress slightly
    float warpStretch = 1.0 + uWarp * 10.0;
    float warpCompress = 1.0 - uWarp * 0.08;
    pos.z *= warpStretch;
    pos.xy *= warpCompress;

    // ── Final projection ───────────────────────────────────────────────────
    vec4 finalMVPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position     = projectionMatrix * finalMVPos;

    // ── Point size ─────────────────────────────────────────────────────────
    float depthFactor = 280.0 / length(finalMVPos.xyz);
    float warpSizeMult = 1.0 + uWarp * 1.5;
    gl_PointSize = clamp(aSize * depthFactor * warpSizeMult, 0.3, 7.0);

    // ── Varyings ───────────────────────────────────────────────────────────
    vColor = aColor;
    // Flicker + dim during warp
    float flicker = 0.45 + 0.3 * sin(uTime * 1.8 + aOffset * 12.566);
    vAlpha = flicker * (1.0 - uWarp * 0.35);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // Circular soft sprite
    vec2  uv   = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;

    // Gaussian glow: bright core, soft edge
    float alpha = exp(-dist * dist * 9.0) * vAlpha;
    gl_FragColor = vec4(vColor * alpha, alpha);
  }
`;

// ─── Color palette ────────────────────────────────────────────────────────────
const PALETTE = [
  new THREE.Color('#e8e4ff'), // 55% warm white-violet
  new THREE.Color('#00e5ff'), // 20% cyan
  new THREE.Color('#c8ff00'), // 10% chartreuse (brand)
  new THREE.Color('#9b6dff'), // 10% violet
  new THREE.Color('#ff6b9d'), // 5%  rose
];

function pickColor(): THREE.Color {
  const r = Math.random();
  if (r < 0.55) return PALETTE[0];
  if (r < 0.75) return PALETTE[1];
  if (r < 0.85) return PALETTE[2];
  if (r < 0.95) return PALETTE[3];
  return PALETTE[4];
}

// ─── Internal scene component ─────────────────────────────────────────────────
function ParticleScene() {
  const pointsRef = useRef<THREE.Points>(null);
  const warpRef    = useRef(0);
  const warpTarget = useRef(0);
  const activeRef  = useRef(0); // 0..1 ratio — tracks current uActiveRatio

  const prefersReduced = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
  const COUNT = prefersReduced ? 30_000 : 80_000;

  // ── Build geometry once ────────────────────────────────────────────────────
  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const offsets   = new Float32Array(COUNT);
    const sizes     = new Float32Array(COUNT);
    const colors    = new Float32Array(COUNT * 3);
    const indices   = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 4 + Math.random() * 14;

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.35; // flatten Y
      positions[i * 3 + 2] = r * Math.cos(phi);

      offsets[i]  = Math.random();
      sizes[i]    = 0.5 + Math.random() * 2.0;
      indices[i]  = i / COUNT; // normalized 0..1 — used for preloader ramp culling

      const c = pickColor();
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aOffset',  new THREE.BufferAttribute(offsets,   1));
    geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes,     1));
    geo.setAttribute('aColor',   new THREE.BufferAttribute(colors,    3));
    geo.setAttribute('aIndex',   new THREE.BufferAttribute(indices,   1));

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime:        { value: 0 },
        uMouse:       { value: new THREE.Vector2(0, 0) },
        uWarp:        { value: 0 },
        uActiveRatio: { value: 0 },
      },
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });

    return { geometry: geo, material: mat };
  }, [COUNT]);

  // ── Mouse listener ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseNDC.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // ── Scroll warp via ScrollTrigger ──────────────────────────────────────────
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (prefersReduced) return;
        const vel = Math.abs(self.getVelocity());
        warpTarget.current = Math.min(vel / 2500, 1.0);
      },
    });
    return () => st.kill();
  }, [prefersReduced]);

  // ── Particle ramp listener (from Preloader) ────────────────────────────────
  useEffect(() => {
    const onRamp = (e: Event) => {
      const { progress } = (e as CustomEvent).detail as { progress: number };
      activeRef.current = progress; // 0..1 ratio — matches uActiveRatio uniform
    };
    window.addEventListener('particle-ramp', onRamp);
    return () => window.removeEventListener('particle-ramp', onRamp);
  }, []);

  // ── Per-frame update ───────────────────────────────────────────────────────
  useFrame(({ clock }) => {
    const mat = material;

    // Spring warp
    warpRef.current    += (warpTarget.current - warpRef.current) * 0.08;
    warpTarget.current *= 0.92;

    mat.uniforms.uTime.value         = clock.elapsedTime;
    mat.uniforms.uMouse.value.set(mouseNDC.x, mouseNDC.y);
    mat.uniforms.uWarp.value         = warpRef.current;
    mat.uniforms.uActiveRatio.value  = activeRef.current;
  });

  // ── Cleanup ────────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

// ─── Public component (memo = never re-renders from outside) ──────────────────
const ParticleField = memo(function ParticleField() {
  return (
    <Canvas
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      camera={{ position: [0, 0, 7], fov: 60, near: 0.1, far: 100 }}
      gl={{ antialias: false, alpha: true }}
      dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)}
    >
      <ParticleScene />
    </Canvas>
  );
});

export default ParticleField;
