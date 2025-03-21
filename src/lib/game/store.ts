import { create } from 'zustand';
import { Vector3 } from 'three';

export type GameState = 'READY' | 'SET' | 'RACING' | 'FINISHED';

interface GameStore {
  // Game state
  gameState: GameState;
  setGameState: (state: GameState) => void;
  
  // Race stats
  raceStartTime: number | null;
  raceEndTime: number | null;
  distanceRemaining: number;

  // Player state
  playerPosition: [number, number, number];
  playerRotation: [number, number, number];
  
  // Methods
  startRace: () => void;
  endRace: () => void;
  updateDistance: (position: Vector3) => void;
  resetGame: () => void;
  updatePlayerPosition: (position: [number, number, number]) => void;
  updatePlayerRotation: (rotation: [number, number, number]) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  gameState: 'READY',
  raceStartTime: null,
  raceEndTime: null,
  distanceRemaining: 100, // 100 meters
  playerPosition: [0, 1, 45],
  playerRotation: [0, 0, 0],

  setGameState: (state) => set({ gameState: state }),

  startRace: () => {
    set({
      gameState: 'RACING',
      raceStartTime: Date.now(),
      raceEndTime: null,
      distanceRemaining: 100
    });
  },

  endRace: () => {
    set({
      gameState: 'FINISHED',
      raceEndTime: Date.now()
    });
  },

  updateDistance: (position: Vector3) => {
    // Calculate distance remaining based on player's Z position
    // Assuming race starts at Z = 45 (player starting position) and ends at Z = -55
    const totalDistance = 100;
    const startZ = 45;
    const endZ = startZ - totalDistance;
    const currentDistance = Math.max(0, position.z - endZ);
    set({ distanceRemaining: Math.ceil(currentDistance) });

    // Check if race is finished
    if (currentDistance <= 0 && get().gameState === 'RACING') {
      get().endRace();
    }
  },

  resetGame: () => {
    set({
      gameState: 'READY',
      raceStartTime: null,
      raceEndTime: null,
      distanceRemaining: 100,
      playerPosition: [0, 1, 45],
      playerRotation: [0, 0, 0]
    });
  },

  updatePlayerPosition: (position) => set({ playerPosition: position }),
  updatePlayerRotation: (rotation) => set({ playerRotation: rotation })
})); 