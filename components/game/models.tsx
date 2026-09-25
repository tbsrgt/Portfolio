"use client";

import { useGLTF } from "@react-three/drei";
import { useLayoutEffect, useMemo, type ReactNode } from "react";
import * as THREE from "three";

export const MODEL = {
  van: "/models/citroen-old-van/model.gltf",
  lamp: "/models/desk_lamp_arm_01/desk_lamp_arm_01_1k.gltf",
  laptop: "/models/classic_laptop/classic_laptop_1k.gltf",
  stapler: "/models/vintage_stapler/vintage_stapler_1k.gltf",
  plant: "/models/potted_plant_02/potted_plant_02_1k.gltf",
  notebook: "/models/binder_notebook/binder_notebook_1k.gltf",
  tape: "/models/measuring_tape_01/measuring_tape_01_1k.gltf",
  mug: "/models/mug/model.gltf",
} as const;

export type ModelName = keyof typeof MODEL;

/**
 * A glTF model scaled so its largest footprint side equals `size`, resting on y = 0.
 * Models come from Poly Haven and pmndrs/market-assets (CC0).
 */
export function Model({ name, size, rotation = [0, 0, 0], position = [0, 0, 0], shadows = true, onObject }: { name: ModelName; size: number; rotation?: [number, number, number]; position?: [number, number, number]; shadows?: boolean; onObject?: ((object: THREE.Group) => void) | undefined }): ReactNode {
  const { scene } = useGLTF(MODEL[name]);
  const object = useMemo(() => scene.clone(true), [scene]);

  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(object);
    const dims = new THREE.Vector3();
    box.getSize(dims);
    const largest = Math.max(dims.x, dims.z) || 1;
    const s = size / largest;
    const center = new THREE.Vector3();
    box.getCenter(center);
    return { scale: s, offset: [-center.x * s, -box.min.y * s, -center.z * s] as [number, number, number] };
  }, [object, size]);

  useLayoutEffect(() => {
    onObject?.(object);
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = shadows;
        child.receiveShadow = shadows;
      }
    });
  }, [object, shadows, onObject]);

  return (
    <group position={position} rotation={rotation}>
      <primitive object={object} scale={scale} position={offset} />
    </group>
  );
}

/** Footprint of a model after normalisation, for colliders (largest side = size). */
export function useModelFootprint(name: ModelName, size: number): [number, number, number] {
  const { scene } = useGLTF(MODEL[name]);
  return useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const dims = new THREE.Vector3();
    box.getSize(dims);
    const s = size / (Math.max(dims.x, dims.z) || 1);
    return [dims.x * s, dims.y * s, dims.z * s];
  }, [scene, size]);
}

for (const url of Object.values(MODEL)) useGLTF.preload(url);
