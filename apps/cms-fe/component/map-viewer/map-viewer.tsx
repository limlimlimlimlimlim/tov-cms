import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Flex } from 'antd';
import { getMapDetail } from '../../api/map';
import { getBaseUrl } from '../../util/axios-client';
import { createSection } from '../../util/section-renderer';

const MapViewer = ({
  mapId,
  width = 0,
  facility,
  facilityIconUrl,
  onClick,
}) => {
  const [data, setData] = useState<any>();
  const containerId = useMemo(() => `canvans-${Math.random()}`, []);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<any>(null);
  const secLayerRef = useRef<any>(null);
  const facLayerRef = useRef<any>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const onClickStage = useCallback(
    (e) => {
      if (e.target.nodeType !== 'Shape') return;
      onClick({
        x: e.evt.layerX,
        y: e.evt.layerY,
        originX: e.evt.layerX * (1 / scale),
        originY: e.evt.layerY * (1 / scale),
        scale,
        section: e.target.getName(),
      });
    },
    [onClick, scale],
  );

  useEffect(() => {
    if (!stageRef.current) return;
    if (onClick) {
      stageRef.current.off('click');
      stageRef.current.on('click', onClickStage);
    }
  }, [onClick, onClickStage]);

  const createStage = useCallback(
    (w, h) => {
      const stg = new window.Konva.Stage({
        container: containerId,
        width: w,
        height: h,
      });

      const _secLayer = new window.Konva.Layer();
      const _facLayer = new window.Konva.Layer();

      stg.add(_secLayer);
      stg.add(_facLayer);
      if (onClick) {
        stg.off('click');
        stg.on('click', onClickStage);
      }

      stageRef.current = stg;
      secLayerRef.current = _secLayer;
      facLayerRef.current = _facLayer;
    },
    [containerId, onClick, onClickStage],
  );

  const render = useCallback(
    (sca) => {
      if (!data) return;
      if (!secLayerRef.current || !facLayerRef.current) return;
      secLayerRef.current.destroyChildren();
      facLayerRef.current.destroyChildren();
      createSection(data.sections, secLayerRef.current, sca);
    },
    [data, secLayerRef, facLayerRef],
  );

  const onLoadImage = useCallback(() => {
    if (!imageRef.current) return;
    let _scale = 1;
    if (width) {
      _scale = width / imageRef.current.width;
    }
    setScale(_scale);
    imageRef.current.width *= _scale;
    createStage(imageRef.current.width, imageRef.current.height);
    render(_scale);
  }, [createStage, render, width]);

  const fetchData = useCallback(async (mapId) => {
    const result = await getMapDetail(mapId);
    setData(result.data);
  }, []);

  useEffect(() => {
    if (mapId) {
      void fetchData(mapId);
    }
  }, [fetchData, mapId]);

  return (
    <Flex
      style={{ position: 'relative', overflow: 'scroll' }}
      justify="center"
      align="center"
    >
      {data ? (
        <img
          alt="map"
          ref={imageRef}
          src={`${getBaseUrl()}/files/upload/${data.image}`}
          onLoad={onLoadImage}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          top: 0,
        }}
      >
        <div ref={canvasRef} id={containerId} />
        {facility?.x && facility.y ? (
          <img
            src={facilityIconUrl}
            alt="icon"
            style={{
              position: 'absolute',
              width: 128 * scale,
              height: 128 * scale,
              left: facility.x * scale - 64 * scale,
              top: facility.y * scale - 128 * scale,
            }}
          />
        ) : null}
      </div>
    </Flex>
  );
};

export default MapViewer;
