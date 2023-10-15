"use client";
import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  Select,
  Modal,
  message,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const { Option } = Select;
const { confirm, info, error, warn } = Modal;

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: "필수 값을 입력해주세요",
  types: {
    email: "유효하지 않은 이메일 주소입니다.",
    number: "유효하지 않은 값입니다.",
  },
};

interface PageProps {
  params: { id: string };
}

export default function AccountEdit({ params }: PageProps) {
  const router = useRouter();

  const onFinish = (values: any) => {
    console.log(values);
  };

  const confirmChangePassword = useCallback(() => {
    confirm({
      title: "비밀번호 변경 확인",
      okText: "확인",
      cancelText: "취소",
      content: "새로 등록한 비밀번호로 변경하시겠습니까?",
      onOk() {
        void message.success("비밀번호가 변경 됐습니다.");
      },
    });
  }, []);

  const alertSuperadmin = useCallback(() => {
    error({
      title: "삭제확인",
      okText: "확인",
      content: "Super admin 계정은 삭제가 불가능합니다.",
    });
  }, []);

  const onClickChangePassword = useCallback(() => {
    info({
      title: "비밀번호 변경",
      okText: "확인",
      cancelText: "취소",
      content: (
        <Flex vertical gap="middle">
          새로운 비밀번호를 입력해주세요.
          <Input type="password"></Input>
        </Flex>
      ),
      onOk() {
        confirmChangePassword();
      },
    });
  }, [confirmChangePassword]);

  const onClickDeleteAccount = useCallback(() => {
    warn({
      title: "삭제 확인",
      okText: "확인",
      cancelText: "취소",
      content: "삭제된 계정은 복구할 수 없습니다. \n 정말 삭제하겠습니까?",
      onOk() {
        // alertSuperadmin();
        void message.success("계정이 삭제 됐습니다.");
        router.push("/account/list");
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
        <Flex style={{ width: "100%" }}>
          <Flex vertical style={{ width: "100%" }}>
            <Form.Item name="id" label="아이디" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="password"
              label="비밀번호"
              rules={[{ required: true }]}
            >
              <Flex gap="middle">
                <Input disabled />
                <Button onClick={onClickChangePassword}>비밀번호 변경</Button>
              </Flex>
            </Form.Item>
            <Form.Item name="name" label="이름" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="연락처">
              <Input />
            </Form.Item>
            <Form.Item name="description" label="설명">
              <Input.TextArea style={{ height: 200 }} />
            </Form.Item>
          </Flex>
          <Flex vertical style={{ width: "100%" }}>
            <Form.Item name="permission" label="권한" initialValue="user">
              <Select>
                <Option key="user" value="user">
                  User
                </Option>
                <Option key="admin" value="admin">
                  Admin
                </Option>
                <Option key="super" value="super">
                  Super Admin
                </Option>
              </Select>
            </Form.Item>
            <Form.Item name="facility" label="시설 선택">
              <Select>
                <Option key="facility1" value="facility1">
                  시설 1
                </Option>
                <Option key="facility2" value="facility2">
                  시설 2
                </Option>
                <Option key="facility3" value="facility3">
                  시설 3
                </Option>
              </Select>
            </Form.Item>
            <Form.Item name="facilityDetail" label="시설 상세 선택">
              <Select>
                <Option key="facilityDetail1" value="facilityDetail1">
                  시설 상세 1
                </Option>
                <Option key="facilityDetail2" value="facilityDetail1">
                  시설 상세 2
                </Option>
                <Option key="facilityDetail3" value="facilityDetail1">
                  시설 상세 3
                </Option>
              </Select>
            </Form.Item>
          </Flex>
        </Flex>

        <Divider />
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
          <Flex gap="small" justify="end">
            <Button danger onClick={onClickDeleteAccount}>
              삭제
            </Button>
            <Link href="/account/list">
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
