'use client';
import { Button, Flex, Form, Input, Modal, Select, Table } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';
import type { MapInfoItem } from '../../../interface/map-info';

const { Search } = Input;
const { Option } = Select;

export default function MapInfoList() {
  const [count, setCount] = useState(17);
  const [data, setData] = useState<MapInfoItem[]>([]);

  const columns: ColumnsType<MapInfoItem> = [
    {
      title: '번호',
      dataIndex: 'no',
      width: 80,
    },
    {
      title: '층',
      dataIndex: 'floor',
      width: 100,
    },
    {
      title: '동',
      dataIndex: 'building',
      width: 100,
    },
    {
      title: '지도명',
      dataIndex: 'name',
    },
    {
      title: '구역 수',
      dataIndex: 'areaNum',
      width: 100,
    },
    {
      title: '설정 시설 수',
      dataIndex: 'facilityNum',
      width: 140,
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
      render: (date: Date) => format(date, 'yyyy-MM-dd hh:mm:ss'),
    },
    {
      title: '최종 수정일',
      dataIndex: 'updatedAt',
      width: 180,
      render: (date: Date) => format(date, 'yyyy-MM-dd hh:mm:ss'),
    },
    {
      title: '',
      width: 80,
      render: (value: any) => {
        return (
          <Link href={`/map-info/edit/${(value as any).no}`}>
            <Button size="small" type="text">
              <EditOutlined />
            </Button>
          </Link>
        );
      },
    },
  ];

  useEffect(() => {
    const temp: MapInfoItem[] = [];
    for (let i = 0; i < 100; i++) {
      temp.push({
        key: i,
        no: i,
        building: '중앙',
        floor: '1',
        name: 'name',
        areaNum: 2,
        facilityNum: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    setData(temp);
  }, []);

  const onSearch = useCallback(() => {
    console.log('on search');
  }, []);

  return (
    <Flex vertical gap="middle">
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
        pagination={{ pageSize: 50 }}
        scroll={{ y: 750 }}
      />
    </Flex>
  );
}
