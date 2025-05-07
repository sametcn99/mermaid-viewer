import { useCallback, useEffect, useRef, useState } from "react";

interface UseResizablePanelsOptions {
  initialSize?: number;
  minSize?: number;
  maxSize?: number;
  isVertical?: boolean;
}

export function useResizablePanels(options: UseResizablePanelsOptions = {}) {
  const {
    initialSize = 50,
    minSize = 10,
    maxSize = 90,
    isVertical = false,
  } = options;
  const [panelSize, setPanelSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    setIsResizing(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!isResizing || !containerRef.current) return;

      const container = containerRef.current;
      const bounds = container.getBoundingClientRect();
      let newSizePct;

      if (isVertical) {
        const clientY =
          "touches" in event ? event.touches[0].clientY : event.clientY;
        newSizePct = ((clientY - bounds.top) / bounds.height) * 100;
      } else {
        const clientX =
          "touches" in event ? event.touches[0].clientX : event.clientX;
        newSizePct = ((clientX - bounds.left) / bounds.width) * 100;
      }

      const actualMinSize = isVertical ? 0 : minSize;
      const actualMaxSize = isVertical ? 100 : maxSize;
      setPanelSize(
        Math.min(Math.max(newSizePct, actualMinSize), actualMaxSize),
      );
    },
    [isResizing, minSize, maxSize, isVertical],
  );

  useEffect(() => {
    const currentIsResizing = isResizing;

    const mouseMoveHandler = (e: MouseEvent) => handleMouseMove(e);
    const touchMoveHandler = (e: TouchEvent) => handleMouseMove(e);
    const mouseUpHandler = () => handleMouseUp();
    const touchEndHandler = () => handleMouseUp();

    if (currentIsResizing) {
      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
      document.addEventListener("touchmove", touchMoveHandler, {
        passive: false,
      });
      document.addEventListener("touchend", touchEndHandler);
    }

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
      document.removeEventListener("touchmove", touchMoveHandler);
      document.removeEventListener("touchend", touchEndHandler);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return {
    panelSize,
    containerRef,
    handleMouseDown,
    isResizing,
  };
}
