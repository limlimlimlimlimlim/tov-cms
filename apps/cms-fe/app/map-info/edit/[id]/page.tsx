"use client";
import { Button, Divider, Flex, Form, Input, Space } from "antd";
import Image from "next/image";
import Link from "next/link";

interface ComponentProps {
  id: string;
}

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};

export default function MapInfoEdit({ id }: ComponentProps) {
  return (
    <Flex vertical gap="middle">
      <Form>
        <Flex gap="middle">
          <Form.Item label="지도명">1층 전체 지도</Form.Item>
          <Form.Item label="층">1층</Form.Item>
          <Form.Item label="건물">전체</Form.Item>
          <Form.Item label="구역 정보">1층 전체 지도</Form.Item>
          <Form.Item label="설정 구역 수 / 구역 수"> 2 / 2</Form.Item>
        </Flex>
      </Form>
      <Space />
      <Flex vertical gap="large" style={{ paddingTop: 20 }}>
        <Flex justify="space-between">
          <span>지도 구역 편집</span>
          <Flex justify="end" gap="small">
            <Button>구역 병합</Button>
            <Button>구역 나누기</Button>
            <Button>구역 사용 안함</Button>
          </Flex>
        </Flex>
        <Flex justify="center">
          <Image alt="map" width="1200" height="674" src="/map.png" />
        </Flex>
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
