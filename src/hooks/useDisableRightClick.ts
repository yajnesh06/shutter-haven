
import { useEffect } from 'react';

export function useDisableRightClick() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable right-click context menu
    document.addEventListener('contextmenu', handleContextMenu);

    // Prevent keyboard shortcuts for saving images
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S / Command+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
