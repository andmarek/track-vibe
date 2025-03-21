'use client';

import { useRef } from 'react';
import { Mesh } from 'three';
import { useTexture } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

const TRACK_WIDTH = 20; // Width to accommodate 8 lanes
const TRACK_LENGTH = 100; // Length of the track
const LANE_WIDTH = 2.5; // Width of each lane
const NUM_LANES = 8;

export default function Track() {
  const trackRef = useRef<Mesh>(null);

  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh">
        {/* Main track surface */}
        <mesh 
          receiveShadow 
          rotation-x={-Math.PI / 2}
          position={[0, 0, 0]}
        >
          <planeGeometry args={[TRACK_WIDTH, TRACK_LENGTH]} />
          <meshStandardMaterial color="#8B4513" /> {/* Terra cotta color */}
        </mesh>

        {/* Lane lines */}
        {Array.from({ length: NUM_LANES + 1 }).map((_, i) => {
          const xPos = -TRACK_WIDTH / 2 + i * LANE_WIDTH;
          return (
            <mesh
              key={i}
              position={[xPos, 0.01, 0]}
              rotation-x={-Math.PI / 2}
            >
              <planeGeometry args={[0.05, TRACK_LENGTH]} />
              <meshStandardMaterial color="white" />
            </mesh>
          );
        })}

        {/* Lane markers (dashed lines) */}
        {Array.from({ length: NUM_LANES }).map((_, laneIndex) => {
          const xPos = -TRACK_WIDTH / 2 + laneIndex * LANE_WIDTH + LANE_WIDTH / 2;
          return Array.from({ length: 20 }).map((_, markerIndex) => (
            <mesh
              key={`marker-${laneIndex}-${markerIndex}`}
              position={[
                xPos,
                0.01,
                -TRACK_LENGTH / 2 + markerIndex * (TRACK_LENGTH / 20) + 1
              ]}
              rotation-x={-Math.PI / 2}
            >
              <planeGeometry args={[0.05, 1]} />
              <meshStandardMaterial color="white" />
            </mesh>
          ));
        })}

        {/* Starting line */}
        <mesh
          position={[0, 0.01, -TRACK_LENGTH / 2 + 1]}
          rotation-x={-Math.PI / 2}
        >
          <planeGeometry args={[TRACK_WIDTH, 0.1]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </RigidBody>

      {/* Starting blocks (simplified) */}
      {Array.from({ length: NUM_LANES }).map((_, i) => {
        const xPos = -TRACK_WIDTH / 2 + i * LANE_WIDTH + LANE_WIDTH / 2;
        return (
          <RigidBody type="fixed" key={`block-${i}`}>
            <group position={[xPos, 0, -TRACK_LENGTH / 2 + 0.5]}>
              <mesh position={[0, 0.1, 0]}>
                <boxGeometry args={[0.4, 0.2, 0.4]} />
                <meshStandardMaterial color="#444444" />
              </mesh>
              <mesh position={[0, 0.2, -0.1]} rotation={[0.3, 0, 0]}>
                <boxGeometry args={[0.3, 0.05, 0.2]} />
                <meshStandardMaterial color="#666666" />
              </mesh>
            </group>
          </RigidBody>
        );
      })}
    </group>
  );
} 