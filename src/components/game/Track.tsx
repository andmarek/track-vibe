'use client';

import { useRef } from 'react';
import { Mesh } from 'three';
import { RigidBody } from '@react-three/rapier';

// Track dimensions from technical drawing (in meters)
const STRAIGHT_LENGTH = 97.256;
const INNER_RADIUS = 27.082;
const OUTER_RADIUS = 40.022;
const TRACK_WIDTH = OUTER_RADIUS - INNER_RADIUS;
const TOTAL_LENGTH = 176.154;
const TOTAL_WIDTH = 89.26;

// Colors
const TRACK_COLOR = "#B93434"; // Terra cotta red color
const GRASS_COLOR = "#4a9c2d"; // Rich grass green

export default function Track() {
  return (
    <group>
      {/* Ground/Grass */}
      <RigidBody type="fixed">
        <mesh 
          receiveShadow 
          rotation-x={-Math.PI / 2} 
          position={[0, -0.02, 0]}
        >
          <planeGeometry args={[TOTAL_LENGTH + 20, TOTAL_WIDTH + 20]} />
          <meshStandardMaterial color={GRASS_COLOR} />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="trimesh">
        {/* Main track pieces */}
        <group>
          {/* Right straight */}
          <mesh 
            receiveShadow 
            position={[OUTER_RADIUS - TRACK_WIDTH/2, -0.01, 0]} 
            rotation-x={-Math.PI / 2}
          >
            <planeGeometry args={[TRACK_WIDTH, STRAIGHT_LENGTH]} />
            <meshStandardMaterial color={TRACK_COLOR} />
          </mesh>

          {/* Left straight */}
          <mesh 
            receiveShadow 
            position={[-OUTER_RADIUS + TRACK_WIDTH/2, -0.01, 0]} 
            rotation-x={-Math.PI / 2}
          >
            <planeGeometry args={[TRACK_WIDTH, STRAIGHT_LENGTH]} />
            <meshStandardMaterial color={TRACK_COLOR} />
          </mesh>

          {/* Bottom curve */}
          <mesh
            receiveShadow
            position={[0, -0.01, STRAIGHT_LENGTH/2]}
            rotation={[-Math.PI / 2, 0, Math.PI]}
          >
            <ringGeometry 
              args={[
                INNER_RADIUS, 
                OUTER_RADIUS, 
                64, // Increased segments for smoother curves
                1, 
                0, 
                Math.PI
              ]} 
            />
            <meshStandardMaterial color={TRACK_COLOR} />
          </mesh>

          {/* Top curve */}
          <mesh
            receiveShadow
            position={[0, -0.01, -STRAIGHT_LENGTH/2]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry 
              args={[
                INNER_RADIUS, 
                OUTER_RADIUS, 
                64, // Increased segments for smoother curves
                1, 
                0, 
                Math.PI
              ]} 
            />
            <meshStandardMaterial color={TRACK_COLOR} />
          </mesh>

          {/* Inner field */}
          <mesh
            receiveShadow
            position={[0, -0.015, 0]}
            rotation-x={-Math.PI / 2}
          >
            <planeGeometry args={[INNER_RADIUS * 2, STRAIGHT_LENGTH]} />
            <meshStandardMaterial color={GRASS_COLOR} />
          </mesh>
        </group>

        {/* Lane lines */}
        {Array.from({ length: 8 + 1 }).map((_, i) => {
          const xPos = -TRACK_WIDTH/2 + i * (TRACK_WIDTH / 8);
          return (
            <group key={`lane-${i}`}>
              {/* Right straight lane line */}
              <mesh
                position={[OUTER_RADIUS - TRACK_WIDTH/2 + xPos, 0.01, 0]}
                rotation-x={-Math.PI / 2}
              >
                <planeGeometry args={[0.05, STRAIGHT_LENGTH]} />
                <meshStandardMaterial color="white" />
              </mesh>

              {/* Left straight lane line */}
              <mesh
                position={[-OUTER_RADIUS + TRACK_WIDTH/2 + xPos, 0.01, 0]}
                rotation-x={-Math.PI / 2}
              >
                <planeGeometry args={[0.05, STRAIGHT_LENGTH]} />
                <meshStandardMaterial color="white" />
              </mesh>
            </group>
          );
        })}

        {/* Starting line */}
        <mesh
          position={[OUTER_RADIUS - TRACK_WIDTH/2, 0.01, -STRAIGHT_LENGTH/2 + 1]}
          rotation-x={-Math.PI / 2}
        >
          <planeGeometry args={[TRACK_WIDTH, 0.1]} />
          <meshStandardMaterial color="white" />
        </mesh>

        {/* Starting blocks */}
        {Array.from({ length: 8 }).map((_, i) => {
          const xPos = OUTER_RADIUS - TRACK_WIDTH/2 + i * (TRACK_WIDTH / 8) + (TRACK_WIDTH / 16);
          return (
            <RigidBody type="fixed" key={`block-${i}`}>
              <group position={[xPos, 0, -STRAIGHT_LENGTH/2 + 0.5]}>
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
      </RigidBody>
    </group>
  );
} 