import { HighlightOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import Image from 'next/image';
import { baseURL } from '../../util/axios-client';
import { useEffect, useState } from 'react';

interface ComponentProps {
  map: any;
}

export default function MapAreaEditor({ map }: ComponentProps) {
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    setImgSrc(`${baseURL}/files/upload/${map.image}`);
  }, [map]);

  return (
    <Flex vertical gap="large" style={{ paddingTop: 20 }}>
      <Flex justify="space-between">
        <Button>
          <HighlightOutlined />
        </Button>
        <Flex justify="end" gap="small">
          <Button>구역 추가</Button>
          <Button>구역 수정</Button>
          <Button>구역 삭제</Button>
        </Flex>
      </Flex>
      <Flex justify="center">
        {imgSrc && <Image alt="map" width="1200" height="674" src={imgSrc} />}
      </Flex>
    </Flex>
  );
}
