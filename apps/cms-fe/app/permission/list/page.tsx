"use client";
import { Button, Flex, Table } from "antd";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { EditOutlined } from "@ant-design/icons";
import type { AccountItem, PermissionItem } from "../../../interface/account";

const columns: ColumnsType<PermissionItem> = [
  {
    title: "번호",
    dataIndex: "no",
    width: 80,
  },
  {
    title: "권한명",
    dataIndex: "name",
    width: 150,
  },
  {
    title: "설명",
    dataIndex: "description",
  },
  {
    title: "최종 수정일",
    dataIndex: "modifiedDate",
    render: (date: Date) => format(date, "yyyy-MM-dd hh:mm:ss"),
    width: 200,
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

export default function PermissionList() {
  const [count, setCount] = useState(17);
  const [data, setData] = useState<PermissionItem[]>([]);
  const [selectedData, setSelectedData] = useState<PermissionItem[]>([]);

  useEffect(() => {
    const temp: PermissionItem[] = [];
    for (let i = 0; i < 3; i++) {
      temp.push({
        key: i,
        no: i,
        name: `Permission ${i}`,
        description: `Permission ${i}`,
        modifiedDate: new Date(),
      });
    }
    setData(temp);
  }, []);

  const rowSelection = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: PermissionItem[]
    ) => {
      setSelectedData(selectedRows);
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
          <Button danger disabled={selectedData.length === 0}>
            삭제
          </Button>
          <Link href="/account/register">
            <Button type="primary">등록</Button>
          </Link>

          <span>Total : {count}</span>
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
