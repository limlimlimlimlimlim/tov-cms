import { Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getFloors } from '../../api/building-info';

const { Option } = Select;

interface ComponentProps {
  style?: any;
  onChange?: (floorId) => void;
}

export default function FloorSelect({ style, onChange }: ComponentProps) {
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const floors = await getFloors();
      setFloors(floors.data);
    };
    fetchData();
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
      defaultValue=""
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
