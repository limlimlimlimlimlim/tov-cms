import { useCallback, useEffect, useRef, useState } from 'react';
import { getMapDetail } from '../../api/map';
import { baseURL } from '../../util/axios-client';

const MapViewer = ({ mapId, width = 0, facility, onClick }) => {
  const [data, setData] = useState<any>();
  const [containerId] = useState(`canvans-${Math.random()}`);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<any>(null);
  const secLayerRef = useRef<any>(null);
  const facLayerRef = useRef<any>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const createStage = useCallback(
    (w, h, s) => {
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
        stg.on('click', (e) => {
          onClick({
            x: e.evt.layerX,
            y: e.evt.layerY,
            originX: e.evt.layerX * (1 / s),
            originY: e.evt.layerY * (1 / s),
            scale: s,
          });
        });
      }

      stageRef.current = stg;
      secLayerRef.current = _secLayer;
      facLayerRef.current = _facLayer;
    },
    [containerId, onClick],
  );

  const render = useCallback(
    (sca) => {
      if (!data) return;
      if (!secLayerRef.current || !facLayerRef.current) return;
      secLayerRef.current.destroyChildren();
      facLayerRef.current.destroyChildren();

      data.sections.forEach((s: any) => {
        const poly: any = new window.Konva.Line({
          points: s.path.split(',').map((i) => parseFloat(i) * sca),
          fill: '#aaff77',
          closed: true,
          opacity: 0.5,
          name: s.id,
        });
        secLayerRef.current.add(poly);
      });
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
    createStage(imageRef.current.width, imageRef.current.height, _scale);
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
    <div style={{ position: 'relative' }}>
      {data ? (
        <img
          alt="map"
          ref={imageRef}
          src={`${baseURL}/files/upload/${data.image}`}
          onLoad={onLoadImage}
        />
      ) : null}
      <div
        ref={canvasRef}
        id={containerId}
        style={{
          position: 'absolute',
          top: 0,
        }}
      />
      {scale}
      {facility ? (
        <img
          src="/facility-flag.png"
          alt="facility-flag"
          style={{
            position: 'absolute',
            width: 64,
            height: 64,
            left: facility.x * scale - 32,
            top: facility.y * scale - 64,
          }}
        />
      ) : null}
    </div>
  );
};

export default MapViewer;
