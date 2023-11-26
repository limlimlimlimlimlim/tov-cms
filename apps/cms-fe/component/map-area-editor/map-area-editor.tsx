'use client';
/* eslint-disable @next/next/no-img-element */
import { Button, Flex } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { baseURL } from '../../util/axios-client';
import { getSectionsByMapId } from '../../api/section';
import useViewMode from './hooks/use-view-mode';
import useAddMode from './hooks/use-add-mode';

interface ComponentProps {
  map: any;
}
declare global {
  interface Window {
    Konva: any;
  }
}

export default function MapAreaEditor({ map }: ComponentProps) {
  const [sections, setSections] = useState<any[]>([]);
  const [imgSrc, setImgSrc] = useState('');
  const [stage, setStage] = useState<any>(null);
  const [layer, setLayer] = useState<any>(null);
  const [mode, setMode] = useState('normal');
  const { init: initViewMode, render: renderViewMode } = useViewMode();
  const {
    init: initAddMode,
    apply: applyAddMode,
    setup: setupAddMode,
    clear: clearAddMode,
  } = useAddMode();

  const sectionPolies = useRef<any[]>([]);

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const fetchSections = useCallback(async () => {
    if (!map) return;
    const sec = await getSectionsByMapId(map.id);
    setSections(sec.data);
    renderViewMode(sec.data);
  }, [map, renderViewMode]);

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
  }, []);

  const draw = useCallback(() => {
    layer.destroyChildren();
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
    draw();
  }, [draw, layer, sections]);

  const setEditMode = useCallback(() => {
    // sectionPolies.current.forEach((p) => {
    //   p.off('click');
    //   p.on('click', () => {
    //     const name = p.getName();
    //     onDelete(name);
    //     p.remove();
    //   });
    // });
  }, []);

  const setDeleteMode = useCallback(() => {
    sectionPolies.current.forEach((p) => {
      p.off('click');
      p.on('click', () => {
        // const name = p.getName();
        // onDelete(name);
        p.remove();
      });
    });
  }, []);

  const onLoadImage = useCallback(() => {
    if (!imageRef.current) return;
    createStage(imageRef.current.width, imageRef.current.height);
  }, [createStage]);

  useEffect(() => {
    setImgSrc(`${baseURL}/files/upload/${map.image}?${Math.random()}`);
  }, [map]);

  const onClickAdd = useCallback(() => {
    setMode('new');
    setupAddMode(sections);
  }, [sections, setupAddMode]);

  const onClickEdit = useCallback(() => {
    setMode('edit');
    setEditMode();
  }, [setEditMode]);

  const onClickDelete = useCallback(() => {
    setMode('delete');
    setDeleteMode();
  }, [setDeleteMode]);

  const onClickApply = useCallback(async () => {
    setMode('normal');
    switch (mode) {
      case 'new':
        await applyAddMode();
        break;
      case 'edit':
        break;
      case 'delete':
        break;
    }
    await fetchSections();
  }, [applyAddMode, fetchSections, mode]);

  const onClickCancel = useCallback(() => {
    switch (mode) {
      case 'new':
        clearAddMode();
        break;
      case 'edit':
        break;
      case 'delete':
        break;
    }
    setMode('normal');
    renderViewMode(sections);
  }, [clearAddMode, mode, renderViewMode, sections]);

  useEffect(() => {
    if (!map) return;
    void fetchSections();
  }, [fetchSections, map]);

  useEffect(() => {
    if (!stage) return;
    initViewMode(layer);
    initAddMode(map.id, stage, layer);
  }, [initAddMode, initViewMode, layer, map.id, stage]);

  return (
    <Flex vertical gap="large" style={{ paddingTop: 20 }}>
      <Flex justify="end" gap="middle">
        <span>기본 구역 수 : {sections.length}</span>
        <Flex justify="end" gap="small">
          {mode === 'normal' && (
            <Flex gap="small">
              <Button onClick={onClickAdd}>구역추가</Button>
              <Button onClick={onClickEdit}>구역수정</Button>
              <Button onClick={onClickDelete}>구역삭제</Button>
            </Flex>
          )}
          {mode !== 'normal' && (
            <Flex gap="small">
              <Button type="primary" onClick={onClickApply}>
                저장
              </Button>
              <Button onClick={onClickCancel}>취소</Button>
            </Flex>
          )}
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
