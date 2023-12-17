'use client';

import { Button, Divider, Flex } from 'antd';
import Link from 'next/link';
import MapSectionMerger from '../../../../../component/map-area-editor/map-section-merger';

export default function MapInfoForm({ data }) {
  return (
    <Flex vertical gap="middle">
      <Flex vertical gap="large" style={{ paddingTop: 20 }}>
        {data ? <MapSectionMerger map={data} /> : null}
      </Flex>
      <Divider />
      <Flex gap="small" justify="end">
        <Link href="/map-info/list">
          <Button>취소</Button>
        </Link>
        <Button type="primary" htmlType="submit">
          저장
        </Button>
      </Flex>
    </Flex>
  );
}
