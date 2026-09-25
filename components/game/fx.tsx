"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, TiltShift2, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Shared signals: dust to emit, camera shake, wind                    */
/* ------------------------------------------------------------------ */

type Puff = { x: number; y: number; z: number; vx: number; vy: number; vz: number; size: number; life: number };
const queue: Puff[] = [];

/** Ask for dust puffs at a point (feet, wheels, impacts). */
export const dust = {
  emit(x: number, z: number, count = 1, opts: { speed?: number; size?: number; y?: number; dirX?: number; dirZ?: number } = {}): void {
    const { speed = 0.7, size = 0.3, y = 0.05, dirX = 0, dirZ = 0 } = opts;
    for (let i = 0; i < count; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const s = speed * (0.4 + Math.random() * 0.8);
      queue.push({
        x: x + (Math.random() - 0.5) * 0.3,
        y,
        z: z + (Math.random() - 0.5) * 0.3,
        vx: Math.cos(a) * s * 0.5 - dirX * s,
        vy: 0.5 + Math.random() * 0.8,
        vz: Math.sin(a) * s * 0.5 - dirZ * s,
        size: size * (0.7 + Math.random() * 0.8),
        life: 0.6 + Math.random() * 0.5,
      });
    }
  },
};

export const shake = { amount: 0, add(v: number) { shake.amount = Math.min(1.2, shake.amount + v); } };

/** Slowly turning wind with gusts, read by papers and streaks. */
export const wind = { x: 0, z: 0, gust: 0, t: 0, burst: 0 };

function softCircleTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,0.9)");
    g.addColorStop(0.4, "rgba(255,255,255,0.35)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/* ------------------------------------------------------------------ */
/* Dust puffs: one instanced billboard mesh, particles pooled          */
/* ------------------------------------------------------------------ */

const DUST_COUNT = 260;

export function Dust(): ReactNode {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();
  const texture = useMemo(softCircleTexture, []);
  const pool = useMemo<(Puff & { max: number })[]>(() => Array.from({ length: DUST_COUNT }, () => ({ x: 0, y: -10, z: 0, vx: 0, vy: 0, vz: 0, size: 0, life: 0, max: 1 })), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const next = useRef(0);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    while (queue.length) {
      const p = queue.pop();
      if (!p) break;
      const slot = pool[next.current];
      if (slot) Object.assign(slot, p, { max: p.life });
      next.current = (next.current + 1) % DUST_COUNT;
    }
    for (let i = 0; i < DUST_COUNT; i += 1) {
      const p = pool[i];
      if (!p) continue;
      if (p.life <= 0) {
        dummy.position.set(0, -10, 0);
        dummy.scale.setScalar(0.0001);
      } else {
        p.life -= delta;
        p.x += (p.vx + wind.x * 0.6) * delta;
        p.z += (p.vz + wind.z * 0.6) * delta;
        p.y += p.vy * delta;
        p.vy *= 0.94;
        p.vx *= 0.96;
        p.vz *= 0.96;
        const t = 1 - Math.max(0, p.life / p.max);
        dummy.position.set(p.x, p.y, p.z);
        dummy.quaternion.copy(camera.quaternion);
        dummy.scale.setScalar(p.size * (0.6 + t * 1.6) * (1 - t * t));
        color.setRGB(0.85, 0.8, 0.7).multiplyScalar(0.55 + 0.45 * (1 - t));
        m.setColorAt(i, color);
      }
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, DUST_COUNT]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={0.55} depthWrite={false} toneMapped={false} />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/* Motes drifting in the lamp light                                    */
/* ------------------------------------------------------------------ */

const MOTE_COUNT = 140;

export function Motes({ center = [-6, 3, -4], radius = 11 }: { center?: [number, number, number]; radius?: number }): ReactNode {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();
  const texture = useMemo(softCircleTexture, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(() => Array.from({ length: MOTE_COUNT }, () => ({ a: Math.random() * Math.PI * 2, r: Math.sqrt(Math.random()) * radius, y: Math.random() * 6, s: 0.5 + Math.random(), p: Math.random() * 100 })), [radius]);

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const t = clock.elapsedTime;
    for (let i = 0; i < MOTE_COUNT; i += 1) {
      const s = seeds[i];
      if (!s) continue;
      const drift = t * 0.08 * s.s;
      const x = center[0] + Math.cos(s.a + drift) * s.r + Math.sin(t * 0.5 + s.p) * 0.4 + wind.x * 0.8;
      const z = center[2] + Math.sin(s.a + drift) * s.r + Math.cos(t * 0.4 + s.p) * 0.4 + wind.z * 0.8;
      const y = 0.4 + ((s.y + t * 0.12 * s.s) % 6);
      dummy.position.set(x, y, z);
      dummy.quaternion.copy(camera.quaternion);
      dummy.scale.setScalar(0.06 + 0.05 * Math.sin(t * 2 + s.p));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, MOTE_COUNT]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} color="#fff3d0" transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/* Wind: slow rotation + gusts, drawn as faint streaks                 */
/* ------------------------------------------------------------------ */

const STREAK_COUNT = 26;

export function WindSystem({ area = [34, 24] }: { area?: [number, number] }): ReactNode {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const streaks = useMemo(() => Array.from({ length: STREAK_COUNT }, () => ({ x: (Math.random() - 0.5) * area[0], z: (Math.random() - 0.5) * area[1], y: 0.3 + Math.random() * 2.2, life: Math.random() })), [area]);

  useFrame((_, delta) => {
    wind.t += delta;
    const t = wind.t;
    const angle = t * 0.07 + Math.sin(t * 0.21) * 1.5;
    // Gusts every ~9 s, each lasting ~2.5 s.
    const cycle = t % 9;
    wind.burst = Math.max(0, wind.burst - delta * 1.6);
    const gust = Math.max(cycle < 2.5 ? Math.sin((cycle / 2.5) * Math.PI) : 0, wind.burst);
    wind.gust = gust;
    const strength = 0.25 + gust * 2.2;
    wind.x = Math.cos(angle) * strength;
    wind.z = Math.sin(angle) * strength;

    const m = mesh.current;
    if (!m) return;
    for (let i = 0; i < STREAK_COUNT; i += 1) {
      const s = streaks[i];
      if (!s) continue;
      s.x += wind.x * delta * 4;
      s.z += wind.z * delta * 4;
      s.life += delta * 0.6;
      if (Math.abs(s.x) > area[0] / 2 || Math.abs(s.z) > area[1] / 2 || s.life > 1) {
        s.x = (Math.random() - 0.5) * area[0];
        s.z = (Math.random() - 0.5) * area[1];
        s.life = 0;
      }
      dummy.position.set(s.x, s.y, s.z);
      dummy.rotation.set(-Math.PI / 2, 0, -angle);
      const vis = gust * Math.sin(s.life * Math.PI);
      dummy.scale.set(1.5 + gust * 3, 0.05, 1);
      dummy.scale.multiplyScalar(vis > 0.02 ? 1 : 0.0001);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, STREAK_COUNT]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#f5f0e6" transparent opacity={0.22} depthWrite={false} toneMapped={false} />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/* Post-processing (desktop only)                                      */
/* ------------------------------------------------------------------ */

export function Effects(): ReactNode {
  const { size } = useThree();
  if (size.width < 1024) return null;
  return (
    <EffectComposer multisampling={0}>
      <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.3} intensity={0.35} mipmapBlur />
      <TiltShift2 blur={0.12} taper={0.65} start={[0, 0.55]} end={[1, 0.55]} samples={6} />
      <Noise opacity={0.045} />
      <Vignette eskil={false} offset={0.2} darkness={0.55} />
    </EffectComposer>
  );
}

/* ------------------------------------------------------------------ */
/* Tyre marks left on the blotter                                      */
/* ------------------------------------------------------------------ */

type Mark = { x: number; z: number; angle: number; life: number };
const markQueue: Mark[] = [];
const SKID_COUNT = 420;

export const skid = {
  mark(x: number, z: number, angle: number): void {
    markQueue.push({ x, z, angle, life: 1 });
  },
};

export function Skids(): ReactNode {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const pool = useMemo<Mark[]>(() => Array.from({ length: SKID_COUNT }, () => ({ x: 0, z: 0, angle: 0, life: 0 })), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const next = useRef(0);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    while (markQueue.length) {
      const mk = markQueue.pop();
      if (!mk) break;
      const slot = pool[next.current];
      if (slot) Object.assign(slot, mk);
      next.current = (next.current + 1) % SKID_COUNT;
    }
    for (let i = 0; i < SKID_COUNT; i += 1) {
      const mk = pool[i];
      if (!mk) continue;
      if (mk.life <= 0) {
        dummy.scale.setScalar(0.0001);
        dummy.position.set(0, -10, 0);
      } else {
        mk.life -= delta * 0.045;
        dummy.position.set(mk.x, 0.012, mk.z);
        dummy.rotation.set(-Math.PI / 2, 0, -mk.angle);
        dummy.scale.set(0.18, 0.5, 1);
        color.setRGB(0.05, 0.05, 0.04);
        m.setColorAt(i, color);
      }
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, SKID_COUNT]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#111" transparent opacity={0.45} depthWrite={false} toneMapped={false} />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/* Loose sheets that take off in a gust and tumble across the desk     */
/* ------------------------------------------------------------------ */

const PAPER_COUNT = 7;

export function FlyingPapers({ area = [34, 24] }: { area?: [number, number] }): ReactNode {
  const group = useRef<THREE.Group>(null);
  const papers = useMemo(() => Array.from({ length: PAPER_COUNT }, (_, i) => ({ x: (Math.random() - 0.5) * area[0], z: (Math.random() - 0.5) * area[1], y: 0.03, phase: i * 1.3, air: 0, spin: Math.random() * Math.PI })), [area]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    papers.forEach((p, i) => {
      const mesh = g.children[i];
      if (!mesh) return;
      // A strong gust lifts a sheet; it drifts with the wind, tumbles, then settles.
      if (p.air <= 0 && wind.gust > 0.75 && Math.random() < delta * 0.9) p.air = 2.5 + Math.random() * 2;
      if (p.air > 0) {
        p.air -= delta;
        const lift = Math.min(1, p.air / 1.2);
        p.y += (0.9 + Math.sin(wind.t * 6 + p.phase) * 0.9) * delta * lift - (p.air < 1 ? delta * 1.2 : 0);
        p.y = Math.max(0.03, Math.min(3.2, p.y));
        p.x += wind.x * delta * 2.2;
        p.z += wind.z * delta * 2.2;
        p.spin += delta * (2 + wind.gust * 3);
        if (Math.abs(p.x) > area[0] / 2 - 1 || Math.abs(p.z) > area[1] / 2 - 1) {
          p.x = (Math.random() - 0.5) * area[0] * 0.8;
          p.z = (Math.random() - 0.5) * area[1] * 0.8;
          p.y = 0.03;
          p.air = 0;
        }
      } else if (p.y > 0.03) {
        p.y = Math.max(0.03, p.y - delta * 1.5);
      }
      mesh.position.set(p.x, p.y, p.z);
      const flying = p.y > 0.05;
      mesh.rotation.set(-Math.PI / 2 + (flying ? Math.sin(p.spin) * 0.9 : 0), flying ? Math.cos(p.spin * 0.7) * 0.6 : 0, p.spin * 0.3);
    });
  });

  return (
    <group ref={group}>
      {papers.map((p, i) => (
        <mesh key={i} castShadow position={[p.x, p.y, p.z]}>
          <planeGeometry args={[1.1, 1.5]} />
          <meshStandardMaterial color="#f5f0e6" roughness={1} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
