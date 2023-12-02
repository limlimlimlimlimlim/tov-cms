'use client';
import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  Radio,
  Switch,
  Tabs,
  message,
} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import FloorSelect from '../../component/floor-select/floor-select';
import BuildingSelect from '../../component/building-select/building-select';
import ContentsUploader from '../../component/contents-uploader/contentes-uploader';
import { createPost, updatePost } from '../../api/post';

const { RangePicker } = DatePicker;

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

const PostForm = ({ data }) => {
  const router = useRouter();
  const [floorId, setFloorId] = useState('');
  const [wingId, setWingId] = useState('');
  const [name, setName] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [type, setType] = useState('info');
  const [imageContents, setImageContents] = useState('');
  const [videoContents, setVideoContents] = useState('');
  const [textContents, setTextContents] = useState('');
  const [contentsType, setContentsType] = useState('image');
  const [startDate, setStartDate] = useState<any>(dayjs());
  const [endDate, setEndDate] = useState<any>(dayjs());
  const [status, setStatus] = useState('enable');
  const [noPeriod, setNoPeriod] = useState(false);
  const [useIntro, setUseIntro] = useState(false);

  const items = [
    {
      label: '이미지',
      key: 'image',
      children: (
        <ContentsUploader
          source={imageContents}
          onComplete={({ fileName }) => {
            setImageContents(fileName);
          }}
        />
      ),
    },

    {
      label: '영상',
      key: 'video',
      children: (
        <ContentsUploader
          source={videoContents}
          onComplete={({ fileName }) => {
            setVideoContents(fileName);
          }}
        />
      ),
    },
    {
      label: '텍스트',
      key: 'text',
      children: (
        <Input.TextArea
          defaultValue={textContents}
          style={{ height: 250 }}
          onChange={(e) => {
            setTextContents(e.target.value);
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    if (data) {
      setIsEdit(true);
      setFloorId(data.floorId);
      setWingId(data.wingId);
      setName(data.name);
      setType(data.type);
      setImageContents(data.imageContents);
      setVideoContents(data.videoContents);
      setTextContents(data.textContents);
      setContentsType(data.contentsType);
      setStartDate(dayjs(data.startDate));
      setEndDate(dayjs(data.endDate));
      setStatus(data.status);
      setNoPeriod(data.noPeriod);
      setUseIntro(data.useIntro);
    }
  }, [data]);

  const onFinish = useCallback(async () => {
    console.log('startDate: ', startDate);
    try {
      if (isEdit) {
        await updatePost(data.id, {
          wingId,
          name,
          type,
          imageContents,
          videoContents,
          textContents,
          contentsType,
          status,
          startDate: startDate.toDate(),
          endDate: endDate.toDate(),
          noPeriod,
          useIntro,
        });
        void message.success('게시물이 수정됐습니다.');
      } else {
        await createPost({
          wingId,
          name,
          type,
          imageContents,
          videoContents,
          textContents,
          contentsType,
          status,
          startDate: startDate.toDate(),
          endDate: endDate.toDate(),
          noPeriod,
          useIntro,
        });
        void message.success('게시물이 생성됐습니다.');
      }
      router.push('/post/list');
    } catch (e) {
      void message.error(e.message);
    }
  }, [
    contentsType,
    data,
    endDate,
    imageContents,
    isEdit,
    name,
    noPeriod,
    router,
    startDate,
    status,
    textContents,
    type,
    useIntro,
    videoContents,
    wingId,
  ]);

  const onChangeFloor = useCallback((floor) => {
    setFloorId(floor);
    setWingId('');
  }, []);

  const onChangeWing = useCallback((wing) => {
    setWingId(wing);
  }, []);

  return (
    <Flex vertical gap="middle">
      <Form
        {...layout}
        onFinish={onFinish}
        style={{ maxWidth: 1000 }}
        validateMessages={validateMessages}
      >
        <Form.Item label="층 선택">
          <FloorSelect
            floorId={floorId}
            style={{ width: 200 }}
            onChange={onChangeFloor}
          />
        </Form.Item>
        <Form.Item label="동 선택">
          <BuildingSelect
            style={{ width: 200 }}
            floorId={floorId}
            wingId={wingId}
            onChange={onChangeWing}
          />
        </Form.Item>
        <Form.Item label="시설 선택">
          <BuildingSelect
            style={{ width: 200 }}
            floorId={floorId}
            wingId={wingId}
            onChange={onChangeWing}
          />
        </Form.Item>
        <Form.Item label="구분">
          <Radio.Group
            value={type}
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <Radio value="info">안내</Radio>
            <Radio value="event">이벤트</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="게시물명" rules={[{ required: true }]}>
          <Input
            value={name}
            style={{ width: 300 }}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="콘텐츠">
          <Tabs
            items={items}
            activeKey={contentsType}
            onChange={(key) => {
              setContentsType(key);
            }}
          />
        </Form.Item>
        <Form.Item label="기간">
          <Flex gap="middle" align="center">
            <RangePicker
              value={[startDate, endDate]}
              onChange={(values) => {
                if (!values) return;
                setStartDate(values[0]);
                setEndDate(values[1]);
              }}
            />
            {noPeriod}
            <Checkbox
              checked={noPeriod}
              onChange={(e) => {
                setNoPeriod(e.target.checked);
              }}
            >
              기간 없음
            </Checkbox>
          </Flex>
        </Form.Item>
        <Form.Item name="status" label="상태">
          <Switch
            checked={status == 'enable'}
            onChange={(e) => {
              setStatus(e ? 'enable' : 'disable');
            }}
          />
        </Form.Item>
        <Form.Item name="useIntro" label="인트로 콘텐츠 노출">
          <Switch
            checked={useIntro}
            onChange={(e) => {
              setUseIntro(e);
            }}
          />
        </Form.Item>
        <Divider />
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
          <Flex gap="small" justify="end">
            <Link href="/post/list">
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

export default PostForm;
