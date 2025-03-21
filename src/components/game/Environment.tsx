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

      {/* Stadium Stands */}
      {/* Left side stands */}
      <RigidBody type="fixed">
        <group position={[-TRACK_WIDTH - 5, 0, 0]}>
          <mesh receiveShadow position={[0, 2, 0]}>
            <boxGeometry args={[10, 4, TRACK_LENGTH]} />
            <meshStandardMaterial color="#d4d4d8" /> {/* Light gray */}
          </mesh>
          {/* Seats */}
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh 
              key={`left-seat-row-${i}`} 
              receiveShadow 
              position={[0, 1 + i * 0.5, 0]} 
              rotation={[0.3, 0, 0]}
            >
              <boxGeometry args={[10, 0.1, TRACK_LENGTH]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#dc2626" : "#71717a"} />
            </mesh>
          ))}
        </group>
      </RigidBody>

      {/* Right side stands */}
      <RigidBody type="fixed">
        <group position={[TRACK_WIDTH + 5, 0, 0]}>
          <mesh receiveShadow position={[0, 2, 0]}>
            <boxGeometry args={[10, 4, TRACK_LENGTH]} />
            <meshStandardMaterial color="#d4d4d8" />
          </mesh>
          {/* Seats */}
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh 
              key={`right-seat-row-${i}`} 
              receiveShadow 
              position={[0, 1 + i * 0.5, 0]} 
              rotation={[0.3, 0, 0]}
            >
              <boxGeometry args={[10, 0.1, TRACK_LENGTH]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#dc2626" : "#71717a"} />
            </mesh>
          ))}
        </group>
      </RigidBody>

      {/* Trees */}
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={`tree-left-${i}`} position={[-STADIUM_WIDTH/4, 0, -TRACK_LENGTH/2 + i * 15]}>
          {/* Trunk */}
          <mesh receiveShadow position={[0, 2, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 4]} />
            <meshStandardMaterial color="#854d0e" />
          </mesh>
          {/* Leaves */}
          <mesh receiveShadow position={[0, 4, 0]}>
            <coneGeometry args={[1.5, 4, 8]} />
            <meshStandardMaterial color="#166534" />
          </mesh>
        </group>
      ))}

      {Array.from({ length: 8 }).map((_, i) => (
        <group key={`tree-right-${i}`} position={[STADIUM_WIDTH/4, 0, -TRACK_LENGTH/2 + i * 15]}>
          {/* Trunk */}
          <mesh receiveShadow position={[0, 2, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 4]} />
            <meshStandardMaterial color="#854d0e" />
          </mesh>
          {/* Leaves */}
          <mesh receiveShadow position={[0, 4, 0]}>
            <coneGeometry args={[1.5, 4, 8]} />
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
          <mesh receiveShadow position={[0, 5, 0]}>
            <planeGeometry args={[TRACK_WIDTH, 1]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </group>
      </RigidBody>

      {/* Background mountains */}
      <group position={[0, 0, -STADIUM_LENGTH/2]}>
        <mesh receiveShadow position={[-30, 15, -10]}>
          <coneGeometry args={[20, 30, 4]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh receiveShadow position={[0, 20, -20]}>
          <coneGeometry args={[25, 40, 4]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh receiveShadow position={[30, 17, -15]}>
          <coneGeometry args={[22, 35, 4]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>
    </group>
  );
} 