import { Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getFloorsInWing } from '../../api/building-info';

const { Option } = Select;

interface ComponentProps {
  wingId: string;
  floorId?: string;
  useAll?: boolean;
  style?: any;
  onChange?: (floorId) => void;
}

export default function FloorSelect({
  wingId,
  floorId = '',
  useAll = false,
  style,
  onChange,
}: ComponentProps) {
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    if (!wingId) return;

    const fetchData = async (wingId) => {
      const floors = await getFloorsInWing(wingId);
      setFloors(floors.data);
    };

    void fetchData(wingId);
  }, [wingId]);

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
      {useAll && (
        <Option key="all" value="">
          전체
        </Option>
      )}

      {createOptions()}
    </Select>
  );
}
