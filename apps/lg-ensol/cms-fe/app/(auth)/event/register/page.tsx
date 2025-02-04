'use client';

import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  Switch,
  message,
} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import ContentsUploader from '../../../../component/contents-uploader/contentes-uploader';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const { RangePicker } = DatePicker;

const validateMessages = {
  required: '필수 값을 입력해주세요',
  types: {
    email: '유효하지 않은 이메일 주소입니다.',
    number: '유효하지 않은 값입니다.',
  },
};

export default function EventRegister() {
  const router = useRouter();

  const onFinish = useCallback(() => {
    void message.success('이벤트가 생성됐습니다.');
    router.push('/event/list');
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
            <Form.Item name="title" label="제목" rules={[{ required: true }]}>
              <Input style={{ width: 300 }} />
            </Form.Item>
            <Form.Item name="contents" label="내용">
              <Flex vertical gap="middle">
                <ContentsUploader />
                <Input.TextArea style={{ width: 500, height: 300 }} />
              </Flex>
            </Form.Item>
            <Form.Item label="기간">
              <Flex gap="middle" align="center">
                <RangePicker />
                <Checkbox checked={false}>기간 없음</Checkbox>
              </Flex>
            </Form.Item>
            <Form.Item name="status" label="상태">
              <Switch checked />
            </Form.Item>
            <Form.Item name="useIntro" label="인트로 콘텐츠 노출">
              <Switch checked />
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
