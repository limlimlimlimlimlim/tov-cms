"use client";
import { Button, Flex, Form, Input, Modal, Select, Table, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { ScheduleItem } from "../../../interface/schedule";

const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;

const columns: ColumnsType<ScheduleItem> = [
  {
    title: "번호",
    dataIndex: "no",
    width: 80,
  },
  {
    title: "키오스크",
    dataIndex: "kiosk",
    width: 120,
  },
  {
    title: "스케쥴명",
    dataIndex: "name",
    width: 150,
  },
  {
    title: "종류",
    dataIndex: "type",
    width: 100,
  },
  {
    title: "상태",
    dataIndex: "status",
    width: 100,
  },
  {
    title: "기간",
    render: (value: ScheduleItem) => (
      <>
        {format(value.startDate, "yyyy-MM-dd")} ~
        {format(value.endDate, "yyyy-MM-dd")}
      </>
    ),
    width: 250,
  },
  {
    title: "순서변경",
    dataIndex: "order",
    width: 100,
    render: (order: number) => (
      <Flex>
        <Button size="small">
          <CaretUpOutlined />
        </Button>
        <Button size="small">
          <CaretDownOutlined />
        </Button>
      </Flex>
    ),
  },
  {
    title: "등록일",
    dataIndex: "createDate",
    width: 130,
    render: (date: Date) => format(date, "yyyy-MM-dd hh:mm:ss"),
  },
  {
    title: "최종 수정일",
    dataIndex: "modifiedDate",
    width: 130,
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

export default function ScheduleList() {
  const [count, setCount] = useState(17);
  const [data, setData] = useState<ScheduleItem[]>([]);
  const [selectedData, setSelectedData] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    const temp: ScheduleItem[] = [];
    for (let i = 0; i < 100; i++) {
      temp.push({
        key: i,
        no: i,
        order: i,
        name: `스케쥴명 ${i}`,
        kiosk: `키오스크 ${i}`,
        type: "이미지",
        status: "정상",
        startDate: new Date(),
        endDate: new Date(),
        createDate: new Date(),
        modifiedDate: new Date(),
      });
    }
    setData(temp);
  }, []);

  const onSearch = useCallback(() => {
    console.log("on search");
  }, []);

  const onClickDelete = useCallback(() => {
    confirm({
      title: "스케쥴 삭제 확인",
      okText: "확인",
      cancelText: "취소",
      content: "선택된 스케쥴을 삭제하시겠습니까?",
      onOk() {
        void message.success("선택된 스케쥴이 삭제됐습니다.");
      },
    });
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: ScheduleItem[]) => {
      setSelectedData(selectedRows);
    },
  };

  return (
    <Flex vertical gap="middle">
      <Flex gap="large">
        <Form.Item label="키오스크 선택">
          <Select style={{ width: 200 }} defaultValue="all">
            <Option key="all" value="all">
              전체
            </Option>
            <Option key="floor1" value="floor1">
              1층 키오스크
            </Option>
            <Option key="floor2" value="floor2">
              2층 키오스크
            </Option>
          </Select>
        </Form.Item>
        <Form.Item label="상태">
          <Select style={{ width: 100 }} defaultValue="all">
            <Option key="all" value="all">
              전체
            </Option>
            <Option key="normal" value="normal">
              정상
            </Option>
            <Option key="close" value="close">
              종료
            </Option>
            <Option key="stop" value="stop">
              중지
            </Option>
          </Select>
        </Form.Item>
      </Flex>
      <Flex justify="space-between">
        <Flex gap="small" align="center">
          <Button
            danger
            disabled={selectedData.length === 0}
            onClick={onClickDelete}
          >
            삭제
          </Button>
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
