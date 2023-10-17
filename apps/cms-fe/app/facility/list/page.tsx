"use client";
import { Button, Flex, Form, Input, Modal, Select, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { EditOutlined } from "@ant-design/icons";
import type { FacilityItem } from "../../../interface/facility";
import CategoryManagementManagementModal from "../../../component/category-management/category-management-modal";

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

export default function FacilityList() {
  const [count, setCount] = useState(17);
  const [data, setData] = useState<FacilityItem[]>([]);
  const [selectedData, setSelectedData] = useState<FacilityItem[]>([]);
  const [isCategoryManagementModalOpen, setIsOpenCategoryManagementModal] =
    useState(false);

  const columns: ColumnsType<FacilityItem> = [
    {
      title: "번호",
      dataIndex: "no",
      width: 80,
    },
    {
      title: "층",
      dataIndex: "floor",
      width: 80,
    },
    {
      title: "동",
      dataIndex: "building",
      width: 100,
    },
    {
      title: "구분",
      dataIndex: "type",
      width: 120,
    },
    {
      title: "구분상세",
      dataIndex: "detailType",
      width: 120,
    },
    {
      title: "시설명",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "위치설정",
      dataIndex: "position",
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

  useEffect(() => {
    const temp: FacilityItem[] = [];
    for (let i = 0; i < 100; i++) {
      temp.push({
        key: i,
        no: i,
        building: "중앙",
        floor: "1",
        name: "name",
        type: "부대시설",
        detailType: "키오스크",
        position: "완료",
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
      title: "시설 삭제 확인",
      okText: "확인",
      cancelText: "취소",
      content: "선택된 시설을 삭제하시겠습니까?",
      onOk() {
        void message.success("선택된 시설이 삭제됐습니다.");
      },
    });
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: NoticeItem[]) => {
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
            <Form.Item label="구분">
              <Select style={{ width: 100 }} defaultValue="all">
                <Option key="all" value="all">
                  전체
                </Option>
                <Option key="facility" value="facility">
                  시설
                </Option>
                <Option key="ancillary" value="ancillary">
                  부대시설
                </Option>
              </Select>
            </Form.Item>
          </Flex>
          <Button
            onClick={() => {
              setIsOpenCategoryManagementModal(true);
            }}
          >
            카테고리 관리
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
            <Link href="/facility/register">
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
      <CategoryManagementManagementModal
        open={isCategoryManagementModalOpen}
        onCancel={() => {
          setIsOpenCategoryManagementModal(false);
        }}
      />
    </>
  );
}
