import { Flex } from 'antd';
import { useCallback } from 'react';
import FloorItem from './floor-item';

interface ComponentProps {
  data: any[];
  onChange: () => void;
  onAddFloor: (order) => void;
}

export default function FloorList({
  data,
  onChange,
  onAddFloor,
}: ComponentProps) {
  const createItems = useCallback(() => {
    return data.map((item) => {
      return (
        <FloorItem
          key={item.id}
          data={item}
          onChange={onChange}
          onAdd={onAddFloor}
        />
      );
    }, []);
  }, [data, onAddFloor, onChange]);
  return (
    <Flex vertical gap="small" style={{ width: '100%' }}>
      {createItems()}
    </Flex>
  );
}
