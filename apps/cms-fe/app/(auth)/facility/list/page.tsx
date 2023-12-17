'use client';
import { Button, Flex, Form, Input, Modal, Table, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';
import FloorSelect from '../../../../component/floor-select/floor-select';
import WingSelect from '../../../../component/wing-select/wing-select';
import { deleteFacility, getFacilities } from '../../../../api/facility';
import CategoryManagementManagementModal from '../../../../component/category-management/category-management-modal';
import type { FacilityItem } from '../../../../interface/facility';

const { Search } = Input;
const { confirm } = Modal;

const columns: ColumnsType<FacilityItem> = [
  {
    title: '번호',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '건물명',
    width: 100,
    render: (row) => row.wing.name,
  },
  {
    title: '층',
    width: 100,
    render: (row) => row.floor?.name,
  },
  {
    title: '구분',
    width: 150,
    render: (row) => row.category?.name,
  },
  {
    title: '구분상세',
    width: 150,
    render: (row) => row.subCategory?.name,
  },
  {
    title: '시설명',
    width: 150,
    dataIndex: 'name',
  },
  {
    title: '위치설정',
    width: 150,
    dataIndex: 'status',
  },
  {
    title: '등록일',
    dataIndex: 'createdAt',
    width: 180,
    render: (date: string) => format(new Date(date), 'yyyy-MM-dd hh:mm:ss'),
  },
  {
    title: '최종 수정일',
    dataIndex: 'updatedAt',
    width: 180,
    render: (date: string) => format(new Date(date), 'yyyy-MM-dd hh:mm:ss'),
  },
  {
    title: '',
    width: 80,
    render: (value: any) => {
      return (
        <Link href={`/facility/edit/${(value as any).id}`}>
          <Button size="small" type="text">
            <EditOutlined />
          </Button>
        </Link>
      );
    },
  },
];

export default function FacilityList() {
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<FacilityItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [floor, setFloor] = useState('');
  const [wing, setWing] = useState('');
  const [page, setPage] = useState(1);
  const count = useMemo(() => 50, []);
  const [selectedData, setSelectedData] = useState<FacilityItem[]>([]);
  const [isOpenCategoryManagementModal, setIsOpenCategoryManagementModal] =
    useState(false);

  const fetchData = useCallback(
    async ({ keyword, page, count, floor, wing }) => {
      const facilities = await getFacilities({
        keyword,
        page,
        count,
        floor,
        wing,
      });
      setData(facilities.data.data);
      setTotal(facilities.data.total);
    },
    [],
  );

  useEffect(() => {
    setPage(1);
    void fetchData({ keyword, page, count, floor, wing });
  }, [keyword, page, count, floor, fetchData, wing]);

  const onSearch = useCallback((value) => {
    setKeyword(value);
  }, []);

  const onClickDelete = useCallback(() => {
    confirm({
      title: '시설 삭제 확인',
      okText: '확인',
      cancelText: '취소',
      content: '선택된 시설을 삭제하시겠습니까?',
      async onOk() {
        await Promise.all(selectedData.map((row) => deleteFacility(row.id)));
        void fetchData({ keyword, page, count, floor, wing });
        void message.success('선택된 시설이 삭제됐습니다.');
      },
    });
  }, [count, fetchData, floor, keyword, page, selectedData, wing]);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: FacilityItem[]) => {
      setSelectedData(selectedRows);
    },
  };

  const onChangeWing = useCallback((w) => {
    setWing(w);
    setFloor('');
  }, []);

  const onChangeFloor = useCallback((f: any) => {
    setFloor(f);
  }, []);

  const onChangePage = useCallback((p) => {
    setPage(p.current);
  }, []);

  return (
    <Flex vertical gap="middle">
      <Flex justify="space-between">
        <Flex gap="large">
          <Form.Item label="건물 선택">
            <WingSelect
              wingId={wing}
              style={{ width: 200 }}
              onChange={onChangeWing}
              useAll
            />
          </Form.Item>
          <Form.Item label="층 선택">
            <FloorSelect
              wingId={wing}
              floorId={floor}
              style={{ width: 200 }}
              onChange={onChangeFloor}
              useAll
            />
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
            disabled={data.length === 0 || selectedData.length === 0}
            onClick={onClickDelete}
          >
            삭제
          </Button>
          <Link href="/facility/register">
            <Button type="primary">등록</Button>
          </Link>

          <span>Total : {total}</span>
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
        pagination={{ pageSize: count, current: page, total }}
        scroll={{ y: 750 }}
        rowKey="id"
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        onChange={onChangePage}
      />
      <CategoryManagementManagementModal
        open={isOpenCategoryManagementModal}
        onCancel={() => {
          setIsOpenCategoryManagementModal(false);
        }}
      />
    </Flex>
  );
}
