import { useState } from 'react';

declare const window;

const useSectionManager = () => {
  const [canvas, setCanvas] = useState();
  const createCanvas = (canvas, options?) => {
    setCanvas(new window.fabric.Canvas(canvas, options));
  };

  return {
    canvas,
    createCanvas,
  };
};

export default useSectionManager;
