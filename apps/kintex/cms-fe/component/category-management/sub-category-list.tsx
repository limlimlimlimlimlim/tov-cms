import { Flex } from 'antd';
import { useCallback } from 'react';
import SubCategoryItem from './sub-category-item';

interface ComponentProps {
  data: any[];
  onChange: () => void;
  onAddItem: () => void;
}

export default function SubCategoryList({
  data,
  onChange,
  onAddItem,
}: ComponentProps) {
  const createItems = useCallback(() => {
    return data.map((item) => {
      return (
        <SubCategoryItem
          key={item.id}
          data={item}
          onChange={onChange}
          onAdd={onAddItem}
        />
      );
    }, []);
  }, [data, onAddItem, onChange]);
  return (
    <Flex vertical gap="small" style={{ width: '100%' }}>
      {createItems()}
    </Flex>
  );
}
