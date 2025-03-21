'use client';

import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { OrbitControls, Sky } from '@react-three/drei';
import { Suspense } from 'react';
import Track from './Track';
import Player from './Player';
import Environment from './Environment';

export default function GameCanvas() {
  return (
    <div className="w-full h-screen">
      <Canvas
        shadows
        camera={{ 
          position: [-10, 10, 20],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
      >
        <Suspense fallback={null}>
          <Physics gravity={[0, -20, 0]}>
            {/* Sky */}
            <Sky sunPosition={[100, 20, 100]} />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow
              shadow-mapSize={[4096, 4096]}
              shadow-camera-far={100}
              shadow-camera-left={-50}
              shadow-camera-right={50}
              shadow-camera-top={50}
              shadow-camera-bottom={-50}
            />

            {/* Scene */}
            <group position={[0, 0, 0]}>
              <Environment />
              <Track />
              <Player />
            </group>

            {/* Debug controls */}
            <OrbitControls 
              target={[0, 0, 0]}
              minDistance={10}
              maxDistance={100}
              maxPolarAngle={Math.PI / 2.5}
              minPolarAngle={Math.PI / 4}
            />

            {/* Helper grid for debugging */}
            <gridHelper args={[100, 100]} />
            <axesHelper args={[5]} />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
} 