"use client";

import type { TabsProps } from "antd";
import {
  Button,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Tabs,
  message,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import ContentsUploader from "../../../../component/contents-uploader/contentes-uploader";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const { Option } = Select;
const { confirm } = Modal;

const validateMessages = {
  required: "필수 값을 입력해주세요",
  types: {
    email: "유효하지 않은 이메일 주소입니다.",
    number: "유효하지 않은 값입니다.",
  },
};

export default function FacilityRegister() {
  const router = useRouter();

  const onFinish = useCallback(
    (values: any) => {
      void message.success("공지가 생성됐습니다.");
      router.push("/notice/list");
    },
    [router]
  );

  const getForm = useCallback(() => {
    return (
      <Form
        {...layout}
        onFinish={onFinish}
        style={{ maxWidth: 1000 }}
        validateMessages={validateMessages}
      >
        <Form.Item label="구분">
          <Flex gap="middle">
            <Select style={{ width: 150 }} defaultValue="all">
              <Option key="all" value="all">
                전체
              </Option>
              <Option key="facility" value="facility">
                시설
              </Option>
              <Option key="ancillary" value="ancillary">
                부대시설
              </Option>
            </Select>
            <Select style={{ width: 150 }} defaultValue="all">
              <Option key="all" value="all">
                전체
              </Option>
              <Option key="facility" value="facility">
                시설
              </Option>
              <Option key="ancillary" value="ancillary">
                부대시설
              </Option>
            </Select>
          </Flex>
        </Form.Item>
        <Form.Item label="시설명">
          <Input style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="초성태그">
          <Input style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="층 선택">
          <Select style={{ width: 200 }} defaultValue="all">
            <Option key="all" value="all">
              전체
            </Option>
            <Option key="floor1" value="floor1">
              1층
            </Option>
            <Option key="floor2" value="floor2">
              2층
            </Option>
            <Option key="floor3" value="floor3">
              3층
            </Option>
          </Select>
        </Form.Item>

        <Form.Item label="동 선택">
          <Select style={{ width: 200 }} defaultValue="all">
            <Option key="all" value="all">
              전체
            </Option>
            <Option key="building1" value="building1">
              중앙
            </Option>
          </Select>
        </Form.Item>
        <Form.Item label="F&B 카테고리">
          <Select style={{ width: 200 }} defaultValue="all">
            <Option key="all" value="all">
              전체
            </Option>
            <Option key="building1" value="building1">
              중앙
            </Option>
          </Select>
        </Form.Item>
        <Form.Item label="연락처">
          <Input style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="주소">
          <Input style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="운영시간">
          <Input style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="이미지">
          <ContentsUploader />
        </Form.Item>
        <Form.Item label="시설 아이콘">
          <Select style={{ width: 200 }}>
            <Option key="icon1" value="icon1">
              아이콘1
            </Option>
            <Option key="icon2" value="icon2">
              아이콘2
            </Option>
          </Select>
        </Form.Item>
        <Form.Item label="지도">
          <Flex vertical gap="small">
            <Image alt="map" width="300px" height="200px" src="/map.png" />
            <Button style={{ width: 100 }}>구역설정</Button>
          </Flex>
        </Form.Item>
      </Form>
    );
  }, [onFinish]);

  const onClickDeleteFacility = useCallback(() => {
    confirm({
      title: "삭제 확인",
      okText: "확인",
      cancelText: "취소",
      content: "층별 지도를 삭제하겠습니까?",
      onOk() {
        void message.success("층별 지도가 삭제 됐습니다.");
        router.push("/facility/list");
      },
    });
  }, []);

  const items: TabsProps["items"] = [
    {
      key: "ko",
      label: "한글",
      children: getForm(),
    },
    {
      key: "en",
      label: "영어",
      children: getForm(),
    },
  ];

  return (
    <Flex vertical gap="middle">
      <Tabs type="card" items={items} />
      <Divider />
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
        <Flex gap="small" justify="end">
          <Button danger onClick={onClickDeleteFacility}>
            삭제
          </Button>
          <Link href="/facility/list">
            <Button>취소</Button>
          </Link>
          <Button type="primary" htmlType="submit">
            등록
          </Button>
        </Flex>
      </Form.Item>
    </Flex>
  );
}
