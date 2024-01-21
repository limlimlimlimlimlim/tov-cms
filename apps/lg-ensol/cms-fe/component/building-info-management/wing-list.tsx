import { Button, Flex, Form, Input, Modal } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createWing, getBuildingInfoTree } from '../../api/building-info';
import WingItem from './wing-item';

const { confirm } = Modal;

export default function WingList() {
  const [buildingData, setBuildingData] = useState([]);
  const newItemNameKr = useRef('');

  const fetchData = useCallback(async () => {
    const result = await getBuildingInfoTree();
    setBuildingData(result.data);
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const onAddItem = useCallback(() => {
    confirm({
      title: '건물 추가',
      okText: '확인',
      cancelText: '취소',
      content: (
        <Flex vertical gap="large">
          <span>정보를 입력해주세요.</span>
          <Form.Item label="이름" style={{ marginBottom: 0 }}>
            <Input
              onChange={(e) => {
                newItemNameKr.current = e.target.value;
              }}
            />
          </Form.Item>
        </Flex>
      ),
      async onOk() {
        await createWing({ name: newItemNameKr.current });
        await fetchData();
      },
    });
  }, [fetchData, newItemNameKr]);

  const createItems = useCallback(() => {
    return buildingData.map((item: any) => {
      return (
        <WingItem
          key={item.id}
          id={item.id}
          name={item.name}
          floors={item.floors}
          onChange={() => {
            void fetchData();
          }}
        />
      );
    }, []);
  }, [buildingData, fetchData]);
  return (
    <Flex vertical gap="small" style={{ width: '100%' }}>
      <Button onClick={onAddItem} style={{ width: 80 }}>
        건물추가
      </Button>
      {createItems()}
    </Flex>
  );
}
