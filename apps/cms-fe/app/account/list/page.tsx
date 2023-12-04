'use client';
import { Button, Flex, Input, Modal, Table, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';
import type { AccountItem } from '../../../interface/account';

const { Search } = Input;
const { confirm } = Modal;

const columns: ColumnsType<AccountItem> = [
  {
    title: '번호',
    dataIndex: 'no',
    width: 80,
  },
  {
    title: '이름',
    dataIndex: 'name',
  },
  {
    title: '아이디',
    dataIndex: 'id',
    width: 150,
  },
  {
    title: '권한',
    width: 150,
    dataIndex: 'permission',
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
  const [count] = useState(17);
  const [data, setData] = useState<AccountItem[]>([]);
  const [selectedData, setSelectedData] = useState<AccountItem[]>([]);

  useEffect(() => {
    const temp: AccountItem[] = [];
    for (let i = 0; i < 100; i++) {
      temp.push({
        key: i,
        no: i,
        name: `Edward King ${i}`,
        id: `id-${i}`,
        permission: `admin`,
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
      title: '계정 삭제 확인',
      okText: '확인',
      cancelText: '취소',
      content: '선택된 계정을 삭제하시겠습니까?',
      onOk() {
        void message.success('선택된 계정이 삭제됐습니다.');
      },
    });
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: AccountItem[]) => {
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
          type: 'checkbox',
          ...rowSelection,
        }}
      />
    </Flex>
  );
}
