'use client';

import { RigidBody } from '@react-three/rapier';
import { useRef } from 'react';
import { Mesh } from 'three';

const STADIUM_WIDTH = 100;
const STADIUM_LENGTH = 150;
const TRACK_WIDTH = 20;
const TRACK_LENGTH = 100;

export default function Environment() {
  return (
    <group>
      {/* Ground/Grass */}
      <RigidBody type="fixed">
        <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.01, 0]}>
          <planeGeometry args={[STADIUM_WIDTH, STADIUM_LENGTH]} />
          <meshStandardMaterial color="#4a9c2d" /> {/* Rich grass green */}
        </mesh>
      </RigidBody>

      {/* Running track border (subtle terracotta) */}
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, 0.005, 0]}>
        <planeGeometry args={[TRACK_WIDTH + 4, TRACK_LENGTH + 4]} />
        <meshStandardMaterial color="#c4846c" /> {/* Subtle terracotta */}
      </mesh>

      {/* Trees in a more spread out pattern */}
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={`tree-left-${i}`} position={[-STADIUM_WIDTH/2.5, 0, -TRACK_LENGTH/2 + i * 15]}>
          {/* Trunk */}
          <mesh receiveShadow position={[0, 2, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 4]} />
            <meshStandardMaterial color="#854d0e" />
          </mesh>
          {/* Leaves */}
          <mesh receiveShadow position={[0, 4, 0]}>
            <coneGeometry args={[2, 5, 8]} />
            <meshStandardMaterial color="#166534" />
          </mesh>
        </group>
      ))}

      {Array.from({ length: 8 }).map((_, i) => (
        <group key={`tree-right-${i}`} position={[STADIUM_WIDTH/2.5, 0, -TRACK_LENGTH/2 + i * 15]}>
          {/* Trunk */}
          <mesh receiveShadow position={[0, 2, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 4]} />
            <meshStandardMaterial color="#854d0e" />
          </mesh>
          {/* Leaves */}
          <mesh receiveShadow position={[0, 4, 0]}>
            <coneGeometry args={[2, 5, 8]} />
            <meshStandardMaterial color="#166534" />
          </mesh>
        </group>
      ))}

      {/* Finish line structure */}
      <RigidBody type="fixed">
        <group position={[0, 0, TRACK_LENGTH/2 - 1]}>
          {/* Left pole */}
          <mesh receiveShadow position={[-TRACK_WIDTH/2 - 1, 3, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 6]} />
            <meshStandardMaterial color="#737373" />
          </mesh>
          {/* Right pole */}
          <mesh receiveShadow position={[TRACK_WIDTH/2 + 1, 3, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 6]} />
            <meshStandardMaterial color="#737373" />
          </mesh>
          {/* Top bar */}
          <mesh receiveShadow position={[0, 5.5, 0]}>
            <boxGeometry args={[TRACK_WIDTH + 4, 0.3, 0.3]} />
            <meshStandardMaterial color="#737373" />
          </mesh>
          {/* Finish banner */}
          <mesh receiveShadow position={[0, 5, 0]} rotation={[0, 0, 0]}>
            <planeGeometry args={[TRACK_WIDTH, 1]} />
            <meshStandardMaterial color="white" />
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[TRACK_WIDTH * 0.8, 0.4]} />
              <meshStandardMaterial color="#111111" />
            </mesh>
          </mesh>
        </group>
      </RigidBody>

      {/* Background mountains (more subtle) */}
      <group position={[0, 0, -STADIUM_LENGTH/2 - 10]}>
        <mesh receiveShadow position={[-40, 20, -20]}>
          <coneGeometry args={[25, 40, 4]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh receiveShadow position={[0, 25, -30]}>
          <coneGeometry args={[30, 50, 4]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh receiveShadow position={[40, 22, -25]}>
          <coneGeometry args={[27, 45, 4]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>
    </group>
  );
} 