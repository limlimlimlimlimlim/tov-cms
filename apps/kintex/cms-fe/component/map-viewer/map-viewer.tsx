import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Flex } from 'antd';
import { getMapDetail } from '../../api/map';
import { getBaseUrl } from '../../util/axios-client';
import { createSection } from '../../util/section-renderer';

export const MapViewer = ({
  mapId = null,
  sections = [],
  image = null,
  width = 0,
  markers = [],
  onClick,
}) => {
  const containerId = useMemo(() => `canvans-${Math.random()}`, []);
  const [scale, setScale] = useState(1);
  const [_sections, setSections] = useState<any[]>();
  const [_image, setImage] = useState(image);
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
        section: sections.find((s: any) => s.id == e.target.getName()),
      });
    },
    [onClick, scale, sections],
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

  const render = useCallback((sections, sca) => {
    if (!sections) return;
    if (!secLayerRef.current || !facLayerRef.current) return;
    secLayerRef.current.destroyChildren();
    facLayerRef.current.destroyChildren();
    createSection(sections, secLayerRef.current, sca);
  }, []);

  useEffect(() => {
    if (!mapId) {
      setSections(sections);
      render(sections, scale);
    }
  }, [mapId, render, scale, sections]);

  const onLoadImage = useCallback(() => {
    if (!imageRef.current) return;
    let _scale = 1;
    if (width) {
      _scale = width / imageRef.current.width;
    }
    setScale(_scale);
    imageRef.current.width *= _scale;
    createStage(imageRef.current.width, imageRef.current.height);
    render(_sections, _scale);
  }, [_sections, createStage, render, width]);

  const fetchData = useCallback(async (mapId) => {
    const result = await getMapDetail(mapId);
    setSections(result.data.sections);
    setImage(result.data.image);
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
      {_image && (
        <img
          alt="map"
          ref={imageRef}
          src={`${getBaseUrl()}/files/upload/${_image}`}
          onLoad={onLoadImage}
        />
      )}
      <div
        style={{
          position: 'absolute',
          top: 0,
        }}
      >
        <div ref={canvasRef} id={containerId} />
        {markers.map((marker: any, index) => {
          return (
            <img
              key={index}
              src={marker.icon}
              alt="icon"
              style={{
                position: 'absolute',
                width: 128 * scale,
                height: 128 * scale,
                left: marker.x * scale - 64 * scale,
                top: marker.y * scale - 128 * scale,
              }}
            />
          );
        })}
      </div>
    </Flex>
  );
};

export default MapViewer;
