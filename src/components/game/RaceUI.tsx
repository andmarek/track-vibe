'use client';

import { useGameStore } from '@/lib/game/store';
import { useEffect, useState } from 'react';

export default function RaceUI() {
  const { gameState, raceStartTime, raceEndTime, distanceRemaining } = useGameStore();
  const [elapsedTime, setElapsedTime] = useState(0);

  // Update timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameState === 'RACING' && raceStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - raceStartTime);
      }, 10); // Update every 10ms for smooth timer
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, raceStartTime]);

  // Format time as MM:SS.mm
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Ready State Instructions */}
      {gameState === 'READY' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">100M SPRINT</h1>
          <p className="text-2xl text-white">Press W to start</p>
        </div>
      )}

      {/* Set State */}
      {gameState === 'SET' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-6xl font-bold text-white">GET READY!</h1>
        </div>
      )}

      {/* Race Information */}
      {(gameState === 'RACING' || gameState === 'FINISHED') && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-12 bg-black/50 p-4 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-white/70">DISTANCE REMAINING</p>
            <p className="text-3xl font-bold text-white">{distanceRemaining}m</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-white/70">TIME</p>
            <p className="text-3xl font-mono font-bold text-white">
              {formatTime(gameState === 'FINISHED' && raceEndTime && raceStartTime 
                ? raceEndTime - raceStartTime 
                : elapsedTime)}
            </p>
          </div>
        </div>
      )}

      {/* Finish State */}
      {gameState === 'FINISHED' && raceEndTime && raceStartTime && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center bg-black/70 p-8 rounded-lg">
          <h1 className="text-4xl font-bold text-white mb-4">FINISH!</h1>
          <p className="text-2xl text-white mb-2">Final Time</p>
          <p className="text-5xl font-mono font-bold text-white mb-6">
            {formatTime(raceEndTime - raceStartTime)}
          </p>
          <p className="text-white">Press R to restart</p>
        </div>
      )}
    </div>
  );
} 