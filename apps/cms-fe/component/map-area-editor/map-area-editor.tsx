'use client';
/* eslint-disable @next/next/no-img-element */
import { HighlightOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { baseURL } from '../../util/axios-client';

interface ComponentProps {
  map: any;
  onChange: (value) => void;
}

declare global {
  interface Window {
    Konva: any;
  }
}

export default function MapAreaEditor({ map, onChange }: ComponentProps) {
  const [imgSrc, setImgSrc] = useState('');
  const [stage, setStage] = useState<any>(null);
  const [layer, setLayer] = useState<any>(null);
  const [transformer, setTransformer] = useState<any>(null);
  const [mode, setMode] = useState('none');
  const points = useRef([]);
  const newSections = useRef([]);
  const editSections = useRef([]);
  const deleteSections = useRef([]);

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const createStage = useCallback((w, h) => {
    const stg = new window.Konva.Stage({
      container: 'canvas',
      width: w,
      height: h,
    });

    const l = new window.Konva.Layer();
    const tr = new window.Konva.Transformer();

    const rect1 = new window.Konva.Rect({
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      draggable: true,
    });

    tr.nodes([rect1]);
    // l.add(rect1);
    // l.add(tr);
    stg.add(l);
    setStage(stg);
    setLayer(l);
    setTransformer(tr);
  }, []);

  const setAddNewMode = useCallback(() => {
    if (!stage) return;
    console.log('on new');
    points.current = [];
    const poly: any = new window.Konva.Line({
      points: [],
      fill: '#aaff77',
      closed: true,
      opacity: 0.5,
    });
    layer.add(poly);

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

  useEffect(() => {
    switch (mode) {
      case 'new':
        setAddNewMode();
        break;
      case 'edit':
        break;
      case 'delete':
        break;
    }
  }, [layer, mode, setAddNewMode, stage]);

  const onLoadImage = useCallback(() => {
    if (!imageRef.current) return;
    createStage(imageRef.current.width, imageRef.current.height);
  }, [createStage]);

  useEffect(() => {
    setImgSrc(`${baseURL}/files/upload/${map.image}`);
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
                newSections.current.push(
                  points.current.map((p) => [p.getX(), p.getY()]).flat(),
                );
                points.current.forEach((c: any) => {
                  c.off('click');
                  c.remove();
                });
                stage.off('click');
                points.current = [];
                onChange({
                  new: newSections.current,
                  edit: editSections.current,
                  delete: deleteSections.current,
                });
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
              setMode('delete');
            }}
          >
            구역 삭제
          </Button>
        </Flex>
      </Flex>
      <Flex justify="center">
        {imgSrc ? (
          <img alt="map" ref={imageRef} src={imgSrc} onLoad={onLoadImage} />
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
