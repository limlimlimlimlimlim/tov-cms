'use client';

import { Button, message } from 'antd';
import { useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SectionContext } from '../section-context';
import { SectionManagementStatus } from '../../../../../interface/section';
import { addSection } from '../../../../../api/section';
import useAddSection from '../hooks/use-add-section';
import useViewSection from '../hooks/use-view-section';

const SectionAddStatePage = () => {
  const { mapData, setStatus, clearCanvas } = useContext<any>(SectionContext);
  const { newSections } = useAddSection();
  const { complete, fetchSection } = useViewSection();
  const router = useRouter();

  const onClickSave = async () => {
    const requests = newSections.map((s) => {
      return addSection(
        mapData.id,
        s.path
          .map((p: any) => [p.x, p.y])
          .flat()
          .join(),
      );
    });
    await Promise.all(requests);
    message.success('구역이 추가 됐습니다.');
    router.replace(`/section/${mapData.id}/view`);
  };

  useEffect(() => {
    setStatus(SectionManagementStatus.Add);
  }, [setStatus]);

  useEffect(() => {
    fetchSection(mapData.id);
  }, [clearCanvas, fetchSection, mapData.id]);

  useEffect(() => {
    return () => {
      clearCanvas();
    };
  }, [clearCanvas]);
  return (
    <>
      <Button size="small" onClick={onClickSave}>
        저장
      </Button>
      <Button size="small">
        <Link href={`/section/${mapData.id}/view`}>취소</Link>
      </Button>
    </>
  );
};

export default SectionAddStatePage;
