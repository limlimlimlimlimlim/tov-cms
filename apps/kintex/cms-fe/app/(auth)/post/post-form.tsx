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
import { getWings } from '../../../api/building-info';

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
  None = 'none',
}

enum ContentPostion {
  Left = 'left',
  Right = 'right',
  Top = 'top',
  None = 'none',
}

const PostForm = ({ data }) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [postType, setPostType] = useState(PostType.Exhibition);
  const [type, setType] = useState(ContentPostion.Left);
  const [eventPlaceCodes, setEventPlaceCodes] = useState({});
  const [eventPlaceText, setEventPlaceText] = useState('');
  const [eventPlaceTextEn, setEventPlaceTextEn] = useState('');
  const [imageContents, setImageContents] = useState('');
  const [videoContents, setVideoContents] = useState('');
  const [textContents, setTextContents] = useState('');
  const [textContentsEn, setTextContentsEn] = useState('');
  const [contentsType, setContentsType] = useState(ContentType.Image);
  const [startDate, setStartDate] = useState<any>(dayjs());
  const [endDate, setEndDate] = useState<any>(dayjs());
  const [eventStartDate, setEventStartDate] = useState<any>(dayjs());
  const [eventEndDate, setEventEndDate] = useState<any>(dayjs());
  const [status, setStatus] = useState('enabled');
  const [noPeriod, setNoPeriod] = useState(false);
  const [useIntro, setUseIntro] = useState(false);
  const [isDisabledIntro, setIsDisabledIntro] = useState(false);
  const [wings, setWings] = useState([]);

  const fetchData = async () => {
    const result = await getWings();
    setWings(result.data);
  };

  useEffect(() => {
    fetchData();
    if (data?.eventPlaceCodes) {
      const codes = data.eventPlaceCodes.split(',');
      const codeMap = codes.reduce((acc, data) => {
        acc[data] = true;
        return acc;
      }, {});
      setEventPlaceCodes(codeMap);
    }
  }, [data]);

  const createEventPlaceCheckbox = useCallback(() => {
    return wings.map((w: any) => (
      <Checkbox
        key={w.id}
        value={w.id}
        checked={eventPlaceCodes[w.id]}
        onChange={(e) => {
          setEventPlaceCodes({ ...eventPlaceCodes, [w.id]: e.target.checked });
        }}
      >
        {w.name}
      </Checkbox>
    ));
  }, [eventPlaceCodes, wings]);

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
      setNameEn(data.nameEn);
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
      setPostType(data.postType);
      setEventPlaceText(data.eventPlaceText);
      setEventPlaceTextEn(data.eventPlaceTextEn);
      setTextContents(data.textContents);
      setTextContentsEn(data.textContentsEn);
    }
  }, [data]);

  const onFinish = useCallback(async () => {
    try {
      if (isEdit) {
        if (postType === PostType.Exhibition) {
          await updatePost(data.id, {
            name,
            nameEn,
            postType,
            type,
            imageContents,
            videoContents,
            textContents,
            textContentsEn,
            contentsType,
            eventPlaceCodes: Object.entries(eventPlaceCodes)
              .filter((e) => e[1])
              .map((e) => e[0])
              .join(),
            status,
            startDate: startDate.toDate(),
            endDate: endDate.toDate(),
            eventStartDate: eventStartDate.toDate(),
            eventEndDate: eventEndDate.toDate(),
            noPeriod,
            useIntro: contentsType !== ContentType.Text ? useIntro : false,
          });
        } else if (postType === PostType.Conference) {
          await updatePost(data.id, {
            name,
            nameEn,
            postType,
            type: ContentPostion.None,
            status,
            eventPlaceText,
            eventPlaceTextEn,
            startDate: startDate.toDate(),
            endDate: endDate.toDate(),
            eventStartDate: eventStartDate.toDate(),
            eventEndDate: eventEndDate.toDate(),
            noPeriod,
            useIntro: contentsType !== ContentType.Text ? useIntro : false,
          });
        }

        void message.success('게시물이 수정됐습니다.');
      } else {
        if (postType === PostType.Exhibition) {
          await createPost({
            name,
            nameEn,
            postType,
            type,
            imageContents,
            videoContents,
            textContents,
            textContentsEn,
            contentsType,
            eventPlaceCodes: Object.entries(eventPlaceCodes)
              .filter((e) => e[1])
              .map((e) => e[0])
              .join(),
            status,
            startDate: startDate.toDate(),
            endDate: endDate.toDate(),
            eventStartDate: eventStartDate.toDate(),
            eventEndDate: eventEndDate.toDate(),
            noPeriod,
            useIntro: contentsType !== ContentType.Text ? useIntro : false,
          });
        } else if (postType === PostType.Conference) {
          await createPost({
            name,
            nameEn,
            postType,
            type: ContentPostion.None,
            status,
            contentsType: ContentType.None,
            eventPlaceText,
            eventPlaceTextEn,
            startDate: startDate.toDate(),
            endDate: endDate.toDate(),
            eventStartDate: eventStartDate.toDate(),
            eventEndDate: eventEndDate.toDate(),
            noPeriod,
            useIntro: contentsType !== ContentType.Text ? useIntro : false,
          });
        }
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
    eventEndDate,
    eventPlaceCodes,
    eventPlaceText,
    eventPlaceTextEn,
    eventStartDate,
    imageContents,
    isEdit,
    name,
    nameEn,
    noPeriod,
    postType,
    router,
    startDate,
    status,
    textContents,
    textContentsEn,
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

      // {
      //   label: '영상',
      //   key: 'video',
      //   children: (
      //     <ContentsUploader
      //       source={videoContents}
      //       type="video"
      //       onComplete={({ fileName }) => {
      //         setVideoContents(fileName);
      //       }}
      //     />
      //   ),
      // },
      // {
      //   label: '텍스트',
      //   key: 'text',
      //   children: (
      //     <Flex vertical>
      //       <Form.Item label="한글">
      //         <Input.TextArea
      //           defaultValue={textContents}
      //           style={{ height: 150 }}
      //           onChange={(e) => {
      //             setTextContents(e.target.value);
      //           }}
      //         />
      //       </Form.Item>

      //       <Form.Item label="영문">
      //         <Input.TextArea
      //           defaultValue={textContentsEn}
      //           style={{ height: 150 }}
      //           onChange={(e) => {
      //             setTextContentsEn(e.target.value);
      //           }}
      //         />
      //       </Form.Item>
      //     </Flex>
      //   ),
      // },
    ];
    return (
      <>
        {/* <Form.Item label="게시물 위치">
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
        </Form.Item> */}

        <Form.Item label="행사 장소">
          <Flex gap="small" wrap="wrap" style={{ width: 500 }}>
            {createEventPlaceCheckbox()}
          </Flex>
        </Form.Item>

        <Form.Item label="행사 기간">
          <RangePicker
            value={[eventStartDate, eventEndDate]}
            onChange={(values) => {
              if (!values) return;
              setEventStartDate(values[0]);
              setEventEndDate(values[1]);
            }}
          />
        </Form.Item>

        {/* <Form.Item label="게시물 타입">
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
        </Form.Item> */}

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
        {/* {!isDisabledIntro && (
          <Form.Item label="인트로 콘텐츠 노출">
            <Switch
              checked={useIntro}
              onChange={(e) => {
                setUseIntro(e);
              }}
            />
          </Form.Item>
        )} */}
      </>
    );
  }, [
    imageContents,
    createEventPlaceCheckbox,
    eventStartDate,
    eventEndDate,
    startDate,
    endDate,
    noPeriod,
  ]);

  const createConferenceForm = useCallback(() => {
    return (
      <>
        <Form.Item label="행사 장소">
          <Input
            style={{ width: 300 }}
            value={eventPlaceText}
            onChange={(e) => {
              setEventPlaceText(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="행사 장소(영문)">
          <Input
            style={{ width: 300 }}
            value={eventPlaceTextEn}
            onChange={(e) => {
              setEventPlaceTextEn(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="행사 기간">
          <RangePicker
            value={[eventStartDate, eventEndDate]}
            onChange={(values) => {
              if (!values) return;
              setEventStartDate(values[0]);
              setEventEndDate(values[1]);
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
  }, [
    endDate,
    eventEndDate,
    eventPlaceText,
    eventPlaceTextEn,
    eventStartDate,
    noPeriod,
    startDate,
  ]);

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
