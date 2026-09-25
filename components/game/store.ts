"use client";

import { useSyncExternalStore } from "react";

import { codeFor, discountFor, loadMissions, saveMissions, type MissionId } from "@/lib/game";

/* ---------- Input: keyboard + touch joystick, read every frame ---------- */

export const input = {
  x: 0,
  y: 0,
  action: false,
  keys: new Set<string>(),
};

const KEY_AXES: Record<string, [number, number]> = {
  ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
  KeyW: [0, -1], KeyZ: [0, -1], KeyS: [0, 1], KeyA: [-1, 0], KeyQ: [-1, 0], KeyD: [1, 0],
};

export const joystick = { x: 0, y: 0 };

/** Combined movement vector (-1..1) from keys and joystick. */
export function readAxis(): { x: number; y: number } {
  let x = joystick.x;
  let y = joystick.y;
  for (const key of input.keys) {
    const axis = KEY_AXES[key];
    if (axis) {
      x += axis[0];
      y += axis[1];
    }
  }
  const length = Math.hypot(x, y);
  return length > 1 ? { x: x / length, y: y / length } : { x, y };
}

export function bindKeyboard(): () => void {
  const down = (event: KeyboardEvent): void => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    if (KEY_AXES[event.code]) {
      input.keys.add(event.code);
      event.preventDefault();
    }
    if (event.code === "KeyE" || event.code === "Space" || event.code === "Enter") {
      input.action = true;
      event.preventDefault();
    }
  };
  const up = (event: KeyboardEvent): void => {
    input.keys.delete(event.code);
    if (event.code === "KeyE" || event.code === "Space" || event.code === "Enter") input.action = false;
  };
  const blur = (): void => {
    input.keys.clear();
    input.action = false;
  };
  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  window.addEventListener("blur", blur);
  return () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
    window.removeEventListener("blur", blur);
  };
}

/* ---------- Game state, shared between the scene and the HUD ---------- */

export type Mode = "walk" | "drive";

type GameState = {
  mode: Mode;
  done: MissionId[];
  discount: number;
  code: string | null;
  nearVan: boolean;
  lastEvent: { id: MissionId; at: number } | null;
  started: boolean;
};

let state: GameState = { mode: "walk", done: [], discount: 0, code: null, nearVan: false, lastEvent: null, started: false };
const listeners = new Set<() => void>();

function emit(next: Partial<GameState>): void {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

export const game = {
  get: () => state,
  hydrate(): void {
    const done = loadMissions();
    const discount = discountFor(done);
    emit({ done, discount, code: codeFor(discount) });
  },
  setMode(mode: Mode): void {
    if (state.mode !== mode) emit({ mode, started: true });
  },
  setNearVan(nearVan: boolean): void {
    if (state.nearVan !== nearVan) emit({ nearVan });
  },
  start(): void {
    if (!state.started) emit({ started: true });
  },
  complete(id: MissionId): void {
    if (state.done.includes(id)) return;
    const done = [...state.done, id];
    const discount = discountFor(done);
    saveMissions(done);
    emit({ done, discount, code: codeFor(discount), lastEvent: { id, at: Date.now() } });
  },
  reset(): void {
    saveMissions([]);
    emit({ done: [], discount: 0, code: null, lastEvent: null });
  },
};

export function useGame(): GameState {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => state
  );
}
