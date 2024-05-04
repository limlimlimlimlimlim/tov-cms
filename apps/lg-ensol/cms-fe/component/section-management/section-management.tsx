import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { getBaseUrl } from '../../util/axios-client';
import useSectionManager from './hooks/useSectionManager';
import { Button, Flex } from 'antd';

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

  const zoomIn = () => {
    const zoom = canvas.getZoom();
    if (zoom > 2) return;
    canvas.setZoom(zoom + 0.1);
  };
  const zoomOut = () => {
    const zoom = canvas.getZoom();
    if (zoom < 0.2) return;
    canvas.setZoom(zoom - 0.1);
  };
  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/fabric" onLoad={onLoadScript} />
      <div>
        <Flex justify="center">
          <canvas ref={canvasRef} />
        </Flex>
        <Flex gap="small" style={{ position: 'absolute', top: 100 }}>
          <Button size="small" onClick={zoomIn}>
            +
          </Button>
          <Button size="small" onClick={zoomOut}>
            -
          </Button>
        </Flex>
      </div>
    </>
  );
};
export default SectionManagement;
