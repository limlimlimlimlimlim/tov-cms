'use client';
import { Button, Flex, Form, Input, Modal, Table, message } from 'antd';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { format } from 'date-fns';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { MapItem } from '../../../../interface/map';
import BuldingInfoManagementModal from '../../../../component/building-info-management/building-info-management-modal';
import MapAreaEditorModal from '../../../../component/map-area-editor/map-area-editor-modal';
import { deleteMap, getMaps } from '../../../../api/map';
import FloorSelect from '../../../../component/floor-select/floor-select';
import WingSelect from '../../../../component/wing-select/wing-select';
import usePermission from '../../hooks/use-permission';
import MapPreviewerModal from '../../../../component/map-previwer-modal/map-previewer-modal';
import useSocket from '../../hooks/use-socket';

const { Search } = Input;
const { confirm } = Modal;

export default function MapList() {
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<MapItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const count = useMemo(() => 50, []);
  const [selectedData, setSelectedData] = useState<MapItem[]>([]);
  const [floor, setFloor] = useState('');
  const [wing, setWing] = useState('');
  const [isBuildingManagementModalOpen, setIsBuildingManagementModalOpen] =
    useState(false);
  const [isOpenMapAreaModal, setIsOpenMapAreaModal] = useState(false);
  const [currentMap, setCurrentMap] = useState(null);
  const { ready, getMapPermissions }: any = usePermission();
  const [writable, setWritable] = useState(false);
  const [deletable, setDeletable] = useState(false);
  const [updatable, setUpdatable] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [previewMapId, setPreviewMapId] = useState();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
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
    const userName = localStorage.getItem('cms-user-name');
    if (userName && userName.toLowerCase() === 'superadmin') {
      setIsSuperAdmin(true);
      return;
    }
    setIsSuperAdmin(false);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const result = getMapPermissions();

    if (!result.read) {
      router.replace('/error/403');
      return;
    }
    setWritable(result.write);
    setDeletable(result.delete);
    setUpdatable(result.update);
    void fetchData({ keyword, page, count, floor, wing });
  }, [
    count,
    fetchData,
    floor,
    getMapPermissions,
    keyword,
    page,
    ready,
    router,
    wing,
  ]);

  const columns: ColumnsType<MapItem> = useMemo(() => {
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
        title: '상태',
        dataIndex: 'isUse',
        width: 100,
        render: (isUse) => (isUse ? '사용' : '미사용'),
      },
      // {
      //   title: '미리보기',
      //   width: 100,
      //   render: (data: any) => (
      //     <Button
      //       size="small"
      //       onClick={() => {
      //         setOpenPreview(true);
      //         setPreviewMapId(data.id);
      //       }}
      //     >
      //       미리보기
      //     </Button>
      //   ),
      // },
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
      // {
      //   title: '구역설정',
      //   width: 100,
      //   render: (map) => (
      //     <>
      //       {updatable && (
      //         <Button
      //           size="small"
      //           onClick={() => {
      //             setCurrentMap({ ...map });
      //             setIsOpenMapAreaModal(true);
      //           }}
      //         >
      //           설정
      //         </Button>
      //       )}
      //     </>
      //   ),
      // },
      {
        title: '',
        width: 80,
        render: (value: any) => {
          return (
            <>
              {updatable && (
                <Link href={`/map/edit/${(value as any).id}`}>
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
  }, [count, page, updatable]);

  const onSearch = useCallback((value) => {
    setKeyword(value);
  }, []);

  const onClickDelete = useCallback(() => {
    confirm({
      title: '지도 삭제 확인',
      okText: '확인',
      cancelText: '취소',
      content: '선택된 지도를 삭제하시겠습니까?',
      async onOk() {
        await Promise.all(selectedData.map((row) => deleteMap(row.id)));
        void fetchData({ keyword, page, count, floor, wing });
        void message.success('선택된 지도가 삭제됐습니다.');
      },
    });
  }, [selectedData, fetchData, keyword, page, count, floor, wing]);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: MapItem[]) => {
      setSelectedData(selectedRows);
    },
  };

  const onOkMapAreaModal = useCallback(() => {
    setIsOpenMapAreaModal(false);
    setCurrentMap(null);
  }, []);

  const onCancelMapAreaModal = useCallback(() => {
    setIsOpenMapAreaModal(false);
    setCurrentMap(null);
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
    <>
      <Flex vertical gap="middle">
        <Flex justify="space-between">
          <Flex gap="large">
            <Form.Item label="건물 선택">
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
          {isSuperAdmin && (
            <Button
              onClick={() => {
                setIsBuildingManagementModalOpen(true);
              }}
            >
              건물 정보 관리
            </Button>
          )}
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
              <Link href="/map/register">
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
                  socket.emit('sync', 'map');
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
      <BuldingInfoManagementModal
        open={isBuildingManagementModalOpen}
        onCancel={() => {
          setIsBuildingManagementModalOpen(false);
        }}
      />
      <MapAreaEditorModal
        map={currentMap}
        open={isOpenMapAreaModal}
        onOk={onOkMapAreaModal}
        onCancel={onCancelMapAreaModal}
      />
      <MapPreviewerModal
        open={openPreview}
        mapId={previewMapId}
        onCancel={() => {
          setOpenPreview(false);
        }}
      />
    </>
  );
}
