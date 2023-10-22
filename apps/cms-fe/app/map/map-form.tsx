'use client';
import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Switch,
  message,
} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ContentsUploader from '../../component/contents-uploader/contentes-uploader';
import FloorSelect from '../../component/floor-select/floor-select';
import BuildingSelect from '../../component/building-select/building-select';
import { createMap, deleteMap, updateMap } from '../../api/map';

const { confirm } = Modal;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '필수 값을 입력해주세요',
  types: {
    email: '유효하지 않은 이메일 주소입니다.',
    number: '유효하지 않은 값입니다.',
  },
};

export default function MapForm({ data }) {
  const router = useRouter();
  const [floorId, setFloorId] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [isUse, setIsUse] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (data) {
      setIsEdit(true);
      setFloorId(data.floorId);
      setBuildingId(data.buildingId);
      setName(data.name);
      setImage(data.image);
      setIsUse(data.isUse);
    }
  }, [data]);

  const onFinish = useCallback(async () => {
    try {
      if (isEdit) {
        await updateMap(data.id, {
          floorId,
          buildingId,
          name,
          isUse,
          image,
        });
        void message.success('지도가 수정됐습니다.');
      } else {
        await createMap({
          floorId,
          buildingId,
          name,
          isUse,
          image,
        });
        void message.success('지도가 생성됐습니다.');
      }

      router.push('/map/list');
    } catch (e) {
      void message.error(e.message);
    }
  }, [router, floorId, buildingId, name, isUse, image, isEdit]);

  const onChangeFloor = useCallback((floor) => {
    setFloorId(floor);
    setBuildingId('');
  }, []);

  const onChangeBuilding = useCallback((building) => {
    setBuildingId(building);
  }, []);

  const onChageName = useCallback((e) => {
    setName(e.target.value);
  }, []);

  const onCompleteUpload = useCallback(({ fileName }) => {
    setImage(fileName);
  }, []);

  const onChangeStatus = useCallback((value) => {
    setIsUse(value);
  }, []);

  const onClickDeleteMap = useCallback(() => {
    confirm({
      title: '삭제 확인',
      okText: '확인',
      cancelText: '취소',
      content: '지도를 삭제하겠습니까?',
      async onOk() {
        await deleteMap(data.id);
        void message.success('지도가 삭제됐습니다.');
        router.push('/map/list');
      },
    });
  }, [router, data]);

  return (
    <Flex vertical gap="middle">
      <Form
        {...layout}
        onFinish={onFinish}
        style={{ maxWidth: 1000 }}
        validateMessages={validateMessages}
      >
        <Form.Item label="동 선택">
          <FloorSelect
            floorId={floorId}
            style={{ width: 200 }}
            onChange={onChangeFloor}
          />
        </Form.Item>
        <Form.Item label="층 선택">
          <BuildingSelect
            style={{ width: 200 }}
            floorId={floorId}
            buildingId={buildingId}
            onChange={onChangeBuilding}
          />
        </Form.Item>
        <Form.Item label="지도 이름" rules={[{ required: true }]}>
          <Input value={name} style={{ width: 200 }} onChange={onChageName} />
        </Form.Item>
        <Form.Item label="지도파일 등록">
          <ContentsUploader image={image} onComplete={onCompleteUpload} />
        </Form.Item>

        <Form.Item label="상태">
          <Switch
            checked={isUse}
            onChange={onChangeStatus}
            checkedChildren="사용"
            unCheckedChildren="미사용"
          />
        </Form.Item>

        <Divider />
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
          <Flex gap="small" justify="end">
            {isEdit && (
              <Button danger onClick={onClickDeleteMap}>
                삭제
              </Button>
            )}

            <Link href="/map/list">
              <Button>취소</Button>
            </Link>
            <Button type="primary" htmlType="submit">
              {!isEdit ? '등록' : '수정'}
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Flex>
  );
}
