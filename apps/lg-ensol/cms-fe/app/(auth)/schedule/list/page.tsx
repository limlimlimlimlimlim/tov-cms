'use client';
import { Button, Flex, Form, Input, Modal, Select, Table, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { PostItem } from '../../../../interface/post';
import {
  decrementScheduleOrder,
  deleteSchedule,
  getSchedules,
  incrementScheduleOrder,
} from '../../../../api/schedule';
import usePermission from '../../hooks/use-permission';
import { scheduleWingCodes } from '../data';
import useSocket from '../../hooks/use-socket';

const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;

export default function ScheduleList() {
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<PostItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [wingCode, setWingCode] = useState('');

  const [page, setPage] = useState(1);
  const count = useMemo(() => 50, []);
  const [selectedData, setSelectedData] = useState<PostItem[]>([]);
  const { ready, getSchedulePermissions }: any = usePermission();
  const [writable, setWritable] = useState(false);
  const [deletable, setDeletable] = useState(false);
  const [updatable, setUpdatable] = useState(false);
  const router = useRouter();
  const { socket } = useSocket();

  const fetchData = useCallback(async ({ keyword, page, count, wingCode }) => {
    const posts = await getSchedules({ keyword, page, count, wingCode });
    setData(posts.data.data || []);
    setTotal(posts.data.total);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const result = getSchedulePermissions();

    if (!result.read) {
      router.replace('/error/403');
      return;
    }
    setWritable(result.write);
    setDeletable(result.delete);
    setUpdatable(result.update);
    setPage(1);
    void fetchData({ keyword, page, count, wingCode });
  }, [
    count,
    fetchData,
    getSchedulePermissions,
    keyword,
    page,
    ready,
    router,
    wingCode,
  ]);

  const onSearch = useCallback((value) => {
    setKeyword(value);
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: '번호',
        width: 80,
        render: (_, __, index) => {
          return index + 1 + (page - 1) * count;
        },
      },
      {
        title: '건물명',
        width: 180,
        render: (row) => {
          if (!row.wingCodes) return '';
          return row.wingCodes
            .split(',')
            .map((code) => {
              const sameCode = scheduleWingCodes.find((c) => c.code === code);
              return sameCode ? sameCode.label : '';
            })
            .join();
        },
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
        title: '순서변경',
        width: 150,
        render(data) {
          return (
            <Flex gap="small">
              <Button
                size="small"
                onClick={async () => {
                  try {
                    await incrementScheduleOrder(data.id);
                    await fetchData({ keyword, page, count, wingCode });
                  } catch (e) {
                    void message.warning('순서를 변경할 수 없습니다.');
                  }
                }}
              >
                <CaretUpOutlined />
              </Button>
              <Button
                size="small"
                onClick={async () => {
                  try {
                    await decrementScheduleOrder(data.id);
                    await fetchData({ keyword, page, count, wingCode });
                  } catch (e) {
                    void message.warning('순서를 변경할 수 없습니다.');
                  }
                }}
              >
                <CaretDownOutlined />
              </Button>
            </Flex>
          );
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
                <Link href={`/schedule/edit/${(value as any).id}`}>
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
  }, [count, fetchData, keyword, page, updatable, wingCode]);

  const onClickDelete = useCallback(() => {
    confirm({
      title: '스케쥴 삭제 확인',
      okText: '확인',
      cancelText: '취소',
      content: '선택된 스케쥴을 삭제하시겠습니까?',
      async onOk() {
        await Promise.all(selectedData.map((row) => deleteSchedule(row.id)));
        void fetchData({ keyword, page, count, wingCode });
        void message.success('선택된 스케쥴이 삭제됐습니다.');
      },
    });
  }, [count, fetchData, keyword, page, selectedData, wingCode]);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: PostItem[]) => {
      setSelectedData(selectedRows);
    },
  };

  const onChangeWingCode = useCallback((w) => {
    setWingCode(w);
  }, []);

  const onChangePage = useCallback((p) => {
    setPage(p.current);
  }, []);

  const createWingOptions = useCallback(() => {
    return [
      {
        code: '',
        label: '전체',
      },
      ...scheduleWingCodes,
    ].map((code) => {
      return (
        <Option key={code.code} value={code.code}>
          {code.label}
        </Option>
      );
    });
  }, []);

  return (
    <Flex vertical gap="middle">
      <Flex gap="large">
        <Form.Item label="건물 선택">
          <Select
            style={{ width: 200 }}
            onChange={onChangeWingCode}
            value={wingCode}
          >
            {createWingOptions()}
          </Select>
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
            <Link href="/schedule/register">
              <Button type="primary">등록</Button>
            </Link>
          )}

          <span>Total : {total}</span>
        </Flex>
        <Flex justify="end" gap={10}>
          <Search
            placeholder="검색어를 입력해주세요."
            onSearch={onSearch}
            style={{ width: 300 }}
          />
          <Button
            onClick={() => {
              if (socket) {
                socket.emit('sync', 'schedule');
              }
            }}
          >
            동기화
          </Button>
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
