'use client';

import { Button } from 'antd';
import Link from 'next/link';
import { useContext, useEffect } from 'react';
import { SectionContext } from '../section-context';
import useViewSection from '../hooks/use-view-section';

const SectionViewStatePage = () => {
  const { mapData } = useContext<any>(SectionContext);
  const { fetchSection } = useViewSection();

  useEffect(() => {
    if (!mapData) return;
    fetchSection(mapData.id);
  }, [fetchSection, mapData]);

  return (
    <>
      <Button size="small">
        <Link href={`/section/${mapData.id}/add`}>구역 추가</Link>
      </Button>
      <Button size="small">
        <Link href={`/section/${mapData.id}/edit`}>구역 수정</Link>
      </Button>
      <Button size="small">구역 삭제</Button>
      <Button size="small">
        <Link href={`/section/${mapData.id}/design`}>구역 디자인</Link>
      </Button>
      <Button size="small">
        <Link href={`/section/${mapData.id}/cancel`}>위치 해제</Link>
      </Button>
    </>
  );
};

export default SectionViewStatePage;
