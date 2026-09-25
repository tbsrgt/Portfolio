"use client";

import { Environment, Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useState, type ReactNode } from "react";

import { FollowCamera, Player, Van } from "./actors";
import { bindKeyboard, game, useGame } from "./store";
import { Adresse, Bin, Cogebat, Desk, Lamp, PaperBall, PostIt, Props, Racines } from "./world";
import { deskCopy } from "@/lib/desk-copy";
import type { Locale } from "@/lib/i18n";

/** The whole game: Tobias's desk as a world, physics, a figure and a van. */
export function GameScene({ locale, onReady }: { locale: Locale; onReady: () => void }): ReactNode {
  const copy = deskCopy[locale];
  const { done } = useGame();
  const [ballSeed, setBallSeed] = useState(1);
  const basketDone = done.includes("basket");

  useEffect(() => bindKeyboard(), []);
  useEffect(() => {
    if (basketDone) {
      const id = window.setTimeout(() => setBallSeed((s) => s + 1), 1200);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [basketDone]);
  useEffect(() => game.hydrate(), []);

  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 7, 12], fov: 40, near: 0.3, far: 90 }} gl={{ antialias: true, powerPreference: "high-performance" }} style={{ touchAction: "none" }}>
      <color attach="background" args={["#0f2a22"]} />
      <fog attach="fog" args={["#0f2a22", 26, 48]} />
      <hemisphereLight args={["#e8f0e6", "#0d1f19", 0.5]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[8, 14, 6]} intensity={0.5} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} />
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
          <PaperBall key={ballSeed} seed={ballSeed} />
          <PostIt text={copy.postitAvailable} position={[-4, 0.3, -4]} rotation={0.3} />
          <PostIt text={copy.postitCoffee} position={[4.5, 0.3, 2]} rotation={-0.4} />
          <Player />
          <Van />
        </Physics>
        <FollowCamera />
        <Preload all />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}

function Ready({ onReady }: { onReady: () => void }): ReactNode {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}
