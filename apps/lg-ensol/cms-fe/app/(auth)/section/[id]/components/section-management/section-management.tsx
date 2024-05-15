import { useCallback, useContext, useEffect, useRef } from 'react';
import { Button, Flex } from 'antd';
import { getBaseUrl } from '../../../../../../util/axios-client';
import { SectionContext } from '../../section-context';

declare const Konva: any;
interface Pros {
  mapData: any;
}

const SectionManagement = ({ mapData }: Pros) => {
  const { stage, setStage, setSize } = useContext<any>(SectionContext);
  const stageContainer = useRef<any>(null);

  const setBackgroundImage = useCallback(
    (stage, url) => {
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
        setSize({ width: bg.width(), heigh: bg.height() });
        console.log(stage.width);
      };
      imageObj.src = url;
    },
    [setSize],
  );

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
        console.log(e);
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
      width: 800,
      height: 600,
    });
    setStage(stage);
    initDragStage(stage);
    setBackgroundImage(stage, `${getBaseUrl()}/files/upload/${mapData.image}`);
  }, [mapData, setBackgroundImage, setStage]);

  return (
    <>
      <Flex justify="center">
        <div ref={stageContainer} />
      </Flex>
      <Flex gap="small" style={{ position: 'absolute', top: 100 }}>
        <Button size="small" onClick={zoomIn}>
          +
        </Button>
        <Button size="small" onClick={zoomOut}>
          -
        </Button>
      </Flex>
    </>
  );
};
export default SectionManagement;
