'use client';

import { Button } from 'antd';
import Link from 'next/link';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { SectionContext } from '../section-context';
import { getSectionsByMapId } from '../../../../../api/section';
import Section from '../classes/section';
import { convertToKonvaOptions } from '../utils/utils';

declare const Konva: any;

const SectionViewStatePage = () => {
  const { mapData, stage } = useContext<any>(SectionContext);
  const sections = useRef([]);
  const layer = useMemo(() => {
    return new Konva.Layer();
  }, []);

  const fetchSection = useCallback(
    async (id) => {
      const response = await getSectionsByMapId(id);
      sections.current = response.data.map(
        (data) => new Section(layer, data.path, convertToKonvaOptions(data)),
      );
    },
    [layer],
  );

  useEffect(() => {
    if (!mapData) return;
    if (!stage) return;
    stage.add(layer);
    fetchSection(mapData.id);
  }, [fetchSection, layer, mapData, stage]);

  useEffect(() => {
    return () => {
      if (!stage) return;
      if (!layer) return;
      sections.current.forEach((s: Section) => s.destroy());
      layer.destroy();
    };
  }, [layer, stage]);

  return (
    <>
      <Button>
        <Link href={`/section/${mapData.id}/add`}>구역 추가</Link>
      </Button>
      <Button>
        <Link href={`/section/${mapData.id}/edit`}>구역 수정</Link>
      </Button>
      <Button>
        <Link href={`/section/${mapData.id}/delete`}>구역 삭제</Link>
      </Button>
      <Button>
        <Link href={`/section/${mapData.id}/design`}>구역 디자인</Link>
      </Button>
      <Button>
        <Link href={`/section/${mapData.id}/cancel`}>위치 해제</Link>
      </Button>
    </>
  );
};

export default SectionViewStatePage;
