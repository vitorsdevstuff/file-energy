"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function DocumentPlane({ position, rotation, scale, color }: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.1;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2 + position[1]) * 0.05;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <planeGeometry args={[1, 1.4, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.6}
          distort={0.1}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function GlowingSphere({ position, color, size }: {
  position: [number, number, number];
  color: string;
  size: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

function Particles({ count = 50 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlesPosition, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#6366f1"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function EnergyRing({ position, size }: { position: [number, number, number]; size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.x = Math.PI / 4;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[size, 0.02, 16, 100]} />
      <meshBasicMaterial color="#6366f1" transparent opacity={0.3} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      {/* Floating document shapes */}
      <DocumentPlane position={[-3, 2, -2]} rotation={[0.2, 0.3, 0.1]} scale={0.8} color="#6366f1" />
      <DocumentPlane position={[3, -1, -3]} rotation={[-0.1, -0.2, 0.15]} scale={0.6} color="#8b5cf6" />
      <DocumentPlane position={[-2, -2, -4]} rotation={[0.15, 0.1, -0.1]} scale={0.5} color="#a855f7" />
      <DocumentPlane position={[4, 1, -5]} rotation={[-0.2, 0.4, 0.2]} scale={0.7} color="#6366f1" />
      <DocumentPlane position={[0, 3, -3]} rotation={[0.3, -0.1, 0]} scale={0.5} color="#818cf8" />

      {/* Glowing spheres */}
      <GlowingSphere position={[-4, 0, -3]} color="#6366f1" size={0.3} />
      <GlowingSphere position={[4, 2, -4]} color="#8b5cf6" size={0.2} />
      <GlowingSphere position={[2, -2, -2]} color="#a855f7" size={0.15} />

      {/* Energy rings */}
      <EnergyRing position={[0, 0, -6]} size={3} />
      <EnergyRing position={[0, 0, -8]} size={4} />

      {/* Particles */}
      <Particles count={100} />
    </>
  );
}

export function FloatingDocuments() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
