'use client';

import { Button, Divider, Flex } from 'antd';
import Link from 'next/link';
import MapSectionMerger from '../../../../../component/map-area-editor/map-section-merger';

export default function SectionForm({ data }) {
  return (
    <Flex vertical gap="middle">
      <Flex vertical gap="large" style={{ paddingTop: 20 }}>
        {data ? <MapSectionMerger map={data} /> : null}
      </Flex>
      <Divider />
      <Flex gap="small" justify="end">
        <Link href="/map-info/list">
          <Button>확인</Button>
        </Link>
      </Flex>
    </Flex>
  );
}
