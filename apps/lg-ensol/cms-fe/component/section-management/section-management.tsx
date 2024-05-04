import Script from 'next/script';
import { useEffect, useRef } from 'react';
import useSectionManager from './hooks/useSectionManager';

declare const window;

const SectionManagement = () => {
  const canvasRef = useRef(null);
  const { canvas, createCanvas } = useSectionManager();

  const onLoadScript = () => {
    console.log(canvasRef.current, window.fabric);
    if (!canvasRef.current) return;
    if (!window.fabric) return;
    createCanvas(canvasRef.current, { width: 800, height: 600 });
  };

  useEffect(() => {
    if (!canvas) return;
    console.log(canvas);
  }, [canvas]);
  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/fabric" onLoad={onLoadScript} />
      <canvas ref={canvasRef} />
    </>
  );
};
export default SectionManagement;
