'use client';

import { Button } from 'antd';
import { useContext, useEffect } from 'react';
import Link from 'next/link';
import { SectionContext } from '../section-context';
import { SectionManagementStatus } from '../../../../../interface/section';

const SectionEditStatePage = () => {
  const { mapData, setStatus } = useContext<any>(SectionContext);

  useEffect(() => {
    setStatus(SectionManagementStatus.Add);
  }, [setStatus]);

  const onClickSave = () => {};
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

export default SectionEditStatePage;
