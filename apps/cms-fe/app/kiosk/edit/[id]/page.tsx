"use client";
import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  message,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 21 },
};

const { Option } = Select;
const { confirm } = Modal;

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: "필수 값을 입력해주세요",
  types: {
    email: "유효하지 않은 이메일 주소입니다.",
    number: "유효하지 않은 값입니다.",
  },
};

export default function KioskRegister() {
  const router = useRouter();

  const onFinish = useCallback(
    (values: any) => {
      void message.success("키오스크가 수정됐습니다.");
      router.push("/kiosk/list");
    },
    [router]
  );

  const onClickDeleteKiosk = useCallback(() => {
    confirm({
      title: "삭제 확인",
      okText: "확인",
      cancelText: "취소",
      content: "키오스크를 삭제하겠습니까?",
      onOk() {
        void message.success("키오스크가 삭제 됐습니다.");
        router.push("/kiosk/list");
      },
    });
  }, [router]);

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
        <Form.Item
          name="code"
          label="키오스크 코드"
          rules={[{ required: true }]}
        >
          <Flex gap="small">
            <Input style={{ width: 200 }} />
            <Button>중복검사</Button>
          </Flex>
        </Form.Item>
        <Form.Item
          name="name"
          label="키오스크 이름"
          rules={[{ required: true }]}
        >
          <Input style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="description" label="메모">
          <Input.TextArea style={{ width: 500, height: 200 }} />
        </Form.Item>

        <Divider />

        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
          <Flex gap="small" justify="end">
            <Button danger onClick={onClickDeleteKiosk}>
              삭제
            </Button>
            <Link href="/schedule/list">
              <Button>취소</Button>
            </Link>
            <Button type="primary" htmlType="submit">
              수정
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Flex>
  );
}
