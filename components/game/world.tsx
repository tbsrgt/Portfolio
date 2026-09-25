"use client";

import { Text, useTexture } from "@react-three/drei";
import { CuboidCollider, CylinderCollider, RigidBody, type CollisionPayload } from "@react-three/rapier";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";

import { Model, useModelFootprint } from "./models";
import { game } from "./store";
import type { MissionId } from "@/lib/game";

export const DESK = { w: 34, d: 24 };
export const FONT_DISPLAY = "/fonts/Bricolage.ttf";
export const FONT_HAND = "/fonts/Caveat.ttf";

const C = {
  paper: "#f5f0e6",
  postit: "#ffe45c",
  kraft: "#c9a06b",
  ink: "#171412",
  pen: "#1b3ed6",
  stamp: "#d8321f",
  metal: "#2b2b2b",
  cone: "#ff7a1a",
  pool: "#63c6e5",
  villa: "#f2ebdc",
} as const;

/** Leather blotter on a wooden desk top. */
export function Desk(): ReactNode {
  const [diff, nor, rough] = useTexture(["/textures/leather/diff.jpg", "/textures/leather/nor_gl.jpg", "/textures/leather/rough.jpg"]);
  const [wood, woodNor] = useTexture(["/textures/wood/Diffuse.jpg", "/textures/wood/nor_gl.jpg"]);
  useMemo(() => {
    for (const t of [diff, nor, rough]) {
      if (!t) continue;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(7, 5);
    }
    for (const t of [wood, woodNor]) {
      if (!t) continue;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(4, 3);
    }
    if (diff) diff.colorSpace = THREE.SRGBColorSpace;
    if (wood) wood.colorSpace = THREE.SRGBColorSpace;
  }, [diff, nor, rough, wood, woodNor]);

  return (
    <RigidBody type="fixed" colliders={false} friction={1}>
      <mesh receiveShadow position={[0, -0.1, 0]}>
        <boxGeometry args={[DESK.w, 0.2, DESK.d]} />
        <meshStandardMaterial color="#1f5a48" map={diff ?? null} normalMap={nor ?? null} normalScale={new THREE.Vector2(0.35, 0.35)} roughness={1} envMapIntensity={0.15} />
      </mesh>
      <mesh receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[DESK.w + 3, 0.6, DESK.d + 3]} />
        <meshStandardMaterial color="#8a5a2b" map={wood ?? null} normalMap={woodNor ?? null} roughness={0.75} />
      </mesh>
      <CuboidCollider args={[DESK.w / 2 + 1.5, 0.2, DESK.d / 2 + 1.5]} position={[0, -0.2, 0]} />
      <CuboidCollider args={[DESK.w / 2 + 2, 5, 0.3]} position={[0, 5, -DESK.d / 2 - 1.2]} />
      <CuboidCollider args={[DESK.w / 2 + 2, 5, 0.3]} position={[0, 5, DESK.d / 2 + 1.2]} />
      <CuboidCollider args={[0.3, 5, DESK.d / 2 + 2]} position={[-DESK.w / 2 - 1.2, 5, 0]} />
      <CuboidCollider args={[0.3, 5, DESK.d / 2 + 2]} position={[DESK.w / 2 + 1.2, 5, 0]} />
    </RigidBody>
  );
}

/** A real desk lamp model with the scene's key light in its head. */
export function Lamp(): ReactNode {
  const light = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  useEffect(() => {
    target.position.set(0, 0, 0);
    if (light.current) light.current.target = target;
  }, [target]);
  return (
    <group position={[-13, 0, -8.5]}>
      <RigidBody type="fixed" colliders={false}>
        <Model name="lamp" size={7} rotation={[0, 0.7, 0]} />
        <CylinderCollider args={[0.4, 2.4]} position={[0, 0.4, 0]} />
      </RigidBody>
      <spotLight ref={light} position={[3.2, 7.5, 2.6]} angle={0.95} penumbra={0.55} intensity={420} distance={45} color="#fff1cf" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} />
      <primitive object={target} />
    </group>
  );
}

function Prop({ name, size, position, rotation, collider }: { name: Parameters<typeof Model>[0]["name"]; size: number; position: [number, number, number]; rotation?: [number, number, number]; collider?: "box" | "cylinder" }): ReactNode {
  const [w, h, d] = useModelFootprint(name, size);
  return (
    <RigidBody type="fixed" colliders={false} position={position} rotation={rotation ?? [0, 0, 0]}>
      <Model name={name} size={size} />
      {collider === "cylinder" ? <CylinderCollider args={[h / 2, Math.max(w, d) / 2]} position={[0, h / 2, 0]} /> : <CuboidCollider args={[w / 2, h / 2, d / 2]} position={[0, h / 2, 0]} />}
    </RigidBody>
  );
}

/** Objects that were already on the desk: now real models, now obstacles. */
export function Props(): ReactNode {
  return (
    <>
      <Prop name="laptop" size={7} position={[9.5, 0, -8.5]} rotation={[0, -0.5, 0]} />
      <Prop name="plant" size={3.2} position={[14, 0, 8]} collider="cylinder" />
      <Prop name="mug" size={1.8} position={[-11, 0, 4]} collider="cylinder" />
      <Prop name="stapler" size={3} position={[-3, 0, -9.5]} rotation={[0, 0.4, 0]} />
      <Prop name="notebook" size={5} position={[2, 0, -9]} rotation={[0, -0.2, 0]} />
      <Prop name="tape" size={1.6} position={[12, 0, 2]} rotation={[0, 0.9, 0]} collider="cylinder" />
    </>
  );
}

/* ---------- Client models: cardboard maquettes with a delivery zone ---------- */

function useMissionSensor(id: MissionId) {
  return (payload: CollisionPayload): void => {
    const kind = (payload.other.rigidBodyObject?.userData as { kind?: string } | undefined)?.kind;
    if (kind === "van") game.complete(id);
  };
}

function Sign({ text, position, color = C.ink }: { text: string; position: [number, number, number]; color?: string }): ReactNode {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.6, 0]}>
        <boxGeometry args={[0.08, 1.2, 0.08]} />
        <meshStandardMaterial color={C.metal} />
      </mesh>
      <mesh castShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[2.6, 0.8, 0.08]} />
        <meshStandardMaterial color={C.paper} />
      </mesh>
      <Text font={FONT_DISPLAY} fontSize={0.34} color={color} anchorX="center" anchorY="middle" position={[0, 1.5, 0.05]} maxWidth={2.4}>
        {text}
      </Text>
    </group>
  );
}

function Zone({ id, position, radius = 2.4 }: { id: MissionId; position: [number, number, number]; radius?: number }): ReactNode {
  const onEnter = useMissionSensor(id);
  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      <CylinderCollider args={[0.6, radius]} position={[0, 0.6, 0]} sensor onIntersectionEnter={onEnter} />
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.18, radius, 48]} />
        <meshStandardMaterial color={C.postit} emissive={C.postit} emissiveIntensity={0.5} transparent opacity={0.8} />
      </mesh>
    </RigidBody>
  );
}

export function Racines(): ReactNode {
  return (
    <group position={[-10.5, 0, -1.5]}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
          <boxGeometry args={[4.2, 2.4, 3]} />
          <meshStandardMaterial color={C.kraft} roughness={1} />
        </mesh>
      </RigidBody>
      <mesh castShadow position={[0, 1.9, 1.9]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[4.4, 0.06, 1.4]} />
        <meshStandardMaterial color={C.stamp} roughness={1} />
      </mesh>
      <Text font={FONT_DISPLAY} fontSize={0.6} color={C.paper} anchorX="center" anchorY="middle" position={[0, 1.3, 1.52]} maxWidth={4}>
        RACINES
      </Text>
      <Sign text="Restaurant · pas de site" position={[3.1, 0, 2.6]} color={C.stamp} />
      <Zone id="racines" position={[0, 0, 4.2]} />
    </group>
  );
}

export function Cogebat(): ReactNode {
  return (
    <group position={[10.5, 0, -1.5]}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
          <boxGeometry args={[4.6, 1.8, 3.2]} />
          <meshStandardMaterial color="#d8d2c4" roughness={1} />
        </mesh>
      </RigidBody>
      {/* Crane */}
      <mesh castShadow position={[1.6, 3.2, -0.8]}>
        <boxGeometry args={[0.18, 6.4, 0.18]} />
        <meshStandardMaterial color={C.cone} />
      </mesh>
      <mesh castShadow position={[0.2, 6.3, -0.8]}>
        <boxGeometry args={[5, 0.16, 0.16]} />
        <meshStandardMaterial color={C.cone} />
      </mesh>
      {[-1.4, 1.4].map((x) => (
        <mesh key={x} castShadow position={[x, 0.45, 2.3]}>
          <coneGeometry args={[0.32, 0.9, 12]} />
          <meshStandardMaterial color={C.cone} />
        </mesh>
      ))}
      <Text font={FONT_DISPLAY} fontSize={0.55} color={C.ink} anchorX="center" anchorY="middle" position={[0, 1, 1.62]} maxWidth={4.4}>
        COGEBAT
      </Text>
      <Sign text="Chantier · devis sur Excel" position={[-3.2, 0, 2.6]} color={C.stamp} />
      <Zone id="cogebat" position={[0, 0, 4.4]} />
    </group>
  );
}

export function Adresse(): ReactNode {
  return (
    <group position={[8, 0, 7.5]}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
          <boxGeometry args={[4.4, 1.6, 2.6]} />
          <meshStandardMaterial color={C.villa} roughness={0.9} />
        </mesh>
      </RigidBody>
      <mesh position={[3.4, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 1.4]} />
        <meshStandardMaterial color={C.pool} roughness={0.2} metalness={0.1} />
      </mesh>
      <Text font={FONT_DISPLAY} fontSize={0.38} color={C.ink} anchorX="center" anchorY="middle" position={[0, 0.9, 1.32]} maxWidth={4}>
        ADRESSE PRIVÉE
      </Text>
      <Sign text="Agence · veut un espace client" position={[-3.2, 0, 2]} color={C.pen} />
      <Zone id="adresse" position={[0, 0, -3.6]} />
    </group>
  );
}

/** Wire wastepaper basket; the ball dropping in completes the basket mission. */
export function Bin(): ReactNode {
  const walls = useMemo(() => Array.from({ length: 14 }, (_, i) => (i / 14) * Math.PI * 2), []);
  const radius = 1.3;
  const onEnter = (payload: CollisionPayload): void => {
    const kind = (payload.other.rigidBodyObject?.userData as { kind?: string } | undefined)?.kind;
    if (kind === "ball") game.complete("basket");
  };
  return (
    <group position={[-6, 0, 8]}>
      <RigidBody type="fixed" colliders={false}>
        {walls.map((angle) => (
          <CuboidCollider key={angle} args={[0.32, 1.1, 0.05]} position={[Math.cos(angle) * radius, 1.1, Math.sin(angle) * radius]} rotation={[0, -angle + Math.PI / 2, 0]} />
        ))}
        <CylinderCollider args={[0.05, radius]} position={[0, 0.05, 0]} />
        <CylinderCollider args={[0.3, radius - 0.25]} position={[0, 0.4, 0]} sensor onIntersectionEnter={onEnter} />
      </RigidBody>
      <mesh castShadow position={[0, 1.1, 0]}>
        <cylinderGeometry args={[radius + 0.05, radius - 0.12, 2.2, 28, 1, true]} />
        <meshStandardMaterial color={C.metal} roughness={0.45} metalness={0.6} side={THREE.DoubleSide} wireframe />
      </mesh>
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[radius - 0.12, radius - 0.12, 0.04, 28]} />
        <meshStandardMaterial color={C.metal} roughness={0.5} metalness={0.6} />
      </mesh>
    </group>
  );
}

export function PaperBall({ seed }: { seed: number }): ReactNode {
  const geometry = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(0.45, 1);
    const pos = g.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i += 1) {
      const key = Math.round(pos.getX(i) * 50) * 7 + Math.round(pos.getY(i) * 50) * 131 + Math.round(pos.getZ(i) * 50) * 1013;
      const n = 0.86 + Math.abs((Math.sin(key * 12.9898 + seed) * 43758.5453) % 1) * 0.3;
      pos.setXYZ(i, pos.getX(i) * n, pos.getY(i) * n, pos.getZ(i) * n);
    }
    g.computeVertexNormals();
    return g;
  }, [seed]);
  return (
    <RigidBody colliders="ball" position={[-3, 1, 7]} mass={0.15} linearDamping={0.5} angularDamping={0.6} restitution={0.3} userData={{ kind: "ball" }}>
      <mesh castShadow receiveShadow geometry={geometry}>
        <meshStandardMaterial color={C.paper} roughness={1} flatShading />
      </mesh>
    </RigidBody>
  );
}

/** Sticky notes lying around as light obstacles you can push. */
export function PostIt({ text, position, rotation = 0 }: { text: string; position: [number, number, number]; rotation?: number }): ReactNode {
  return (
    <RigidBody colliders="cuboid" position={position} rotation={[0, rotation, 0]} mass={0.1} linearDamping={1.5} angularDamping={1.5}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 0.04, 2]} />
        <meshStandardMaterial color={C.postit} roughness={1} />
      </mesh>
      <Text font={FONT_HAND} fontSize={0.36} color={C.ink} anchorX="center" anchorY="middle" maxWidth={1.7} lineHeight={1.05} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {text}
      </Text>
    </RigidBody>
  );
}
