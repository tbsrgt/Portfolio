"use client";

import { Text } from "@react-three/drei";
import { CylinderCollider, RigidBody, type CollisionPayload } from "@react-three/rapier";
import type { ReactNode } from "react";

import { game } from "./store";
import { cardboardTexture, FONT_DISPLAY, FONT_HAND, paperTexture } from "./world";
import { zones, type ZoneId } from "@/lib/game";
import type { Locale } from "@/lib/i18n";

const C = { paper: "#f5f0e6", ink: "#171412", pen: "#1b3ed6", postit: "#ffe45c", kraft: "#c9a06b", stamp: "#d8321f" } as const;

function isActor(payload: CollisionPayload): boolean {
  const kind = (payload.other.rigidBodyObject?.userData as { kind?: string } | undefined)?.kind;
  return kind === "player" || kind === "van";
}

/** A part of the site laid on the desk: a labelled sheet you walk onto to open it. */
function ContentZone({ id, locale, position, rotation = 0 }: { id: ZoneId; locale: Locale; position: [number, number, number]; rotation?: number }): ReactNode {
  const zone = zones.find((z) => z.id === id);
  if (!zone) return null;
  const radius = 2.7;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider
          args={[0.8, radius]}
          position={[0, 0.8, 0]}
          sensor
          onIntersectionEnter={(p) => isActor(p) && game.enterZone(id)}
          onIntersectionExit={(p) => isActor(p) && game.leaveZone(id)}
        />
      </RigidBody>
      {/* The sheet */}
      <mesh receiveShadow castShadow position={[0, 0.03, 0]}>
        <boxGeometry args={[4.2, 0.06, 3]} />
        <meshStandardMaterial map={zone.tone === "kraft" ? cardboardTexture() : paperTexture()} color={zone.tone === "kraft" ? "#ffffff" : zone.tone === "postit" ? C.postit : "#e6dfd0"} roughness={1} />
      </mesh>
      <Text font={FONT_DISPLAY} fontSize={0.52} color={zone.tone === "stamp" ? C.stamp : C.ink} anchorX="center" anchorY="middle" maxWidth={3.2} position={[0, 0.07, -0.35]} rotation={[-Math.PI / 2, 0, 0]}>
        {zone.title[locale].toUpperCase()}
      </Text>
      <Text font={FONT_HAND} fontSize={0.34} color={C.pen} anchorX="center" anchorY="middle" maxWidth={3.2} position={[0, 0.07, 0.55]} rotation={[-Math.PI / 2, 0, 0]}>
        {zone.subtitle[locale]}
      </Text>
      {/* Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.14, radius, 48]} />
        <meshStandardMaterial color={C.paper} transparent opacity={0.35} />
      </mesh>
      {/* Little flag */}
      <mesh castShadow position={[1.6, 0.8, -1.1]}>
        <boxGeometry args={[0.06, 1.6, 0.06]} />
        <meshStandardMaterial color={C.ink} />
      </mesh>
      <mesh castShadow position={[1.95, 1.35, -1.1]}>
        <boxGeometry args={[0.7, 0.45, 0.03]} />
        <meshStandardMaterial color={C.stamp} />
      </mesh>
    </group>
  );
}

/** Where each part of the site sits on the desk. */
export function ContentZones({ locale }: { locale: Locale }): ReactNode {
  return (
    <>
      <ContentZone id="offers" locale={locale} position={[-6, 0, -7]} rotation={0.08} />
      <ContentZone id="work" locale={locale} position={[6, 0, -7]} rotation={-0.06} />
      <ContentZone id="about" locale={locale} position={[0, 0, -1]} rotation={0.03} />
      <ContentZone id="method" locale={locale} position={[-12, 0, 5]} rotation={-0.1} />
      <ContentZone id="guarantees" locale={locale} position={[1, 0, 14]} rotation={0.05} />
      <ContentZone id="faq" locale={locale} position={[19, 0, 5]} rotation={0.12} />
      <ContentZone id="contact" locale={locale} position={[-19, 0, 11]} rotation={-0.15} />
      <ContentZone id="pains" locale={locale} position={[20, 0, -8]} rotation={-0.08} />
    </>
  );
}
