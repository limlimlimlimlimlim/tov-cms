'use client';
import { Button, Divider, Flex, Form, Input, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { createKiosk, getKioskByCode, updateKiosk } from '../../api/kiosk';
import FloorSelect from '../../component/floor-select/floor-select';
import WingSelect from '../../component/wing-select/wing-select';

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 21 },
};

const validateMessages = {
  required: '필수 값을 입력해주세요',
  types: {
    email: '유효하지 않은 이메일 주소입니다.',
    number: '유효하지 않은 값입니다.',
  },
};

const KioskForm = ({ data }) => {
  const router = useRouter();
  const [floorId, setFloorId] = useState('');
  const [wingId, setWingId] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (data) {
      setIsEdit(true);
      setFloorId(data.floorId);
      setWingId(data.wingId);
      setName(data.name);
      setCode(data.code);
      setDescription(data.description);
    }
  }, [data, setCode]);

  const onFinish = useCallback(async () => {
    try {
      if (isEdit) {
        await updateKiosk(data.id, {
          floorId,
          wingId,
          code,
          name,
          description,
        });
        void message.success('키오스크가 수정됐습니다.');
      } else {
        await createKiosk({
          floorId,
          wingId,
          code,
          name,
          description,
        });
        void message.success('키오스크가 생성됐습니다.');
      }
      router.push('/kiosk/list');
    } catch (e) {
      void message.error(e.message);
    }
  }, [code, data, description, floorId, isEdit, name, router, wingId]);

  const onClickCheckDuplicate = useCallback(async () => {
    const kiosk = await getKioskByCode(code);
    if (kiosk.data) {
      void message.warning('이미 등록된 키오스크 코드입니다.');
    } else {
      void message.success('사용가능한 키오스크 코드입니다.');
    }
  }, [code]);

  const onChangeFloor = useCallback((floor) => {
    setFloorId(floor);
  }, []);

  const onChangeWing = useCallback((wing) => {
    setWingId(wing);
    setFloorId('');
  }, []);
  return (
    <Flex vertical gap="middle">
      <Form
        {...layout}
        onFinish={onFinish}
        style={{ maxWidth: 1000 }}
        validateMessages={validateMessages}
      >
        <Form.Item label="건물 선택">
          <WingSelect
            style={{ width: 200 }}
            wingId={wingId}
            onChange={onChangeWing}
          />
        </Form.Item>
        <Form.Item label="층 선택">
          <FloorSelect
            wingId={wingId}
            floorId={floorId}
            style={{ width: 200 }}
            onChange={onChangeFloor}
          />
        </Form.Item>
        <Form.Item label="키오스크 코드" rules={[{ required: true }]}>
          <Flex gap="small">
            <Input
              value={code}
              style={{ width: 200 }}
              onChange={(e) => {
                setCode(e.target.value);
              }}
            />
            <Button onClick={onClickCheckDuplicate}>중복검사</Button>
          </Flex>
        </Form.Item>
        <Form.Item label="키오스크 이름" rules={[{ required: true }]}>
          <Input
            value={name}
            style={{ width: 200 }}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="메모">
          <Input.TextArea
            value={description}
            style={{ width: 500, height: 200 }}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </Form.Item>

        <Divider />
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
          <Flex gap="small" justify="end">
            <Link href="/kiosk/list">
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
};

export default KioskForm;
