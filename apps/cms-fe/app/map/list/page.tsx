'use client';
import { Button, Flex, Form, Input, Modal, Table, message } from 'antd';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { format } from 'date-fns';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';
import type { MapItem } from '../../../interface/map';
import BuldingInfoManagementModal from '../../../component/building-info-management/building-info-management-modal';
import MapAreaEditorModal from '../../../component/map-area-editor/map-area-editor-modal';
import { deleteMap, getMaps } from '../../../api/map';
import FloorSelect from '../../../component/floor-select/floor-select';
import BuildingSelect from '../../../component/building-select/building-select';

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

  const fetchData = useCallback(
    async ({ keyword, page, count, floor, wing }) => {
      const maps = await getMaps({ keyword, page, count, floor, wing });
      setData(maps.data.data);
      setTotal(maps.data.total);
    },
    [],
  );

  useEffect(() => {
    setPage(1);
    void fetchData({ keyword, page, count, floor, wing });
  }, [keyword, page, count, floor, fetchData, wing]);

  const columns: ColumnsType<MapItem> = [
    {
      title: '번호',
      dataIndex: 'id',
      width: 80,
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
    {
      title: '미리보기',
      width: 100,
      render: () => <Button size="small">미리보기</Button>,
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
      title: '구역설정',
      width: 100,
      render: (map) => (
        <Button
          size="small"
          onClick={() => {
            setCurrentMap({ ...map });
            setIsOpenMapAreaModal(true);
          }}
        >
          설정
        </Button>
      ),
    },
    {
      title: '',
      width: 80,
      render: (value: any) => {
        return (
          <Link href={`/map/edit/${(value as any).id}`}>
            <Button size="small" type="text">
              <EditOutlined />
            </Button>
          </Link>
        );
      },
    },
  ];

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
    setWing('');
  }, []);

  const onChangeWing = useCallback((w) => {
    setWing(w);
  }, []);

  const onChangePage = useCallback((p) => {
    setPage(p.current);
  }, []);

  return (
    <>
      <Flex vertical gap="middle">
        <Flex justify="space-between">
          <Flex gap="large">
            <Form.Item label="층 선택">
              <FloorSelect style={{ width: 200 }} onChange={onChangeFloor} />
            </Form.Item>
            <Form.Item label="동 선택">
              <BuildingSelect
                floorId={floor}
                style={{ width: 200 }}
                onChange={onChangeWing}
              />
            </Form.Item>
          </Flex>
          <Button
            onClick={() => {
              setIsBuildingManagementModalOpen(true);
            }}
          >
            건물 정보 관리
          </Button>
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
            <Link href="/map/register">
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
    </>
  );
}
