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
import ContentsUploader from '../../../component/contents-uploader/contentes-uploader';
import { createPost, updatePost } from '../../../api/post';

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
  const [name, setName] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [type, setType] = useState('left');
  const [imageContents, setImageContents] = useState('');
  const [videoContents, setVideoContents] = useState('');
  const [textContents, setTextContents] = useState('');
  const [contentsType, setContentsType] = useState('image');
  const [startDate, setStartDate] = useState<any>(dayjs());
  const [endDate, setEndDate] = useState<any>(dayjs());
  const [status, setStatus] = useState('enabled');
  const [noPeriod, setNoPeriod] = useState(false);
  const [useIntro, setUseIntro] = useState(false);
  const [isDisabledIntro, setIsDisabledIntro] = useState(false);

  useEffect(() => {
    setIsDisabledIntro(
      contentsType === 'text' ||
        contentsType === 'image_text' ||
        contentsType === 'video_text',
    );
  }, [contentsType]);

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
          type="video"
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
    try {
      if (isEdit) {
        await updatePost(data.id, {
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
          useIntro: contentsType !== 'text' ? useIntro : false,
        });
        void message.success('게시물이 수정됐습니다.');
      } else {
        await createPost({
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
  ]);

  return (
    <Flex vertical gap="middle">
      <Form
        {...layout}
        onFinish={onFinish}
        style={{ maxWidth: 1000 }}
        validateMessages={validateMessages}
      >
        <Form.Item label="게시물명" rules={[{ required: true }]}>
          <Input
            value={name}
            style={{ width: 300 }}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Form.Item>

        <Form.Item label="게시물 위치">
          <Radio.Group
            value={type}
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <Radio value="left">왼쪽</Radio>
            <Radio value="right">오른쪽</Radio>
            <Radio value="top">상단</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="게시물 타입">
          <Radio.Group
            value={contentsType}
            onChange={(e) => {
              setContentsType(e.target.value);
            }}
          >
            <Radio value="image">이미지</Radio>
            <Radio value="video">영상</Radio>
            <Radio value="text">텍스트</Radio>
            <Radio value="image_text">이미지+텍스트</Radio>
            <Radio value="video_text">영상+텍스트</Radio>
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
        {!isDisabledIntro && (
          <Form.Item label="인트로 콘텐츠 노출">
            <Switch
              checked={useIntro}
              onChange={(e) => {
                setUseIntro(e);
              }}
            />
          </Form.Item>
        )}

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
