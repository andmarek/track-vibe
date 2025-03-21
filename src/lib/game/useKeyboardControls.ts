import { useEffect, useState } from 'react';

interface Controls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

export function useKeyboardControls() {
  const [controls, setControls] = useState<Controls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          setControls((prev) => ({ ...prev, forward: true }));
          break;
        case 'ArrowDown':
          setControls((prev) => ({ ...prev, backward: true }));
          break;
        case 'ArrowLeft':
          setControls((prev) => ({ ...prev, left: true }));
          break;
        case 'ArrowRight':
          setControls((prev) => ({ ...prev, right: true }));
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          setControls((prev) => ({ ...prev, forward: false }));
          break;
        case 'ArrowDown':
          setControls((prev) => ({ ...prev, backward: false }));
          break;
        case 'ArrowLeft':
          setControls((prev) => ({ ...prev, left: false }));
          break;
        case 'ArrowRight':
          setControls((prev) => ({ ...prev, right: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return controls;
} 