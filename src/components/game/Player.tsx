'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Mesh } from 'three';
import { useGameStore } from '@/lib/game/store';

export default function Player() {
  const playerRef = useRef<Mesh>(null);
  const { updatePlayerPosition, updatePlayerRotation } = useGameStore();

  useFrame((state) => {
    if (playerRef.current) {
      const position = playerRef.current.position;
      const rotation = playerRef.current.rotation;
      
      updatePlayerPosition([position.x, position.y, position.z]);
      updatePlayerRotation([rotation.x, rotation.y, rotation.z]);
    }
  });

  return (
    <RigidBody>
      <group ref={playerRef} position={[0, 1, 45]}>
        {/* Body */}
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[0.3, 1.2, 4, 8]} />
          <meshStandardMaterial color="#e53e3e" />
        </mesh>

        {/* Head */}
        <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color="#e53e3e" />
        </mesh>

        {/* Arms */}
        <mesh castShadow receiveShadow position={[-0.4, 0.8, 0]} rotation={[0, 0, Math.PI / 4]}>
          <capsuleGeometry args={[0.1, 0.6, 4, 4]} />
          <meshStandardMaterial color="#e53e3e" />
        </mesh>
        <mesh castShadow receiveShadow position={[0.4, 0.8, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <capsuleGeometry args={[0.1, 0.6, 4, 4]} />
          <meshStandardMaterial color="#e53e3e" />
        </mesh>

        {/* Legs */}
        <mesh castShadow receiveShadow position={[-0.2, 0.2, 0]} rotation={[Math.PI / 4, 0, 0]}>
          <capsuleGeometry args={[0.1, 0.8, 4, 4]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
        <mesh castShadow receiveShadow position={[0.2, 0.2, 0]} rotation={[Math.PI / 4, 0, 0]}>
          <capsuleGeometry args={[0.1, 0.8, 4, 4]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
      </group>
    </RigidBody>
  );
} 