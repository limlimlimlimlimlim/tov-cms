import { Button, Drawer, Flex, Table, message } from 'antd';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Search from 'antd/es/input/Search';
import { CheckOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { getFacilities, updateFacility } from '../../../../api/facility';
import { SectionContext } from './section-context';

const FacilityContainer = () => {
  const {
    mapData,
    addFacilityTargetSection,
    isOpenFacilityContainer,
    closeFacilityContainer,
  }: any = useContext(SectionContext);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const count = useMemo(() => 50, []);
  const router = useRouter();

  const fetchData = useCallback(
    async ({ keyword, page, count, floor, wing }) => {
      const facilities = await getFacilities({
        keyword,
        page,
        count,
        floor,
        wing,
      });
      setData(facilities.data.data);
      setTotal(facilities.data.total);
    },
    [],
  );

  const addFacilityToSection = useCallback(
    async (facilityId) => {
      if (!addFacilityTargetSection) return;
      await updateFacility(facilityId, { sectionId: addFacilityTargetSection });
      closeFacilityContainer();
      message.success('시설이 설정 됐습니다.');
      router.replace(`/section/${mapData.id}/view?t=${Date.now()}`);
    },
    [addFacilityTargetSection, closeFacilityContainer, mapData, router],
  );

  const columns = useMemo(() => {
    const columns = [
      {
        title: '건물명',
        width: 100,
        dataIndex: ['wing', 'name'],
        sorter: true,
      },
      {
        title: '구분상세',
        width: 100,
        dataIndex: ['subCategory', 'name'],
        sorter: true,
      },
      {
        title: '시설명',
        width: 250,
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: '위치',
        width: 80,
        render: (data) => (data.section ? <CheckOutlined /> : null),
      },
      {
        title: '수정',
        width: 80,
        render: (data) => {
          return (
            <Button size="small" onClick={() => {}}>
              수정
            </Button>
          );
        },
      },
    ];

    if (addFacilityTargetSection) {
      columns.push({
        title: '선택',
        width: 80,
        render: (data) => {
          return (
            <Button
              size="small"
              onClick={() => {
                addFacilityToSection(data.id);
              }}
            >
              선택
            </Button>
          );
        },
      });
    }

    return columns;
  }, [addFacilityTargetSection, addFacilityToSection]);

  const onSearch = useCallback((value) => {
    setKeyword(value);
  }, []);

  const onChangePage = useCallback((p) => {
    setPage(p.current);
  }, []);

  useEffect(() => {
    if (!mapData) return;
    fetchData({
      keyword,
      page,
      count,
      floor: mapData.floor.id,
      wing: mapData.wing.id,
    });
  }, [count, fetchData, keyword, mapData, page]);

  useEffect(() => {
    if (!isOpenFacilityContainer) return;
    fetchData({
      keyword,
      page,
      count,
      floor: mapData.floor.id,
      wing: mapData.wing.id,
    });
  }, [count, fetchData, isOpenFacilityContainer, keyword, mapData, page]);

  return (
    <Drawer
      title="시설 목록"
      placement="right"
      width={800}
      onClose={closeFacilityContainer}
      open={isOpenFacilityContainer}
    >
      {mapData && (
        <Flex vertical gap="large">
          <Flex justify="space-between">
            <Flex gap="small" style={{ lineHeight: 3 }}>
              <Flex gap="small">
                <span>{mapData.wing.name}</span>
                <span>{mapData.floor.name}</span>
              </Flex>

              <span>Total : {total}</span>
            </Flex>
            <Button>신규등록</Button>
          </Flex>
          <Search placeholder="검색어를 입력해주세요." onSearch={onSearch} />

          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: count, current: page, total }}
            scroll={{ y: 650 }}
            rowKey="id"
            size="small"
            onChange={onChangePage}
          />
        </Flex>
      )}
    </Drawer>
  );
};

export default FacilityContainer;
