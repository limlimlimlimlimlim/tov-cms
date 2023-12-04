'use client';
import { Button, Divider, Flex, Form, Input, Select, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 21 },
};

const { Option } = Select;

const validateMessages = {
  required: '필수 값을 입력해주세요',
  types: {
    email: '유효하지 않은 이메일 주소입니다.',
    number: '유효하지 않은 값입니다.',
  },
};

export default function AccountRegister() {
  const router = useRouter();

  const onFinish = useCallback(() => {
    void message.success('계정이 생성됐습니다.');
    router.push('/account/list');
  }, [router]);

  return (
    <Flex vertical gap="middle">
      <Form
        {...layout}
        onFinish={onFinish}
        style={{ maxWidth: 1000 }}
        validateMessages={validateMessages}
      >
        <Flex style={{ width: '100%' }}>
          <Flex vertical style={{ width: '100%' }}>
            <Form.Item name="id" label="아이디" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="비밀번호"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="passwordConfirm"
              label="비밀번호 확인"
              rules={[{ required: true }]}
            >
              <Input />
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
          <Flex vertical style={{ width: '100%' }}>
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
            <Link href="/account/list">
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
