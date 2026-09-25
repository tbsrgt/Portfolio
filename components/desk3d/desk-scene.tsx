"use client";

import { RigidBodyType } from "@dimforge/rapier3d-compat";
import { Html, Text, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  CylinderCollider,
  Physics,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";

import { SheetContent } from "./sheet-content";
import { deskCopy } from "@/lib/desk-copy";
import { useLanguage, type Locale } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/* Palette and fonts                                                   */
/* ------------------------------------------------------------------ */

const COLORS = {
  desk: "#1e4b3e",
  deskEdge: "#2b1a0f",
  paper: "#f5f0e6",
  postit: "#ffe45c",
  kraft: "#c9a06b",
  ink: "#171412",
  pen: "#1b3ed6",
  stamp: "#d8321f",
  cream: "#f3ede2",
  coffee: "#3b2314",
  wood: "#8a5a2b",
  metal: "#2b2b2b",
} as const;

const FONT_HAND = "/fonts/Caveat.ttf";
const FONT_DISPLAY = "/fonts/Bricolage.ttf";

const DESK = { w: 30, d: 22 };
const DRAG_HEIGHT = 1.1;

/* ------------------------------------------------------------------ */
/* Grab & throw                                                        */
/* ------------------------------------------------------------------ */

type GrabbableProps = {
  children: ReactNode;
  position: [number, number, number];
  rotation?: [number, number, number] | undefined;
  colliders?: "cuboid" | "ball" | "hull" | false;
  onOpen?: () => void;
  label?: string;
  throwBoost?: number;
  mass?: number;
  ballRadius?: number;
};

/**
 * A physics body you can pick up, drag on a plane above the desk and throw.
 * A press without movement counts as a click and opens something.
 */
function Grabbable({ children, position, rotation = [0, 0, 0], colliders = "cuboid", onOpen, label, throwBoost = 1, mass = 1, ballRadius }: GrabbableProps): ReactNode {
  const body = useRef<RapierRigidBody>(null);
  const { raycaster, gl } = useThree();
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -DRAG_HEIGHT), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const prev = useMemo(() => new THREE.Vector3(), []);
  const velocity = useMemo(() => new THREE.Vector3(), []);
  const dragging = useRef(false);
  const moved = useRef(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    gl.domElement.style.cursor = hover ? "grab" : "";
    return () => {
      gl.domElement.style.cursor = "";
    };
  }, [hover, gl]);

  const down = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const rb = body.current;
    if (!rb) return;
    (event.target as Element).setPointerCapture?.(event.pointerId);
    dragging.current = true;
    moved.current = 0;
    rb.setBodyType(RigidBodyType.KinematicPositionBased, true);
    const t = rb.translation();
    prev.set(t.x, t.y, t.z);
    velocity.set(0, 0, 0);
    gl.domElement.style.cursor = "grabbing";
  }, [gl, prev, velocity]);

  const up = useCallback((event: ThreeEvent<PointerEvent>) => {
    const rb = body.current;
    if (!rb || !dragging.current) return;
    dragging.current = false;
    (event.target as Element).releasePointerCapture?.(event.pointerId);
    rb.setBodyType(RigidBodyType.Dynamic, true);
    const speed = velocity.length();
    rb.setLinvel({ x: velocity.x * throwBoost, y: Math.min(7, speed * 0.35 * throwBoost) + 0.5, z: velocity.z * throwBoost }, true);
    rb.setAngvel({ x: velocity.z * 0.4, y: 0, z: -velocity.x * 0.4 }, true);
    gl.domElement.style.cursor = "grab";
    if (moved.current < 0.15 && onOpen) onOpen();
  }, [gl, onOpen, throwBoost, velocity]);

  useFrame((_, delta) => {
    const rb = body.current;
    if (!rb || !dragging.current) return;
    if (!raycaster.ray.intersectPlane(plane, target)) return;
    // Keep the object on the table while dragging.
    target.x = THREE.MathUtils.clamp(target.x, -DESK.w / 2 + 1, DESK.w / 2 - 1);
    target.z = THREE.MathUtils.clamp(target.z, -DESK.d / 2 + 1, DESK.d / 2 - 1);
    target.y = DRAG_HEIGHT;
    const dt = Math.max(delta, 1 / 120);
    velocity.set((target.x - prev.x) / dt, 0, (target.z - prev.z) / dt).multiplyScalar(0.6);
    moved.current += prev.distanceTo(target);
    prev.copy(target);
    rb.setNextKinematicTranslation(target);
  });

  return (
    <RigidBody ref={body} position={position} rotation={rotation} colliders={ballRadius ? false : colliders} mass={mass} linearDamping={0.6} angularDamping={0.9} friction={0.9} restitution={0.15}>
      {ballRadius ? <BallCollider args={[ballRadius]} /> : null}
      <group
        onPointerDown={down}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        // eslint-disable-next-line react/no-unknown-property
        userData={{ label }}
      >
        {children}
      </group>
    </RigidBody>
  );
}

/* ------------------------------------------------------------------ */
/* Objects                                                             */
/* ------------------------------------------------------------------ */

function Desk(): ReactNode {
  return (
    <RigidBody type="fixed" colliders={false}>
      {/* Blotter top */}
      <mesh receiveShadow position={[0, -0.15, 0]}>
        <boxGeometry args={[DESK.w, 0.3, DESK.d]} />
        <meshStandardMaterial color={COLORS.desk} roughness={0.95} />
      </mesh>
      {/* Wooden edge under the blotter */}
      <mesh receiveShadow position={[0, -0.55, 0]}>
        <boxGeometry args={[DESK.w + 1.2, 0.5, DESK.d + 1.2]} />
        <meshStandardMaterial color={COLORS.deskEdge} roughness={0.8} />
      </mesh>
      <CuboidCollider args={[DESK.w / 2 + 1, 0.15, DESK.d / 2 + 1]} position={[0, -0.15, 0]} />
      {/* Invisible walls so nothing falls off the table */}
      <CuboidCollider args={[DESK.w / 2 + 1, 4, 0.2]} position={[0, 4, -DESK.d / 2 - 0.8]} />
      <CuboidCollider args={[DESK.w / 2 + 1, 4, 0.2]} position={[0, 4, DESK.d / 2 + 0.8]} />
      <CuboidCollider args={[0.2, 4, DESK.d / 2 + 1]} position={[-DESK.w / 2 - 0.8, 4, 0]} />
      <CuboidCollider args={[0.2, 4, DESK.d / 2 + 1]} position={[DESK.w / 2 + 0.8, 4, 0]} />
    </RigidBody>
  );
}

function Lamp(): ReactNode {
  const light = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  useEffect(() => {
    if (!light.current) return;
    targetRef.current.position.set(-1, 0, 0.5);
    light.current.target = targetRef.current;
  }, []);
  return (
    <group position={[-9, 0, -5]}>
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.9, 1, 0.3, 32]} />
        <meshStandardMaterial color={COLORS.metal} roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh castShadow position={[0.8, 2.2, 0.6]} rotation={[0.35, 0, -0.45]}>
        <cylinderGeometry args={[0.07, 0.07, 4.4, 12]} />
        <meshStandardMaterial color={COLORS.metal} roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh castShadow position={[1.9, 4.2, 1.3]} rotation={[0.9, 0.2, -0.9]}>
        <coneGeometry args={[1.1, 1.4, 32, 1, true]} />
        <meshStandardMaterial color={COLORS.stamp} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[2.15, 3.9, 1.65]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#fff2c4" emissive="#ffd68a" emissiveIntensity={2} />
      </mesh>
      <spotLight ref={light} position={[2.1, 4, 1.6]} angle={0.9} penumbra={0.6} intensity={260} distance={30} color="#fff1cf" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} />
      <primitive object={targetRef.current} />
    </group>
  );
}

function PaperBox({ w, d, h = 0.05, color = COLORS.paper }: { w: number; d: number; h?: number; color?: string }): ReactNode {
  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  );
}

function TopText({ text, font = FONT_HAND, size = 0.42, color = COLORS.ink, y = 0.035, maxWidth = 1.5, anchorX = "center", position = [0, 0, 0] }: { text: string; font?: string; size?: number; color?: string; y?: number; maxWidth?: number; anchorX?: "left" | "center"; position?: [number, number, number] }): ReactNode {
  return (
    <Text font={font} fontSize={size} color={color} maxWidth={maxWidth} anchorX={anchorX} anchorY="middle" lineHeight={1.05} position={[position[0], y, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      {text}
    </Text>
  );
}

function MainSheet({ locale }: { locale: Locale }): ReactNode {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[-2.4, 0.03, 0.6]} rotation={[0, 0.03, 0]}>
      <PaperBox w={6.5} d={5.2} h={0.06} />
      <Html transform occlude={false} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.385} zIndexRange={[20, 0]} style={{ pointerEvents: "auto" }}>
        <SheetContent locale={locale} />
      </Html>
    </RigidBody>
  );
}

function PostIt({ text, position, rotation, size = 1.7 }: { text: string; position: [number, number, number]; rotation?: [number, number, number] | undefined; size?: number }): ReactNode {
  return (
    <Grabbable position={position} rotation={rotation} mass={0.2}>
      <PaperBox w={size} d={size} h={0.04} color={COLORS.postit} />
      <TopText text={text} size={0.3} maxWidth={size - 0.25} />
    </Grabbable>
  );
}

function Phone({ onOpen, label, note }: { onOpen: () => void; label: string; note: string }): ReactNode {
  return (
    <Grabbable position={[6.8, 0.3, -1.8]} rotation={[0, -0.35, 0]} onOpen={onOpen} label={label} mass={0.6}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.25, 0.16, 2.5]} />
        <meshStandardMaterial color={COLORS.ink} roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.08, 2.3]} />
        <meshStandardMaterial color="#1c1a17" emissive="#3a2f14" emissiveIntensity={0.8} roughness={0.2} />
      </mesh>
      <TopText text="☎" font={FONT_DISPLAY} size={0.55} color={COLORS.postit} y={0.1} position={[0, 0, -0.45]} />
      <TopText text={label} font={FONT_DISPLAY} size={0.2} color={COLORS.paper} y={0.1} maxWidth={1.05} position={[0, 0, 0.15]} />
      <TopText text={note} font={FONT_DISPLAY} size={0.11} color="#a39d92" y={0.1} maxWidth={1.05} position={[0, 0, 0.5]} />
    </Grabbable>
  );
}

function Folder({ onOpen, label, note }: { onOpen: () => void; label: string; note: string }): ReactNode {
  const [cover1, cover2] = useTexture(["/projects/adresse-privee-cover.webp", "/projects/cogedoc-cover.webp"]);
  return (
    <Grabbable position={[2.6, 0.3, 3.6]} rotation={[0, 0.18, 0]} onOpen={onOpen} label={label} mass={0.8}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.22, 2.5]} />
        <meshStandardMaterial color={COLORS.kraft} roughness={1} />
      </mesh>
      {/* Tab */}
      <mesh castShadow position={[-0.9, 0, -1.4]}>
        <boxGeometry args={[1.4, 0.2, 0.35]} />
        <meshStandardMaterial color={COLORS.kraft} roughness={1} />
      </mesh>
      <TopText text={label.toUpperCase()} font={FONT_DISPLAY} size={0.14} y={0.11} maxWidth={1.4} position={[-0.9, 0, -1.4]} />
      {/* Prints sticking out */}
      <mesh castShadow position={[-0.5, 0.13, 0.1]} rotation={[-Math.PI / 2, 0, 0.12]}>
        <planeGeometry args={[1.9, 1.2]} />
        <meshStandardMaterial map={cover1 ?? null} roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0.7, 0.15, -0.2]} rotation={[-Math.PI / 2, 0, -0.1]}>
        <planeGeometry args={[1.9, 1.2]} />
        <meshStandardMaterial map={cover2 ?? null} roughness={0.9} />
      </mesh>
      <TopText text={`${note} →`} size={0.3} color={COLORS.pen} y={0.12} maxWidth={2} position={[0, 0, 0.95]} />
    </Grabbable>
  );
}

function QuoteSlip({ onOpen, label, line, price, badge }: { onOpen: () => void; label: string; line: string; price: string; badge: string }): ReactNode {
  return (
    <Grabbable position={[4.8, 0.3, -3.6]} rotation={[0, 0.12, 0]} onOpen={onOpen} label={label} mass={0.2}>
      <PaperBox w={2.6} d={1.8} h={0.04} />
      <TopText text={label.toUpperCase()} font={FONT_DISPLAY} size={0.13} color="#6b645a" y={0.03} maxWidth={2.3} anchorX="left" position={[-1.15, 0, -0.62]} />
      <TopText text={line} font={FONT_DISPLAY} size={0.2} y={0.03} maxWidth={1.4} anchorX="left" position={[-1.15, 0, -0.2]} />
      <TopText text={price} font={FONT_DISPLAY} size={0.18} y={0.03} maxWidth={1.2} anchorX="left" position={[0.2, 0, -0.2]} />
      <TopText text={badge.toUpperCase()} font={FONT_DISPLAY} size={0.16} color={COLORS.stamp} y={0.03} maxWidth={2.3} anchorX="left" position={[-1.05, 0, 0.45]} />
    </Grabbable>
  );
}

function Mug(): ReactNode {
  return (
    <Grabbable position={[-6.6, 0.5, 3.4]} colliders="hull" mass={1.5}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.42, 0.95, 32]} />
        <meshStandardMaterial color={COLORS.cream} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.06, 32]} />
        <meshStandardMaterial color={COLORS.coffee} roughness={0.3} />
      </mesh>
      <mesh castShadow position={[0.62, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.07, 12, 24, Math.PI]} />
        <meshStandardMaterial color={COLORS.cream} roughness={0.5} />
      </mesh>
    </Grabbable>
  );
}

function Stamp(): ReactNode {
  return (
    <Grabbable position={[0.4, 0.5, -3.8]} rotation={[0, 0.5, 0]} colliders="hull" mass={0.7}>
      <mesh castShadow receiveShadow position={[0, -0.25, 0]}>
        <boxGeometry args={[1.3, 0.25, 0.8]} />
        <meshStandardMaterial color={COLORS.stamp} roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.2, 0.32, 0.75, 20]} />
        <meshStandardMaterial color={COLORS.wood} roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color={COLORS.wood} roughness={0.7} />
      </mesh>
    </Grabbable>
  );
}

function Pen(): ReactNode {
  return (
    <Grabbable position={[2.2, 0.3, 1.2]} rotation={[0, 0.9, 0]} colliders="hull" mass={0.15}>
      <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 2.7, 16]} />
        <meshStandardMaterial color={COLORS.pen} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.09, 0.3, 16]} />
        <meshStandardMaterial color="#d9c6a3" roughness={0.6} />
      </mesh>
    </Grabbable>
  );
}

/* Wastepaper basket: fixed ring of thin walls + a sensor at the bottom. */
function Bin({ onScore }: { onScore: () => void }): ReactNode {
  const walls = useMemo(() => Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2), []);
  const radius = 1.05;
  return (
    <group position={[6.9, 0, 2.4]}>
      <RigidBody type="fixed" colliders={false}>
        {walls.map((angle) => (
          <CuboidCollider key={angle} args={[0.3, 0.9, 0.05]} position={[Math.cos(angle) * radius, 0.9, Math.sin(angle) * radius]} rotation={[0, -angle + Math.PI / 2, 0]} />
        ))}
        <CylinderCollider args={[0.05, radius]} position={[0, 0.05, 0]} />
        <CylinderCollider args={[0.25, radius - 0.2]} position={[0, 0.35, 0]} sensor onIntersectionEnter={onScore} />
      </RigidBody>
      <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
        <cylinderGeometry args={[radius + 0.05, radius - 0.1, 1.8, 24, 1, true]} />
        <meshStandardMaterial color={COLORS.metal} roughness={0.45} metalness={0.6} side={THREE.DoubleSide} wireframe />
      </mesh>
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[radius - 0.1, radius - 0.1, 0.04, 24]} />
        <meshStandardMaterial color={COLORS.metal} roughness={0.5} metalness={0.6} />
      </mesh>
    </group>
  );
}

function PaperBall({ seed, onRest }: { seed: number; onRest?: () => void }): ReactNode {
  const geometry = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(0.36, 1);
    const pos = g.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i += 1) {
      const key = Math.round(pos.getX(i) * 50) * 7 + Math.round(pos.getY(i) * 50) * 131 + Math.round(pos.getZ(i) * 50) * 1013;
      const n = 0.86 + Math.abs(Math.sin(key * 12.9898 + seed) * 43758.5453 % 1) * 0.3;
      pos.setXYZ(i, pos.getX(i) * n, pos.getY(i) * n, pos.getZ(i) * n);
    }
    g.computeVertexNormals();
    return g;
  }, [seed]);
  void onRest;
  return (
    <Grabbable position={[-5.5 + (seed % 3) * 0.8, 1.5, 4.6]} ballRadius={0.36} throwBoost={1.7} mass={0.1}>
      <mesh castShadow receiveShadow geometry={geometry}>
        <meshStandardMaterial color={COLORS.paper} roughness={1} flatShading />
      </mesh>
    </Grabbable>
  );
}

/* ------------------------------------------------------------------ */
/* Camera                                                              */
/* ------------------------------------------------------------------ */

function CameraRig(): ReactNode {
  const { camera, size, pointer } = useThree();
  const look = useMemo(() => new THREE.Vector3(0, 0.4, 0.6), []);
  const lookPortrait = useMemo(() => new THREE.Vector3(-2.2, 0.3, 0.9), []);
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const portrait = size.width < size.height;
    cam.fov = portrait ? 68 : size.width < 1024 ? 44 : 34;
    cam.updateProjectionMatrix();
  }, [camera, size]);
  useFrame(() => {
    const portrait = size.width < size.height;
    const base = portrait ? new THREE.Vector3(-2.2, 9.8, 5.6) : new THREE.Vector3(0.5, 11.5, 9.5);
    camera.position.x += (base.x + pointer.x * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (base.y - pointer.y * 0.3 - camera.position.y) * 0.04;
    camera.position.z += (base.z - camera.position.z) * 0.04;
    camera.lookAt(portrait ? lookPortrait : look);
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

export function DeskScene({ onReady, onScore }: { onReady: () => void; onScore: () => void }): ReactNode {
  const { locale } = useLanguage();
  const copy = deskCopy[locale];
  const router = useRouter();
  const [ballSeed, setBallSeed] = useState(1);

  const goTo = useCallback((href: string) => () => {
    if (href.startsWith("#")) document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    else router.push(href);
  }, [router]);

  const score = useCallback(() => {
    onScore();
    window.setTimeout(() => setBallSeed((s) => s + 1), 900);
  }, [onScore]);

  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.5, 11.5, 9.5], fov: 34, near: 0.5, far: 80 }} gl={{ antialias: true, powerPreference: "high-performance" }} onCreated={onReady} style={{ touchAction: "none" }}>
      <color attach="background" args={["#12332a"]} />
      <fog attach="fog" args={["#12332a", 22, 40]} />
      <hemisphereLight args={["#e8f0e6", "#0d1f19", 0.55]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 12, 6]} intensity={0.6} castShadow shadow-mapSize={[1024, 1024]} />
      <CameraRig />
      <Physics gravity={[0, -14, 0]}>
        <Desk />
        <Lamp />
        <MainSheet locale={locale} />
        <PostIt text={copy.postitAvailable} position={[2.6, 0.3, -3.4]} rotation={[0, 0.2, 0]} />
        <PostIt text={copy.postitCoffee} position={[-8, 0.3, -1.4]} rotation={[0, -0.25, 0]} size={1.5} />
        <Phone onOpen={goTo("#contact")} label={copy.phoneLabel} note={copy.phoneNote} />
        <Folder onOpen={goTo("#realisations")} label={copy.folderLabel} note={copy.folderNote} />
        <QuoteSlip onOpen={goTo("#offres")} label={copy.quoteLabel} line={copy.quoteLine} price={copy.quotePrice} badge={locale === "fr" ? "Le plus demandé" : "Most popular"} />
        <Mug />
        <Stamp />
        <Pen />
        <Bin onScore={score} />
        <PaperBall key={ballSeed} seed={ballSeed} />
      </Physics>
    </Canvas>
  );
}
