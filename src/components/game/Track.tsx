'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Mesh } from 'three';

export default function Track() {
  const trackRef = useRef<Mesh>(null);

  return (
    <RigidBody type="fixed">
      {/* Main track surface */}
      <mesh ref={trackRef} receiveShadow>
        <boxGeometry args={[100, 1, 100]} />
        <meshStandardMaterial color="#2c5282" />
      </mesh>

      {/* Track lanes */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[0, 0.1, 40 - (i * 10)]} receiveShadow>
          <boxGeometry args={[100, 0.1, 0.5]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Starting line */}
      <mesh position={[0, 0.1, 45]} receiveShadow>
        <boxGeometry args={[100, 0.1, 2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Track boundaries */}
      <mesh position={[0, 0.5, 50]} receiveShadow>
        <boxGeometry args={[100, 1, 1]} />
        <meshStandardMaterial color="#1a365d" />
      </mesh>
      <mesh position={[0, 0.5, -50]} receiveShadow>
        <boxGeometry args={[100, 1, 1]} />
        <meshStandardMaterial color="#1a365d" />
      </mesh>
      <mesh position={[50, 0.5, 0]} receiveShadow rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[100, 1, 1]} />
        <meshStandardMaterial color="#1a365d" />
      </mesh>
      <mesh position={[-50, 0.5, 0]} receiveShadow rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[100, 1, 1]} />
        <meshStandardMaterial color="#1a365d" />
      </mesh>

      {/* Grass around the track */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[200, 0.1, 200]} />
        <meshStandardMaterial color="#48bb78" />
      </mesh>
    </RigidBody>
  );
} 