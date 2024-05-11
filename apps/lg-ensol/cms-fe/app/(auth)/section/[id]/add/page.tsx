'use client';

import { Button } from 'antd';
import { useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SectionContext } from '../section-context';
import { SectionManagementStatus } from '../../../../../interface/section';
import { addSection } from '../../../../../api/section';

const SectionAddStatePage = () => {
  const { mapData, setStatus, newSections } = useContext<any>(SectionContext);
  const router = useRouter();
  useEffect(() => {
    setStatus(SectionManagementStatus.Add);
  }, [setStatus]);

  const onClickSave = async () => {
    const requests = newSections.map((s) =>
      addSection(
        mapData.id,
        s.path
          .map((p) => [p.x, p.y])
          .flat()
          .join(),
      ),
    );

    await Promise.all(requests);
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
