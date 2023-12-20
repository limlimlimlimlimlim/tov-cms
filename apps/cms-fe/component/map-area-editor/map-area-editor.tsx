'use client';
import { Button, Flex, message } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getBaseUrl } from '../../util/axios-client';
import { getSectionsByMapId } from '../../api/section';
import { updateMap } from '../../api/map';
import useViewMode from './hooks/use-view-mode';
import useAddMode from './hooks/use-add-mode';
import useEditMode from './hooks/use-edit-mode';
import useDeleteMode from './hooks/use-delete-mode';

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
  const [mode, setMode] = useState('normal');
  const { init: initViewMode, render: renderViewMode } = useViewMode();
  const {
    init: initAddMode,
    apply: applyAddMode,
    setup: setupAddMode,
    clear: clearAddMode,
    validate: validateAddMode,
  } = useAddMode();

  const {
    init: initEditMode,
    apply: applyEditMode,
    setup: setupEditMode,
    clear: clearEditMode,
  } = useEditMode();

  const {
    init: initDeleteMode,
    apply: applyDeleteMode,
    setup: setupDeleteMode,
    clear: clearDeleteMode,
  } = useDeleteMode();

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
      setStage(stg);

      initViewMode(lay, s);
      initAddMode(map.id, stg, lay, s);
      initEditMode(map.id, stg, lay, s);
      initDeleteMode(map.id, stg, lay, s);
    },
    [initAddMode, initDeleteMode, initEditMode, initViewMode, map],
  );

  useEffect(() => {
    if (!stage) return;
    void fetchSections();
  }, [fetchSections, stage]);

  const onLoadImage = useCallback(() => {
    if (!imageRef.current) return;
    createStage(
      imageRef.current.width,
      imageRef.current.height,
      imageRef.current.width / imageRef.current.naturalWidth,
    );
  }, [createStage]);

  useEffect(() => {
    setImgSrc(`${getBaseUrl()}/files/upload/${map.image}?${Math.random()}`);
  }, [map]);

  const onClickAdd = useCallback(() => {
    setMode('new');
    setupAddMode(sections);
  }, [sections, setupAddMode]);

  const onClickEdit = useCallback(() => {
    setMode('edit');
    setupEditMode(sections);
  }, [sections, setupEditMode]);

  const onClickDelete = useCallback(() => {
    setMode('delete');
    setupDeleteMode(sections);
  }, [sections, setupDeleteMode]);

  const onClickApply = useCallback(async () => {
    switch (mode) {
      case 'new':
        // eslint-disable-next-line no-case-declarations
        const { valid, msg } = validateAddMode();
        if (!valid) {
          void message.error(msg);
          return;
        }
        await applyAddMode();
        break;
      case 'edit':
        await applyEditMode();
        break;
      case 'delete':
        await applyDeleteMode();
        break;
    }
    setMode('normal');
    await fetchSections();
    const base64 = stage.toDataURL();
    await updateMap(map.id, { sectionBase64: base64 });
  }, [
    applyAddMode,
    applyDeleteMode,
    applyEditMode,
    fetchSections,
    map?.id,
    mode,
    stage,
    validateAddMode,
  ]);

  const onClickCancel = useCallback(() => {
    switch (mode) {
      case 'new':
        clearAddMode();
        break;
      case 'edit':
        clearEditMode();
        break;
      case 'delete':
        clearDeleteMode();
        break;
    }
    setMode('normal');
    renderViewMode(sections);
  }, [
    clearAddMode,
    clearDeleteMode,
    clearEditMode,
    mode,
    renderViewMode,
    sections,
  ]);

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
      <Flex
        justify="center"
        style={{ position: 'relative', overflow: 'scroll' }}
      >
        {imgSrc ? (
          <img
            alt="map"
            ref={imageRef}
            src={imgSrc}
            style={{
              maxWidth: 1200,
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
