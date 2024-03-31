'use client';
import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Table,
  message,
  DatePicker,
} from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import FloorSelect from '../../../../component/floor-select/floor-select';
import WingSelect from '../../../../component/wing-select/wing-select';
import { deleteFacility, getFacilities } from '../../../../api/facility';
import CategoryManagementManagementModal from '../../../../component/category-management/category-management-modal';
import type { FacilityItem } from '../../../../interface/facility';
import usePermission from '../../hooks/use-permission';
import useSocket from '../../hooks/use-socket';
import useLink from '../../hooks/use-link';

const { Search } = Input;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

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
  const { ready, getFacilityPermissions }: any = usePermission();
  const [writable, setWritable] = useState(false);
  const [deletable, setDeletable] = useState(false);
  const [updatable, setUpdatable] = useState(false);
  const router = useRouter();
  const { socket } = useSocket();
  const { replace } = useLink();
  const [period, setPeriod] = useState<string[]>([]);

  const fetchData = useCallback(
    async ({ keyword, page, floor, wing, period }) => {
      const facilities = await getFacilities({
        keyword,
        page,
        count,
        floor,
        wing,
        startDate: period[0],
        endDate: period[1],
      });
      setKeyword(keyword);
      setPage(page);
      setData(facilities.data.data);
      setTotal(facilities.data.total);
    },
    [count],
  );

  useEffect(() => {
    if (!ready) return;
    const result = getFacilityPermissions();

    if (!result.read) {
      router.replace('/error/403');
      return;
    }
    setWritable(result.write);
    setDeletable(result.delete);
    setUpdatable(result.update);
    const prevKeyword = localStorage.getItem('cms_facility_search_keyword');
    void fetchData({
      keyword: prevKeyword || '',
      page: 1,
      floor,
      wing,
      period,
    });
  }, [
    count,
    fetchData,
    floor,
    getFacilityPermissions,
    period,
    ready,
    router,
    wing,
  ]);

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
            <>
              {updatable && (
                <Link
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    replace(`/facility/edit/${(value as any).id}`);
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
  }, [count, page, updatable, replace]);

  const onSearch = useCallback(
    (value) => {
      localStorage.setItem('cms_facility_search_keyword', value);
      fetchData({ keyword: value, page: 1, floor, wing, period });
    },
    [fetchData, floor, period, wing],
  );

  const onClickDelete = useCallback(() => {
    confirm({
      title: '시설 삭제 확인',
      okText: '확인',
      cancelText: '취소',
      content: '선택된 시설을 삭제하시겠습니까?',
      async onOk() {
        await Promise.all(selectedData.map((row) => deleteFacility(row.id)));
        void fetchData({ keyword, page, floor, wing, period });
        void message.success('선택된 시설이 삭제됐습니다.');
      },
    });
  }, [fetchData, floor, keyword, page, period, selectedData, wing]);

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

  const onChangePage = useCallback(
    (p) => {
      fetchData({ keyword, page: p.current, floor, wing, period });
    },
    [fetchData, floor, keyword, period, wing],
  );

  return (
    <Flex vertical gap="middle">
      <Flex justify="space-between">
        <Flex gap="large">
          <Form.Item label="전시홀 선택">
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
                replace('/facility/register');
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
                socket.emit('sync', 'facility');
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
      <CategoryManagementManagementModal
        open={isOpenCategoryManagementModal}
        onCancel={() => {
          setIsOpenCategoryManagementModal(false);
        }}
      />
    </Flex>
  );
}
