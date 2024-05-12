'use client';

import { Button, message } from 'antd';
import { useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SectionContext } from '../section-context';
import { SectionManagementStatus } from '../../../../../interface/section';
import { addSection } from '../../../../../api/section';
import useAddSection from '../hooks/useAddSection';

const SectionAddStatePage = () => {
  const { mapData, setStatus } = useContext<any>(SectionContext);
  const { newSections } = useAddSection();
  const router = useRouter();

  useEffect(() => {
    setStatus(SectionManagementStatus.Add);
  }, [setStatus]);

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
