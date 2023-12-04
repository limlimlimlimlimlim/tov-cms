'use client';
import { Button, Flex, Form, Input, Modal, Table, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';
import type { PostItem } from '../../../interface/post';
import WingSelect from '../../../component/wing-select/wing-select';
import { deletePost } from '../../../api/post';
import { getSchedules } from '../../../api/schedule';

const { Search } = Input;
const { confirm } = Modal;

const columns: ColumnsType<PostItem> = [
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
    title: '스케쥴명',
    width: 150,
    dataIndex: 'name',
  },
  {
    title: '상태',
    width: 150,
    dataIndex: 'status',
    render(type) {
      switch (type) {
        case 'enabled':
          return '활성';
        case 'disabled':
          return '비활성';
      }
      return '';
    },
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
        <Link href={`/schedule/edit/${(value as any).id}`}>
          <Button size="small" type="text">
            <EditOutlined />
          </Button>
        </Link>
      );
    },
  },
];

export default function ScheduleList() {
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<PostItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [wing, setWing] = useState('');
  const [page, setPage] = useState(1);
  const count = useMemo(() => 50, []);
  const [selectedData, setSelectedData] = useState<PostItem[]>([]);

  const fetchData = useCallback(async ({ keyword, page, count, wing }) => {
    const posts = await getSchedules({ keyword, page, count, wing });
    setData(posts.data.data);
    setTotal(posts.data.total);
  }, []);

  useEffect(() => {
    setPage(1);
    void fetchData({ keyword, page, count, wing });
  }, [keyword, page, count, fetchData, wing]);

  const onSearch = useCallback((value) => {
    setKeyword(value);
  }, []);

  const onClickDelete = useCallback(() => {
    confirm({
      title: '스케쥴 삭제 확인',
      okText: '확인',
      cancelText: '취소',
      content: '선택된 스케쥴을 삭제하시겠습니까?',
      async onOk() {
        await Promise.all(selectedData.map((row) => deletePost(row.id)));
        void fetchData({ keyword, page, count, wing });
        void message.success('선택된 스케쥴이 삭제됐습니다.');
      },
    });
  }, [count, fetchData, keyword, page, selectedData, wing]);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: PostItem[]) => {
      setSelectedData(selectedRows);
    },
  };

  const onChangeWing = useCallback((w) => {
    setWing(w);
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
          <Link href="/schedule/register">
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
    </Flex>
  );
}
