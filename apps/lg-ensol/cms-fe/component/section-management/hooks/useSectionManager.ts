import { useState } from 'react';

declare const window;

const useSectionManager = () => {
  const [canvas, setCanvas] = useState<any>();
  const createCanvas = (canvas, options?) => {
    setCanvas(new window.fabric.Canvas(canvas, options));
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
