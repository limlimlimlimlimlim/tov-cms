"use client";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Upload,
  message,
} from "antd";
import type { RcFile, UploadChangeParam, UploadProps } from "antd/es/upload";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const { Option } = Select;
const { RangePicker } = DatePicker;
const { warn } = Modal;

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const validateMessages = {
  required: "필수 값을 입력해주세요",
  types: {
    email: "유효하지 않은 이메일 주소입니다.",
    number: "유효하지 않은 값입니다.",
  },
};

export default function AccountRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const onFinish = useCallback(
    (values: any) => {
      void message.success("스케줄이 수정됐습니다.");
      router.push("/schedule/list");
    },
    [router]
  );

  const beforeUpload = useCallback((file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      void message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      void message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  }, []);

  const handleChange: UploadProps["onChange"] = (info: UploadChangeParam) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj!, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const onClickDeleteSchedule = useCallback(() => {
    warn({
      title: "삭제 확인",
      okText: "확인",
      cancelText: "취소",
      content: "스케줄을 삭제하겠습니까?",
      onOk() {
        // alertSuperadmin();
        void message.success("스케줄이 삭제 됐습니다.");
        router.push("/schedule/list");
      },
    });
  }, [router]);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Flex vertical gap="middle">
      <Form
        {...layout}
        onFinish={onFinish}
        style={{ maxWidth: 1000 }}
        validateMessages={validateMessages}
      >
        <Flex style={{ width: "100%" }}>
          <Flex vertical style={{ width: "100%" }}>
            <Form.Item name="kiosk" label="키오스크 선택" initialValue="all">
              <Select style={{ width: 300 }}>
                <Option key="all" value="all">
                  전체
                </Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="name"
              label="콘텐츠명"
              rules={[{ required: true }]}
            >
              <Input style={{ width: 300 }} />
            </Form.Item>
            <Form.Item
              name="contents"
              label={
                <Flex vertical>
                  <div>콘텐츠</div>
                  <div style={{ color: "#888", fontSize: 12 }}>
                    (영상 및 이미지)
                  </div>
                </Flex>
              }
            >
              <Upload
                name="avatar"
                listType="picture-card"
                style={{ width: 200 }}
                showUploadList={false}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
            <Form.Item name="fileName" label="피일명">
              <Input disabled style={{ width: 300 }} />
            </Form.Item>
            <Form.Item label="기간">
              <Flex gap="middle" align="center">
                <RangePicker />
                <Checkbox checked={false}>기간 없음</Checkbox>
              </Flex>
            </Form.Item>
            <Form.Item name="status" label="상태">
              <Switch checked={true}></Switch>
            </Form.Item>
            <Form.Item name="description" label="메모">
              <Input.TextArea style={{ height: 300 }} />
            </Form.Item>
          </Flex>
        </Flex>

        <Divider />
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
          <Flex gap="small" justify="end">
            <Button danger onClick={onClickDeleteSchedule}>
              삭제
            </Button>
            <Link href="/schedule/list">
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
}
