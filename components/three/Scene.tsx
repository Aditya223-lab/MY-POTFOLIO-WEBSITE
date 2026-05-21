"use client";

import { Canvas } from "@react-three/fiber";
import {
  Float,
  Icosahedron,
  MeshDistortMaterial,
  OrbitControls,
  Sparkles,
} from "@react-three/drei";

/** The morphing neon core the visitor can grab and spin. */
function Core() {
  return (
    <Float speed={1.5} rotationIntensity={0.9} floatIntensity={1.1}>
      {/* solid distorted body */}
      <Icosahedron args={[1.35, 6]}>
        <MeshDistortMaterial
          color="#0b1c30"
          emissive="#1c6f8c"
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={0.9}
          distort={0.4}
          speed={1.8}
        />
      </Icosahedron>
      {/* glowing wireframe shell */}
      <Icosahedron args={[1.72, 1]}>
        <meshBasicMaterial
          color="#2bf6ff"
          wireframe
          transparent
          opacity={0.3}
        />
      </Icosahedron>
      {/* magenta outline shell */}
      <Icosahedron args={[2.05, 0]}>
        <meshBasicMaterial
          color="#ff3df0"
          wireframe
          transparent
          opacity={0.14}
        />
      </Icosahedron>
    </Float>
  );
}

/** Interactive 3D hero scene. Rendered client-side only. */
export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.45} />
      <pointLight position={[5, 5, 5]} intensity={130} color="#2bf6ff" />
      <pointLight position={[-5, -3, 2]} intensity={90} color="#ff3df0" />
      <pointLight position={[0, 4, -5]} intensity={60} color="#9b6bff" />
      <Core />
      <Sparkles
        count={70}
        scale={7}
        size={3}
        speed={0.35}
        color="#2bf6ff"
        opacity={0.7}
      />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.1}
        rotateSpeed={0.6}
      />
    </Canvas>
  );
}
