'use client';
import { Button, Flex, Input, Modal, Table, message, DatePicker } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { PostItem } from '../../../../interface/post';
import {
  deleteSchedule,
  getScheduleByOrder,
  getSchedules,
  updateScheduleOrder,
} from '../../../../api/schedule';
import usePermission from '../../hooks/use-permission';
import useSocket from '../../hooks/use-socket';
import useLink from '../../hooks/use-link';
import Order from '../../../../component/order/order';

const { Search } = Input;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

export default function ScheduleList() {
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<PostItem[]>([]);
  const [keyword, setKeyword] = useState('');
  // const [wing, setWing] = useState('');
  const [page, setPage] = useState(1);
  const count = useMemo(() => 50, []);
  const [selectedData, setSelectedData] = useState<PostItem[]>([]);
  const { ready, getSchedulePermissions }: any = usePermission();
  const [writable, setWritable] = useState(false);
  const [deletable, setDeletable] = useState(false);
  const [updatable, setUpdatable] = useState(false);
  const router = useRouter();
  const { socket } = useSocket();
  const { replace } = useLink();
  const [period, setPeriod] = useState<string[]>([]);

  const fetchData = useCallback(
    async ({ keyword, page, period }) => {
      const schedules = await getSchedules({
        keyword,
        page,
        count,
        startDate: period[0],
        endDate: period[1],
      });
      setKeyword(keyword);
      setData(schedules.data.data || []);
      setTotal(schedules.data.total);
      setPage(page);
    },
    [count],
  );

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
    const prevKeyword = localStorage.getItem('cms_schedule_search_keyword');
    void fetchData({
      keyword: prevKeyword || '',
      page: 1,
      period,
    });
  }, [count, fetchData, getSchedulePermissions, period, ready, router]);

  const onSearch = useCallback(
    (value) => {
      localStorage.setItem('cms_schedule_search_keyword', value);
      fetchData({
        keyword: value,
        page: 1,
        period,
      });
    },
    [fetchData, period],
  );

  const columns = useMemo(() => {
    return [
      {
        title: '번호',
        width: 80,
        render: (_, __, index) => {
          return index + 1 + (page - 1) * count;
        },
      },
      // {
      //   title: '건물명',
      //   width: 100,
      //   render: (row) => row.wing.name,
      // },
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
            <Order
              value={data.order}
              onValidate={async (value) => {
                const sameOrderShedule = await getScheduleByOrder(value);
                if (sameOrderShedule.data) {
                  const result = await new Promise<boolean>((res) => {
                    confirm({
                      title: '게시물 순서 중복',
                      okText: '확인',
                      cancelText: '취소',
                      content: `"${sameOrderShedule.data.name}"과 순서가 중복됩니다. 순서를 변경하시겠습니까?`,
                      onOk() {
                        res(true);
                      },
                      onCancel() {
                        res(false);
                      },
                    });
                  });
                  return result;
                }
                return true;
              }}
              onChange={async (order) => {
                await updateScheduleOrder(data.id, { order });
                await message.success('스케쥴 순서가 변경됐습니다.');
                await fetchData({ keyword, page, period });
              }}
            />
            // <Flex gap="small">
            //   <Button
            //     size="small"
            //     onClick={async () => {
            //       try {
            //         await incrementScheduleOrder(data.id);
            //         await fetchData({ keyword, page, period });
            //       } catch (e) {
            //         void message.warning('순서를 변경할 수 없습니다.');
            //       }
            //     }}
            //   >
            //     <CaretUpOutlined />
            //   </Button>
            //   <Button
            //     size="small"
            //     onClick={async () => {
            //       try {
            //         await decrementScheduleOrder(data.id);
            //         await fetchData({ keyword, page, period });
            //       } catch (e) {
            //         void message.warning('순서를 변경할 수 없습니다.');
            //       }
            //     }}
            //   >
            //     <CaretDownOutlined />
            //   </Button>
            // </Flex>
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
                <Link
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    replace(`/schedule/edit/${(value as any).id}`);
                  }}
                >
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
  }, [count, fetchData, keyword, page, period, replace, updatable]);

  const onClickDelete = useCallback(() => {
    confirm({
      title: '스케쥴 삭제 확인',
      okText: '확인',
      cancelText: '취소',
      content: '선택된 스케쥴을 삭제하시겠습니까?',
      async onOk() {
        await Promise.all(selectedData.map((row) => deleteSchedule(row.id)));
        await fetchData({ keyword, page, period });
        void message.success('선택된 스케쥴이 삭제됐습니다.');
      },
    });
  }, [fetchData, keyword, page, period, selectedData]);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: PostItem[]) => {
      setSelectedData(selectedRows);
    },
  };

  // const onChangeWing = useCallback((w) => {
  //   setWing(w);
  // }, []);

  const onChangePage = useCallback(
    (p) => {
      fetchData({ keyword, page: p.current, period });
    },
    [fetchData, keyword, period],
  );

  return (
    <Flex vertical gap="middle">
      {/* <Flex gap="large">
        <Form.Item label="전시홀 선택">
          <WingSelect
            wingId={wing}
            style={{ width: 200 }}
            onChange={onChangeWing}
          />
        </Form.Item>
      </Flex> */}
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
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                replace('/schedule/register');
              }}
            >
              <Button type="primary">등록</Button>
            </Link>
          )}

          <span>Total : {total}</span>
        </Flex>
        <Flex gap="small">
          <RangePicker
            onChange={(_, p) => {
              setPeriod(p);
            }}
          />
          <Search
            placeholder="검색어를 입력해주세요."
            value={keyword}
            onSearch={onSearch}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            style={{ width: 300 }}
            allowClear
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
