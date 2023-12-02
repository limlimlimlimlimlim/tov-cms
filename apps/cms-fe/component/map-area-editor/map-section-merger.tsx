'use client';

import { Button, Flex } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { baseURL } from '../../util/axios-client';
import { getSectionsByMapId } from '../../api/section';
import useViewMode from './hooks/use-view-mode';
import useMergeMode from './hooks/use-merge-mode';
import useSplitMode from './hooks/use-split-mode';
import useDisableMode from './hooks/use-disable-mode';

interface ComponentProps {
  map: any;
}
declare global {
  interface Window {
    Konva: any;
  }
}

export default function MapSectionMerger({ map }: ComponentProps) {
  const [sections, setSections] = useState<any[]>([]);
  const [imgSrc, setImgSrc] = useState('');
  const [stage, setStage] = useState<any>(null);
  const [layer, setLayer] = useState<any>(null);
  const [mode, setMode] = useState('normal');
  const { init: initViewMode, render: renderViewMode } = useViewMode();
  const {
    init: initMergeMode,
    apply: applyMergeMode,
    setup: setupMergeMode,
    clear: clearMergeMode,
  } = useMergeMode();

  const {
    init: initSplitMode,
    apply: applySplitMode,
    setup: setupSplitMode,
    clear: clearSplitMode,
  } = useSplitMode();

  const {
    init: initDisableMode,
    apply: applyDisableMode,
    setup: setupDisableMode,
    clear: clearDisableMode,
  } = useDisableMode();

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

  const onLoadImage = useCallback(() => {
    if (!imageRef.current) return;
    createStage(imageRef.current.width, imageRef.current.height);
  }, [createStage]);

  useEffect(() => {
    setImgSrc(`${baseURL}/files/upload/${map.image}?${Math.random()}`);
  }, [map]);

  const onClickMerge = useCallback(() => {
    setMode('merge');
    setupMergeMode(sections);
  }, [sections, setupMergeMode]);

  const onClickSplit = useCallback(() => {
    setMode('split');
    setupSplitMode(sections);
  }, [sections, setupSplitMode]);

  const onClickDelete = useCallback(() => {
    setMode('disable');
    setupDisableMode(sections);
  }, [sections, setupDisableMode]);

  const onClickApply = useCallback(async () => {
    setMode('normal');
    switch (mode) {
      case 'merge':
        await applyMergeMode();
        break;
      case 'split':
        await applySplitMode();
        break;
      case 'disable':
        await applyDisableMode();
        break;
    }
    await fetchSections();
  }, [applyMergeMode, applyDisableMode, applySplitMode, fetchSections, mode]);

  const onClickCancel = useCallback(() => {
    switch (mode) {
      case 'merge':
        clearMergeMode();
        break;
      case 'edit':
        clearSplitMode();
        break;
      case 'disable':
        clearDisableMode();
        break;
    }
    setMode('normal');
    renderViewMode(sections);
  }, [
    clearMergeMode,
    clearDisableMode,
    clearSplitMode,
    mode,
    renderViewMode,
    sections,
  ]);

  useEffect(() => {
    if (!map) return;
    void fetchSections();
  }, [fetchSections, map]);

  useEffect(() => {
    if (!stage) return;
    initViewMode(layer);
    initMergeMode(map.id, stage, layer);
    initSplitMode(map.id, stage, layer);
    initDisableMode(map.id, stage, layer);
  }, [
    initMergeMode,
    initDisableMode,
    initSplitMode,
    initViewMode,
    layer,
    map.id,
    stage,
  ]);

  return (
    <Flex vertical gap="large" style={{ paddingTop: 20 }}>
      <Flex justify="end" gap="middle">
        <span>기본 구역 수 : {sections.length}</span>
        <Flex justify="end" gap="small">
          {mode === 'normal' && (
            <Flex gap="small">
              <Button onClick={onClickMerge}>구역 병합</Button>
              <Button onClick={onClickSplit}>구역 나누기</Button>
              <Button onClick={onClickDelete}>구역 사용 안함</Button>
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
