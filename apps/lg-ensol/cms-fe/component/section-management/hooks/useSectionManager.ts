import { useRef, useState } from 'react';

declare const window;

const useSectionManager = () => {
  const [canvas, setCanvas] = useState<any>();
  const isDragging = useRef(false);
  const lastDragPosition = useRef({ x: 0, y: 0 });

  const createCanvas = (canvas, options?) => {
    const c = new window.fabric.Canvas(canvas, options);
    setCanvas(c);
    initCanvasMouseEvent(c);
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

  const setMapImage = (url) => {
    if (!canvas) return;
    window.fabric.Image.fromURL(url, (image) => {
      image.selectable = false;
      console.log(image);
      canvas.add(image);
    });
  };

  return {
    canvas,
    createCanvas,
    setMapImage,
  };
};

export default useSectionManager;
