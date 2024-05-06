import { useState } from 'react';
import useAddSection from './useAddSection';
import useCanvasControl from './useCanvasControl';

declare const fabric: any;

const useSectionManager = () => {
  const [canvas, setCanvas] = useState<any>();
  const { init: initCanvasControl, zoomIn, zoomOut } = useCanvasControl();
  const { start: startAdd } = useAddSection();

  const createCanvas = (canvas, options?) => {
    const c = new fabric.Canvas(canvas, options);
    setCanvas(c);
    initCanvasControl(c);
  };

  const setMapImage = (url) => {
    if (!canvas) return;
    console.log(url);
    fabric.Image.fromURL(url, (image) => {
      image.selectable = false;
      image.evented = false;
      canvas.add(image);
    });
  };

  return {
    canvas,
    createCanvas,
    setMapImage,
    zoomIn,
    zoomOut,
    startAdd,
  };
};

export default useSectionManager;
