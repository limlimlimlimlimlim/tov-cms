'use client';
import { Button, Flex, Form, Input, Table } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';
import type { MapInfoItem } from '../../../interface/map-info';
import { getMaps } from '../../../api/map';
import FloorSelect from '../../../component/floor-select/floor-select';
import WingSelect from '../../../component/wing-select/wing-select';

const { Search } = Input;

export default function MapInfoList() {
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<MapInfoItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const count = useMemo(() => 50, []);
  const [floor, setFloor] = useState('');
  const [wing, setWing] = useState('');

  const fetchData = useCallback(
    async ({ keyword, page, count, floor, wing }) => {
      const maps = await getMaps({ keyword, page, count, floor, wing });
      setData(maps.data.data);
      setTotal(maps.data.total);
    },
    [],
  );

  useEffect(() => {
    setPage(1);
    void fetchData({ keyword, page, count, floor, wing });
  }, [keyword, page, count, floor, fetchData, wing]);

  const columns: ColumnsType<MapInfoItem> = [
    {
      title: '번호',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '층',
      width: 100,
      render: (row) => row.floor.name,
    },
    {
      title: '건물',
      width: 100,
      render: (row) => row.wing.name,
    },
    {
      title: '지도명',
      width: 150,
      dataIndex: 'name',
    },
    {
      title: '구역 수',
      width: 100,
      render: (row) => row.sections.length,
    },
    {
      title: '설정 시설 수',
      width: 140,
      render: () => 0,
    },
    {
      title: '미리보기',
      width: 100,
      render: () => <Button size="small">미리보기</Button>,
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
          <Link href={`/map-info/edit/${(value as any).id}`}>
            <Button size="small" type="text">
              <EditOutlined />
            </Button>
          </Link>
        );
      },
    },
  ];

  const onSearch = useCallback((value) => {
    setKeyword(value);
  }, []);

  const onChangeFloor = useCallback((f: any) => {
    setFloor(f);
  }, []);

  const onChangeWing = useCallback((w) => {
    setWing(w);
    setFloor('');
  }, []);

  const onChangePage = useCallback((p) => {
    setPage(p.current);
  }, []);

  return (
    <Flex vertical gap="middle">
      <Flex gap="large">
        <Form.Item label="건물 선택">
          <WingSelect style={{ width: 200 }} onChange={onChangeWing} />
        </Form.Item>
        <Form.Item label="층 선택">
          <FloorSelect
            wingId={wing}
            style={{ width: 200 }}
            onChange={onChangeFloor}
          />
        </Form.Item>
      </Flex>

      <Flex justify="space-between" align="center">
        <span>Total : {count}</span>
        <Search
          placeholder="검색어를 입력해주세요."
          onSearch={onSearch}
          style={{ width: 300 }}
        />
      </Flex>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: count, current: page, total }}
        scroll={{ y: 750 }}
        rowKey="id"
        onChange={onChangePage}
      />
    </Flex>
  );
}
