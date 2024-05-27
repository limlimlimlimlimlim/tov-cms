import { useCallback, useContext, useEffect, useRef } from 'react';
import { Button, Card, Flex } from 'antd';
import { getBaseUrl } from '../../../../../../util/axios-client';
import { SectionContext } from '../../section-context';
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';

declare const Konva: any;
interface Pros {
  mapData: any;
}

const SectionManagement = ({ mapData }: Pros) => {
  const { stage, setStage } = useContext<any>(SectionContext);
  const stageContainer = useRef<any>(null);

  const setBackgroundImage = useCallback((stage, url) => {
    const bgLayer = new Konva.Layer();
    stage.add(bgLayer);
    const imageObj = new Image();
    imageObj.onload = () => {
      const bg = new Konva.Image({
        image: imageObj,
        width: imageObj.width,
        height: imageObj.height,
      });
      bgLayer.add(bg);
    };
    imageObj.src = url;
  }, []);

  const zoomIn = () => {
    const { x } = stage.scale();
    if (x > 2) return;
    const scale = x + 0.05;
    stage.scale({ x: scale, y: scale });
  };

  const zoomOut = () => {
    const { x } = stage.scale();
    if (x < 0.2) return;
    const scale = x - 0.05;
    stage.scale({ x: scale, y: scale });
  };

  const initDragStage = (stage) => {
    stage.on('mousedown', (e) => {
      if (e.evt.altKey) {
        stage.draggable(true);
      }

      const muoseupHandler = () => {
        stage.draggable(false);
        stage.off('mouseup', muoseupHandler);
      };
      stage.on('mouseup', muoseupHandler);
    });
  };

  useEffect(() => {
    if (!mapData) return;
    const stage = new Konva.Stage({
      container: stageContainer.current,
      width: 1400,
      height: 750,
    });
    setStage(stage);
    initDragStage(stage);
    setBackgroundImage(stage, `${getBaseUrl()}/files/upload/${mapData.image}`);
  }, [mapData, setBackgroundImage, setStage]);

  return (
    <>
      <Flex justify="center" style={{ backgroundColor: '#EEE' }}>
        <div ref={stageContainer} />
      </Flex>
      <Flex gap="small" style={{ position: 'absolute', top: 110, left: 40 }}>
        <Flex gap="small">
          <Button onClick={zoomIn}>
            <ZoomInOutlined />
          </Button>
          <Button onClick={zoomOut}>
            <ZoomOutOutlined />
          </Button>
        </Flex>
      </Flex>
    </>
  );
};
export default SectionManagement;
