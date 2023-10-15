"use client";
import { Button, Flex, Input, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import type { AccountItem } from "../../../interface/account";
import { EditOutlined } from "@ant-design/icons";

const { Search } = Input;

const columns: ColumnsType<AccountItem> = [
  {
    title: "번호",
    dataIndex: "no",
    width: 80,
  },
  {
    title: "이름",
    dataIndex: "name",
    width: 150,
  },
  {
    title: "아이디",
    dataIndex: "id",
    width: 150,
  },
  {
    title: "권한",
    dataIndex: "permission",
  },
  {
    title: "등록일",
    dataIndex: "createDate",
    render: (date: Date) => format(date, "yyyy-MM-dd hh:mm:ss"),
  },
  {
    title: "최종 수정일",
    dataIndex: "modifiedDate",
    render: (date: Date) => format(date, "yyyy-MM-dd hh:mm:ss"),
  },
  {
    title: "",
    width: 80,
    render: (value: any) => {
      return (
        <Link href={`/account/edit/${(value as any).no}`}>
          <Button size="small" type="text">
            <EditOutlined />
          </Button>
        </Link>
      );
    },
  },
];

export default function AccountList() {
  const [count, setCount] = useState(17);
  const [data, setData] = useState<AccountItem[]>([]);

  useEffect(() => {
    const temp: AccountItem[] = [];
    for (let i = 0; i < 100; i++) {
      temp.push({
        key: i,
        no: i,
        name: `Edward King ${i}`,
        id: `id-${i}`,
        permission: `admin`,
        createDate: new Date(),
        modifiedDate: new Date(),
      });
    }
    setData(temp);
  }, []);

  const onSearch = useCallback(() => {
    console.log("on search");
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: AccountItem[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record: AccountItem) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <Flex vertical gap="middle">
      <Flex justify="space-between">
        <Flex gap="small" align="center">
          <Button danger>삭제</Button>
          <Link href="/account/register">
            <Button type="primary">등록</Button>
          </Link>

          <span>Total : {count}</span>
        </Flex>
        <Flex>
          <Search
            placeholder="검색어를 입력해주세요."
            onSearch={onSearch}
            style={{ width: 300 }}
          />
        </Flex>
      </Flex>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 50 }}
        scroll={{ y: 750 }}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
      />
    </Flex>
  );
}
