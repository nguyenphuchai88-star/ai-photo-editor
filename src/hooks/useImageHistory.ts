
import { useState, useCallback } from 'react';

export const useImageHistory = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const currentImage = history[currentIndex];
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const initializeHistory = useCallback((initialState: string) => {
    setHistory([initialState]);
    setCurrentIndex(0);
  }, []);

  const push = useCallback((newImage: string) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newImage);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [history, currentIndex]);

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  }, [canRedo]);

  const reset = useCallback((initialState: string) => {
    setHistory([initialState]);
    setCurrentIndex(0);
  }, []);

  return { currentImage, push, undo, redo, reset, canUndo, canRedo, initializeHistory };
};
