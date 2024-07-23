'use client';
import { Button, Flex, Form, Input, Table } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { MapInfoItem } from '../../../../interface/map-info';
import { getMaps } from '../../../../api/map';
import FloorSelect from '../../../../component/floor-select/floor-select';
import WingSelect from '../../../../component/wing-select/wing-select';
import usePermission from '../../hooks/use-permission';
import MapPreviewerModal from '../../../../component/map-previwer-modal/map-previewer-modal';
import useSocket from '../../hooks/use-socket';

const { Search } = Input;

export default function SectionList() {
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

  const fetchData = useCallback(
    async ({ keyword, page, count, floor, wing }) => {
      const maps = await getMaps({ keyword, page, count, floor, wing });
      setData(maps.data.data);
      setTotal(maps.data.total);
    },
    [],
  );

  useEffect(() => {
    if (!ready) return;
    const result = getMapInfoPermissions();

    if (!result.read) {
      router.replace('/error/403');
      return;
    }
    setUpdatable(result.update);
    void fetchData({ keyword, page, count, floor, wing });
  }, [
    count,
    fetchData,
    floor,
    getMapInfoPermissions,
    keyword,
    page,
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
        width: 80,
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
        title: '구역 설정',
        width: 100,
        render: (value: any) => {
          return (
            <>
              {updatable && (
                <Link href={`/section/${(value as any).id}/view`}>
                  <Button size="small">설정</Button>
                </Link>
              )}
            </>
          );
        },
      },
    ];
  }, [count, page, updatable]);

  const onSearch = useCallback((value) => {
    setKeyword(value);
  }, []);

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
        <Form.Item label="건물 선택">
          <WingSelect
            style={{ width: 200 }}
            wingId={wing}
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

      <Flex justify="space-between" align="center">
        <span>Total : {count}</span>
        <Flex justify="end" gap={10}>
          <Search
            placeholder="검색어를 입력해주세요."
            onSearch={onSearch}
            style={{ width: 300 }}
          />
          <Button
            onClick={() => {
              if (socket) {
                socket.emit('sync', 'section');
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
