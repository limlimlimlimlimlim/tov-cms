'use client';

import { Button } from 'antd';
import { useContext } from 'react';
import Link from 'next/link';
import { SectionContext } from '../section-context';

const SectionAddStatePage = () => {
  const { mapData } = useContext<any>(SectionContext);
  return (
    <>
      <Button size="small">저장</Button>
      <Button size="small">
        <Link href={`/section/${mapData.id}/view`}>취소</Link>
      </Button>
    </>
  );
};

export default SectionAddStatePage;
