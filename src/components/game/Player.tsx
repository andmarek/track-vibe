'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, useRapier, RapierRigidBody } from '@react-three/rapier';
import { Mesh, Group, Euler, Vector3 } from 'three';
import { useGameStore } from '@/lib/game/store';
import { useKeyboardControls } from '@react-three/drei';

const MOVEMENT_SPEED = 5;
const CAMERA_ROTATION_SPEED = 0.02;
const CAMERA_VERTICAL_SPEED = 0.5;
const RUNNING_SPEED = 0.1;
const CAMERA_DISTANCE = 8;
const INITIAL_CAMERA_HEIGHT = 4;

// Track dimensions from technical drawing (in meters)
const STRAIGHT_LENGTH = 97.256;
const INNER_RADIUS = 27.082;
const OUTER_RADIUS = 40.022;
const TRACK_WIDTH = OUTER_RADIUS - INNER_RADIUS;

interface Keyframe {
  time: number;
  rotation: [number, number, number];
}

interface Animation {
  rotation: [number, number, number];
  keyframes: Keyframe[];
}

interface RunningAnimation {
  leftLeg: Animation;
  rightLeg: Animation;
  leftArm: Animation;
  rightArm: Animation;
  body: Animation;
}

export default function Player() {
  const playerRef = useRef<Group>(null);
  const rigidBody = useRef<RapierRigidBody>(null);
  const bodyRef = useRef<Group>(null);
  const leftArmRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);
  const leftLegRef = useRef<Group>(null);
  const rightLegRef = useRef<Group>(null);
  const { gameState, updateDistance, updatePlayerPosition, updatePlayerRotation, resetPlayerPosition } = useGameStore();
  const canMove = gameState === 'RACING';
  const cameraHeight = useRef(INITIAL_CAMERA_HEIGHT);

  const [, getKeys] = useKeyboardControls();

  const { world } = useRapier();
  const animationTime = useRef(0);
  const isMoving = useRef(false);
  const cameraAngle = useRef(0);
  const { camera } = useThree();

  // Create running animation keyframes
  const runningAnimation = useMemo<RunningAnimation>(() => ({
    body: {
      rotation: [0, 0, 0],
      keyframes: [
        { time: 0, rotation: [0, 0, 0] },
        { time: 0.5, rotation: [0.1, 0, 0] },
        { time: 1, rotation: [0, 0, 0] },
      ],
    },
    leftLeg: {
      rotation: [0, 0, 0],
      keyframes: [
        { time: 0, rotation: [0, 0, 0] },
        { time: 0.5, rotation: [Math.PI / 3, 0, 0] },
        { time: 1, rotation: [0, 0, 0] },
      ],
    },
    rightLeg: {
      rotation: [0, 0, 0],
      keyframes: [
        { time: 0, rotation: [Math.PI / 3, 0, 0] },
        { time: 0.5, rotation: [0, 0, 0] },
        { time: 1, rotation: [Math.PI / 3, 0, 0] },
      ],
    },
    leftArm: {
      rotation: [0, 0, 0],
      keyframes: [
        { time: 0, rotation: [0, 0, -Math.PI / 3] },
        { time: 0.5, rotation: [0, 0, Math.PI / 3] },
        { time: 1, rotation: [0, 0, -Math.PI / 3] },
      ],
    },
    rightArm: {
      rotation: [0, 0, 0],
      keyframes: [
        { time: 0, rotation: [0, 0, Math.PI / 3] },
        { time: 0.5, rotation: [0, 0, -Math.PI / 3] },
        { time: 1, rotation: [0, 0, Math.PI / 3] },
      ],
    },
  }), []);

  // Helper function to interpolate between keyframes
  const interpolateKeyframes = (keyframes: Keyframe[], time: number): [number, number, number] => {
    if (!keyframes || keyframes.length === 0) {
      return [0, 0, 0];
    }

    const t = time % 1;
    const index = Math.floor(time * (keyframes.length - 1));
    const nextIndex = (index + 1) % keyframes.length;
    
    const keyframe = keyframes[index];
    const nextKeyframe = keyframes[nextIndex];
    
    if (!keyframe || !nextKeyframe) {
      return [0, 0, 0];
    }

    return [
      keyframe.rotation[0] + (nextKeyframe.rotation[0] - keyframe.rotation[0]) * t,
      keyframe.rotation[1] + (nextKeyframe.rotation[1] - keyframe.rotation[1]) * t,
      keyframe.rotation[2] + (nextKeyframe.rotation[2] - keyframe.rotation[2]) * t,
    ];
  };

  // Initialize animation state
  useEffect(() => {
    animationTime.current = 0;
    isMoving.current = false;
    cameraAngle.current = 0;
  }, []);

  // Handle game state changes
  useEffect(() => {
    if (gameState === 'READY' && rigidBody.current) {
      // Reset player position and rotation
      rigidBody.current.setTranslation({ 
        x: OUTER_RADIUS - TRACK_WIDTH/2 + TRACK_WIDTH/16, 
        y: 1, 
        z: STRAIGHT_LENGTH/2 - 1.5 
      }, true);
      rigidBody.current.setRotation({ w: 1, x: 0, y: 0, z: 0 }, true);
      playerRef.current?.rotation.set(0, 0, 0);
      resetPlayerPosition();
    }
  }, [gameState, resetPlayerPosition]);

  useFrame(() => {
    if (!rigidBody.current) return;

    const { forward, backward, left, right, cameraLeft, cameraRight, cameraUp, cameraDown } = getKeys();
    const position = rigidBody.current.translation();
    const rotation = rigidBody.current.rotation();

    // Handle camera rotation with arrow keys
    if (cameraLeft) {
      cameraAngle.current += CAMERA_ROTATION_SPEED;
    }
    if (cameraRight) {
      cameraAngle.current -= CAMERA_ROTATION_SPEED;
    }

    // Handle camera height with up/down arrows
    if (cameraUp) {
      cameraHeight.current = Math.min(cameraHeight.current + CAMERA_VERTICAL_SPEED, 10);
    }
    if (cameraDown) {
      cameraHeight.current = Math.max(cameraHeight.current - CAMERA_VERTICAL_SPEED, 2);
    }

    // For now, only handle forward/backward movement for the 100m sprint
    let moveZ = 0;

    if (canMove) {
      if (forward) {
        moveZ = -MOVEMENT_SPEED; // Forward is -Z
      }
      if (backward) {
        moveZ = MOVEMENT_SPEED; // Backward is +Z
      }
    }

    const isCurrentlyMoving = moveZ !== 0;

    // Handle animation state changes
    if (isCurrentlyMoving && !isMoving.current) {
      // Only reset animation time when starting from a complete stop
      if (animationTime.current >= 1) {
        animationTime.current = 0;
      }
      isMoving.current = true;
    } else if (!isCurrentlyMoving && isMoving.current) {
      isMoving.current = false;
    }

    // Update camera to follow player
    const cameraOffset = new Vector3(
      Math.sin(cameraAngle.current) * CAMERA_DISTANCE,
      cameraHeight.current,
      Math.cos(cameraAngle.current) * CAMERA_DISTANCE
    );
    camera.position.copy(new Vector3(position.x, position.y, position.z).add(cameraOffset));
    camera.lookAt(position.x, position.y + 1, position.z);

    // Apply movement while maintaining y position
    if (isCurrentlyMoving) {
      const currentVelocity = rigidBody.current.linvel();
      rigidBody.current.setLinvel(
        { 
          x: 0, // No sideways movement for now
          y: currentVelocity.y,
          z: moveZ 
        }, 
        true
      );
      
      // Update animation time when moving
      animationTime.current = (animationTime.current + RUNNING_SPEED) % 1;

      // Update all limb rotations for running animation
      if (bodyRef.current) {
        bodyRef.current.rotation.set(...interpolateKeyframes(runningAnimation.body.keyframes, animationTime.current));
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.set(...interpolateKeyframes(runningAnimation.leftArm.keyframes, animationTime.current));
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.set(...interpolateKeyframes(runningAnimation.rightArm.keyframes, animationTime.current));
      }
      if (leftLegRef.current) {
        leftLegRef.current.rotation.set(...interpolateKeyframes(runningAnimation.leftLeg.keyframes, animationTime.current));
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.set(...interpolateKeyframes(runningAnimation.rightLeg.keyframes, animationTime.current));
      }
    } else {
      // When not moving, smoothly return to default position
      const lerpFactor = 0.1;
      if (bodyRef.current) {
        bodyRef.current.rotation.x *= (1 - lerpFactor);
        bodyRef.current.rotation.y *= (1 - lerpFactor);
        bodyRef.current.rotation.z *= (1 - lerpFactor);
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x *= (1 - lerpFactor);
        leftArmRef.current.rotation.y *= (1 - lerpFactor);
        leftArmRef.current.rotation.z *= (1 - lerpFactor);
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x *= (1 - lerpFactor);
        rightArmRef.current.rotation.y *= (1 - lerpFactor);
        rightArmRef.current.rotation.z *= (1 - lerpFactor);
      }
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x *= (1 - lerpFactor);
        leftLegRef.current.rotation.y *= (1 - lerpFactor);
        leftLegRef.current.rotation.z *= (1 - lerpFactor);
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x *= (1 - lerpFactor);
        rightLegRef.current.rotation.y *= (1 - lerpFactor);
        rightLegRef.current.rotation.z *= (1 - lerpFactor);
      }
    }

    // Update store with current position and rotation
    updatePlayerPosition([position.x, position.y, position.z]);
    updatePlayerRotation([rotation.x, rotation.y, rotation.z]);

    // Update distance for race tracking
    updateDistance(new Vector3(position.x, position.y, position.z));
  });

  return (
    <RigidBody
      ref={rigidBody}
      colliders="ball"
      mass={1}
      position={[OUTER_RADIUS - TRACK_WIDTH/2 + TRACK_WIDTH/16, 1, STRAIGHT_LENGTH/2 - 1.5]}
      enabledRotations={[false, false, false]} // Lock all rotations for now
    >
      <group ref={playerRef}>
        {/* Body */}
        <group ref={bodyRef}>
          {/* Torso */}
          <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
            <boxGeometry args={[0.6, 0.9, 0.3]} />
            <meshStandardMaterial color="#e53e3e" />
          </mesh>

          {/* Head */}
          <mesh castShadow receiveShadow position={[0, 1.3, 0]}>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial color="#e53e3e" />
          </mesh>

          {/* Arms */}
          <group ref={leftArmRef} position={[-0.35, 0.9, 0]}>
            {/* Upper arm */}
            <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
              <boxGeometry args={[0.2, 0.6, 0.2]} />
              <meshStandardMaterial color="#e53e3e" />
            </mesh>
            {/* Hand */}
            <mesh castShadow receiveShadow position={[0, -0.5, 0]}>
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial color="#e53e3e" />
            </mesh>
          </group>

          <group ref={rightArmRef} position={[0.35, 0.9, 0]}>
            {/* Upper arm */}
            <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
              <boxGeometry args={[0.2, 0.6, 0.2]} />
              <meshStandardMaterial color="#e53e3e" />
            </mesh>
            {/* Hand */}
            <mesh castShadow receiveShadow position={[0, -0.5, 0]}>
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial color="#e53e3e" />
            </mesh>
          </group>

          {/* Legs */}
          <group ref={leftLegRef} position={[-0.15, 0.15, 0]}>
            {/* Full leg */}
            <mesh castShadow receiveShadow position={[0, -0.3, 0]}>
              <boxGeometry args={[0.2, 0.6, 0.2]} />
              <meshStandardMaterial color="#2d3748" />
            </mesh>
            {/* Foot */}
            <mesh castShadow receiveShadow position={[0, -0.6, 0.05]}>
              <boxGeometry args={[0.2, 0.2, 0.3]} />
              <meshStandardMaterial color="#2d3748" />
            </mesh>
          </group>

          <group ref={rightLegRef} position={[0.15, 0.15, 0]}>
            {/* Full leg */}
            <mesh castShadow receiveShadow position={[0, -0.3, 0]}>
              <boxGeometry args={[0.2, 0.6, 0.2]} />
              <meshStandardMaterial color="#2d3748" />
            </mesh>
            {/* Foot */}
            <mesh castShadow receiveShadow position={[0, -0.6, 0.05]}>
              <boxGeometry args={[0.2, 0.2, 0.3]} />
              <meshStandardMaterial color="#2d3748" />
            </mesh>
          </group>
        </group>
      </group>
    </RigidBody>
  );
} 