"use client";
import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  Select,
  Switch,
  message,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import ContentsUploader from "../../../component/contents-uploader/contentes-uploader";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const { Option } = Select;

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: "필수 값을 입력해주세요",
  types: {
    email: "유효하지 않은 이메일 주소입니다.",
    number: "유효하지 않은 값입니다.",
  },
};

export default function FloorMapRegister() {
  const router = useRouter();

  const onFinish = useCallback(
    (values: any) => {
      void message.success("층별 지도가 생성됐습니다.");
      router.push("/map/list");
    },
    [router]
  );

  return (
    <Flex vertical gap="middle">
      <Form
        {...layout}
        onFinish={onFinish}
        style={{ maxWidth: 1000 }}
        validateMessages={validateMessages}
      >
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
        <Form.Item name="name" label="지도 이름" rules={[{ required: true }]}>
          <Input style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="description" label="지도파일 등록">
          <ContentsUploader />
        </Form.Item>

        <Form.Item name="status" label="상태">
          <Switch />
        </Form.Item>

        <Divider />
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
          <Flex gap="small" justify="end">
            <Link href="/map/list">
              <Button>취소</Button>
            </Link>
            <Button type="primary" htmlType="submit">
              등록
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Flex>
  );
}
