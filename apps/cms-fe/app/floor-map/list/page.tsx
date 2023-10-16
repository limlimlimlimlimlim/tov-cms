"use client";
import { Button, Flex, Form, Input, Modal, Select, Table, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { EditOutlined } from "@ant-design/icons";
import type { FloorMapItem } from "../../../interface/floor-map";
import BuldingInfoManagementModal from "../../../component/building-info-management-modal/building-info-management-modal";

const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;

const columns: ColumnsType<FloorMapItem> = [
  {
    title: "번호",
    dataIndex: "no",
    width: 80,
  },
  {
    title: "층",
    dataIndex: "floor",
    width: 100,
  },
  {
    title: "동",
    dataIndex: "building",
    width: 100,
  },
  {
    title: "지도명",
    dataIndex: "name",
  },
  {
    title: "상태",
    dataIndex: "status",
    width: 100,
  },
  {
    title: "미리보기",
    width: 100,
    render: () => <Button size="small">미리보기</Button>,
  },
  {
    title: "등록일",
    dataIndex: "createDate",
    width: 180,
    render: (date: Date) => format(date, "yyyy-MM-dd hh:mm:ss"),
  },
  {
    title: "최종 수정일",
    dataIndex: "modifiedDate",
    width: 180,
    render: (date: Date) => format(date, "yyyy-MM-dd hh:mm:ss"),
  },
  {
    title: "구역설정",
    width: 100,
    render: () => <Button size="small">구역설정</Button>,
  },
  {
    title: "",
    width: 80,
    render: (value: any) => {
      return (
        <Link href={`/floor-map/edit/${(value as any).no}`}>
          <Button size="small" type="text">
            <EditOutlined />
          </Button>
        </Link>
      );
    },
  },
];

export default function KioskList() {
  const [count, setCount] = useState(17);
  const [data, setData] = useState<FloorMapItem[]>([]);
  const [selectedData, setSelectedData] = useState<FloorMapItem[]>([]);
  const [isBuildingManagementModalOpen, setIsBuildingManagementModalOpen] =
    useState(false);

  useEffect(() => {
    const temp: FloorMapItem[] = [];
    for (let i = 0; i < 100; i++) {
      temp.push({
        key: i,
        no: i,
        building: "중앙",
        floor: "1",
        name: "name",
        status: "사용",
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
      title: "층별 지도 확인",
      okText: "확인",
      cancelText: "취소",
      content: "선택된 층별 지도를 삭제하시겠습니까?",
      onOk() {
        void message.success("선택된 층별 지도가 삭제됐습니다.");
      },
    });
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: FloorMapItem[]) => {
      setSelectedData(selectedRows);
    },
  };

  return (
    <>
      <Flex vertical gap="middle">
        <Flex justify="space-between">
          <Flex gap="large">
            <Form.Item label="층 선택">
              <Select style={{ width: 100 }} defaultValue="all">
                <Option key="all" value="all">
                  전체
                </Option>
                <Option key="floor1" value="floor1">
                  1층
                </Option>
                <Option key="floor2" value="floor2">
                  2층
                </Option>
                <Option key="floor3" value="floor3">
                  3층
                </Option>
              </Select>
            </Form.Item>
            <Form.Item label="동 선택">
              <Select style={{ width: 200 }} defaultValue="all">
                <Option key="all" value="all">
                  전체
                </Option>
                <Option key="building1" value="building1">
                  중앙
                </Option>
              </Select>
            </Form.Item>
          </Flex>
          <Button
            onClick={() => {
              setIsBuildingManagementModalOpen(true);
            }}
          >
            건물 정보 관리
          </Button>
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
            <Link href="/floor-map/register">
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
      <BuldingInfoManagementModal
        open={isBuildingManagementModalOpen}
        onCancel={() => {
          setIsBuildingManagementModalOpen(false);
        }}
      />
    </>
  );
}
