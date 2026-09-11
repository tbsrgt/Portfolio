"use client";

import { useEffect, useRef } from "react";
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

const BALL_COUNT = 26;
const BOUNDS_X = 5.4;
const BOUNDS_Y = 3.25;

type Ball = {
  mesh: Mesh<SphereGeometry, MeshPhysicalMaterial>;
  velocity: Vector3;
  radius: number;
};

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/** A lightweight Three.js ball pit designed to sit behind footer content. */
export function FooterBallpit(): React.ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new WebGLRenderer({ alpha: true, antialias: true, canvas });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = "srgb";

    const scene = new Scene();
    const camera = new PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 10;

    scene.add(new AmbientLight(0xffffff, 2.2));
    const keyLight = new DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(3, 5, 7);
    scene.add(keyLight);
    const rimLight = new DirectionalLight(0x87a8ff, 2);
    rimLight.position.set(-5, -2, 5);
    scene.add(rimLight);

    const geometry = new SphereGeometry(1, 24, 24);
    const palette = [0x8ca7ff, 0xef96bf, 0xffca78, 0x75d6c3, 0xd3b3ff];
    const balls: Ball[] = Array.from({ length: BALL_COUNT }, (_, index) => {
      const radius = randomBetween(0.24, 0.54);
      const material = new MeshPhysicalMaterial({
        color: new Color(palette[index % palette.length] ?? 0x8ca7ff),
        roughness: 0.22,
        metalness: 0.08,
        clearcoat: 0.85,
        clearcoatRoughness: 0.15,
        transparent: true,
        opacity: 0.82,
      });
      const mesh = new Mesh(geometry, material);
      mesh.scale.setScalar(radius);
      mesh.position.set(
        randomBetween(-BOUNDS_X, BOUNDS_X),
        randomBetween(-BOUNDS_Y, BOUNDS_Y),
        randomBetween(-1.5, 0.8),
      );
      scene.add(mesh);
      return {
        mesh,
        radius,
        velocity: new Vector3(
          randomBetween(-0.012, 0.012),
          randomBetween(-0.012, 0.012),
          0,
        ),
      };
    });

    const pointer = new Vector2(99, 99);
    let frameId = 0;
    let width = 0;
    let height = 0;

    const resize = (): void => {
      const nextWidth = canvas.clientWidth;
      const nextHeight = canvas.clientHeight;
      if (!nextWidth || !nextHeight) return;
      width = nextWidth;
      height = nextHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const onPointerMove = (event: PointerEvent): void => {
      const bounds = canvas.getBoundingClientRect();
      pointer.set(
        ((event.clientX - bounds.left) / bounds.width) * BOUNDS_X * 2 - BOUNDS_X,
        -((event.clientY - bounds.top) / bounds.height) * BOUNDS_Y * 2 + BOUNDS_Y,
      );
    };
    const onPointerLeave = (): void => {
      pointer.set(99, 99);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    resize();

    const render = (): void => {
      for (const ball of balls) {
        const position = ball.mesh.position;
        const deltaX = position.x - pointer.x;
        const deltaY = position.y - pointer.y;
        const distance = Math.hypot(deltaX, deltaY);
        if (distance > 0 && distance < 1.8) {
          const force = (1.8 - distance) * 0.0018;
          ball.velocity.x += (deltaX / distance) * force;
          ball.velocity.y += (deltaY / distance) * force;
        }

        ball.velocity.multiplyScalar(0.993);
        position.add(ball.velocity);
        if (Math.abs(position.x) > BOUNDS_X) ball.velocity.x *= -1;
        if (Math.abs(position.y) > BOUNDS_Y) ball.velocity.y *= -1;
        position.x = Math.max(-BOUNDS_X, Math.min(BOUNDS_X, position.x));
        position.y = Math.max(-BOUNDS_Y, Math.min(BOUNDS_Y, position.y));
        ball.mesh.rotation.x += ball.velocity.y * 0.75;
        ball.mesh.rotation.y += ball.velocity.x * 0.75;
      }
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      geometry.dispose();
      balls.forEach((ball) => ball.mesh.material.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-70"
    />
  );
}
