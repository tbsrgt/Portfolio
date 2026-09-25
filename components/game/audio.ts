"use client";

/**
 * Tiny synthesised soundtrack: no audio files, everything is oscillators and
 * filtered noise. Unlocked by the first gesture, muted from the HUD.
 */
type Engine = { osc: OscillatorNode; osc2: OscillatorNode; gain: GainNode; filter: BiquadFilterNode };

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let engine: Engine | null = null;
let noiseBuffer: AudioBuffer | null = null;
let muted = false;

const MUTE_KEY = "tournee-muted";

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.6;
    master.connect(ctx.destination);
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  }
  return ctx;
}

export const audio = {
  init(): void {
    try {
      muted = window.localStorage.getItem(MUTE_KEY) === "1";
    } catch {
      /* ignore */
    }
  },
  get muted(): boolean {
    return muted;
  },
  setMuted(value: boolean): void {
    muted = value;
    if (master) master.gain.value = value ? 0 : 0.6;
    try {
      window.localStorage.setItem(MUTE_KEY, value ? "1" : "0");
    } catch {
      /* ignore */
    }
  },
  /** Call from a user gesture. */
  unlock(): void {
    const c = context();
    if (c && c.state === "suspended") void c.resume();
  },

  noise(duration: number, frequency: number, volume: number, type: BiquadFilterType = "bandpass"): void {
    const c = context();
    if (!c || !master || !noiseBuffer || c.state !== "running") return;
    const source = c.createBufferSource();
    source.buffer = noiseBuffer;
    const filter = c.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = 0.8;
    const gain = c.createGain();
    gain.gain.setValueAtTime(volume, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    source.connect(filter).connect(gain).connect(master);
    source.start();
    source.stop(c.currentTime + duration);
  },

  tone(frequency: number, duration: number, volume = 0.2, type: OscillatorType = "sine", delay = 0): void {
    const c = context();
    if (!c || !master || c.state !== "running") return;
    const osc = c.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency;
    const gain = c.createGain();
    const t0 = c.currentTime + delay;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain).connect(master);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  },

  footstep(): void {
    audio.noise(0.09, 900 + Math.random() * 300, 0.12, "lowpass");
  },
  thud(strength = 1): void {
    audio.noise(0.18, 180, Math.min(0.6, 0.25 * strength), "lowpass");
    audio.tone(70, 0.15, 0.2, "sine");
  },
  rustle(): void {
    audio.noise(0.25, 2400, 0.08, "highpass");
  },
  door(): void {
    audio.noise(0.12, 500, 0.2, "bandpass");
    audio.tone(160, 0.1, 0.15, "square");
  },
  mission(): void {
    audio.tone(660, 0.18, 0.18, "triangle");
    audio.tone(880, 0.22, 0.18, "triangle", 0.14);
    audio.tone(1320, 0.4, 0.14, "triangle", 0.28);
  },
  stamp(): void {
    audio.noise(0.1, 300, 0.35, "lowpass");
    audio.tone(110, 0.12, 0.25, "sine");
  },

  /** Engine hum that follows the van's speed; 0 stops it. */
  engine(speed: number, driving: boolean): void {
    const c = context();
    if (!c || !master || c.state !== "running") return;
    if (!engine) {
      const osc = c.createOscillator();
      osc.type = "sawtooth";
      const osc2 = c.createOscillator();
      osc2.type = "square";
      const filter = c.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 400;
      const gain = c.createGain();
      gain.gain.value = 0;
      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain).connect(master);
      osc.start();
      osc2.start();
      engine = { osc, osc2, gain, filter };
    }
    const target = driving ? 0.05 + Math.min(0.12, Math.abs(speed) * 0.01) : 0;
    engine.gain.gain.setTargetAtTime(target, c.currentTime, 0.08);
    const base = 38 + Math.abs(speed) * 6;
    engine.osc.frequency.setTargetAtTime(base, c.currentTime, 0.05);
    engine.osc2.frequency.setTargetAtTime(base * 0.5, c.currentTime, 0.05);
    engine.filter.frequency.setTargetAtTime(300 + Math.abs(speed) * 60, c.currentTime, 0.1);
  },
};
