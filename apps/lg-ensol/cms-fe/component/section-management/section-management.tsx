import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { getBaseUrl } from '../../util/axios-client';
import useSectionManager from './hooks/useSectionManager';

declare const window;

const SectionManagement = ({ mapData }: any) => {
  const canvasRef = useRef(null);
  const { canvas, createCanvas, setMapImage } = useSectionManager();

  const onLoadScript = () => {
    console.log(canvasRef.current, window.fabric);
    if (!canvasRef.current) return;
    if (!window.fabric) return;
    createCanvas(canvasRef.current, { width: 800, height: 600 });
  };

  useEffect(() => {
    if (!canvas) return;
    if (!mapData) return;
    console.log(`${getBaseUrl()}/files/upload/${mapData.image}`);
    setMapImage(`${getBaseUrl()}/files/upload/${mapData.image}`);
  }, [canvas, mapData, setMapImage]);
  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/fabric" onLoad={onLoadScript} />
      <canvas ref={canvasRef} />
    </>
  );
};
export default SectionManagement;
