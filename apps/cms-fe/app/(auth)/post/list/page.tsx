'use client';
import { Button, Flex, Form, Input, Modal, Table, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { PostItem } from '../../../../interface/post';
import FloorSelect from '../../../../component/floor-select/floor-select';
import WingSelect from '../../../../component/wing-select/wing-select';
import { deletePost, getPosts } from '../../../../api/post';
import usePermission from '../../hooks/usePermission';

const { Search } = Input;
const { confirm } = Modal;

export default function PostList() {
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<PostItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [floor, setFloor] = useState('');
  const [wing, setWing] = useState('');
  const [page, setPage] = useState(1);
  const count = useMemo(() => 50, []);
  const [selectedData, setSelectedData] = useState<PostItem[]>([]);
  const { ready, getPostPermissions }: any = usePermission();
  const [writable, setWritable] = useState(false);
  const [deletable, setDeletable] = useState(false);
  const [updatable, setUpdatable] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(
    async ({ keyword, page, count, floor, wing }) => {
      const posts = await getPosts({ keyword, page, count, floor, wing });
      setData(posts.data.data);
      setTotal(posts.data.total);
    },
    [],
  );

  useEffect(() => {
    if (!ready) return;
    const result = getPostPermissions();

    if (!result.read) {
      router.replace('/error/403');
      return;
    }
    setWritable(result.write);
    setDeletable(result.delete);
    setUpdatable(result.update);
    setPage(1);
    void fetchData({ keyword, page, count, floor, wing });
  }, [
    count,
    fetchData,
    floor,
    getPostPermissions,
    keyword,
    page,
    ready,
    router,
    wing,
  ]);

  const columns = useMemo(() => {
    return [
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
            <>
              {updatable && (
                <Link href={`/post/edit/${(value as any).id}`}>
                  <Button size="small" type="text">
                    <EditOutlined />
                  </Button>
                </Link>
              )}
            </>
          );
        },
      },
    ];
  }, [updatable]);

  const onSearch = useCallback((value) => {
    setKeyword(value);
  }, []);

  const onClickDelete = useCallback(() => {
    confirm({
      title: '게시물 삭제 확인',
      okText: '확인',
      cancelText: '취소',
      content: '선택된 게시물을 삭제하시겠습니까?',
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
      <Flex gap="large">
        <Form.Item label="건물 선택">
          <WingSelect style={{ width: 200 }} onChange={onChangeWing} useAll />
        </Form.Item>
        <Form.Item label="층 선택">
          <FloorSelect
            wingId={wing}
            style={{ width: 200 }}
            onChange={onChangeFloor}
            useAll
          />
        </Form.Item>
      </Flex>
      <Flex justify="space-between">
        <Flex gap="small" align="center">
          {deletable && (
            <Button
              danger
              disabled={data.length === 0 || selectedData.length === 0}
              onClick={onClickDelete}
            >
              삭제
            </Button>
          )}

          {writable && (
            <Link href="/post/register">
              <Button type="primary">등록</Button>
            </Link>
          )}

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