'use client';
import { Button, Flex, Form, Input, Modal, Table, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';
import type { PostItem } from '../../../interface/post';
import FloorSelect from '../../../component/floor-select/floor-select';
import WingSelect from '../../../component/wing-select/wing-select';
import { deletePost, getPosts } from '../../../api/post';

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
    title: '시설명',
    width: 100,
    render: () => '-',
  },
  {
    title: '구분',
    width: 150,
    dataIndex: 'type',
    render(type) {
      switch (type) {
        case 'info':
          return '안내';
        case 'event':
          return '이벤트';
      }
      return '';
    },
  },
  {
    title: '게시물명',
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
        <Link href={`/post/edit/${(value as any).id}`}>
          <Button size="small" type="text">
            <EditOutlined />
          </Button>
        </Link>
      );
    },
  },
];

export default function PostList() {
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<PostItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [floor, setFloor] = useState('');
  const [wing, setWing] = useState('');
  const [page, setPage] = useState(1);
  const count = useMemo(() => 50, []);
  const [selectedData, setSelectedData] = useState<PostItem[]>([]);

  const fetchData = useCallback(
    async ({ keyword, page, count, floor, wing }) => {
      const posts = await getPosts({ keyword, page, count, floor, wing });
      setData(posts.data.data);
      setTotal(posts.data.total);
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
      title: '게시물 삭제 확인',
      okText: '확인',
      cancelText: '취소',
      content: '선택된 게시물를 삭제하시겠습니까?',
      async onOk() {
        await Promise.all(selectedData.map((row) => deletePost(row.id)));
        void fetchData({ keyword, page, count, floor, wing });
        void message.success('선택된 게시물이 삭제됐습니다.');
      },
    });
  }, [count, fetchData, floor, keyword, page, selectedData, wing]);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: PostItem[]) => {
      setSelectedData(selectedRows);
    },
  };

  const onChangeWing = useCallback((w) => {
    setWing(w);
  }, []);

  const onChangeFloor = useCallback((f: any) => {
    setFloor(f);
    setWing('');
  }, []);

  const onChangePage = useCallback((p) => {
    setPage(p.current);
  }, []);

  return (
    <Flex vertical gap="middle">
      <Flex gap="large">
        <Form.Item label="층 선택">
          <FloorSelect style={{ width: 200 }} onChange={onChangeFloor} />
        </Form.Item>
        <Form.Item label="동 선택">
          <WingSelect
            floorId={floor}
            style={{ width: 200 }}
            onChange={onChangeWing}
          />
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
          <Link href="/post/register">
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
