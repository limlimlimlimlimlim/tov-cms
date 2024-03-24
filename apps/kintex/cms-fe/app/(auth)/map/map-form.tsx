'use client';
import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Switch,
  Typography,
  message,
} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ContentsUploader from '../../../component/contents-uploader/contentes-uploader';
import FloorSelect from '../../../component/floor-select/floor-select';
import WingSelect from '../../../component/wing-select/wing-select';
import { createMap, deleteMap, updateMap } from '../../../api/map';
import useLink from '../hooks/use-link';

const { confirm } = Modal;
const { Text } = Typography;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

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
  const [wingId, setWingId] = useState('');
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [image, setImage] = useState('');
  const [isUse, setIsUse] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { replace } = useLink();

  useEffect(() => {
    if (data) {
      setIsEdit(true);
      setWingId(data.wing.id);
      setFloorId(data.floor.id);
      setName(data.name);
      setNameEn(data.nameEn);
      setImage(data.image);
      setIsUse(data.isUse);
    }
  }, [data]);

  const onFinish = useCallback(async () => {
    try {
      if (isEdit) {
        await updateMap(data.id, {
          floorId,
          wingId,
          name,
          nameEn,
          isUse,
          image,
        });
        void message.success('지도가 수정됐습니다.');
      } else {
        await createMap({
          floorId,
          wingId,
          name,
          nameEn,
          isUse,
          image,
        });
        void message.success('지도가 생성됐습니다.');
      }

      replace('/map/list');
    } catch (e) {
      void message.error(e.message);
    }
  }, [isEdit, replace, data?.id, floorId, wingId, name, nameEn, isUse, image]);

  const onChangeFloor = useCallback((floor) => {
    setFloorId(floor);
  }, []);

  const onChangeWing = useCallback((wing) => {
    setWingId(wing);
    setFloorId('');
  }, []);

  const onChageName = useCallback((e) => {
    setName(e.target.value);
  }, []);

  const onChageNameEn = useCallback((e) => {
    setNameEn(e.target.value);
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
        replace('/map/list');
      },
    });
  }, [data?.id, replace]);

  return (
    <Flex vertical gap="middle">
      <Form
        {...layout}
        onFinish={() => {
          void onFinish();
        }}
        style={{ maxWidth: 1000 }}
        validateMessages={validateMessages}
      >
        <Form.Item label="전시홀 선택">
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
        <Form.Item label="지도 이름" rules={[{ required: true }]}>
          <Input value={name} style={{ width: 200 }} onChange={onChageName} />
        </Form.Item>
        <Form.Item label="지도 이름(영문)" rules={[{ required: true }]}>
          <Input
            value={nameEn}
            style={{ width: 200 }}
            onChange={onChageNameEn}
          />
        </Form.Item>
        <Form.Item label="지도파일 등록">
          <ContentsUploader
            source={image}
            onComplete={onCompleteUpload}
            desc={
              <>
                <Text type="secondary">* 권장 해상도: 3840 * 2160</Text>
                <Text type="secondary">
                  * 이미지 또는 영상이 화면 비율 및 해상도가 맞지 않은 경우에는
                  키오스크에서 깨지거나 찌그러져 보일 수 있습니다.
                </Text>
              </>
            }
          />
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
            {isEdit ? (
              <Button danger onClick={onClickDeleteMap}>
                삭제
              </Button>
            ) : null}

            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                replace('/map/list');
              }}
            >
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
