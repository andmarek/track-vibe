'use client';

import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import Player from './Player';
import Track from './Track';
import Environment from './Environment';
import { OrbitControls, Sky } from '@react-three/drei';

export default function Scene() {
  return (
    <div className="h-screen w-full">
      <Canvas 
        shadows 
        camera={{ 
          position: [-10, 10, 20], 
          fov: 60,
          near: 0.1,
          far: 1000
        }}
      >
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

          {/* Debug controls - uncomment to debug camera position */}
          <OrbitControls target={[0, 0, 0]} />

          {/* Helper grid for debugging */}
          <gridHelper args={[100, 100]} />
          <axesHelper args={[5]} />
        </Physics>
      </Canvas>
    </div>
  );
} 