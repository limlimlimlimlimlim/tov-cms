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

enum PostType {
  Exhibition = 'exhibition',
  Conference = 'conference',
}

enum ContentType {
  Image = 'image',
  Video = 'video',
  Text = 'text',
  ImageText = 'image_text',
  VideoText = 'video_text',
}

enum ContentPostion {
  Left = 'left',
  Right = 'right',
  Top = 'top',
}

const PostForm = ({ data }) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [postType, setPostType] = useState(PostType.Exhibition);
  const [type, setType] = useState(ContentPostion.Left);
  const [imageContents, setImageContents] = useState('');
  const [videoContents, setVideoContents] = useState('');
  const [textContents, setTextContents] = useState('');
  const [textContentsEn, setTextContentsEn] = useState('');
  const [contentsType, setContentsType] = useState(ContentType.Image);
  const [startDate, setStartDate] = useState<any>(dayjs());
  const [endDate, setEndDate] = useState<any>(dayjs());
  const [status, setStatus] = useState('enabled');
  const [noPeriod, setNoPeriod] = useState(false);
  const [useIntro, setUseIntro] = useState(false);
  const [isDisabledIntro, setIsDisabledIntro] = useState(false);

  useEffect(() => {
    setIsDisabledIntro(
      contentsType === ContentType.Text ||
        contentsType === ContentType.ImageText ||
        contentsType === ContentType.VideoText,
    );
  }, [contentsType]);

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
          useIntro: contentsType !== ContentType.Text ? useIntro : false,
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

  const createExhibitionForm = useCallback(() => {
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
          <Flex vertical>
            <Form.Item label="한글">
              <Input.TextArea
                defaultValue={textContents}
                style={{ height: 150 }}
                onChange={(e) => {
                  setTextContents(e.target.value);
                }}
              />
            </Form.Item>

            <Form.Item label="영문">
              <Input.TextArea
                defaultValue={textContentsEn}
                style={{ height: 150 }}
                onChange={(e) => {
                  setTextContentsEn(e.target.value);
                }}
              />
            </Form.Item>
          </Flex>
        ),
      },
    ];
    return (
      <>
        <Form.Item label="게시물 위치">
          <Radio.Group
            value={type}
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <Radio value={ContentPostion.Left}>왼쪽</Radio>
            <Radio value={ContentPostion.Right}>오른쪽</Radio>
            <Radio value={ContentPostion.Top}>상단</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="행사 장소">
          <Flex gap="small" wrap="wrap" style={{ width: 500 }}>
            <Checkbox>전시홀 1</Checkbox>
            <Checkbox>전시홀 2</Checkbox>
            <Checkbox>전시홀 3</Checkbox>
            <Checkbox>전시홀 4</Checkbox>
            <Checkbox>전시홀 5</Checkbox>
            <Checkbox>전시홀 6</Checkbox>
            <Checkbox>전시홀 7</Checkbox>
            <Checkbox>전시홀 8</Checkbox>
            <Checkbox>전시홀 9</Checkbox>
            <Checkbox>전시홀 10</Checkbox>
          </Flex>
        </Form.Item>

        <Form.Item label="행사 기간">
          <RangePicker
            value={[startDate, endDate]}
            onChange={(values) => {
              if (!values) return;
              setStartDate(values[0]);
              setEndDate(values[1]);
            }}
          />
        </Form.Item>

        <Form.Item label="게시물 타입">
          <Radio.Group
            value={contentsType}
            onChange={(e) => {
              setContentsType(e.target.value);
            }}
          >
            <Radio value={ContentType.Image}>이미지</Radio>
            <Radio value={ContentType.Video}>영상</Radio>
            <Radio value={ContentType.Text}>텍스트</Radio>
            <Radio value={ContentType.ImageText}>이미지+텍스트</Radio>
            <Radio value={ContentType.VideoText}>영상+텍스트</Radio>
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
      </>
    );
  }, [
    contentsType,
    endDate,
    imageContents,
    isDisabledIntro,
    noPeriod,
    startDate,
    status,
    textContents,
    type,
    useIntro,
    videoContents,
  ]);

  const createConferenceForm = useCallback(() => {
    return (
      <>
        <Form.Item label="행사 장소">
          <Input style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="행사 기간">
          <RangePicker
            value={[startDate, endDate]}
            onChange={(values) => {
              if (!values) return;
              setStartDate(values[0]);
              setEndDate(values[1]);
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
      </>
    );
  }, [endDate, noPeriod, startDate]);

  return (
    <Flex vertical gap="middle">
      <Form
        {...layout}
        onFinish={onFinish}
        style={{ maxWidth: 1000 }}
        validateMessages={validateMessages}
      >
        <Form.Item label="유형">
          <Radio.Group
            value={postType}
            onChange={(e) => {
              setPostType(e.target.value);
            }}
          >
            <Radio value={PostType.Exhibition}>전시안내</Radio>
            <Radio value={PostType.Conference}>회의안내</Radio>
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
        <Form.Item label="게시물명(영문)" rules={[{ required: true }]}>
          <Input
            value={nameEn}
            style={{ width: 300 }}
            onChange={(e) => {
              setNameEn(e.target.value);
            }}
          />
        </Form.Item>
        {postType === PostType.Exhibition
          ? createExhibitionForm()
          : createConferenceForm()}
        <Form.Item label="상태">
          <Switch
            checked={status === 'enabled'}
            onChange={(e) => {
              setStatus(e ? 'enabled' : 'disabled');
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
