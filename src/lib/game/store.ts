import { create } from 'zustand';
import { Vector3 } from 'three';

// Import track dimensions
const STRAIGHT_LENGTH = 97.256;
const INNER_RADIUS = 27.082;
const OUTER_RADIUS = 40.022;
const TRACK_WIDTH = OUTER_RADIUS - INNER_RADIUS;

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
  resetPlayerPosition: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  gameState: 'READY',
  raceStartTime: null,
  raceEndTime: null,
  distanceRemaining: 100, // 100 meters
  playerPosition: [OUTER_RADIUS - TRACK_WIDTH/2 + TRACK_WIDTH/16, 1, STRAIGHT_LENGTH/2 - 1.5],
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
    // Assuming race starts at the new starting line position
    const totalDistance = 100;
    const startZ = STRAIGHT_LENGTH/2 - 1.5;
    const endZ = startZ - totalDistance;
    const currentDistance = Math.max(0, position.z - endZ);
    set({ distanceRemaining: Math.ceil(currentDistance) });

    // Check if race is finished
    if (currentDistance <= 0 && get().gameState === 'RACING') {
      get().endRace();
    }
  },

  resetPlayerPosition: () => {
    set({
      playerPosition: [OUTER_RADIUS - TRACK_WIDTH/2 + TRACK_WIDTH/16, 1, STRAIGHT_LENGTH/2 - 1.5],
      playerRotation: [0, 0, 0]
    });
  },

  resetGame: () => {
    set({
      gameState: 'READY',
      raceStartTime: null,
      raceEndTime: null,
      distanceRemaining: 100
    });
    get().resetPlayerPosition();
  },

  updatePlayerPosition: (position) => set({ playerPosition: position }),
  updatePlayerRotation: (rotation) => set({ playerRotation: rotation })
})); 