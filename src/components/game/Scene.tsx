'use client';

import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import Player from './Player';
import Track from './Track';
import { OrbitControls } from '@react-three/drei';

export default function Scene() {
  return (
    <div className="h-screen w-full">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 75 }}>
        <Physics gravity={[0, -20, 0]}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 10]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />

          {/* Track */}
          <group position={[0, 0, 0]}>
            <Track />
          </group>

          {/* Player */}
          <Player />

          {/* Debug controls - remove in production */}
          {/* <OrbitControls /> */}
        </Physics>
      </Canvas>
    </div>
  );
} 