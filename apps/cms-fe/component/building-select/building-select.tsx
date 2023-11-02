import { Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getWingsInFloor } from '../../api/building-info';

const { Option } = Select;

interface ComponentProps {
  floorId;
  wingId?;
  style?;
  onChange?: (wingId) => void;
}

export default function BuildingSelect({
  floorId,
  wingId,
  style,
  onChange,
}: ComponentProps) {
  const [wings, setWings] = useState([]);

  useEffect(() => {
    if (floorId) {
      void fetchData(floorId);
    } else {
      setWings([]);
      if (onChange) onChange('');
    }
  }, [floorId, onChange]);

  const fetchData = async (id) => {
    const wingsInFloor = await getWingsInFloor(id);
    setWings(wingsInFloor.data);
  };

  const createOptions = useCallback(() => {
    return wings.map((building: any) => (
      <Option key={building.id} value={building.id}>
        {building.name}
      </Option>
    ));
  }, [wings]);
  return (
    <Select
      style={style}
      value={wingId}
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
