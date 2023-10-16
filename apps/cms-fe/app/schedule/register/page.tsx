"use client";

import {
  Button,
  Checkbox,
  DatePicker,
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
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const { Option } = Select;
const { RangePicker } = DatePicker;

const validateMessages = {
  required: "필수 값을 입력해주세요",
  types: {
    email: "유효하지 않은 이메일 주소입니다.",
    number: "유효하지 않은 값입니다.",
  },
};

export default function AccountRegister() {
  const router = useRouter();

  const onFinish = useCallback(
    (values: any) => {
      void message.success("스케줄이 생성됐습니다.");
      router.push("/schedule/list");
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
        <Flex style={{ width: "100%" }}>
          <Flex vertical style={{ width: "100%" }}>
            <Form.Item name="kiosk" label="키오스크 선택" initialValue="all">
              <Select style={{ width: 300 }}>
                <Option key="all" value="all">
                  전체
                </Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="name"
              label="콘텐츠명"
              rules={[{ required: true }]}
            >
              <Input style={{ width: 300 }} />
            </Form.Item>
            <Form.Item
              name="contents"
              label={
                <Flex vertical>
                  <div>콘텐츠</div>
                  <div style={{ color: "#888", fontSize: 12 }}>
                    (영상 및 이미지)
                  </div>
                </Flex>
              }
            >
              <ContentsUploader />
            </Form.Item>
            <Form.Item label="기간">
              <Flex gap="middle" align="center">
                <RangePicker />
                <Checkbox checked={false}>기간 없음</Checkbox>
              </Flex>
            </Form.Item>
            <Form.Item name="status" label="상태">
              <Switch checked={true} />
            </Form.Item>
            <Form.Item name="description" label="메모">
              <Input.TextArea style={{ height: 300 }} />
            </Form.Item>
          </Flex>
        </Flex>

        <Divider />
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
          <Flex gap="small" justify="end">
            <Link href="/schedule/list">
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