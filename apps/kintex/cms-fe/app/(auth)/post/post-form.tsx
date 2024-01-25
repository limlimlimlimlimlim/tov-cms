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

enum ExhibitionType {
  Exh1 = 'EXH1',
  Exh2 = 'EXH2',
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
  const [organizer, setOrganizer] = useState('');
  const [organizerEn, setOrganizerEn] = useState('');
  const [viewingTime, setViewingTime] = useState('');
  const [viewingTimeEn, setViewingTimeEn] = useState('');
  const [fee, setFee] = useState('');
  const [feeEn, setFeeEn] = useState('');
  const [cast, setCast] = useState('');
  const [castEn, setCastEn] = useState('');
  const [exhibitionType, setExhibitionType] = useState(ExhibitionType.Exh1);

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

  const createEventPlaceCheckbox = useCallback(
    (type) => {
      if (!type) {
        return;
      }
      const data = {
        [ExhibitionType.Exh1]: [
          { name: '전시홀1', value: 'EXH1_H1' },
          { name: '전시홀2', value: 'EXH1_H2' },
          { name: '전시홀3', value: 'EXH1_H3' },
          { name: '전시홀4', value: 'EXH1_H4' },
          { name: '전시홀5A', value: 'EXH1_H5A' },
          { name: '전시홀5B', value: 'EXH1_H5B' },
        ],
        [ExhibitionType.Exh2]: [
          { name: '전시홀6', value: 'EXH2_H6' },
          { name: '전시홀7', value: 'EXH2_H7' },
          { name: '전시홀8', value: 'EXH2_H8' },
          { name: '전시홀9', value: 'EXH2_H9' },
          { name: '전시홀10', value: 'EXH2_H10' },
        ],
      };

      return data[type].map((exh: any) => (
        <Checkbox
          key={exh.value}
          value={exh.value}
          checked={eventPlaceCodes[exh.value]}
          onChange={(e) => {
            setEventPlaceCodes({
              ...eventPlaceCodes,
              [exh.value]: e.target.checked,
            });
          }}
        >
          {exh.name}
        </Checkbox>
      ));
    },
    [eventPlaceCodes],
  );

  const createMeetingRoomCheckbox = useCallback(
    (type) => {
      if (!type) {
        return;
      }
      const data = {
        [ExhibitionType.Exh1]: [
          { name: '201', value: 'EXH1_M201' },
          { name: '202', value: 'EXH1_M202' },
          { name: '203', value: 'EXH1_M203' },
          { name: '204', value: 'EXH1_M204' },
          { name: '205', value: 'EXH1_M205' },
          { name: '206', value: 'EXH1_M206' },
          { name: '207', value: 'EXH1_M207' },
          { name: '208', value: 'EXH1_M208' },
          { name: '209', value: 'EXH1_M209' },
          { name: '210', value: 'EXH1_M210' },
          { name: '211', value: 'EXH1_M211' },
          { name: '301', value: 'EXH1_M301' },
          { name: '302', value: 'EXH1_M302' },
          { name: '303', value: 'EXH1_M303' },
          { name: '304', value: 'EXH1_M304' },
          { name: '305', value: 'EXH1_M305' },
          { name: '306', value: 'EXH1_M306' },
          { name: '307', value: 'EXH1_M307' },
          { name: '308', value: 'EXH1_M308' },
          { name: '309', value: 'EXH1_M309' },
          { name: '그랜드볼룸', value: 'MGRD' },
        ],
        [ExhibitionType.Exh2]: [
          { name: '301', value: 'EXH2_M301' },
          { name: '302', value: 'EXH2_M302' },
          { name: '303', value: 'EXH2_M303' },
          { name: '304', value: 'EXH2_M304' },
          { name: '305', value: 'EXH2_M305' },
          { name: '306', value: 'EXH2_M306' },
          { name: '307', value: 'EXH2_M307' },
          { name: '308', value: 'EXH2_M308' },
          { name: '401', value: 'EXH2_M401' },
          { name: '402', value: 'EXH2_M402' },
          { name: '403', value: 'EXH2_M403' },
          { name: '404', value: 'EXH2_M404' },
          { name: '405', value: 'EXH2_M405' },
          { name: '406', value: 'EXH2_M406' },
          { name: '407', value: 'EXH2_M407' },
          { name: '408', value: 'EXH2_M408' },
        ],
      };

      return data[type].map((exh: any) => (
        <Checkbox
          key={exh.value}
          value={exh.value}
          checked={eventPlaceCodes[exh.value]}
          onChange={(e) => {
            setEventPlaceCodes({
              ...eventPlaceCodes,
              [exh.value]: e.target.checked,
            });
          }}
        >
          {exh.name}
        </Checkbox>
      ));
    },
    [eventPlaceCodes],
  );

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
      setEventStartDate(dayjs(data.eventStartDate));
      setEventEndDate(dayjs(data.eventEndDate));
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
      setOrganizer(data.organizer);
      setOrganizerEn(data.organizerEn);
      setViewingTime(data.viewingTime);
      setViewingTimeEn(data.viewingTimeEn);
      setFee(data.fee);
      setFeeEn(data.feeEn);
      setCast(data.cast);
      setCastEn(data.castEn);
      setExhibitionType(data.exhibitionType);
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
            organizer,
            organizerEn,
            viewingTime,
            viewingTimeEn,
            fee,
            feeEn,
            cast,
            castEn,
            exhibitionType,
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
            eventPlaceCodes: Object.entries(eventPlaceCodes)
              .filter((e) => e[1])
              .map((e) => e[0])
              .join(),
            startDate: startDate.toDate(),
            endDate: endDate.toDate(),
            eventStartDate: eventStartDate.toDate(),
            eventEndDate: eventEndDate.toDate(),
            noPeriod,
            useIntro: contentsType !== ContentType.Text ? useIntro : false,
            organizer,
            organizerEn,
            viewingTime,
            viewingTimeEn,
            fee,
            feeEn,
            cast,
            castEn,
            exhibitionType,
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
            organizer,
            organizerEn,
            viewingTime,
            viewingTimeEn,
            fee,
            feeEn,
            cast,
            castEn,
            exhibitionType,
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
            eventPlaceCodes: Object.entries(eventPlaceCodes)
              .filter((e) => e[1])
              .map((e) => e[0])
              .join(),
            startDate: startDate.toDate(),
            endDate: endDate.toDate(),
            eventStartDate: eventStartDate.toDate(),
            eventEndDate: eventEndDate.toDate(),
            noPeriod,
            useIntro: contentsType !== ContentType.Text ? useIntro : false,
            organizer,
            organizerEn,
            viewingTime,
            viewingTimeEn,
            fee,
            feeEn,
            cast,
            castEn,
            exhibitionType,
          });
        }
        void message.success('게시물이 생성됐습니다.');
      }
      router.push('/post/list');
    } catch (e) {
      void message.error(e.message);
    }
  }, [
    cast,
    castEn,
    contentsType,
    data,
    endDate,
    eventEndDate,
    eventPlaceCodes,
    eventPlaceText,
    eventPlaceTextEn,
    eventStartDate,
    exhibitionType,
    fee,
    feeEn,
    imageContents,
    isEdit,
    name,
    nameEn,
    noPeriod,
    organizer,
    organizerEn,
    postType,
    router,
    startDate,
    status,
    textContents,
    textContentsEn,
    type,
    useIntro,
    videoContents,
    viewingTime,
    viewingTimeEn,
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

        <Form.Item label="주최" rules={[{ required: true }]}>
          <Input
            value={organizer}
            style={{ width: 300 }}
            onChange={(e) => {
              setOrganizer(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="주최(영문)" rules={[{ required: true }]}>
          <Input
            value={organizerEn}
            style={{ width: 300 }}
            onChange={(e) => {
              setOrganizerEn(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="관람시간" rules={[{ required: true }]}>
          <Input
            value={viewingTime}
            style={{ width: 300 }}
            onChange={(e) => {
              setViewingTime(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="관람시간(영문)" rules={[{ required: true }]}>
          <Input
            value={viewingTimeEn}
            style={{ width: 300 }}
            onChange={(e) => {
              setViewingTimeEn(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="입장료" rules={[{ required: true }]}>
          <Input.TextArea
            value={fee}
            style={{ width: 300, height: 60 }}
            onChange={(e) => {
              setFee(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="입장료(영문)" rules={[{ required: true }]}>
          <Input.TextArea
            value={feeEn}
            style={{ width: 300, height: 60 }}
            onChange={(e) => {
              setFeeEn(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="출연진" rules={[{ required: true }]}>
          <Input
            value={cast}
            style={{ width: 300 }}
            onChange={(e) => {
              setCast(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="출연진(영문)" rules={[{ required: true }]}>
          <Input
            value={castEn}
            style={{ width: 300 }}
            onChange={(e) => {
              setCastEn(e.target.value);
            }}
          />
        </Form.Item>

        <Form.Item label="행사 장소">
          <Flex vertical gap="small">
            <div>
              <Radio.Group
                value={exhibitionType}
                onChange={(e) => {
                  setExhibitionType(e.target.value);
                }}
              >
                <Radio value={ExhibitionType.Exh1}>제1 전시장</Radio>
                <Radio value={ExhibitionType.Exh2}>제2 전시장</Radio>
              </Radio.Group>
            </div>
            <Flex gap="small" wrap="wrap" style={{ width: 600 }}>
              {createEventPlaceCheckbox(exhibitionType)}
            </Flex>
          </Flex>
        </Form.Item>

        <Form.Item label="행사 기간">
          <RangePicker
            value={[eventStartDate, eventEndDate]}
            onChange={(values) => {
              if (!values) return;
              console.log(values);
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
    organizer,
    organizerEn,
    viewingTime,
    viewingTimeEn,
    fee,
    feeEn,
    cast,
    castEn,
    exhibitionType,
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
        <Form.Item label="회의 장소">
          <Flex vertical gap="small">
            <div>
              <Radio.Group
                value={exhibitionType}
                onChange={(e) => {
                  setEventPlaceCodes({});
                  setExhibitionType(e.target.value);
                }}
              >
                <Radio value={ExhibitionType.Exh1}>제1 전시장</Radio>
                <Radio value={ExhibitionType.Exh2}>제2 전시장</Radio>
              </Radio.Group>
            </div>
            <Flex gap="small" wrap="wrap" style={{ width: 600 }}>
              {createMeetingRoomCheckbox(exhibitionType)}
            </Flex>
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
    createMeetingRoomCheckbox,
    endDate,
    eventEndDate,
    eventPlaceText,
    eventPlaceTextEn,
    eventStartDate,
    exhibitionType,
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
