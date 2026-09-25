"use client";

import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CuboidCollider, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";

import { audio } from "./audio";
import { dust, shake, skid } from "./fx";
import { Model, useModelFootprint } from "./models";
import { game, input, readAxis, useGame } from "./store";
import { FONT_DISPLAY } from "./world";

const WALK_SPEED = 6.5;
const VAN_MAX = 15;
const ENTER_DISTANCE = 2.6;

/** Positions shared between actors and the camera, updated every frame. */
export const actors = {
  player: new THREE.Vector3(-1, 0.6, 6),
  van: new THREE.Vector3(4, 0.5, 7),
  vanHeading: 0,
};

/* ---------- The little figure ---------- */

export function Player(): ReactNode {
  const body = useRef<RapierRigidBody>(null);
  const visual = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
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
        if (game.get().zone && !game.get().panel) {
          game.openZone();
          audio.rustle();
        } else {
          const side = new THREE.Vector3(Math.cos(actors.vanHeading), 0, -Math.sin(actors.vanHeading)).multiplyScalar(2.6);
          rb.setTranslation({ x: actors.van.x + side.x, y: 0.8, z: actors.van.z + side.z }, true);
          game.setMode("walk");
          audio.door();
        }
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
      let dy = heading.current - visual.current.rotation.y;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      visual.current.rotation.y += dy * 0.2;
      walkPhase.current += moving ? delta * 11 : 0;
      visual.current.position.y = 0.62 + (moving ? Math.abs(Math.sin(walkPhase.current)) * 0.06 : 0);
      visual.current.rotation.x = moving ? 0.08 : 0;
      const swing = moving ? Math.sin(walkPhase.current) * 0.75 : 0;
      if (legL.current) legL.current.rotation.x = swing;
      if (legR.current) legR.current.rotation.x = -swing;
      if (armL.current) armL.current.rotation.x = -swing * 0.8;
      if (armR.current) armR.current.rotation.x = swing * 0.5;
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
    if (input.action && !actionHeld.current) {
      actionHeld.current = true;
      if (near) {
        game.setMode("drive");
        audio.door();
      } else if (game.get().zone && !game.get().panel) {
        game.openZone();
        audio.rustle();
      }
    }
    if (!input.action) actionHeld.current = false;
  });

  return (
    <RigidBody ref={body} position={[-1, 1, 6]} colliders={false} enabledRotations={[false, false, false]} linearDamping={4} friction={0} userData={{ kind: "player" }}>
      <CuboidCollider args={[0.34, 0.75, 0.34]} />
      <group ref={visual} visible={mode === "walk"}>
        {/* legs */}
        <group ref={legL} position={[-0.16, 0.05, 0]}>
          <mesh castShadow position={[0, -0.32, 0]}>
            <capsuleGeometry args={[0.11, 0.42, 4, 10]} />
            <meshStandardMaterial color="#2b3a8f" roughness={0.85} />
          </mesh>
          <mesh castShadow position={[0, -0.6, 0.06]}>
            <boxGeometry args={[0.22, 0.12, 0.34]} />
            <meshStandardMaterial color="#171412" roughness={0.6} />
          </mesh>
        </group>
        <group ref={legR} position={[0.16, 0.05, 0]}>
          <mesh castShadow position={[0, -0.32, 0]}>
            <capsuleGeometry args={[0.11, 0.42, 4, 10]} />
            <meshStandardMaterial color="#2b3a8f" roughness={0.85} />
          </mesh>
          <mesh castShadow position={[0, -0.6, 0.06]}>
            <boxGeometry args={[0.22, 0.12, 0.34]} />
            <meshStandardMaterial color="#171412" roughness={0.6} />
          </mesh>
        </group>
        {/* torso: dark tee */}
        <mesh castShadow position={[0, 0.45, 0]}>
          <capsuleGeometry args={[0.27, 0.42, 6, 14]} />
          <meshStandardMaterial color="#171412" roughness={0.8} />
        </mesh>
        {/* arms */}
        <group ref={armL} position={[-0.36, 0.7, 0]}>
          <mesh castShadow position={[0, -0.28, 0]}>
            <capsuleGeometry args={[0.085, 0.4, 4, 10]} />
            <meshStandardMaterial color="#171412" roughness={0.8} />
          </mesh>
          <mesh castShadow position={[0, -0.56, 0]}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshStandardMaterial color="#f1c9a5" roughness={0.7} />
          </mesh>
        </group>
        <group ref={armR} position={[0.36, 0.7, 0]}>
          <mesh castShadow position={[0, -0.28, 0]}>
            <capsuleGeometry args={[0.085, 0.4, 4, 10]} />
            <meshStandardMaterial color="#171412" roughness={0.8} />
          </mesh>
          <mesh castShadow position={[0, -0.56, 0]}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshStandardMaterial color="#f1c9a5" roughness={0.7} />
          </mesh>
          {/* the client brief, tucked under the arm */}
          <mesh castShadow position={[0.1, -0.35, 0.02]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.06, 0.5, 0.36]} />
            <meshStandardMaterial color="#f5f0e6" roughness={1} />
          </mesh>
        </group>
        {/* neck + head */}
        <mesh position={[0, 0.82, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 10]} />
          <meshStandardMaterial color="#f1c9a5" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, 1.12, 0]}>
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshStandardMaterial color="#f1c9a5" roughness={0.7} />
        </mesh>
        {/* hair + red cap */}
        <mesh castShadow position={[0, 1.22, -0.04]}>
          <sphereGeometry args={[0.305, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#3a2a1c" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0, 1.3, 0]}>
          <sphereGeometry args={[0.31, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
          <meshStandardMaterial color="#d8321f" roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, 1.31, 0.3]} rotation={[0.15, 0, 0]}>
          <boxGeometry args={[0.36, 0.04, 0.3]} />
          <meshStandardMaterial color="#d8321f" roughness={0.8} />
        </mesh>
        {/* eyes + smile */}
        <mesh position={[-0.1, 1.14, 0.27]}>
          <boxGeometry args={[0.06, 0.08, 0.06]} />
          <meshStandardMaterial color="#171412" />
        </mesh>
        <mesh position={[0.1, 1.14, 0.27]}>
          <boxGeometry args={[0.06, 0.08, 0.06]} />
          <meshStandardMaterial color="#171412" />
        </mesh>
        <mesh position={[0, 1.02, 0.28]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.07, 0.015, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#9c4a3a" />
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
      speed.current = 0;
      rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }
    const axis = readAxis();
    const throttle = -axis.y;
    const v = rb.linvel();
    const planar = new THREE.Vector3(v.x, 0, v.z);
    const fwdSpeed = planar.dot(forward);
    speed.current = fwdSpeed;
    // Push the van with impulses so collisions stay physical; the brake pushes harder.
    const braking = throttle < 0 && fwdSpeed > 0.5;
    if (throttle !== 0 && Math.abs(fwdSpeed) < (throttle > 0 ? VAN_MAX : VAN_MAX * 0.4)) {
      rb.applyImpulse({ x: forward.x * throttle * 40 * delta * (braking ? 2 : 1), y: 0, z: forward.z * throttle * 40 * delta * (braking ? 2 : 1) }, true);
    }
    // Tyre grip: bleed off sideways velocity.
    const side = new THREE.Vector3(forward.z, 0, -forward.x);
    const lateral = planar.dot(side);
    rb.setLinvel({ x: v.x - side.x * lateral * 0.25, y: v.y, z: v.z - side.z * lateral * 0.25 }, true);
    const steer = -axis.x * 2.2 * THREE.MathUtils.clamp(fwdSpeed / 6, -1, 1);
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
    const drifting = Math.abs(lateral) > 2.5 && Math.abs(speed.current) > 5;
    if (Math.abs(speed.current) > 3 && dustClock.current > (drifting ? 0.03 : 0.08)) {
      dustClock.current = 0;
      const back = forward.clone().multiplyScalar(-d / 2 + 0.2);
      const side = new THREE.Vector3(forward.z, 0, -forward.x).multiplyScalar(w / 2 - 0.2);
      for (const sign of [1, -1]) {
        if (drifting || Math.abs(speed.current - prevSpeed.current) > 0.5) skid.mark(t.x + back.x + side.x * sign, t.z + back.z + side.z * sign, heading);
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
    <RigidBody ref={body} position={[4, 0.6, 7]} rotation={[0, Math.PI, 0]} colliders={false} enabledRotations={[false, true, false]} mass={4} linearDamping={1.1} angularDamping={4} friction={0.7} userData={{ kind: "van" }} onContactForce={onHit}>
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
    cam.fov = size.width < size.height ? 66 : 46;
    cam.updateProjectionMatrix();
  }, [camera, size]);

  useFrame(() => {
    const target = mode === "drive" ? actors.van : actors.player;
    const portrait = size.width < size.height;
    const back = mode === "drive" ? (portrait ? 11 : 13) : portrait ? 9 : 10.5;
    const up = mode === "drive" ? (portrait ? 15 : 13) : portrait ? 12 : 10.5;
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
