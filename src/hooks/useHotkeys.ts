
import { useEffect, useRef } from 'react';

type HotkeyConfig = {
  key: string;
  callback: () => void;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
};

export function useHotkeys(hotkeys: HotkeyConfig[]) {
  const hotkeysRef = useRef(hotkeys);
  
  // Update the ref when hotkeys change
  useEffect(() => {
    hotkeysRef.current = hotkeys;
  }, [hotkeys]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger hotkeys when typing in input elements
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const { key, ctrlKey, altKey, shiftKey } = event;

      hotkeysRef.current.forEach(hotkey => {
        if (
          key.toLowerCase() === hotkey.key.toLowerCase() &&
          (hotkey.ctrlKey === undefined || ctrlKey === hotkey.ctrlKey) &&
          (hotkey.altKey === undefined || altKey === hotkey.altKey) &&
          (hotkey.shiftKey === undefined || shiftKey === hotkey.shiftKey)
        ) {
          event.preventDefault();
          hotkey.callback();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
