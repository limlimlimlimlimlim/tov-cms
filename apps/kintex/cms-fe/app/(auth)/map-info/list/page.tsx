'use client';
import { Button, Flex, Form, Input, Table, DatePicker } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { MapInfoItem } from '../../../../interface/map-info';
import { getMaps } from '../../../../api/map';
import FloorSelect from '../../../../component/floor-select/floor-select';
import WingSelect from '../../../../component/wing-select/wing-select';
import usePermission from '../../hooks/use-permission';
import MapPreviewerModal from '../../../../component/map-previwer-modal/map-previewer-modal';
import useSocket from '../../hooks/use-socket';
import useLink from '../../hooks/use-link';

const { Search } = Input;
const { RangePicker } = DatePicker;

export default function MapInfoList() {
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<MapInfoItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const count = useMemo(() => 50, []);
  const [floor, setFloor] = useState('');
  const [wing, setWing] = useState('');
  const { ready, getMapInfoPermissions }: any = usePermission();
  const [updatable, setUpdatable] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [previewMapId, setPreviewMapId] = useState();
  const router = useRouter();
  const { socket } = useSocket();
  const { replace } = useLink();
  const [period, setPeriod] = useState<string[]>([]);

  const fetchData = useCallback(
    async ({ keyword, page, floor, wing, period }) => {
      const maps = await getMaps({
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
      setData(maps.data.data);
      setTotal(maps.data.total);
    },
    [count],
  );

  useEffect(() => {
    if (!ready) return;
    const result = getMapInfoPermissions();

    if (!result.read) {
      router.replace('/error/403');
      return;
    }
    setUpdatable(result.update);
    const prevKeyword = localStorage.getItem('cms_map-info_search_keyword');
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
    getMapInfoPermissions,
    period,
    ready,
    router,
    wing,
  ]);

  const columns: ColumnsType<MapInfoItem> = useMemo(() => {
    return [
      {
        title: '번호',
        width: 80,
        render: (_, __, index) => {
          return index + 1 + (page - 1) * count;
        },
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
        render: (row) => {
          const count = row.sections.filter((s) => {
            return s.facilities.length > 0;
          }).length;
          return count;
        },
      },
      {
        title: '미리보기',
        width: 100,
        render: (data: any) => (
          <Button
            size="small"
            onClick={() => {
              setOpenPreview(true);
              setPreviewMapId(data.id);
            }}
          >
            미리보기
          </Button>
        ),
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
                    replace(`/map-info/edit/${(value as any).id}`);
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
  }, [count, page, replace, updatable]);

  const onSearch = useCallback(
    (value) => {
      localStorage.setItem('cms_map-info_search_keyword', value);
      fetchData({ keyword: value, page: 1, floor, wing, period });
    },
    [fetchData, floor, period, wing],
  );

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
        <Form.Item label="전시홀 선택">
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

      <Flex justify="space-between" align="center">
        <span>Total : {count}</span>
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
                socket.emit('sync', 'map-info');
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
        onChange={onChangePage}
      />
      <MapPreviewerModal
        open={openPreview}
        mapId={previewMapId}
        onCancel={() => {
          setOpenPreview(false);
        }}
      />
    </Flex>
  );
}
