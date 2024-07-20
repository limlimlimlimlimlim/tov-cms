'use client';
import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Radio,
  Switch,
  Tabs,
  message,
} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import ContentsUploader from '../../../component/contents-uploader/contentes-uploader';
import { createSchedule, updateSchedule } from '../../../api/schedule';
import { scheduleWingCodes } from './data';

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
  const [wingCodes, setWingCodes] = useState({});
  const [name, setName] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [imageContents, setImageContents] = useState('');
  const [videoContents, setVideoContents] = useState('');
  const [contentsType, setContentsType] = useState('video');
  const [duration, setDuration] = useState(3);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<any>(dayjs());
  const [endDate, setEndDate] = useState<any>(dayjs());
  const [status, setStatus] = useState('enabled');
  const [noPeriod, setNoPeriod] = useState(false);
  const [layout, setLayout] = useState('landscape');

  const items = [
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
  ];

  useEffect(() => {
    if (data) {
      setIsEdit(true);
      if (data.wingCodes) {
        setWingCodes(
          data.wingCodes.split(',').reduce((acc, data) => {
            acc[data] = true;
            return acc;
          }, {}),
        );
      }

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
      setDuration(data.duration);
    }
  }, [data]);

  const onFinish = useCallback(async () => {
    try {
      const codes = Object.entries(wingCodes)
        .filter((entry) => entry[1])
        .map((entry) => entry[0])
        .join();
      if (isEdit) {
        await updateSchedule(data.id, {
          wingCodes: codes,
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
          duration,
        });
        void message.success('게시물이 수정됐습니다.');
      } else {
        await createSchedule({
          wingCodes: codes,
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
          duration,
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
    duration,
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
    wingCodes,
  ]);

  const createWingCodesCheck = useCallback(() => {
    return scheduleWingCodes.map((code) => {
      return (
        <Checkbox
          key={code.code}
          value={code.code}
          checked={wingCodes[code.code]}
          onChange={(e) => {
            setWingCodes({ ...wingCodes, [code.code]: e.target.checked });
          }}
        >
          {code.label}
        </Checkbox>
      );
    });
  }, [wingCodes]);

  return (
    <Flex vertical gap="middle">
      <Form
        {...formLayout}
        onFinish={onFinish}
        style={{ maxWidth: 1000 }}
        validateMessages={validateMessages}
      >
        <Form.Item label="건물 선택">
          <Checkbox
            onChange={(e) => {
              setWingCodes(
                scheduleWingCodes.reduce((acc, code) => {
                  acc[code.code] = e.target.checked;
                  return acc;
                }, {}),
              );
            }}
          >
            전체
          </Checkbox>
          {createWingCodesCheck()}
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
            <Radio value="video">영상</Radio>
            <Radio value="image">이미지</Radio>
          </Radio.Group>
        </Form.Item>
        {contentsType === 'image' && (
          <Form.Item label="노출 시간">
            <InputNumber
              value={duration}
              onChange={(value: number) => {
                setDuration(value);
              }}
            />{' '}
            초
          </Form.Item>
        )}

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
            checked={status === 'enabled'}
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
