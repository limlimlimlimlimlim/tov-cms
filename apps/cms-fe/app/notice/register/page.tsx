"use client";

import type { TabsProps } from "antd";
import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  Switch,
  Tabs,
  message,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import ContentsUploader from "../../../component/contents-uploader/contentes-uploader";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

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
      void message.success("공지가 생성됐습니다.");
      router.push("/notice/list");
    },
    [router]
  );

  const contentsItems: TabsProps["items"] = useMemo(() => {
    return [
      {
        key: "normal",
        label: "기본",
        children: (
          <Flex vertical gap="middle">
            <ContentsUploader />
            <Input.TextArea style={{ width: 500, height: 300 }} />
          </Flex>
        ),
      },
      {
        key: "leftImage",
        label: "좌측 이미지",
        children: (
          <Flex gap="middle">
            <ContentsUploader />
            <Input.TextArea style={{ width: 500, height: 300 }} />
          </Flex>
        ),
      },
      {
        key: "rightImage",
        label: "우측 이미지",
        children: (
          <Flex gap="middle">
            <Input.TextArea style={{ width: 500, height: 300 }} />
            <ContentsUploader />
          </Flex>
        ),
      },
    ];
  }, []);

  const getForm = useCallback(() => {
    return (
      <Form
        {...layout}
        onFinish={onFinish}
        style={{ maxWidth: 1000 }}
        validateMessages={validateMessages}
      >
        <Form.Item name="title" label="제목">
          <Input style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="콘텐츠">
          <Tabs type="card" items={contentsItems} style={{ paddingLeft: 20 }} />
        </Form.Item>
        <Form.Item label="기간">
          <Flex gap="middle" align="center">
            <RangePicker />
            <Checkbox checked={false}>기간 없음</Checkbox>
          </Flex>
        </Form.Item>
        <Form.Item name="status" label="상태">
          <Switch checked={true}></Switch>
        </Form.Item>
        <Form.Item name="useIntro" label="인트로 콘텐츠 노출">
          <Switch checked={true}></Switch>
        </Form.Item>
      </Form>
    );
  }, [contentsItems, onFinish]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "한글",
      children: getForm(),
    },
    {
      key: "2",
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
          <Link href="/norice/list">
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
