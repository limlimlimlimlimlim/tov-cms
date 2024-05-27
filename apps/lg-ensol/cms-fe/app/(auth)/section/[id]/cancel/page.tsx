'use client';

import { Button } from 'antd';
import { useContext } from 'react';
import Link from 'next/link';
import { SectionContext } from '../section-context';

const SectionCancelStatePage = () => {
  const { mapData } = useContext<any>(SectionContext);
  return (
    <>
      <Button>저장</Button>
      <Button>
        <Link href={`/section/${mapData.id}/view`}>취소</Link>
      </Button>
    </>
  );
};

export default SectionCancelStatePage;
