'use client';

import Environment from './Environment';
import Track from './Track';
import Player from './Player';
import { Sky, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';

export default function Scene() {
  return (
    <div className="h-screen w-full">
      <Canvas shadows camera={{ position: [0, 15, 60], fov: 50 }}>
        <Physics gravity={[0, -20, 0]}>
          <Sky sunPosition={[100, 20, 100]} />
          
          <ambientLight intensity={0.5} />
          <directionalLight
            castShadow
            position={[10, 10, 5]}
            intensity={1.5}
            shadow-mapSize={[4096, 4096]}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
          />

          <group position={[0, 0, 0]}>
            <Environment />
            <Track />
            <Player />
          </group>

          <OrbitControls target={[0, 0, 0]} />
        </Physics>
      </Canvas>
    </div>
  );
} 