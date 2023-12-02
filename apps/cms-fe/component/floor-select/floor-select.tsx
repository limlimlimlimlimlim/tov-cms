import { Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getFloors } from '../../api/building-info';

const { Option } = Select;

interface ComponentProps {
  floorId?: string;
  style?: any;
  onChange?: (floorId) => void;
}

export default function FloorSelect({
  floorId = '',
  style,
  onChange,
}: ComponentProps) {
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const floors = await getFloors();
      setFloors(floors.data);
    };
    void fetchData();
  }, []);

  const createOptions = useCallback(() => {
    return floors.map((floor: any) => (
      <Option key={floor.id} value={floor.id}>
        {floor.name}
      </Option>
    ));
  }, [floors]);
  return (
    <Select
      style={style}
      value={floorId}
      onChange={(value) => {
        if (!onChange) return;
        onChange(value);
      }}
    >
      <Option key="all" value="">
        전체
      </Option>
      {createOptions()}
    </Select>
  );
}
