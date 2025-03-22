'use client';

import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { OrbitControls, Sky, KeyboardControls } from '@react-three/drei';
import { Suspense, useEffect } from 'react';
import Track from './Track';
import Player from './Player';
import Environment from './Environment';
import RaceUI from './RaceUI';
import { useGameStore } from '@/lib/game/store';

export default function GameCanvas() {
  const { gameState, startRace, resetGame } = useGameStore();

  // Handle keyboard events for game state changes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'READY' && e.key.toLowerCase() === 'w') {
        startRace();
      } else if (gameState === 'FINISHED' && e.key.toLowerCase() === 'r') {
        resetGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startRace, resetGame]);

  return (
    <div className="w-full h-screen relative">
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['w', 'W'] },
          { name: 'backward', keys: ['s', 'S'] },
          { name: 'left', keys: ['a', 'A'] },
          { name: 'right', keys: ['d', 'D'] },
          { name: 'cameraLeft', keys: ['ArrowLeft'] },
          { name: 'cameraRight', keys: ['ArrowRight'] },
          { name: 'cameraUp', keys: ['ArrowUp'] },
          { name: 'cameraDown', keys: ['ArrowDown'] },
        ]}
      >
        <Canvas
          shadows
          camera={{ 
            position: [0, 15, 60],
            fov: 50,
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

              {/* Camera Controls */}
              <OrbitControls 
                target={[0, 0, 0]}
                minDistance={10}
                maxDistance={100}
                maxPolarAngle={Math.PI / 2.5}
                minPolarAngle={Math.PI / 4}
                enabled={true}
              />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
      <RaceUI />
    </div>
  );
} 