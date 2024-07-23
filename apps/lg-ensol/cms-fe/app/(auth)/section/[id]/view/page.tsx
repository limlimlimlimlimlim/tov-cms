'use client';

import { Button } from 'antd';
import Link from 'next/link';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { SectionContext } from '../section-context';
import { getSectionsByMapId } from '../../../../../api/section';
import Section from '../classes/section';
import { convertToKonvaOptions } from '../utils/utils';
import useFaciltyInfo from '../hooks/use-facility-info';

declare const Konva: any;

const SectionViewStatePage = () => {
  const { mapData, stage } = useContext<any>(SectionContext);
  const searchParams = useSearchParams();
  const sections = useRef([]);
  const layer = useMemo(() => {
    return new Konva.Layer();
  }, []);

  const { addSection } = useFaciltyInfo();

  const fetchSection = useCallback(
    async (id) => {
      const response = await getSectionsByMapId(id);
      sections.current = response.data
        .filter((data) => {
          return Boolean(data.path) && data.path !== 'NaN';
        })
        .map((data) => {
          const sec = new Section(
            layer,
            data.path,
            convertToKonvaOptions(data),
            data.id,
          );

          sec.setFacility(data.facilities[0]);
          addSection(sec, true);
          return sec;
        });
    },
    [addSection, layer],
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

  useEffect(() => {
    if (searchParams.get('t')) {
      sections.current.forEach((s: Section) => s.destroy());
      fetchSection(mapData.id);
    }
  }, [fetchSection, layer, mapData.id, searchParams]);

  return (
    <>
      <Link href={`/section/${mapData.id}/add`} style={{ lineHeight: 0 }}>
        <Button>구역 추가</Button>
      </Link>

      <Link href={`/section/${mapData.id}/edit`} style={{ lineHeight: 0 }}>
        <Button>구역 수정</Button>
      </Link>

      <Link href={`/section/${mapData.id}/delete`} style={{ lineHeight: 0 }}>
        <Button>구역 삭제</Button>
      </Link>

      <Link href={`/section/${mapData.id}/design`} style={{ lineHeight: 0 }}>
        <Button>구역 디자인</Button>
      </Link>

      <Link href={`/section/${mapData.id}/cancel`} style={{ lineHeight: 0 }}>
        <Button>위치 해제</Button>
      </Link>
    </>
  );
};

export default SectionViewStatePage;
