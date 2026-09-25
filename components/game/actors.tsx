"use client";

import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CuboidCollider, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";

import { audio } from "./audio";
import { dust, shake } from "./fx";
import { Model, useModelFootprint } from "./models";
import { game, input, readAxis, useGame } from "./store";
import { FONT_DISPLAY } from "./world";

const WALK_SPEED = 5.5;
const VAN_MAX = 13;
const ENTER_DISTANCE = 2.6;

/** Positions shared between actors and the camera, updated every frame. */
export const actors = {
  player: new THREE.Vector3(-1, 0.6, 5),
  van: new THREE.Vector3(3.5, 0.5, 6),
  vanHeading: 0,
};

/* ---------- The little figure ---------- */

export function Player(): ReactNode {
  const body = useRef<RapierRigidBody>(null);
  const visual = useRef<THREE.Group>(null);
  const { mode } = useGame();
  const heading = useRef(0);
  const actionHeld = useRef(false);
  const walkPhase = useRef(0);
  const lastStep = useRef(0);

  useFrame((_, delta) => {
    const rb = body.current;
    if (!rb) return;

    if (mode === "drive") {
      // Ride along inside the van, invisible.
      rb.setTranslation({ x: actors.van.x, y: actors.van.y + 0.3, z: actors.van.z }, false);
      rb.setLinvel({ x: 0, y: 0, z: 0 }, false);
      if (input.action && !actionHeld.current) {
        actionHeld.current = true;
        const side = new THREE.Vector3(Math.cos(actors.vanHeading), 0, -Math.sin(actors.vanHeading)).multiplyScalar(2.4);
        rb.setTranslation({ x: actors.van.x + side.x, y: 0.8, z: actors.van.z + side.z }, true);
        game.setMode("walk");
        audio.door();
      }
      if (!input.action) actionHeld.current = false;
      return;
    }

    const axis = readAxis();
    const moving = Math.hypot(axis.x, axis.y) > 0.1;
    if (moving) game.start();
    const v = rb.linvel();
    rb.setLinvel({ x: axis.x * WALK_SPEED, y: v.y, z: axis.y * WALK_SPEED }, true);
    if (moving) heading.current = Math.atan2(axis.x, axis.y);
    const t = rb.translation();
    actors.player.set(t.x, t.y, t.z);

    if (visual.current) {
      visual.current.rotation.y += (heading.current - visual.current.rotation.y) * 0.2;
      walkPhase.current += moving ? delta * 14 : 0;
      visual.current.position.y = moving ? Math.abs(Math.sin(walkPhase.current)) * 0.12 : 0;
      visual.current.rotation.x = moving ? 0.12 : 0;
      // One footstep per bob: a puff of dust and a soft tap.
      const step = Math.floor(walkPhase.current / Math.PI);
      if (moving && step !== lastStep.current) {
        lastStep.current = step;
        dust.emit(t.x, t.z, 2, { speed: 0.5, size: 0.22, dirX: axis.x * 0.4, dirZ: axis.y * 0.4 });
        audio.footstep();
      }
    }

    const near = actors.player.distanceTo(actors.van) < ENTER_DISTANCE;
    game.setNearVan(near);
    if (near && input.action && !actionHeld.current) {
      actionHeld.current = true;
      game.setMode("drive");
      audio.door();
    }
    if (!input.action) actionHeld.current = false;
  });

  return (
    <RigidBody ref={body} position={[-1, 0.8, 5]} colliders={false} enabledRotations={[false, false, false]} linearDamping={4} friction={0} userData={{ kind: "player" }}>
      <CuboidCollider args={[0.32, 0.55, 0.32]} />
      <group ref={visual} visible={mode === "walk"}>
        {/* body */}
        <mesh castShadow position={[0, -0.05, 0]}>
          <capsuleGeometry args={[0.3, 0.5, 6, 14]} />
          <meshStandardMaterial color="#171412" roughness={0.8} />
        </mesh>
        {/* head */}
        <mesh castShadow position={[0, 0.72, 0]}>
          <sphereGeometry args={[0.3, 20, 20]} />
          <meshStandardMaterial color="#f1c9a5" roughness={0.7} />
        </mesh>
        {/* cap */}
        <mesh castShadow position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.16, 20]} />
          <meshStandardMaterial color="#d8321f" roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, 0.84, 0.32]}>
          <boxGeometry args={[0.4, 0.05, 0.3]} />
          <meshStandardMaterial color="#d8321f" roughness={0.8} />
        </mesh>
        {/* pixel eyes */}
        <mesh position={[-0.1, 0.74, 0.27]}>
          <boxGeometry args={[0.06, 0.08, 0.06]} />
          <meshStandardMaterial color="#171412" />
        </mesh>
        <mesh position={[0.1, 0.74, 0.27]}>
          <boxGeometry args={[0.06, 0.08, 0.06]} />
          <meshStandardMaterial color="#171412" />
        </mesh>
        {/* the brief under the arm */}
        <mesh castShadow position={[0.36, -0.05, 0.05]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.06, 0.5, 0.36]} />
          <meshStandardMaterial color="#f5f0e6" />
        </mesh>
      </group>
    </RigidBody>
  );
}

/* ---------- The van ---------- */

export function Van(): ReactNode {
  const body = useRef<RapierRigidBody>(null);
  const { mode } = useGame();
  const speed = useRef(0);
  const [w, h, d] = useModelFootprint("van", 3.4);
  const forward = useMemo(() => new THREE.Vector3(), []);
  const { gl } = useThree();
  const wheels = useRef<{ front: THREE.Object3D | null; rear: THREE.Object3D | null }>({ front: null, rear: null });
  const bodyVisual = useRef<THREE.Group>(null);
  const steerRef = useRef(0);
  const prevSpeed = useRef(0);
  const dustClock = useRef(0);
  const onObject = useCallback((object: THREE.Group) => {
    wheels.current = { front: object.getObjectByName("Front Wheels") ?? null, rear: object.getObjectByName("Rear Wheels") ?? null };
  }, []);

  useEffect(() => {
    gl.domElement.style.touchAction = "none";
  }, [gl]);

  useFrame((_, delta) => {
    const rb = body.current;
    if (!rb) return;
    const rot = rb.rotation();
    const q = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);
    forward.set(0, 0, 1).applyQuaternion(q);
    const heading = Math.atan2(forward.x, forward.z);
    const t = rb.translation();
    actors.van.set(t.x, t.y, t.z);
    actors.vanHeading = heading;

    audio.engine(speed.current, mode === "drive");
    if (mode !== "drive") {
      speed.current *= 0.9;
      return;
    }
    const axis = readAxis();
    const throttle = -axis.y;
    speed.current += throttle * 16 * delta;
    speed.current *= throttle === 0 ? 0.96 : 0.995;
    speed.current = THREE.MathUtils.clamp(speed.current, -VAN_MAX * 0.45, VAN_MAX);
    const steer = -axis.x * 2.4 * THREE.MathUtils.clamp(speed.current / 6, -1, 1);
    const v = rb.linvel();
    rb.setLinvel({ x: forward.x * speed.current, y: v.y, z: forward.z * speed.current }, true);
    rb.setAngvel({ x: 0, y: steer, z: 0 }, true);

    // Visual polish: wheels spin and steer, body leans in bends and squats on throttle.
    steerRef.current += (-axis.x * 0.45 - steerRef.current) * 0.15;
    const spin = (speed.current * delta) / 0.35;
    if (wheels.current.front) {
      wheels.current.front.rotation.x += spin;
      wheels.current.front.rotation.y = steerRef.current;
    }
    if (wheels.current.rear) wheels.current.rear.rotation.x += spin;
    if (bodyVisual.current) {
      const accel = (speed.current - prevSpeed.current) / Math.max(delta, 1 / 120);
      bodyVisual.current.rotation.z += (steer * 0.045 - bodyVisual.current.rotation.z) * 0.1;
      bodyVisual.current.rotation.x += (THREE.MathUtils.clamp(-accel * 0.004, -0.06, 0.06) - bodyVisual.current.rotation.x) * 0.1;
    }
    prevSpeed.current = speed.current;

    // Dust from the rear wheels when moving fast or drifting.
    dustClock.current += delta;
    const drifting = Math.abs(steer) > 1.2 && Math.abs(speed.current) > 6;
    if (Math.abs(speed.current) > 3 && dustClock.current > (drifting ? 0.03 : 0.08)) {
      dustClock.current = 0;
      const back = forward.clone().multiplyScalar(-d / 2 + 0.2);
      const side = new THREE.Vector3(forward.z, 0, -forward.x).multiplyScalar(w / 2 - 0.2);
      for (const sign of [1, -1]) {
        dust.emit(t.x + back.x + side.x * sign, t.z + back.z + side.z * sign, drifting ? 2 : 1, { speed: 0.5 + Math.abs(speed.current) * 0.06, size: drifting ? 0.45 : 0.3, dirX: forward.x, dirZ: forward.z });
      }
    }
  });

  const onHit = useCallback((payload: { totalForceMagnitude?: number }) => {
    const force = payload.totalForceMagnitude ?? 0;
    if (force < 40) return;
    const strength = Math.min(1, force / 400);
    shake.add(0.25 + strength * 0.6);
    dust.emit(actors.van.x, actors.van.z, 6 + Math.round(strength * 10), { speed: 1.5, size: 0.5, y: 0.3 });
    audio.thud(0.5 + strength);
  }, []);

  return (
    <RigidBody ref={body} position={[3.5, 0.6, 6]} rotation={[0, Math.PI, 0]} colliders={false} enabledRotations={[false, true, false]} mass={4} linearDamping={0.5} angularDamping={3} friction={0.6} userData={{ kind: "van" }} onContactForce={onHit}>
      <CuboidCollider args={[w / 2, h / 2, d / 2]} position={[0, h / 2 - 0.05, 0]} />
      <group ref={bodyVisual}>
        <Model name="van" size={3.4} onObject={onObject} />
        {/* Headlights, on while driving */}
        {mode === "drive" ? (
          <>
            {[-0.42, 0.42].map((x) => (
              <group key={x} position={[x, h * 0.45, d / 2 + 0.02]}>
                <mesh>
                  <sphereGeometry args={[0.07, 10, 10]} />
                  <meshStandardMaterial color="#fff6d5" emissive="#ffe9a8" emissiveIntensity={4} toneMapped={false} />
                </mesh>
                <spotLight position={[0, 0, 0.05]} angle={0.55} penumbra={0.7} intensity={40} distance={14} color="#fff1c4" target-position={[x, -0.5, 8]} />
              </group>
            ))}
          </>
        ) : null}
      </group>
      <Text font={FONT_DISPLAY} fontSize={0.22} color="#171412" anchorX="center" anchorY="middle" position={[w / 2 + 0.01, h * 0.55, 0.1]} rotation={[0, Math.PI / 2, 0]} maxWidth={2.6}>
        TOBIAS RINGOT · SITES & LOGICIELS
      </Text>
      <Text font={FONT_DISPLAY} fontSize={0.22} color="#171412" anchorX="center" anchorY="middle" position={[-w / 2 - 0.01, h * 0.55, 0.1]} rotation={[0, -Math.PI / 2, 0]} maxWidth={2.6}>
        TOBIAS RINGOT · SITES & LOGICIELS
      </Text>
    </RigidBody>
  );
}

/* ---------- Follow camera ---------- */

export function FollowCamera(): ReactNode {
  const { camera, size } = useThree();
  const { mode } = useGame();
  const look = useMemo(() => new THREE.Vector3(), []);
  const goal = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = size.width < size.height ? 62 : 44;
    cam.updateProjectionMatrix();
  }, [camera, size]);

  useFrame(() => {
    const target = mode === "drive" ? actors.van : actors.player;
    const portrait = size.width < size.height;
    const back = mode === "drive" ? (portrait ? 9 : 11) : portrait ? 8 : 9;
    const up = mode === "drive" ? (portrait ? 12 : 10.5) : portrait ? 10 : 8.5;
    goal.set(target.x, target.y + up, target.z + back);
    camera.position.lerp(goal, 0.06);
    look.lerp(new THREE.Vector3(target.x, target.y + 0.5, target.z), 0.1);
    if (shake.amount > 0.001) {
      const s = shake.amount;
      camera.position.x += (Math.random() - 0.5) * s * 0.5;
      camera.position.y += (Math.random() - 0.5) * s * 0.35;
      shake.amount *= 0.86;
    }
    camera.lookAt(look);
  });
  return null;
}
