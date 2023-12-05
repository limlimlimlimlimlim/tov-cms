'use client';

import { Button, Flex, message } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { baseURL } from '../../util/axios-client';
import { getSectionsByMapId } from '../../api/section';
import useViewMode from './hooks/use-view-mode';
import useMergeMode from './hooks/use-merge-mode';
import useSplitMode from './hooks/use-split-mode';
import useDisableMode from './hooks/use-disable-mode';
import useEnableMode from './hooks/use-enable-mode';

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
  const [mode, setMode] = useState('normal');
  const { init: initViewMode, render: renderViewMode } = useViewMode();
  const {
    init: initMergeMode,
    apply: applyMergeMode,
    setup: setupMergeMode,
    clear: clearMergeMode,
    validate: validateMergeMode,
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

  const {
    init: initEnableMode,
    apply: applyEnableMode,
    setup: setupEnableMode,
    clear: clearEnableMode,
  } = useEnableMode();

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const fetchSections = useCallback(async () => {
    if (!map) return;
    const sec = await getSectionsByMapId(map.id);
    setSections(sec.data);
    renderViewMode(sec.data);
  }, [map, renderViewMode]);

  const createStage = useCallback(
    (w, h, s) => {
      const stg = new window.Konva.Stage({
        container: 'canvas',
        width: w,
        height: h,
      });

      const lay = new window.Konva.Layer();
      stg.add(lay);

      initViewMode(lay, s);
      initMergeMode(map.id, stg, lay, s);
      initSplitMode(map.id, stg, lay, s);
      initDisableMode(map.id, stg, lay, s);
      initEnableMode(map.id, stg, lay, s);
      void fetchSections();
    },
    [
      fetchSections,
      initDisableMode,
      initEnableMode,
      initMergeMode,
      initSplitMode,
      initViewMode,
      map.id,
    ],
  );

  const onLoadImage = useCallback(() => {
    if (!imageRef.current) return;
    createStage(
      imageRef.current.width,
      imageRef.current.height,
      imageRef.current.width / imageRef.current.naturalWidth,
    );
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

  const onClickDisable = useCallback(() => {
    setMode('disabled');
    setupDisableMode(sections);
  }, [sections, setupDisableMode]);

  const onClickEnable = useCallback(() => {
    setMode('enabled');
    setupEnableMode(sections);
  }, [sections, setupEnableMode]);

  const onClickApply = useCallback(async () => {
    switch (mode) {
      case 'merge':
        // eslint-disable-next-line no-case-declarations
        const { valid, msg } = validateMergeMode();
        if (!valid) {
          void message.error(msg);
          return;
        }
        await applyMergeMode();
        break;
      case 'split':
        await applySplitMode();
        break;
      case 'disabled':
        await applyDisableMode();
        break;
      case 'enabled':
        await applyEnableMode();
        break;
    }
    setMode('normal');
    await fetchSections();
  }, [
    mode,
    fetchSections,
    validateMergeMode,
    applyMergeMode,
    applySplitMode,
    applyDisableMode,
    applyEnableMode,
  ]);

  const onClickCancel = useCallback(() => {
    switch (mode) {
      case 'merge':
        clearMergeMode();
        break;
      case 'edit':
        clearSplitMode();
        break;
      case 'disabled':
        clearDisableMode();
        break;
      case 'enabled':
        clearEnableMode();
        break;
    }
    setMode('normal');
    renderViewMode(sections);
  }, [
    mode,
    renderViewMode,
    sections,
    clearMergeMode,
    clearSplitMode,
    clearDisableMode,
    clearEnableMode,
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
              <Button onClick={onClickDisable}>구역 사용 안함</Button>
              <Button onClick={onClickEnable}>구역 사용</Button>
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
            style={{
              maxWidth: 1000,
            }}
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
