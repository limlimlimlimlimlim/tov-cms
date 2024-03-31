'use client';

import { Button, Divider, Flex } from 'antd';
import Link from 'next/link';
import MapSectionMerger from '../../../../../component/map-area-editor/map-section-merger';
import useLink from '../../../hooks/use-link';

export default function MapInfoForm({ data }) {
  const { replace } = useLink();
  return (
    <Flex vertical gap="middle">
      <Flex vertical gap="large" style={{ paddingTop: 20 }}>
        {data ? <MapSectionMerger map={data} /> : null}
      </Flex>
      <Divider />
      <Flex gap="small" justify="end">
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            replace('/map-info/list');
          }}
        >
          <Button>확인</Button>
        </Link>
      </Flex>
    </Flex>
  );
}
