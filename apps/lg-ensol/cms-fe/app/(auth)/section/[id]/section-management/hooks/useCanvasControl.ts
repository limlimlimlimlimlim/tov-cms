import { useRef } from 'react';

const useCanvasControl = () => {
  const canvas = useRef<any>();
  const isDragging = useRef(false);
  const lastDragPosition = useRef({ x: 0, y: 0 });

  const init = (c) => {
    canvas.current = c;
    initCanvasMouseEvent(c);
  };

  const zoomIn = () => {
    const zoom = canvas.current.getZoom();
    if (zoom > 2) return;
    canvas.current.setZoom(zoom + 0.1);
  };
  const zoomOut = () => {
    const zoom = canvas.current.getZoom();
    if (zoom < 0.2) return;
    canvas.current.setZoom(zoom - 0.1);
  };

  const initCanvasMouseEvent = (canvas) => {
    canvas.on('mouse:down', ({ e }) => {
      if (e.altKey) {
        isDragging.current = true;
        lastDragPosition.current = { x: e.clientX, y: e.clientY };
        canvas.selection = false;
      }
    });

    canvas.on('mouse:move', ({ e }) => {
      if (isDragging.current) {
        const vpt = canvas.viewportTransform;
        vpt[4] += e.clientX - lastDragPosition.current.x;
        vpt[5] += e.clientY - lastDragPosition.current.y;
        canvas.requestRenderAll();
        lastDragPosition.current = { x: e.clientX, y: e.clientY };
      }
    });

    canvas.on('mouse:up', () => {
      if (isDragging.current) {
        canvas.setViewportTransform(canvas.viewportTransform);
        canvas.selection = true;
        isDragging.current = false;
      }
    });
  };

  return {
    init,
    zoomIn,
    zoomOut,
  };
};

export default useCanvasControl;