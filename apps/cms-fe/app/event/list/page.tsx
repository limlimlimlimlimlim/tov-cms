'use client';
import { Button, Flex, Input, Modal, Table, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';
import type { EventItem } from '../../../interface/event';

const { Search } = Input;
const { confirm } = Modal;

const columns: ColumnsType<EventItem> = [
  {
    title: '번호',
    dataIndex: 'no',
    width: 80,
  },
  {
    title: '제목',
    dataIndex: 'title',
  },
  {
    title: '상태',
    dataIndex: 'status',
    width: 80,
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
        <Link href={`/event/edit/${(value as any).no}`}>
          <Button size="small" type="text">
            <EditOutlined />
          </Button>
        </Link>
      );
    },
  },
];

export default function EventList() {
  const [count] = useState(17);
  const [data, setData] = useState<EventItem[]>([]);
  const [selectedData, setSelectedData] = useState<EventItem[]>([]);

  useEffect(() => {
    const temp: EventItem[] = [];
    for (let i = 0; i < 100; i++) {
      temp.push({
        key: i,
        no: i,
        title: `제목 ${i}`,
        status: 'normal',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    setData(temp);
  }, []);

  const onSearch = useCallback(() => {
    console.log('on search');
  }, []);

  const onClickDelete = useCallback(() => {
    confirm({
      title: '이벤트 삭제 확인',
      okText: '확인',
      cancelText: '취소',
      content: '선택된 이벤트를 삭제하시겠습니까?',
      onOk() {
        void message.success('선택된 이벤트가 삭제됐습니다.');
      },
    });
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: EventItem[]) => {
      setSelectedData(selectedRows);
    },
  };

  return (
    <Flex vertical gap="middle">
      <Flex justify="space-between">
        <Flex gap="small" align="center">
          <Button
            danger
            disabled={data.length === 0 || selectedData.length === 0}
            onClick={onClickDelete}
          >
            삭제
          </Button>
          <Link href="/event/register">
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
          type: 'checkbox',
          ...rowSelection,
        }}
      />
    </Flex>
  );
}
