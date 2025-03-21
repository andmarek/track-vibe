'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, useRapier } from '@react-three/rapier';
import { Mesh, Group, Euler, Vector3 } from 'three';
import { useGameStore } from '@/lib/game/store';
import { useKeyboardControls } from '@/lib/game/useKeyboardControls';

const MOVEMENT_SPEED = 5;
const CAMERA_ROTATION_SPEED = 0.02;
const RUNNING_SPEED = 0.1;
const CAMERA_DISTANCE = 8;
const CAMERA_HEIGHT = 4;

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
  const rigidBodyRef = useRef<any>(null);
  const bodyRef = useRef<Group>(null);
  const leftArmRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);
  const leftLegRef = useRef<Group>(null);
  const rightLegRef = useRef<Group>(null);
  const { updatePlayerPosition, updatePlayerRotation } = useGameStore();
  const controls = useKeyboardControls();
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

  useFrame((state, delta) => {
    if (!rigidBodyRef.current) return;

    const rigidBody = rigidBodyRef.current;
    const position = rigidBody.translation();
    const rotation = rigidBody.rotation();

    // Handle camera rotation with arrow keys
    if (controls.leftArrow) {
      cameraAngle.current += CAMERA_ROTATION_SPEED;
    }
    if (controls.rightArrow) {
      cameraAngle.current -= CAMERA_ROTATION_SPEED;
    }

    // Calculate movement in world space (independent of camera)
    let moveX = 0;
    let moveZ = 0;

    if (controls.forward) {
      moveZ = -MOVEMENT_SPEED; // Forward is -Z
    }
    if (controls.backward) {
      moveZ = MOVEMENT_SPEED; // Backward is +Z
    }
    if (controls.left) {
      moveX = -MOVEMENT_SPEED; // Left is -X
    }
    if (controls.right) {
      moveX = MOVEMENT_SPEED; // Right is +X
    }

    // Calculate rotation based on movement direction
    if (moveX !== 0 || moveZ !== 0) {
      const angle = Math.atan2(moveX, moveZ);
      playerRef.current?.rotation.set(0, angle, 0);
    }

    const isCurrentlyMoving = moveX !== 0 || moveZ !== 0;

    // Handle animation state changes
    if (isCurrentlyMoving && !isMoving.current) {
      // Only reset animation time when starting from a complete stop
      if (animationTime.current >= 1) {
        animationTime.current = 0;
      }
      isMoving.current = true;
    } else if (!isCurrentlyMoving && isMoving.current) {
      isMoving.current = false;
      // Don't reset animation time here anymore
    }

    // Update camera to follow player
    const cameraOffset = new Vector3(
      Math.sin(cameraAngle.current) * CAMERA_DISTANCE,
      CAMERA_HEIGHT,
      Math.cos(cameraAngle.current) * CAMERA_DISTANCE
    );
    camera.position.copy(new Vector3(position.x, position.y, position.z).add(cameraOffset));
    camera.lookAt(position.x, position.y + 1, position.z);

    // Apply movement while maintaining y position
    if (isCurrentlyMoving) {
      const currentVelocity = rigidBody.linvel();
      rigidBody.setLinvel(
        { 
          x: moveX, 
          y: currentVelocity.y,
          z: moveZ 
        }, 
        true
      );
      
      // Update animation time when moving
      animationTime.current = (animationTime.current + RUNNING_SPEED) % 1;

      // Update all limb rotations
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

    // Update store with new position and rotation
    updatePlayerPosition([position.x, position.y, position.z]);
    updatePlayerRotation([rotation.x, rotation.y, rotation.z]);
  });

  return (
    <RigidBody 
      ref={rigidBodyRef} 
      position={[0, 1, 45]}
      type="dynamic"
      lockRotations={true}
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