"use client";

import { Environment, Preload } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { FollowCamera, Player, Van } from "./actors";
import { audio } from "./audio";
import { Dust, Effects, FlyingPapers, Motes, Skids, WindSystem, wind } from "./fx";
import { bindKeyboard, game, useGame } from "./store";
import { Adresse, Bin, Cogebat, Desk, Lamp, PaperBall, PostIt, Props, Racines } from "./world";
import { ContentZones } from "./zones";
import { deskCopy } from "@/lib/desk-copy";
import type { Locale } from "@/lib/i18n";

/** The whole game: Tobias's desk as a world, physics, a figure and a van. */
export function GameScene({ locale, onReady }: { locale: Locale; onReady: () => void }): ReactNode {
  const copy = deskCopy[locale];
  const { done, night } = useGame();
  const [ballSeed, setBallSeed] = useState(1);
  const basketDone = done.includes("basket");

  useEffect(() => bindKeyboard(), []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.code === "KeyH") {
        audio.horn();
        wind.burst = 1;
      }
      if (event.code === "KeyN") game.toggleNight();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    audio.init();
    const unlock = (): void => audio.unlock();
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);
  const doneCount = done.length;
  const seen = useRef(0);
  useEffect(() => {
    if (doneCount > seen.current && seen.current > 0) {
      audio.mission();
      window.setTimeout(() => audio.stamp(), 500);
    }
    seen.current = doneCount;
  }, [doneCount]);
  useEffect(() => {
    if (basketDone) {
      const id = window.setTimeout(() => setBallSeed((s) => s + 1), 1200);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [basketDone]);
  useEffect(() => game.hydrate(), []);

  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 10, 16], fov: 46, near: 0.3, far: 120 }} gl={{ antialias: true, powerPreference: "high-performance" }} style={{ touchAction: "none" }}>
      <DayNight night={night} />
      <Suspense fallback={null}>
        <Environment files="/hdri/studio_small_03_1k.hdr" environmentIntensity={0.35} />
        <Physics gravity={[0, -16, 0]}>
          <Desk />
          <Lamp />
          <Props />
          <Racines />
          <Cogebat />
          <Adresse />
          <Bin />
          <ContentZones locale={locale} />
          <PaperBall key={ballSeed} seed={ballSeed} />
          <PostIt text={copy.postitAvailable} position={[-13, 0.3, -9]} rotation={0.3} />
          <PostIt text={copy.postitCoffee} position={[8, 0.3, 3]} rotation={-0.4} />
          <Player />
          <Van />
        </Physics>
        <Dust />
        <Skids />
        <Motes center={[-10, 3, -8]} radius={14} />
        <WindSystem area={[50, 36]} />
        <FlyingPapers area={[50, 36]} />
        <FollowCamera />
        <Effects />
        <Preload all />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}

/** Ambient lighting that eases between day and night (the lamp and headlights stay on). */
function DayNight({ night }: { night: boolean }): ReactNode {
  const hemi = useRef<THREE.HemisphereLight>(null);
  const ambient = useRef<THREE.AmbientLight>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const bg = useMemo(() => new THREE.Color("#0f2a22"), []);
  const target = useMemo(() => new THREE.Color(), []);
  useFrame(({ scene }) => {
    const k = night ? 0.12 : 1;
    if (hemi.current) hemi.current.intensity += (0.5 * k - hemi.current.intensity) * 0.05;
    if (ambient.current) ambient.current.intensity += (0.3 * k - ambient.current.intensity) * 0.05;
    if (sun.current) sun.current.intensity += (0.5 * k - sun.current.intensity) * 0.05;
    target.set(night ? "#050d0a" : "#0f2a22");
    bg.lerp(target, 0.05);
    scene.background = bg;
    if (scene.fog instanceof THREE.Fog) scene.fog.color.copy(bg);
  });
  return (
    <>
      <fog attach="fog" args={["#0f2a22", 34, 64]} />
      <hemisphereLight ref={hemi} args={["#e8f0e6", "#0d1f19", 0.5]} />
      <ambientLight ref={ambient} intensity={0.3} />
      <directionalLight ref={sun} position={[8, 14, 6]} intensity={0.5} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-28} shadow-camera-right={28} shadow-camera-top={28} shadow-camera-bottom={-28} />
    </>
  );
}

function Ready({ onReady }: { onReady: () => void }): ReactNode {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}
