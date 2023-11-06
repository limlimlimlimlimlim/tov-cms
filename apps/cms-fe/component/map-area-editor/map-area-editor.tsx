'use client';
/* eslint-disable @next/next/no-img-element */
import { HighlightOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { baseURL } from '../../util/axios-client';
import { deleteSectionById, getSectionsByMapId } from '../../api/section';

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
  const [sections, setSections] = useState([]);
  const points = useRef<any[]>([]);
  const newSections = useRef<any[]>([]);
  const editSections = useRef<any[]>([]);
  const deleteSections = useRef<any[]>([]);
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
    const tr = new window.Konva.Transformer();
    // l.add(tr);
    stg.add(l);
    setStage(stg);
    setLayer(l);
    setTransformer(tr);
  }, []);

  const setAddNewMode = useCallback(() => {
    if (!stage) return;
    points.current = [];
    const poly: any = new window.Konva.Line({
      points: [],
      fill: '#aaff77',
      closed: true,
      opacity: 0.5,
    });
    layer.add(poly);
    sectionPolies.current.push(poly);

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

  const getSections = useCallback(async () => {
    const sec = await getSectionsByMapId(map.id);
    setSections(sec.data);
  }, [map]);

  const setDeleteMode = useCallback(() => {
    sectionPolies.current.forEach((p) => {
      p.on('click', async () => {
        const name = p.getName();
        await deleteSectionById(name);
        p.remove();
        await getSections();
      });
    });
  }, [getSections]);

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

  const onLoadImage = useCallback(async () => {
    if (!imageRef.current) return;
    createStage(imageRef.current.width, imageRef.current.height);
    await getSections();
  }, [createStage, getSections]);

  useEffect(() => {
    setImgSrc(`${baseURL}/files/upload/${map.image}`);
  }, [map]);

  useEffect(() => {
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
    }, []);
  }, [layer, sections]);

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
