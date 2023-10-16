"use client";
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Form,
  Input,
  Table,
  message,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const defaultDataSource = [
  {
    key: "1",
    depth1: "계정관리",
    depth2: "계정관리",
    read: false,
    write: false,
    update: false,
    delete: false,
  },
  {
    key: "2",
    depth1: "계정관리",
    depth2: "권한관리",
    read: false,
    write: false,
    update: false,
    delete: false,
  },
  {
    key: "3",
    depth1: "스케줄",
    depth2: "",
    read: false,
    write: false,
    update: false,
    delete: false,
  },
  {
    key: "4",
    depth1: "게시물",
    depth2: "",
    read: false,
    write: false,
    update: false,
    delete: false,
  },
  {
    key: "5",
    depth1: "지도관리",
    depth2: "층별지도",
    read: false,
    write: false,
    update: false,
    delete: false,
  },
  {
    key: "6",
    depth1: "지도관리",
    depth2: "지도정보",
    read: false,
    write: false,
    update: false,
    delete: false,
  },
  {
    key: "7",
    depth1: "시설관리",
    depth2: "",
    read: false,
    write: false,
    update: false,
    delete: false,
  },
  {
    key: "8",
    depth1: "키오스크관리",
    depth2: "",
    read: false,
    write: false,
    update: false,
    delete: false,
  },
];

export default function PermissionRegister() {
  const router = useRouter();
  const [dataSource, setDataSource] = useState(defaultDataSource);
  const [currentSelectedRowKeys, setCurrentSelectedRowKeys] = useState<
    React.Key[]
  >([]);
  const upatePermission = useCallback(
    (key, type, checked) => {
      const data = [...dataSource];
      const target = data.find((item) => item.key === key);
      if (!target) return;
      target[type] = checked;
      setDataSource(data);
    },
    [dataSource]
  );

  const upatePermissionAll = useCallback(
    (key, checked) => {
      const data = [...dataSource];
      const target = data.find((item) => item.key === key);
      if (!target) return;
      target.read = checked;
      target.write = checked;
      target.update = checked;
      target.delete = checked;
      setDataSource(data);
    },
    [dataSource]
  );

  const columns = [
    {
      title: "대메뉴",
      dataIndex: "depth1",
      key: "depth1",
    },
    {
      title: "소메뉴",
      dataIndex: "depth2",
      key: "depth2",
    },
    {
      title: "보기",
      key: "read",
      render: (value: any) => {
        return (
          <Checkbox
            checked={value.read}
            onChange={() => upatePermission(value.key, "read", !value.read)}
          />
        );
      },
    },
    {
      title: "등록",
      key: "write",
      render: (value: any) => (
        <Checkbox
          checked={value.write}
          onChange={() => upatePermission(value.key, "write", !value.write)}
        />
      ),
    },
    {
      title: "수정",
      key: "update",
      render: (value: any) => (
        <Checkbox
          checked={value.update}
          onChange={() => upatePermission(value.key, "update", !value.update)}
        />
      ),
    },
    {
      title: "삭제",
      key: "delete",
      render: (value: any) => (
        <Checkbox
          checked={value.delete}
          onChange={() => upatePermission(value.key, "delete", !value.delete)}
        />
      ),
    },
  ];

  const onFinish = useCallback(
    (values: any) => {
      void message.success("권한이 생성됐습니다.");
      router.push("/permission/list");
    },
    [router]
  );

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      currentSelectedRowKeys.forEach((key) => upatePermissionAll(key, false));
      selectedRowKeys.forEach((key) => upatePermissionAll(key, true));
      setCurrentSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <Flex vertical gap="middle">
      <Form {...layout} onFinish={onFinish} style={{ maxWidth: 1000 }}>
        <Form.Item name="name" label="권한명" rules={[{ required: true }]}>
          <Input style={{ width: 250 }} />
        </Form.Item>
        <Form.Item label="권한 설정" style={{ marginBottom: 10 }}>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
          />
        </Form.Item>

        <Divider />
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
          <Flex gap="small" justify="end">
            <Link href="/account/list">
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
