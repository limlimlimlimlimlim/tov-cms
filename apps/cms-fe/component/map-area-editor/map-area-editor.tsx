import { HighlightOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import Image from "next/image";

interface ComponentProps {
  id: string;
}

export default function MapAreaEditor({ id }: ComponentProps) {
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
        <Image alt="map" width="1200" height="674" src="/map.png" />
      </Flex>
    </Flex>
  );
}
