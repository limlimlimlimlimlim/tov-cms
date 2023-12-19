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
import WingSelect from '../../../component/wing-select/wing-select';
import ContentsUploader from '../../../component/contents-uploader/contentes-uploader';
import { createSchedule, updateSchedule } from '../../../api/schedule';

const { RangePicker } = DatePicker;

const formLayout = {
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

const ScheduleForm = ({ data }) => {
  const router = useRouter();
  const [wingId, setWingId] = useState('');
  const [name, setName] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [imageContents, setImageContents] = useState('');
  const [videoContents, setVideoContents] = useState('');
  const [contentsType, setContentsType] = useState('image');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<any>(dayjs());
  const [endDate, setEndDate] = useState<any>(dayjs());
  const [status, setStatus] = useState('enabled');
  const [noPeriod, setNoPeriod] = useState(false);
  const [layout, setLayout] = useState('landscape');

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
          type="video"
          source={videoContents}
          onComplete={({ fileName }) => {
            setVideoContents(fileName);
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    if (data) {
      setIsEdit(true);
      setWingId(data.wingId);
      setName(data.name);
      setImageContents(data.imageContents);
      setVideoContents(data.videoContents);
      setDescription(data.description);
      setStartDate(dayjs(data.startDate));
      setEndDate(dayjs(data.endDate));
      setStatus(data.status);
      setNoPeriod(data.noPeriod);
      setLayout(data.layout);
      setContentsType(data.contentsType);
    }
  }, [data]);

  const onFinish = useCallback(async () => {
    try {
      if (isEdit) {
        await updateSchedule(data.id, {
          wingId,
          name,
          imageContents,
          videoContents,
          contentsType,
          status,
          layout,
          description,
          startDate: startDate.toDate(),
          endDate: endDate.toDate(),
          noPeriod,
        });
        void message.success('게시물이 수정됐습니다.');
      } else {
        await createSchedule({
          wingId,
          name,
          imageContents,
          videoContents,
          contentsType,
          status,
          layout,
          description,
          startDate: startDate.toDate(),
          endDate: endDate.toDate(),
          noPeriod,
        });
        void message.success('스케쥴이 생성됐습니다.');
      }
      router.push('/schedule/list');
    } catch (e) {
      void message.error(e.message);
    }
  }, [
    contentsType,
    data,
    description,
    endDate,
    imageContents,
    isEdit,
    layout,
    name,
    noPeriod,
    router,
    startDate,
    status,
    videoContents,
    wingId,
  ]);

  const onChangeWing = useCallback((wing) => {
    setWingId(wing);
  }, []);

  return (
    <Flex vertical gap="middle">
      <Form
        {...formLayout}
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
        <Form.Item label="콘텐츠명" rules={[{ required: true }]}>
          <Input
            value={name}
            style={{ width: 300 }}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="콘텐츠 타입">
          <Radio.Group
            value={contentsType}
            onChange={(e) => {
              setContentsType(e.target.value);
            }}
          >
            <Radio value="image">이미지</Radio>
            <Radio value="video">영상</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="콘텐츠">
          <Tabs items={items} />
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
        <Form.Item label="상태">
          <Switch
            checked={status == 'enabled'}
            onChange={(e) => {
              setStatus(e ? 'enabled' : 'disabled');
            }}
          />
        </Form.Item>
        <Form.Item label="레이아웃">
          <Radio.Group
            value={layout}
            onChange={(e) => {
              setLayout(e.target.value);
            }}
          >
            <Radio value="landscape">가로</Radio>
            <Radio value="portrait">세로</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="메모">
          <Input.TextArea
            value={description}
            style={{ height: 200 }}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </Form.Item>
        <Divider />
        <Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 6 }}>
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

export default ScheduleForm;
