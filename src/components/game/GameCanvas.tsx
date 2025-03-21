'use client';

import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Environment, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import Track from './Track';
import Player from './Player';

export default function GameCanvas() {
  return (
    <div className="w-full h-screen">
      <Canvas
        shadows
        className="bg-sky-500"
        camera={{ 
          position: [0, 20, 60], // Higher up and further back
          fov: 60,
          near: 0.1,
          far: 1000
        }}
      >
        <Suspense fallback={null}>
          <Physics debug>
            <ambientLight intensity={0.7} />
            <directionalLight
              position={[10, 20, 10]}
              intensity={1.5}
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-camera-far={100}
            />
            <Track />
            <Player />
            <OrbitControls 
              minDistance={40}
              maxDistance={100}
              maxPolarAngle={Math.PI / 2.5} // Limit how high the camera can go
              minPolarAngle={Math.PI / 4} // Limit how low the camera can go
            />
            <Environment preset="sunset" />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
} 