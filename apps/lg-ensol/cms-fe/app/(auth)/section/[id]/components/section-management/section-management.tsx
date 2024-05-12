import Script from 'next/script';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { Button, Flex } from 'antd';
import { getBaseUrl } from '../../../../../../util/axios-client';
import { SectionContext } from '../../section-context';
import useCanvasControl from '../../hooks/useCanvasControl';

declare const fabric;
interface Pros {
  mapData: any;
}

const SectionManagement = ({ mapData }: Pros) => {
  const { canvas, setCanvas } = useContext<any>(SectionContext);
  const canvasRef = useRef<any>(null);
  const { zoomIn, zoomOut } = useCanvasControl();

  const onLoadScript = () => {
    if (!canvasRef.current) return;
    if (!fabric) return;
    const c = new fabric.Canvas(canvasRef.current, { width: 800, height: 600 });
    setCanvas(c);
  };

  const setMapImage = useCallback(
    (url) => {
      if (!canvas) return;
      fabric.Image.fromURL(url, (image) => {
        canvas.setBackgroundImage(image);
      });
    },
    [canvas],
  );

  useEffect(() => {
    if (!canvas) return;
    if (!mapData) return;
    setMapImage(`${getBaseUrl()}/files/upload/${mapData.image}`);
  }, [canvas, mapData, setMapImage]);

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
