export interface Player {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  isReady: boolean;
}

export interface GameState {
  players: Player[];
  isInLobby: boolean;
  isRaceStarted: boolean;
  currentPlayerId: string | null;
}

export interface GameStore extends GameState {
  setPlayerName: (name: string) => void;
  setPlayerReady: (ready: boolean) => void;
  updatePlayerPosition: (position: [number, number, number]) => void;
  updatePlayerRotation: (rotation: [number, number, number]) => void;
  startRace: () => void;
  joinLobby: () => void;
  leaveLobby: () => void;
} 