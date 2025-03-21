import { create } from 'zustand';
import { GameStore } from '@/types/game';

export const useGameStore = create<GameStore>((set) => ({
  players: [],
  isInLobby: false,
  isRaceStarted: false,
  currentPlayerId: null,

  setPlayerName: (name) =>
    set((state) => ({
      players: state.players.map((player) =>
        player.id === state.currentPlayerId
          ? { ...player, name }
          : player
      ),
    })),

  setPlayerReady: (ready) =>
    set((state) => ({
      players: state.players.map((player) =>
        player.id === state.currentPlayerId
          ? { ...player, isReady: ready }
          : player
      ),
    })),

  updatePlayerPosition: (position) =>
    set((state) => ({
      players: state.players.map((player) =>
        player.id === state.currentPlayerId
          ? { ...player, position }
          : player
      ),
    })),

  updatePlayerRotation: (rotation) =>
    set((state) => ({
      players: state.players.map((player) =>
        player.id === state.currentPlayerId
          ? { ...player, rotation }
          : player
      ),
    })),

  startRace: () => set({ isRaceStarted: true }),
  joinLobby: () => set({ isInLobby: true }),
  leaveLobby: () => set({ isInLobby: false }),
})); 