import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { Button, Flex } from 'antd';
import { getBaseUrl } from '../../util/axios-client';
import { SectionManagementStatus } from '../../interface/section';
import useSectionManager from './hooks/useSectionManager';

declare const window;

interface Pros {
  mapData: any;
  status: SectionManagementStatus;
}

const SectionManagement = ({ mapData, status }: Pros) => {
  const canvasRef = useRef(null);
  const { canvas, createCanvas, setMapImage, initAdd } = useSectionManager();

  const onLoadScript = () => {
    console.log(canvasRef.current, window.fabric);
    if (!canvasRef.current) return;
    if (!window.fabric) return;
    createCanvas(canvasRef.current, { width: 800, height: 600 });
  };

  useEffect(() => {
    if (!canvas) return;
    if (!mapData) return;
    setMapImage(`${getBaseUrl()}/files/upload/${mapData.image}`);
  }, [canvas, mapData, setMapImage]);

  useEffect(() => {
    if (!canvas) return;
    switch (status) {
      case SectionManagementStatus.View:
        break;
      case SectionManagementStatus.Add:
        initAdd(canvas);
        break;
    }
  }, [canvas, initAdd, status]);

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
