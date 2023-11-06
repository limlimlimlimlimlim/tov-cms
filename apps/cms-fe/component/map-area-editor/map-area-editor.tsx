'use client';
/* eslint-disable @next/next/no-img-element */
import { HighlightOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { baseURL } from '../../util/axios-client';

interface ComponentProps {
  map: any;
  sections: any[];
  onAdd: (section) => void;
  onDelete: (name) => void;
}

declare global {
  interface Window {
    Konva: any;
  }
}

export default function MapAreaEditor({
  map,
  onAdd,
  onDelete,
  sections,
}: ComponentProps) {
  const [imgSrc, setImgSrc] = useState('');
  const [stage, setStage] = useState<any>(null);
  const [layer, setLayer] = useState<any>(null);
  // const [transformer, setTransformer] = useState<any>(null);
  const [mode, setMode] = useState('none');
  const points = useRef<any[]>([]);
  const currentPoly = useRef<any>(null);
  const sectionPolies = useRef<any[]>([]);

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const createStage = useCallback((w, h) => {
    const stg = new window.Konva.Stage({
      container: 'canvas',
      width: w,
      height: h,
    });

    const l = new window.Konva.Layer();

    stg.add(l);
    setStage(stg);
    setLayer(l);
    // const tr = new window.Konva.Transformer();
    // l.add(tr);
    // setTransformer(tr);
  }, []);

  const draw = useCallback(() => {
    sections.forEach((s: any) => {
      const poly: any = new window.Konva.Line({
        points: s.path.split(','),
        fill: '#aaff77',
        closed: true,
        opacity: 0.5,
        name: s.id,
      });
      layer.add(poly);
      sectionPolies.current.push(poly);
    });
  }, [layer, sections]);

  useEffect(() => {
    if (!layer) return;
    layer.destroyChildren();
    draw();
  }, [draw, layer, sections]);

  const setAddNewMode = useCallback(() => {
    if (!stage) return;
    points.current = [];
    const poly: any = new window.Konva.Line({
      points: [],
      fill: '#aaff77',
      closed: true,
      opacity: 0.5,
      name: `ready-${(Math.random() * 100000).toFixed()}`,
    });
    layer.add(poly);
    sectionPolies.current.push(poly);
    currentPoly.current = poly;

    stage.on('click', (e: any) => {
      const x = e.evt.layerX;
      const y = e.evt.layerY;
      const c: any = new window.Konva.Circle({
        x,
        y,
        radius: 4,
        fill: 'red',
      });
      points.current.push(c);
      poly.setPoints([
        ...points.current.map((p: any) => [p.getX(), p.getY()]).flat(),
      ]);
      layer.add(c);

      c.on('click', () => {
        c.remove();
        const index = points.current.indexOf(c);
        points.current.splice(index, 1);
        poly.setPoints([
          ...points.current.map((p: any) => [p.getX(), p.getY()]).flat(),
        ]);
      });
    });
  }, [layer, stage]);

  const setDeleteMode = useCallback(() => {
    sectionPolies.current.forEach((p) => {
      p.on('click', () => {
        const name = p.getName();
        onDelete(name);
        p.remove();
      });
    });
  }, [onDelete]);

  useEffect(() => {
    switch (mode) {
      case 'new':
        setAddNewMode();
        break;
      case 'edit':
        break;
      case 'delete':
        setDeleteMode();
        break;
    }
  }, [layer, mode, setAddNewMode, setDeleteMode, stage]);

  const onLoadImage = useCallback(() => {
    if (!imageRef.current) return;
    createStage(imageRef.current.width, imageRef.current.height);
  }, [createStage]);

  useEffect(() => {
    setImgSrc(`${baseURL}/files/upload/${map.image}?${Math.random()}`);
  }, [map]);

  return (
    <Flex vertical gap="large" style={{ paddingTop: 20 }}>
      <Flex justify="space-between">
        <Button>
          <HighlightOutlined />
        </Button>
        <Flex justify="end" gap="small">
          <Button
            onClick={() => {
              if (mode === 'none') {
                setMode('new');
              } else if (mode === 'new') {
                setMode('none');
                onAdd({
                  name: currentPoly.current.getName(),
                  path: currentPoly.current.getPoints(),
                });
                points.current.forEach((c: any) => {
                  c.off('click');
                  c.remove();
                });
                stage.off('click');
                points.current = [];
              }
            }}
          >
            {mode === 'none' ? '구역 추가' : mode === 'new' ? '완료' : ''}
          </Button>
          <Button
            onClick={() => {
              setMode('edit');
            }}
          >
            구역 수정
          </Button>
          <Button
            onClick={() => {
              if (mode === 'none') {
                setMode('delete');
              } else if (mode === 'delete') {
                setMode('none');
              }
            }}
          >
            {mode === 'none' ? '구역 삭제' : mode === 'delete' ? '완료' : ''}
          </Button>
        </Flex>
      </Flex>
      <Flex justify="center">
        {imgSrc ? (
          <img
            alt="map"
            ref={imageRef}
            src={imgSrc}
            onLoad={() => {
              onLoadImage();
            }}
          />
        ) : null}
        <div
          ref={canvasRef}
          id="canvas"
          style={{
            position: 'absolute',
          }}
        />
      </Flex>
    </Flex>
  );
}
