import { Button, Drawer, Flex, Table } from 'antd';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Search from 'antd/es/input/Search';
import { CheckOutlined } from '@ant-design/icons';
import { getFacilities } from '../../../../api/facility';
import { SectionContext } from './section-context';

// eslint-disable-next-line @typescript-eslint/naming-convention
interface Props {
  onClose: () => void;
  open: boolean;
}

const FacilityContainer = ({ onClose, open }: Props) => {
  const { mapData }: any = useContext(SectionContext);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const count = useMemo(() => 50, []);

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

  const columns = useMemo(() => {
    return [
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
        dataIndex: 'status',
        render: (data) => (data === 'enabled' ? <CheckOutlined /> : null),
      },
    ];
  }, []);

  const onSearch = useCallback((value) => {
    setKeyword(value);
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

  const onChangePage = useCallback((p) => {
    setPage(p.current);
  }, []);

  return (
    <Drawer
      title="시설 목록"
      placement="right"
      width={600}
      onClose={onClose}
      open={open}
    >
      {mapData && (
        <Flex vertical gap="large">
          <Flex justify="space-between">
            <Flex gap="small">
              <Flex gap="small">
                <span>{mapData.wing.name}</span>
                <span>{mapData.floor.name}</span>
              </Flex>

              <span>Total : {total}</span>
            </Flex>
            <Button size="small">신규등록</Button>
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
