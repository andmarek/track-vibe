import { useEffect, useState } from 'react';

export interface Controls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  leftArrow: boolean;
  rightArrow: boolean;
}

export function useKeyboardControls() {
  const [controls, setControls] = useState<Controls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    leftArrow: false,
    rightArrow: false,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'w':
          setControls((prev) => ({ ...prev, forward: true }));
          break;
        case 's':
          setControls((prev) => ({ ...prev, backward: true }));
          break;
        case 'a':
          setControls((prev) => ({ ...prev, left: true }));
          break;
        case 'd':
          setControls((prev) => ({ ...prev, right: true }));
          break;
        case 'arrowleft':
          setControls((prev) => ({ ...prev, leftArrow: true }));
          break;
        case 'arrowright':
          setControls((prev) => ({ ...prev, rightArrow: true }));
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'w':
          setControls((prev) => ({ ...prev, forward: false }));
          break;
        case 's':
          setControls((prev) => ({ ...prev, backward: false }));
          break;
        case 'a':
          setControls((prev) => ({ ...prev, left: false }));
          break;
        case 'd':
          setControls((prev) => ({ ...prev, right: false }));
          break;
        case 'arrowleft':
          setControls((prev) => ({ ...prev, leftArrow: false }));
          break;
        case 'arrowright':
          setControls((prev) => ({ ...prev, rightArrow: false }));
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