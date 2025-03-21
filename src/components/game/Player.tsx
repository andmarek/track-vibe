'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, useRapier } from '@react-three/rapier';
import { Mesh } from 'three';
import { useGameStore } from '@/lib/game/store';
import { useKeyboardControls } from '@/lib/game/useKeyboardControls';

const MOVEMENT_SPEED = 5;
const ROTATION_SPEED = 0.1;

export default function Player() {
  const playerRef = useRef<Mesh>(null);
  const rigidBodyRef = useRef<any>(null);
  const { updatePlayerPosition, updatePlayerRotation } = useGameStore();
  const controls = useKeyboardControls();
  const { world } = useRapier();

  useFrame((state, delta) => {
    if (!rigidBodyRef.current) return;

    const rigidBody = rigidBodyRef.current;
    const position = rigidBody.translation();
    const rotation = rigidBody.rotation();

    // Calculate movement direction
    let moveX = 0;
    let moveZ = 0;

    if (controls.forward) moveZ -= MOVEMENT_SPEED;
    if (controls.backward) moveZ += MOVEMENT_SPEED;
    if (controls.left) moveX -= MOVEMENT_SPEED;
    if (controls.right) moveX += MOVEMENT_SPEED;

    // Apply movement while maintaining y position
    if (moveX !== 0 || moveZ !== 0) {
      // Get current velocity
      const currentVelocity = rigidBody.linvel();
      
      // Set new velocity while preserving y (vertical) component
      rigidBody.setLinvel(
        { 
          x: moveX, 
          y: currentVelocity.y, // Keep current vertical velocity
          z: moveZ 
        }, 
        true
      );
    }

    // Update store with new position and rotation
    updatePlayerPosition([position.x, position.y, position.z]);
    updatePlayerRotation([rotation.x, rotation.y, rotation.z]);
  });

  return (
    <RigidBody 
      ref={rigidBodyRef} 
      position={[0, 1, 45]}
      type="dynamic"
      lockRotations={true} // Prevent the player from tipping over
    >
      <group ref={playerRef}>
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